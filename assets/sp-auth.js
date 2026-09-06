/* ══════════════════════════════════════════════════════════════════════════
   SuperPlat — sp-auth.js
   공통 Account / Session 모듈

   ⚠️⚠️⚠️  PROTOTYPE ONLY — 실제 서비스 인증 구현이 아님  ⚠️⚠️⚠️

   이 파일은 "회원가입 → 이메일 인증 → 로그인 → 세션 → Header → 마이페이지 →
   정보 수정 → 로그아웃" 까지의 **UX 흐름을 클릭으로 체험**하기 위한 것입니다.
   보안 목적의 인증 시스템이 아니며, 아래 항목은 실제 서비스에서 절대 사용하면
   안 됩니다.

     · 비밀번호를 브라우저 localStorage 에 **평문으로** 저장합니다.
       (실서비스: 비밀번호는 클라이언트에 저장하지 않습니다. 서버에서 salt +
        bcrypt/argon2 로 해싱해 보관하고, 클라이언트는 세션 토큰만 갖습니다.)
     · 세션이 서명·만료·검증 없이 그냥 JSON 한 덩어리입니다.
       (실서비스: HttpOnly · Secure · SameSite 쿠키 + 서버 세션/JWT 검증)
     · 라우트 가드가 클라이언트 JS 입니다. 콘솔에서 우회할 수 있습니다.
       (실서비스: 서버가 응답 자체를 막아야 합니다.)
     · 이메일 인증번호를 서버 없이 클라이언트가 만들어 냅니다. (DEV_CODE_HINT)
       화면에는 노출하지 않고 개발자 콘솔로만 보냅니다 — auth.html 의 api()
       참고. 실서비스에서는 이 플래그를 false 로 두고 메일 발송으로 바꿉니다.

   ── 테스트 계정 (UI 에는 절대 노출하지 않습니다) ──────────────────────────
   seed() 가 심는 Mock 사용자 한 명이 아래 DEMO 상수로 정의돼 있습니다.
   로그인 화면에는 어떤 안내도 없고, 로그인 실패 메시지도 계정을 알려주지
   않습니다. QA 는 일반 로그인 폼에 직접 입력해서 들어옵니다.
   Adapter 를 실제 서버 API 로 바꾸는 순간 seed() · DEMO · Store 는 통째로
   삭제하면 됩니다 — 화면 코드는 한 줄도 바뀌지 않습니다.

   ── 실제 Backend 로 교체하는 법 ────────────────────────────────────────────
   화면 코드(auth.html · mypage.html · header)는 전부 아래 Adapter 만 호출합니다.
   따라서 UI 는 한 줄도 고치지 않고 이 파일의 `Adapter` 객체 안쪽만
   fetch 호출로 바꾸면 됩니다.

       Adapter.signup / login / logout / me / update / changePassword /
              sendCode / verifyCode / checkEmail / checkNick / resetPassword

   예)  login: function (email, pw) {
          return fetch('/api/login', { method:'POST', credentials:'include',
                   headers:{'Content-Type':'application/json'},
                   body: JSON.stringify({ email:email, password:pw }) })
                 .then(function (r) { if (!r.ok) throw new Error('credentials');
                                      return r.json(); });
        }
   그때 Store(localStorage) 부분과 DEV_CODE_HINT 는 통째로 삭제하면 됩니다.
   ══════════════════════════════════════════════════════════════════════════ */
