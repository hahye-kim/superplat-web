# SuperPlat Website Prototype — Developer Handoff

> 이 문서는 **개발 담당자가 프로젝트를 처음 받았다고 가정**하고 쓴 인수인계 문서입니다.
> 디자인 결정의 히스토리는 `CHANGELOG.md` 에 버전별로 남아 있습니다.

---

## 1. Project Overview

SuperPlat 공식 웹사이트의 **프론트엔드 프로토타입**입니다.

| 항목 | 내용 |
|---|---|
| 형태 | 정적 사이트 (HTML + CSS + Vanilla JS) |
| 빌드 | **없음.** 번들러 · 트랜스파일러 · 패키지 매니저를 쓰지 않습니다 |
| 프레임워크 | 없음 (의존성 0) |
| JS 문법 | ES5 기준 (`var` / `function`). IE 호환 목적이 아니라, 빌드 없이 그대로 서빙하기 위해서입니다 |
| 페이지 | 9개 정적 HTML |
| 데이터 | 전부 정적 · Mock. 서버 통신 없음 (§13 참고) |
| 목적 | 화면 · 흐름 · 반응형 · 테마 · 상호작용의 **확정된 명세** |

**범위 밖:** 백엔드, 실제 인증, 결제 · 정산 연동, CMS, 검색 서버, 애널리틱스.
이 프로토타입은 그 자리에 **UI 와 상태 전이만** 채워 둔 것입니다.

---

## 2. How to Run

빌드가 없으므로 정적 서버 하나면 됩니다.

```bash
cd superplat-web
python3 -m http.server 8000
# → http://localhost:8000
```

또는 `npx serve .` / VS Code Live Server / 정적 호스팅 업로드 — 무엇이든 동작합니다.

> **`file://` 로 더블클릭해도 열립니다.**

### 폰트 — 유일한 외부 의존성

`@font-face` 의 `src` 는 **CDN(jsdelivr) → 로컬 사본** 순서입니다.

```css
src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/…/PretendardVariable.woff2') format('woff2-variations'),
     url('assets/fonts/PretendardVariable.woff2') format('woff2-variations');
```

| 상황 | 실제 동작 |
|---|---|
| 온라인 (서버·`file://` 모두) | **CDN 에서 로드** |
| CDN 차단 · 오프라인 + 서버 | 로컬 사본으로 폴백 |
| 오프라인 + `file://` | 로컬 폰트가 CORS 로 막혀 시스템 폰트로 대체 |

CDN 을 먼저 둔 이유는 `file://` 로 더블클릭해 열었을 때도 폰트가 나오게 하기 위해서입니다.
**폐쇄망 배포 등으로 외부 요청을 없애려면 위 두 `url()` 의 순서를 바꾸면 됩니다**
(9개 HTML 전부). 그 경우 `file://` 더블클릭에서는 시스템 폰트로 보입니다.
로컬 사본과 `LICENSE.txt`(OFL 1.1)는 `assets/fonts/` 에 동봉되어 있습니다.

---

## 3. Project Structure

```
superplat-web/
├─ index.html            홈 (Hero · About · WORLD 캐러셀 · 캐릭터 · 커뮤니티 · CTA)
├─ world.html            WORLD & IP (월드 카드 + IP 캐릭터 카드 + 상세 Viewer)
├─ news.html             NEWS (공지사항 · 업데이트 · 이벤트)
├─ support.html          고객지원 (FAQ · 1:1 문의 · 다운로드)
├─ auth.html             로그인 · 회원가입 · 비밀번호 찾기
├─ mypage.html           마이페이지 (8개 탭)
├─ terms.html            이용약관
├─ privacy.html          개인정보 처리방침
├─ 404.html              Not Found
├─ assets/
│  ├─ sp-i18n.js         KO/EN 사전 + 런타임        ← <head> 동기 로드
│  ├─ sp-worlds.js       WORLD 공간 데이터 (홈·WORLD&IP 공용)  ← <head> 동기 로드
│  ├─ sp-theme.js/.css   Light/Dark 토큰 + 토글
│  ├─ sp-auth.js         계정 · 세션 · 헤더 아바타 (Mock)
│  ├─ sp-nav.js/.css     헤더 · PC 드롭다운 · 모바일 풀메뉴
│  ├─ sp-ui.js           드롭다운 · Select · 검색 공용 컴포넌트
│  ├─ sp-pn.js/.css      이전글/다음글 공용 컴포넌트
│  ├─ fonts/             Pretendard Variable (OFL, LICENSE.txt 동봉)
│  └─ *.png *.jpg *.mp4  이미지 · 영상 (73개)
├─ README.md
├─ DEVELOPER_HANDOFF.md  ← 이 문서
└─ CHANGELOG.md          버전별 변경 이력 · 디자인 결정 근거
```

