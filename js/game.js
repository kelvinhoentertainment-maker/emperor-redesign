/** Phase 1a game state & rules */

import {
  ALL_OFFICES,
  MONTH_NAMES,
  XUN_NAMES,
  generateOpeningPersonnel,
  checkFitness,
  vacancyHookFor,
} from './data.js';

export const SAVE_KEY = 'emperor_redesign_1a_slot0';
export const SAVE_VERSION = 1;

const APPOINT_STAMINA = 2;
const DISMISS_STAMINA = 1;

export function createNewGame() {
  const { officials, offices } = generateOpeningPersonnel();
  return {
    saveVersion: SAVE_VERSION,
    phaseTag: '1a',
    eraName: '永興',
    year: 1,
    month: 1,
    xun: 1,
    actionsPerXun: 2,
    actionsRemaining: 2,
    body: {
      stamina: 10,
      staminaMax: 10,
      happiness: 7,
      happinessMax: 10,
      health: 8,
      healthMax: 10,
      lifespan: 36,
    },
    realm: {
      money: 5000,
      grain: 3000,
      population: 10000,
      troops: 2000,
      prestige: 50,
    },
    province: {
      id: 'province_demo',
      name: '北直隸',
    },
    offices,
    officials,
    libuActionThisXun: false,
    log: ['開局：齊人就任，宣政殿議事。'],
    gameOver: false,
    gameOverReason: null,
  };
}

export function formatDate(state) {
  const eraYear = state.year === 1 ? '元' : String(state.year);
  return `${state.eraName}${eraYear}年 · ${MONTH_NAMES[state.month]} · ${XUN_NAMES[state.xun]}`;
}

export function getOfficial(state, id) {
  return state.officials.find((o) => o.id === id) || null;
}

export function getPool(state) {
  return state.officials.filter((o) => o.status === 'pool' || o.status === 'dismissed');
}

export function getOffice(state, officeId) {
  return state.offices[officeId] || null;
}

function pushLog(state, msg) {
  state.log = [msg, ...(state.log || [])].slice(0, 30);
}

export function canDismiss(state, officeId) {
  const office = state.offices[officeId];
  if (!office) return { ok: false, reason: '無此職缺' };
  if (office.interactMode !== 'interactive') return { ok: false, reason: '本切片唔開放此職人事' };
  if (office.status !== 'filled') return { ok: false, reason: '此位已空' };
  if (state.actionsRemaining < 1) return { ok: false, reason: '本旬行動已盡' };
  if (state.body.stamina < DISMISS_STAMINA) return { ok: false, reason: '體力不足' };
  if (state.gameOver) return { ok: false, reason: '已駕崩' };
  return { ok: true };
}

export function canAppoint(state, officeId, officialId) {
  const office = state.offices[officeId];
  if (!office) return { ok: false, reason: '無此職缺' };
  if (office.interactMode !== 'interactive') return { ok: false, reason: '本切片唔開放此職人事' };
  if (office.status !== 'vacant') return { ok: false, reason: '此位已有人，須先罷免' };
  if (state.actionsRemaining < 1) return { ok: false, reason: '本旬行動已盡' };
  if (state.body.stamina < APPOINT_STAMINA) return { ok: false, reason: '體力不足' };
  if (state.gameOver) return { ok: false, reason: '已駕崩' };
  const off = getOfficial(state, officialId);
  if (!off) return { ok: false, reason: '無此官員' };
  if (off.status !== 'pool' && off.status !== 'dismissed') {
    return { ok: false, reason: '該官已在任其他職' };
  }
  if (off.officeId) return { ok: false, reason: '該官已在任其他職' };
  return { ok: true };
}

export function fitnessWarn(state, officeId, officialId) {
  const office = state.offices[officeId];
  const off = getOfficial(state, officialId);
  if (!office || !off) return { ok: true };
  return checkFitness(office, off);
}

export function dismiss(state, officeId) {
  const gate = canDismiss(state, officeId);
  if (!gate.ok) return { ok: false, reason: gate.reason };

  const office = state.offices[officeId];
  const off = getOfficial(state, office.officialId);
  if (!off) return { ok: false, reason: '官員資料異常' };

  office.status = 'vacant';
  office.officialId = null;
  const hook = vacancyHookFor(officeId);
  if (hook) {
    office.vacancyHookId = hook.hookId;
    office.vacancyCopy = hook.copy;
  } else {
    office.vacancyHookId = null;
    office.vacancyCopy = '職缺空懸';
  }

  off.status = 'pool';
  off.officeId = null;

  state.body.stamina -= DISMISS_STAMINA;
  state.actionsRemaining -= 1;
  state.libuActionThisXun = true;
  pushLog(state, `罷免〔${off.name}〕· ${office.name}`);
  return { ok: true };
}

