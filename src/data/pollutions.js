// 渊域 · 四大污染（忠实转述世界观，不改设定）
export const POLLUTIONS = {
  eye:   { id: 'eye',   name: '久远之瞳', domain: '身体', form: '寄生在人眼中的克苏鲁', vector: '接触 / 食用',       result: '人化为肉块怪物' },
  lotus: { id: 'lotus', name: '腐土青莲', domain: '感官', form: '莲花之面',           vector: '根系 / 网络 / 思想', result: '五感全部感知为血肉地狱' },
  flesh: { id: 'flesh', name: '欲肉之面', domain: '生殖', form: '面部即生殖器',       vector: '情欲',               result: '诞下非人后代' },
  gaze:  { id: 'gaze',  name: '圣临之眼', domain: '信仰', form: '伪神的监视',         vector: '祈祷',               result: '你成为它的眼睛与燃料' }
};

export const POLLUTION_LIST = Object.values(POLLUTIONS);
