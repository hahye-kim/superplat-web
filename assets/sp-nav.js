/* ══════════════════════════════════════════════════════════════════════════
   SuperPlat — Mobile Navigation  (모바일 전용 풀스크린 메뉴)

   왜 JS 로 만드나
     드로어 마크업이 8개 페이지에 그대로 복제돼 있었습니다. 아코디언 · 사용자
     영역 · CTA 까지 들어가면 복제본을 8벌 관리하게 되므로, **구조는 여기서
     한 번만** 만들고 페이지에는 <div id="drawer"> 껍데기와 기존 <a> 4개만
     남깁니다.

   기존 <a> 를 "다시 만들지 않고 그대로 옮겨" 씁니다
     페이지마다 href 가 다르고(index 는 #about, 나머지는 index.html#about),
     aria-current="page" 로 현재 위치가 이미 표시돼 있으며,
     data-i18n 으로 각 페이지 setLang() 이 텍스트를 갈아끼웁니다.
     노드를 그대로 이동시키면 이 세 가지가 전부 살아남습니다.

   상태는 전부 기존 전역 하나만 봅니다
     테마    SPTheme   (localStorage['sp.theme'])
     언어    SPI18N    (localStorage['sp.locale'])
     로그인  SPAuth.on (localStorage['sp.proto.session'])
     → 모바일 메뉴가 별도 상태를 만들지 않습니다.

   ⚠️ PC(≥992px)에는 영향이 없습니다. 이 파일이 만드는 요소는 전부
      #drawer 안에 있고, #drawer 는 @media(min-width:992px) 에서 display:none 입니다.
   ══════════════════════════════════════════════════════════════════════════ */