(function (global) {
'use strict';

/* 공용 i18n — assets/sp-i18n.js 가 있으면 한국어 원문을 키로 영문을 찾습니다.
   없으면 원문을 그대로 돌려주므로 이 모듈 단독으로도 동작합니다. */
function TT(ko) {
  return (global.SPI18N && global.SPI18N.get() === 'en') ? global.SPI18N.t(ko) : ko;
}

/* ── 0. 설정 ──────────────────────────────────────────────────────────────
   정책값이 확정되지 않은 항목은 전부 여기 모아두었습니다.
   UI 는 이 값만 보고 그리므로, 정책이 정해지면 이 객체만 고치면 됩니다.      */
var CONFIG = {
  /* ⚠️ PROTOTYPE ONLY — 실제 서비스 인증 구현이 아닙니다.
     화면(Production UI)에는 프로토타입 · 데모 · 테스트 관련 문구를
     어떤 형태로도 노출하지 않습니다. 아래 두 스위치는 화면이 아니라
     "QA 가 플로우를 끝까지 진행할 수 있는가" 만 제어합니다.           */
  DEMO_UI: false,         /* 로그인 화면의 데모 계정 안내 카드 — 제거됨(항상 false)
                             데모 계정 자체는 QA 용으로 살아 있어서
                             SPAuth.DEMO 의 이메일/비밀번호로 그냥 로그인됩니다. */
  DEV_CODE_HINT: true,    /* 메일 서버가 없으므로 인증번호를 발급합니다.
                             표시 위치는 화면이 아니라 개발자 콘솔뿐입니다.
                             실제 서비스에서는 false + 메일 발송으로 교체하세요. */

  latencyMs: 620,         /* 서버 왕복을 흉내내는 지연 — 로딩 상태 확인용 */
  codeTtlSec: 180,        /* 인증번호 유효 시간 */
  resendCooldownSec: 30,  /* 재전송 쿨다운 */
  codeLength: 6,

  /* 비밀번호 정책 — 8~20자 / 영문 / 숫자 / 특수문자 */
  password: {
    min: 8, max: 20,
    rules: [
      { id:'len', ko:'8~20자',       en:'8–20 characters',    test:function (v) { return v.length >= 8 && v.length <= 20; } },
      { id:'abc', ko:'영문 포함',     en:'A letter',           test:function (v) { return /[A-Za-z]/.test(v); } },
      { id:'num', ko:'숫자 포함',     en:'A number',           test:function (v) { return /\d/.test(v); } },
      { id:'sym', ko:'특수문자 포함', en:'A special character', test:function (v) { return /[^A-Za-z0-9]/.test(v); } }
    ]
  },
  nickname: { min:2, max:12 },

  /* 프로필 이미지 — 회원가입에서는 받지 않고 마이페이지에서만 설정합니다 */
  avatar: { maxBytes: 2 * 1024 * 1024, accept: 'image/png,image/jpeg,image/webp' },

  /* ── 재화 · 정산 · 구독 ────────────────────────────────────────────
     ⚠️ 아래는 "확정된 정책"이 아니라 UI 를 그리기 위한 자리표시입니다.
        환산율 · 수수료율 · 세율 · 최소 정산액 · 정산 주기 · 지급일은
        정해진 값이 없어 비워 두었습니다. null 인 항목은 화면에서
        "정책 확정 후 안내" 로 표시되며, 숫자를 만들어 내지 않습니다.     */
  payout: {
    payableAssets: ['bean', 'wing'],  /* 정산 가능 재화 — 정책 확정 시 교체 */
    rate: null,        /* 재화 1개당 환산 금액 (원) */
    feeRate: null,     /* 수수료율 */
    taxRate: null,     /* 세금 · 공제율 */
    minQty: null,      /* 최소 정산 수량 */
    cycle: null,       /* 정산 주기 */
    payDay: null       /* 지급일 */
  },

  /* 구독 플랜 — 첨부해주신 플랜 정의서(구독권 시트) 값 그대로입니다.
     '꾸미기 프랍 갯수 및 스페이스 레벨은 각 플랜별로 변경 여지 있음' 주석 포함. */
  plans: [
    { id:'free',  ko:'무료버전',   en:'Free',      price:0,      tag:'' },
    { id:'basic', ko:'베이직',     en:'Basic',     price:9900,   tag:'' },
    { id:'adv',   ko:'어드밴스',   en:'Advance',   price:49000,  tag:'커스터마이징 강화' },
    { id:'advp',  ko:'어드밴스+',  en:'Advance+',  price:69000,  tag:'홍보 강화' },
    { id:'pro',   ko:'프로',       en:'Pro',       price:99000,  tag:'팬소통 강화' },
    { id:'prem',  ko:'프리미엄',   en:'Premium',   price:189000, tag:'콘텐츠 다층화' }
  ],
  /* 값이 '' 인 칸은 시트가 비어 있던 항목입니다 — 임의로 채우지 않았습니다. */
  planMatrix: [
    { k:'슈퍼스토리',                 v:['O','O','O','O','O','O'] },
    { k:'슈퍼보드',                   v:['O','O','O','O','O','O'] },
    { k:'어드민 아이디',              v:['-','1개','3개','3개','','5개'] },
    { k:'캔버스',                     v:['-','5개','30개','30개','60개','180개'] },
    { k:'빌보드',                     v:['-','2개','10개','10개','20개','50개'] },
    { k:'꾸미기 프랍',                v:['-','10개','60개','60개','90개','270개'] },
    { k:'스페이스 레벨',              v:['-','LEVEL 1','LEVEL 3','LEVEL 3','LEVEL 4','LEVEL 5'] },
    { k:'커스터마이징 1 (바닥·벽지·레이아웃)', v:['-','-','O','O','O','O'] },
    { k:'커스터마이징 2 (인하우스 부스 제공)', v:['-','-','O','O','O','O'] },
    { k:'판매 요청 기능',             v:['-','-','O','O','O','O'] },
    { k:'슈퍼스토리 노출 빈도 증가',  v:['-','-','-','O','O','O'] },
    { k:'슈퍼보드 노출 빈도 증가',    v:['-','-','-','O','O','O'] },
    { k:'인터렉션 에셋 (랜덤 뽑기 휠)', v:['-','-','-','-','O','O'] },
    { k:'팬 스토리 (팬덤 게시판)',    v:['-','-','-','-','O','O'] },
    { k:'AI 팬 레터',                 v:['-','-','-','-','O','O'] },
    { k:'AI 아바타 생성 & 쇼룸 안내', v:['-','-','-','-','-','O'] },
    { k:'멀티 서버 보이스 채팅',      v:['-','-','-','-','-','O'] },
    { k:'SuperTown 내 광고 슬롯 제공', v:['-','-','-','-','-','O'] },
    { k:'SuperTown 추천 리스트 ‘주목할 쇼룸’ 노출', v:['-','-','-','-','-','O'] }
  ],
  planNote: '꾸미기 프랍 갯수 및 스페이스 레벨은 각 플랜별로 변경 여지가 있습니다.',

  /* ── 회원 탈퇴 ────────────────────────────────────────────────────
     ⚠️ 아래 차단 조건과 유예 기간은 확정된 정책이 아닙니다.
        "정산 가능 잔액이 있으면 탈퇴 불가" 같은 규칙은 운영 정책이
        정해지면 이 플래그만 바꾸면 됩니다. 기간(7일/14일/30일 등)은
        정해진 값이 없어 null 로 두었고, 화면에서도 기간을 말하지 않습니다. */
  withdraw: {
    blockOnPayableAssets: true,   /* 정산 가능 재화가 남아 있으면 탈퇴 차단 */
    blockOnPendingPayout: true,   /* 정산 진행 중이면 차단 */
    blockOnPendingRefund: true,   /* 환불 처리 중이면 차단 */
    warnOnAssets: true,           /* 보유 재화는 안내만 (차단 아님) */
    warnOnSubscription: true,     /* 활성 구독은 안내만 */
    gracePeriodDays: null,        /* 탈퇴 철회 유예 기간 — 정책 미확정 */
    keepDemoAccount: true         /* 데모 계정은 QA 용이라 실제로 지우지 않음 */
  },

  /* 재화 정의 — 실제 재화 아이콘이 준비되면 icon 경로만 채우면 됩니다 */
  assets: [
    { id:'bean', ko:'슈퍼빈',   en:'Super Bean', mark:'B' },
    { id:'wing', ko:'슈퍼윙',   en:'Super Wing', mark:'W' },
    { id:'star', ko:'슈퍼스타', en:'Super Star', mark:'S' }
  ]
};

/* SuperPlat 기본 프로필 이미지 (외부 파일 의존 없이 인라인 SVG) */
var DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#C9D6EA"/><stop offset="1" stop-color="#AFC0DA"/>' +
    '</linearGradient></defs>' +
    '<rect width="96" height="96" fill="url(#g)"/>' +
    /* 사람 아이콘 — Bootstrap Icons "person-fill" 원본 path 그대로입니다.
       원본 viewBox 는 16×16, path 의 bbox 는 x 2~14 · y 2~14 (12×12, 중심 8,8).

         scale     4.1667  → 12 × 4.1667 = 50px  (96 캔버스의 52%)
                             이전 글리프(약 53.8px / 56%)보다 한 단계 작습니다.
         translate(14.67, 13.17)
           → 좌우 여백 23 / 23 (완전 대칭)
           → 세로 중심을 46.5 에 두는 optical alignment.
             어깨가 넓어 아래가 시각적으로 무거우므로 기하학적 중심(48)보다
             1.5px 올렸습니다. 원형 마스크(r=48)에 잘리는 지점도 없습니다.     */
    '<g transform="translate(14.67 13.17) scale(4.1667)" fill="#FFFFFF" opacity=".92">' +
    '<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>' +
    '</g>' +
    '</svg>');

/* ── 1. Store — localStorage (PROTOTYPE ONLY) ─────────────────────────────
   키 접두사를 sp.proto.* 로 통일해서, 실제 서비스 데이터가 아니라는 것이
   개발자 도구에서도 바로 보이게 했습니다.                                    */
var K_USERS = 'sp.proto.users';
var K_SESS  = 'sp.proto.session';
var K_CODE  = 'sp.proto.pendingCode';   /* 발급된 인증번호 (메일 서버 대체) */
var K_BILL  = 'sp.proto.billing';       /* 재화 · 정산 · 구독 · 결제수단 (데모 데이터) */

function safeParse(raw, fb) { try { return raw ? JSON.parse(raw) : fb; } catch (e) { return fb; } }
function ls() { try { return global.localStorage; } catch (e) { return null; } }
function read(k, fb) { var s = ls(); return s ? safeParse(s.getItem(k), fb) : fb; }
function write(k, v) { var s = ls(); if (!s) return; try { s.setItem(k, JSON.stringify(v)); } catch (e) {} }
function drop(k) { var s = ls(); if (!s) return; try { s.removeItem(k); } catch (e) {} }

function users() { var u = read(K_USERS, null); return u && u.length ? u : seed(); }

/* Demo Account — 프로토타입을 처음 열었을 때도 바로 로그인해 볼 수 있게 */
var DEMO = {
  email: 'user@superplat.com',
  pw: 'superplat1!',
  name: '김하혜',
  phone: '010-1234-5678',
  birth: '1997.01.01',
  gender: 'f',
  nick: '슈퍼플레이어'
};
function seed() {
  var list = [{
    id: 'demo', email: DEMO.email, pw: DEMO.pw, name: DEMO.name, phone: DEMO.phone,
    birth: DEMO.birth, gender: DEMO.gender, nick: DEMO.nick, avatar: '',
    marketing: false, createdAt: 0, demo: true
  }];
  write(K_USERS, list);
  return list;
}
function saveUsers(list) { write(K_USERS, list); }
function byEmail(e) {
  e = String(e || '').trim().toLowerCase();
  var l = users();
  for (var i = 0; i < l.length; i++) if (l[i].email.toLowerCase() === e) return l[i];
  return null;
}
function byId(id) {
  var l = users();
  for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
  return null;
}

/* 화면으로 내보낼 때는 비밀번호를 뺍니다 (실서비스에서는 애초에 없어야 할 필드) */
function publicUser(u) {
  if (!u) return null;
  return { id:u.id, email:u.email, name:u.name, phone:u.phone, birth:u.birth,
           gender:u.gender, nick:u.nick, avatar:u.avatar || '', marketing:!!u.marketing,
           createdAt:u.createdAt, demo:!!u.demo };
}

/* ── 2. Session ──────────────────────────────────────────────────────── */
function session() { return read(K_SESS, null); }
function setSession(userId) { write(K_SESS, { userId:userId, at:Date.now(), proto:true }); }
function clearSession() { drop(K_SESS); }

function currentUser() {
  var s = session();
  if (!s || !s.userId) return null;
  var u = byId(s.userId);
  if (!u) { clearSession(); return null; }   /* 계정이 사라졌으면 세션도 정리 */
  return u;
}

/* ── 3. 변경 알림 (Header · MyPage 가 같은 상태를 보게) ────────────────── */
var listeners = [];
function emit() {
  var pu = publicUser(currentUser());
  for (var i = 0; i < listeners.length; i++) { try { listeners[i](pu); } catch (e) {} }
}
/* 다른 탭에서 로그인/로그아웃해도 따라오도록 */
if (global.addEventListener) {
  global.addEventListener('storage', function (e) {
    if (e.key === K_SESS || e.key === K_USERS) emit();
  });
}

/* ── 4. Adapter — 여기만 fetch 로 바꾸면 실서버가 됩니다 ────────────────── */
function later(fn) {
  return new Promise(function (res, rej) {
    setTimeout(function () { try { fn(res, rej); } catch (e) { rej(e); } }, CONFIG.latencyMs);
  });
}
function uid() { return 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

/* ── Billing store (PROTOTYPE 데모 데이터) ──────────────────────────────
   ⚠️ 수량·거래 내역은 화면 확인용 예시입니다. 환산율·수수료·세율 등
      "정책" 값은 CONFIG.payout 에만 있고 전부 null 이라 계산하지 않습니다.
   ⚠️ 카드/계좌는 브랜드·예금주·끝 4자리만 저장합니다. 전체 번호는
      절대 저장하지 않으며, 실서비스에서는 PG 토큰화가 필요합니다.         */
function today(offset) {
  var d = new Date(); d.setDate(d.getDate() + (offset || 0));
  return d.getFullYear() + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + ('0' + d.getDate()).slice(-2);
}
function seedBilling() {
  return {
    assets: {
      bean: { total: 12500, payable: 10000 },
      wing: { total: 3200,  payable: 2800 },
      star: { total: 12500, payable: 0 }
    },
    ledger: [
      { id:'t6', date:today(-1), kind:'use',    title:'마이스페이스 아이템 구매', asset:'star', delta:-500,  balance:12500, status:'done',    refundable:true,  amount:null, method:'star' },
      { id:'t5', date:today(-3), kind:'earn',   title:'슈퍼스토리 활동 보상',      asset:'bean', delta:+1200, balance:12500, status:'done',    refundable:false, amount:null, method:null },
      { id:'t4', date:today(-8), kind:'charge', title:'슈퍼스타 충전',            asset:'star', delta:+3000, balance:13000, status:'done',    refundable:true,  amount:null, method:'card' },
      { id:'t3', date:today(-14),kind:'use',    title:'꾸미기 프랍 구매',          asset:'wing', delta:-400,  balance:3200,  status:'done',    refundable:true,  amount:null, method:'wing' },
      { id:'t2', date:today(-21),kind:'earn',   title:'쇼룸 방문 보상',            asset:'wing', delta:+600,  balance:3600,  status:'done',    refundable:false, amount:null, method:null },
      { id:'t1', date:today(-30),kind:'cancel', title:'슈퍼스타 충전 취소',        asset:'star', delta:-1000, balance:10000, status:'refunded',refundable:false, amount:null, method:'card' }
    ],
    payouts: [],
    payoutAccount: null,
    subscription: { planId:'basic', since:today(-120), nextBilling:today(12), cardId:'c1', scheduledPlanId:null },
    cards: [{ id:'c1', brand:'신한카드', last4:'1234', isDefault:true }],
    payments: [
      { id:'p3', date:today(-18), planId:'basic', cardId:'c1', status:'paid' },
      { id:'p2', date:today(-48), planId:'basic', cardId:'c1', status:'paid' },
      { id:'p1', date:today(-78), planId:'basic', cardId:'c1', status:'paid' }
    ],
    refunds: [],
    /* 사용자 제작 콘텐츠 — 화면 확인용 예시 수치입니다 */
    content: { spaces: 3, posts: 8 }
  };
}
function billAll() { return read(K_BILL, {}) || {}; }
function bill() {
  var me = currentUser(); if (!me) return null;
  var all = billAll();
  if (!all[me.id]) { all[me.id] = seedBilling(); write(K_BILL, all); }
  return all[me.id];
}
function saveBill(b) {
  var me = currentUser(); if (!me) return;
  var all = billAll(); all[me.id] = b; write(K_BILL, all);
}
function nid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

var Adapter = {
  me: function () { return publicUser(currentUser()); },

  /* ── 재화 · 정산 · 구독 · 결제수단 ─────────────────────────────── */
  getBilling: function () { return bill(); },

  requestPayout: function (o) {
    return later(function (res, rej) {
      var b = bill(); if (!b) return rej(new Error('unauthorized'));
      var a = b.assets[o.asset];
      if (!a) return rej(new Error('asset'));
      if (CONFIG.payout.payableAssets.indexOf(o.asset) < 0) return rej(new Error('notPayable'));
      var q = Math.floor(Number(o.qty) || 0);
      if (q <= 0 || q > a.payable) return rej(new Error('qty'));
      if (!b.payoutAccount) return rej(new Error('noAccount'));
      a.payable -= q; a.total -= q;
      b.payouts.unshift({
        id: nid('po'), date: today(0), asset: o.asset, qty: q,
        status: 'review',                 /* request → review → scheduled → done / rejected / canceled */
        account: b.payoutAccount, paidAt: null, amount: null
      });
      saveBill(b); res({ ok:true, payout: b.payouts[0] });
    });
  },

  cancelPayout: function (id) {
    return later(function (res, rej) {
      var b = bill(); if (!b) return rej(new Error('unauthorized'));
      for (var i = 0; i < b.payouts.length; i++) {
        if (b.payouts[i].id !== id) continue;
        var p = b.payouts[i];
        /* 처리 단계에 들어간 건은 취소 불가 — 실제 정책이 정해지면 교체 */
        if (p.status !== 'review') return rej(new Error('locked'));
        p.status = 'canceled';
        var a = b.assets[p.asset];
        if (a) { a.payable += p.qty; a.total += p.qty; }   /* 수량 복구 */
        saveBill(b); return res({ ok:true });
      }
      rej(new Error('notFound'));
    });
  },

  savePayoutAccount: function (o) {
    return later(function (res, rej) {
      var b = bill(); if (!b) return rej(new Error('unauthorized'));
      /* ⚠️ 계좌번호 전체는 저장하지 않습니다 — 끝 4자리만 */
      b.payoutAccount = { bank:o.bank, holder:o.holder, last4:String(o.last4).slice(-4) };
      saveBill(b); res({ ok:true, account:b.payoutAccount });
    });
  },

  requestRefund: function (o) {
    return later(function (res, rej) {
      var b = bill(); if (!b) return rej(new Error('unauthorized'));
      var tx = null;
      for (var i = 0; i < b.ledger.length; i++) if (b.ledger[i].id === o.ledgerId) tx = b.ledger[i];
      if (!tx || !tx.refundable) return rej(new Error('notRefundable'));
      tx.refundable = false; tx.status = 'refundReq';
      b.refunds.unshift({ id:nid('rf'), ledgerId:tx.id, date:today(0),
                          reason:o.reason, detail:o.detail || '', status:'review', result:null });
      saveBill(b); res({ ok:true });
    });
  },

  changePlan: function (planId) {
    return later(function (res, rej) {
      var b = bill(); if (!b) return rej(new Error('unauthorized'));
      var cur = b.subscription;
      var order = CONFIG.plans.map(function (p) { return p.id; });
      var up = order.indexOf(planId) > order.indexOf(cur ? cur.planId : 'free');
      if (!cur) b.subscription = { planId:planId, since:today(0), nextBilling:today(30), cardId:(b.cards[0]||{}).id||null, scheduledPlanId:null };
      else if (up) { cur.planId = planId; cur.scheduledPlanId = null; cur.since = today(0); }
      else cur.scheduledPlanId = planId;      /* 다운그레이드는 다음 결제일에 적용 */
      saveBill(b); res({ ok:true, upgrade:up, subscription:b.subscription });
    });
  },

  cancelSubscription: function () {
    return later(function (res, rej) {
      var b = bill(); if (!b || !b.subscription) return rej(new Error('none'));
      b.subscription.canceledAt = today(0);
      b.subscription.scheduledPlanId = 'free';
      saveBill(b); res({ ok:true, until:b.subscription.nextBilling });
    });
  },

  addCard: function (o) {
    return later(function (res, rej) {
      var b = bill(); if (!b) return rej(new Error('unauthorized'));
      /* ⚠️ 카드 전체 번호 · 유효기간 · 비밀번호는 저장하지 않습니다.
         실서비스에서는 PG 토큰화가 필요합니다.                        */
      var c = { id:nid('c'), brand:o.brand, last4:String(o.last4).slice(-4), isDefault:!b.cards.length };
      b.cards.push(c); saveBill(b); res({ ok:true, card:c });
    });
  },
  setDefaultCard: function (id) {
    return later(function (res, rej) {
      var b = bill(); if (!b) return rej(new Error('unauthorized'));
      b.cards.forEach(function (c) { c.isDefault = c.id === id; });
      saveBill(b); res({ ok:true });
    });
  },
  removeCard: function (id) {
    return later(function (res, rej) {
      var b = bill(); if (!b) return rej(new Error('unauthorized'));
      if (b.subscription && b.subscription.cardId === id && b.cards.length < 2) return rej(new Error('inUse'));
      b.cards = b.cards.filter(function (c) { return c.id !== id; });
      if (b.cards.length && !b.cards.some(function (c) { return c.isDefault; })) b.cards[0].isDefault = true;
      if (b.subscription && b.subscription.cardId === id) b.subscription.cardId = (b.cards[0] || {}).id || null;
      saveBill(b); res({ ok:true });
    });
  },

  checkEmail: function (email) {
    return later(function (res) { res({ taken: !!byEmail(email) }); });
  },

  checkNick: function (nick) {
    return later(function (res) {
      var n = String(nick || '').trim().toLowerCase(), l = users(), me = currentUser();
      for (var i = 0; i < l.length; i++) {
        if (me && l[i].id === me.id) continue;             /* 내 닉네임은 중복 아님 */
        if ((l[i].nick || '').toLowerCase() === n) return res({ taken:true });
      }
      res({ taken: n === '슈퍼플랫' || n === 'superplat' }); /* 예약어 */
    });
  },

  /* 인증번호 발급 — 실서비스에서는 서버가 메일을 보내고 코드는 내려주지 않습니다.
     프로토타입에서는 화면에 보여주기 위해 code 를 함께 반환합니다.            */
  sendCode: function (email) {
    return later(function (res) {
      var code = '';
      for (var i = 0; i < CONFIG.codeLength; i++) code += Math.floor(Math.random() * 10);
      write(K_CODE, { email:String(email || '').toLowerCase(), code:code, at:Date.now() });
      res({ ok:true, devCode: CONFIG.DEV_CODE_HINT ? code : null });
    });
  },

  verifyCode: function (email, code) {
    return later(function (res, rej) {
      var p = read(K_CODE, null);
      if (!p) return rej(new Error('expired'));
      if ((Date.now() - p.at) / 1000 > CONFIG.codeTtlSec) { drop(K_CODE); return rej(new Error('expired')); }
      if (p.email !== String(email || '').toLowerCase()) return rej(new Error('mismatch'));
      if (p.code !== String(code || '').trim()) return rej(new Error('mismatch'));
      drop(K_CODE);
      res({ ok:true });
    });
  },

  signup: function (data) {
    return later(function (res, rej) {
      if (byEmail(data.email)) return rej(new Error('emailTaken'));
      var list = users();
      var u = {
        id: uid(),
        email: String(data.email).trim(),
        pw: data.pw,                       /* ⚠️ PROTOTYPE ONLY — 평문 저장 */
        name: data.name, phone: data.phone, birth: data.birth, gender: data.gender,
        nick: data.nick,
        avatar: '',                        /* 가입 시에는 받지 않고 기본 이미지 사용 */
        marketing: !!data.marketing,
        createdAt: Date.now()
      };
      list.push(u); saveUsers(list);
      res({ ok:true, user: publicUser(u) });   /* 가입만 하고 자동 로그인은 하지 않음 */
    });
  },

  login: function (email, pw) {
    return later(function (res, rej) {
      var u = byEmail(email);
      /* 탈퇴한 계정은 비밀번호 검사보다 먼저 안내합니다 */
      if (u && u.withdrawn) return rej(new Error('withdrawn'));
      if (!u || u.pw !== pw) return rej(new Error('credentials'));
      setSession(u.id);
      emit();
      res({ ok:true, user: publicUser(u) });
    });
  },

  logout: function () {
    clearSession(); emit();
    return Promise.resolve({ ok:true });
  },

  /* 마이페이지 정보 수정 — 닉네임 / 휴대폰 / 생년월일 / 성별 / 프로필 이미지 */
  update: function (patch) {
    return later(function (res, rej) {
      var me = currentUser();
      if (!me) return rej(new Error('unauthorized'));
      var allow = ['name', 'phone', 'birth', 'gender', 'nick', 'avatar', 'marketing'];
      var list = users();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id !== me.id) continue;
        for (var k = 0; k < allow.length; k++) {
          var f = allow[k];
          if (Object.prototype.hasOwnProperty.call(patch, f)) list[i][f] = patch[f];
        }
        saveUsers(list); emit();
        return res({ ok:true, user: publicUser(list[i]) });
      }
      rej(new Error('unauthorized'));
    });
  },

  changePassword: function (cur, next) {
    return later(function (res, rej) {
      var me = currentUser();
      if (!me) return rej(new Error('unauthorized'));
      if (me.pw !== cur) return rej(new Error('wrongPassword'));
      if (me.pw === next) return rej(new Error('samePassword'));
      var list = users();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === me.id) { list[i].pw = next; saveUsers(list); return res({ ok:true }); }
      }
      rej(new Error('unauthorized'));
    });
  },

  /* ── 회원 탈퇴 ──────────────────────────────────────────────────
     탈퇴 전에 계정에 무엇이 남아 있는지 먼저 돌려줍니다.
     blocking 은 CONFIG.withdraw 플래그로만 결정되며, 정책이 정해지면
     그 플래그만 바꾸면 UI 는 그대로 동작합니다.                      */
  withdrawPrecheck: function () {
    var b = bill(), W = CONFIG.withdraw;
    if (!b) return Promise.reject(new Error('unauthorized'));
    var items = [];
    function add(id, label, state, detail, link, block) {
      items.push({ id:id, label:label, state:state, detail:detail, link:link || null, blocking:!!block });
    }
    /* 1. 보유 재화 */
    var held = CONFIG.assets.map(function (a) {
      return { id:a.id, ko:a.ko, n:(b.assets[a.id] || {}).total || 0 };
    }).filter(function (x) { return x.n > 0; });
    add('assets', '보유 재화', held.length ? 'warn' : 'none',
        held.length ? held : null, held.length ? 'cash/assets' : null, false);

    /* 2. 정산 가능 재화 */
    var payable = CONFIG.payout.payableAssets.map(function (id) {
      return { id:id, ko:(CONFIG.assets.filter(function (a) { return a.id === id; })[0] || {}).ko || id,
               n:(b.assets[id] || {}).payable || 0 };
    }).filter(function (x) { return x.n > 0; });
    add('payable', '정산 가능 재화', payable.length ? 'warn' : 'ok',
        payable.length ? payable : null, payable.length ? 'cash/payout' : null,
        payable.length && W.blockOnPayableAssets);

    /* 3. 진행 중인 정산 */
    var po = b.payouts.filter(function (p) { return p.status === 'review' || p.status === 'scheduled'; });
    add('payout', '진행 중인 정산', po.length ? 'warn' : 'ok',
        po.length ? po : null, po.length ? 'cash/payout' : null,
        po.length && W.blockOnPendingPayout);

    /* 4. 진행 중인 환불 */
    var rf = b.refunds.filter(function (r) { return r.status === 'review'; });
    add('refund', '진행 중인 환불', rf.length ? 'warn' : 'ok',
        rf.length ? rf : null, rf.length ? 'cash/ledger' : null,
        rf.length && W.blockOnPendingRefund);

    /* 5. 활성 구독권 */
    var sub = b.subscription && b.subscription.planId !== 'free' ? b.subscription : null;
    add('sub', '이용 중인 구독권', sub ? 'warn' : 'ok', sub, sub ? 'cash/sub' : null, false);

    /* 6. 등록된 결제 수단 (마스킹된 정보만) */
    add('cards', '등록된 결제 수단', b.cards.length ? 'warn' : 'ok',
        b.cards.length ? b.cards.map(function (c) { return { brand:c.brand, last4:c.last4 }; }) : null,
        b.cards.length ? 'cash/pay' : null, false);

    /* 7. 내가 만든 콘텐츠 */
    var ct = b.content || { spaces:0, posts:0 };
    var hasCt = (ct.spaces + ct.posts) > 0;
    add('content', '내가 만든 콘텐츠', hasCt ? 'warn' : 'none', hasCt ? ct : null, null, false);

    /* 8. 처리 중인 결제 */
    var pending = b.payments.filter(function (x) { return x.status === 'pending'; });
    add('payment', '처리 중인 결제', pending.length ? 'warn' : 'ok', pending.length ? pending : null, null, !!pending.length);

    return later(function (res) {
      res({ items: items, blocked: items.some(function (i) { return i.blocking; }) });
    });
  },

  /* 본인 확인만 — 계정 상태는 전혀 바꾸지 않습니다.
     ⚠️ 최종 탈퇴 실행 전까지 어떤 데이터도 변경되지 않아야 합니다. */
  verifyPassword: function (password) {
    return later(function (res, rej) {
      var me = currentUser();
      if (!me) return rej(new Error('unauthorized'));
      if (me.pw !== password) return rej(new Error('wrongPassword'));
      res({ ok:true });
    });
  },

  /* 본인 확인 후 실제 탈퇴.
     ⚠️ 데모 계정은 QA 에 계속 필요하므로 레코드를 지우지 않고
        세션과 데모 데이터만 초기화합니다. (CONFIG.withdraw.keepDemoAccount) */
  withdraw: function (o) {
    return later(function (res, rej) {
      var me = currentUser();
      if (!me) return rej(new Error('unauthorized'));
      if (me.pw !== (o && o.password)) return rej(new Error('wrongPassword'));
      var pre = null;
      var all = billAll();

      if (me.demo && CONFIG.withdraw.keepDemoAccount) {
        delete all[me.id]; write(K_BILL, all);        /* 데모 데이터만 초기화 */
        clearSession(); emit();
        return res({ ok:true, demo:true });
      }
      var list = users();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id !== me.id) continue;
        /* 레코드는 남기되 탈퇴 상태로 표시 — 재로그인 시 안내하기 위해서입니다.
           실서비스에서는 보관 기간 · 파기 시점을 정책에 맞춰 처리해야 합니다. */
        list[i].withdrawn = true;
        list[i].withdrawnAt = Date.now();
        list[i].pw = '';
        break;
      }
      saveUsers(list);
      delete all[me.id]; write(K_BILL, all);
      clearSession(); emit();
      res({ ok:true, demo:false });
    });
  },

  /* 비밀번호 찾기 → 재설정 (이메일 인증 통과 후) */
  resetPassword: function (email, next) {
    return later(function (res, rej) {
      var list = users(), e = String(email || '').toLowerCase();
      for (var i = 0; i < list.length; i++) {
        if (list[i].email.toLowerCase() === e) { list[i].pw = next; saveUsers(list); return res({ ok:true }); }
      }
      rej(new Error('noAccount'));
    });
  }
};