### 왜 `/css` · `/js` · `/pages` 로 나누지 않았나

- **페이지별 CSS 는 각 HTML 의 `<style>` 안에 인라인**되어 있습니다. 여러 페이지가 공유하는
  것만 `assets/sp-*.css` 로 빠져 있습니다.
- `assets/` 를 `images/` · `video/` 로 더 쪼개지 않았습니다. 이미지 경로 일부가
  **런타임에 조립**되기 때문입니다(§15). 폴더를 옮기면 문자열 검색으로는 잡히지 않는
  참조가 깨집니다.
- 페이지를 `/pages` 로 내리면 모든 상대경로(`assets/…`)와 페이지 간 링크가 한 단계씩
  달라집니다. GitHub Pages 하위경로 배포(§14 · README)와도 얽힙니다.

정리하면 **현재 구조는 "빌드 없이 그대로 열린다"를 위해 선택된 것**입니다.
번들러를 도입하는 시점에 함께 재구성하는 편이 안전합니다.

---

## 4. Page Structure

라우팅 라이브러리가 없습니다. **파일 = route** 이고, 페이지 내부 상태는 `location.hash` 로 표현됩니다.

| Route | 화면 | 내부 상태 |
|---|---|---|
| `/index.html` | 홈 | `#about` `#worlds` 등 섹션 앵커 |
| `/world.html` | WORLD & IP | 탭(전체·월드·IP캐릭터) · 더보기 개수 · 상세 Viewer — 전부 JS 상태 |
| `/news.html` | NEWS | 카테고리 탭 · 검색어 · 이벤트 상태 필터 · 상세 |
| `/support.html` | 고객지원 | `faq` · `inquiry` · `download` 탭 |
| `/auth.html` | 계정 | 로그인 / 회원가입(다단계) / 비밀번호 찾기 — 한 파일 안 뷰 전환 |
| `/mypage.html#<tab>` | 마이페이지 | `profile` `privacy` `account` `assets` `subscription` `cards` `history` `payout` |
| `/terms.html` `/privacy.html` | 법적 고지 | — |
| `/404.html` | Not Found | 호스팅 설정으로 연결 |

> 마이페이지 탭만 URL(`#tab`)에 반영됩니다. WORLD/NEWS 의 탭·필터·상세는 URL 에
> 남지 않습니다 — 공유 가능한 딥링크가 필요하면 Production 에서 route 로 승격해야 합니다.

---

## 5. Responsive System

**모바일 우선이 아니라 데스크톱 기준 + `max-width` 오버라이드** 구조입니다.

| Breakpoint | 의미 |
|---|---|
| `min-width: 2200px` | 초광폭 — 콘텐츠 폭 고정, 남는 공간은 여백 |
| 기본 (992px~) | Desktop |
| `max-width: 1279px` | 좁은 데스크톱 |
| `max-width: 1023px` | Tablet 가로 |
| `max-width: 991px` / `min-width: 992px` | **헤더 전환점** — 이 아래에서 햄버거 + 풀메뉴 |
| `max-width: 767px` | Mobile (가장 많이 쓰이는 분기) |
| `max-width: 359px` | 초소형 — 폰트·여백 한 단계 축소 |

레이아웃은 고정 px 대신 토큰을 씁니다.

```css
--gutter: clamp(20px, 4vw, 80px);        /* 모바일 좌우 여백 = 20px (하한 고정) */
--container: min(1400px, 100% - 2*var(--gutter));
--header-h: clamp(66px, calc(56px + 1.25vw), 80px);
--space-section-sm/md/lg/xl              /* 섹션 수직 리듬 */
--space-content-sm/md/lg                 /* 블록 내부 리듬 */
```

