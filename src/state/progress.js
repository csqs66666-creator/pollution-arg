// 会话进度（不强制持久化；污染态由 pollution.js 持久化）
export const flags = {
  staredWater: false,   // 序章·盯着水面看
  looked: false,        // 异变·睁眼看
  lookedAway: false,    // 异变·别过头
  dugForum: false,      // 缠染·深究
  reachedTruth: false   // 缠染·抵达真相
};

export function setFlag(k, v = true) { flags[k] = v; }
export function resetFlags() { for (const k in flags) flags[k] = false; }