/* ── 5. 라우트 가드 ──────────────────────────────────────────────────────
   ⚠️ 클라이언트 가드입니다. 실서비스에서는 서버가 막아야 합니다.            */
function requireAuth(loginUrl) {
  if (currentUser()) return true;
  var here = location.pathname.split('/').pop() + location.search + location.hash;
  location.replace((loginUrl || 'auth.html') + '?next=' + encodeURIComponent(here));
  return false;
}
function nextParam() {
  var m = /[?&]next=([^&]*)/.exec(location.search);
  if (!m) return '';
  var v = '';
  try { v = decodeURIComponent(m[1]); } catch (e) { return ''; }
  /* 같은 사이트 안의 상대 경로만 허용 — 오픈 리다이렉트 방지 */
  if (/^https?:|^\/\/|^javascript:/i.test(v)) return '';
  return v;
}

/* ── 6. Header 로그인 상태 UI ────────────────────────────────────────────
   기존 5개 페이지의 헤더 마크업을 고치지 않고, 여기서 아바타 버튼과
   드롭다운(모바일: 바텀시트)을 주입합니다.                                  */
var CSS = [
'.sp-av{position:relative;flex:none}',
'.sp-av__btn{width:42px;height:42px;padding:0;border:0;background:none;border-radius:999px;cursor:pointer;display:grid;place-items:center;transition:transform 260ms cubic-bezier(.16,1,.3,1)}',
'.sp-av__btn img{width:34px;height:34px;border-radius:999px;object-fit:cover;display:block;background:#DCE3EE;box-shadow:0 0 0 1.5px rgba(255,255,255,.55)}',
'.header.is-scrolled .sp-av__btn img,.auth-page .sp-av__btn img,.is-detail .sp-av__btn img,.mypage .sp-av__btn img{box-shadow:0 0 0 1.5px rgba(0,0,0,.10)}',
'@media (hover:hover){.sp-av__btn:hover{transform:scale(1.05)}}',
/* 모바일 터치 타깃 44px 이상 */
'@media (max-width:767px){.sp-av__btn{width:44px;height:44px}.sp-av__btn img{width:32px;height:32px}}',
'.sp-av__btn:active{transform:scale(.97)}',
'.sp-av__btn:focus-visible{outline:2px solid currentColor;outline-offset:3px}',
/* 프로필 메뉴 — 공통 Dropdown System(assets/sp-ui.js)의 표면 / 옵션 / 모션 토큰을 씁니다.
   sp-ui.js 가 없어도 기존 값으로 떨어지도록 fallback 을 함께 둡니다.
   z-index 는 레이어 토큰(--z-pop)을 써서 header(--z-header:200) 위에 오게 합니다.
   예전 값(60)은 header(200)보다 낮아 모바일 바텀시트의 딤이 헤더를 덮지 못했습니다. */
'.sp-menu{position:fixed;top:0;left:0;width:264px;',
  'padding:var(--sp-menu-pad,7px);background:var(--sp-menu-bg,#fff);border-radius:var(--sp-menu-r,14px);',
  'box-shadow:var(--sp-menu-sh,0 10px 30px rgba(0,0,0,.08), 0 0 0 1px rgba(var(--ink-rgb),.05));',
  'opacity:0;visibility:hidden;transform:translateY(-6px);',
  'transition:opacity var(--sp-pop-out,160ms) var(--sp-ease,cubic-bezier(.16,1,.3,1)),',
    'transform var(--sp-pop-out,160ms) var(--sp-ease,cubic-bezier(.16,1,.3,1)),',
    'visibility var(--sp-pop-out,160ms);',
  'z-index:var(--z-pop,600);text-align:left}',
'.sp-menu.is-open{opacity:1;visibility:visible;transform:translateY(0);transition-duration:var(--sp-pop-in,220ms)}',
'.sp-menu__id{display:flex;align-items:center;gap:12px;padding:12px 12px 14px}',
'.sp-menu__id img{width:44px;height:44px;border-radius:999px;object-fit:cover;flex:none;background:#DCE3EE}',
'.sp-menu__t{min-width:0}',
'.sp-menu__nick{font-size:15px;font-weight:700;color:#171A21;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
'.sp-menu__mail{margin-top:2px;font-size:13px;color:#6B7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
'.sp-menu__sep{height:1px;margin:0 4px 6px;background:rgba(var(--ink-rgb),.09)}',
'.sp-menu a,.sp-menu button.sp-menu__item{display:flex;align-items:center;gap:10px;width:100%;',
  'min-height:max(44px, var(--sp-opt-h,42px));padding:0 12px;border:0;background:none;',   /* 터치 타깃 44px 은 유지 */
  'border-radius:var(--sp-opt-r,9px);font:inherit;font-size:14px;font-weight:500;color:var(--sp-ink,#171A21);cursor:pointer;text-align:left;',
  'transition:background-color 180ms var(--sp-ease,cubic-bezier(.16,1,.3,1))}',
'.sp-menu a:hover,.sp-menu button.sp-menu__item:hover{background:var(--sp-opt-hover,rgba(var(--ink-rgb),.045))}',
'.sp-menu__item--quiet{color:#6B7280}',
'.sp-menu svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;flex:none}',
/* 모바일 — 축소된 드롭다운 대신 바텀시트 */
'@media (max-width:767px){',
  '.sp-menu{top:auto!important;right:0!important;left:0;bottom:0;width:auto;padding:8px 8px calc(10px + env(safe-area-inset-bottom,0px));',
    /* 바텀시트 상단 radius 는 공통 Select 시트(.spmenu.is-sheet)와 같은 22px */
    'border-radius:22px 22px 0 0;transform:translateY(14px);box-shadow:0 -14px 40px rgba(0,0,0,.16)}',
  '.sp-menu.is-open{transform:translateY(0)}',
  '.sp-menu__grab{width:38px;height:4px;margin:6px auto 4px;border-radius:999px;background:rgba(var(--ink-rgb),.16)}',
  '.sp-menu a,.sp-menu button.sp-menu__item{min-height:52px;font-size:15px}',
'}',
'@media (min-width:768px){.sp-menu__grab{display:none}}',
'.sp-scrim{position:fixed;inset:0;background:rgba(12,16,24,.34);opacity:0;visibility:hidden;',
  'transition:opacity var(--sp-pop-in,220ms) var(--sp-ease,cubic-bezier(.16,1,.3,1)),visibility var(--sp-pop-in,220ms);',
  'z-index:calc(var(--z-pop,600) - 1)}',
'.sp-scrim.is-open{opacity:1;visibility:visible}',
'@media (min-width:768px){.sp-scrim{display:none}}',
'@media (prefers-reduced-motion:reduce){.sp-av__btn,.sp-menu,.sp-scrim{transition-duration:1ms!important}}',
/* 드로어(모바일 메뉴) 로그인 상태 */
'.drawer__me{display:flex;align-items:center;gap:12px;width:100%;padding:12px 0}',
'.drawer__me img{width:44px;height:44px;border-radius:999px;object-fit:cover;flex:none;background:#DCE3EE}',
/* .header__icon / .drawer__login 은 display 를 직접 지정하므로 [hidden] 이 눌립니다 */
'.header__login[hidden],.drawer__login[hidden]{display:none!important}'
].join('');