> ⚠️ 섹션·블록 여백에 임의의 `margin` 을 쓰지 마세요. 위 토큰만 씁니다.
> 이 규칙 때문에 3840~320 전 구간에서 리듬이 흐트러지지 않습니다.

**검증 뷰포트:** 3840 / 2560 / 1920 / 1600 / 1440 / 1366 / 1280 / 1024 / 834 / 768 / 430 / 412 / 390 / 375 / 360 / 320

---

## 6. Theme (Light / Dark)

```
사용자 선택 → localStorage['sp.theme'] = 'light' | 'dark'
           → <html data-theme="dark">
           → assets/sp-theme.css 가 토큰만 재정의
```

`assets/sp-theme.js` 가 **`<head>` 에서 동기 실행**되어 첫 페인트 전에 `data-theme` 을
확정합니다. (defer 를 붙이면 흰 화면이 한 번 번쩍입니다 — 붙이지 마세요.)

### 핵심: 채널 토큰

사이트 전체의 "잉크색 반투명"(테두리 · divider · 보조 텍스트 · 미세 배경)은 **오직**
아래 형태로만 씁니다.

```css
:root{ --ink-rgb: 23,26,33;  --line-rgb: 0,0,0; }        /* Light */
html[data-theme="dark"]{ --ink-rgb: …; --line-rgb: …; }  /* Dark  */

border: 1px solid rgba(var(--line-rgb), .07);
color:  rgba(var(--ink-rgb), .64);
```

채널 값 2개만 뒤집으면 수백 개 규칙이 알파(=위계)를 유지한 채 따라옵니다.

### 주요 토큰

| 토큰 | 용도 |
|---|---|
| `--ink` `--ink-soft` | 제목 · 강조 텍스트 |
| `--body` `--body-2nd` `--body-2` | 본문 3단계 (전부 AA 이상) |
| `--bg` `--bg-gray` `--card` `--band` | 표면 |
| `--line` | 테두리 |
| `--radius-card` `--r-card` `--r-media` | 라운드 |
| `--pn-*` | 이전/다음 카드 |
| `--mnav-*` | 모바일 풀메뉴 |
| `--drv-*` | 다운로드 드라이버 카드 |
| `--ev-on-*` `--ev-off-*` | 이벤트 진행중/종료 태그 |
| `--world-rose/warm/blue/aqua/sage/neutral` | WORLD 캐러셀 배경 6계열 |

> ⚠️ **Dark 모드 버그의 원인은 거의 항상 하드코딩된 HEX 입니다.**
> 새 색을 쓸 때는 `:root` 에 Light 값을, `sp-theme.css` 에 Dark 값을 반드시 짝으로 넣으세요.
> 리터럴 색을 규칙에 직접 적으면 Dark 에서 그 자리만 남습니다.

---

## 7. Localization (KO / EN)

```
localStorage['sp.locale'] = 'ko' | 'en'  →  <html lang>  →  구독자 통지
```

`assets/sp-i18n.js` 도 **`<head>` 동기 로드**입니다 (마이페이지 · NEWS · 고객지원은 본문을
JS 로 그리므로, 첫 렌더 전에 언어가 확정되어야 합니다).

**사전 키 = 화면에 나가는 한국어 원문 그 자체입니다.**

```js
window.SPI18N.t('목록으로')   // → 'Back to list'
window.SPI18N.t('없는 문장')  // → '없는 문장'  (원문 그대로, 화면이 비지 않음)
```

| 장점 | 주의 |
|---|---|
| 별도 키를 만들지 않으므로 코드와 화면이 어긋날 수 없음 | **국문 원문을 한 글자라도 고치면 매칭이 끊깁니다.** 문구를 고치면 사전 키도 같이 고쳐야 합니다 |
| 사전에 없으면 원문이 나가서 화면이 깨지지 않음 | 누락을 조용히 넘기므로, EN 전환 후 국문이 남았는지 확인이 필요합니다 |

정적 마크업은 `data-i18n` 속성 + 페이지별 `EN = {…}` 맵으로 처리합니다.
동적 렌더 텍스트는 `SPI18N.t()` 를 씁니다.

공개 API: `.get()` `.set(v)` `.t(ko)` `.subscribe(fn)`

---

## 8. Major UI Components

