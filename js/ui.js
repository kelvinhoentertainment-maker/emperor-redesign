/** Phase 1a UI — XuanZhengHall + LibuAppointTree (IA: bottom ministries + right action rail) */

import {
  MINISTRIES,
  CENTRAL_OFFICES,
  LOCAL_OFFICES,
  SPECIALTY_LABEL,
} from './data.js';
import {
  formatDate,
  getOfficial,
  getPool,
  canDismiss,
  canAppoint,
  fitnessWarn,
  dismiss,
  appoint,
  endXun,
  saveToLocalStorage,
  loadFromLocalStorage,
  downloadSave,
  deserialize,
  createNewGame,
  APPOINT_STAMINA,
  DISMISS_STAMINA,
} from './game.js';

export function createUI(root) {
  let state = createNewGame();
  let view = 'hall'; // hall | libu
  let selectedMinistry = 'li'; // Phase 1a: 吏 selected by default
  let selectedOfficeId = null;
  let selectedPoolId = null;
  let modalOpen = false;

  const els = {
    overlay: null,
    toastHost: null,
  };

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    els.toastHost.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  function showModal({ title, body, confirmLabel = '確認', danger = false, onConfirm, onCancel }) {
    if (modalOpen) return;
    modalOpen = true;
    render();
    const overlay = els.overlay;
    overlay.hidden = false;
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h2>${escapeHtml(title)}</h2>
        <p>${body}</p>
        <div class="modal-actions">
          <button type="button" class="btn-ghost" data-act="cancel">取消</button>
          <button type="button" class="${danger ? 'btn-danger' : 'btn-primary'}" data-act="ok">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>`;
    overlay.querySelector('[data-act="cancel"]').onclick = () => {
      closeModal();
      onCancel && onCancel();
    };
    overlay.querySelector('[data-act="ok"]').onclick = () => {
      closeModal();
      onConfirm && onConfirm();
    };
  }

  function closeModal() {
    modalOpen = false;
    els.overlay.hidden = true;
    els.overlay.innerHTML = '';
    render();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function barClass(val, max) {
    const r = val / max;
    if (r <= 0.25) return 'bad';
    if (r <= 0.5) return 'warn';
    return '';
  }

  function showLiRail() {
    return selectedMinistry === 'li' && !state.gameOver;
  }

  function renderHud() {
    const b = state.body;
    const r = state.realm;
    const lifeClass = b.lifespan <= 3 ? 'bad' : b.lifespan <= 6 ? 'warn' : '';
    const actionsZero = state.actionsRemaining === 0 ? 'zero' : '';
    return `
      <header class="hud">
        <div class="hud-time">
          <div class="hud-era">${escapeHtml(formatDate(state))}</div>
          <div class="hud-actions ${actionsZero}">
            本旬剩餘行動
            <strong>${state.actionsRemaining}/${state.actionsPerXun}</strong>
          </div>
        </div>
        <div class="hud-body">
          <div class="body-stat">
            <div class="label">體力</div>
            <div class="value">${b.stamina}/${b.staminaMax}</div>
            <div class="body-bar ${barClass(b.stamina, b.staminaMax)}"><span style="width:${(b.stamina / b.staminaMax) * 100}%"></span></div>
          </div>
          <div class="body-stat">
            <div class="label">快樂</div>
            <div class="value">${b.happiness}/${b.happinessMax}</div>
            <div class="body-bar ${barClass(b.happiness, b.happinessMax)}"><span style="width:${(b.happiness / b.happinessMax) * 100}%"></span></div>
          </div>
          <div class="body-stat">
            <div class="label">健康</div>
            <div class="value">${b.health}/${b.healthMax}</div>
            <div class="body-bar ${barClass(b.health, b.healthMax)}"><span style="width:${(b.health / b.healthMax) * 100}%"></span></div>
          </div>
          <div class="body-stat">
            <div class="label">壽命</div>
            <div class="value lifespan ${lifeClass}">${b.lifespan} 旬</div>
          </div>
        </div>
        <div class="hud-realm">
          <div class="realm-stat money"><div class="label">金錢</div><div class="value">${r.money}</div></div>
          <div class="realm-stat grain"><div class="label">糧草</div><div class="value">${r.grain}</div></div>
          <div class="realm-stat pop"><div class="label">人口</div><div class="value">${r.population}</div></div>
          <div class="realm-stat troops"><div class="label">兵力</div><div class="value">${r.troops}</div></div>
          <div class="realm-stat prestige"><div class="label">皇威</div><div class="value">${r.prestige}</div></div>
        </div>
      </header>`;
  }

  function renderActionRail() {
    if (!showLiRail()) return '';
    const disabled = modalOpen || state.gameOver;
    const inLibu = view === 'libu';
    return `
      <aside class="action-rail" aria-label="吏部行動">
        <div class="action-rail-head">
          <div class="action-rail-title">吏部</div>
          <div class="action-rail-sub">Phase 1a</div>
        </div>
        <div class="action-rail-list">
          <button type="button" class="rail-btn ${inLibu ? 'active' : ''}" data-act="enter-libu" ${disabled ? 'disabled' : ''}>
            <span class="rail-btn-label">官職／任命樹</span>
            <span class="rail-btn-hint">${inLibu ? '目前畫面' : '進入吏部'}</span>
          </button>
          <button type="button" class="rail-btn rail-btn-danger" data-act="end-xun" ${disabled ? 'disabled' : ''}>
            <span class="rail-btn-label">結束本旬／退朝</span>
            <span class="rail-btn-hint">壽命 −1 · 重置行動</span>
          </button>
          ${inLibu ? `
          <button type="button" class="rail-btn rail-btn-ghost" data-act="back-hall" ${disabled ? 'disabled' : ''}>
            <span class="rail-btn-label">返回宣政殿</span>
            <span class="rail-btn-hint">朝堂主畫面</span>
          </button>` : ''}
        </div>
        <div class="action-rail-util">
          <button type="button" class="btn-ghost btn-compact" data-act="save" ${modalOpen ? 'disabled' : ''}>存檔</button>
          <button type="button" class="btn-ghost btn-compact" data-act="load" ${modalOpen ? 'disabled' : ''}>讀檔</button>
          <button type="button" class="btn-ghost btn-compact" data-act="download" ${modalOpen ? 'disabled' : ''}>下載</button>
          <button type="button" class="btn-ghost btn-compact" data-act="upload" ${modalOpen ? 'disabled' : ''}>匯入</button>
          <input type="file" accept="application/json,.json" id="save-file-input" hidden />
        </div>
      </aside>`;
  }

  function renderMinistries() {
    return `
      <nav class="ministry-bar" aria-label="六部">
        ${MINISTRIES.map((m) => {
          const active =
            selectedMinistry === m.id && m.gate === 'open' ? 'active' : '';
          return `
            <button type="button" class="ministry-tab ${m.gate} ${active}" data-ministry="${m.id}" title="${m.tip ? escapeHtml(m.tip) : m.name}">
              <span class="name">${m.name}</span>
              <span class="gate">${m.gate === 'open' ? '' : m.gate === 'locked_slice' ? '鎖' : '後'}</span>
            </button>`;
        }).join('')}
      </nav>`;
  }

  function renderOfficeCard(def) {
    const office = state.offices[def.officeId];
    const selected = selectedOfficeId === def.officeId ? 'selected' : '';
    const locked = office.interactMode === 'locked_later' ? 'locked_later' : '';
    if (office.status === 'vacant') {
      return `
        <button type="button" class="office-card vacant ${selected}" data-office="${office.officeId}">
          <div class="title-row">
            <span class="office-name">${escapeHtml(office.name)}</span>
            <span class="rank">${escapeHtml(office.rank)}</span>
          </div>
          <div class="vacant-label">＋ 任命</div>
          ${office.vacancyCopy ? `<div class="hook">${escapeHtml(office.vacancyCopy)}</div>` : ''}
        </button>`;
    }
    const off = getOfficial(state, office.officialId);
    return `
      <button type="button" class="office-card filled ${locked} ${selected}" data-office="${office.officeId}">
        <div class="title-row">
          <span class="office-name">${escapeHtml(office.name)}</span>
          <span class="rank">${escapeHtml(office.rank)}</span>
        </div>
        <div class="holder">${off ? escapeHtml(off.name) : '—'}</div>
        ${off ? `<div class="holder-stats">忠 ${off.zhong} · 廉 ${off.lian} · 智 ${off.zhi}</div>` : ''}
        ${locked ? '<div class="office-actions-hint">本切片唔開放此職人事</div>' : ''}
      </button>`;
  }

  function renderDetail() {
    if (!selectedOfficeId) {
      return `<aside class="detail-panel empty">選職缺以查看官員詳情</aside>`;
    }
    const office = state.offices[selectedOfficeId];
    if (!office) {
      return `<aside class="detail-panel empty">職缺不存在</aside>`;
    }

    if (office.status === 'vacant') {
      const pool = getPool(state);
      return `
        <aside class="detail-panel">
          <h3>${escapeHtml(office.name)}</h3>
          <div class="meta">${escapeHtml(office.rank)} · 虛位</div>
          ${office.vacancyCopy ? `<p class="warn-text" style="color:var(--state-bad)">${escapeHtml(office.vacancyCopy)}</p>` : '<p class="hint-caption">職缺空懸</p>'}
          <div class="cost-chip"><span>體力 −${APPOINT_STAMINA}</span><span>行動 −1</span></div>
          <h3 style="font:var(--type-label);margin-bottom:8px;color:var(--ink-secondary)">候選池</h3>
          <div class="pool-list">
            ${pool.length === 0 ? '<p class="hint-caption">池中無人</p>' : pool.map((p) => `
              <button type="button" class="pool-item ${selectedPoolId === p.id ? 'selected' : ''}" data-pool="${p.id}">
                <div>
                  <div class="name">${escapeHtml(p.name)}</div>
                  <div class="stats">武${p.wu} 智${p.zhi} 魅${p.mei} 忠${p.zhong} 廉${p.lian} · ${SPECIALTY_LABEL[p.specialty] || ''}</div>
                </div>
              </button>`).join('')}
          </div>
          ${(() => {
            if (!selectedPoolId) return '<p class="hint-caption">請選擇候選人</p>';
            const fit = fitnessWarn(state, office.officeId, selectedPoolId);
            const gate = canAppoint(state, office.officeId, selectedPoolId);
            const disabled = !gate.ok;
            return `
              ${!fit.ok ? `<p class="warn-text">${escapeHtml(fit.reason)}</p>` : ''}
              ${disabled ? `<p class="hint-caption">${escapeHtml(gate.reason)}</p>` : ''}
              <div class="action-row">
                <button type="button" class="btn-primary" data-act="appoint" ${disabled ? 'disabled' : ''}>奏請任命</button>
              </div>`;
          })()}
        </aside>`;
    }

    const off = getOfficial(state, office.officialId);
    const locked = office.interactMode === 'locked_later';
    const gate = canDismiss(state, office.officeId);
    return `
      <aside class="detail-panel">
        <h3>${escapeHtml(off ? off.name : '—')}</h3>
        <div class="meta">${escapeHtml(office.name)} · ${escapeHtml(office.rank)}${locked ? ' · 只讀' : ''}</div>
        ${off ? `
          <div class="stat-grid">
            <div class="stat-cell"><span class="k">武</span><span class="v">${off.wu}</span></div>
            <div class="stat-cell"><span class="k">智</span><span class="v">${off.zhi}</span></div>
            <div class="stat-cell"><span class="k">魅</span><span class="v">${off.mei}</span></div>
            <div class="stat-cell"><span class="k">忠</span><span class="v">${off.zhong}</span></div>
            <div class="stat-cell"><span class="k">廉</span><span class="v">${off.lian}</span></div>
            <div class="stat-cell"><span class="k">經驗</span><span class="v">${off.exp}</span></div>
          </div>
          <p class="hint-caption">年齡 ${off.age} · 專長 ${SPECIALTY_LABEL[off.specialty] || '無'}</p>
        ` : ''}
        ${locked
          ? '<p class="hint-caption" style="margin-top:12px">本切片唔開放此職人事</p>'
          : `
            <div class="cost-chip" style="margin-top:12px"><span>體力 −${DISMISS_STAMINA}</span><span>行動 −1</span></div>
            <p class="hint-caption">改任須先罷免，再另行任命</p>
            ${!gate.ok ? `<p class="hint-caption">${escapeHtml(gate.reason)}</p>` : ''}
            <div class="action-row">
              <button type="button" class="btn-danger" data-act="dismiss" ${gate.ok ? '' : 'disabled'}>罷免</button>
            </div>`}
      </aside>`;
  }

  function renderLibu() {
    return `
      <div class="libu-view panel-surface">
        <div class="libu-header">
          <h1>吏部 · 任命</h1>
        </div>
        <div class="libu-layout">
          <div class="libu-tree">
            <section class="office-section">
              <h2>中央</h2>
              <div class="office-grid">
                ${CENTRAL_OFFICES.map(renderOfficeCard).join('')}
              </div>
            </section>
            <section class="office-section">
              <h2>地方 · ${escapeHtml(state.province.name)}</h2>
              <div class="office-grid">
                ${LOCAL_OFFICES.map(renderOfficeCard).join('')}
              </div>
            </section>
          </div>
          ${renderDetail()}
        </div>
      </div>`;
  }

  function renderHall() {
    if (state.gameOver) {
      return `
        <div class="hall-welcome panel-surface game-over">
          <h1>${escapeHtml(state.gameOverReason || '駕崩')}</h1>
          <p style="color:var(--ink-secondary);margin-bottom:16px">Phase 1a 結局占位。可讀檔或開新局。</p>
          <button type="button" class="btn-primary" data-act="new-game">開新局</button>
        </div>`;
    }
    const recent = (state.log || []).slice(0, 5);
    return `
      <div class="hall-welcome panel-surface">
        <h1>宣政殿</h1>
        <p>陛下臨朝。底欄選「吏」，右側開行動；「官職／任命樹」進入任命／罷免。戶／兵稍後開放；禮／刑／工 Phase 後。</p>
        <p class="hint-caption">本切片唔跑稅收／募兵結算。空缺掛鉤僅顯示文案。</p>
        <div class="hall-log">
          ${recent.map((l) => `<div class="log-line">${escapeHtml(l)}</div>`).join('')}
        </div>
      </div>`;
  }

  function render() {
    const hallBg = view === 'hall' || view === 'libu';
    root.innerHTML = `
      <div class="shell ${hallBg ? 'has-hall-bg' : ''}">
        <div class="stage-bg" aria-hidden="true"></div>
        <div class="shell-inner">
          ${renderHud()}
          <div class="main ${showLiRail() ? 'with-rail' : ''}">
            <div class="content">
              ${view === 'libu' ? renderLibu() : renderHall()}
            </div>
            ${renderActionRail()}
          </div>
          ${renderMinistries()}
        </div>
      </div>
      <div class="overlay" hidden></div>
      <div class="toast-host" aria-live="polite"></div>
    `;
    els.overlay = root.querySelector('.overlay');
    els.toastHost = root.querySelector('.toast-host');
    bind();
  }

  function doAppoint() {
    if (!selectedOfficeId || !selectedPoolId) return;
    const fit = fitnessWarn(state, selectedOfficeId, selectedPoolId);
    const run = () => {
      const res = appoint(state, selectedOfficeId, selectedPoolId);
      if (!res.ok) {
        toast(res.reason);
        return;
      }
      selectedPoolId = null;
      toast('任命成功');
      render();
    };
    if (!fit.ok) {
      showModal({
        title: '才不配位',
        body: `${escapeHtml(fit.reason)}。仍要任命？`,
        confirmLabel: '仍要任命',
        onConfirm: run,
      });
    } else {
      run();
    }
  }

  function doDismiss() {
    if (!selectedOfficeId) return;
    const office = state.offices[selectedOfficeId];
    const off = getOfficial(state, office.officialId);
    showModal({
      title: '確認罷免',
      body: `罷免〔${escapeHtml(off ? off.name : '')}〕· ${escapeHtml(office.name)}？消耗體力 1、行動 1。`,
      confirmLabel: '罷免',
      danger: true,
      onConfirm: () => {
        const res = dismiss(state, selectedOfficeId);
        if (!res.ok) {
          toast(res.reason);
          return;
        }
        toast('已罷免');
        render();
      },
    });
  }

  function doEndXun() {
    showModal({
      title: '結束本旬',
      body: '確認結束本旬？壽命 −1；若本旬無成功任命／罷免則體力 +1。',
      confirmLabel: '結束本旬',
      danger: true,
      onConfirm: () => {
        const res = endXun(state);
        if (!res.ok) {
          toast(res.reason);
          return;
        }
        view = 'hall';
        selectedMinistry = 'li';
        selectedOfficeId = null;
        selectedPoolId = null;
        if (res.gameOver) toast(state.gameOverReason);
        else toast(`進入${formatDate(state)}`);
        render();
      },
    });
  }

  function doSave() {
    if (modalOpen) return;
    const res = saveToLocalStorage(state);
    if (res.ok) toast('已存檔（本機）');
    else toast(res.reason);
  }

  function doLoad() {
    if (modalOpen) return;
    showModal({
      title: '讀檔',
      body: '讀取本機存檔將覆蓋目前進度，確定？',
      confirmLabel: '讀檔',
      onConfirm: () => {
        const res = loadFromLocalStorage();
        if (!res.ok) {
          toast(res.reason);
          return;
        }
        state = res.state;
        view = 'hall';
        selectedMinistry = 'li';
        selectedOfficeId = null;
        selectedPoolId = null;
        toast('讀檔成功');
        render();
      },
    });
  }

  function bind() {
    root.querySelectorAll('[data-ministry]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ministry');
        const m = MINISTRIES.find((x) => x.id === id);
        if (!m) return;
        if (m.gate === 'open') {
          selectedMinistry = m.id;
          // Selecting 吏 keeps hall; enter appoint via right rail
          if (view === 'libu' && m.id === 'li') {
            // stay in libu with rail
          } else if (m.id === 'li') {
            view = 'hall';
            selectedOfficeId = null;
            selectedPoolId = null;
          }
          render();
        } else {
          toast(m.tip || '未開放');
        }
      });
    });

    root.querySelectorAll('[data-office]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedOfficeId = btn.getAttribute('data-office');
        selectedPoolId = null;
        const office = state.offices[selectedOfficeId];
        if (office && office.interactMode === 'locked_later') {
          toast('本切片唔開放此職人事');
        }
        render();
      });
    });

    root.querySelectorAll('[data-pool]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedPoolId = btn.getAttribute('data-pool');
        render();
      });
    });

    const act = (sel, fn) => {
      const el = root.querySelector(sel);
      if (el) el.addEventListener('click', fn);
    };
    act('[data-act="enter-libu"]', () => {
      if (view === 'libu') {
        toast('已在任命樹');
        return;
      }
      selectedMinistry = 'li';
      view = 'libu';
      selectedOfficeId = null;
      selectedPoolId = null;
      render();
    });
    act('[data-act="back-hall"]', () => {
      view = 'hall';
      selectedMinistry = 'li';
      selectedOfficeId = null;
      selectedPoolId = null;
      render();
    });
    act('[data-act="appoint"]', doAppoint);
    act('[data-act="dismiss"]', doDismiss);
    act('[data-act="end-xun"]', doEndXun);
    act('[data-act="save"]', doSave);
    act('[data-act="load"]', doLoad);
    act('[data-act="download"]', () => {
      downloadSave(state);
      toast('已下載存檔 JSON');
    });
    act('[data-act="new-game"]', () => {
      state = createNewGame();
      view = 'hall';
      selectedMinistry = 'li';
      selectedOfficeId = null;
      selectedPoolId = null;
      render();
    });
    act('[data-act="upload"]', () => {
      const input = root.querySelector('#save-file-input');
      if (input) input.click();
    });
    const fileInput = root.querySelector('#save-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', async () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        try {
          const text = await file.text();
          const res = deserialize(text);
          if (!res.ok) {
            toast(res.reason);
            return;
          }
          state = res.state;
          view = 'hall';
          selectedMinistry = 'li';
          selectedOfficeId = null;
          selectedPoolId = null;
          toast('匯入成功');
          render();
        } catch {
          toast('匯入失敗');
        }
        fileInput.value = '';
      });
    }
  }

  render();
  return {
    getState: () => state,
    setState: (s) => {
      state = s;
      render();
    },
  };
}