function injectCSS() {
  if (document.getElementById('sp-auth-css')) return;
  var s = document.createElement('style');
  s.id = 'sp-auth-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

function svg(d) {
  return '<svg viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>';
}
var ICON_USER = svg('<circle cx="12" cy="8.5" r="3.6"/><path d="M4.6 20c1.3-3.6 4-5.4 7.4-5.4s6.1 1.8 7.4 5.4"/>');
var ICON_OUT  = svg('<path d="M15 17l5-5-5-5"/><path d="M20 12H9"/><path d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/>');

var menuEl = null, scrimEl = null, avBtn = null, opener = null;

function closeMenu() {
  if (!menuEl) return;
  menuEl.classList.remove('is-open');
  if (scrimEl) scrimEl.classList.remove('is-open');
  if (avBtn) avBtn.setAttribute('aria-expanded', 'false');
  if (opener && opener.focus) opener.focus();
}
/* ⚠️ header 에 backdrop-filter 가 걸려 있어 그 안의 position:fixed 는
   헤더를 기준으로 갇힙니다. 그래서 메뉴는 body 직속으로 두고,
   데스크톱에서만 아바타 위치를 계산해 붙입니다. */
function placeMenu() {
  if (!menuEl || !avBtn) return;
  if (matchMedia('(max-width: 767px)').matches) { menuEl.style.top = ''; menuEl.style.left = ''; return; }
  var r = avBtn.getBoundingClientRect();
  /* right 는 스크롤바 유무에 따라 기준이 흔들려서 left 로 붙입니다 */
  var w = menuEl.offsetWidth || 264;
  var left = Math.max(8, Math.min(r.right - w, document.documentElement.clientWidth - w - 8));
  menuEl.style.top = Math.round(r.bottom + 10) + 'px';
  menuEl.style.left = Math.round(left) + 'px';
}
function openMenu() {
  if (!menuEl) return;
  placeMenu();
  menuEl.classList.add('is-open');
  if (scrimEl) scrimEl.classList.add('is-open');
  if (avBtn) avBtn.setAttribute('aria-expanded', 'true');
  opener = avBtn;
  var first = menuEl.querySelector('a,button.sp-menu__item');
  if (first) setTimeout(function () { first.focus(); }, 60);
}

function mountHeader(opt) {
  opt = opt || {};
  injectCSS();
  var actions = document.querySelector('.header__actions');
  if (!actions) return;
  var loginLink = actions.querySelector('.header__login');
  var wrap = actions.querySelector('.sp-av');

  var u = Adapter.me();

  /* ── 비로그인: 아바타 제거 + 기존 로그인 아이콘 복원 ── */
  if (!u) {
    if (wrap) { closeMenu(); wrap.remove(); }
    var stray = document.querySelector('body > .sp-menu');
    if (stray) stray.remove();
    menuEl = null; avBtn = null;
    if (scrimEl) { scrimEl.remove(); scrimEl = null; }
    if (loginLink) loginLink.hidden = false;
    paintDrawer(null, opt);
    return;
  }

  /* ── 로그인: 로그인 아이콘 숨기고 아바타 노출 ── */
  if (loginLink) loginLink.hidden = true;

  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'sp-av';
    wrap.innerHTML =
      '<button class="sp-av__btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="' + TT('내 계정') + '">' +
        '<img alt="">' +
      '</button>' +
      '<div class="sp-menu" role="menu" aria-label="' + TT('내 계정') + '">' +
        '<div class="sp-menu__grab" aria-hidden="true"></div>' +
        '<div class="sp-menu__id"><img alt=""><div class="sp-menu__t">' +
          '<p class="sp-menu__nick"></p><p class="sp-menu__mail"></p></div></div>' +
        '<div class="sp-menu__sep"></div>' +
        '<a href="' + (opt.mypage || 'mypage.html') + '" role="menuitem">' + ICON_USER + '<span>' + TT('마이페이지') + '</span></a>' +
        '<button class="sp-menu__item sp-menu__item--quiet" type="button" role="menuitem" data-sp="logout">' +
          ICON_OUT + '<span>' + TT('로그아웃') + '</span></button>' +
      '</div>';
    if (loginLink && loginLink.parentNode === actions) actions.insertBefore(wrap, loginLink);
    else actions.appendChild(wrap);
    /* 메뉴만 body 로 옮깁니다 (헤더의 backdrop-filter 밖으로) */
    document.body.appendChild(wrap.querySelector('.sp-menu'));

    scrimEl = document.createElement('div');
    scrimEl.className = 'sp-scrim';
    document.body.appendChild(scrimEl);

    avBtn = wrap.querySelector('.sp-av__btn');
    menuEl = document.querySelector('body > .sp-menu');

    avBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      menuEl.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    scrimEl.addEventListener('click', closeMenu);
    addEventListener('resize', function () { if (menuEl && menuEl.classList.contains('is-open')) placeMenu(); });
    addEventListener('scroll', function () { if (menuEl && menuEl.classList.contains('is-open')) placeMenu(); }, { passive:true });
    document.addEventListener('click', function (e) {
      if (!menuEl || !menuEl.classList.contains('is-open')) return;
      if (!wrap.contains(e.target) && !menuEl.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuEl && menuEl.classList.contains('is-open')) closeMenu();
    });
    menuEl.querySelector('[data-sp="logout"]').addEventListener('click', function () {
      closeMenu();
      Adapter.logout().then(function () {
        /* 마이페이지에서 로그아웃하면 로그인 화면으로 */
        if (document.documentElement.classList.contains('mypage')) location.replace('auth.html');
      });
    });
  } else {
    avBtn = wrap.querySelector('.sp-av__btn');
    menuEl = document.querySelector('body > .sp-menu');
  }

  var src = u.avatar || DEFAULT_AVATAR;
  wrap.querySelector('.sp-av__btn img').src = src;
  menuEl.querySelector('.sp-menu__id img').src = src;
  wrap.querySelector('.sp-av__btn img').alt = (u.nick || u.name || '') + TT(' 프로필 이미지');
  menuEl.querySelector('.sp-menu__nick').textContent = u.nick || u.name || '';
  menuEl.querySelector('.sp-menu__mail').textContent = u.email || '';

  paintDrawer(u, opt);
}