| 컴포넌트 | 위치 | 메모 |
|---|---|---|
| **Header** | `sp-nav.js` + `sp-nav.css` | 9개 페이지가 같은 코드로 그립니다. PC 는 hover 드롭다운, ≤991px 는 햄버거 |
| **Mobile Full Menu** | `sp-nav.js/.css` | 1-depth 는 영문 라벨(ABOUT / WORLD & IP / NEWS / SUPPORT). 행 전체가 탭 대상(min-height 88px). NEWS·SUPPORT 만 아코디언 |
| **Footer** | 각 HTML 인라인 | 구조 동일 |
| **Card** | 페이지별 | 라운드는 `--radius-card` 하나만 씁니다 (PC 24 / 모바일 16) |
| **Modal / Detail Viewer** | `world.html` | 좌우 이동 · ESC 닫기 · 포커스 트랩. 닫을 때 `src` 를 비웁니다(다음에 열 때 이전 이미지가 번쩍이지 않게) |
| **Tabs** | world / news / support | 좌우 화살표 키 이동 지원 |
| **Filter** | news | 카테고리 탭 + 이벤트 상태 필터(전체/진행중/종료됨) + 검색 — 조합 가능 |
| **Accordion** | support FAQ, 모바일 메뉴 | `aria-expanded` 로 상태 표현 |
| **Form** | auth, mypage | 유효성 통과 전까지 제출 버튼 `disabled` |
| **Previous / Next** | `sp-pn.js` + `sp-pn.css` | **공지·업데이트·이벤트·고객지원이 100% 같은 컴포넌트를 씁니다.** 페이지별로 다른 것은 데이터뿐입니다 |
| **Dropdown / Select / Search** | `sp-ui.js` | 네이티브 `<select>` 를 대체하는 공용 구현 |

### 이전/다음 컴포넌트 사용법

```js
panel.appendChild(SPPrevNext.build({
  prev:   { title, lang, badge, date, img, onClick } | null,
  next:   { … } | null,
  list:   { … },      // '목록으로' 버튼
  labels: { … }
}));
```

한쪽이 없으면 그 자리를 **아예 그리지 않습니다**(빈 상자가 남지 않게). 한쪽만 있으면 1열입니다.

### 애니메이션 규칙

- `transform` · `opacity` 만 사용 (레이아웃 속성 애니메이션 금지)
- 바운스 · 스프링 · 오버슈트 **없음**
- 주 이징 `cubic-bezier(.16,1,.3,1)` = `--ease` / 보조 `cubic-bezier(.22,1,.36,1)` = `--ease-soft`
- `prefers-reduced-motion: reduce` → 각 페이지 하단의 전역 리셋이
  `transition-duration:.001ms !important` 로 일괄 처리합니다.
  **개별 컴포넌트에 reduced-motion 규칙을 새로 만들지 마세요** — 전역 `!important` 에 막혀
  죽은 코드가 됩니다.

---

## 9. WORLD & IP

### 공간 데이터는 `assets/sp-worlds.js` 하나만 봅니다 (Single Source of Truth)

홈의 「오늘은 어디부터 가볼까요?」 캐러셀과 WORLD & IP 페이지의 월드 카드가 **같은 배열**에서
만들어집니다. 이름 · 이미지 · 국문 설명 · 순서가 두 화면에서 갈라질 수 없습니다.

```js
{ id:'blue-lagoon', name:'Blue Lagoon', fam:'aqua',
  ko:'파라솔 아래, 여유를 즐기기 좋은 해변입니다.',
  img:'world-blue-lagoon.jpg' }              // detail: 고해상도 원본이 따로 있을 때만
```

| 필드 | 설명 |
|---|---|
| `id` | 내부 식별자. **이미지 파일명과 1:1 이 아닙니다** (예: `private-gallery` = 화면상 `BMA`) |
| `name` | 화면 표시명 (고유명사라 KO/EN 공통) |
| `ko` | 확정 국문. 영문은 `sp-i18n.js` 가 이 문장을 **키로** 찾습니다 |
| `img` | `assets/` 아래 실제 파일명 |
| `fam` | 캐러셀 배경 색 계열. **사진에서 추출한 값이 아니라 지정된 매핑입니다** |
| `pending` | 이미지 미수령 공간 — `.ready()` 가 걸러내어 두 화면 모두 렌더 제외 |

