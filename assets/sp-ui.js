/* ══════════════════════════════════════════════════════════════════════════
   SuperPlat — sp-ui.js
   공통 Dropdown / Select / Search 시스템

   헤더의 언어 변경 드롭다운이 가장 완성도가 높아, 그 visual tone(흰 surface ·
   얇은 테두리 · 절제된 그림자 · 짧은 opacity+translateY 모션 · 명확한 hover)을
   토큰으로 뽑아 사이트 전체가 같은 언어를 쓰도록 했습니다.

     surface   --sp-menu-bg / --sp-menu-bd / --sp-menu-r / --sp-menu-sh
     option    --sp-opt-h / --sp-opt-r / --sp-opt-hover / --sp-opt-sel
     motion    --sp-pop-in / --sp-pop-out / --sp-ease
     layer     --z-header / --z-pop / --z-modal / --z-toast

   ── 쓰는 법 ───────────────────────────────────────────────────────────────
     SPUI.select(nativeSelectEl)   네이티브 <select> 를 커스텀 listbox 로 승격.
                                   ⚠️ 네이티브 요소는 그대로 남아 값을 보관하고
                                      change 이벤트도 그대로 발생시키므로,
                                      기존 화면 코드는 한 줄도 고치지 않습니다.
     SPUI.search(inputEl, opts)    검색 입력에 아이콘 + Clear 버튼을 붙입니다.
     SPUI.scan(root)               위 두 가지를 자동으로 적용 (data 속성 기준).

   모바일(≤767)에서는 목록이 3개를 넘으면 팝오버 대신 바텀시트로 엽니다.
   ══════════════════════════════════════════════════════════════════════════ */