/* 모바일 드로어의 로그인 링크도 같은 상태를 따르게 */
function paintDrawer(u, opt) {
  var foot = document.querySelector('.drawer__foot');
  if (!foot) return;
  var link = foot.querySelector('.drawer__login');
  var me = foot.querySelector('.drawer__me');
  if (!u) {
    if (me) me.remove();
    if (link) link.hidden = false;
    return;
  }
  if (link) link.hidden = true;
  if (!me) {
    me = document.createElement('div');
    me.className = 'drawer__me';
    me.innerHTML = '<img alt=""><div class="sp-menu__t"><p class="sp-menu__nick"></p><p class="sp-menu__mail"></p></div>';
    var mp = document.createElement('a');
    mp.className = 'drawer__login'; mp.href = opt.mypage || 'mypage.html'; mp.dataset.spKo = '마이페이지'; mp.textContent = TT('마이페이지');
    var lo = document.createElement('a');
    lo.className = 'drawer__login'; lo.href = '#'; lo.dataset.spKo = '로그아웃'; lo.textContent = TT('로그아웃');
    lo.addEventListener('click', function (e) {
      e.preventDefault();
      Adapter.logout().then(function () {
        if (document.documentElement.classList.contains('mypage')) location.replace('auth.html');
      });
    });
    if (link && link.parentNode === foot) { foot.insertBefore(me, link); foot.insertBefore(mp, link); foot.insertBefore(lo, link); }
    else { foot.appendChild(me); foot.appendChild(mp); foot.appendChild(lo); }
  }
  me.querySelector('img').src = u.avatar || DEFAULT_AVATAR;
  me.querySelector('.sp-menu__nick').textContent = u.nick || u.name || '';
  me.querySelector('.sp-menu__mail').textContent = u.email || '';
}