`SPWorlds.ready()` 가 렌더 가능한 항목만 돌려줍니다. **현재 19개 정의 중 16개 렌더**,
3개(`In the sky` · `Art Space1` · `Art Space2`)는 이미지 파일 미수령 상태입니다.
파일을 받으면 `img` 를 채우고 `pending` 줄만 지우면 두 화면에 동시에 나타납니다.

### 이미지 비율 — 상세 Viewer

| 종류 | 카드 썸네일 | 상세 Viewer | 검증값 |
|---|---|---|---|
| WORLD 공간 | 335×232 프레임 `object-fit:cover` | **16:9** | 실측 1.778 · 원본 1600×900 / 1920×1080 |
| IP 캐릭터 | 335×232 프레임 `object-fit:cover` | **1:1** | 실측 1.000 · 원본 1080×1080 |

**IP 캐릭터 상세 이미지 14장**은 `assets/char-*-detail.png` 로 전부 프로젝트 안에 있습니다.
(과거에 이 14장이 별도 ZIP 으로 분리되어 누락된 사고가 있었습니다 — §15 참고)

### 캐러셀 배경

배경은 사진이 아니라 **공간이 속한 색 계열 한 겹**입니다.

```
① .worlds__bg     Semantic Base Color   background-color: var(--world-bg)
② .worlds__wash   전역 dim              rgba(0,0,0,var(--wov))
③ .worlds__scrim  Gradient · Vignette   radial ×2 + linear ×1   ← 단색 Flat 방지. 지우지 마세요
④ Carousel · Typography · Progress
```

JS 는 HEX 를 모릅니다 — `--world-bg` 에 `var(--world-rose)` 같은 **토큰 이름만** 씁니다.
그래서 테마 전환에 JS 가 개입하지 않고, 테마를 바꿔도 active index 와 스크롤 위치가 유지됩니다.
전환은 CSS `700ms cubic-bezier(.22,1,.36,1)` 이 담당합니다.

---

## 10. NEWS / SUPPORT

두 페이지 모두 **List → Detail → Previous/Next** 를 같은 뼈대로 씁니다.

```
목록  ─(클릭)→  상세 (같은 페이지, 패널 교체)
                  ├─ 본문
                  └─ SPPrevNext.build({prev, next, list})   ← 4개 카테고리 공용
```

| | NEWS | SUPPORT |
|---|---|---|
| 카테고리 | 공지사항 · 업데이트 · 이벤트 | FAQ · 1:1 문의 · 다운로드 |
| 목록 형태 | 표 형식 행(`.nrow`) / 이벤트만 카드(`.ecard`) | 아코디언 / 목록 / 카드 |
| 검색 | 제목 기준 즉시 필터 | FAQ 내 검색 |
| 추가 필터 | 이벤트 상태(전체/진행중/종료됨) | — |
| 로그인 필요 | 없음 | **1:1 문의만 필요** |

### 이벤트 상태

`period` 문자열(`2026.04.15 09:00 ~ 2026.05.20 09:00`)을 파싱해 **KST 기준으로 자동 판정**합니다.
데이터에 `status:'ongoing'|'ended'` 를 적으면 그 값이 우선합니다.

```js
evStatus(item)  // 'ongoing' | 'ended'
```

> 현재 등록된 이벤트 5건은 **종료 시각이 모두 과거**라 전부 「종료됨」으로 표시됩니다.
> 「진행중」 필터는 정상적으로 빈 상태 문구를 보여줍니다. 데이터를 갱신하면 자동으로 바뀝니다.

### 1:1 문의와 로그인 상태

`support.html` 은 `SPAuth.on()` 을 구독해 로그인/로그아웃 시 문의 화면을 다시 그립니다.
**로컬 boolean 으로 로그인 상태를 캐시하지 마세요** — 헤더는 로그인인데 문의만 잠기는 버그가 났던 지점입니다.

---

## 11. Authentication

> ## ⚠️ 현재 로그인은 **Prototype-only mock authentication** 입니다.
> **실제 서비스용 인증 구현이 아닙니다.** 서버도, 세션 토큰도, 해싱도 없습니다.
> 계정 정보는 브라우저 `localStorage` 에 **평문으로** 저장됩니다.
> **Production 에서는 반드시 백엔드 인증 API 로 교체해야 합니다.**

