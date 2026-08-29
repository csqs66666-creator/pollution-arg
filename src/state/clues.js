// 线索存储（搜索解密核心用）
// 持久化于 localStorage，存一个 clue id 的数组（JSON 序列化）。
//
// 【可改】存储位置 / key 名：改这里即可换 key 或接入别的持久层。
//   CLUES_KEY = 线索 localStorage key 名（默认 'yuanyu.clues'）
const CLUES_KEY = 'yuanyu.clues'; // 【可改】线索 localStorage key 名

function read() {
  try {
    const raw = localStorage.getItem(CLUES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(arr) {
  try { localStorage.setItem(CLUES_KEY, JSON.stringify(arr)); } catch {}
}

// 记录一条线索（幂等：重复 addClue 不会写入重复 id）
export function addClue(id) {
  if (!id) return;
  const arr = read();
  if (!arr.includes(id)) { arr.push(id); write(arr); }
}

// 是否已收集某条线索
export function hasClue(id) {
  return read().includes(id);
}

// 返回已收集线索 id 的副本（只读，外部改返回值不影响存储）
export function getClues() {
  return [...read()];
}

// 清空全部线索（调试 / 重开用）
export function clearClues() {
  try { localStorage.removeItem(CLUES_KEY); } catch {}
}