/* ── 7. 공개 API ─────────────────────────────────────────────────────── */
var SPAuth = {
  CONFIG: CONFIG,
  DEFAULT_AVATAR: DEFAULT_AVATAR,
  DEMO: DEMO,

  me: Adapter.me,
  signup: Adapter.signup,
  login: Adapter.login,
  logout: Adapter.logout,
  update: Adapter.update,
  changePassword: Adapter.changePassword,
  resetPassword: Adapter.resetPassword,
  verifyPassword: Adapter.verifyPassword,
  withdrawPrecheck: Adapter.withdrawPrecheck,
  withdraw: Adapter.withdraw,

  getBilling: Adapter.getBilling,
  requestPayout: Adapter.requestPayout,
  cancelPayout: Adapter.cancelPayout,
  savePayoutAccount: Adapter.savePayoutAccount,
  requestRefund: Adapter.requestRefund,
  changePlan: Adapter.changePlan,
  cancelSubscription: Adapter.cancelSubscription,
  addCard: Adapter.addCard,
  setDefaultCard: Adapter.setDefaultCard,
  removeCard: Adapter.removeCard,
  sendCode: Adapter.sendCode,
  verifyCode: Adapter.verifyCode,
  checkEmail: Adapter.checkEmail,
  checkNick: Adapter.checkNick,

  requireAuth: requireAuth,
  nextParam: nextParam,
  mountHeader: mountHeader,
  closeMenu: closeMenu,

  on: function (fn) { listeners.push(fn); return function () {
    var i = listeners.indexOf(fn); if (i > -1) listeners.splice(i, 1); }; },

  /* 비밀번호 정책 헬퍼 — auth / mypage 가 같은 규칙을 씁니다 */
  pwRules: function (v) {
    return CONFIG.password.rules.map(function (r) { return { id:r.id, ko:r.ko, en:r.en, ok:r.test(v || '') }; });
  },
  pwOk: function (v) {
    return CONFIG.password.rules.every(function (r) { return r.test(v || ''); });
  },

  /* 개발자 콘솔용 — 프로토타입 데이터 초기화 */
  __reset: function () { drop(K_USERS); drop(K_SESS); drop(K_CODE); drop(K_BILL); emit(); }
};