(function (w, d) {
  'use strict';

  /* 이 파일은 <body> 안(드로어 마크업보다 위)에서 로드되므로
     DOM 이 다 그려진 뒤에 시작합니다. */
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();

  function boot() {

  var root = d.documentElement;
  var drawer = d.getElementById('drawer');
  if (!drawer) return;

  function t(ko) { return (w.SPI18N && w.SPI18N.t) ? w.SPI18N.t(ko) : ko; }
  function el(tag, cls) { var e = d.createElement(tag); if (cls) e.className = cls; return e; }

  /* 아이콘 — Bootstrap Icons(fill 기반) 원본 path */
  var ICON = {
    chev: '<svg class="mnav__ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',
    right:'<svg class="mnav__ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',
    person:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>',
    down: '<svg class="mnav__cta-ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg>'
  };

  /* 하위 메뉴 — 각 페이지의 탭(data-cat)과 같은 id 를 씁니다.
     news.html#notice 처럼 열면 해당 탭이 바로 선택됩니다(아래 §hash). */
  /* 모바일 Full Menu 의 1Depth 라벨 — KO / EN 어느 쪽이든 영문 표기를 씁니다.
     ⚠️ PC 헤더는 그대로입니다. 여기서 옮겨 온 <a> 노드의 data-i18n 바인딩만
        끊고 라벨을 고정하므로, 언어를 바꿔도 이 네 개는 영문으로 유지됩니다. */
  var MLABEL = { '':'ABOUT', 'index.html':'ABOUT', 'world.html':'WORLD & IP',
                 'news.html':'NEWS', 'support.html':'SUPPORT' };
  function mobileLabel(href) {
    var h = String(href || '');
    if (h.indexOf('#about') > -1) return 'ABOUT';
    return MLABEL[pageOf(h)] || null;
  }

  var SUB = {
    'news.html':    [['notice', '공지사항'], ['update', '업데이트'], ['event', '이벤트']],
    'support.html': [['faq', 'FAQ'], ['inquiry', '1:1 문의'], ['download', '다운로드']]
  };

  /* href 에서 페이지 파일명만 뽑습니다 (index 는 '#about' 처럼 파일명이 없습니다) */
  function pageOf(href) {
    var m = String(href || '').match(/([a-z0-9-]+\.html)/i);
    return m ? m[1].toLowerCase() : '';
  }

  /* ── 1. 구조 만들기 ──────────────────────────────────────────────────── */
  var links = [].slice.call(drawer.querySelectorAll('.drawer__nav a'));
  if (!links.length) return;

  var oldFoot = drawer.querySelector('.drawer__foot');
  var ctaHref = 'index.html#download';
  var loginHref = 'auth.html';
  if (oldFoot) {
    var oc = oldFoot.querySelector('.drawer__cta');
    var ol = oldFoot.querySelector('.drawer__login');
    if (oc) ctaHref = oc.getAttribute('href') || ctaHref;
    if (ol) loginHref = ol.getAttribute('href') || loginHref;
  }

  var scroller = el('div', 'mnav');
  var list = el('nav', 'mnav__list');
  list.setAttribute('aria-label', '모바일 메뉴');
  list.setAttribute('data-i18n-aria', '');

  links.forEach(function (a, i) {
    var item = el('div', 'mnav__item');
    var subs = SUB[pageOf(a.getAttribute('href'))];
    a.classList.add('mnav__link');
    a.style.setProperty('--i', String(i));

    /* 영문 라벨 고정 — i18n 바인딩을 끊어야 언어 전환에 덮이지 않습니다 */
    var ml = mobileLabel(a.getAttribute('href'));
    if (ml) { a.removeAttribute('data-i18n'); a.textContent = ml; }

    if (!subs) {
      /* 하위 메뉴가 없는 항목 = 바로 이동하는 Direct Link.
         오른쪽 아이콘을 두지 않습니다 — "아이콘 있음 = 펼쳐짐" 규칙을 명확히 하려고
         chevron 은 아코디언 항목에만 남깁니다. Row 전체가 클릭 영역입니다. */
      item.appendChild(a);
    } else {
      /* 하위 메뉴가 있는 항목 — row 전체가 하나의 토글 버튼입니다.
         (텍스트만 눌리던 구조를 없앴습니다. 실제 이동은 하위 링크가 담당합니다.) */
      var tog = el('button', 'mnav__row mnav__row--tog');
      tog.type = 'button';
      tog.setAttribute('aria-expanded', 'false');
      tog.style.setProperty('--i', String(i));
      var lab = el('span', 'mnav__link');
      lab.textContent = ml || a.textContent.trim();
      if (a.getAttribute('aria-current') === 'page') lab.setAttribute('aria-current', 'page');
      var chev = el('span', 'mnav__tog');
      chev.innerHTML = ICON.chev;
      tog.appendChild(lab);
      tog.appendChild(chev);
      var row = tog;

      var wrapEl = el('div', 'mnav__subwrap');
      var ul = el('ul', 'mnav__sub');
      subs.forEach(function (s) {
        var li = d.createElement('li');
        var sa = d.createElement('a');
        sa.className = 'mnav__sublink';
        sa.href = pageOf(a.getAttribute('href')) + '#' + s[0];
        sa.textContent = s[1];
        sa.setAttribute('data-i18n-ko', '');
        li.appendChild(sa);
        ul.appendChild(li);
      });
      wrapEl.appendChild(ul);
      wrapEl.hidden = true;

      var id = 'mnavsub' + i;
      wrapEl.id = id;
      tog.setAttribute('aria-controls', id);
      tog.setAttribute('aria-label', (ml || a.textContent.trim()) + ' 하위 메뉴');

      /* 현재 보고 있는 페이지의 아코디언은 처음부터 펼쳐 둡니다 */
      if (a.getAttribute('aria-current') === 'page') openAcc(tog, wrapEl, false);

      tog.addEventListener('click', function () {
        var open = tog.getAttribute('aria-expanded') === 'true';
        if (open) closeAcc(tog, wrapEl, true); else openAcc(tog, wrapEl, true);
      });

      item.appendChild(row);
      item.appendChild(wrapEl);
      item.classList.add('has-sub');
    }
    list.appendChild(item);
  });

  /* ── 사용자 영역 ─────────────────────────────────────────────────────── */
  var div1 = el('div', 'mnav__div');

  var user = d.createElement('a');
  user.className = 'mnav__user';
  user.href = loginHref;
  user.innerHTML =
    '<span class="mnav__ava">' + ICON.person + '</span>' +
    '<span class="mnav__utext"><span class="mnav__utitle"></span><span class="mnav__usub"></span></span>' +
    '<span class="mnav__mark">' + ICON.right + '</span>';

  var logout = d.createElement('button');
  logout.type = 'button';
  logout.className = 'mnav__logout';
  logout.hidden = true;

  var cta = d.createElement('a');
  cta.className = 'mnav__cta';
  cta.href = ctaHref;
  cta.innerHTML = '<span class="mnav__cta-t"></span>' + ICON.down;

  var end = el('div', 'mnav__end');
  end.appendChild(div1);
  end.appendChild(user);
  end.appendChild(logout);
  end.appendChild(cta);

  scroller.appendChild(list);
  scroller.appendChild(end);

  drawer.innerHTML = '';
  drawer.appendChild(scroller);

  /* ── 2. 아코디언 ─────────────────────────────────────────────────────── */
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'cubic-bezier(.22,1,.36,1)';

  function openAcc(tog, box, animate) {
    tog.setAttribute('aria-expanded', 'true');
    box.hidden = false;
    if (!animate || reduce) { box.style.height = 'auto'; box.style.opacity = '1'; return; }
    var h = box.scrollHeight;
    box.style.height = '0px'; box.style.opacity = '0';
    void box.offsetHeight;                       /* 시작값을 확정한 뒤 전환 */
    box.style.transition = 'height 230ms ' + EASE + ', opacity 230ms ' + EASE;
    box.style.height = h + 'px'; box.style.opacity = '1';
    w.clearTimeout(box.__t);
    box.__t = w.setTimeout(function () {
      box.style.transition = ''; box.style.height = 'auto';   /* 이후 내용이 바뀌어도 안전하게 */
    }, 250);
  }
  function closeAcc(tog, box, animate) {
    tog.setAttribute('aria-expanded', 'false');
    if (!animate || reduce) { box.hidden = true; box.style.height = ''; box.style.opacity = ''; return; }
    box.style.transition = 'none';
    box.style.height = box.scrollHeight + 'px';
    void box.offsetHeight;
    box.style.transition = 'height 210ms ' + EASE + ', opacity 210ms ' + EASE;
    box.style.height = '0px'; box.style.opacity = '0';
    w.clearTimeout(box.__t);
    box.__t = w.setTimeout(function () {
      box.hidden = true; box.style.transition = ''; box.style.height = ''; box.style.opacity = '';
    }, 220);
  }

  /* ── 3. 언어 · 텍스트 ───────────────────────────────────────────────── */
  function paintText() {
    var signed = !!lastUser;
    user.querySelector('.mnav__utitle').textContent = signed ? t('마이페이지') : t('로그인');
    var sub = user.querySelector('.mnav__usub');
    if (signed) {
      sub.textContent = lastUser.email || '';
      sub.hidden = false;
    } else {
      sub.textContent = t('아직 계정이 없다면 회원가입');
      sub.hidden = false;
    }
    user.setAttribute('aria-label', signed ? t('마이페이지') : t('로그인'));
    logout.textContent = t('로그아웃');
    cta.querySelector('.mnav__cta-t').textContent = t('SuperPlat 다운로드');
    if (w.SPI18N && w.SPI18N.refresh) w.SPI18N.refresh();
  }

  /* ── 4. 로그인 상태 ─────────────────────────────────────────────────── */
  var lastUser = null;
  function paintUser(u) {
    lastUser = u || null;
    var ava = user.querySelector('.mnav__ava');
    if (u) {
      user.href = 'mypage.html';
      if (u.avatar) {
        ava.innerHTML = '<img alt="" aria-hidden="true">';
        ava.querySelector('img').src = u.avatar;
        ava.classList.add('has-img');
      } else {
        ava.innerHTML = ICON.person;
        ava.classList.remove('has-img');
      }
      logout.hidden = false;
    } else {
      user.href = loginHref;
      ava.innerHTML = ICON.person;
      ava.classList.remove('has-img');
      logout.hidden = true;
    }
    paintText();
  }

  logout.addEventListener('click', function () {
    if (!w.SPAuth) return;
    w.SPAuth.logout().then(function () {
      if (root.classList.contains('mypage')) location.replace('auth.html');
    });
  });

  if (w.SPAuth && w.SPAuth.on) {
    w.SPAuth.on(paintUser);
    /* ⚠️ SPAuth.me() 는 Promise 가 아니라 사용자 객체를 바로 돌려줍니다.
       (다른 Adapter 로 갈아끼우면 Promise 가 될 수 있으니 둘 다 받습니다) */
    var got = null;
    try { got = w.SPAuth.me(); } catch (e) { got = null; }
    if (got && typeof got.then === 'function') got.then(paintUser, function () { paintUser(null); });
    else paintUser(got || null);
  } else {
    paintUser(null);
  }

  if (w.SPI18N && w.SPI18N.subscribe) w.SPI18N.subscribe(paintText);
  paintText();

  /* 메뉴 안의 링크를 누르면 메뉴를 닫습니다 (같은 페이지 해시 이동 포함).
     아코디언 토글 버튼은 제외 — 펼치기만 하고 닫히면 안 됩니다. */
  drawer.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a || !drawer.contains(a)) return;
    if (root.classList.contains('is-menu')) {
      var burger = d.getElementById('burger');
      if (burger) burger.click();
    }
  });

  /* ── 5. 해시로 하위 탭 열기 (news / support) ────────────────────────── */
  function selectTabFromHash() {
    var h = (location.hash || '').replace('#', '');
    if (!h) return;
    var tabs = [].slice.call(d.querySelectorAll('.ntab, .stab'));
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].dataset.cat === h) {
        tabs[i].click();
        var bar = tabs[i].closest ? tabs[i].closest('.nbar, .sbar') : null;
        if (bar && bar.scrollIntoView) bar.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
        return;
      }
    }
  }
  w.addEventListener('hashchange', selectTabFromHash);
  w.setTimeout(selectTabFromHash, 60);          /* 페이지 스크립트가 탭을 그린 뒤 */

  /* ══ 6. PC 헤더 Hover Dropdown ═════════════════════════════════════════
     ⚠️ 위 모바일 아코디언과 **같은 SUB 데이터**로 만듭니다.
        PC 와 모바일 메뉴 내용이 서로 달라질 수 없습니다 (§10).
        하위 메뉴가 없는 About / World & IP 에는 아무 것도 붙이지 않습니다. */
  (function pcDropdowns() {
    var nav = d.querySelector('.header__nav');
    if (!nav) return;
    var groups = [];
    var CLOSE_MS = 150;                    /* Hover 이탈 후 닫히기까지 (§7) */

    [].slice.call(nav.querySelectorAll('.header__link')).forEach(function (a) {
      var subs = SUB[pageOf(a.getAttribute('href'))];
      if (!subs) return;

      var wrap = el('div', 'hdrop');
      a.parentNode.insertBefore(wrap, a);
      wrap.appendChild(a);
      a.setAttribute('aria-haspopup', 'true');
      a.setAttribute('aria-expanded', 'false');

      var menu = el('div', 'hdrop__menu');
      menu.setAttribute('role', 'menu');
      menu.setAttribute('aria-label', a.textContent.trim());
      subs.forEach(function (s) {
        var sa = d.createElement('a');
        sa.className = 'hdrop__item';
        sa.setAttribute('role', 'menuitem');
        sa.href = pageOf(a.getAttribute('href')) + '#' + s[0];
        sa.textContent = s[1];
        sa.setAttribute('data-i18n-ko', '');
        menu.appendChild(sa);
      });
      wrap.appendChild(menu);

      var g = { wrap: wrap, link: a, menu: menu, timer: 0 };
      groups.push(g);

      function open() {
        if (g.lock) return;              /* ESC 직후 focus() 로 다시 열리는 것을 막습니다 */
        w.clearTimeout(g.timer);
        groups.forEach(function (o) { if (o !== g) close(o, true); });
        g.wrap.classList.add('is-open');
        g.link.setAttribute('aria-expanded', 'true');
      }
      function scheduleClose() {
        w.clearTimeout(g.timer);
        g.timer = w.setTimeout(function () { close(g, true); }, CLOSE_MS);
      }
      wrap.addEventListener('mouseenter', open);
      wrap.addEventListener('mouseleave', scheduleClose);
      /* 키보드 — Hover 에만 의존하지 않습니다 (§9) */
      wrap.addEventListener('focusin', open);
      wrap.addEventListener('focusout', function (e) {
        if (!wrap.contains(e.relatedTarget)) close(g, true);
      });
    });

    function close(g, immediate) {
      w.clearTimeout(g.timer);
      g.wrap.classList.remove('is-open');
      g.link.setAttribute('aria-expanded', 'false');
    }
    function closeAll() { groups.forEach(function (g) { close(g, true); }); }

    if (!groups.length) return;
    d.addEventListener('click', function (e) {
      for (var i = 0; i < groups.length; i++) if (groups[i].wrap.contains(e.target)) return;
      closeAll();
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var open = groups.filter(function (g) { return g.wrap.classList.contains('is-open'); })[0];
        if (open) {
          closeAll();
          /* 포커스를 되돌려 주되, 그 focusin 이 다시 열지 않도록 잠깐 잠급니다 */
          open.lock = true;
          open.link.focus();
          w.setTimeout(function () { open.lock = false; }, 0);
        }
      }
    });
    /* 드롭다운 안의 링크를 누르면 바로 닫습니다 (같은 페이지 해시 이동 포함) */
    groups.forEach(function (g) {
      g.menu.addEventListener('click', function () { closeAll(); });
    });
    if (w.SPI18N && w.SPI18N.refresh) w.SPI18N.refresh();
  })();

  w.SPNav = { paintUser: paintUser, refresh: paintText };

  }
})(window, document);
