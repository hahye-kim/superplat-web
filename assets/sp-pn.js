/* ══════════════════════════════════════════════════════════════════════════
   SuperPlat — 상세보기 「이전 / 다음」 공통 빌더
   ──────────────────────────────────────────────────────────────────────────
   공지사항 · 업데이트 · 이벤트 · 고객지원 상세가 전부 이 함수 하나를 씁니다.
   페이지마다 다른 것은 넘겨주는 data 뿐이고 UI 는 100% 동일합니다.

     SPPrevNext.build({
       prev: { title, badge, date, img, onClick } | null,
       next: { ... } | null,
       list: { label, onClick },          // "목록으로"
       labels: { prev, next }             // "이전" / "다음" (i18n 은 호출부 책임)
     })  →  DocumentFragment

   스타일은 assets/sp-pn.css 하나입니다. 페이지에서 .pn* 를 다시 정의하지 마세요.
   ══════════════════════════════════════════════════════════════════════════ */
(function (w, d) {
  'use strict';

  function el(tag, cls, txt) {
    var e = d.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function card(item, labText) {
    var c = el('button', 'pn__card' + (item.img ? '' : ' pn__card--notext'));
    c.type = 'button';

    if (item.img) {
      var th = el('span', 'pn__thumb');
      var im = d.createElement('img');
      im.src = item.img;
      im.alt = ''; im.setAttribute('aria-hidden', 'true');
      im.loading = 'lazy'; im.decoding = 'async';
      th.appendChild(im);
      c.appendChild(th);
    }

    var body = el('span', 'pn__body');
    if (item.badge) body.appendChild(el('span', 'pn__cat', item.badge));
    var t = el('span', 'pn__t', item.title);
    if (item.lang) t.setAttribute('lang', item.lang);
    body.appendChild(t);
    if (item.date) body.appendChild(el('span', 'pn__d', item.date));
    c.appendChild(body);

    c.setAttribute('aria-label', labText + ' — ' + item.title);
    if (item.onClick) c.addEventListener('click', item.onClick);
    return c;
  }

  function col(item, labText) {
    var wrap = el('div', 'pn__col');
    wrap.appendChild(el('p', 'pn__lab', labText));
    wrap.appendChild(card(item, labText));
    return wrap;
  }

  function build(o) {
    o = o || {};
    var L = o.labels || {};
    var frag = d.createDocumentFragment();

    /* ⚠️ 없는 쪽은 빈 카드를 남기지 않고 통째로 뺍니다.
       한쪽만 남으면 .pn--one 으로 전체 폭을 써서 반쪽에 붙어 보이지 않게 합니다. */
    var have = (o.prev ? 1 : 0) + (o.next ? 1 : 0);
    if (have) {
      var box = el('div', 'pnwrap');
      var grid = el('div', 'pn' + (have === 1 ? ' pn--one' : ''));
      grid.setAttribute('aria-label', L.nav || 'Post navigation');
      if (o.prev) grid.appendChild(col(o.prev, L.prev || '이전'));
      if (o.next) grid.appendChild(col(o.next, L.next || '다음'));
      box.appendChild(grid);
      frag.appendChild(box);
    }

    if (o.list) {
      var bw = el('div', 'backwrap');
      var bb = el('button', 'pn__list', o.list.label || '목록으로');
      bb.type = 'button';
      if (o.list.onClick) bb.addEventListener('click', o.list.onClick);
      bw.appendChild(bb);
      frag.appendChild(bw);
    }
    return frag;
  }

  w.SPPrevNext = { build: build };
})(window, document);