/* Header 는 상태가 바뀔 때마다 자동으로 다시 그립니다 */
SPAuth.on(function () { mountHeader(SPAuth.__headerOpt || {}); });

/* 헤더 계정 메뉴는 한 번만 만들어 재사용하므로, 언어가 바뀌면 문자열만 갱신합니다
   (메뉴를 다시 만들면 열려 있던 상태 · 포커스가 끊깁니다) */
if (global.SPI18N && global.SPI18N.subscribe) {
  global.SPI18N.subscribe(function () {
    var btn = document.querySelector('.sp-av__btn');
    if (btn) btn.setAttribute('aria-label', TT('내 계정'));
    var menu = document.querySelector('body > .sp-menu');
    if (menu) {
      menu.setAttribute('aria-label', TT('내 계정'));
      var mp = menu.querySelector('a[role="menuitem"] span');
      if (mp) mp.textContent = TT('마이페이지');
      var out = menu.querySelector('[data-sp="logout"] span');
      if (out) out.textContent = TT('로그아웃');
    }
    /* 드로어의 마이페이지 / 로그아웃 링크 */
    var links = document.querySelectorAll('.drawer__foot .drawer__login');
    for (var i = 0; i < links.length; i++) {
      var d = links[i].dataset.spKo;
      if (!d) { d = links[i].getAttribute('href') === '#' ? '로그아웃' : '마이페이지'; }
      if (links[i].hidden) continue;
      links[i].textContent = TT(d);
    }
    /* 아바타 alt — 닉네임은 사용자 데이터라 그대로 두고 접미사만 바꿉니다 */
    var imgs = document.querySelectorAll('.sp-av__btn img, .sp-menu__id img, .drawer__me img');
    for (var k = 0; k < imgs.length; k++) {
      var base = (imgs[k].alt || '').replace(/ 프로필 이미지$/, '').replace(/ profile photo$/, '');
      if (base) imgs[k].alt = base + TT(' 프로필 이미지');
    }
  });
}

global.SPAuth = SPAuth;

/* 페이지마다 따로 호출할 필요 없이, DOM 이 준비되면 헤더를 한 번 그립니다 */
function boot() { try { mountHeader(SPAuth.__headerOpt || {}); } catch (e) {} }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})(window);
