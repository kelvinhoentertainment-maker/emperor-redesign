/** Phase 1a static definitions — offices, hooks, name pools */

export const MONTH_NAMES = [
  '', '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];
export const XUN_NAMES = ['', '上旬', '中旬', '下旬'];

export const SPECIALTY_LABEL = {
  civil: '民政',
  fiscal: '財賦',
  military: '軍務',
  legal: '刑名',
  none: '無',
};

export const VACANCY_HOOKS = {
  prov_demo_buzheng: {
    hookId: 'hook_tax_vacant_buzheng',
    copy: '省實收 ×0.6；省賑困難',
  },
  prov_demo_duzhihui: {
    hookId: 'hook_war_vacant_duzhihui',
    copy: '不可主動出征；防守戰力打折',
  },
  central_hu_shangshu: {
    hookId: 'hook_tax_national_hu',
    copy: '全國稅收係數打折（預留）',
  },
  central_bing_shangshu: {
    hookId: 'hook_war_national_bing',
    copy: '全國軍務係數打折（預留）',
  },
  central_li_shangshu: {
    hookId: 'hook_personnel_li',
    copy: '吏部無人 → 戶／兵後續打折（預留）',
  },
};

export const CENTRAL_OFFICES = [
  { officeId: 'central_li_shangshu', name: '吏部尚書', rank: '正二品', interactMode: 'interactive', kind: 'shangshu',
    desc: '掌全國官員任免、考課總綱；本切片可任命／罷免。' },
  { officeId: 'central_li_shilang', name: '吏部侍郎', rank: '正三品', interactMode: 'interactive', kind: 'shilang',
    desc: '佐尚書處理銓選、調動；本切片可任命／罷免。' },
  { officeId: 'central_hu_shangshu', name: '戶部尚書', rank: '正二品', interactMode: 'interactive', kind: 'shangshu',
    desc: '掌全國錢糧稅賦總綱；本切片只人事，唔跑稅收結算。' },
  { officeId: 'central_hu_shilang', name: '戶部侍郎', rank: '正三品', interactMode: 'interactive', kind: 'shilang',
    desc: '佐尚書理財政；本切片只人事。' },
  { officeId: 'central_bing_shangshu', name: '兵部尚書', rank: '正二品', interactMode: 'interactive', kind: 'shangshu',
    desc: '掌全國軍政武選總綱；本切片只人事，唔跑募兵／出征。' },
  { officeId: 'central_bing_shilang', name: '兵部侍郎', rank: '正三品', interactMode: 'interactive', kind: 'shilang',
    desc: '佐尚書理軍務；本切片只人事。' },
  { officeId: 'central_liyi_shangshu', name: '禮部尚書', rank: '正二品', interactMode: 'locked_later', kind: 'shangshu',
    desc: '掌禮儀、科舉相關；本切片只讀，唔可任免。' },
  { officeId: 'central_xing_shangshu', name: '刑部尚書', rank: '正二品', interactMode: 'locked_later', kind: 'shangshu',
    desc: '掌刑名法律；本切片只讀。' },
  { officeId: 'central_gong_shangshu', name: '工部尚書', rank: '正二品', interactMode: 'locked_later', kind: 'shangshu',
    desc: '掌工程營繕；本切片只讀。' },
  { officeId: 'central_duchayuan', name: '都察院左都御史', rank: '正二品', interactMode: 'interactive', kind: 'duchayuan',
    desc: '風憲總憲，糾察百官；本切片可任命／罷免。' },
  { officeId: 'central_dalisi', name: '大理寺卿', rank: '正三品', interactMode: 'interactive', kind: 'dalisi',
    desc: '覆核重大刑獄；本切片可任命／罷免。' },
];

export const LOCAL_OFFICES = [
  { officeId: 'prov_demo_buzheng', name: '北直隸布政使', place: '北直隸', rank: '從二品', interactMode: 'interactive', kind: 'buzheng',
    desc: '北直隸民政、錢糧總匯；後續稅收／賑濟會掛呢位。空缺時：省實收打折；省賑困難。' },
  { officeId: 'prov_demo_ancha', name: '北直隸按察使', place: '北直隸', rank: '正三品', interactMode: 'interactive', kind: 'ancha',
    desc: '北直隸刑名、監察；本切片無結算。' },
  { officeId: 'prov_demo_duzhihui', name: '北直隸都指揮使', place: '北直隸', rank: '正二品', interactMode: 'interactive', kind: 'duzhihui',
    desc: '北直隸軍務主將；後續募兵／出征會掛呢位。空缺時：不可主動出征；防守打折。' },
  { officeId: 'prov_demo_zhifu_1', name: '北直隸·大興府知府', place: '北直隸·大興府', rank: '正四品', interactMode: 'interactive', kind: 'zhifu',
    desc: '大興府民政；影響下屬州縣清廉／穩定（本切片主要人事）。' },
  { officeId: 'prov_demo_zhifu_2', name: '北直隸·宛平府知府', place: '北直隸·宛平府', rank: '正四品', interactMode: 'interactive', kind: 'zhifu',
    desc: '宛平府民政；影響下屬州縣清廉／穩定（本切片主要人事）。' },
  { officeId: 'prov_demo_zhixian_1', name: '北直隸·大興縣知縣', place: '北直隸·大興縣', rank: '正七品', interactMode: 'interactive', kind: 'zhixian',
    desc: '大興縣親民官；本切片主要人事。' },
  { officeId: 'prov_demo_zhixian_2', name: '北直隸·宛平縣知縣', place: '北直隸·宛平縣', rank: '正七品', interactMode: 'interactive', kind: 'zhixian',
    desc: '宛平縣親民官；本切片主要人事。' },
  { officeId: 'prov_demo_zhixian_3', name: '北直隸·良鄉縣知縣', place: '北直隸·良鄉縣', rank: '正七品', interactMode: 'interactive', kind: 'zhixian',
    desc: '良鄉縣親民官；本切片主要人事。' },
];

export const ALL_OFFICES = [...CENTRAL_OFFICES, ...LOCAL_OFFICES];

export const MINISTRIES = [
  { id: 'li', name: '吏', gate: 'open', tip: null },
  { id: 'hu', name: '戶', gate: 'locked_slice', tip: '本切片未開放（戶部稍後）' },
  { id: 'bing', name: '兵', gate: 'locked_slice', tip: '本切片未開放（兵部稍後）' },
  { id: 'liyi', name: '禮', gate: 'grey_phase', tip: 'Phase 後' },
  { id: 'xing', name: '刑', gate: 'grey_phase', tip: 'Phase 後' },
  { id: 'gong', name: '工', gate: 'grey_phase', tip: 'Phase 後' },
];

const SURNAMES = [
  '張', '李', '王', '趙', '劉', '陳', '楊', '黃', '周', '吳',
  '徐', '孫', '胡', '朱', '高', '林', '何', '郭', '馬', '羅',
  '梁', '宋', '鄭', '謝', '韓', '唐', '馮', '于', '董', '蕭',
];
const GIVEN = [
  '文渊', '士廉', '伯溫', '廷芳', '景行', '德昭', '守正', '惟清',
  '弘毅', '志遠', '仲達', '公瑾', '明远', '子昂', '克己', '安邦',
  '秉忠', '崇礼', '永年', '嘉言', '彦博', '仲淹', '若虚', '季平',
];

let _seed = 20260918;
function rng() {
  _seed = (_seed * 1664525 + 1013904223) >>> 0;
  return _seed / 0x100000000;
}
function pick(arr) {
  return arr[Math.floor(rng() * arr.length)];
}
function ri(a, b) {
  return a + Math.floor(rng() * (b - a + 1));
}

function makeName(used) {
  let n;
  let guard = 0;
  do {
    n = pick(SURNAMES) + pick(GIVEN);
    guard++;
  } while (used.has(n) && guard < 80);
  used.add(n);
  return n;
}

/** Soft fitness profile per office kind for opening generation */
function profileFor(kind) {
  switch (kind) {
    case 'shangshu':
    case 'shilang':
    case 'duchayuan':
    case 'dalisi':
      return { wu: ri(20, 55), zhi: ri(45, 85), mei: ri(30, 70), zhong: ri(40, 90), lian: ri(40, 85), exp: ri(25, 70), specialty: pick(['civil', 'fiscal', 'legal', 'none']) };
    case 'buzheng':
      return { wu: ri(15, 45), zhi: ri(40, 80), mei: ri(25, 65), zhong: ri(35, 85), lian: ri(35, 80), exp: ri(20, 60), specialty: 'fiscal' };
    case 'duzhihui':
      return { wu: ri(45, 90), zhi: ri(30, 65), mei: ri(25, 60), zhong: ri(40, 85), lian: ri(30, 70), exp: ri(20, 65), specialty: 'military' };
    case 'ancha':
      return { wu: ri(20, 50), zhi: ri(40, 80), mei: ri(25, 60), zhong: ri(40, 85), lian: ri(40, 85), exp: ri(20, 55), specialty: 'legal' };
    case 'zhifu':
    case 'zhixian':
      return { wu: ri(15, 45), zhi: ri(30, 70), mei: ri(25, 65), zhong: ri(30, 80), lian: ri(30, 75), exp: ri(10, 45), specialty: pick(['civil', 'fiscal', 'none']) };
    default:
      return { wu: ri(20, 60), zhi: ri(30, 70), mei: ri(25, 65), zhong: ri(30, 80), lian: ri(30, 75), exp: ri(10, 50), specialty: 'none' };
  }
}

let _idSeq = 0;
export function resetIdSeq() {
  _idSeq = 0;
  _seed = 20260918;
}

function nextId() {
  _idSeq += 1;
  return `off_${String(_idSeq).padStart(3, '0')}`;
}

export function createOfficial(partial = {}) {
  const used = partial._usedNames || new Set();
  const base = {
    id: nextId(),
    name: makeName(used),
    wu: ri(20, 60),
    zhi: ri(30, 70),
    mei: ri(25, 65),
    zhong: ri(30, 80),
    lian: ri(30, 75),
    exp: ri(10, 50),
    age: ri(28, 58),
    specialty: 'none',
    status: 'pool',
    officeId: null,
  };
  const { _usedNames, ...rest } = partial;
  return { ...base, ...rest };
}

export function generateOpeningPersonnel() {
  resetIdSeq();
  const usedNames = new Set();
  const officials = [];
  const offices = {};

  for (const def of ALL_OFFICES) {
    const stats = profileFor(def.kind);
    const off = createOfficial({
      _usedNames: usedNames,
      ...stats,
      status: 'appointed',
      officeId: def.officeId,
    });
    officials.push(off);
    offices[def.officeId] = {
      officeId: def.officeId,
      name: def.name,
      place: def.place || null,
      desc: def.desc || '',
      rank: def.rank,
      interactMode: def.interactMode,
      kind: def.kind,
      status: 'filled',
      officialId: off.id,
      vacancyHookId: null,
      vacancyCopy: null,
    };
  }

  // Pool ≥ 2
  for (let i = 0; i < 3; i++) {
    officials.push(createOfficial({
      _usedNames: usedNames,
      status: 'pool',
      officeId: null,
      zhi: ri(35, 75),
      lian: ri(30, 70),
      wu: ri(25, 70),
      exp: ri(15, 55),
      specialty: pick(['civil', 'fiscal', 'military', 'legal', 'none']),
    }));
  }

  return { officials, offices };
}

/**
 * Soft fitness check — returns { ok, reason } where ok=false means warn (still appointable).
 */
export function checkFitness(office, official) {
  const k = office.kind;
  if (k === 'shangshu' || k === 'shilang' || k === 'duchayuan' || k === 'dalisi') {
    if (official.zhi >= 40 || official.exp >= 20) return { ok: true };
    return { ok: false, reason: '才不配位：智或經驗未達門檻' };
  }
  if (k === 'buzheng') {
    if (official.zhi >= 35 && official.lian >= 30) return { ok: true };
    return { ok: false, reason: '才不配位：布政使宜智≥35且廉≥30' };
  }
  if (k === 'duzhihui') {
    if (official.wu >= 40) return { ok: true };
    return { ok: false, reason: '才不配位：都指揮使宜武≥40' };
  }
  if (k === 'ancha') {
    if (official.zhi >= 35 || official.specialty === 'legal') return { ok: true };
    return { ok: false, reason: '才不配位：按察使宜智≥35或刑名專長' };
  }
  if (k === 'zhifu' || k === 'zhixian') {
    if (official.zhi >= 25 || official.lian >= 25) return { ok: true };
    return { ok: false, reason: '才不配位：知府／知縣宜智或廉≥25' };
  }
  return { ok: true };
}

export function vacancyHookFor(officeId) {
  return VACANCY_HOOKS[officeId] || null;
}