(function (global) {
'use strict';

var CSS = [
':root{',
  '--sp-menu-bg:#fff;',
  '--sp-menu-bd:rgba(var(--ink-rgb),.08);',
  '--sp-menu-r:14px;',
  '--sp-menu-sh:0 10px 30px rgba(0,0,0,.08), 0 0 0 1px rgba(var(--ink-rgb),.05);',
  '--sp-menu-pad:7px;',
  '--sp-opt-h:42px;',
  '--sp-opt-r:9px;',
  '--sp-opt-hover:rgba(var(--ink-rgb),.045);',
  '--sp-opt-sel:rgba(var(--ink-rgb),.06);',
  '--sp-pop-in:220ms;',
  '--sp-pop-out:160ms;',
  '--sp-ease:cubic-bezier(.16,1,.3,1);',
  '--sp-fld-h:56px;',
  '--sp-fld-r:12px;',
  '--sp-fld-bd:rgba(var(--ink-rgb),.14);',
  '--sp-fld-bd-hover:rgba(var(--ink-rgb),.30);',
  '--sp-ink:#171A21;',
  '--sp-ink-2:#6B7280;',
  /* 레이어 순서 — 각자 z-index:9999 를 쓰지 않도록 한 곳에서 정합니다 */
  '--z-header:200; --z-pop:600; --z-modal:900; --z-toast:1000;',
'}',
/* 모바일 control 높이 통일 — Input / Select / Search 전부 52px.
   ⚠️ 이 스타일은 페이지 <style> 보다 늦게 주입되므로, 페이지에서 :root 를
      덮어써도 여기가 이깁니다. 그래서 토큰 자체를 여기서 바꿔 줍니다. */
'@media (max-width:767px){:root{--sp-fld-h:52px}}',

/* ── Trigger ─────────────────────────────────────────────────────────── */
/* wrapper 는 원래 select 의 class 를 물려받으므로(반응형 display 규칙 유지),
   페이지가 select 에 걸어 둔 "겉모습"은 wrapper 에서 전부 무력화합니다.
   실제 필드 모양은 .spsel__btn 하나만 그립니다. display 는 페이지 규칙이
   그대로 이기도록 여기서 건드리지 않습니다(div 기본값 block). */
'.spsel{position:relative;width:100%;',
  'background:none!important;border:0!important;box-shadow:none!important;',
  'padding:0!important;height:auto!important;min-height:0!important;',
  'font:inherit;color:inherit;appearance:none!important}',
'.spsel__native{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;clip:rect(0 0 0 0)}',
'.spsel__btn{',
  'display:flex;align-items:center;gap:10px;width:100%;',
  'height:var(--sp-fld-h);padding:0 16px;',
  'border:1px solid var(--sp-fld-bd);border-radius:var(--sp-fld-r);',
  'background:#fff;font:inherit;font-size:16px;font-weight:400;color:var(--sp-ink);',
  'text-align:left;cursor:pointer;',
  'transition:border-color 200ms var(--sp-ease), background-color 200ms var(--sp-ease);',
'}',
'@media (max-width:1439px){.spsel__btn{font-size:15px}}',
'.spsel__btn:disabled{background:#F4F5F6;color:var(--sp-ink-2);cursor:not-allowed;opacity:.7}',
'@media (hover:hover){.spsel__btn:not(:disabled):hover{border-color:var(--sp-fld-bd-hover)}}',
'.spsel__btn:focus-visible{outline:none;border-color:var(--sp-ink);box-shadow:0 0 0 3px rgba(var(--ink-rgb),.10)}',
'.spsel.is-open .spsel__btn{border-color:var(--sp-ink)}',
'.spsel.is-err .spsel__btn{border-color:#C0392B}',
/* ⚠️ 선택을 바꿔도 트리거(상단) 폭이 흔들리지 않게 합니다.
   보이는 값과 "모든 옵션 텍스트(숨김)"를 같은 grid cell 에 겹쳐 쌓으면,
   칸의 폭이 항상 '가장 긴 옵션' 기준으로 잡힙니다.
   폭이 컨테이너로 정해지는 화면에서는 아무 영향이 없고,
   내용으로 폭이 정해지는 화면에서만 고정 폭처럼 동작합니다. */
'.spsel__vals{flex:1;display:grid;min-width:0;text-align:left}',
'.spsel__vals > span{grid-area:1 / 1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
'.spsel__ghost{visibility:hidden;pointer-events:none;user-select:none}',
'.spsel__val.is-ph{color:rgba(var(--ink-rgb),.36)}',
'.spsel__chev{',
  'flex:none;width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.6;',
  'stroke-linecap:round;stroke-linejoin:round;color:var(--sp-ink-2);',
  'transition:transform 220ms var(--sp-ease);',
'}',
'.spsel.is-open .spsel__chev{transform:rotate(180deg)}',
/* Hover 가 없는 환경 — 눌렀을 때만 아주 짧게 가라앉습니다 */
'@media (hover:none){.spsel__btn:active{transform:scale(.99)}}',

/* ── Menu surface (언어 드롭다운과 같은 톤) ───────────────────────────── */
'.spmenu{',
  'position:fixed;z-index:var(--z-pop);',
  'min-width:120px;padding:var(--sp-menu-pad);',
  'background:var(--sp-menu-bg);border-radius:var(--sp-menu-r);',
  'box-shadow:var(--sp-menu-sh);',
  'opacity:0;visibility:hidden;transform:translateY(-5px) scale(.98);transform-origin:top center;',
  'transition:opacity var(--sp-pop-out) var(--sp-ease), transform var(--sp-pop-out) var(--sp-ease), visibility var(--sp-pop-out);',
  'max-height:min(340px, 60vh);overflow-y:auto;overscroll-behavior:contain;',
'}',
'.spmenu.is-up{transform-origin:bottom center;transform:translateY(5px) scale(.98)}',
'.spmenu.is-open{opacity:1;visibility:visible;transform:none;',
  'transition-duration:var(--sp-pop-in), var(--sp-pop-in), var(--sp-pop-in)}',
'.spmenu__opt{',
  'display:flex;align-items:center;gap:8px;width:100%;',
  'min-height:var(--sp-opt-h);padding:0 13px;',
  'border:0;background:none;border-radius:var(--sp-opt-r);',
  'font:inherit;font-size:15px;font-weight:400;color:var(--sp-ink);',
  'text-align:left;cursor:pointer;',
  'transition:background-color 160ms var(--sp-ease);',
'}',
'@media (hover:hover){.spmenu__opt:hover{background:var(--sp-opt-hover)}}',
'.spmenu__opt.is-cursor{background:var(--sp-opt-hover)}',
'.spmenu__opt[aria-selected="true"]{background:var(--sp-opt-sel);font-weight:600}',
'.spmenu__opt[disabled]{opacity:.45;cursor:not-allowed}',
'.spmenu__opt:focus-visible{outline:2px solid var(--sp-ink);outline-offset:-2px}',
'.spmenu__t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
'.spmenu__ck{flex:none;width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2.1;',
  'stroke-linecap:round;stroke-linejoin:round;opacity:0}',
'.spmenu__opt[aria-selected="true"] .spmenu__ck{opacity:1}',
'.spmenu__grab{display:none}',

/* ── 모바일 바텀시트 ─────────────────────────────────────────────────── */
'@media (max-width:767px){',
  /* 시트가 아닌 팝업으로 뜨는 경우에도 터치 타깃 44px 이상 (실측 42px 였습니다) */
  '.spmenu__opt{min-height:48px}',
  '.spmenu.is-sheet{',
    'left:0!important;right:0!important;top:auto!important;bottom:0;width:auto!important;',
    'max-height:70vh;border-radius:22px 22px 0 0;',
    'padding:8px 12px calc(14px + env(safe-area-inset-bottom,0px));',   /* Home Indicator 회피 */
    'transform:translateY(14px);transform-origin:bottom center;',
    'transition:opacity 300ms var(--sp-ease), transform 300ms var(--sp-ease), visibility 300ms;',
  '}',
  '.spmenu.is-sheet.is-open{transform:translateY(0)}',
  '.spmenu.is-sheet .spmenu__grab{display:block;width:38px;height:4px;margin:6px auto 8px;',
    'border-radius:999px;background:rgba(var(--ink-rgb),.16)}',
  '.spmenu.is-sheet .spmenu__opt{min-height:52px;font-size:16px;padding-inline:16px}',
'}',
/* ── Back to Top ─────────────────────────────────────────────────
   Secondary utility control 입니다. 검은 대형 버튼 · TOP 텍스트 · glow 없이
   반투명 표면 + 아주 얇은 테두리로 밝은 화면과 사진 위 모두에서 읽히게 합니다. */
'.sptop{',
  'position:fixed;right:32px;bottom:calc(32px + env(safe-area-inset-bottom, 0px));',
  'z-index:var(--z-pop, 600);',
  'width:48px;height:48px;padding:0;border-radius:50%;',
  'display:grid;place-items:center;',
  'background:rgba(255,255,255,.92);border:1px solid rgba(var(--ink-rgb),.10);',
  'box-shadow:0 4px 16px rgba(0,0,0,.06);',
  'color:#171A21;cursor:pointer;',
  '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);',
  'opacity:0;visibility:hidden;transform:translateY(8px);pointer-events:none;',
  'transition:opacity 260ms cubic-bezier(.22,1,.36,1),transform 260ms cubic-bezier(.22,1,.36,1),',
             'visibility 260ms,background-color 180ms cubic-bezier(.22,1,.36,1);',
'}',
'.sptop.is-on{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto}',
'.sptop svg{width:21px;height:21px;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;display:block}',
'@media (hover:hover){.sptop.is-on:hover{background:rgba(255,255,255,.98);color:#000;transform:translateY(-2px)}}',
'.sptop.is-on:active{transform:translateY(0) scale(.96);transition-duration:180ms}',
'.sptop:focus-visible{outline:2px solid #171A21;outline-offset:3px}',
'@media (max-width:1023px){.sptop{right:24px;bottom:calc(24px + env(safe-area-inset-bottom, 0px));width:46px;height:46px}}',
/* 모바일은 blur 를 걷어냅니다 — 저사양 기기에서 스크롤 프레임을 떨어뜨립니다 */
'@media (max-width:767px){.sptop{right:20px;bottom:calc(20px + env(safe-area-inset-bottom, 0px));width:44px;height:44px;',
  '-webkit-backdrop-filter:none;backdrop-filter:none;background:rgba(255,255,255,.95)}}',
'@media (prefers-reduced-motion:reduce){.sptop{transition-duration:1ms,1ms,1ms,1ms}}',
'.spmenu__cap{padding:10px 12px 6px;margin:0;font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--sp-mute,rgba(var(--ink-rgb),.60));text-transform:none}',
'.spmenu__opt + .spmenu__cap{margin-top:4px;border-top:1px solid rgba(var(--ink-rgb),.07);padding-top:12px}',
'.spscrim{position:fixed;inset:0;z-index:calc(var(--z-pop) - 1);background:rgba(12,16,24,.26);',
  'opacity:0;visibility:hidden;transition:opacity 260ms var(--sp-ease), visibility 260ms}',
'.spscrim.is-open{opacity:1;visibility:visible}',
'@media (min-width:768px){.spscrim{background:transparent}}',

/* ── Search ──────────────────────────────────────────────────────────── */
'.spsearch{position:relative;display:block;width:100%}',
'.spsearch input{',
  'width:100%;height:var(--sp-fld-h);',
  'padding:0 46px 0 46px;',
  'border:1px solid var(--sp-fld-bd);border-radius:var(--sp-fld-r);',
  'background:#fff;font-family:inherit;font-size:16px;color:var(--sp-ink);',
  'transition:border-color 200ms var(--sp-ease);',
  '-webkit-appearance:none;appearance:none;',
'}',
'@media (max-width:1439px){.spsearch input{font-size:15px}}',
'.spsearch input::placeholder{color:rgba(var(--ink-rgb),.36)}',
'.spsearch input::-webkit-search-cancel-button{display:none}',
'@media (hover:hover){.spsearch input:hover{border-color:var(--sp-fld-bd-hover)}}',
'.spsearch input:focus{outline:none;border-color:var(--sp-ink)}',
'.spsearch input:focus-visible{box-shadow:0 0 0 3px rgba(var(--ink-rgb),.10)}',
'.spsearch__ico{',
  'position:absolute;left:0;top:0;height:100%;width:46px;',
  'display:grid;place-items:center;pointer-events:none;color:var(--sp-ink-2);',
  'transition:color 200ms var(--sp-ease);',
'}',
'.spsearch input:focus ~ .spsearch__ico{color:var(--sp-ink)}',
'.spsearch__ico svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}',
'.spsearch__clear{',
  'position:absolute;right:2px;top:50%;transform:translateY(-50%);',
  'width:42px;height:42px;display:none;place-items:center;',
  'border:0;background:none;border-radius:999px;cursor:pointer;color:var(--sp-ink-2);',
  'transition:background-color 160ms var(--sp-ease), color 160ms var(--sp-ease);',
'}',
'.spsearch.has-value .spsearch__clear{display:grid}',
'@media (hover:hover){.spsearch__clear:hover{background:rgba(var(--ink-rgb),.05);color:var(--sp-ink)}}',
'.spsearch__clear:focus-visible{outline:2px solid var(--sp-ink);outline-offset:-4px}',
'.spsearch__clear svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round}',

'@media (prefers-reduced-motion:reduce){',
  '.spmenu,.spsel__chev,.spscrim,.spsearch input,.spsearch__clear{transition-duration:1ms!important}',
'}'
].join('');

function injectCSS() {
  if (document.getElementById('sp-ui-css')) return;
  var s = document.createElement('style');
  s.id = 'sp-ui-css'; s.textContent = CSS;
  document.head.appendChild(s);
}
function svg(d, cls) {
  var g = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  g.setAttribute('viewBox', '0 0 24 24'); g.setAttribute('aria-hidden', 'true');
  if (cls) g.setAttribute('class', cls);
  g.innerHTML = d;
  return g;
}
var IC_CHEV  = '<path d="M6 9l6 6 6-6"/>';
var IC_CHECK = '<path d="M5 12.5l4.5 4.5L19 7.5"/>';
var IC_MAG   = '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>';
var IC_X     = '<path d="M6 6l12 12M18 6L6 18"/>';

var uid = 0;
var openOne = null;                       /* 한 번에 하나만 열립니다 */
var scrim = null;
function getScrim() {
  if (!scrim) { scrim = document.createElement('div'); scrim.className = 'spscrim';
                document.body.appendChild(scrim);
                scrim.addEventListener('click', function () { if (openOne) openOne.close(); }); }
  return scrim;
}
function isMobile() { return matchMedia('(max-width: 767px)').matches; }

/* ── Select ──────────────────────────────────────────────────────────── */
function upgradeSelect(native) {
  if (!native || native.__sp) return native.__sp || null;
  injectCSS();
  var id = 'spsel' + (++uid);

  var wrap = document.createElement('div');
  /* ⚠️ 페이지가 원래 select 에 걸어 둔 class 를 wrapper 가 그대로 물려받습니다.
     그래야 ".mpsel{display:none}" 같은 페이지 쪽 반응형 규칙이 승격 뒤에도 계속 먹습니다.
     (물려받지 않으면 모바일 전용 select 가 데스크톱에서 그대로 노출됩니다.) */
  wrap.className = ('spsel ' + (native.getAttribute('class') || '')).trim();
  native.parentNode.insertBefore(wrap, native);
  native.classList.add('spsel__native');
  native.setAttribute('tabindex', '-1');
  native.setAttribute('aria-hidden', 'true');
  wrap.appendChild(native);

  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'spsel__btn';
  btn.id = id + '-btn';
  btn.setAttribute('aria-haspopup', 'listbox');
  btn.setAttribute('aria-expanded', 'false');
  if (native.id) btn.setAttribute('aria-labelledby',
    (document.querySelector('label[for="' + native.id + '"]') ? native.id + '-lab ' : '') + id + '-btn');
  var lab = document.querySelector('label[for="' + native.id + '"]');
  if (lab && !lab.id) lab.id = native.id + '-lab';
  var valsEl = document.createElement('span'); valsEl.className = 'spsel__vals';
  var valEl = document.createElement('span'); valEl.className = 'spsel__val';
  valsEl.appendChild(valEl);
  btn.appendChild(valsEl);
  btn.appendChild(svg(IC_CHEV, 'spsel__chev'));
  wrap.appendChild(btn);

  var menu = document.createElement('div');
  menu.className = 'spmenu';
  menu.id = id + '-menu';
  menu.setAttribute('role', 'listbox');
  menu.setAttribute('aria-labelledby', btn.id);
  var grab = document.createElement('span'); grab.className = 'spmenu__grab';
  menu.appendChild(grab);
  document.body.appendChild(menu);          /* 부모 overflow 에 잘리지 않도록 body 직속 */
  btn.setAttribute('aria-controls', menu.id);

  var opts = [], cursor = -1, open = false;

  function build() {
    [].slice.call(menu.querySelectorAll('.spmenu__opt,.spmenu__cap')).forEach(function (e) { e.remove(); });
    opts = [];
    var lastGroup = null;
    [].slice.call(native.options).forEach(function (o, i) {
      /* <optgroup> 이 있으면 메뉴에도 같은 그룹 캡션을 세웁니다 —
         데스크톱 좌측 내비게이션과 모바일 드롭다운의 정보 구조가 어긋나지 않도록 */
      var gp = o.parentNode && o.parentNode.tagName === 'OPTGROUP' ? o.parentNode.label : null;
      if (gp && gp !== lastGroup) {
        var cap = document.createElement('p');
        cap.className = 'spmenu__cap'; cap.textContent = gp;
        menu.appendChild(cap);
      }
      lastGroup = gp;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'spmenu__opt';
      b.setAttribute('role', 'option');
      b.setAttribute('aria-selected', String(i === native.selectedIndex));
      if (o.disabled) b.disabled = true;
      var t = document.createElement('span'); t.className = 'spmenu__t'; t.textContent = o.textContent;
      b.appendChild(t);
      b.appendChild(svg(IC_CHECK, 'spmenu__ck'));
      b.addEventListener('click', function () { pick(i); });
      menu.appendChild(b); opts.push(b);
    });
    /* 트리거 폭 고정용 ghost — 옵션이 다시 그려질 때(언어 전환 등) 함께 갱신합니다 */
    [].slice.call(valsEl.querySelectorAll('.spsel__ghost')).forEach(function (e) { e.remove(); });
    [].slice.call(native.options).forEach(function (o) {
      var g = document.createElement('span');
      g.className = 'spsel__ghost';
      g.setAttribute('aria-hidden', 'true');
      g.textContent = o.textContent;
      valsEl.appendChild(g);
    });
    paint();
  }
  function paint() {
    var o = native.options[native.selectedIndex];
    var txt = o ? o.textContent : '';
    valEl.textContent = txt;
    /* 값이 비어 있는 첫 옵션은 placeholder 로 취급합니다 */
    valEl.classList.toggle('is-ph', !!(o && o.value === ''));
    opts.forEach(function (b, i) { b.setAttribute('aria-selected', String(i === native.selectedIndex)); });
  }
  function pick(i) {
    if (native.options[i] && native.options[i].disabled) return;
    native.selectedIndex = i;
    paint();
    native.dispatchEvent(new Event('change', { bubbles: true }));
    close(); btn.focus();
  }
  function place() {
    if (isMobile() && opts.length > 3) { menu.classList.add('is-sheet'); return; }
    menu.classList.remove('is-sheet');
    var r = btn.getBoundingClientRect();
    var vh = document.documentElement.clientHeight;
    var vw = document.documentElement.clientWidth;
    menu.style.width = Math.round(r.width) + 'px';
    menu.style.minWidth = Math.round(r.width) + 'px';
    var mh = menu.offsetHeight || 200;
    var below = vh - r.bottom - 12, up = below < mh && r.top > mh + 12;
    menu.classList.toggle('is-up', up);
    menu.style.top = up ? '' : Math.round(r.bottom + 8) + 'px';
    menu.style.bottom = up ? Math.round(vh - r.top + 8) + 'px' : '';
    /* 좌우가 화면 밖으로 나가지 않게 */
    var left = Math.min(Math.max(12, r.left), vw - Math.round(r.width) - 12);
    menu.style.left = Math.round(left) + 'px';
  }
  function doOpen() {
    if (open) return;
    if (openOne && openOne !== api) openOne.close();
    build(); open = true;
    menu.classList.add('is-open');
    getScrim().classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    wrap.classList.add('is-open');
    place();
    cursor = native.selectedIndex;
    focusCursor();
    openOne = api;
    addEventListener('resize', place); addEventListener('scroll', place, true);
  }
  function close() {
    if (!open) return;
    open = false;
    menu.classList.remove('is-open');
    getScrim().classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    wrap.classList.remove('is-open');
    if (openOne === api) openOne = null;
    removeEventListener('resize', place); removeEventListener('scroll', place, true);
  }
  function focusCursor() {
    opts.forEach(function (b, i) { b.classList.toggle('is-cursor', i === cursor); });
    if (opts[cursor]) opts[cursor].scrollIntoView({ block: 'nearest' });
  }
  function move(d) {
    if (!opts.length) return;
    var i = cursor;
    for (var n = 0; n < opts.length; n++) {
      i = (i + d + opts.length) % opts.length;
      if (!opts[i].disabled) break;
    }
    cursor = i; focusCursor();
  }

  btn.addEventListener('click', function () { open ? close() : doOpen(); });
  btn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) { doOpen(); return; }
      if (e.key === 'Enter' || e.key === ' ') pick(cursor);
      else move(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Escape' && open) { e.preventDefault(); close(); }
    else if (e.key === 'Home' && open) { e.preventDefault(); cursor = 0; focusCursor(); }
    else if (e.key === 'End' && open) { e.preventDefault(); cursor = opts.length - 1; focusCursor(); }
  });
  document.addEventListener('click', function (e) {
    if (!open) return;
    if (wrap.contains(e.target) || menu.contains(e.target)) return;
    close();
  });

  var api = {
    el: wrap, native: native, menu: menu,
    close: close, refresh: function () { build(); },
    destroy: function () { close(); menu.remove(); }
  };
  native.__sp = api;
  /* 화면 코드가 옵션을 다시 그리거나 값을 바꿔도 따라오게 */
  native.addEventListener('change', paint);
  new MutationObserver(function () { if (!open) paint(); else build(); })
    .observe(native, { childList: true, subtree: true, attributes: true, attributeFilter: ['value'] });
  build();
  return api;
}

