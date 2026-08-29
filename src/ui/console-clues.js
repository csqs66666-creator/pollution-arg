// 控制台线索（渊域式越界发现）：答案在源码/控制台里，不在提示里
// 阈值锁定在 base64 / ROT13 / 手工拼 URL 这一档，不考硬核密码学
export function clueOnCog(cog) {
  if (cog === 'unstable') {
    console.warn('%c[渊域] cognitive_state=unstable', 'color:#ff1a1a');
    console.log('%c你钓上来的东西，还在看着你。', 'color:#8ea3b5');
    console.log('%c线索：lake://04-23-17 → 去分隔符 → 042317 → 去论坛找节点 #042317。', 'color:#6fb6d6');
  } else if (cog === 'marked') {
    console.warn('%c[渊域] 档案已创建。', 'color:#d4af37');
    console.log('%c你在自测里说：是。你已入档。持续观测中。', 'color:#ff1a1a');
    console.log('%c（base64("door://04-23-17") = ZG9vcjovLzA0LTIzLTE3 | ROT13("chenmian") = purazvna）', 'color:#8ea3b5');
  }
}