```
assets/sp-auth.js
├─ CONFIG            정책값 (비밀번호 규칙 · 인증번호 TTL · 지연 등)
├─ Adapter           ← ★ 교체 지점. 여기만 서버 호출로 바꾸면 됩니다
│   me / login / logout / signup / update / verifyCode / …
└─ SPAuth            화면이 쓰는 공개 API (Adapter 를 그대로 노출)
```

`localStorage` 키는 전부 **`sp.proto.*`** 접두사입니다 — 개발자 도구에서 봐도 실제 서비스
데이터가 아니라는 것이 바로 보이도록 한 것입니다.

| 키 | 내용 |
|---|---|
| `sp.proto.users` | 계정 목록 (**비밀번호 평문 — 프로토타입 전용**) |
| `sp.proto.session` | 현재 세션 |
| `sp.proto.pendingCode` | 발급된 인증번호 (메일 서버 대체) |
| `sp.proto.billing` | 재화 · 구독 · 결제수단 · 정산 Mock 데이터 |

### 교체 시 반드시 지켜야 할 것

- **비밀번호를 클라이언트에 저장하지 마세요.** 세션은 서버 발급 토큰(HttpOnly 쿠키 권장)으로.
- **카드 전체번호 · 계좌번호를 클라이언트에 저장하지 마세요.**
  현재 Mock 은 의도적으로 `brand` + `last4`, `bankName` + `accountHolder` + `last4` 만 갖고 있습니다.
  실제 서비스에서는 PG · 결제사 **토큰화**가 필요합니다.
- 인증번호는 `CONFIG.DEV_CODE_HINT = false` 로 끄고 메일/SMS 발송으로 교체하세요.

### 인증번호 (회원가입 · 비밀번호 찾기)

메일 서버가 없으므로 인증번호를 클라이언트에서 발급합니다.
**표시 위치는 화면이 아니라 개발자 콘솔뿐입니다.**

```
[SUPERPLAT PROTOTYPE ONLY] 인증번호: 123456
```

이 `console.info` 는 QA 가 가입 플로우를 끝까지 진행하기 위한 유일한 수단이라 남겨 두었습니다.
Production 전환 시 `CONFIG.DEV_CODE_HINT` 와 함께 제거하세요.

---

## 12. Demo / Test Account

> **UI 에는 노출하지 않습니다.** 로그인 화면의 데모 안내 카드는 제거되었고,
> 로그인 실패 메시지도 테스트 계정 정보를 알려주지 않습니다.
> 아래 정보는 **이 문서에만** 기록합니다.

| 항목 | 값 |
|---|---|
| Email | `user@superplat.com` |
| Password | `superplat1!` |

- 로그인 화면에 **직접 입력**하면 로그인됩니다.
- 로그인 후 헤더 아바타 · 마이페이지 전 탭(프로필 / 개인 및 약관 / 계정 관리 / 캐시·재화 /
  구독 관리 / 결제수단 / 결제·환불 내역 / 정산 관리) · 고객지원 1:1 문의까지 전부 열립니다.
- 정의 위치: `assets/sp-auth.js` 의 `var DEMO = { … }`
- `CONFIG.DEMO_UI = false` 로 **화면 노출만** 꺼져 있고, 계정 자체는 QA 를 위해 살아 있습니다.
- 회원가입으로 계정을 새로 만들어도 됩니다 (같은 `localStorage` 에 쌓입니다).
- 초기화: 개발자 도구 → Application → Local Storage → `sp.proto.*` 삭제.

**Production 배포 전에 `DEMO` 시드와 Adapter 의 Mock 구현을 함께 제거하세요.**

---

## 13. Mock Data

### 정적/Mock (현재 하드코딩)

| 영역 | 위치 |
|---|---|
| WORLD 공간 19개 | `assets/sp-worlds.js` |
| IP 캐릭터 14개 | `world.html` 의 `ITEMS` 배열 뒷부분 |
| 공지사항 · 업데이트 · 이벤트 | `news.html` 의 `CATS` |
| FAQ · 1:1 문의 · 다운로드 | `support.html` |
| 계정 · 세션 · 인증번호 | `assets/sp-auth.js` (localStorage) |
| 재화 · 구독 · 결제수단 · 결제/환불 · 정산 | `assets/sp-auth.js` 의 `seedBilling()` |
| KO/EN 사전 | `assets/sp-i18n.js` |
| 약관 · 개인정보 처리방침 본문 | `terms.html` · `privacy.html` |