/* ── Search ──────────────────────────────────────────────────────────── */
function upgradeSearch(input, opts) {
  if (!input || input.__sp) return input.__sp || null;
  injectCSS();
  opts = opts || {};
  var host = input.parentNode;
  var wrap = document.createElement('div');
  wrap.className = 'spsearch';
  host.insertBefore(wrap, input);
  wrap.appendChild(input);
  /* 페이지가 직접 붙여 둔 장식용 아이콘은 제거합니다 — 여기서 다시 그립니다.
     (남겨 두면 Clear 버튼 위에 겹쳐 클릭을 가로챕니다) */
  [].slice.call(host.children).forEach(function (c) {
    if (c === wrap) return;
    var cls = (c.className || '').toString();
    if (c.getAttribute && c.getAttribute('aria-hidden') === 'true' && /icon|ico/i.test(cls)) c.remove();
  });
  input.type = 'search';
  input.setAttribute('inputmode', 'search');
  input.setAttribute('autocomplete', 'off');

  var ico = document.createElement('span'); ico.className = 'spsearch__ico';
  ico.appendChild(svg(IC_MAG));
  wrap.appendChild(ico);

  var clear = document.createElement('button');
  clear.type = 'button'; clear.className = 'spsearch__clear';
  clear.setAttribute('aria-label', '검색어 지우기');
  clear.appendChild(svg(IC_X));
  wrap.appendChild(clear);

  function sync() { wrap.classList.toggle('has-value', !!input.value); }
  input.addEventListener('input', sync);
  clear.addEventListener('click', function () {
    input.value = '';
    sync();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();                                  /* 포커스는 유지 */
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && input.value) {
      e.preventDefault(); input.value = ''; sync();
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  sync();
  var api = { el: wrap, input: input, sync: sync };
  input.__sp = api;
  return api;
}

/* ── 자동 적용 ───────────────────────────────────────────────────────── */
function scan(root) {
  root = root || document;
  [].slice.call(root.querySelectorAll('select:not(.spsel__native):not([data-sp-skip])'))
    .forEach(function (s) { try { upgradeSelect(s); } catch (e) {} });
  [].slice.call(root.querySelectorAll('input[type="search"]:not([data-sp-skip])'))
    .forEach(function (i) { try { upgradeSearch(i); } catch (e) {} });
}

global.SPUI = {
  select: upgradeSelect,
  search: upgradeSearch,
  scan: scan,
  injectCSS: injectCSS,
  closeAll: function () { if (openOne) openOne.close(); }
};

function boot() {
  injectCSS();
  scan(document);
  /* 화면이 동적으로 다시 그려지는 페이지(뉴스·고객지원·마이페이지)를 위해
     추가된 select / search 를 감시합니다. */
  new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      var a = list[i].addedNodes;
      for (var j = 0; j < a.length; j++) {
        if (a[j].nodeType !== 1) continue;
        if (a[j].matches && a[j].matches('select, input[type="search"]')) scan(a[j].parentNode);
        else if (a[j].querySelector && a[j].querySelector('select, input[type="search"]')) scan(a[j]);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

/* ══════════════════════════════════════════════════════════════════
   SMART HEADER — Scroll Direction Interaction
   ──────────────────────────────────────────────────────────────────
   TOP   : 상단 80px 이내 — 언제나 표시
   SHOW  : 위로 스크롤 — 표시
   HIDE  : 아래로 스크롤 — transform:translateY(-100%) 로 접힘

   · 방향 + 누적 threshold 로 판단합니다. scrollY 값을 그대로 비교하지 않으므로
     트랙패드의 미세한 흔들림에 헤더가 깜빡이지 않습니다.
   · scroll 은 passive + rAF 로 프레임당 한 번만 계산합니다.
   · display / DOM 조작 없음 → 본문 레이아웃 고정, CLS 0.
   · 드롭다운 · 드로어 · 오버레이 · 헤더 내부 포커스 중에는 절대 숨지 않습니다.
   · data-smart-header="soft" 인 페이지(로그인 · 마이페이지 · 고객지원)는
     threshold 를 크게 잡고, 입력 중에는 아예 숨기지 않습니다.
   ══════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════════
   BACK TO TOP — Secondary Utility Control
   · scrollY > 480 에서만 나타납니다 (display 토글이 아니라 opacity/transform).
   · 스크롤 판정은 Smart Header 와 같은 rAF 루프 한 번에 얹지 않고
     자체 rAF 로 프레임당 한 번만 계산합니다 (레이아웃 읽기 없음).
   · prefers-reduced-motion 에서는 smooth scroll 대신 즉시 이동합니다.
   ══════════════════════════════════════════════════════════════════ */
function backToTop() {
  if (document.querySelector('.sptop')) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sptop';
  btn.setAttribute('aria-label', '맨 위로 이동');
  btn.setAttribute('data-i18n-aria', '');   /* 언어 전환 시 sp-i18n.js 가 갱신합니다 */
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6"/><path d="M6 12l6-6 6 6"/></svg>';
  document.body.appendChild(btn);

  var SHOW = 480, on = false, queued = false;
  function read() {
    queued = false;
    var next = (window.pageYOffset || document.documentElement.scrollTop || 0) > SHOW;
    if (next === on) return;
    on = next;
    btn.classList.toggle('is-on', on);
  }
  function onScroll() { if (queued) return; queued = true; requestAnimationFrame(read); }

  btn.addEventListener('click', function () {
    /* 사이트의 스크롤 연동 애니메이션과 충돌하지 않도록 네이티브 스크롤만 씁니다 */
    try { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }
    catch (e) { window.scrollTo(0, 0); }
  });

  read();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
}

function smartHeader() {
  var header = document.getElementById('header') || document.querySelector('.header');
  if (!header) return;
  var root = document.documentElement;
  var soft = document.body.getAttribute('data-smart-header') === 'soft';

  /* 입력 중심 페이지(로그인 · 마이페이지 · 고객지원)는 상단 안전 구간을 크게 잡습니다 —
     스크롤 폭이 짧은 폼 화면에서 헤더가 쉽게 사라지지 않도록 (§14) */
  var TOP_ZONE = soft ? 240 : 80;    /* 이 안에서는 무조건 보입니다 */
  var DOWN_T   = soft ? 72 : 12;     /* 숨기기까지 필요한 누적 하향 이동 */
  var UP_T     = 8;                  /* 다시 보이기까지 필요한 누적 상향 이동 */

  /* 열려 있으면 방향과 무관하게 헤더를 붙잡아 두는 것들 */
  var HOLD_SEL = '.header__lang.is-open,.sp-menu.is-open,.spmenu.is-open,.hdrop.is-open,' +
                 '.spsel.is-open,.spscrim.is-open,.sp-scrim.is-open';
  var EDIT_SEL = 'input,textarea,select,[contenteditable="true"]';

  var lastY = 0, accDown = 0, accUp = 0, hidden = false, queued = false;

  function held() {
    if (header.classList.contains('is-held')) return true;        /* SPHeader.hold(true) */
    if (root.classList.contains('is-menu')) return true;          /* 모바일 드로어 */
    /* ⚠️ 헤더 안에 "포커스가 있으면" 무조건 붙잡으면, 마우스로 언어 버튼을 한 번
       누른 뒤에는 포커스가 헤더에 남아 헤더가 영영 숨지 않습니다(실측).
       그래서 키보드 포커스(:focus-visible)일 때만 붙잡습니다. */
    var af = document.activeElement;
    if (af && header.contains(af)) {
      try { if (af.matches(':focus-visible')) return true; }
      catch (e) { return true; }                                  /* 미지원 브라우저는 보수적으로 */
    }
    if (header.querySelector('[aria-expanded="true"]')) return true;
    if (document.querySelector(HOLD_SEL)) return true;            /* 드롭다운 · 시트 · 스크림 */
    if (soft) {
      var ae = document.activeElement;
      if (ae && ae.matches && ae.matches(EDIT_SEL)) return true;  /* 입력 중 */
    }
    return false;
  }

  function set(h) {
    if (h === hidden) return;
    hidden = h;
    header.classList.toggle('is-hidden', h);
  }

  function read() {
    queued = false;
    var y = window.pageYOffset || root.scrollTop || 0;
    if (y < 0) y = 0;                                   /* iOS 러버밴드 */
    var dy = y - lastY;
    lastY = y;

    if (held() || y <= TOP_ZONE) { set(false); accDown = accUp = 0; return; }

    if (dy > 0)      { accDown += dy; accUp = 0;   if (accDown > DOWN_T) set(true); }
    else if (dy < 0) { accUp -= dy;   accDown = 0; if (accUp   > UP_T)   set(false); }
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(read);
  }

  /* 스크롤 중이 아닐 때 열리고 닫히는 것들(드롭다운·시트·포커스)도 즉시 반영 */
  function recheck() { if (held()) set(false); }

  lastY = window.pageYOffset || 0;
  read();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('focusin', recheck, true);
  document.addEventListener('pointerup', function () { setTimeout(recheck, 0); }, true);
  addEventListener('pageshow', function () { lastY = window.pageYOffset || 0; read(); });

  /* 페이지 쪽에서 필요할 때 직접 붙잡아 둘 수 있게 (모달 등) */
  global.SPHeader = {
    show: function () { set(false); },
    hold: function (on) { header.classList.toggle('is-held', !!on); if (on) set(false); },
    isHidden: function () { return hidden; }
  };
}

/* ══ Theme toggle ══════════════════════════════════════════════════════════
   실제 테마 적용/저장은 assets/sp-theme.js 가 <head> 에서 이미 끝냈습니다.
   여기서는 헤더 버튼만 연결하고 aria-label 을 상태에 맞게 갱신합니다.
   (SPTheme 은 light / dark / system 3단계를 지원하지만, 헤더 UI 는
    요청대로 단순 토글입니다 — 나중에 Dropdown 으로 바꿔도 이 함수만 고치면 됩니다) */
function themeToggle() {
  var T = global.SPTheme;
  if (!T) return;

  var btns = [].slice.call(document.querySelectorAll('#themeBtn, [data-sp-theme-toggle]'));
  /* 세그먼트 컨트롤 — 모바일 메뉴의 [ 라이트 | 다크 ].
     같은 SPTheme 하나만 보므로 PC 헤더 토글과 상태가 절대 갈라지지 않습니다. */
  var segs = [].slice.call(document.querySelectorAll('[data-theme-set]'));
  if (!btns.length && !segs.length) return;

  function label(resolved) {
    var ko = resolved === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';
    return (global.SPI18N && global.SPI18N.get() === 'en') ? global.SPI18N.t(ko) : ko;
  }
  /* 언어가 바뀌면 라벨도 다시 씁니다 */
  if (global.SPI18N && global.SPI18N.subscribe) {
    global.SPI18N.subscribe(function () { paintLabels(); });
  }
  function paintLabels() {
    var r = T.resolved();
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-label', label(r));
      btns[i].setAttribute('title', label(r));
      btns[i].setAttribute('aria-pressed', r === 'dark' ? 'true' : 'false');
    }
    for (var j = 0; j < segs.length; j++) {
      var on = segs[j].getAttribute('data-theme-set') === r;
      segs[j].setAttribute('aria-checked', on ? 'true' : 'false');
      segs[j].classList.toggle('is-on', on);
    }
  }
  T.subscribe(paintLabels);
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      T.toggle();
      /* 헤더가 스크롤 방향에 따라 숨는 구간에서 눌러도 버튼이 사라지지 않게 */
      if (global.SPHeader) global.SPHeader.show();
    });
  });
  segs.forEach(function (b) {
    b.addEventListener('click', function () { T.set(b.getAttribute('data-theme-set')); });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ boot(); smartHeader(); backToTop(); themeToggle(); });
else { boot(); smartHeader(); backToTop(); themeToggle(); }

})(window);