export function appoint(state, officeId, officialId) {
  const gate = canAppoint(state, officeId, officialId);
  if (!gate.ok) return { ok: false, reason: gate.reason };

  const office = state.offices[officeId];
  const off = getOfficial(state, officialId);

  office.status = 'filled';
  office.officialId = off.id;
  office.vacancyHookId = null;
  office.vacancyCopy = null;

  off.status = 'appointed';
  off.officeId = officeId;

  state.body.stamina -= APPOINT_STAMINA;
  state.actionsRemaining -= 1;
  state.libuActionThisXun = true;
  pushLog(state, `任命〔${off.name}〕為〔${office.name}〕`);
  return { ok: true };
}

export function endXun(state) {
  if (state.gameOver) return { ok: false, reason: '已駕崩' };

  // 1. lifespan
  state.body.lifespan -= 1;

  // 2. stamina regen only if no successful appoint/dismiss
  if (!state.libuActionThisXun) {
    state.body.stamina = Math.min(state.body.staminaMax, state.body.stamina + 1);
  }

  // 3. happiness/health unchanged (placeholder)

  // 4. death check
  if (state.body.lifespan <= 0 || state.body.health <= 0) {
    state.gameOver = true;
    state.gameOverReason =
      state.body.lifespan <= 0 ? '壽盡駕崩' : '健康歸零駕崩';
    pushLog(state, `結局：${state.gameOverReason}`);
    return { ok: true, gameOver: true };
  }

  // 5. advance time
  state.xun += 1;
  if (state.xun > 3) {
    state.xun = 1;
    state.month += 1;
    if (state.month > 12) {
      state.month = 1;
      state.year += 1;
    }
  }

  // 6. reset actions
  state.actionsRemaining = state.actionsPerXun;
  state.libuActionThisXun = false;
  pushLog(state, `進入${formatDate(state)}`);
  return { ok: true, gameOver: false };
}

export function serialize(state) {
  return JSON.stringify({
    saveVersion: SAVE_VERSION,
    phaseTag: state.phaseTag,
    eraName: state.eraName,
    year: state.year,
    month: state.month,
    xun: state.xun,
    actionsPerXun: state.actionsPerXun,
    actionsRemaining: state.actionsRemaining,
    body: { ...state.body },
    realm: { ...state.realm },
    province: { ...state.province },
    offices: structuredClone(state.offices),
    officials: structuredClone(state.officials),
    libuActionThisXun: state.libuActionThisXun,
    log: [...(state.log || [])],
    gameOver: state.gameOver,
    gameOverReason: state.gameOverReason,
  }, null, 2);
}

export function deserialize(json) {
  let raw;
  try {
    raw = typeof json === 'string' ? JSON.parse(json) : json;
  } catch {
    return { ok: false, reason: '存檔格式無法解析' };
  }
  if (!raw || raw.saveVersion !== SAVE_VERSION) {
    return { ok: false, reason: '存檔版本不符（需要 saveVersion=1）' };
  }
  if (raw.phaseTag && raw.phaseTag !== '1a') {
    return { ok: false, reason: '非 Phase 1a 存檔' };
  }
  // Validate offices exist
  for (const def of ALL_OFFICES) {
    if (!raw.offices || !raw.offices[def.officeId]) {
      return { ok: false, reason: `存檔缺職缺 ${def.officeId}` };
    }
  }
  if (!Array.isArray(raw.officials) || raw.officials.length < 21) {
    return { ok: false, reason: '官員資料不完整' };
  }
  // Enrich office display fields from current defs (names / desc / place)
  const offices = structuredClone(raw.offices);
  for (const def of ALL_OFFICES) {
    const o = offices[def.officeId];
    if (!o) continue;
    o.name = def.name;
    o.desc = def.desc || '';
    o.place = def.place || null;
    o.rank = def.rank;
    o.interactMode = def.interactMode;
    o.kind = def.kind;
  }
  const province = { ...raw.province, name: '北直隸', id: raw.province?.id || 'province_demo' };

  return {
    ok: true,
    state: {
      saveVersion: SAVE_VERSION,
      phaseTag: '1a',
      eraName: raw.eraName || '永興',
      year: raw.year,
      month: raw.month,
      xun: raw.xun,
      actionsPerXun: raw.actionsPerXun ?? 2,
      actionsRemaining: raw.actionsRemaining,
      body: { ...raw.body },
      realm: { ...raw.realm },
      province,
      offices,
      officials: structuredClone(raw.officials),
      libuActionThisXun: !!raw.libuActionThisXun,
      log: Array.isArray(raw.log) ? raw.log : [],
      gameOver: !!raw.gameOver,
      gameOverReason: raw.gameOverReason || null,
    },
  };
}

export function saveToLocalStorage(state) {
  try {
    localStorage.setItem(SAVE_KEY, serialize(state));
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: '無法寫入本機存檔' };
  }
}

export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ok: false, reason: '尚無本機存檔' };
    return deserialize(raw);
  } catch {
    return { ok: false, reason: '讀檔失敗' };
  }
}

export function downloadSave(state) {
  const blob = new Blob([serialize(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `emperor-1a-${state.year}-${state.month}-${state.xun}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export { APPOINT_STAMINA, DISMISS_STAMINA };
