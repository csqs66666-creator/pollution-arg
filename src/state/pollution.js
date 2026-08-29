// 认知污染状态机（复用渊域 bleed-state-machine）
// 四态：clean / subliminal(compliant) / bleeding(unstable) / marked
// 持久化于 localStorage['yuanyu.cog']，表现为全站退化而非玩家成长（支柱二·认知即代价）。

const KEY = 'yuanyu.cog';
const MAP = { compliant: 'corrupt-1', unstable: 'corrupt-2', marked: 'corrupt-3' };

export function getCog() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function applyCog() {
  const cog = getCog();
  document.body.classList.remove('corrupt-1', 'corrupt-2', 'corrupt-3');
  if (MAP[cog]) document.body.classList.add(MAP[cog]);
  document.body.dataset.cog = cog || 'clean';
  // 广播给所有监听者（hud / corruption / console-clues）
  document.dispatchEvent(new CustomEvent('cog:change', { detail: { cog: cog || 'clean' } }));
}

export function setCog(value) {
  try { localStorage.setItem(KEY, value); } catch {}
  applyCog();
}

export function resetCog() {
  try { localStorage.removeItem(KEY); } catch {}
  applyCog();
}

// 确定性转移（非随机、非计时抽奖）
export function toSubliminal() { if (!getCog() || getCog() === 'compliant') setCog('compliant'); } // 自欺/别过头
export function toBleeding()   { setCog('unstable'); }                                            // 睁眼看/缠上
export function toMarked()     { setCog('marked'); }                                              // 深究/抵达真相

export const COG_LABEL = {
  clean: '表层 · 清醒',
  compliant: '边缘 · 自欺',
  unstable: '渗血 · 缠上',
  marked: '深渊 · 入档'
};