### 확정되지 않아 비워 둔 값

정책이 확정되지 않은 항목은 **임의로 채우지 않았습니다.** 날짜 · 리워드 · 가격 · 수수료 ·
세율 · 정산 주기 · 삭제 유예기간 · 환불 기한 · 재가입 제한기간 등이 여기 해당합니다.
화면에 `—` 로 표시되거나, `CONFIG` 에 자리만 있습니다.

> 약관 · 개인정보 처리방침 본문은 **법무 확정본으로 교체해야 합니다.**
> AI 로 다시 쓰거나 기계 번역하지 마세요.

---

## 14. Production Integration Notes

각 항목의 **UI 는 완성되어 있고, 그 자리에 서버 호출만 넣으면 됩니다.**

| 영역 | 현재 (Prototype) | Production 에서 필요한 것 |
|---|---|---|
| **Authentication** | localStorage 평문 · 지연 시뮬레이션 | 로그인 API, 서버 세션/토큰, 비밀번호 해싱, 레이트 리밋 |
| **회원가입** | 클라이언트 인증번호 발급 | 이메일/SMS 발송, 중복 확인, 약관 동의 이력 저장 |
| **비밀번호 찾기** | 동일 | 재설정 토큰 메일 발송 |
| **MyPage Data** | `seedBilling()` 고정값 | 프로필 · 약관 동의 이력 · 계정 상태 조회/수정 API |
| **캐시 · 재화** | 고정 수량 | 잔액 조회, 사용/충전 트랜잭션 |
| **Subscription** | 플랜 전환이 즉시 반영 | 구독 조회/변경/해지 API, 결제 주기, 프로레이션 정책 |
| **Payment** | `brand` + `last4` Mock | **PG 연동 + 카드 토큰화** (전체 카드번호를 클라이언트에 두지 말 것) |
| **Settlement** | `bankName`/`accountHolder`/`last4` Mock | 계좌 실명 확인, 정산 주기·수수료·세율, 지급 내역 API |
| **Inquiry (1:1 문의)** | localStorage 목록 | 문의 등록/조회 API, 첨부파일, 답변 알림 |
| **NEWS / CMS** | HTML 안 배열 | CMS 연동, 목록 페이징, 상세 조회, 조회수/좋아요 |
| **Event** | 기간 문자열 파싱 | 이벤트 API + 서버 시간 기준 상태 판정(클라이언트 시계 신뢰 금지) |
| **Download URL** | 링크 자리만 | 실제 클라이언트 빌드 배포 URL, 플랫폼 분기, 버전 |
| **검색** | 클라이언트 문자열 매칭 | 검색 API (형태소/부분일치 정책 포함) |
| **404** | 정적 파일 | 호스팅 404 설정 연결 |

### UI ↔ Production Logic 경계

- **UI 는 그대로 두고 데이터 소스만 교체**할 수 있게 되어 있습니다.
  특히 `sp-auth.js` 의 `Adapter` 객체와 각 페이지의 데이터 배열이 그 경계입니다.
- 상태 전이(로딩 · 빈 상태 · 에러 · 성공)는 이미 화면이 갖고 있습니다.
  서버 응답을 그 상태에 연결만 하면 됩니다.
- 클라이언트 시계에 의존하는 곳은 **이벤트 상태 판정 한 곳**뿐입니다. 서버 시간으로 바꾸세요.

---

## 15. Asset Notes

- 모든 리소스는 **`assets/` 안에 있고, 참조는 전부 상대경로**입니다.
  루트 절대경로(`/assets/…`)· `file://` · 외부 임시 경로를 쓰지 않습니다.
- 이미지 · 영상 73개, 폰트 1개(+LICENSE).

### ⚠️ 문자열 검색만으로 "미사용 파일" 을 판단하지 마세요

일부 경로는 **런타임에 조립**됩니다.

```js
img.src = 'assets/' + it.img;              // world.html
img.src = 'assets/' + (target.img || …);   // news.html
```

