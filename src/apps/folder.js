// 线索档案 app：把已收集的线索渲染为文件夹视图
// 【可改】线索文案在这里集中维护
import { getClues } from '../state/clues.js';

const CLUE_TEXT = {
  clue_coord:          '04-23-17 水域。坐标指向洄川下游的野湖。这天之后，洄川的水不一样了。',
  clue_eye_misdirect:  '你钓上来的，是眼。一只人的眼，还带着温度，瞳孔在手电光里缩了一下。……可这眼睛是别人的。真正沉在底下的，不是眼。',
  clue_rot13:          'purazvna → 沉眠（chenmian）。它在水底，一直醒着等。',
  clue_lotus_truth:    '腐土青莲 · 腐生社残档。钓上来的是腐土青莲幼体，属莲花阵营。其余三路（眼 / 欲肉 / 圣临）皆为其放出的干扰回声。',
  clue_flesh_misdirect:'欲肉之面。检索到黏腻的低频呼吸声和网络里长出的肉。这是干扰回声。',
  clue_gaze_misdirect: '圣临之眼。祈祷时天花板睁开金眼。这不是水底真正沉着的东西。',
  clue_zhouyu:         '周屿。周屿就是在这片水域失踪的。装备还在岸上，人没了。和 04-23-17 那串编号指向同一片水。'
};

export function folderApp(body, ctx) {
  const collected = getClues();
  const knownIds = Object.keys(CLUE_TEXT);
  const have = knownIds.filter(id => collected.includes(id));

  if (have.length === 0) {
    body.innerHTML = `<div class="folder-empty">暂无线索。打开 Edge，去搜点什么。</div>`;
    return { unmount: () => {} };
  }

  body.innerHTML = `
    <div class="folder-app">
      <div class="folder-grid">
        ${have.map(id => `
          <div class="folder-file" data-id="${id}">
            <div class="file-icon">📄</div>
            <div class="file-name">${id}.txt</div>
          </div>
        `).join('')}
        <div class="folder-file locked" data-id="__finale__">
          <div class="file-icon">🔒</div>
          <div class="file-name">终局入口（待建）</div>
        </div>
      </div>
      <div class="folder-preview" id="preview"><p class="muted">选中一个线索查看内容。</p></div>
    </div>
  `;

  const preview = body.querySelector('#preview');

  body.querySelectorAll('.folder-file:not(.locked)').forEach(file => {
    file.addEventListener('click', () => {
      const id = file.dataset.id;
      preview.innerHTML = `
        <h4>${id}.txt</h4>
        <p>${CLUE_TEXT[id] || '（无内容）'}</p>
      `;
      body.querySelectorAll('.folder-file').forEach(f => f.classList.remove('selected'));
      file.classList.add('selected');
    });
  });

  // 终局入口：需先解谜（莲真相 + ≥2 支撑线索）才放行，否则提示线索不足
  // 【可改】放行条件（与 search.js 的 SUPPORT_CLUES / TRUTH_ID 一致）
  const TRUTH_ID = 'clue_lotus_truth';
  const SUPPORT_CLUES = ['clue_coord', 'clue_rot13', 'clue_zhouyu'];
  const solved = collected.includes(TRUTH_ID) && SUPPORT_CLUES.filter(c => collected.includes(c)).length >= 2;

  body.querySelector('.folder-file.locked').addEventListener('click', () => {
    body.querySelectorAll('.folder-file').forEach(f => f.classList.remove('selected'));
    body.querySelector('.folder-file.locked').classList.add('selected');
    if (solved) {
      ctx.breakOut('finale'); // 显式 breakOut：关窗 + 全屏呈现终局三结局（绕开 FIELD_SCENES 缓存）
    } else {
      preview.innerHTML = `<p class="muted">终局入口已上锁。<br>先去 Edge 搜出「腐土青莲」的真相，并凑齐 ≥2 条支撑线索（坐标 / 沉眠 / 周屿）。</p>`;
    }
  });

  return { unmount: () => {} };
}
