/* ══════════════════════════════════════════════════════════════════════════
   SuperPlat — Theme runtime  (Light / Dark / System)

   ⚠️ 이 파일은 <head> 안, 페이지 <style> 보다 **먼저** 동기 로드됩니다.
      DOM 이 그려지기 전에 data-theme 을 확정해야 첫 화면이 번쩍이지 않습니다
      (FOUC / FART 방지). 그래서 defer / async 를 붙이면 안 됩니다.

   저장 구조
     localStorage['sp.theme'] = 'light' | 'dark' | 'system'
     · 값이 없으면 'system' 으로 동작합니다.
     · 우선순위 : 사용자가 고른 값 → OS prefers-color-scheme → light

   공개 API (window.SPTheme)
     .get()            저장된 설정 ('light' | 'dark' | 'system')
     .resolved()       실제 적용 중인 값 ('light' | 'dark')
     .set(v)           설정 저장 + 즉시 적용 (3-state 구조를 이미 지원합니다)
     .toggle()         light ↔ dark (헤더 버튼이 쓰는 단순 토글)
     .subscribe(fn)    적용값이 바뀔 때 호출 (fn(resolved, mode))

   Header UI 는 단순 토글이지만, 내부 구조는 Light / Dark / System 3단계를
   그대로 지원합니다. 나중에 Theme Dropdown 으로 확장할 때 이 파일은
   손대지 않아도 됩니다.
   ══════════════════════════════════════════════════════════════════════════ */
(function (w, d) {
  'use strict';

  var KEY = 'sp.theme';
  var MODES = { light: 1, dark: 1, system: 1 };
  var root = d.documentElement;
  var subs = [];
  var mq = null;

  try { mq = w.matchMedia && w.matchMedia('(prefers-color-scheme: dark)'); } catch (e) { mq = null; }

  function read() {
    var v = null;
    try { v = w.localStorage.getItem(KEY); } catch (e) { v = null; }   /* private mode 대비 */
    return (v && MODES[v]) ? v : 'system';
  }
  function write(v) {
    try { w.localStorage.setItem(KEY, v); } catch (e) { /* 저장 실패해도 화면은 동작합니다 */ }
  }
  function resolve(mode) {
    if (mode === 'light' || mode === 'dark') return mode;
    return (mq && mq.matches) ? 'dark' : 'light';
  }

  var mode = read();
  var cur = '';

  function notify() {
    for (var i = 0; i < subs.length; i++) {
      try { subs[i](cur, mode); } catch (e) { }
    }
  }

  function apply(next, animate) {
    if (next === cur) return;
    /* 전환 순간에만 색 transition 을 켭니다. 평소에는 꺼 두어야
       스크롤 중 hover 색 전환 같은 기존 모션과 겹치지 않습니다.
       창(window)은 CSS transition(280ms)보다 조금 길게 잡습니다. */
    if (animate) {
      root.classList.add('theme-anim');
      w.clearTimeout(apply._t);
      apply._t = w.setTimeout(function () { root.classList.remove('theme-anim'); }, 340);
    }
    cur = next;
    root.setAttribute('data-theme', next);
    /* 폼 컨트롤 · 스크롤바 같은 브라우저 기본 UI 도 같이 따라오게 합니다 */
    root.style.colorScheme = next;
    notify();
  }

  /* ① 첫 적용 — DOM 이 그려지기 전에 여기까지 끝납니다 */
  apply(resolve(mode), false);

  /* ② OS 설정 변화 — 'system' 일 때만 따라갑니다 */
  if (mq) {
    var onOS = function () { if (mode === 'system') apply(resolve(mode), true); };
    if (mq.addEventListener) mq.addEventListener('change', onOS);
    else if (mq.addListener) mq.addListener(onOS);
  }

  /* ③ 다른 탭에서 바꾼 설정을 따라갑니다 */
  w.addEventListener('storage', function (e) {
    if (e && e.key === KEY) { mode = read(); apply(resolve(mode), true); }
  });

  w.SPTheme = {
    get: function () { return mode; },
    resolved: function () { return cur; },
    set: function (v) {
      if (!MODES[v]) v = 'system';
      var changed = (mode !== v);
      mode = v; write(v);
      var next = resolve(v);
      /* 'system' → 'light' 처럼 적용값(cur)은 그대로인데 설정(mode)만 바뀌는
         경우에도 구독자(세그먼트 컨트롤 등)가 상태를 다시 그릴 수 있게 알립니다. */
      if (next !== cur) apply(next, true);
      else if (changed) notify();
      return cur;
    },
    toggle: function () { return this.set(cur === 'dark' ? 'light' : 'dark'); },
    subscribe: function (fn) { if (typeof fn === 'function') { subs.push(fn); fn(cur, mode); } }
  };
})(window, document);