과거에 `grep` 결과만 보고 `world-in-the-stillness.jpg` 를 지웠다가 캐러셀 카드가 빈 상자로
표시된 사고가 있었습니다. **삭제 판단은 실행 후 "깨진 이미지 0" 으로만 하세요.**

### 이미지 규칙

- 공급된 원본을 **재생성 · 색보정 · 크롭 · 확대/축소하지 않습니다.**
  반응형 크롭은 CSS `object-fit` / `object-position` 으로만 처리합니다.
- 다운로드 카드 캐릭터는 **`object-fit: contain`** 입니다 (잘리면 안 되는 이미지).
- WORLD/IP 카드 프레임은 335×232, `cover` + 필요 시 `object-position` 보정.

### 알아 둘 파일

| 파일 | 메모 |
|---|---|
| `assets/dl-pc.jpg` · `dl-mobile.jpg` | 구버전 다운로드 카드 이미지. 현재 **참조되지 않습니다**(정적·런타임 모두 확인). 98KB — 삭제해도 되지만, 위 사고 이력 때문에 임의로 지우지 않고 남겼습니다 |
| `assets/superplat-video-720.mp4` | 좁은 화면용 소스. `index.html` 에서 런타임에 교체합니다 |
| `assets/*-detail.png` | 상세 Viewer 원본 (IP 14장 1080×1080, WORLD 2장 1920×1080) |
| `assets/fonts/` | Pretendard Variable (OFL). `LICENSE.txt` 동봉 |

---

## 16. Known Limitations

프로토타입이라 실제 서비스와 다른 지점입니다.

1. **서버가 없습니다.** 모든 상태는 브라우저 `localStorage` 안에서만 유지됩니다.
   브라우저를 바꾸거나 저장소를 지우면 초기화됩니다.
2. **인증이 Mock 입니다.** 비밀번호가 평문으로 저장됩니다 (§11).
3. **이벤트 상태가 클라이언트 시계 기준**입니다. 사용자가 시스템 시간을 바꾸면 결과가 달라집니다.
4. **검색이 클라이언트 문자열 매칭**입니다. 형태소 분석 · 오타 보정 · 페이징이 없습니다.
5. **딥링크가 제한적입니다.** 마이페이지 탭만 URL 에 남고, WORLD/NEWS 의 탭·필터·상세는
   URL 에 반영되지 않습니다 (새로고침하면 첫 화면으로).
6. **약관 · 개인정보 처리방침 본문은 확정본이 아닙니다.** 법무 확정본으로 교체해야 합니다.
7. **미확정 정책값이 비어 있습니다** — 날짜 · 가격 · 수수료 · 세율 · 정산 주기 등 (§13).
8. **WORLD 공간 3곳(`In the sky` · `Art Space1` · `Art Space2`)은 이미지 미수령**이라
   렌더에서 제외되어 있습니다 (문구 · 색 계열 · 순서는 이미 데이터에 들어 있습니다).
9. **페이지별 CSS 가 인라인이고 공통 부분이 중복**되어 있습니다.
   각 페이지가 공유 base 레이어의 사본을 갖고 있어, 쓰지 않는 규칙도 일부 포함됩니다
   (예: `terms.html` 의 `.phero__title`). 빌드 도입 시 공통 CSS 추출을 권장합니다.
10. **접근성은 검증되었지만 완전하지 않습니다.** 대비 · 터치 타겟 · 키보드 이동 ·
    `prefers-reduced-motion` 은 실측 검증했으나, 스크린리더 전 화면 시나리오 테스트는
    수행하지 않았습니다.
11. **KO/EN 사전이 완전하지 않습니다.** 사전에 없는 문장은 국문이 그대로 나갑니다.
    EN 전환 후 국문 잔존 여부를 화면별로 한 번 더 확인하는 것을 권장합니다.
12. **분석/로깅이 없습니다.** 애널리틱스 · 에러 리포팅 · 성능 모니터링 미연결.
13. **폰트가 CDN 을 먼저 봅니다.** 온라인에서는 jsdelivr 로 외부 요청이 한 번 나갑니다
    (§2). 폐쇄망이나 외부 의존성 제거가 필요하면 `@font-face` 의 `url()` 순서를 뒤집으세요.
