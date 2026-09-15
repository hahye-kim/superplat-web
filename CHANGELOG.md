# SuperPlat — HOME 반응형 프로토타입

시안(PC 1920 / Mobile 375)과 Hero interaction reference(`index-standalone_2_1.html`)를 기준으로
실제 브라우저에서 동작하는 단일 파일 프로토타입입니다.

```
superplat/
├─ index.html          ← 전체 페이지 (CSS/JS 인라인, 섹션별 주석 구획)
├─ README.md
└─ assets/
   ├─ hero-day.jpg / hero-night.jpg        Hero DAY / NIGHT (원본 그대로, 2000×1116)
   ├─ world-*.jpg                          공간 이미지 14종 (16:9)
   ├─ char-*.png                           캐릭터 13종 (원본 비율·라운드 모서리 포함)
   ├─ superplat-video.mp4 / -720.mp4 / -720.webm / -poster.jpg   Section 04 영상
   ├─ community-friends.* / community-events.*    Community 카드 영상 (mp4 + webm + poster)
   ├─ arrow-prev.png / arrow-next.png      공간 캐러셀 좌우 이동 아이콘
   ├─ cta-characters.png / logo-superplat.png
   └─ fonts/PretendardVariable.woff2       Pretendard Variable 100–900 (OFL)
```

## 여는 방법

- **권장**: 로컬 서버로 열기 — 폴더에서 `python3 -m http.server 8000` 후 `http://localhost:8000`
- 더블클릭(`file://`)으로도 동작합니다. 다만 브라우저가 `file://`에서 로컬 폰트 파일을 CORS로 막기 때문에,
  이 경우 Pretendard는 CDN(jsdelivr)에서 받아옵니다. 오프라인 + `file://` 조합에서만 시스템 폰트로 대체됩니다.
- GitHub Pages 등 정적 호스팅에 그대로 올리면 됩니다.

## 구현된 인터랙션

| 섹션 | 내용 |
|---|---|
| Header | Hero 위 transparent → 스크롤 시 white + backdrop-blur + 다크 텍스트. 모바일 햄버거 드로어(body scroll lock, `inert`, ESC 닫기). 한국어/English 전환은 실제로 동작합니다 |
| Hero | IMAGE A/B를 **동일 좌표에 겹쳐** 두고 ① 자동 activation 루프(9.5초: normal → orange pulse → 얼굴에서 퍼지는 mask reveal + scan line → AI Agent 유지 → 복귀) ② 데스크톱 hover 시 루프를 멈추고 **커서가 지나간 경로가 붓자국처럼 쌓였다 서서히 사라지며** AI Agent 상태가 드러남(reference HTML의 trail canvas 구조 이식) ③ 우하단 `NORMAL — AI AGENT` 미니멀 토글 ④ 터치는 자동 시퀀스 + 탭 토글 |
| Character marquee | 이음매 없는 무한 루프, hover 시 급정지 없이 속도만 부드럽게 감속, 카드 hover `scale 1.05 / translateY -4px` |
| World carousel | 데이터 배열 기반 14개 공간. 중앙 active + 좌우 preview(약 30% 노출), transform 기반 무한 loop(index remapping, DOM 점프 없음), 화살표/드래그/스와이프/키보드 ←→, autoplay 6초(hover·focus·drag 시 정지, 3.2초 뒤 재개), active 진입 시 아주 약한 Ken Burns, 공간명·설명 soft transition |
| Cinematic scroll | sticky 구간(데스크톱 210vh / 모바일 200vh)에서 scroll progress에 따라 **실제 영상** 컨테이너가 `100vw → max-width 1400 + radius 20`(모바일은 `100svh → 3:4 카드`)으로 width·height 보간. radius 는 전 구간 유지. 텍스트는 line mask reveal |
| Community cards | hover 시 배경 `#F7F7F7 → #DAE6FF / #FFE9C3`, 아이콘만 살짝 상승·확대 |
| 전역 | `prefers-reduced-motion` 시 루프·스캔·패럴랙스·autoplay 전부 off, 정적 Hero로 표시. 키보드 포커스 링, 터치 타깃 44px, 캐러셀 키보드 조작 |

## 이미지 교체

`index.html` 안 두 개의 배열만 고치면 됩니다. 하드코딩된 `<img>` 반복은 없습니다.

```js
var CHARACTERS = [ { src:'char-band.jpg', ratio:'landscape', alt:'…' }, … ];
var WORLDS     = [ { id:'supertown', title:'SuperTown', desc:'…', en:'…' }, … ];
// WORLDS 의 id → assets/world-<id>.jpg 로 자동 연결됩니다
```

`ratio`는 `portrait`(415:604) / `square`(1:1) / `landscape`(604:375) 세 가지이며,
시안 실측대로 각각 높이 303 / 239 / 188px(@1920)로 원본 비율을 유지합니다.

## 공간 이미지 매핑

첨부해주신 14장을 실제 이미지 내용에 맞춰 이름과 매칭했습니다.

| 파일 | 공간명 |
|---|---|
| world-supertown | SuperTown (큰 나무가 있는 중심가) |
| world-my-gallery / -neon / -minimal | My Gallery 3종 |
| world-music-festival | Music Festival (불꽃 + 네온 스테이지) |
| world-blue-lagoon | Blue Lagoon (해변) |
| world-art-gallery | Art Gallery (화이트 큐브) |
| world-popup | Pop-up Store |
| world-in-the-stillness | In the Stillness (빛의 윤곽만 남은 방) |
| world-broccoli | Broccoli Entertainment |
| world-vod | VOD Space (숲 속 초대형 스크린) |
| world-cafe | Cafe (Charlee's) |
| world-stadium | Stadium (층층이 쌓인 대형 공연장) |
| world-private-gallery | Private Gallery (물 위 콘크리트 갤러리) |

**아직 이미지가 없는 공간**: `Art Space`, `In the Sky`, `Figure Collection`
→ `WORLDS` 배열 하단에 주석으로 자리를 만들어 두었습니다. 파일을 `assets/world-<id>.jpg`로 넣고
주석을 풀면 캐러셀·카운터·loop에 자동 반영됩니다.

## 시안과 다르게 처리한 부분

- **Hero 이미지**: 시안의 광장 배경 대신, 이후 전달해주신 IMAGE A/B(오렌지 배경 캐릭터)를 사용했습니다.
  카피·레이아웃·스크림 구조는 시안 그대로이며, 배경 plate만 교체하면 시안 구도로 되돌릴 수 있습니다.
- **타이포 스케일**: 시안 1920 캡처에서 글자 폭을 실측해 역산했습니다 (H1 65px / 섹션 타이틀 38px / 본문 15px).
  fluid clamp로 375까지 연속적으로 줄어듭니다.
- **컨테이너**: 시안이 헤더·Hero는 240px, 섹션은 260~280px 여백으로 조금씩 달라서
  헤더/Hero는 1440, 섹션은 1400 두 가지 컨테이너로 정리했습니다.
- **캐러셀 side card**: 시안은 side가 약 0.5배로 작지만, 요청하신 스펙(scale .86 / opacity .45)을 따랐습니다.
- **캐러셀 하단 진행 표시**: 시안에 없던 요소지만 공간이 14개로 늘어나 위치 파악용으로 아주 얇게 추가했습니다.
  불필요하면 `.worlds__counter` 블록만 지우면 됩니다.
- **Section 04 영상**: 주신 `HP_SuperPlat_1080.mp4`(HEVC)는 브라우저 호환성이 없어 H.264 MP4(1080p·720p)와
  VP9 WebM 폴백으로 변환했습니다. 원본은 수정하지 않았고 `assets/` 안 파일만 교체하면 됩니다.
- **로고**: 시안에서 흰 워드마크를 알파 추출했습니다. 원본 SVG/PNG가 있으면 `assets/logo-superplat.png` 교체를 권장합니다.

## 이번 수정 (v2) — 무엇을 바꿨나

디자인 시스템·레이아웃·타이포·컬러·콘텐츠·섹션 순서는 그대로 두고 interaction / responsive 만 손봤습니다.

| # | 대상 | 바꾼 것 |
|---|---|---|
| 1 | `.marquee` | 좌우 white gradient **mask-image** 추가 (`--fade` 데스크톱 clamp(56,8.5vw,170) / 모바일 clamp(24,9vw,44)). box overlay 가 아니라 mask 라 hover·감속 인터랙션에 영향 없음 |
| 2 | `CinematicMediaSection` (모바일) | `.cine` 200vh sticky 로 전환. `--p` 하나로 width(100vw→calc(100vw-40px)) + height(100svh→3:4 카드) + radius 를 동시에 보간 → full-screen 영상이 시안의 rounded card 로 연속 축소. 중심은 grid `place-items:center` 로 고정 |
| 3 | `FinalCTA` | 전역 `img{height:auto}` + `.cta__art` 에 `aspect-ratio:375/269` · `object-fit:contain` · `max-width:100%`. 320px 대응 추가 — 이미지가 눌리지 않고 구성 전체가 비례 축소 |
| 4 | `.cine__clip` (신규) | radius 를 가진 clipping wrapper 와 scale 되는 내부 미디어를 분리. `border-radius:inherit` + `overflow:hidden` 이라 확대·축소 전 구간에서 모서리 유지 (full-bleed 에서도 radius 0 이 되지 않게 30% 바닥값) |
| 5 | Section 04 미디어 | 시안 캡처 JPG → **실제 영상** `superplat-video.mp4`(1080p) / `-720.mp4` · `-720.webm`(모바일·폴백) + poster. muted·loop·playsinline, 화면 밖에서는 IntersectionObserver 로 pause |
| 6 | Mobile Header | height 68px(≤360: 64), 좌우 20px, 로고 clamp(82~96px) 세로 중앙 정렬, 햄버거 44×44 히트 영역 / 선 24×1.75 / gap 6 / radius 12. Hero 위 transparent → 스크롤 후 white glass(.88 + blur16 + 1px rgba(0,0,0,.06)). safe-area-inset-top 반영. ⚠️ 햄버거를 grid→flex 로 바꿔 X 변환 어긋남 수정 |

## 이번 수정 (v3) — Motion pass

`--t-fast 260 / --t-normal 560 / --t-reveal 820 / --t-cine 1050 / --stagger 80 / --rv-y 28` 6개 토큰으로 통일하고
연출을 딱 세 가지로 정리했습니다. 그 외 요소는 의도적으로 정지 상태입니다.

- `.r-line` — 헤드라인 **line mask reveal** (translateY 110% → 0 + opacity, 줄 간 80ms). Section 02·03·05, Final CTA, Hero, 영상 섹션 카피에 적용. 글자 단위 애니메이션은 쓰지 않았습니다
- `.reveal` — 본문·카드 fade-up (translateY 28px). 헤드라인이 다 올라온 뒤 약 200ms 시차
- `.rv-img` — 큰 비주얼 slow reveal (1050ms). radius 래퍼는 고정, 내부만 transform
- 캐릭터 rail: 헤드라인 → 설명 → 카드 순서. 앞쪽 8장만 60ms stagger 로 rail 전체가 한 덩어리처럼 들어옵니다
- 영상 섹션: 0~15% full-screen 유지 → 15~60% 축소 → p 0.72 부터 텍스트 (두 줄 사이 90ms). 축소와 텍스트가 하나의 시퀀스
- 버튼: hover scale 1.015 + 화살표 translate(3px,-3px) / 260ms
- 모바일: 같은 motion language 유지, 이동 거리 28→20px · stagger 80→60ms · cinematic 1050→900ms
- entrance 는 `translate` / `scale` 개별 속성, hover 는 `transform` — 서로 덮어쓰지 않습니다
- `prefers-reduced-motion` 에서는 mask·parallax·scroll scale·autoplay 전부 정지, 영상은 poster 로 고정

스크롤 QA 결과 한 화면에서 동시에 움직이는 요소는 데스크톱 최대 4개, 모바일은 캐릭터 rail 구간을 제외하면 4개 이하입니다.

## 이번 수정 (v4) — Typography System + Character rail / World carousel

### Pretendard Typography System
`Pretendard Variable`(woff2, weight 100–900) 한 벌로 사이트 전체를 운영합니다.
정적 3종(Regular/SemiBold/Bold)은 제거했고, 파일 1개로 400·500·600·700을 모두 씁니다.
**섹션마다 font-size를 새로 만들지 않습니다.** 아래 토큰(및 동일한 `.t-*` 유틸리티 클래스)만 재사용합니다.

| token | @375 | @1440 | @1920 | 쓰이는 곳 |
|---|---|---|---|---|
| `--font-display-xl` | 40 | 72 | 84 | Hero |
| `--font-display-lg` | 34 | 54 | 64 | 영상 statement |
| `--font-heading-1` | 30 | 48 | 56 | 섹션 타이틀 |
| `--font-heading-2` | 28 | 34 | 40 | Final CTA |
| `--font-heading-3` | 20 | 24 | 28 | 카드 타이틀 |
| `--font-title` | 19 | 22 | 24 | 공간명 |
| `--font-body-lg` | 16 | 18 | 20 | 섹션 본문 · Hero sub |
| `--font-body-md` | 15 | 17 | 18 | 카드 본문 |
| `--font-body-sm` | 13 | 14 | 15 | 공간 설명 |
| `--font-caption` | 12 | 13 | 13 | 카운터 · 라벨 |
| `--font-nav` / `--font-nav-2` / `--font-btn` | 14 / 13 / 15 | 14 / 13 / 15 | 15 / 14 / 17 | 내비 · 보조 · 버튼 |

- weight: 본문 400 / 보조·내비 500 / 버튼·내비 600 / 제목 700. 800 이상은 쓰지 않습니다
- 자간: 제목 `--ls-heading -.03em`(display는 -.04em), 본문 `--ls-body -.012em`. 한글 균형을 위해 과하게 조이지 않았습니다
- 본문 line-height는 전부 1.6 이상, `word-break:keep-all` 유지
- 색 위계: 제목 `#191F28` / 본문 `rgba(23,26,33,.62)` / 보조 `rgba(23,26,33,.46)` / 이미지 위 흰 텍스트 `rgba(255,255,255,.82)`
- 캐러셀 카운터는 `font-variant-numeric: tabular-nums`로 숫자 폭 고정

### Character rail
- 카드 치수 자체를 키웠습니다(단순 scale 아님) — @1920 portrait 240×350 / square 274 / landscape 345×214, @1440 220 / 252 / 315
- **카드에는 큰 scale을 걸지 않습니다.** radius+overflow를 가진 요소를 크게 scale하면 Chromium이 둥근 클립을 확대 전 해상도로 래스터화해 모서리가 각져 보입니다. hover는 카드 `translateY(-6px) scale(1.035)` + 안쪽 이미지 `scale(1.02)`로 나눴고, `img{border-radius:inherit}`를 넣어 래퍼 클립이 흐려져도 모서리가 남습니다
- 좌우 white fade: `--fade` 데스크톱 `clamp(70px,5.6vw,130px)` / 모바일 `clamp(24px,7vw,44px)`, 램프를 앞쪽으로 몰아 끝 카드가 통째로 날아가지 않습니다
- 마퀴 속도는 세트 폭 기준 **42초/loop**로 자동 산출, hover 시 약 500ms에 걸쳐 감속(급정지 없음)

### World carousel
- Active card `clamp(680px, 53vw, 900px)` → @1920 900 / @1440 763 / 2K·4K 상한 980
- Side preview scale .80 / opacity .38 (모바일 .97 / .5), 2칸 밖은 .72 / 0
- Active hover: 카드 크기 고정, 안쪽 이미지만 `scale(1.035) translateY(-2px)` 620ms
- depth: active `0 18px 50px rgba(0,0,0,.08)` → hover `0 24px 70px rgba(0,0,0,.12)`
- 전환 780ms `cubic-bezier(.16,1,.3,1)`, 화살표 56×56 히트 영역 + 아이콘만 ±3px 이동

## 이번 수정 (v5) — Character section → Square Coverflow Carousel

무한 marquee를 **1:1 정사각 coverflow 캐러셀**로 교체했습니다. 다른 섹션·헤더·반응형/모션 시스템은 그대로입니다.

**전달해주신 `coverflow-carousel.tsx`는 첨부가 누락되어 도착하지 않았습니다.** 명세에 적어주신
rotate 6~12deg / depth .12~.25 / perspective 5~7 / fade .08~.14 값과 상호작용 목록을 기준으로 구현했습니다.

### 레이어 분리 (hover clipping 해결)
```
.cover__viewport   overflow-x:clip / overflow-y:visible  ← 가로만 잘라 페이지 overflow 방지
  .cover__stage    overflow:visible + padding-block:36~60px  ← hover 확대 안전 영역
    .cf-card       coverflow positioning 전용 (x / z / rotateY / offset scale)
      .cf-layer    카드 실체 — 1:1, radius, overflow:hidden, hover scale 전용
        img        이미지 micro zoom 전용
```
세 transform이 서로 다른 요소에 있어 덮어쓰지 않고, JS는 CSS 변수(`--x/--z/--r/--s/--o`)만 갱신합니다.
hover 카드는 `z-index:200`. QA에서 1920/1440/1280/1024/768/375 전 구간, 중앙·좌·우 카드 hover 모두
카드 상하단이 viewport box 안쪽에 **36~131px 여유**를 두고 들어옵니다(잘림 0px).

### 1:1 카드
- `assets/sq-char-*.jpg` — **원본 캐릭터를 100% 크기 그대로** 둔 채 남는 영역만 원본에서 뽑은
  soft wash로 채운 정사각 에셋입니다. crop·stretch·왜곡이 전혀 없습니다. 원본 `char-*.jpg`도 그대로 남겨두었습니다
- `aspect-ratio:1/1`, radius 데스크톱 20~28 / 태블릿 22 / 모바일 18, `img{border-radius:inherit}`로 이중 잠금

### 상태 보간
| offset | scale | opacity | rotateY | depth |
|---|---|---|---|---|
| 0 (active) | 1.13 | 1 | 0° | 0 |
| ±1 | .96 | .84 | 8° | -.16 |
| ±2 | .90 | .58 | 13° | -.30 |
| ±3 | .87 | .30 | 16° | -.42 |

모바일은 active scale 1 / ±1 .90·.62로 더 얕게. perspective는 `card × 6`으로 아주 얕아
Apple Cover Flow 같은 강한 왜곡이 나지 않습니다.

- 카드 크기: @1920 active 339 / inactive 288, @1440 300 / 254, @375 active 225
- 조작: drag · swipe · 화살표 · 키보드 ←→ · 무한 loop · snap, autoplay 5.5초(hover/focus/drag 시 정지, 3.6초 뒤 재개)
- `touch-action:pan-y` — 좌우는 캐러셀, 상하는 페이지 스크롤
- `role="region"` + `aria-roledescription="carousel"`, 각 카드 `role="group"` / `aria-roledescription="slide"`
- `prefers-reduced-motion`에서는 rotate·depth·perspective·entrance를 제거하고 크기 위계만 남깁니다

## 이번 수정 (v6) — Rail 원복 · Community 영상 · Final DIM · Space 리듬

### 1. Character section — flat rail로 원복
3D coverflow(rotateY / perspective / depth / center 확대 / snap / click-to-center)를 모두 제거하고
평면 가로 marquee로 되돌렸습니다. 유지한 것: **1:1 정사각 카드**, rounded corner, 좌우 white fade, 무한 rail.
- hover: 카드 `translateY(-4px) scale(1.03)` + 이미지 `scale(1.03)`, 420ms `cubic-bezier(.16,1,.3,1)`
- clipping 방지 구조는 유지 — `.marquee{overflow-x:clip; overflow-y:visible}` + `.marquee__frame{padding-block: safe}`.
  QA 결과 1920/1440/768 모두 hover 시 카드가 rail box 안쪽에 11~30px 여유를 두고 들어옵니다(잘림 0px)
- 카드 크기 @1920 300 / @1440 255 / @768 196, radius 24~16, 속도 42초/loop, hover 시 ≈500ms 감속

### 2. Community cards — icon 제거 + 영상
- 하단 아이콘 2개 삭제 (`card__icon` 없음)
- 왼쪽 `community-friends`(첫 번째 영상) / 오른쪽 `community-events`(두 번째 영상). H.264 + VP9 + poster
- Desktop: hover → play, leave → pause + `currentTime = 0`. 영상 `scale 1→1.02` / `opacity .94→1` 620ms,
  카드 배경(`#F7F7F7 → #DAE6FF / #FFE9C3`)과 title `-2px`가 함께 움직입니다
- Mobile: IntersectionObserver 60% 기준, **viewport 중앙에 가장 가까운 카드 하나만** 재생. 화면 밖·탭 비활성 시 pause
- `muted / playsinline / loop / preload="metadata"`, autoplay 기본 OFF
- 카드 레이아웃·텍스트·여백·radius·배경색은 그대로

### 3. Final video — Black DIM
`영상 → DIM(z-index 1) → 텍스트(z-index 3)` 로 레이어를 분리했습니다.
- 상단 중심 gradient: `rgba(0,0,0,.30) 0% → .22 28% → .08 58% → 0 100%`
- 이 레이아웃은 카피가 세로 중앙이라 상단 gradient만으로는 밝은 프레임에서 부족해,
  텍스트 자리에만 아주 옅은 타원 scrim(최대 .26)을 추가했습니다 — 영상 색감은 유지됩니다
- 텍스트 `#FFF` + `text-shadow: 0 2px 12px rgba(0,0,0,.18)`, 영상보다 140ms 늦게 line reveal

### 4. Space carousel — small → medium → LARGE → medium → small
| offset | scale | opacity |
|---|---|---|
| 0 (active) | 1 | 1 |
| ±1 | .76 | .42 |
| ±2 | .66 | .24 |
| ±3 | .60 | 0 |

- Active 폭 `clamp(700px, 55vw, 980px)` → @1920 **980**(이전 900) / @1440 792 / @1280 704
- 위치는 균일 step이 아니라 tier별 좌표로 계산합니다 — 중앙↔1차 24~40px, 1차↔2차 16~28px
- Hover: 중앙은 안쪽 이미지만 `scale(1.03) translateY(-3px)`, 좌우 preview는 `scale +2.5% / opacity ×1.3`로 약하게
- 전환 820ms `cubic-bezier(.16,1,.3,1)`
- 모바일: active 82vw, 양옆 preview scale .89 / opacity .58, 노출 약 30%

⚠️ 참고: active가 뷰포트의 51%를 차지하므로 **정지 상태에서 화면에 보이는 카드는 3장**입니다
(첨부해주신 레퍼런스 이미지와 동일한 구성). ±2 tier는 드래그·전환 중에 small → medium → large
리듬으로 읽힙니다. 5장을 동시에 보이게 하려면 active 폭을 35vw 이하로 줄여야 합니다.

## 이번 수정 (v7) — 공간 섹션 좌우 이동 아이콘 교체

기존 인라인 SVG 화살표를 첨부해주신 아이콘 리소스로 교체했습니다.
CSS로 다시 그리지 않고 원본 PNG를 그대로 씁니다(`assets/arrow-prev.png` / `arrow-next.png`,
좌·우 각각 원본 사용, 투명 배경, 잉크 영역만 트림).

| | Desktop | Mobile |
|---|---|---|
| 아이콘 시각 크기 | 38×32 @1920 / 32×27 @1440 | 30×25 |
| 클릭·터치 영역 | 52×52 | 44×44 |
| 좌우 간격 | 14px | 12px |

- Default `opacity .8` → Hover `opacity 1` + `scale(1.08)` + 이동 방향으로 `translateX(∓2px)`,
  Press `scale(.95)`. 전부 340ms `cubic-bezier(.16,1,.3,1)`
- 모바일에는 hover 변형이 적용되지 않고(`@media (hover:hover)` 게이트) swipe 제스처는 그대로입니다
- `<button>` + `aria-label="이전 공간" / "다음 공간"`, 키보드 Enter·Space 및 stage의 ←→ 모두 동작 확인
- 캐러셀 레이아웃·중앙 강조·이동 방식·텍스트·애니메이션은 변경하지 않았습니다

## 이번 수정 (v8) — 캐릭터 rail 원본 배열 · 카드 영상 full-bleed · 공간 섹션 모바일

### 1. 캐릭터 rail — 처음 배열로
1:1 정사각 통일을 걷어내고 **원본 비율 배열**로 되돌렸습니다.
새로 주신 13개 PNG(라운드 모서리·배경이 이미 구워진 리소스)를 그대로 씁니다.
- 배치 리듬: landscape → portrait → square → portrait → square → portrait → landscape …
- @1920 크기 landscape 345×214 / portrait 240×350 / square 274×274
- ⚠️ PNG에 라운드가 구워져 있어 카드에 `overflow:hidden` / `border-radius` / `background`를
  **걸지 않습니다.** 클리핑 자체가 없으므로 hover 확대로 잘릴 일이 없고,
  그림자는 알파를 따라가는 `filter: drop-shadow`를 씁니다
- hover `translateY(-4px) scale(1.03)` / 420ms, 좌우 white fade·42초 loop·감속은 그대로
- 새 캐릭터 2종(새싹 그룹 · 민트 강아지) 포함 총 13개. 파생 에셋(`sq-char-*`)과 옛 `char-*.jpg`는 정리했습니다

### 2. Community 카드 — 영상이 카드 전체를 채움
시안(690×420 / radius 20 / padding 40)대로 카드 자체가 영상이 되도록 바꿨습니다.
- `.card{aspect-ratio:690/420}` + `.card__video{position:absolute;inset:0;object-fit:cover}`
- 오버레이: 하단으로 갈수록 짙어지는 gradient + 전체 black 20% (시안의 Linear 50% / 000000 20%)
- 텍스트는 오버레이 위(z-index 2) 하단 좌측, 흰색 + 아주 옅은 text-shadow
- hover: 영상 `scale 1.03`, 타이틀 `-2px`, 재생/일시정지·모바일 자동재생 로직은 그대로
- ⚠️ 영상이 카드를 덮으므로 기존 hover 배경색(`#DAE6FF` / `#FFE9C3`)은 더 이상 보이지 않아 제거했습니다

### 3. 공간 섹션 — 모바일 간격 / hover
| 항목 | 값 |
|---|---|
| Active card | 84vw (360↓ 85vw, 330↓ 86vw), `max: calc(100vw - 40px)` |
| 카드 사이 실제 여백 | 12px (양옆 10px) |
| 다음 카드 노출 | 375에서 28px |
| adjacent / outer | scale .92·opacity .62 / .86·.38 |
| description → 화살표 | 28px |
| 화살표 → 카드 | 18px |
| 카드 → 공간명 | 20px |

- 좌우 끝은 24~36px의 좁은 mask로만 dissolve — 카드를 가리지 않습니다
- Desktop hover 방향을 뒤집었습니다: 중앙 카드는 `scale(.98)`로 아주 미세하게 **작아지고**
  안쪽 이미지는 `scale(1.015)`로 확대되어 깊이감이 생깁니다. 좌우 preview는 `scale(.99)` + opacity만
- snap/전환 700ms `cubic-bezier(.16,1,.3,1)`, 드래그 중에는 active 이미지가 `scale(.985)`로 눌리는 촉감

---

## v9 — Spacing system · hover polish · video DIM

### 1. Spacing 토큰 시스템 (`:root`)
섹션마다 임의의 margin/padding을 두지 않고 아래 토큰만 씁니다.

| token | @375 | @1024 | @1440 | @1920 | 용도 |
|---|---|---|---|---|---|
| `--space-section-sm` | 68 | 80 | 112 | 148 | 보조 섹션 (CTA 하단) |
| `--space-section-md` | 80 | 96 | 135 | 180 | 표준 섹션 |
| `--space-section-lg` | 92 | 118 | 166 | 220 | 스토리텔링 섹션 |
| `--space-section-xl` | 104 | 128 | 180 | 240 | cinematic pause |
| `--space-content-md` = `--space-title-to-body` | 20 | 22 | 30 | 36 | 제목 ↔ 본문 |
| `--space-content-lg` = `--space-text-to-media` | 32~44 | 40 | 56 | 72 | 텍스트 ↔ 비주얼 |

섹션 배치 — 기계적으로 같은 값이 아니라 콘텐츠 무게에 따라 다르게:

| 섹션 | top | bottom |
|---|---|---|
| 캐릭터 `.s-white` | md | lg |
| 공간 `.s-gray` | md | lg |
| 커뮤니티 `.s-cards` | lg | md |
| Final CTA `.cta` | md | sm |

영상 섹션(`.cine`, sticky 210vh)은 앞뒤 `lg`(1920 기준 220px)가 cinematic pause 역할을 하므로
padding을 따로 더하지 않았습니다. 모바일에서는 토큰 자체를 한 단계 압축해
인접 섹션 합산 여백이 한 화면을 덮지 않게 했습니다.

hover safe padding(`--safe`, `--stage-safe`)은 섹션 여백에 **이중으로 더해지지 않도록**
음수 margin으로 상쇄합니다 → 체감 여백 = 토큰 값 그대로.

4K: 컨테이너 상한을 1400/1440으로 되돌리고 gutter만 넓혔습니다(콘텐츠는 가운데로 모이고 여백만 증가).

### 2. 캐릭터 카드 hover
- **그림자 삭제** — `filter: drop-shadow(...)` 제거
- 확대를 더 부드럽게: `transform 680ms cubic-bezier(.22,1,.36,1)`, `translateY(-5px) scale(1.035)`
- ⚠️ 진입 애니메이션 규칙(`.js .marquee.is-in .marquee__card`)이 transition 목록에서 transform을
  빠뜨려 hover가 순간이동하듯 튀던 버그를 함께 고쳤습니다

### 3. 그림자 clipping 해결 (shadow / clip 레이어 분리)
`.worlds__stage`의 `overflow:hidden`이 카드 그림자를 잘라내던 원인을 제거했습니다.

```
.worlds__stage   overflow-x:clip / overflow-y:visible + 위아래 safe padding
  └ .worlds__viewport   carousel 위치 계산
      └ .slide          carousel translate + hover scale + box-shadow (overflow 없음)
          └ .slide__inner   overflow:hidden + border-radius:inherit (클리핑 전담)
              └ img         inner zoom
```

- 그림자도 UI 카드가 아닌 브랜드 사이트 톤으로: `0 6px 16px rgba(23,26,33,.035)` + `0 26px 60px rgba(23,26,33,.055)`,
  hover `0 8px 20px .04` + `0 32px 76px .07`
- hover 카드는 `z-index:40`으로 올려 옆 카드에 가리지 않습니다
- 모든 상태에서 radius 동일(1920 기준 22px), 가로 스크롤 없음

### 4. 공간 캡션 타이포 (당근 About 참고)
| | 이전 | 이후 |
|---|---|---|
| 공간명 | `--font-title` (19→24) | `--font-heading-3` (20→28), `-.025em` |
| 설명 | `--font-body-sm` (13→15), `.46` | `--font-body-md` (15→18), `.62` |

### 5. Community video card — DIM 20% 고정 + radius 고정
요청한 4단 구조로 역할을 분리했습니다.

```
.card            레이아웃 · 텍스트 패딩 (scale 없음)
 └ .card__visual  overflow:hidden + border-radius:var(--card-r)  ← 클리핑 전담
     ├ video      hover scale(1) → scale(1.02), 620ms
     └ .card__dim  rgba(0,0,0,.20) 고정 (inset:0, border-radius:inherit)
 └ .card__title / .card__desc
```

- 기존 gradient 오버레이를 걷어내고 **flat black 20%** 하나만 남겼습니다 → 영상이 훨씬 선명
- default / hover / 재생중 / mouse leave **모두 20% 동일**, opacity 변화 없음
- radius는 `--card-r`(기존 `clamp(14px,1.05vw,20px)`) 재사용, 4개 상태 전부 동일하게 측정 확인
- DIM을 옅게 한 대신 텍스트에 2단 shadow를 실어 가독성 유지
- 모바일 IntersectionObserver 한 번에 하나만 재생 — 기존 동작 그대로

---

## v10 — Mobile Space Section 비율 · 타이포 계층 · radius 16px

아임웹 "브랜드 성장은 더 빠르게" 섹션의 비례를 참고하되 SuperPlat 디자인 언어는 그대로 유지했습니다.

### 1. 카드 비율 / 화면 점유율 (375 기준)
| 항목 | 이전 | 이후 |
|---|---|---|
| Active card | 84vw = 315px | **88vw = 330px** |
| 좌우 여백 | 30px | **22px** |
| 다음 카드 노출 | 좌우 각 11px | 좌우 각 12px |
| 카드 사이 실제 여백 | 12 / 10 | **11 / 9** (≥400px 13 / 11) |
| aspect-ratio | 16:9 | 16:9 (변경 없음) |
| adjacent scale·opacity | .92 / .62 | .92 / .62 (변경 없음) |

- 좌우 여백은 JS에서 `(stage폭 - 카드폭) / 2`로 계산해 화면 폭과 무관하게 항상 좌우가 동일합니다
- 320px에서도 87.5vw / 좌우 20px을 유지합니다
- `scale()`이 아니라 카드의 **실제 width**를 키웠으므로 이미지 해상도 손실이 없습니다

### 2. 모바일 이미지 radius 16px 고정
```
.slide            border-radius:16px  (모바일)  ← 위치 · carousel scale
  └ .slide__inner  overflow:hidden + border-radius:inherit  ← 클리핑 전담
      └ img        object-fit:cover + inner zoom
```
default / active / drag / carousel transition / touch press / scale 애니메이션 중간 상태를
전부 측정해 **7개 카드 모두 16px 유지**를 확인했습니다. Desktop radius(18~22px)는 그대로입니다.

### 3. 타이포 계층 (375)
| 요소 | 이전 | 이후 |
|---|---|---|
| Section title | 30px / lh 1.15 | **33px / lh 1.18 / ls -.03em**, `max-width:15ch`로 2줄 고정 |
| Section desc | 16px / .62 | 16px / .62 (유지) |
| 공간명 | 20px / 700 | 20px / 700 (유지) |
| 공간 설명 | 15px / 400 | 15px / 400 (유지) |

`--font-heading-1`의 하한만 30 → 33px으로 올렸으므로 모든 섹션 타이틀에 동일하게 적용됩니다.

### 4. 모바일 여백 계층 (375)
| 구간 | 값 |
|---|---|
| 섹션 상단 padding | 92px |
| 제목 → 본문 | 21px |
| 본문 → 화살표 | 39px |
| 화살표 → 카드 | 18px |
| 카드 → 공간명 | 21px |
| 공간 정보 → 다음 섹션 | 96px |

### 5. 그대로 유지한 것
16:9 비율 · object-fit:cover · 좌우 이동 아이콘 리소스(28~32px 시각 / 44×44 터치) ·
스와이프 · pointer down `scale(.985)` 200ms 촉감 · Desktop hover(카드 .98 / 안쪽 이미지 1.015).

---

## v11 — Final Download CTA 모바일 정리

Final CTA 섹션만 조정했습니다. 다른 섹션의 layout / animation / typography는 변경 없음,
Desktop CTA(padding 180/148 · title 40px · button 63px · art 374px)도 그대로입니다.

### 모바일 리듬 (375)
```
[Community cards]
   ↓ 104px
문은 열려있습니다.
지금 바로 들어와 보세요!      31px / 700 / lh 1.22 / ls -.03em
   ↓ 28px
[ 다운로드 바로가기 ]         50px 높이 · padding 22px · 16px/600 · radius 999px
   ↓ 48px
[ Character visual ]         88vw, 오른쪽 정렬(오른쪽 여백 20px)
   ↓ 80px
[ Footer ]
```

| 항목 | 이전 | 이후 |
|---|---|---|
| 섹션 padding | 92 / 72 | **104 / 80** |
| Title | 28px / lh 1.25 | **clamp(26px, 8.3vw, 34px) / lh 1.22 / ls -.03em** |
| Title → Button | 21px | **28px** |
| Button | 48px · 20px · 15px | **50px · 22px · 16px** |
| Button → Character | 39px | **48px** |
| Character width | `min(300px, 76%)` = 68vw | **`min(88vw, 100%)`** = 88vw |

- 제목은 `.r-line--inline`이 모바일에서 block이 되므로 **두 구절이 각각 정확히 한 줄**입니다.
  폰트를 vw 기반 clamp로 잡아 430 / 390 / 375 / 360 / 320 전부 1줄씩 유지되는 것을 측정 확인했습니다
- 캐릭터는 3개가 하나의 PNG composition입니다. `width`만 지정하고 `height:auto` +
  `aspect-ratio:375/269` + `object-fit:contain`이므로 **렌더 비율 1.394 = 원본 비율 1.394**,
  개별 캐릭터가 눌리거나 잘리지 않고 구성 전체가 비례로만 작아집니다
- 정렬은 시안대로 텍스트·버튼 왼쪽, 캐릭터는 그 아래 오른쪽(오른쪽 여백 20px 고정)
- 320px에서는 캐릭터를 92vw로 한 단계 더 키워 작아 보이지 않게 했습니다

---

## v12 — Hero DAY → NIGHT reveal

Hero의 background visual을 **DAY 이미지 + 커서로 드러나는 NIGHT reveal** 구조로 교체했습니다.
Hero를 새로 만들지 않고 기존 canvas trail architecture를 그대로 재사용했습니다.

### 1. 이미지
| 레이어 | 파일 | 역할 |
|---|---|---|
| `.is-normal` | `assets/hero-day.jpg` | 항상 보이는 바탕 (DAY) |
| `.is-agent` | `assets/hero-night.jpg` | 화면에 직접 안 보임 — canvas가 붓 자국 모양으로만 퍼올리는 원본 (NIGHT) |
| `.is-reveal` | `assets/hero-night.jpg` | 터치 환경 전용 자동 reveal 마스크 |

- 원본 그대로 사용(2000×1116, JPEG q93 4:4:4). AI 재생성·색보정·crop·왜곡 없음
- 두 파일이 **완전히 같은 픽셀 크기**이고 세 레이어가 **같은 `object-fit`/`object-position`** 을 쓰므로
  전 뷰포트에서 렌더 박스가 1개로 측정됩니다 → **pixel-perfect alignment**
- canvas는 `getComputedStyle(...).objectPosition`을 읽어 같은 cover crop을 재현하므로
  breakpoint가 바뀌어도 붓 자국과 이미지가 어긋나지 않습니다
- 기존 `hero-normal.jpg` / `hero-agent.jpg`는 삭제했습니다

### 2. object-position (DAY / NIGHT 100% 동일)
| 구간 | 값 | 의도 |
|---|---|---|
| ~1280+ | `50% 50%` | 광장 전체 구도 · 왼쪽 텍스트 / 오른쪽 캐릭터 |
| ≤1279 | `56% 50%` | 캐릭터 쪽으로 살짝 |
| ≤1023 | `60% 48%` | 태블릿 |
| ≤767 | `64% 44%` | 얼굴이 헤더에도 카피에도 가리지 않는 지점 |

세로 화면에서는 16:9 원본이 크게 잘리므로 모바일 hero 카피를 하단(`justify-content:flex-end` + `padding-bottom:13vh`)으로
내려 얼굴을 가리지 않게 했습니다.

### 3. Reveal interaction
- **Desktop**: 자동 루프 없음. 커서를 움직인 자리에만 밤이 번집니다 (발견형 surprise)
- **Touch**: 포인터가 없으므로 11초 주기의 아주 느린 자동 reveal 유지. 탭하면 상태 토글
- **Trail 연속성**: 포인터 이벤트 사이를 붓 반지름의 22% 간격으로 보간해 최대 48개 stamp.
  ⚠️ stamp alpha를 steps로 나누지 않습니다(나누면 빠른 스트로크가 옅어져 자국이 끊겨 보임)
- **Edge**: `blur(붓 반지름 × .84)` — 원형이 인식되지 않는 feather. 중앙 NIGHT ~85%, 가장자리 0
- **Decay**: half-life 250ms → 실측 leave +0.45s에 alpha 58, +1.0s에 0. 체감 잔상 약 0.8초
- **Enter**: 0 → 1 로 200ms 램프 (밤이 툭 나타나지 않음)
- **Leave**: snap-back 없이 trail 버퍼가 프레임마다 줄며 자연스럽게 DAY 복귀
- **Reduced motion**: DAY 한 장 고정

### 4. 제거한 것 (DAY·NIGHT 컨셉과 맞지 않는 요소)
- `NORMAL —— AI AGENT` 상태 라벨/토글 버튼
- orange pulse (`.hero__pulse`)
- orange scan line (`.hero__scan`)

필요하시면 되살릴 수 있습니다.

### 5. 레이어 순서 (item 27)
```
DAY image (z0) → NIGHT 원본(z1, 비가시) → 자동 reveal 마스크(z2) → reveal canvas(z3)
→ 텍스트 가독 gradient(z6) → Hero copy / CTA(z10) → Header(fixed)
```
가독 gradient가 canvas **위**에 있으므로 DAY / NIGHT 어느 쪽이든 텍스트 대비가 동일합니다.
Desktop gradient는 `rgba(0,0,0,.58) → .42(21%) → .14(38%) → 0(53%)` — 캐릭터가 있는
오른쪽 절반에는 영향이 없습니다.

### 6. 유지한 것
Hero height(100svh) · typography 토큰 · line reveal motion · CTA · Header ·
미세 parallax · 터치 환경 cinematic zoom · responsive breakpoint.
DAY / NIGHT 전환 중 어떤 요소도 움직이지 않습니다(변하는 것은 조명뿐).
모바일 세로 스크롤은 그대로(`touch-action:auto`, 500px 스크롤 확인).

---

## v13 — 공간 섹션 배경 동기화 + 슬롯 간격

"오늘은 어디부터 가볼까요?" 섹션만 수정했습니다.

### 1. 선택한 공간 → 섹션 배경 (ambient)
```
#worlds (position:relative)
 ├── .worlds__bg      ← crossfade 이미지 2장 (z0)
 ├── .worlds__veil    ← 흰 gradient (z0)
 └── .wrap / .worlds  ← 제목 · 캐러셀 · 캡션 (z1, position:relative)
```
- 카드에 쓰인 **정확히 같은 image source**(`WORLDS[i].img`)를 재사용합니다. 별도 리소스 없음
- 배경 레이어는 절대 배치라 **섹션 높이·레이아웃에 전혀 관여하지 않습니다**

| | Desktop | Mobile |
|---|---|---|
| opacity | .16 | .11 |
| blur | 28px | 16px |
| scale | 1.10 | 1.12 |
| transition | 780ms `cubic-bezier(.16,1,.3,1)` | 동일 |

### 2. Crossfade — flash 없음
`<img>` 2장을 번갈아 씁니다. 새 이미지를 넣은 뒤 **`decode()` 완료를 기다렸다가**
old `opacity 1→0` / new `0→1`을 동시에 시작합니다.
전환 중간(330ms 지점)을 측정하면 두 레이어가 `.137 / .023`으로 **동시에 살아 있어**
white/black flash도 layout jump도 발생하지 않습니다.

### 3. Active card ↔ 배경 동기화
`syncBg()`를 **`render()` 안 한 곳**에서만 호출합니다.
card click / prev / next / keyboard / mouse drag / touch swipe / autoplay가
전부 `render()`를 지나므로 구조적으로 어긋날 수 없습니다.
실측: 화살표 이동 · 카드 클릭 · 드래그 · 스와이프 후 배경 src == active 카드 src.

### 4. 텍스트 가독성
흰 veil은 섹션 전체를 덮지 않고 **제목·본문 구간(0~31%)과 캡션 구간(87~100%)만** 덮습니다.
가운데(캐러셀 구간)는 비워 두어 공간의 컬러가 은은하게 번지게 했습니다.
→ 섹션이 회색으로 가라앉지 않고 기존의 밝은 SuperPlat 톤을 유지합니다.

### 5. 슬롯 간격 · 크기
| | 이전 | 이후 |
|---|---|---|
| Active width | `clamp(700px, 55vw, 980px)` | **`clamp(760px, 48vw, 960px)`** |
| 1279↓ / 1023↓ | — | `min(760px, 100vw-120px)` / `min(720px, 100vw-96px)` |
| Active ↔ adjacent gap | 24~40px | **16~24px** (실측 1920:25 · 1440:18 · 1280:16) |
| adjacent ↔ outer gap | 16~28px | **12~20px** |
| tier scale / opacity | 1 / .76·.42 / .66·.24 | 변경 없음 (요청 범위 내) |

모바일은 그대로입니다 — 88vw · gap 11px · radius 16px (전 상태 유지 실측 확인).

### 6. 성능
blur는 정적이고 **opacity만 애니메이션**합니다. 연속 6회 이동 중 프레임 측정
median 33.3ms / p95 33.4ms / max 49.9ms (headless 30fps 기준) — frame drop 없음.
`prefers-reduced-motion`에서는 crossfade transition을 끕니다.

---

## v14 — 공간 섹션 배경 visibility + **World & IP 페이지 신규**

### A. 공간 섹션 배경이 더 잘 보이게
| | 이전 | 이후 |
|---|---|---|
| Desktop opacity | .16 | **.26** |
| Desktop blur | 28px | **10px** |
| scale | 1.10 | **1.04** |
| Mobile opacity / blur | .11 / 16px | **.21 / 8px** |
| White overlay | `rgba(245,245,246,…)` 부분 덮기 | **`rgba(255,255,255,.82→.64→.52→.64)` 4-stop** (모바일 .86→.70→.62→.72) |
| crossfade | 780ms | **800ms** `cubic-bezier(.16,1,.3,1)` |

건물·하늘의 큰 형태가 알아볼 수 있는 수준으로 올라왔고, 제목·본문·캡션 구간은
gradient가 더 밝게 덮어 가독성을 유지합니다. 중앙 Active 이미지가 여전히 가장 선명합니다.
layout / card spacing / active image size / 모바일 16px radius / interaction은 변경 없음.

---

### B. `world.html` — World & IP 페이지

메인페이지와 **같은 파일 안에 같은 디자인 시스템을 복제**해 넣었습니다
(토큰 · 헤더 · 드로어 · CTA · 푸터 · reveal 시스템 · motion 토큰 전부 index.html과 동일).
`index.html`은 단일 파일 형태를 유지해야 해서 공용 CSS를 외부로 빼지 않았습니다.

#### 1920 시안 실측 대조
| 랜드마크 | 시안 | 구현 |
|---|---|---|
| Hero 높이 | 0–449 | **0–449** |
| Statement | 621–717 | 614–731 |
| 소제목 `월드 & IP` | 792–818 | **792–823** |
| 탭 / 검색 바 | 849–896 | 851–899 |
| 카드 1행 | 917–1383 | 920–1392 |
| 행 pitch | 507 | 512 |
| 컨테이너 | 1400 | **1400** |
| 카드 | 335 × (이미지 232 + 본문) | **335 × 232** |
| 열 gap / 행 gap | 20 / 40 | **20 / 40** |
| 이미지 비율 | 1.444 | **1.444 (335/232)** |
| 더보기 | 2945–3009 | 2967–3032 |

375 모바일: 좌우 padding 20px · 1열 · 카드 폭 335 · 카드 사이 30px ·
**radius 16px 고정** · 초기 4장 + 더보기 — 시안과 동일.

#### 반응형
4열(1280+) → 3열(1024–1279) → 2열(768–1023) → 1열(767↓).
4K/2K에서도 컨테이너는 1400으로 고정되고 여백만 넓어집니다.
Hero `object-position`은 breakpoint별로 `50% 50%` → `56% 50%`(≤1023) → `62% 46%`(≤767).

#### 카드 구조 (그림자 clipping 방지 — 메인페이지와 동일한 4단 분리)
```
.wcard         그리드 아이템 (transform 없음)
 └ .wcard__shell  overflow:visible + hover translateY(-4px) + box-shadow  ← 그림자
     ├ .wcard__clip  overflow:hidden + border-radius                       ← 클리핑
     │   └ img       object-fit + hover scale(1.02)                        ← inner zoom
     └ .wcard__body  배지 / 제목 / 메타
```
상위에 `overflow` 를 건 요소가 하나도 없음을 실측 확인했습니다(clippingAncestors: []).

#### IP 캐릭터 카드
캐릭터 PNG는 배경이 구워져 있고 세로·정사각·가로 비율이 섞여 있으므로
`object-fit:cover`로 자르지 않고 **`contain` + 각 PNG의 원본 배경색**으로 채웁니다.
→ 캐릭터가 잘리거나 눌리지 않고, 시안의 컬러 카드 룩과 동일합니다.

#### 기능
- 탭 필터 `전체 / 월드 / IP캐릭터` (좌우 화살표 키보드 이동 지원, 44px 터치 타깃)
- `더보기` — PC 16장 / 모바일 4장 단위, 전부 표시되면 자동으로 숨김
- 한/영 전환 — 배지·메타·버튼·문장 전부 대응
- 카드 데이터는 `ITEMS` 배열 한 곳. **DOM 하드코딩 없음**

#### ⚠️ 확인 부탁드리는 것
1. **Hero 배너 원본 파일** — 첨부해 주신 시안 PNG에서 잘라 썼습니다(1920×394).
   헤더 UI와 베이크된 `WORLD & IP` 글자는 지웠지만 1920 초과 해상도에서는 부드러워집니다.
   원본을 주시면 `assets/world-hero.jpg`만 교체하면 됩니다.
2. **`옷가게` · `Figure collection` · `보리`** 카드 이미지도 같은 이유로 시안에서
   잘라 썼습니다(각 335×232 — 1920 표시 크기와 1:1이라 데스크톱에서는 손실 없음).
3. 모바일 시안의 Hero 타이틀이 `Support`로 되어 있어 PC 시안대로 **`WORLD & IP`** 로 통일했습니다.
4. Statement 타이포는 시안 실측이 약 34px인데, 메인페이지 토큰 체계(`--font-heading-2` 40px)를
   재사용하라는 지침을 우선해 **40px**로 맞췄습니다.
5. `index.html` 헤더·푸터의 `월드 & IP` 링크를 `world.html`로 연결했습니다(그 외 홈은 변경 없음).

---

## v15 — `news.html` 신규 · 배경 visibility 한 단계 더 · 카드 hover 통일

### A. 공간 섹션 배경 (요청값 그대로 적용)
| | Desktop | Mobile |
|---|---|---|
| opacity | **.38** | **.30** |
| blur | **5px** | **4px** |
| scale | 1.03 | 1.03 |
| White DIM | `.62 → .46 → .34 → .48 → .68` 5-stop | `.72 → .56 → .46 → .58 → .76` |

이제 선택한 공간의 건물·하늘·지형이 배경에서도 같은 사진임을 바로 알 수 있고,
제목·설명 구간만 gradient가 국소적으로 보호합니다. 중앙 Active 썸네일이 여전히 1순위입니다.
crossfade(800ms) · layout · spacing · radius · interaction 변경 없음.

### B. 카드 hover — 당근 PR 스타일로 통일
World & IP 카드와 NEWS 이벤트 카드 모두:

| | 이전 | 이후 |
|---|---|---|
| box-shadow | hover 시 2단 그림자 | **none (default·hover 모두)** |
| card | `translateY(-4px)` | **`scale(1.03)`** |
| inner image | `scale(1.02)` | **`scale(1.015)`** |
| duration | 560ms | **500ms** `cubic-bezier(.16,1,.3,1)` |
| mobile | `scale(.99)` | `scale(.99)` / 180ms |

`transform`만 쓰므로 주변 카드가 밀리지 않고, 클리핑 wrapper가 분리돼 있어
확대 중에도 radius가 유지됩니다(실측: hover 시 transform `1.03`, box-shadow `none`,
clip radius 불변, 상위 overflow 요소 0개).

---

### C. `news.html` — NEWS 페이지

메인 / World & IP와 같은 디자인 시스템(토큰·헤더·드로어·CTA·푸터·reveal·motion)을 그대로 사용합니다.

#### 1920 시안 실측 대조
| 랜드마크 | 시안 | 구현 |
|---|---|---|
| 배너 | 0–449 | **0–449** |
| 페이지 제목(가운데) | 616–656 | 614–669 |
| 탭 + 검색바 | 704–757 | 716–770 |
| 표 상단선 | 798 | 812 |
| row pitch | 69.5 | **70** |
| select / search | 300×54 / 480×54 | **300×54 / 480×54** |
| 더보기 | 132×65 | **132×65** |
| 이벤트 썸네일 | 482×271 (16:9) | **482×271 (16:9)** |
| 이벤트 row pitch | 381 | **382** |

375 모바일: 배너 220 · 좌우 20px · 제목 좌측 정렬 · 탭 한 줄(가로 스크롤 가능) ·
select/search full width 56px · 리스트 행 139px(제목 + 등록날짜/좋아요/조회수 3줄) ·
이벤트 썸네일 335×188 **radius 16px** — 시안과 동일한 구조.

#### 3개 카테고리
- **공지사항 / 업데이트** — 같은 List 컴포넌트, 데이터만 다름
  - Desktop: `등록날짜 / 제목 / 좋아요 / 조회수` 4열 그리드, row hover 시 배경 `rgba(23,26,33,.022)` + 제목 `translateX(4px)`
  - Mobile: 제목 + 라벨/값 3줄로 정보 우선순위 재배치
- **이벤트** — 16:9 썸네일 카드. 좌 썸네일 / 우 배지·제목·기간(Desktop), 세로 스택(Mobile)

#### 기능
- 탭 전환 — 190ms crossfade 후 교체(깜빡임·긴 재진입 애니메이션 없음)
- 검색 — 제목/영문 제목 대상, 180ms debounce, 결과 없으면 빈 상태 표시
- 더보기 — 리스트 10건 / 이벤트 5건 단위, 전부 표시되면 자동 숨김
- 한/영 전환 — 제목·탭·배지·placeholder·버튼까지 대응
- 키보드 좌우 화살표로 탭 이동, 터치 타깃 44px 이상

#### ⚠️ 데이터에 대해
공지·업데이트·이벤트 문구는 **구조 확인용 예시**입니다.
지시하신 대로 실제 서비스에 없는 구체적 보상·수치·참여조건은 만들지 않았고,
날짜/좋아요/조회수는 명백한 더미 값입니다. 실제 데이터로 교체할 때는
`news.html` 안의 `NOTICES` / `UPDATES` / `EVENTS` 배열만 고치면 됩니다.

#### ⚠️ 확인 부탁드리는 것
1. **배너 이미지는 첨부해 주신 원본(3840×900)을 재저장 없이 그대로 사용**했습니다.
   crop은 CSS `object-position`만으로 처리 — Desktop `50% 42%` / Tablet `52% 44%` / Mobile `56% 46%`.
2. 모바일 업데이트 시안에는 `커뮤니티` 탭이 하나 더 있는데, PC 시안과 지시사항(3개 카테고리)에 맞춰
   **공지사항 / 업데이트 / 이벤트 3개**로 통일했습니다.
3. 모바일 이벤트 썸네일은 시안 실측이 약 3:2인데, 지시사항(16:9)과 PC 시안(16:9)에 맞춰
   **16:9로 통일**했습니다.
4. 이벤트 썸네일은 기존 world/community 에셋을 재사용했습니다. 전용 이벤트 이미지가 있으면 교체 가능합니다.
5. `index.html` · `world.html`의 `뉴스` 링크를 `news.html`로 연결했습니다.

---

## v16 — `support.html` 신규 · NEWS 카드 radius

### A. NEWS 카드형 슬롯 radius
| breakpoint | radius |
|---|---|
| 768px 이상 (Desktop / Tablet) | **24px** |
| 767px 이하 (Mobile) | **16px** |

중간 breakpoint에서 임의 값이 생기지 않도록 `clamp` 대신 고정값 2단계만 씁니다.
클리핑을 `.ecard__clip`이 전담하므로 hover `scale(1.03)` 중에도 radius가 유지됩니다
(실측: 1920·1024 default/hover 모두 24px, 375 16px).
Button / Badge / Tab / Search / Pagination의 기존 radius는 그대로입니다.

---

### B. `support.html` — Support 페이지

메인 / World & IP / NEWS와 같은 디자인 시스템을 그대로 사용합니다.

#### 1920 시안 실측 대조
| 랜드마크 | 시안 | 구현 |
|---|---|---|
| 배너 | 0–449 | **0–449** |
| 컨테이너 | 1400 | **1400** |
| select / search | 310×54 / 500×54 | **309×54 / 499×54** |
| FAQ row pitch | 92.7 | **92** |
| Q 마크 원 | 36px | **36px** |
| 답변 패널 | `#F5F5F5` | **동일** |
| 문의하기 CTA | 149×54, 우측 정렬 | **동일** |
| 다운로드 카드 | 1400×407 | **1400×407 (aspect-ratio)** |
| 드라이버 카드 | 4열 | **4열 → 2열(≤1023) → 1열(≤520)** |

#### FAQ
- 카테고리 select(전체 / 계정·로그인 / 설치·실행 / 마이스페이스 / 캐릭터 / 결제·구독 / 오류·버그 / 기타) + 검색
- 아코디언 — `grid-template-rows 0fr → 1fr` 380ms, 답변 텍스트는 60ms 늦게 fade-up, chevron 180° 회전
- hover 시 배경 `rgba(23,26,33,.022)` + 질문 `translateX(3px)`, **그림자 없음**
- `aria-expanded` / `aria-controls` 연결, 터치 타깃 56px 이상
- 검색 결과 없음 → **"1:1 문의하기" CTA**로 자연스럽게 연결

#### 1:1 문의 (전체 플로우 동작)
```
비로그인 → "로그인 후 이용할 수 있습니다" + [로그인하기] / [FAQ로 돌아가기]
        → 로그인 → (문의하기를 눌러 왔다면) 작성 화면으로 자동 복귀
로그인   → 내 문의 내역(답변중 / 답변완료 배지)
        → [문의하기] → 유형·제목·내용·파일첨부·안내 → validation → 확인 → 등록 완료
        → [내 문의 확인] → 목록 → 행 클릭 → 상세(답변중이면 "답변을 준비 중입니다")
```
- 필수 항목 미입력 시 field-level 에러(`role="alert"`, `aria-invalid`)
- 등록 완료 후 목록 맨 위에 추가되고 상태는 `답변중`
- 모바일에서는 문의하기 CTA가 full width, 목록 행은 배지/제목/메타 스택으로 재배치

#### 다운로드
- 시안의 PC / Mobile 설치 카드 2종(각 1400×407, hover 시 그림자 없이 `scale(1.02)`)
- PC 사양 표 · 드라이버 4종 카드 · Mobile 사양 표 — 표는 좁은 화면에서 가로 스크롤
- **사양 수치는 시안에 적혀 있는 값을 그대로 옮겼습니다.** 임의로 만든 수치가 아닙니다

#### ⚠️ 확인 부탁드리는 것
1. **FAQ 문답은 SuperPlat 맥락으로 새로 작성했습니다.** 첨부 시안의 FAQ 내용이
   입사지원·면접 문의(그리고 타사 이름)로 되어 있어 플레이스홀더로 판단했습니다.
   지시하신 카테고리(계정/로그인·설치/실행·마이스페이스·캐릭터·결제/구독·오류/버그·기타)를 따랐고,
   없는 정책·수치·보상은 쓰지 않았습니다.
2. 배너는 시안 PC 페이지 상단을 잘라 썼습니다(1920×394, 베이크된 헤더 UI와 `SUPPORT` 글자 제거).
   **원본 파일을 주시면 `assets/support-hero.jpg`만 교체하면 됩니다.**
3. 다운로드 카드 비주얼(캐릭터·휴대폰)과 드라이버 로고 4종도 시안에서 잘라 썼습니다.
4. 로그인 상태는 **프로토타입용 메모리 상태**입니다. 새로고침하면 비로그인으로 돌아갑니다.
   실제 세션 연동 지점은 `support.html`의 `isLoggedIn` 주석에 표시해 두었습니다.
5. 다운로드 버튼과 드라이버 링크는 `href="#"`입니다. 실제 URL 연결 지점도 주석으로 표시했습니다.
6. `index.html` · `world.html` · `news.html`의 `고객지원` 링크를 `support.html`로 연결했습니다.

---

## v17 — NEWS 상세 페이지 · Support 문의 폼 중앙 정렬 · `auth.html` 신규

### A. NEWS 상세 (`news.html` 안에서 view 전환)
시안대로 배너·페이지 제목·탭바 없이 기사만 보여줍니다.

| 랜드마크 | 시안(1920) | 구현 |
|---|---|---|
| 읽기 폭 | 730px | **730px** |
| 기사 제목 | ~44px 가운데 | **44px 가운데** |
| 공유 아이콘 | 40px × 4, gap 8 | **동일** |
| 본문 | 16px / 줄 간격 30 | **16px / 1.85 (29.6)** |
| 본문 이미지 | 690×402, 라운드 | **동일 비율 · radius 24/16** |
| 이전 / 다음 | 2열, 썸네일 좌 · 텍스트 우 | **동일 (모바일 1열 스택)** |
| 목록으로 | 가운데 pill | **동일** |

- **article typography 정의**: `h2` / `h3` / `p` / `ul` / `hr` / `figure` — 업데이트처럼 긴 글도 읽기 편하게
- 이벤트 상세는 썸네일이 앞에 오고 제목·메타가 왼쪽 정렬(조금 더 강한 hierarchy)
- **목록 복귀 시 탐색 상태 유지** — 실측: 스크롤 1400에서 상세 진입 → 목록으로 → **1400 복귀**,
  더보기로 12건 표시 후 상세 → 복귀 시 **12건 유지**
- 상세에서는 헤더가 처음부터 밝은 상태(흰 배경 위 흰 글자 방지)

### B. Support 1:1 문의 작성 폼 — 중앙 집중형
| | 1920 | 1280 | 1023↓ | 375 |
|---|---|---|---|---|
| 폼 폭 | **840px** (좌우 여백 각 280) | 780px | 100% | 335px |

제목 · 안내 문구 · 폼 · 첨부 안내 · CTA가 모두 **하나의 축(좌측 0)** 에 정렬됩니다.
흰 카드 박스나 그림자로 감싸지 않고 whitespace로만 구분했습니다.
Textarea 300px(모바일 180px), CTA는 데스크톱 우측 정렬 / 모바일 full width.

---

### C. `auth.html` — Authentication System 신규

메인·World & IP·NEWS·Support와 같은 토큰·헤더·푸터·모션을 씁니다.
Toss 레퍼런스에서는 **spacing / hierarchy / input polish / error clarity만** 참고했고
브랜드·컬러·컴포넌트는 SuperPlat 것을 그대로 썼습니다.

#### 레이아웃
| | Desktop | Tablet(768~1023) | Mobile |
|---|---|---|---|
| 로그인 · 찾기 · 재설정 | **460px 중앙** | 100% | 100% (좌우 20px) |
| 회원가입 | **640px 중앙** | 100% | 100% |
| Input 높이 | 56px | 56px | 54px |

#### 화면 (요청 01의 10개 화면 전부)
`로그인` → `비밀번호 찾기` → `이메일 인증` → `비밀번호 재설정` → `변경 완료`
`회원가입 STEP1 약관 동의` → `STEP2 정보 입력 + 이메일 인증` → `STEP3 가입 완료`
+ `로그인 완료`. 3단계 progress(1─2─3)를 compact하게 표시하고, 이전 단계로 돌아가도
입력값이 유지됩니다(상태를 `S` 객체 한 곳에 보관).

#### 컴포넌트 상태 (요청 11~20 전부)
Input `default / hover / focus / filled / error / success / disabled / autofill`,
Password `show / hide`(hit area 52×56, 토글해도 레이아웃 불변),
Checkbox `default / checked / disabled`, Radio,
Button `default / hover / pressed / disabled / loading(spinner, 크기 불변)`.
Focus는 glow·shadow 없이 **border 변화만** 씁니다.

#### 예외 처리 (요청 21~28 전부) — 실제 동작 확인
| 상황 | 결과 |
|---|---|
| 잘못된 로그인 | `이메일 또는 비밀번호를 확인해주세요.` (어느 쪽이 틀렸는지 노출 안 함) |
| 이미 가입된 이메일 | `이미 가입된 이메일입니다.` + **로그인하기** 링크 |
| 인증번호 불일치 | `인증번호가 일치하지 않습니다.` |
| 인증번호 만료 | `인증 시간이 만료되었습니다…` (3:00 카운트다운) |
| 비밀번호 조건 미충족 | 규칙 3개가 입력 중 실시간 체크로 갱신 |
| 비밀번호 확인 불일치 | `비밀번호가 일치하지 않습니다.` |
| 필수 약관 미동의 | 다음 버튼 disabled (선택 약관은 가입을 막지 않음) |
| 네트워크 / 서버 오류 | 상단 배너 + **입력값 유지** |

기타 확인된 동작: 휴대폰 `010-1234-5678` 자동 포맷, 생년월일 `1997.01.01` 포맷 +
유효하지 않은 날짜 검증, **인증 완료 후 이메일을 바꾸면 인증 상태 초기화**,
닉네임 중복 확인(입력 debounce 420ms · checking → ok/taken), 재전송 쿨다운 30초,
전체 동의 ↔ 개별 항목 양방향 동기화, 약관 상세(Desktop modal / Mobile full-screen sheet,
ESC·배경 클릭으로 닫힘, 닫아도 입력 상태 유지).

#### 접근성 · 보안 UX
`label ↔ input` 연결, `aria-invalid` / `role="alert"` 오류 안내, 터치 타깃 44px 이상,
`focus-visible` 아웃라인, `autocomplete`(username / current-password / new-password / tel / bday / one-time-code),
모바일 키보드 유도(`inputmode`), 비밀번호 평문 기본 노출 없음, 제출 중 중복 요청 차단.

#### ⚠️ 확인 부탁드리는 것
1. **정책 값은 확정하지 않았습니다.** `CONFIG` 한 곳에 모아 뒀습니다 —
   인증 유효시간(현재 180초) · 재전송 쿨다운(30초) · 인증번호 자리수(6) ·
   비밀번호 규칙(8자 이상 / 영문·숫자 / 특수문자) · 닉네임 길이(2~12).
   실제 정책이 정해지면 이 값만 바꾸면 UI가 따라갑니다.
2. **약관 전문은 자리표시**입니다. 법무 확정본으로 교체해주세요(`TERMS_BODY`).
   약관 항목도 시안의 4개(서비스 이용약관 / 개인정보 수집·이용 / 만 14세 이상 / 마케팅 수신)만 두었고
   임의로 늘리지 않았습니다.
3. **휴대폰은 연락처 수집**으로 구현했습니다. 본인인증이 필요하면 별도 flow를 추가해야 합니다.
4. 서버 연동 지점은 `api()` 함수 한 곳입니다(현재는 더미 응답).
   테스트 계정: `user@superplat.com` / `superplat1!`, 인증번호 `123456`,
   중복 이메일 `test@superplat.com`, 중복 닉네임 `슈퍼플랫`.
5. 회원가입을 시안처럼 **한 화면**으로 되돌리는 것도 가능합니다.
   지금은 요청하신 단계형 UX(약관 → 정보 → 완료)로 나눴고, 필드 순서·라벨은 시안 그대로입니다.
6. 네 페이지의 로그인 아이콘 · `로그인` 링크를 `auth.html`로 연결했습니다.

## 확인한 뷰포트

3840 / 2560 / 1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 360 / 320 — 전 구간 가로 스크롤 없음, 콘솔 에러 없음, reveal 미완료 요소 없음, `prefers-reduced-motion` 정상.
2200px 이상에서는 컨테이너를 1400/1440으로 고정하고 gutter만 넓혀 4K에서도 콘텐츠가 가운데에 모이게 했습니다.

hover QA(1920/1440/1280): 캐릭터 카드 그림자 없음·680ms 감속 확인 / 공간 카드 그림자 상하 여유 35~50px 확보·잘림 없음·radius 유지 / 커뮤니티 카드 4개 상태 radius·DIM 동일, 영상이 카드 밖으로 나오지 않음.

---

## v18 — NEWS 전체 좌측 정렬 통일

NEWS 페이지(공지사항 / 업데이트 / 이벤트)의 정렬 기준만 조정했습니다.
**레이아웃 · 카드 크기 · radius · hover · 반응형 구조는 그대로 두었습니다.**

### 무엇이 바뀌었나

| 대상 | 이전 | 이후 |
|---|---|---|
| 페이지 제목 `.ntitle` | PC 가운데 / 모바일 왼쪽 | **전 구간 왼쪽** |
| 리스트 헤더행 `.nrow--head > *` | 가운데 | 왼쪽 |
| 등록날짜 / 좋아요 / 조회수 | 가운데 | 왼쪽 |
| 제목 열 `.nrow__title` | 좌우 padding 12~20px | **왼쪽 padding 0** (자기 컬럼 edge에서 바로 시작) |
| 리스트 행 `.nrow__link` (button) | 브라우저 기본 `padding:1px 6px` + `text-align:center` | `padding:0` · `text-align:left` |
| 모바일 행 padding | `15px 10px 16px` | `15px 0 16px` |
| 이벤트 카드 `.ecard__link` / `__body` | 상속 center (button 기본값) | `text-align:left` 명시 |
| 검색 결과 없음 `.nempty` | 가운데 | 왼쪽 |

원인의 절반은 CSS가 아니라 **`<button>`의 브라우저 기본 스타일**이었습니다.
리스트 행과 이벤트 카드가 모두 `<button>`이라 `padding-left:6px`과 `text-align:center`가 몰래 들어가 있었고,
그래서 제목·탭은 컨테이너 좌측선에 맞는데 리스트만 6px 안쪽으로 밀려 있었습니다. 두 값을 모두 초기화했습니다.

### 정렬 축 실측 (요소 left 좌표, px)

| 뷰포트 | .wrap | 제목 | 탭 | 리스트 첫 열 | 이벤트 썸네일 |
|---|---|---|---|---|---|
| 1920 | 252.5 | 252.5 | 252.5 | **252.5** | **252.5** |
| 1440 | 57.6 | 57.6 | 57.6 | **57.6** | **57.6** |
| 1280 | 51.2 | 51.2 | 51.2 | **51.2** | **51.2** |
| 1024 | 41 | 41 | 41 | **41** | **41** |
| 768 | 30.7 | 30.7 | 30.7 | **30.7** | **30.7** |
| 375 | 20 | 20 | 20 | **20** | **20** |

세 탭(공지사항 / 업데이트 / 이벤트) 모두 동일한 축을 씁니다.
모바일 375px에서도 좌우 padding 20px 기준선을 그대로 유지하며, PC에서 왼쪽이던 것이 모바일에서 가운데로 바뀌는 구간은 없습니다.

### QA
- 3840 / 2560 / 1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 360 / 320 — 공지사항·이벤트 탭 모두 **가로 스크롤 0**, 콘솔 에러 0.
- 상세 진입/복귀 회귀: scrollY 1400 → 상세 → 목록 복귀 **1400** 유지.
- hover(카드 scale 1.03 / 이미지 1.015), radius(24 / 16), reveal 모션은 변경 없음.

### 확인 부탁드리는 것
1. **좋아요 / 조회수 열**도 왼쪽 정렬로 통일했습니다. "secondary metadata는 우측 정렬 가능"이라고 하셔서, 숫자 두 열만 오른쪽 정렬로 바꾸는 안도 가능합니다 — 어느 쪽이 좋으신가요.
2. **뉴스 상세 페이지(article)**는 시안이 가운데 정렬이라 이번 수정에서 건드리지 않았습니다. 상세도 왼쪽 정렬로 맞출까요.
3. **더보기 버튼**은 목록 하단 페이지네이션 컨트롤이라 가운데 그대로 뒀습니다.
4. 리스트 열 순서(등록날짜 → 제목 → 좋아요 → 조회수)는 "레이아웃 변경 금지"에 따라 유지했습니다. 요청하신 예시처럼 `[뱃지] 제목 … 날짜 →` 순서로 재배치하려면 그리드 구조를 바꿔야 해서, 원하시면 별도로 진행하겠습니다.

---

## v19 — Account Prototype: 회원가입 → 로그인 → 세션 → Header → 마이페이지

화면 3개가 따로 있던 상태에서, **사용자 상태가 실제로 이어지는 하나의 Account Prototype**으로 연결했습니다.

### 추가 / 수정한 파일

| 파일 | 상태 | 내용 |
|---|---|---|
| `assets/sp-auth.js` | **신규** | 공통 Account / Session 모듈. Store · Adapter · Header UI |
| `mypage.html` | **신규** | 마이페이지 (Route Guard · 프로필 · 비밀번호 변경 · 계정 · 약관) |
| `auth.html` | 수정 | 회원가입이 실제 계정 생성 / 로그인이 저장된 계정 조회 / 인증번호 난수화 / 데모 로그인 / `?next=` 복귀 |
| `index.html` `world.html` `news.html` `support.html` | 수정 | `<head>`에 `sp-auth.js` 한 줄 추가 (그 외 마크업 변경 없음) |

### Auth State 구조

```
 assets/sp-auth.js  ← 모든 페이지가 이 한 곳만 바라봅니다
 ├─ CONFIG      정책값 (비밀번호 규칙 · 인증 유효시간 · DEMO_UI 플래그)
 ├─ Store       localStorage  sp.proto.users / sp.proto.session / sp.proto.pendingCode
 ├─ Adapter     signup · login · logout · me · update · changePassword
 │              sendCode · verifyCode · checkEmail · checkNick
 │              resetPassword · deleteAccount     ← 여기만 fetch 로 바꾸면 실서버
 ├─ requireAuth / nextParam        라우트 가드
 ├─ mountHeader                    비로그인 아이콘 ↔ 로그인 Avatar + Dropdown
 └─ on(fn)                         상태 변경 구독 (Header · MyPage 동시 갱신)

 auth.html   api(action, payload) ──┐
 mypage.html SPAuth.xxx() ──────────┼──▶ Adapter
 5개 페이지 헤더  (자동 mount) ──────┘
```

- **auth.html 의 `api()`는 전부 SPAuth 로 위임**만 합니다. 실제 Backend 가 붙으면 `sp-auth.js` 의 `Adapter` 객체 안쪽만 `fetch` 로 교체하면 되고, 화면 코드는 한 줄도 바뀌지 않습니다.
- 상태 변경은 `SPAuth.on()` 이벤트로 퍼집니다 → 마이페이지에서 저장하면 **헤더 아바타·닉네임이 즉시** 바뀝니다.
- `storage` 이벤트도 듣기 때문에 **다른 탭에서 로그아웃하면 이 탭도 따라갑니다.**

### PROTOTYPE ONLY 표시

`sp-auth.js` 최상단에 무엇이 왜 실서비스용이 아닌지 명시했습니다.

- 비밀번호를 localStorage 에 **평문 저장** (실서비스: 서버에서 salt + bcrypt/argon2 해싱)
- 세션이 서명·만료·검증 없는 JSON (실서비스: HttpOnly · Secure · SameSite 쿠키)
- 라우트 가드가 클라이언트 JS — 콘솔로 우회 가능 (실서비스: 서버가 응답을 막아야 함)
- 인증번호를 화면에 노출

키 접두사를 `sp.proto.*` 로 통일해서 개발자 도구에서도 프로토타입 데이터임이 바로 보입니다.

### 이메일 인증 Prototype

"버튼만 눌렀는데 통과"가 되지 않도록, **실제 서비스와 같은 흐름을 유지**했습니다.

1. 인증 요청 → 서버(어댑터)가 **6자리 난수 발급** → `sp.proto.pendingCode` 에 발급 시각과 함께 저장
2. 프로토타입 전용 파란 점선 박스에 `테스트용 인증번호 984186` 표시 (`CONFIG.DEV_CODE_HINT`)
3. 사용자가 직접 입력 → 오답이면 "인증번호가 일치하지 않습니다."
4. 3분 만료 · 30초 재전송 쿨다운 · 이메일을 바꾸면 인증 상태 리셋

### Demo Account

| 항목 | 값 |
|---|---|
| 이메일 | `user@superplat.com` |
| 비밀번호 | `superplat1!` |

첫 방문 시 seed user 로 자동 생성됩니다. 로그인 화면 하단의 **`데모 계정으로 로그인`** 버튼 한 번이면 Header Avatar → Dropdown → 마이페이지까지 바로 확인됩니다.
실제 회원가입으로 만든 계정과 **완전히 같은 마이페이지 UI**를 씁니다 (분기 없음).
`SPAuth.CONFIG.DEMO_UI = false` 한 줄이면 안내 카드와 버튼이 사라집니다.

### 마이페이지

- 좌측 사이드바 **240px** + 콘텐츠 **최대 960px**, gap 40~72px. 1023px 이하에서는 사이드바 대신 셀렉트.
- **프로필** — 프로필 사진(업로드 · 기본 이미지로 · 2MB 제한) / 계정 ID(이메일, 읽기 전용) / 이름 / 닉네임(중복 확인) / 휴대폰 / 생년월일 / 성별 → `변경 내용 저장하기`
- **비밀번호** — 현재 · 새 · 확인 3필드, 눈 아이콘 토글, 8~20자 · 영문 · 숫자 · 특수문자 실시간 체크. **현재 비밀번호는 어디에도 표시하지 않습니다.**
- **계정** — 로그인 정보 / 회원 탈퇴(위험 구역). 소셜 로그인은 실제로 지원하지 않으므로 UI 를 만들지 않았습니다.
- **개인 및 약관 내역** — 가입 시 동의 내역 + 마케팅 수신 토글(즉시 저장)
- **캐시 내역 / 수익 관리 / 콘텐츠 관리** — `PROTOTYPE` 배지 + 빈 상태만. **가상의 금액 · 정산 · 수수료율을 만들지 않았습니다.**
- 저장하지 않고 다른 메뉴로 이동하면 확인 다이얼로그, 페이지를 떠나면 `beforeunload` 경고.

### 20단계 클릭 테스트 결과 (Chromium 자동화, 1440×1000)

```
 ① 헤더 로그인 아이콘: true / 아바타: false
 ② 회원가입 링크로 이동 → true
 ③ 약관 전체동의 · 다음 활성: true
 ④ 이름/폰/생일: 김하혜 010-9876-5432 1997.01.01
 ⑤ 발급된 인증번호(프로토타입 표시): 883407
    오답 처리: 인증번호가 일치하지 않습니다.
    정답 처리: 이메일 인증이 완료되었습니다.
 ⑥ 닉네임 검사: 사용할 수 있는 닉네임입니다. / 가입 버튼 활성: true
 ⑦ 완료 화면: 슈퍼플랫에 오신 것을 환영해요! / CTA: ['로그인하기']
    저장된 계정 수: 2
    로그인 세션(가입만으로는 없어야 함): null
 ⑧ 로그인 화면 · 이메일 프리필: hahye9797@example.com
 ⑨ 오류 메시지: 이메일 또는 비밀번호를 확인해주세요.
    로그인 성공 화면: 로그인되었습니다.
 ⑩ 홈: true / 아바타: true / 로그인아이콘 숨김: true
 ⑪ 드롭다운: 하방 · hahye9797@example.com · 항목: ['마이페이지','로그아웃']
 ⑫ 마이페이지: true / 가입정보: 김하혜 하방 010-9876-5432 1997.01.01 hahye9797@example.com
 ⑬ 프로필 사진 미리보기 반영: true / 저장 전 헤더는 그대로: true
 ⑭ 저장 결과: 변경 내용을 저장했어요.
    헤더 아바타 반영: true · 헤더 닉네임 반영: 하방이
    저장소 반영: ['하방이','010-5555-6666','data:image/png;']
 ⑮ 현재 비번 오류: 현재 비밀번호가 일치하지 않습니다.
    변경 성공: 비밀번호를 변경했어요. 다음 로그인부터 적용됩니다.
 ⑯ 새로고침 후 유지: true / 닉네임: 하방이
 ⑰ 로그아웃 → auth.html / 세션: null
    홈 헤더 복귀 — 로그인아이콘 노출: true / 아바타 제거: true
 ⑱ 비로그인 /mypage 접근 → auth.html?next=mypage.html
 ⑲ 기존 비밀번호 로그인: 이메일 또는 비밀번호를 확인해주세요.  ← 실패 확인
 ⑳ 새 비밀번호 로그인 → mypage.html 자동 복귀: true
 ERRORS: []
```

### 반응형 QA (6개 페이지 × 12개 뷰포트)

3840 / 2560 / 1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 360 / 320 —
`index` `world` `news` `support` `auth` `mypage` 전부 **가로 스크롤 0, 콘솔 에러 0**.

- 헤더 드롭다운 우측 정렬 실측: 아바타 right 1555 / 메뉴 right 1554 (1920), 1271 / 1270 (1440) — 1px 이내.
- 모바일(767↓)에서는 축소된 드롭다운 대신 **바텀시트**. 화면 하단에 붙는지 실측 확인(bottom = viewport height).
  헤더의 `backdrop-filter` 가 내부 `position:fixed` 를 가두는 문제가 있어, 메뉴만 `body` 직속으로 옮기고 데스크톱에서는 좌표를 계산해 붙입니다.
- `prefers-reduced-motion` 정상 (transition 1µs).

### 확인 부탁드리는 것

1. **이름(name)을 수정 가능하게** 두었습니다. 요청 목록에는 닉네임·휴대폰·생년월일·성별·프로필 이미지만 있었는데, 오타 수정이 자연스러워 포함했습니다. 읽기 전용으로 바꿀까요.
2. **회원 탈퇴**는 브라우저 confirm 을 씁니다. 보관 기간 · 재가입 제한 정책이 확정되면 전용 모달로 교체하겠습니다.
3. **캐시 / 수익 / 콘텐츠** 3개 메뉴는 빈 껍데기입니다. 실제 기능 범위가 정해지면 알려주세요.
4. **마케팅 수신 동의**는 토글 즉시 저장입니다. `변경 내용 저장하기` 안으로 넣는 편이 나을까요.
5. `DEMO_UI` / `DEV_CODE_HINT` 는 기본 `true` 입니다. 외부 공유용 빌드에서는 `sp-auth.js` 상단에서 `false` 로 바꿔주세요.

---

## v20 — NEWS 대칭 내비 / 버튼 시스템 / 약관 열람 / Account Billing & Settlement Center

### 01. NEWS 이전글 · 다음글 — 완전 대칭

썸네일 카드형이던 구조를 **1400px 컨테이너 기준 좌우 대칭 내비**로 정리했습니다.
`grid-template-columns:1fr 1fr` + `align-items:stretch`, 가운데 1px divider,
왼쪽 `text-align:left` / 오른쪽 `text-align:right`, padding 20~40px, **그림자·확대 없음**.

실측 (요소 left / width / height / padding)

| 뷰포트 | 컨테이너 | 이전글 | 다음글 | 동일? |
|---|---|---|---|---|
| 1920 | 1400 | l 253 · w **700** · h **172** · p 40 | l 953 · w **700** · h **172** · p 40 | ✔ |
| 1440 | 1310 | w **655** · h **152** · p 31.7 | w **655** · h **152** · p 31.7 | ✔ |
| 1280 | 1163 | w **581** · h **143** | w **581** · h **143** | ✔ |
| 768 | 692 | w **346** · h **123** | w **346** · h **123** | ✔ |
| 375 | 320 | w **320** · h **120** | w **320** · h **120** | ✔ |

- Hover: `background rgba(0,0,0,.02)` · 이전 화살표 `translateX(-3px)` / 다음 `translateX(3px)` · 300ms — 실측 확인.
- 영역 전체가 버튼이라 어디를 눌러도 이동합니다. 대상이 없으면 **같은 높이의 비활성 칸**을 그려 대칭이 깨지지 않습니다.
- 모바일은 세로 2행 + `grid-auto-rows:1fr` 로 제목 줄 수가 달라도 높이가 정확히 같습니다. radius 16px, padding 20px.

### 02. 버튼 시스템 통일

```
--btn-h-lg:56px  --btn-h-md:48px  --btn-h-sm:40px
--btn-r:12px     --btn-minw:160px --btn-gap:12px
```

같은 action group(`.form__actions` · `.mpacts`) 안의 버튼은 height · min-width · radius · font-size · padding 을 강제로 동일하게 맞춥니다.

| 뷰포트 | 취소 | 문의 등록 | 동일? |
|---|---|---|---|
| 1920 | 160×56 · r12 | 160×56 · r12 | ✔ |
| 1440 / 768 | 160×56 · r12 | 160×56 · r12 | ✔ |
| 375 | 155×52 · r12 | 155×52 · r12 | ✔ (1fr 1fr, gap 10) |

이전에는 취소가 `.sbtn--ghost`(h 48~54 · r 10~12), 등록이 `.sbtn--lg`(h 52~60 · **r 999**)라 크기·모서리가 달랐습니다.

### 03. 마이페이지 — 개인 및 약관 내역

6개 항목(서비스 이용약관 / 개인정보 수집·이용 / 만 14세 이상 확인 / 개인정보 처리방침 / 마케팅 수신 동의 / 기타 서비스 정책)을
**이름 · 동의 상태 · 동의일 · 버전 · 시행일 · [자세히 보기]** 로 나열합니다.
"자세히 보기"는 모달이 아니라 **전체 페이지**로 열립니다(긴 텍스트 가독성). 회원가입 약관 시트와 같은 `h5 / p / .eff` reading system 을 그대로 씁니다.

### 04. 캐시 내역 → Account Billing & Settlement Center

상단 5개 탭. **환불과 정산을 구조적으로 분리**했습니다.

```
캐시 내역
 ├─ 보유 재화     전체 보유 / 정산 가능 구분 → [정산 요청]
 ├─ 이용 내역     필터 5종 → 거래 상세 → 환불 요청
 ├─ 정산 관리     현황 요약 / 정산 계좌 / 정산 내역 → 상세 → 요청 취소
 ├─ 구독 관리     현재 이용권 / 변경 / 해지 / 결제 내역 → 상세
 └─ 결제 수단     등록 / 기본 설정 / 삭제
```

**정책을 만들지 않은 부분** — `SPAuth.CONFIG.payout` 의 `rate · feeRate · taxRate · minQty · cycle · payDay` 는 전부 `null` 이고,
화면에서는 환산 금액 · 수수료 · 세금 · 예상 지급 금액이 모두 **"정책 확정 후 안내"** 로 표시됩니다. 숫자를 계산하지 않습니다.
정산 가능 재화는 `payableAssets:['bean','wing']` 플래그로만 관리하고, 슈퍼스타는 "정산 가능 재화 여부가 확정되지 않아 정산을 신청할 수 없어요."로 비활성화됩니다.

**구독 플랜은 첨부해주신 플랜 정의서 그대로**입니다 — 무료버전 / 베이직 9,900 / 어드밴스 49,000 / 어드밴스+ 69,000 / 프로 99,000 / 프리미엄 189,000원,
19행 전체 비교표 포함. 시트에서 비어 있던 칸(프로의 어드민 아이디)은 `—` 로 두고 채우지 않았습니다.
"꾸미기 프랍 갯수 및 스페이스 레벨은 변경 여지 있음" 주석도 화면에 남겼습니다.

**민감정보** — 카드는 `{brand, last4}`, 정산 계좌는 `{bank, holder, last4}` 만 저장합니다. 실측 확인:

```
[{"id":"c1","brand":"신한카드","last4":"1234","isDefault":true},
 {"id":"cmto85cnt2g3","brand":"현대카드","last4":"9876","isDefault":false}]
```

전체 카드번호 · 유효기간 · 계좌번호는 어디에도 저장하지 않으며, 화면에도 "실제 서비스에서는 PG 토큰화가 필요합니다" 안내를 붙였습니다.

### 05. 클릭 테스트 결과

**정산**
```
① 정산 요청 화면 · CTA disabled(계좌 미등록)  true
② → 정산 계좌 등록 → ③ 복귀 · 계좌 신한은행 김하혜 **** 6789
④ [전액] → 10,000 / 요약 = 환산·수수료·세금·예상지급 전부 "정책 확정 후 안내"
⑤ 확인 다이얼로그 "정산을 요청하시겠어요?"
⑥ 완료 "정산 요청이 완료되었습니다."
⑦ 정산 내역 1건 생성 · 상태 검토 중 / 보유 재화 12,500 → 2,500 차감
⑧ 정산 상세 · 검토 중
⑨ 요청 취소 → 재화 12,500 복구
```

**환불 · 구독 · 카드**
```
① 거래 상세 (결제 금액 = 정책 확정 후 안내)
② 환불 요청 · 사유 미선택 시 CTA disabled
③ 완료 → ④ 목록 상태 "환불 요청" 반영
⑤ 플랜 6개 · 현재 베이직 · CTA "현재 이용중"(disabled) · 비교표 19행
⑥ 업그레이드 확인(변경 전/후·다음 결제일·결제수단) → ⑦ 즉시 적용 → ⑧ 프로 ₩99,000
⑨ 다운그레이드 → "다음 결제일에 변경할까요?" → ⑩ 예약 배지 표시
⑪ 구독 해지 → ⑫ "해지 예약됨 · 2026.09.17까지 이용할 수 있어요"
⑬ 카드 4111 1111 1111 9876 / 12/29 입력 → ⑭ 목록 2장, 저장은 last4 만
ERRORS: []
```

### 06. 반응형 QA

**6개 페이지 × 12개 뷰포트 + 캐시 5개 하위 탭 + NEWS 상세 = 가로 스크롤 0, 콘솔 에러 0**
(3840 / 2560 / 1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 360 / 320)

- 모바일 표는 축소하지 않고 stacked list 로 전환합니다. `.mprow--head` 숨김, 금액/잔액 세로 정렬, 날짜·재화·상태는 meta 한 줄로 병합.
- **44px 미만 터치 타깃: 없음** (`.mpbtn-s` 48 / `.mpchip` 44 / 헤더 아바타 44 로 상향)
- `prefers-reduced-motion` — 탭 · 패널 · prev/next 전환 모두 1µs.
- 모션: 탭 300ms / 카드 400ms / 모달 220ms / 폼 200ms. 확대·그림자 없음.

### 확인 부탁드리는 것

1. **정산 가능 재화** — 스펙 예시를 따라 슈퍼빈 · 슈퍼윙만 정산 가능으로 두고 슈퍼스타는 비활성화했습니다. 실제 정책이 정해지면 `CONFIG.payout.payableAssets` 한 줄만 바꾸면 됩니다.
2. **정산 상태값** — 검토 중 / 정산 예정 / 정산 완료 / 정산 반려 / 정산 취소 5단계로 두고, 취소는 "검토 중"에서만 가능하게 했습니다. 실제 운영 프로세스가 있으면 알려주세요.
3. **플랜 명칭** — 요청서에는 Basic / Starter / Advance / Premium 이었는데, 첨부 시트의 실제 명칭(무료버전 / 베이직 / 어드밴스 / 어드밴스+ / 프로 / 프리미엄)을 우선했습니다.
4. **재화 아이콘** — 실제 아이콘 파일이 없어 이름 첫 글자 마크로 대체했습니다. 임의의 코인 이미지는 만들지 않았습니다. 원본을 주시면 교체하겠습니다.
5. **영수증** — 결제 상세에 자리만 두고 버튼은 넣지 않았습니다. 결제 대행사 연동 후 추가하면 됩니다.
6. **수익 관리 / 콘텐츠 관리** 두 메뉴는 여전히 빈 껍데기입니다. 정산 관리와 역할이 겹치는지도 확인이 필요해 보입니다.

---

## v21 — 캐시 / 정산 / 구독 Alignment System + 회원 탈퇴 UX

### 01. 공통 Form · Grid · Spacing System

개별 화면을 하나씩 고치지 않고 토큰과 클래스를 먼저 정의한 뒤 모든 화면에 같은 것을 적용했습니다.

```
콘텐츠 폭   .mpbody   max 960px    (목록 · 표 · 카드)
폼 폭       .mpform   max 680px    (입력 화면)   ← 4K 에서도 늘어나지 않음
              .mpform--wide 800px  (탈퇴 상태 확인)
필드 높이   --fld-h 56px           (input · select 동일, 모바일 54)
라벨→필드   8px    필드→헬퍼 7px
필드→필드   --mp-gap-field  26px (모바일 24)
그룹→그룹   --mp-gap-group  44px (모바일 36)
섹션→섹션   56~88px              (모바일 48~64)
버튼        L56 / M48 / S40 · radius 12 · min-width 160
```

**틀어져 있던 원인 세 가지**

| 문제 | 원인 | 수정 |
|---|---|---|
| Select 가 Input 보다 4px 낮음 | 사이드바용 `.mpsel`(52px)을 폼에 재사용 | `.selct` 신설 — `.inp` 과 height · padding · radius · border 동일 |
| 「전액」 버튼이 입력창과 어긋남 | 별도 grid 로 얹어서 라벨 높이만큼 밀림 | `Field({side:…})` 로 교체 — 컴포넌트가 이미 같은 높이를 보장 |
| 폼이 960px 까지 늘어남 | 폼 전용 컨테이너 없음 | `.mpform` 680px |

**단위 표기** — 「10,000 슈퍼빈」은 입력창 밖에 붙이지 않고 input 안쪽 오른쪽에 trailing element 로 넣었습니다. 옆에 「전액」 버튼이 붙어도 겹치지 않도록 input 을 감싼 래퍼 기준으로 배치합니다.

### 02. 픽셀 정렬 QA 실측 (정산 요청 화면, 1440)

```
정산할 재화     L 361  R 1041  W 680  H 56
정산 요청 수량   L 361  R 1041  W 680  H 56   (input 615 + gap 8 + 전액 57)
라벨 left       361 / 361        헬퍼 left  361 / 361
.mpform         L 361  R 1041    예상 정산 정보  L 361  R 1041
정산 계좌 박스   L 361  R 1041    CTA 영역        L 361  R 1041
[취소] 160×56 r12 · [정산 요청] 160×56 r12   (right edge 1041)
예상 정산 정보 5줄 value right edge  →  1041 · 1041 · 1041 · 1041 · 1041
```

**체크리스트 결과 (1920 / 1440 / 1280 / 1024 / 768 / 375 / 320 — 전 구간 PASS)**

☑ Input left · right edge 동일 ☑ Select width · height 동일 ☑ Label / Helper / Error left edge 동일
☑ Button height · width · radius · font 동일 ☑ Card Grid width 동일 ☑ Summary Card height 동일
☑ Key / Value right edge 정렬 ☑ Tab · Section Title · Form Container 시작점 동일 (`tabsL == bodyL == cardHL`)
☑ Desktop 폼 680px 고정 ☑ 375 좌 20px / 우 355px 기준선 이탈 0 ☑ 320 필드 잘림 없음 ☑ 4K 확산 없음

### 03. 정돈한 것들

- **카드 내부 패딩** 데스크톱 32 / 1440 30 / 모바일 20 으로 통일. radius 24 (모바일 16).
- **보유 재화 카드** `grid-auto-rows:1fr` — 슈퍼스타처럼 버튼 대신 안내 문구가 들어가도 높이가 같습니다.
- **Summary 3장** 균등 3분할 + 동일 높이 + 숫자 baseline 일치.
- **Divider 축소** `.mpcard` 사이 구분선을 없애고 56~88px 여백으로 나눴습니다.
- **Form Card 남용 제거** 입력마다 카드를 두지 않고 정산 요청 / 환불 / 카드 등록을 각각 하나의 폼 영역으로 묶었습니다.
- **모바일 1열 전환** 데스크톱 2열 폼을 억지로 유지하지 않습니다. 재화 · Summary 도 좁아지면 1열.
- **타이포** 페이지 제목 28→40, 섹션 제목 20→27, 금액 24→34.

### 04. 회원 탈퇴 UX

화면은 3개, 논리 단계는 6개입니다.

```
계정 탭 최하단 Danger Zone
  └ [회원 탈퇴]
      ① 탈퇴 전 확인      계정 요약 + 사전 점검 8항목
      ② 주의사항 · 동의    5개 안내 + 정책 전문 + 필수 동의 3개
      ③ 본인 확인          현재 비밀번호 (eye toggle)
      ④ 최종 확인          Danger 모달
      ⑤ 완료               세션 제거 → 헤더 비로그인 복귀
```

**사전 점검 8항목** — 보유 재화 / 정산 가능 재화 / 진행 중인 정산 / 진행 중인 환불 / 이용 중인 구독권 / 등록된 결제 수단 / 내가 만든 콘텐츠 / 처리 중인 결제. 각각 `✓ 확인 완료 · ! 확인 필요 · • 해당 없음` 상태와 이동 버튼([정산 관리] [구독 관리] [결제 수단] …)을 제공합니다.

**차단 조건은 정책이 아니라 플래그입니다.**

```js
CONFIG.withdraw = {
  blockOnPayableAssets: true,   // 정산 가능 잔액이 남아 있으면 차단
  blockOnPendingPayout: true,
  blockOnPendingRefund: true,
  gracePeriodDays: null,        // 탈퇴 철회 유예 기간 — 정책 미확정
  keepDemoAccount: true
}
```

유예 기간은 `null` 이라 화면에서 7일/14일/30일 같은 기간을 말하지 않습니다. 재화 소멸 여부도 "무조건 소멸"이라 쓰지 않고 "슈퍼플랫 정책에 따릅니다"로 두었습니다. 구독은 "계정 탈퇴와 구독 해지는 결제 방식에 따라 별도로 처리될 수 있습니다"까지만 안내하고, 외부 스토어 구독이 자동 취소된다고 가정하지 않았습니다.

**색은 제한적으로** — 페이지 전체를 붉게 하지 않고 최종 CTA(솔리드 danger)와 차단 안내 문구에만 error color 를 씁니다. 동의는 "모두 동의" 하나로 뭉치지 않고 3개 항목을 각각 읽고 체크하게 했습니다.

**프로토타입 데이터 처리** — 탈퇴한 계정은 레코드를 남기고 `withdrawn:true` 로 표시해, 재로그인 시 "탈퇴한 계정입니다. 다시 이용하시려면 새로 가입해주세요."가 뜹니다. **데모 계정은 QA 에 계속 필요해서 삭제하지 않고** 세션과 데모 데이터만 초기화합니다.

### 05. 탈퇴 클릭 테스트

```
CASE C  정산 가능 재화 10,000 슈퍼빈 / 2,800 슈퍼윙
        → [계속하기] disabled + "탈퇴 전에 확인이 필요한 항목이 있습니다."
        → 항목에 "탈퇴 전 처리 필요" 표시 + [정산 관리] 버튼
CASE A  잔액 0 · 구독 없음 · 정산/환불 없음
        → 8항목 모두 확인 완료 / 해당 없음 → [계속하기] 활성
② 주의사항 5개 · 동의 전 [계속하기] disabled
   정책 전문 6개 조문 전체 페이지로 열람 → [확인]
   동의 3개 체크 → 활성
③ 본인 확인 · eye toggle 있음
④ 틀린 비밀번호 → "비밀번호가 일치하지 않습니다." · 입력값 유지됨
⑤ 최종 확인 "회원 탈퇴를 진행할까요?" · CTA class = abtn abtn--danger
⑥ "계정 탈퇴가 완료되었습니다." · 세션 null
⑦ [홈으로 이동] → 헤더 [로그인하기] 복귀 · 아바타 제거 · 데모 계정 보존
   실제 가입 계정으로 탈퇴 후 재로그인 → "탈퇴한 계정입니다."
ERRORS: []
```

375px: 가로 스크롤 0, 좌 20 / 우 355 기준선 이탈 0, 44px 미만 터치 타깃 0.

### 확인 부탁드리는 것

1. **페이지 제목 축**은 사이드바와 같은 컨테이너 좌측선(1440에서 57.6px)에 두고, 콘텐츠 열 안쪽(361px)에서 탭 · 섹션 제목 · 폼 · CTA 가 모두 같은 축을 씁니다. 제목까지 콘텐츠 열로 옮기면 사이드바 위가 비어 보여서 이렇게 뒀는데, 옮기는 안도 가능합니다.
2. **탈퇴 차단 조건 3개**(정산 가능 잔액 · 정산 진행 중 · 환불 진행 중)는 제가 정한 게 아니라 테스트를 위해 켜 둔 플래그입니다. 실제 정책을 알려주시면 값만 바꾸겠습니다.
3. **콘텐츠 개수**(마이스페이스 3 · 게시 8)는 화면 확인용 예시입니다. 콘텐츠 관리 기능이 붙으면 실제 값으로 연결됩니다.
4. **탈퇴 철회 유예 기간**은 `null` 로 두어 화면에서 언급하지 않습니다. 운영하신다면 며칠인지 알려주세요.

---

## v22 — 프로필 저장 CTA 단일화 · Button Size System · 회원 탈퇴 Flow 재구성

### 01. 프로필 — 저장 버튼 1개

카드마다 반복되던 저장 CTA를 없애고, **프로필 페이지 전체에서 「변경 내용 저장하기」는 정확히 1개**입니다.
페이지 최하단에 divider를 두고 그 아래 우측 정렬로 배치했습니다.

```
프로필 사진 → 기본 정보 → 비밀번호(별도 인증 Flow)
──────────────────────────────────────────────
프로필 사진 · 이름 · 닉네임 · 휴대폰 ·        [ 변경 내용 저장하기 ]
생년월일 · 성별 변경 내용을 저장합니다.
```

실측 (저장 버튼 right edge = Form Grid right edge = Content right edge)

| 뷰포트 | 버튼 W×H | right | grid right | Full width? | 진입 시 |
|---|---|---|---|---|---|
| 1920 | 183×52 | 1525 | 1525 | 아니오 | disabled |
| 1440 | 169×52 | 1321 | 1321 | 아니오 | disabled |
| 1024 | 169×52 | 968 | 968 | 아니오 | disabled |
| 768 | 169×52 | 722 | 722 | 아니오 | disabled |
| 390 / 375 | 169×52 | 355 / 340 | 동일 | **아니오** | disabled |
| 320 | 265×52 | 285 | 285 | 예 (fallback) | disabled |

- 상태 전환: `disabled → (변경 시) enabled → 저장 중 → 저장 완료 토스트 → 다시 disabled`
- **저장 중에 버튼 폭이 흔들리지 않습니다** — 로딩 진입 시 현재 폭을 `min-width`로 고정합니다 (169 → 169, 이전에는 169 → 160으로 줄었습니다).
- 저장 결과는 버튼에 붙잡아 두지 않고 **토스트** "✓ 변경 내용이 저장되었습니다."로 알리고 2.4초 뒤 사라집니다.
- **비밀번호 변경은 분리**했습니다(별도 인증 Flow). Primary는 저장 CTA 하나뿐이라 비밀번호 변경은 Secondary(ghost)입니다 — 실측 `primaryCount: 1`.

### 02. Button Size System

```
Large  (Primary)  52px · padding 30 · min-width 160
Medium (General)  48px · padding 22 · min-width 140
Small  (Inline)   40px · padding 18            (모바일 48)
radius 12 · font 15~17 / 600
```

8개 탭 × 7개 뷰포트에서 실제로 쓰인 버튼 높이를 세어 보면 **40 / 48 / 52 세 가지뿐**입니다.

```
1920·1440·1024·768   {40: 3, 48: 12, 52: 4}
390·375·320          {48: 15, 52: 4}     ← Small이 모바일에서 48로 승격
그룹 크기 불일치: 0건
```

같은 action group의 두 버튼은 width·height·radius·font·top이 모두 동일합니다 (예: `[취소] 160×52` / `[카드 등록] 160×52`).
support.html의 `[취소][문의 등록]`도 52px로 통일했습니다.
모바일에서 무조건 full width로 만들지 않고, **320px에서만** fallback으로 폭을 조정합니다.

### 03. 회원 탈퇴 Flow 재구성

첨부해주신 5장의 레퍼런스를 분석해서 순서와 정보 구조를 다시 짰습니다. (브랜드 컬러·폰트·로고·서비스명은 가져오지 않았습니다)

```
계정 최하단 Danger Zone → [회원 탈퇴]
 ① 본인 확인      이메일(읽기 전용) + 현재 비밀번호(eye toggle) → [취소][확인]
 ② 회원 탈퇴 안내  회색 본문 박스 6개 섹션 + ※ 주석 + 최하단 필수 동의 2개 → [이전][다음]
 ③ 잔여 재화 확인  보유 재화 3종 카드 + 확인 필요 항목 + 탈퇴 사유(선택)
                  → [탈퇴 취소][회원 탈퇴]
 ④ 최종 확인 모달  Danger CTA
 ⑤ 탈퇴 완료      세션 제거 → 헤더 [로그인하기] 복귀
```

**레퍼런스에서 가져온 패턴** — 안내 본문을 작은 스크롤 박스에 압축하지 않고 회색 박스 안에 `제목 + 본문` 섹션으로 나눈 구성, 박스 아래 `※` 주석 줄, **동의 체크박스를 약관 최하단에 배치**, 잔여 캐시를 별도 화면으로 분리, 탈퇴 사유 선택. 순서는 지시하신 ①~⑤ 그대로입니다.

**계정 상태는 마지막에만 바뀝니다** — ①은 `SPAuth.verifyPassword()`만 호출하고 계정 데이터를 건드리지 않습니다. 실측: 비밀번호 오답 후에도 세션 유지, ④에서 [취소]해도 세션 유지, [탈퇴 취소]로 나가도 세션 유지.

**확정되지 않은 정책은 만들지 않았습니다** — 삭제 기간 · 환불 가능 기간 · 캐시 소멸 규칙 · 재가입 제한 기간 · 정산 기간을 숫자로 쓰지 않고 "슈퍼플랫 운영 정책에 따릅니다"로 두었습니다. `※ 확정되지 않은 정책(재화 소멸 기준 · 환불 기간 · 재가입 제한 기간 등)은 확정 후 안내드립니다.` 주석도 화면에 남겼습니다.

### 04. 탈퇴 Flow 클릭 테스트

```
① 본인 확인 · 이메일 user@superplat.com (readOnly) · [확인] 초기 disabled
   오답 → "비밀번호가 일치하지 않습니다." (Input 하단) · 세션 유지 true
② 안내 6섹션 [계정 이용 제한 / 보유 재화 / 결제·환불·정산 / 구독 중인 이용권 /
   내가 만든 콘텐츠 / 개인정보 처리] · 동의 전 [다음] disabled → 동의 후 enabled
③ 보유 재화 슈퍼빈 12,500 · 슈퍼윙 3,200 · 슈퍼스타 12,500
   확인 필요 항목 [정산 가능 재화 / 이용 중인 구독권] + [정산 관리] [구독 관리]
   탈퇴 사유 6개 · 「기타」 선택 시 직접 입력 노출
   정산 가능 잔액 있을 때 [회원 탈퇴] disabled → 잔액 0이면 enabled
④ [탈퇴 취소] → 계정 화면 복귀 · 세션 유지 true
⑤ 최종 확인 "회원 탈퇴를 진행할까요?" · CTA class = abtn abtn--danger
   모달 [취소] → 계정 그대로 true
⑥ "회원 탈퇴가 완료되었습니다." · 세션 null
⑦ [홈으로 이동] → 헤더 [로그인하기] 복귀 · 아바타 제거
ERRS: []
```

### 05. 반응형 실측

| 뷰포트 | 폼 폭 | Input L/R/H 동일 | 안내 폭 | 동의 hit area | [탈퇴 취소]/[회원 탈퇴] | overflow |
|---|---|---|---|---|---|---|
| 1920 | 680 | ✔ 565/1245/56 | 760 | 52 | 160×52 · top 동일 | 0 |
| 1440 | 680 | ✔ 361/1041/56 | 760 | 52 | 160×52 | 0 |
| 1024 | 642 | ✔ | 642 | 52 | 160×52 | 0 |
| 768 | 680 | ✔ | 692 | 52 | 160×52 | 0 |
| 390 | 335 | ✔ 20/355/54 | 335 | 63 | 140×52 | 0 |
| 375 | 320 | ✔ 20/340/54 | 320 | 63 | 140×52 | 0 |
| 320 | 265 | ✔ 20/285/54 | 265 | 63 | 129×52 | 0 |

375 · 320에서 좌 20px / 우 기준선 이탈 **0건**, 본문 글자 14px 유지, 모바일에서도 두 버튼을 균형 있게 나란히 둡니다(full width 아님).

### 확인 부탁드리는 것

1. **탈퇴 사유**는 레퍼런스에 있어서 추가했지만 **선택 항목**으로 두었습니다. 필수로 바꿀지, 항목 문구를 조정할지 알려주세요.
2. **정산 가능 잔액이 있을 때 탈퇴를 막는 것**은 여전히 `CONFIG.withdraw` 플래그입니다. 실제 정책이 "안내만 하고 진행 가능"이라면 플래그만 끄면 됩니다.
3. **비밀번호 변경 버튼 크기**는 저장 CTA와 같은 Large(52)로 두고 ghost로 위계를 구분했습니다. Medium(48)으로 한 단계 낮출 수도 있습니다 — `.abtn--md` 클래스가 이미 준비돼 있습니다.

---

## v23 — 공간 섹션 사진 배경 · 캐릭터 섹션 리듬 · 공통 Dropdown / Search · 다운로드 배너 규격

### 01. 다운로드 배너 — 토스 / 카카오 규격으로 낮춤

`support.html` 다운로드 탭의 배너 카드입니다. 세로가 두꺼워 둔해 보이던 비율을 낮췄습니다.

```
이전   1400 × 407   =  3.44 : 1
이후   1400 × 300   =  4.67 : 1      (토스·카카오 앱 다운로드 배너 대역)
```

실측 (카드 W×H · PC / Mobile 두 배너 동일)

| 뷰포트 | 이전 H | 이후 H | 비율 | 텍스트 블록 H | 여유 |
|---|---|---|---|---|---|
| 3840 / 2560 / 1920 | 407 | **300** | 4.67 : 1 | 247~262 | ✔ |
| 1440 | 381 | **281** | 4.67 : 1 | 198 | ✔ |
| 1280 | 338 | **249** | 4.67 : 1 | 186 | ✔ |
| 1024 | 270 | **211** | 4.40 : 1 | 169 | ✔ |
| 768 | 201 | **172** | 4.02 : 1 | 165 | ✔ |
| 430 | 434 | **381** | 세로형 | 148 | ✔ |
| 375 | 413 | **367** | 세로형 | 165 | ✔ |
| 320 | 374 | **335** | 세로형 | 164 | ✔ |

- 태블릿 구간은 폭이 좁아 그대로 두면 카드가 너무 얇아져서, 비율을 `1400/318`(≤1279) → `1400/348`(≤1023)로 한 단계씩만 완만하게 되돌렸습니다.
- `aspect-ratio`는 **목표 높이**일 뿐이라 내부 텍스트가 더 크면 카드가 알아서 늘어납니다. 어떤 폭에서도 글자가 잘리지 않습니다.
- 모바일은 세로로 쌓이는 구조를 유지하고 **이미지 비율만 16/11 → 640/375**로 낮췄습니다(@375 카드 413 → 367).

**이미지는 손대지 않았습니다.** 다만 원본(`dl-pc.jpg` / `dl-mobile.jpg`, 640×407)은 위쪽 32px이 흰색 테두리라, 배너가 낮아지면 그 띠가 카드 안에 노출됩니다. 파일을 자르는 대신 CSS로만 처리했습니다.

```css
/* 카드 높이의 407/375 배로 잡고 bottom 기준으로 붙이면
   위쪽 흰 띠 32px만 카드 밖으로 나가 잘리고,
   캐릭터가 있는 375px 영역은 원본 비율 그대로 전부 보입니다. */
.dl__art{ position:absolute; left:0; bottom:0;
          width:auto; height:calc(100% * 407 / 375);
          object-fit:cover; object-position:center bottom; }
```

`width:auto`라 가로세로가 늘어나거나 눌리는 일이 없고, 원본 배경색이 카드 배경색과 정확히 같아서(`#B3BED4` / `#B3C5D4`) 이미지 오른쪽 경계도 보이지 않습니다. 이미지를 흐름에서 빼 두었기 때문에 원본 비율이 배너 높이를 다시 밀어올리지도 않습니다.

> 참고 — 메인 하단 CTA(`문은 열려있습니다 / 다운로드 바로가기`)는 이전에 주신 **104 → 제목 → 28 → 버튼 → 48 → 캐릭터 → 80** 리듬을 그대로 지키고 있어 이번에는 건드리지 않았습니다. 이쪽도 낮추길 원하시면 알려주세요.

### 02. 공간 섹션 — Full photographic background

Carousel의 **활성 이미지가 곧 섹션 배경**입니다. Layout·모션은 그대로 두고 배경 레이어만 새로 얹었습니다.

```
worlds__bg      배경 사진 (crossfade 820ms)
worlds__wash    자동 계산 dim  ← 이미지 밝기에 따라 세기가 달라집니다
worlds__scrim   텍스트 주변에만 어두운 gradient
worlds__edge    섹션 상/하단 흰색 페이드 (앞뒤 섹션과 연결)
```

| 뷰포트 | opacity | blur | 텍스트 | 카드 radius |
|---|---|---|---|---|
| 1920 / 1440 | **0.62** | 2px | 전부 흰색 | — |
| 375 | **0.56** | 2px | 전부 흰색 | 16px 유지 |

**이미지마다 밝기가 달라 고정 overlay가 불가능**했습니다(상단 밴드 휘도 실측 65 ~ 172). 그래서 이미지가 로드될 때 canvas로 상단 45% 휘도를 재서 dim 세기를 자동으로 정합니다.

| 공간 | 자동 dim (`--wov`) |
|---|---|
| SuperTown | 0.201 |
| Music Festival | 0.101 |
| Blue Lagoon | 0.260 |
| Pop-up Store | 0.313 |
| My Gallery | 0.334 |
| Art Gallery | 0.340 |

새 이미지를 넣어도 값을 따로 넣을 필요가 없고, 특정 공간만 손으로 잡고 싶으면 `world.ov` 값이 항상 자동 계산을 이깁니다.

- 드래그 중에는 배경이 다시 그려지지 않습니다 — `pointermove`는 `--x`만 쓰고, `render()` → `syncBg()`는 index가 확정될 때만 돕니다. 실측 `dragStable true` / `syncAfterDrag true`.
- `prefers-reduced-motion`: crossfade 300ms linear, 진입 scale 애니메이션 `none`.

### 03. Hero 다음 캐릭터 섹션 — 여백 / 비율

| 뷰포트 | 상·하 padding | 제목 | 제목→설명 | 설명→레일 | square 카드 | gap |
|---|---|---|---|---|---|---|
| 3840 | 200 | 66 | 30 | 68 | 300 | 28 |
| 2560 | 200 | 56 | 30 | 68 | 274 | 28 |
| 1920 | 180 | 56 | 30 | 68 | 274 | 27 |
| 1440 | 160 | 48 | 30 | 60 | 252 | 20 |
| 1280 | 142 | 45 | 30 | 52 | 224 | 18 |
| 1024 | 118 | 41 | 26 | 52 | 222 | 16 |
| 768 | 104 | 37 | 26 | 52 | 222 | 16 |
| 430 | 96 | 33 | 20 | 40 | 222 | 16 |
| 390 | 94 | 33 | 20 | 40 | 203 | 16 |
| 375 | 90 | 33 | 20 | 40 | 195 | 16 |
| 320 | 88 | 33 | 20 | 40 | 186 | 16 |

제목과 설명의 좌측 기준선은 모든 뷰포트에서 동일하고, 설명은 `max-width 680`(모바일 100%)으로 잡아 한 줄이 너무 길어지지 않습니다. 2200px 이상에서는 카드가 무한히 커지지 않도록 상한을 두었습니다(portrait 383 / square 300 / landscape 234).

### 04. 공통 Dropdown / Select / Search — `assets/sp-ui.js`

헤더 언어 드롭다운의 표면 톤을 **토큰으로 뽑아** 6개 페이지가 전부 같은 것을 쓰게 했습니다.

```
surface   --sp-menu-bg #fff · --sp-menu-r 14 · --sp-menu-pad 7
          --sp-menu-sh 0 10px 30px rgba(0,0,0,.08), 0 0 0 1px rgba(23,26,33,.05)
option    --sp-opt-h 42 · --sp-opt-r 9 · --sp-opt-hover .045 · --sp-opt-sel .06
field     --sp-fld-h 56 · --sp-fld-r 12
motion    --sp-pop-in 220ms · --sp-pop-out 160ms · --sp-ease cubic-bezier(.16,1,.3,1)
layer     --z-header 200 · --z-pop 600 · --z-modal 900 · --z-toast 1000
```

실측 — 승격된 Select / Search (6개 페이지 · 4개 뷰포트)

| 화면 | 클래스 | 트리거 H | radius | 미승격 native select |
|---|---|---|---|---|
| NEWS 검색 필터 | `spsel nselect` | 56 | 12 | 0 |
| NEWS 검색 입력 | `spsearch` | 56 | 12 | — |
| Support FAQ 필터 / 검색 | `spsel sselect` / `spsearch` | 56 | 12 | 0 |
| Support 문의 유형 | `spsel form__field` | 56 | 12 | 0 |
| MyPage 사이드바 (≤1023) | `spsel mpsel` | 56 | 12 | 0 |
| MyPage 정산 / 환불 / 카드 | `spsel selct` | 56 | 12 | 0 |

- **native `<select>`를 그대로 둡니다.** 숨긴 원본이 여전히 값의 원천이고, 선택하면 `change` 이벤트를 다시 쏘기 때문에 기존 페이지 코드는 한 줄도 고치지 않았습니다.
- 메뉴는 `document.body` 직속으로 띄웁니다(부모 `overflow:hidden` · `backdrop-filter`에 갇히지 않게). 트리거 좌측 정렬 · 폭 일치 · 아래 공간이 부족하면 위로 열림 · 좌우 뷰포트 clamp.
- **모바일은 옵션 4개 이상이면 바텀시트**(상단 radius 22). 예: 문의 유형 8개 → `sheet true`.
- 키보드: `↓`로 열기 → `↓`로 이동 → `Enter` 선택 후 닫히고 **포커스가 트리거로 복귀**, `Esc`도 동일. 실측 `closed true / focusBack true` (1440 · 375 모두).
- 검색: 돋보기 · Clear 버튼(hit area 40~44) · `Esc`로 지우기 · 지운 뒤 포커스 유지. 시안에 검색이 없는 화면에는 추가하지 않았습니다.

**헤더 언어 드롭다운과 프로필 메뉴도 같은 토큰으로 옮겼습니다.**

| | radius | padding | option radius | option H | z-index |
|---|---|---|---|---|---|
| 언어 드롭다운 | 14 | 7 | 9 | 42 | (헤더 내부) |
| 프로필 메뉴 | 14 | 7 | 9 | 44 (터치 타깃 유지) | 600 |
| 프로필 바텀시트 (≤767) | 22 22 0 0 | 8 | 9 | 52 | 600 |

프로필 메뉴의 z-index는 60 → `--z-pop 600`으로 올렸습니다. 예전 값은 헤더(200)보다 낮아서 **모바일 바텀시트의 딤이 헤더를 덮지 못했습니다**. 이제 딤(599)이 헤더까지 덮습니다.

### 05. 이번에 잡은 버그

| 증상 | 원인 | 처리 |
|---|---|---|
| 검색 Clear 버튼이 눌리지 않음 | 페이지가 붙여 둔 장식용 돋보기 아이콘이 Clear 위에 겹침 | 승격 시 `aria-hidden` 장식 아이콘 제거 |
| **MyPage 모바일용 사이드바 Select가 1440에서도 노출** | 승격 wrapper가 원래 `.mpsel` class를 물려받지 못해 `display:none`이 안 먹음 | wrapper가 원본 class를 그대로 물려받고, 겉모습(테두리·배경·높이)만 wrapper에서 무력화 |
| 배너를 낮추자 이미지 위에 흰 띠 | 원본 상단 32px이 흰색 테두리 | 위 01의 `407/375` 기법으로 CSS에서만 잘라냄 |
| 배너 높이가 다시 늘어남 | 흐름 안의 `<img>` 원본 비율이 grid 행 높이를 밀어올림 | 이미지를 `position:absolute`로 흐름에서 분리 |

### 06. 전체 회귀 QA

3840 / 2560 / 1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 360 / 320
× `index` / `world` / `news` / `support`(다운로드 탭) / `auth` / `mypage`

```
worstOverflow 0
errors 0
```

### 확인 부탁드리는 것

1. **다운로드 배너 비율 4.67:1**이 생각하신 "토스·카카오 규격"과 맞는지 봐주세요. 더 낮추려면 `1400/300`의 `300`만 바꾸면 되고, 텍스트는 자동으로 보호됩니다.
2. **원본 이미지의 상단 흰 테두리 32px**은 지금 CSS로 가리고 있습니다. 테두리 없는 원본을 주시면 그 처리를 걷어내고 더 단순하게 만들 수 있습니다.
3. **메인 하단 CTA**는 이전 지시대로 두었습니다. 함께 낮출지 알려주세요.
4. `support.html` **1:1 문의 로그인 게이트**는 아직 페이지 안의 `isLoggedIn` 플래그로만 돌아갑니다(v19 이전 구조). 실제 세션(`SPAuth`)에 연결할지 알려주세요 — 지금은 요청 범위 밖이라 건드리지 않았습니다.

---

## v24 — 공간 섹션 그라데이션 / 프리뷰 투명도 제거 · 하단 배너 높이 고정 · 드롭다운 폭 고정

### 01. 공간 섹션 — 상하 그라데이션 제거

`.worlds__edge`(위·아래 흰 페이드) 레이어를 CSS와 markup에서 **완전히 삭제**했습니다. 사진이 섹션 끝까지 그대로 닿습니다.

```
이전   worlds__bg → wash → scrim → edge(흰 페이드 80~140px)
이후   worlds__bg → wash → scrim
```

`wash`(자동 dim)와 `scrim`(텍스트 주변 국소 gradient)은 흰 타이포 가독성을 담당하므로 그대로 두었습니다.

### 02. 두 번째 / 세 번째 카드 투명도 제거

```
              이전 opacity        이후
중앙 (0)        1.00              1.00
두 번째 (±1)    0.42 / 0.62(mo)   1.00
세 번째 (±2)    0.24 / 0.38(mo)   1.00
네 번째 (±3)    0                 0     ← 화면 밖 진입·이탈 자리라 유지
```

- 크기 리듬(`s`: 1 → .76 → .66)은 **그대로**입니다. 투명도만 걷어냈습니다.
- 비활성 카드에 덮여 있던 어두운 레이어(`rgba(10,13,18,.34)`)도 함께 제거했습니다. 배경과의 분리는 기존 1px inset 흰 선이 담당합니다.
- 네 번째(±3)까지 1로 올리면 카드가 화면 가장자리에서 뚝 끊기며 사라져서 0을 유지했습니다.

실측 (1920 / 1440 / 375 공통) — `is-live` 카드 opacity `1, 1, 1, 0, 0, 1, 1` · 어두운 덮개 `none` · edge 레이어 `false`.

### 03. 하단 CTA 배너 — 1920 = 300px / 375 = 360px

padding으로 높이가 결정되던 구조를 **`min-height` + 세로 중앙 정렬**로 바꿨습니다.

```css
.cta      { min-height: clamp(220px, calc(171px + 6.7vw), 340px) }   /* @1920 = 300 */
@≤767     { min-height: clamp(352px, calc(341px + 5.1vw), 384px) }   /* @375  = 360 */
.cta__art { height: clamp(150px, calc(134px + 4.9vw), 240px); width:auto }
```

| 뷰포트 | 배너 H | 내용 H | 위/아래 여백 | 캐릭터 W×H | overflow |
|---|---|---|---|---|---|
| 3840 / 2560 | 340 | 240 | 50 / 50 | 334×240 | 0 |
| **1920** | **300** | 228 | 36 / 36 | 318×228 | 0 |
| 1440 | 267 | 205 | 32 / 32 | 285×204 | 0 |
| 1280 | 257 | 197 | 30 / 30 | 274×197 | 0 |
| 1024 | 240 | 184 | 27 / 28 | 257×184 | 0 |
| 768 | 222 | 172 | 25 / 25 | 239×172 | 0 |
| 767 (모바일 전환) | 380 | 327 | 27 / 26 | 209×150 | 0 |
| 430 | 363 | 323 | 20 / 20 | 204×146 | 0 |
| 390 | 361 | 306 | 28 / 28 | 185×133 | 0 |
| **375** | **360** | 297 | 32 / 31 | 178×127 | 0 |
| 360 | 359 | 289 | 35 / 35 | 171×122 | 0 |
| 320 | 357 | 277 | 40 / 41 | 164×118 | 0 |

- 캐릭터 PNG는 **`height` 기준 + `width:auto`**로 바꿔 배너 높이에 맞춰 비례로만 작아집니다. 눌리거나 잘리지 않습니다.
- 모바일 리듬은 배너 높이에 맞춰 조였습니다: 제목 → **20** → 버튼 → **24** → 캐릭터(이전 28 / 48).
- `min-height`라서 글자가 커지는 상황에서도 잘리지 않고 배너가 늘어납니다.

### 04. 드롭다운 — 선택을 바꿔도 트리거 폭이 고정

선택한 옵션의 글자 길이에 따라 트리거(상단) 폭이 들썩이던 문제를 고쳤습니다. 보이는 값과 **모든 옵션 텍스트(숨김)** 를 같은 grid cell에 겹쳐 쌓아, 칸의 폭이 항상 *가장 긴 옵션* 기준으로 잡힙니다.

```css
.spsel__vals      { flex:1; display:grid; min-width:0 }
.spsel__vals > span { grid-area:1 / 1; white-space:nowrap; text-overflow:ellipsis }
.spsel__ghost     { visibility:hidden; pointer-events:none }   /* aria-hidden="true" */
```

실측 — 옵션을 순서대로 전부 바꿔가며 트리거 폭 측정

| 화면 | 옵션 | 트리거 폭 |
|---|---|---|
| NEWS 검색 필터 @1920 | 제목 / 제목 + 내용 | 354 → 354 |
| NEWS @1440 | 〃 | 294 → 294 |
| NEWS @375 | 〃 | 320 → 320 |
| Support 문의 유형 @1440 | 8개 전부 | 840 (변동 0) |

- ghost는 `aria-hidden="true"`라 스크린리더가 읽지 않고, `visibility:hidden`이라 클릭도 받지 않습니다.
- 옵션이 다시 그려질 때(언어 전환 등) ghost도 함께 갱신됩니다.
- 폭이 컨테이너로 정해지는 화면(폼 필드 등)에는 아무 영향이 없습니다.

### 05. 전체 회귀 QA

12개 뷰포트 × 6개 페이지 — `worstOverflow 0`, `errors 0`.

---

## v25 — Hero 전면 재구성: ONE STICKY HERO + SCROLL PROGRESS

카카오 Tech & Service Hero 의 **interaction 구조와 motion quality** 만 참고했습니다.
디자인·타이포·컬러·헤더는 첨부 시안과 기존 SUPERPLAT 시스템을 그대로 씁니다.

### 01. 구조 — 섹션을 쪼개지 않았습니다

```
<section class="shero">
  <div class="shero__track">          ← 스크롤 길이 (Desktop 420svh)
    <div class="shero__stage">        ← position:sticky; top:0; height:100svh
      <div class="shero__frame">      ← ⚠️ 이 박스 하나가 계속 "변형"됩니다
        <img data-scene="0|1|2">      ← 같은 frame 안에서 visual 만 crossfade
      <h1 class="shero__lead">        ← Scene 01 카피
      <div class="shero__copy">       ← 좌우 카피 2행 (겹쳐 놓고 교차)
```

Scene 별 section 도, scroll-snap 도 없습니다. **progress(0~1) 하나**가 아래를 전부 보간합니다.

| progress | 일어나는 일 |
|---|---|
| 0.00 ~ 0.12 | Scene 01 full bleed hold |
| 0.12 ~ 0.24 | Scene 01 카피 exit (opacity / −12px / blur 0→3) — 이미지보다 먼저 |
| 0.14 ~ 0.36 | full bleed → 360 정사각 + radius 0 → 72 **연속 morph** |
| 0.30 ~ 0.42 | 좌우 카피 ① entrance (좌 −24px / 우 +24px) |
| 0.31 ~ 0.41 | 이미지 ① → ② crossfade |
| 0.42 ~ 0.58 | **Scene 02 HOLD** (뷰포트 반 이상) |
| 0.58 ~ 0.66 | 카피 ① exit (위로 −18px) |
| 0.60 ~ 0.71 | 이미지 ② → ③ crossfade |
| 0.66 ~ 0.78 | 카피 ② entrance |
| 0.78 ~ 1.00 | **Scene 03 HOLD** → sticky release |

`Text exit → Image transition → New text entrance` 순서로 어긋나게 두어 리듬을 만들었습니다.

### 02. Morph — transform:scale 을 쓰지 않았습니다

`transform:scale()` 만 쓰면 이미지 **내부 crop 까지 같이 눌립니다.**
그래서 **container 의 width / height 를 직접 보간**하고, crop 은 `object-fit:cover` 에 맡겼습니다.
`overflow:hidden` 은 실제 image wrapper(`.shero__frame`)에 걸려 있습니다.

실측 (1440 · progress 별)

| p | frame | radius | 이미지 opacity | 좌우 카피 | lead |
|---|---|---|---|---|---|
| 0.00 | 1425×900 | 0px | 1.00 / 0 / 0 | 0 | 1.00 |
| 0.15 | 1419×897 | 0.4px | 1.00 / 0 / 0 | 0 | 0.84 |
| 0.25 | 893×630 | 36px | 1.00 / 0 / 0 | 0 | 0.00 |
| 0.35 | 366×363 | 71.6px | 0.65 / 0.35 / 0 | 0.38 | 0.00 |
| 0.45 | 360×360 | **72px** | 0 / 1.00 / 0 | 1.00 | 0.00 |
| 0.65 | 360×360 | **72px** | 0 / 0.57 / 0.43 | — | 0.00 |
| 0.75 | 360×360 | **72px** | 0 / 0 / 1.00 | 0.84 | 0.00 |
| 1.00 | 360×360 | **72px** | 0 / 0 / 1.00 | 1.00 | 0.00 |

- **0.30 이후 radius 최솟값 58.9px** — 이미지가 교체되는 동안 radius 가 0 이 되거나 sharp corner 가 노출되는 프레임이 **단 한 프레임도 없습니다**.
- width / height / border-radius / position 이 Scene 02 · 03 에서 완전히 동일해 layout jump 가 없습니다.

### 03. Reverse scroll

progress 의 **순수 함수**라 되감으면 그대로 역재생됩니다.
10개 지점을 정방향으로 훑은 뒤 역방향으로 다시 훑어 **모든 값이 문자열 단위로 일치**하는 것을 확인했습니다.

```
reverse identical: true
```

일회성 IntersectionObserver / class 토글 애니메이션은 쓰지 않았습니다.

### 04. 반응형

| 뷰포트 | track | 카드 | radius | 카피 | 레이아웃 | overflow |
|---|---|---|---|---|---|---|
| 3840 / 2560 | 420svh | 360 | 72 | 56px · 좌우 여백 182 | 3열 (1400 그리드) | 0 |
| 1920 | 420svh | 360 | 72 | **56px** · 182 | 3열 | 0 |
| 1600 | 420svh | 360 | 72 | 53.4px | 3열 | 0 |
| 1440 | 420svh | 360 | 72 | **48.1px** | 3열 | 0 |
| 1280 | 420svh | 360 | 72 | 42.8px | 3열 | 0 |
| 1024 | 420svh | 320 | 72 | 31.7px | 3열 | 0 |
| 768 | 380svh | 380 | 64 | 32.3px | **문장 사이에 이미지** (세로) | 0 |
| 430 / 390 / 375 / 360 | 340svh | **320** | **28** | 36 / 34 / 33 / 32px | 세로 | 0 |
| 320 | 340svh | 280 | 28 | 30px | 세로 | 0 |

- 카드가 `min()` 을 쓰기 때문에 JS 는 **실측 probe** 로 폭을 읽습니다(문자열 파싱 불가).
- 375×667 · 360×640 · 320×568 처럼 **세로가 짧은 기기**에서도 카피가 헤더와 겹치지 않는 것을 확인했습니다 (row top ≥ header height).
- 모든 뷰포트에서 좌우 카피는 **한 줄**로 떨어집니다 (`word-break:keep-all`).

### 05. Header theme

progress 임계값이 아니라 **기하로** 계산합니다 — `프레임 상단이 20px 이상 내려오면 dark`.
뷰포트 높이가 달라도 "흰 배경이 드러나는 순간"에 정확히 맞습니다.

```
Scene 01  White logo / nav / icons + 아주 얇은 흰 divider
   ↓  (프레임이 상단에서 떨어지는 시점)
Scene 02+ Black logo / nav / icons + 흰 반투명 배경 + blur + 회색 divider
```

헤더를 통째로 교체하지 않고 기존 `.is-scrolled` **theme state 만** 전환합니다. 스크롤 임계값(40px) 기반 기존 로직은 Hero 가 있는 페이지에서만 비활성화됩니다.

### 06. prefers-reduced-motion

sticky scrub 을 완전히 걷어내고 **정적 시퀀스**로 내려앉습니다. 콘텐츠는 하나도 사라지지 않습니다.

```
isStatic true · stage position:static · track height 900(=1 viewport)
정적 카드 2장 360×360 r72 · 좌우 카피 4개 opacity 1
```

### 07. 이미지

**첨부 시안의 사진을 그대로 씁니다. AI 재생성 · 색보정 없음.**

| 파일 | 출처 | 크기 |
|---|---|---|
| `hero-scene-town.jpg` | 첨부 원본(합성 전) 그대로 | 1778×1000 |
| `hero-scene-gallery.jpg` | 시안 카드에서 추출 | 314×314 |
| `hero-scene-campus.jpg` | 시안 카드에서 추출 | 314×314 |

- Scene 02 / 03 은 **시안 스크린샷의 카드 영역이 유일한 원본**이었습니다. 카드에 흰 rounded corner 가 구워져 있어, 코너에 닿지 않는 **내접 정사각형(314×314)** 만 잘라 냈습니다(구도 중심은 그대로).
- crop 은 전부 `object-fit:cover` + `object-position` 으로만 합니다. Scene 01 은 화면이 좁아질수록 인물 쪽으로 `52% 48%` → `54% 46%` 만 이동합니다.

### 08. 성능

1920 에서 progress 를 180프레임에 걸쳐 훑으며 프레임 간격 측정:

```
p50 16.7ms (60fps) · p95 29.6ms
```

- scroll 마다 레이아웃을 읽지 않고 rAF 한 번에 한 프레임만 그립니다.
- 값이 바뀌지 않으면 style 을 쓰지 않고, **opacity 0 인 이미지는 `visibility:hidden`** 으로 아예 그리지 않습니다.
- `.shero__frame` 에 `contain:layout paint` 를 걸어 매 프레임 레이아웃 범위를 박스 안으로 가둡니다.
- 모바일 주소창 높이 변화로 다시 계산하지 않도록 **가로 폭이 실제로 바뀐 경우에만** 재측정합니다 (iOS Safari viewport jump 방지). 높이는 `svh` 기준.

### 09. 전체 회귀 QA

12개 뷰포트 × 6개 페이지 — `worstOverflow 0`, `errors 0`.

### 확인 부탁드리는 것

1. **Scene 02 / 03 원본 이미지**를 주시면 좋겠습니다. 지금은 시안 스크린샷에서 추출한 314×314 라서, 360px 카드를 고해상도(2x) 화면에서 보면 살짝 부드럽게 보입니다. 원본으로 교체하면 파일만 바꾸면 됩니다.
2. **Scene 01 카피 아래 버튼**(다운로드 / 월드 둘러보기)은 첨부 시안에 없어서 뺐습니다. 다운로드 진입은 헤더 버튼과 하단 배너에 있습니다. 되살릴지 알려주세요.
3. **최종 radius 72px** 은 시안 카드의 실측(약 76px)에 맞춘 값입니다. 요청하신 48~64 범위보다 큽니다 — 시안 기준이 맞는지 확인 부탁드립니다.
4. **sticky 길이** Desktop 420svh / Tablet 380 / Mobile 340 은 시작점입니다. 실제로 스크롤해 보시고 "한 단계가 너무 빠르다/느리다" 알려주시면 구간표만 조정하겠습니다.
5. 기존 Hero 의 **DAY → NIGHT brush reveal** 은 이번 교체로 제거됐습니다. `hero-day.jpg` / `hero-night.jpg` 파일은 되돌릴 수 있게 assets 에 남겨 두었습니다.

---

## v26 — Hero Typography Scale + Text Motion + Reading Rhythm

sticky 구조 · Full → Square morph · 이미지 순서 · 카피 내용 · Header · grid 는 **하나도 건드리지 않았습니다.**
바뀐 것은 **글자 크기 · 텍스트 모션 · 읽는 순서** 세 가지입니다.

> 첨부해 주신 `text-rotate.tsx` 는 React / Tailwind / motion 기반이고 이 프로젝트는 빌드 없는 static HTML 이라, **컴포넌트를 옮기거나 `motion` 을 설치하지 않았습니다.** 대신 그 예제의 motion language — `overflow:hidden` 마스크 · opacity · translateY · stagger · exit→entrance — 만 가져와 지금 구조에 맞게 다시 썼습니다.

### 01. Headline — Typography Token 사용

임의의 font-size 를 새로 만들지 않고 **기존 `--font-display-xl` 토큰**을 그대로 씁니다.

| 뷰포트 | 이전 | 이후 | line-height | letter-spacing |
|---|---|---|---|---|
| 3840 | 48 | **99.8** | 1.12 | −0.04em |
| 1920 | 48 | **84** | 1.12 | −0.04em |
| 1600 | 40 | **80** | 1.12 | −0.04em |
| 1440 | 36 | **72** | 1.12 | −0.04em |
| 1280 | 32 | **64** | 1.12 | −0.04em |
| 1024 | 26 | **51.2** | 1.12 | −0.04em |
| 768 | 26 | **49.2** | 1.12 | −0.04em |
| 430 | 26 | **44.7** | 1.15 | −0.035em |
| 375 | 26 | **40** | 1.15 | −0.035em |
| 320 | 26 | **40** | 1.15 | −0.035em |

- 태블릿 구간(768~1023)만 토큰이 40px 까지 떨어져서 `clamp(48px, 6.4vw, 56px)` 로 한 단계 얹었고, 모바일도 토큰 하한에서 더 자라도록 `clamp(40px, 10.4vw, 46px)` 를 얹었습니다.
- **모든 뷰포트에서 두 줄 모두 한 줄씩** 떨어집니다 (`1/1`).

**Hierarchy 역전 없음** — 첫 Headline ÷ 좌우 스토리 카피

| 뷰포트 | Headline | Side | 배율 |
|---|---|---|---|
| 1920 / 1600 / 1440 / 1280 | 84 / 80 / 72 / 64 | 56 / 53.4 / 48.1 / 42.8 | **1.50×** |
| 1024 / 768 | 51.2 / 49.2 | 31.7 / 32.3 | 1.61× / 1.52× |
| 430 / 375 / 320 | 44.7 / 40 / 40 | 36 / 33 / 28.2 | 1.24× / 1.21× / 1.42× |

### 02. 첫 진입 — cinematic entrance

이미지가 먼저 자리를 잡고, 그 다음 두 줄이 마스크 안에서 아래→위로 올라옵니다.

```
.line          overflow:hidden  (descender 안 잘리게 padding .1em / margin −.1em)
.line > span   opacity 0→1 · translateY 34px→0 · 880ms · cubic-bezier(.16,1,.3,1)
line 1 delay   .34s     line 2 delay  .47s   (stagger 130ms)
```

실측 타임라인

| t | 이미지 | line 1 | line 2 |
|---|---|---|---|
| +250ms | 0.72 | 0.00 | 0.00 |
| +500ms | 0.92 | 0.78 | 0.43 |
| +800ms | 0.99 | 0.98 | 0.94 |
| +1100ms | 1.00 | 1.00 | 1.00 |

전체 text entrance ≈ **1010ms**. 글자 단위 애니메이션 · bounce · elastic · typing 은 쓰지 않았습니다.

### 03. Motion hierarchy — 한 번에 같이 움직이는 것이 없습니다

구간을 다시 짜서 **Headline 이 먼저 정리된 다음에야** 이미지가 본격적으로 줄어듭니다.

| progress | 일어나는 일 |
|---|---|
| 0.09 ~ 0.20 | ① Headline exit — opacity 1→0 · translateY 0→−24px · blur 0→2px |
| 0.19 ~ 0.38 | ② 그 다음 이미지 morph (full bleed → 360 + radius) |
| 0.33 ~ 0.41 | 이미지 ① → ② |
| 0.35 ~ 0.44 | ③ **LEFT** "나만의 공간이" |
| 0.395 ~ 0.485 | ④ **RIGHT** "미술관이 되고" — LEFT 가 ~60% 나타난 뒤 시작 |
| 0.485 ~ 0.60 | Scene 02 HOLD |
| 0.60 ~ 0.655 | ⑤ LEFT exit 먼저 |
| 0.62 ~ 0.675 | ⑥ RIGHT exit |
| 0.65 ~ 0.735 | ⑦ 이미지 ② → ③ |
| 0.735 ~ 0.825 | ⑧ 새 LEFT "상상이 되고" |
| 0.775 ~ 0.865 | ⑨ 새 RIGHT "캠퍼스가 되는곳" |
| 0.865 ~ 1.00 | Scene 03 HOLD → sticky release |

실측 (1920 · 괄호 안은 어절별 opacity)

| p | frame | Headline | LEFT | RIGHT | 이미지 |
|---|---|---|---|---|---|
| 0.10 | 1905×1080 | 0.98 | 0,0 | 0,0 | 1/0/0 |
| 0.16 | 1905×1080 | **0.30** | 0,0 | 0,0 | 1/0/0 |
| 0.22 | 1802×1032 | **0.00** | 0,0 | 0,0 | 1/0/0 |
| 0.30 | 950×635 | 0.00 | 0,0 | 0,0 | 1/0/0 |
| 0.40 | 360×360 | 0.00 | **0.58, 0.38** | 0.01, 0 | .04/.96/0 |
| 0.44 | 360×360 | 0.00 | **1.00, 0.95** | **0.50, 0.31** | 0/1/0 |
| 0.62 | 360×360 | 0.00 | **0.70** ↓ | 1.00 | 0/1/0 |
| 0.66 | 360×360 | 0.00 | 0.00 | **0.18** ↓ | 0/.96/.04 |
| 0.70 | 360×360 | 0.00 | 0 | 0 | 0/.37/.63 |
| 0.76 | 360×360 | 0.00 | **0.19, 0.06** | 0, 0 | 0/0/1 |
| 0.80 | 360×360 | 0.00 | **0.81, 0.63** | **0.19, 0.06** | 0/0/1 |

Headline 이 0.20 에 사라지고 이미지는 0.22 부터 눈에 띄게 줄어듭니다 — 두 모션이 겹치지 않습니다.

### 04. 어절 단위 reveal

한글은 글자 단위로 쪼개면 과해 보여서 **어절(word)** 을 기준으로 했습니다.

```
[나만의] [공간이]     [미술관이] [되고]
[상상이] [되고]       [캠퍼스가] [되는곳]

.w      display:inline-block; overflow:hidden      ← 마스크
.w > i  translateY 32px → 0 · opacity 0 → 1
어절 간격  progress 0.012 (보통 스크롤 속도에서 60~80ms 로 읽힘)
문장 전체  translateX ∓12px → 0 · exit 시 translateY 0 → −20px
```

- 문장이 멀리서 slide-in 하지 않습니다. 이동 거리는 **12px** 뿐이고, 실제 리듬은 마스크 안에서 어절이 올라오는 데서 나옵니다.
- **모바일/태블릿(≤1023)은 가로 이동 0** — 세로로 쌓인 레이아웃에 맞춰 위→아래 reading motion 으로만 읽힙니다.
- 언어를 바꾸면 `setLang` 이 innerHTML 을 갈아끼우므로, 그 직후 `window.__sheroSplit()` 으로 어절을 다시 나눕니다. (KO 원문 스냅샷은 분리 이전에 잡혀 있어 안전합니다.)

### 05. Scroll scrub / Reverse

모든 값이 여전히 **progress 의 순수 함수**입니다. 11개 지점을 정방향으로 훑은 뒤 역방향으로 다시 훑어 frame · radius · 이미지 opacity · 문장 transform · **어절별 opacity** 까지 전부 일치했습니다.

```
reverse identical: true
```

### 06. 성능 / QA

```
1920 · 180프레임 스크럽   p50 16.7ms (60fps) · p95 19.5ms  (이전 29.6ms)
12 뷰포트 × 6 페이지      worstOverflow 0 · errors 0
prefers-reduced-motion    정적 시퀀스 유지 (카드 2장 · 카피 4개 모두 opacity 1)
```

### 확인 부탁드리는 것

1. **어절 단위**로 끊었습니다(`[나만의] [공간이]`). 문구가 짧아서 통짜(phrase) 로 한 번에 올리는 편이 더 차분할 수도 있습니다 — `WORD_STEP` 을 0 으로 두면 바로 통짜가 됩니다.
2. **Headline exit 가 끝나는 지점(0.20)과 이미지 morph 시작(0.19)** 의 간격이 지금은 거의 붙어 있습니다. 더 뚜렷하게 끊고 싶으시면 shrink 시작을 0.22 정도로 미루겠습니다.
3. **LEFT → RIGHT 간격**은 "LEFT 가 60% 나타난 뒤"로 잡았습니다. 더 또렷한 시차를 원하시면 `SEG.in1R` 시작만 뒤로 밀면 됩니다.

---

## v27 — Section 순서 변경 · Character Vertical Rhythm · Mobile Global Polish

### 01. 메인 Section 순서 — Hero → Space → Character

DOM 위치만 바꾸지 않고, 새 순서에 맞춰 spacing · background transition 을 다시 잡았습니다.

```
[HERO]  혼자 보던 세계에서 / 다같이 노는 세계로   ← sticky scroll sequence 유지
   ↓    Hero 는 흰 화면으로 끝나므로 사진끼리 붙어 보이지 않습니다
[SPACE] 오늘은 어디부터 가볼까요?                ← 사진 배경 · 흰 타이포 · 캐러셀 전부 유지
   ↓    하단 white fade
[CHARACTER] 좋아하는 캐릭터에게 말을 걸어 보세요!  ← 넉넉한 whitespace 뒤 등장
   ↓
[CINEMATIC] → [NEWS] → [DOWNLOAD]
```

- 12개 뷰포트 전부에서 실제 DOM 순서가 `hero > worlds > about > cine > news > download` 로 동일합니다 (PC/모바일 분기 없음).
- Section ID(`#worlds` / `#about`)는 그대로 두어 헤더 내비게이션·내부 링크가 그대로 동작합니다. Hero 의 스크롤 큐만 `#about` → `#worlds` 로 바꿨습니다.
- Scroll trigger 는 원래부터 요소별 IntersectionObserver 라 순서에 의존하지 않습니다 — 순서를 바꿔도 각 섹션이 제 위치에서 Title → Description → Content 순으로 등장합니다.

**공간 섹션 상단 호흡** (Hero 와 붙지 않게)

| | Desktop | Tablet | Mobile |
|---|---|---|---|
| padding-top | 120 ~ 160 | 96 ~ 120 | 80 ~ 96 |
| 실측 | 1920 **159** · 1440 120 | 1024 120 · 768 **96** | 375 **83** · 320 80 |

**공간 → 캐릭터 하단 fade** (§07)

```css
/* 상단에는 두지 않습니다 — 사진이 섹션 위쪽 끝까지 그대로 닿습니다 */
.worlds__out{ position:absolute; left:0; right:0; bottom:0;
  height:clamp(100px, 7.0vw, 134px);      /* 항상 섹션 bottom padding 보다 작게 */
  background:linear-gradient(180deg, transparent, rgba(255,255,255,.55) 62%, #fff); }
```

높이가 섹션 bottom padding 보다 항상 작아서(1920 134 < 140, 375 72 < 76) 카운터·프로그레스 바 같은 흰 텍스트 위로 올라오지 않습니다.

### 02. Character Section — Desktop 200px 기준 Vertical Rhythm

메인의 주요 Showcase 섹션이라 사이트에서 **가장 여유 있는 spacing 그룹**으로 올렸습니다. 숫자를 고정하지 않고 viewport 에 따라 움직입니다.

| 뷰포트 | 이전 | **이후** | 요청 범위 |
|---|---|---|---|
| 3840 | 200 | **230** | 220~240 ✔ |
| 2560 | 200 | **210** | 200~220 ✔ |
| 1920 | 180 | **200** | ~200 ✔ |
| 1600 | 178 | **180** | — |
| 1440 | 160 | **170** | 160~180 ✔ |
| 1280 | 142 | **160** | 150~170 ✔ |
| 1024 | 128 | **136** | 128~144 ✔ |
| 768 | 104 | **120** | 112~128 ✔ |
| 430 | 96 | **116** | 112~120 ✔ |
| 390 | 94 | **108** | 104~112 ✔ |
| 375 | 90 | **104** | 96~112 ✔ |
| 360 | 88 | **100** | 96~104 ✔ |
| 320 | 88 | **89** | 80~96 ✔ |

내부 간격은 외곽 여백과 분리해서 관리합니다 (§08).

| | Title → Desc | Desc → Rail (체감) |
|---|---|---|
| 1920 / 1440 / 1280 | 30 | **61 / 60 / 60** |
| 1024 / 768 | 26 | 52 / 52 |
| 430 / 375 / 320 | 20 | **40 / 40 / 40** |

- Desc → Rail 은 rail 의 hover safe padding 을 뺀 **실제 눈에 보이는 여백**을 잰 값입니다 (Desktop 56~64 · Mobile 36~40 ✔).
- 여백을 늘리면서 카드를 줄이지 않았습니다 — 1:1 정사각 · 큰 카드 · 무한 rail · 좌우 white gradient · hover 전부 그대로입니다.

### 03. Mobile Global Polish

**Grid** — 전 페이지가 이미 좌우 20px 그리드를 쓰고 있는 것을 실측으로 확인했습니다.

| 뷰포트 | body 폭 | content 폭 | 좌/우 |
|---|---|---|---|
| 430 | 415 | 375 | 20 / 20 |
| 390 | 375 | 335 | 20 / 20 |
| **375** | 360 | **320** | **20 / 20** |
| 360 | 345 | 305 | 20 / 20 |
| 320 | 305 | 265 | 20 / 20 |

**Form control 높이 통일** — 화면마다 제각각이던 값을 **52px 하나**로 맞췄습니다.

| control | 이전 | 이후 |
|---|---|---|
| `.inp` (auth · mypage) | 54 | **52** |
| Select 트리거 (`.spsel__btn`) | 56 | **52** |
| Search (`.spsearch` · `.nsearch` · `.ssearch`) | 56 | **52** |
| 문의 폼 `input/select` | 50 | **52** |
| Primary 버튼 | 52 | 52 (유지) |

폭은 전부 `320 @375`, 좌우 `20/20` 으로 이미 일치합니다 — Input 335 / Select 331 / Button 339 같은 어긋남 **0건**.

> ⚠️ `--sp-fld-h` 는 sp-ui.js 가 페이지 `<style>` **뒤에** 주입되므로 페이지에서 `:root` 를 덮어써도 이기지 못합니다. 그래서 토큰 자체를 sp-ui.js 안에서 모바일 분기시켰습니다.

**Page top / Page Title** — 헤더가 fixed 라 섹션 padding 만으로는 체감 여백이 생기지 않던 곳을 고쳤습니다.

| 화면 | 제목 크기 | 헤더 아래 여백 |
|---|---|---|
| 로그인 / 회원가입 | 24 → **32** | 0 → **80** |
| 마이페이지 | 28 → **32** | 28 → **80** |
| NEWS / Support / World 첫 섹션 | 28 → **32** | 55 → **76** |

**Touch feedback (§13)** — hover 를 흉내 내지 않고, 눌렀을 때만 `scale(.99)` · 180ms. 기존에 `.97` / `.98` 로 세게 눌리던 요소도 `(hover:none)` 에서 한 단계 부드럽게 맞췄습니다.

**Bottom Sheet (§09 · §12)** — 옵션 4개 이상이면 시트, `left/right 0`, 상단 radius 22, 옵션 52px, `padding-bottom: calc(14px + env(safe-area-inset-bottom))` 로 Home Indicator 를 피합니다.

**Scroll motion (§14)** — 모바일은 이미 `--rv-y:20px` / `--stagger:60ms` 로 Desktop(28px)보다 한 단계 절제돼 있습니다. 그대로 유지했습니다.

### 04. Mobile QA — 인터랙션 상태까지

430 / 390 / 375 / 360 / 320 × (news · 드롭다운 열림 · 드로어 열림 · Support 3탭 · 바텀시트 열림 · auth · mypage · mypage/cash · index)

```
worst horizontal overflow  0
errors                     0
bottom sheet               left 0 / right 0 (body 기준) · 375에서 360 폭
```

12 뷰포트 × 6 페이지 전체 회귀도 `worstOverflow 0 · errors 0`.

### 확인 부탁드리는 것

1. **다운로드 탭의 사양 표**는 모바일에서 카드로 바꾸지 않고 가로 스크롤 컨테이너(`overflow-x:auto`)로 두었습니다. 페이지 자체 overflow 는 0 이지만, 카드형으로 변환할지 알려주세요.
2. **Hero 의 DAY ↔ NIGHT 붓칠 인터랙션**은 v25 에서 sticky scroll sequence 로 교체되면서 사라졌습니다. 이번 요청서에 보존 항목으로 적혀 있어 확인차 남깁니다 — 되살릴지 알려주세요.
3. **공간 섹션 상단**에는 fade 를 두지 않았습니다(v24 요청대로 상하 그라데이션 제거). 하단만 캐릭터 섹션으로 넘어가는 fade 를 새로 넣었습니다 — 상단에도 필요하면 알려주세요.

---

## v28 — Hero Background Image → Video · Space Section Gradient / Border 제거

### 01. Hero 배경 미디어만 교체

Hero 를 새로 만들지 않았습니다. **Scene 01 배경 `<img>` 한 줄이 `<video>` 로 바뀐 것이 전부**입니다.

```html
<video class="shero__img" data-scene="0"
       autoplay muted loop playsinline preload="metadata"
       poster="assets/hero-scene-town.jpg" width="1280" height="720">
  <source src="assets/hero-scene-town.mp4"  type="video/mp4">
  <source src="assets/hero-scene-town.webm" type="video/webm">
</video>
```

`class` 와 `data-scene` 이 그대로라 **기존 scroll scrub 코드(opacity · `--is` scale · visibility · 크로스페이드)가 한 줄도 바뀌지 않았습니다.** Header · Hero 높이 · Typography · 카피 · 텍스트 위치 · entrance motion · sticky 시퀀스 · 섹션 순서 · 반응형 구조 전부 그대로입니다.

실측 (자동재생 상태)

```
tag VIDEO · autoplay true · muted true · loop true · playsinline true · controls false
readyState 4 · paused false · currentTime 3.35 → 4.86 (재생 중)
duration 10.00 · natural 1280×720 · object-fit cover · pointer-events none
```

| 뷰포트 | overflow | 재생 | object-position | frame |
|---|---|---|---|---|
| 3840 / 2560 | 0 | ✔ | 50% 50% | 3825×1200 / 2545×1200 |
| 1920 / 1440 / 1280 | 0 | ✔ | 50% 50% | 1905×1075 / 1425×806 / 1265×717 |
| 1024 | 0 | ✔ | 50% 50% | 1009×573 |
| 768 | 0 | ✔ | **56% 48%** | 753×520 |
| 430 / 390 / 375 / 360 / 320 | 0 | ✔ | **62% 46%** | 415~305 × 812 |

**모바일 crop 은 실제 프레임을 보고 정했습니다.** 16:9 영상이 세로 화면에서는 가로의 약 25%만 남기 때문에 40 / 54 / 62 / 70 / 78% 를 실제로 렌더해 비교했고, **62%** 에서 주인공 남자 캐릭터의 얼굴과 가운데 캐릭터 무리가 함께 남으면서 헤드라인과도 겹치지 않았습니다. 영상 파일은 손대지 않고 `object-position` 으로만 조정했습니다.

**Poster / Fallback** — poster 가 기존 Hero 이미지(`hero-scene-town.jpg`) 입니다. 로딩 전에도, 자동재생이 막혀도 **같은 장면이 그대로** 보여서 Video → Image → Video 로 깜빡이지 않습니다. Hero 컨테이너 크기는 JS 가 처음부터 잡아 두므로 layout shift 도 없습니다.

**Loop** — 루프 경계 휘도를 직접 샘플링했습니다.

```
t=0 → 109   t=0.04 → 109   t=9.90 → 109   t=9.96 → 109
```

검은 프레임 · 흰 플래시 · poster flash 없음.

**성능** — Hero 가 화면 밖으로 나가면 정지시켜 공간 캐러셀 · 캐릭터 rail 구간에 디코딩 비용이 남지 않게 했습니다. 탭이 백그라운드로 가도 정지합니다.

```
in view  { paused:false, t:2.66 }
off view { paused:true,  t:2.67 }
back     { paused:false, t:3.86 }

Hero scrub   1920  p50 16.7ms · p95 22.6ms
             375   p50 16.7ms · p95 18.0ms · 20ms 초과 프레임 0개
```

**reduced-motion** — `autoplay` 속성을 떼고 첫 프레임에서 정지시킵니다(`paused true · t 0`). 정지 화면이 곧 기존 Hero 이미지와 같은 장면이라 콘텐츠가 사라지지 않습니다.

**텍스트 가독성** — 영상 전 구간의 헤드라인 밴드 평균 휘도가 122 로 **프레임마다 흔들리지 않습니다**(p90 186). 전체를 덮지 않고 글자가 놓이는 중앙 밴드만 `.10 → .20` 으로 아주 얕게 눌렀습니다. 영상 색감은 그대로 보입니다.

```css
/* 위/아래 끝은 그대로, 중앙 밴드만 조정 */
rgba(0,0,0,.34) 0% → .16 26% → .20 46% → .18 62% → .30 100%
```

> ⚠️ **WebM 을 함께 넣었습니다.** 첨부해 주신 **mp4 가 항상 1순위**이고(H.264 를 읽는 브라우저는 원본 그대로 재생), H.264 디코더가 없는 환경에서만 WebM 으로 떨어집니다. 사이트의 다른 영상(`community-*`, `superplat-video`)도 이미 같은 mp4 + webm 구조입니다. 원본은 자르거나 색을 바꾸거나 속도를 바꾸지 않았습니다.
>
> 참고 — 원본이 **1280×720** 이라 1920 이상에서는 1.5배 이상 확대됩니다. 더 큰 해상도 원본이 있으면 파일만 교체하면 됩니다.

### 02. Space Section — 상·하단 Gradient 완전 제거

v27 에서 넣었던 하단 white fade(`.worlds__out`)를 **CSS·markup 에서 완전히 삭제**했습니다. 상단에도 없습니다.

```
이전   배경 사진 → (하단 100~134px 흰색 fade) → 캐릭터 섹션
이후   배경 사진이 섹션 끝까지 그대로 → 섹션 종료 → 충분한 whitespace → 캐릭터 섹션
```

섹션 구분은 gradient 가 아니라 **spacing · 배경 대비 · 타이포그래피**가 담당합니다 (Space 하단 padding 104~140 + Character 상단 padding 200).

흰 텍스트 가독성은 **국소 scrim 만** 남겼습니다 — 요청하신 `.20~.35` 범위로 낮췄습니다.

| | 이전 | 이후 |
|---|---|---|
| 상단 | .56 → .40 | **.35 → .26** |
| 중앙 | .10 / .08 | **.06 / .05** |
| 하단 | .34 → .52 | **.22 → .33** |
| 모바일 | .58 → .58 | **.38 → .36** |

배경 자동 dim(`--wov`, 이미지 밝기에 따라 자동 계산) · Blur 2px · Background Crossfade · Background Sync 는 전부 그대로입니다.

### 03. Space Active Card — 흰 테두리 제거

```css
/* 선택 상태를 테두리로 표시하지 않습니다 —
   「가운데 배치 + 가장 큰 이미지 + 배경 동기화」 셋으로만 읽힙니다. */
#worlds .slide, #worlds .slide__inner, #worlds .slide__inner img{border:0;outline:0;box-shadow:none}
#worlds .slide:focus, #worlds .slide:active,
#worlds .slide.is-active, #worlds .slide.is-active .slide__inner{box-shadow:none;outline:none}
/* 키보드 사용자만 별도 표시 */
#worlds .slide:focus-visible{outline:2px solid rgba(255,255,255,.92);outline-offset:4px}
```

- 기존 `inset 0 0 0 1px rgba(255,255,255,.18)` 흰 stroke 제거.
- 중앙 카드의 dark depth shadow 도 함께 제거했습니다(사진 배경 위에서는 의미가 없고, 새 그림자 추가는 금지 항목이라 대체하지 않았습니다).
- hover 는 **scale 만** 남겼습니다 — `--hs:.98` + 안쪽 이미지 1.015.

**클릭 순간 흰 테두리 flash 검사** — 클릭 직후 14프레임을 연속 샘플링했습니다.

```
click frames  [ 'none|none|none' ]      (inner box-shadow | slide box-shadow | outline)
```

단 한 프레임도 테두리가 나타나지 않습니다. radius 는 Desktop 22px / Mobile 16px 그대로이고, 확대 애니메이션 중에도 변하지 않습니다.

### 04. 전체 QA

12 뷰포트 × 6 페이지 — `worstOverflow 0` · `errors 0`.
Hero 12 뷰포트 개별 확인 — overflow 0 · 전부 재생 중 · 비율 1.778 유지(찌그러짐 없음).

### 확인 부탁드리는 것

1. **모바일 crop 62%** 는 실제 프레임 5개를 비교해 고른 값입니다. 여자 캐릭터 쪽을 살리고 싶으시면 40% 로, 남자 캐릭터를 더 크게 보이려면 70~78% 로 한 줄만 바꾸면 됩니다.
2. **원본 해상도 1280×720** — 1920 이상에서 확대됩니다. 더 큰 원본이 있으면 교체만 하면 됩니다.
3. **Space 국소 scrim** 을 요청 범위(.20~.35)로 낮췄습니다. 밝은 공간 이미지(Blue Lagoon 등)에서 흰 제목이 약해 보이면 상단만 다시 올리겠습니다.

---

## v29 — Hero Video 적용 취소 (Image Hero 복원)

v28 에서 넣은 Hero Background Video 만 선택적으로 되돌렸습니다. **그 이후·이전의 다른 수정사항은 하나도 건드리지 않았습니다.**

### 되돌린 것 (v28 의 Hero 변경분만)

| | 되돌린 내용 |
|---|---|
| markup | `<video>` → 원래 `<img src="assets/hero-scene-town.jpg" width="1778" height="1000">` |
| `<head>` | `<link rel="preload" as="video">` 제거 |
| CSS | `.shero__img` 의 `pointer-events` / `user-select` / `background` 추가분, `::-webkit-media-controls` 규칙 전부 제거 |
| object-position | 태블릿 56%→**52% 48%** · 모바일 62%→**54% 46%** (영상용으로 옮겼던 값을 이미지 기준으로 원복) |
| Hero scrim | 영상 밝기 때문에 올렸던 중앙 밴드를 원복 — `.34 / .10 / .08 / .30` |
| JS | `heroVideo` 변수, 영상 분기 intro, 자동재생 / 일시정지 / IntersectionObserver / visibilitychange 블록 전부 삭제 |
| assets | `hero-scene-town.mp4` · `hero-scene-town.webm` 삭제 (약 4.5MB) |

### 픽셀 단위 검증

영상 적용 **직전(v26)** 에 찍어 둔 1920 Hero 스크린샷과 롤백 후 화면을 직접 비교했습니다.

```
size        1920×1080  vs  1920×1080
diff bbox   (947, 1016) ~ (959, 1025)   ← 12×9px, 스크롤 큐 화살표의 애니메이션 위상 차이
max diff    29        mean diff  0.000
```

Hero 전체가 **영상 적용 직전과 동일**합니다.

### 상태 확인

```
scene0        IMG · hero-scene-town.jpg · 1778×1000 · object-fit cover
#hero 안 video  없음 · mp4/webm 네트워크 요청 0건
scrim         rgba(0,0,0,.34) 0% → .10 30% → .08 58% → .30 100%
```

| 뷰포트 | 태그 | object-position | frame | overflow |
|---|---|---|---|---|
| 3840 / 2560 / 1920 / 1440 / 1280 / 1024 | IMG | 50% 50% | — | 0 |
| 768 | IMG | **52% 48%** | 753×520 | 0 |
| 430 / 390 / 375 / 360 / 320 | IMG | **54% 46%** | 415~305 × 812 | 0 |

Hero interaction 도 그대로입니다 — Headline 84px / 1.12 / −0.04em, 어절 분리(`[나만의] [공간이]` …), progress 표 전 구간 v26 과 동일, `reverse identical: true`, reduced-motion 정적 시퀀스 정상.

### 유지된 최신 수정사항 (롤백되지 않았음을 실측 확인)

```
section order        hero > worlds > about > cine > news > download
Space 상하 gradient   .worlds__out 없음 (제거 상태 유지)
Space active card    slide box-shadow none · inner box-shadow none (흰 테두리 없음)
Character 상하 여백   #about padding-top 200px
```

전체 회귀 — 12 뷰포트 × 6 페이지 `worstOverflow 0` · `errors 0`.

---

## v30 — Scene 02/03 Editorial Scale · Character Showcase · Mobile Story Composition

### 00. 확인해 주신 세 가지

| 질문 | 선택 | 반영 |
|---|---|---|
| Hero 첫 화면 정렬 | **현재 중앙 정렬 유지** | 손대지 않았습니다. Supporting Copy 도 추가하지 않았습니다. |
| Scene 02/03 중앙 이미지 | **정사각형 유지 + 카피만 키우기** | 360×360 그대로, 좌우 카피만 56 → 64 (@1920) |
| 섹션 구조 | **현재 sticky 시퀀스 유지** | Scene 02/03 은 Hero 안에 그대로 |

### 01. Scene 02/03 — 1400 Grid + Editorial Typography

**좌우 카피의 좌/우 기준선이 다른 섹션(.wrap)과 픽셀 단위로 같습니다.**

| 뷰포트 | 카피 크기 | 줄 수 | 카피 left | `.wrap` left | 카피 right | `.wrap` right | 수평축 |
|---|---|---|---|---|---|---|---|
| 3840 / 2560 | 68 | 1/1 | 1213 / 573 | **동일** | 1213 / 573 | **동일** | ✔ |
| **1920** | **64** | 1/1 | **253** | **253** | **253** | **253** | ✔ |
| 1600 | 56 | 1/1 | 93 | 93 | 93 | 93 | ✔ |
| 1440 | 52 | 1/1 | 58 | 58 | 58 | 58 | ✔ |
| 1280 | 48 | 1/1 | 51 | 51 | 51 | 51 | ✔ |
| 1024 | 34 | 1/1 | 66 | 41 | 66 | 41 | ✔ |

- `padding-inline` 을 걷어내고 **`--container`(=1400 그리드) 를 그대로** 쓰게 했습니다. 1920 에서 좌측 기준선 253px — 사이트 공통 그리드와 완전히 같은 x 입니다.
- 모든 폭에서 **두 문장 다 한 줄**로 떨어집니다(§06).
- `align-items:center` 로 좌 · 중앙 · 우의 **visual center 가 하나의 수평축** 위에 있습니다 — 실측 ✔.
- 1920 기준 gap 좌 245 / 우 140 (§10 의 100~180 범위). 문장 길이가 달라 좌우가 다른데, 이는 §10 의 "같은 간격을 강제하지 말 것"에 따른 optical 정렬입니다.
- weight 700 · line-height 1.12 · letter-spacing −0.042em.

### 02. Character Section — 한 화면 Showcase

| 뷰포트 | 섹션 높이 | svh | 상·하 padding | 제목 | 본문 | 본문→Rail | 카드(sq) |
|---|---|---|---|---|---|---|---|
| 3840 | 1901 | **88%** | 230 | **64** | **20** | 92 | 300 |
| 2560 | 1267 | **88%** | 210 | 64 | 20 | 89 | 274 |
| **1920** | 1063 | **98%** | 200 | 56 | 20 | **89** | 274 |
| 1440 | 936 | 104% | 170 | 48 | 18 | 76 | 252 |
| 1280 | 872 | 109% | 160 | 45 | 18 | 76 | 224 |
| 1024 | 791 | 103% | 136 | 41 | 17 | 64 | 222 |
| 768 | 743 | 73% | 120 | 37 | 16 | 60 | 222 |
| 430 / 375 / 320 | 745 / 688 / 673 | 80 / **85** / 118% | 116 / 104 / 89 | 33 | 16 | **56** | 222 / 195 / 186 |

- **본문 → Character Rail 여백을 60 → 89 (@1920)** 로 넓혔습니다. 이게 Reference 와 가장 크게 달랐던 부분입니다. 1440 76 · 1024 64 · 375 56.
- **`min-height:88svh` + 세로 중앙 정렬**(≥1024)을 넣어 3840 54% · 2560 73% 였던 화면 점유율을 **88%** 로 올렸습니다. padding 은 그대로 "최소 호흡"이라 콘텐츠가 길어지면 섹션이 늘어납니다.
- **좌우 White Fade 를 190 → 80~110** 으로 줄였습니다(모바일 32~56). 첫·마지막 캐릭터가 과하게 흐려지지 않습니다.
- 2K·4K 상한: 제목 64 · 본문 20 · 카드 300 · padding 230.
- 진입 모션: **Title → Description(+80ms) → Rail(+160ms)** 로 읽는 순서를 또렷하게 (`#about` 안에서만).
- 유지된 것: 문구 · 캐릭터 리소스 · 카드 비율 · 무한 rail · 좌우 fade · hover · Pretendard.

> Rail 은 자동으로 흐르는 무한 marquee 라 §21 의 "첫 카드가 20px 그리드에서 시작 + snap" 은 적용하지 않았습니다(§26 의 "Horizontal Rail 유지"와 충돌). snap carousel 로 바꾸길 원하시면 알려주세요.

### 03. 모바일 "나만의 공간이 / [이미지] / 미술관이 되고"

**세 요소가 완전히 같은 center axis 위에 있습니다 — 실측 편차 0.0px.**

| 뷰포트 | body | 상단 카피 L/R | 이미지 L/R | 하단 카피 L/R | **axis 편차** | 위 gap | 아래 gap | 카드 | 크기 |
|---|---|---|---|---|---|---|---|---|---|
| 430 | 415 | 105/105 | 28/28 | 105/105 | **0.0** | **40** | **40** | 360 | 40 |
| 390 | 375 | 88/88 | **20/20** | 88/88 | **0.0** | 37 | 37 | 335 | 39 |
| **375** | 360 | 85/85 | **20/20** | 85/85 | **0.0** | **36** | **36** | 320 | **37** |
| 360 | 345 | 81/81 | **20/20** | 81/81 | **0.0** | 35 | 35 | 305 | 36 |
| 320 | 305 | 71/71 | **20/20** | 71/71 | **0.0** | 31 | 31 | 265 | 32 |

- 첨부 화면에서 이미지가 살짝 밀려 보이던 부분은 **레이아웃 문제가 아니었습니다** — 세 요소의 중심 x 편차가 모든 폭에서 0.0px 입니다.
- 위·아래 간격을 각각의 margin 이 아니라 **grid `row-gap` 하나**로 잡아 항상 정확히 같습니다 (@375 36 / 36).
- 이미지 폭을 `min(calc(100% - 40px), 360px)` 로 바꿔 **좌우 20px 콘텐츠 그리드에 정확히** 맞습니다. `100vw` 가 아니라 `100%`(스테이지 폭)라 스크롤바 유무와 무관합니다 — 실기기 375 에서는 335px.
- 타이포 통일: 37px(@375) · weight 700 · line-height 1.18 · letter-spacing −0.04em — 두 문장 완전히 동일.
- 헤더 → 첫 문장 체감 여백 @375 98px.

> ⚠️ grid track 에 `%` 가 들어간 `--card` 를 그대로 쓰면 **세로 기준으로 해석돼** 레이아웃이 무너집니다(간격이 −124px 로 측정됐습니다). JS 가 probe 로 잰 실제 픽셀값을 `--cardpx` 로 다시 내보내 grid track 에 쓰도록 고쳤습니다.

### 04. QA

```
Scene 02/03    13 뷰포트 · 전부 1줄 · 수평축 ✔ · overflow 0
Character      13 뷰포트 · 88~118 svh · overflow 0
Mobile 스토리   5 뷰포트 · center axis 편차 0.0 · 위아래 gap 동일
Hero scrub     reverse identical: true
전체           12 뷰포트 × 6 페이지 · worstOverflow 0 · errors 0
```

Hero(중앙 정렬 헤드라인) · Header · Space Carousel · Space 배경 sync · News / Support · Dropdown / Search 는 건드리지 않았습니다.

---

## v31 — Space Carousel Depth Hierarchy · 흰 테두리 원인 제거 · Scroll Indicator 교체

### 01. 흰 테두리 — 원인을 찾아서 제거했습니다

카드에는 원래 border / outline / shadow 가 하나도 없었습니다. **진짜 원인은 캐러셀 컨테이너였습니다.**

```
.worlds__stage 에 tabindex="0" 이 있어서, 클릭하거나 방향키를 쓰면
브라우저 기본 focus ring 이 캐러셀 전체에 그려집니다.
실측: outline 2px solid · offset 3px   (macOS / Safari 에서는 밝은 흰색)
```

`.slide` 를 아무리 뒤져도 안 나왔던 이유입니다. 두 겹으로 막았습니다.

1. `stage` · `viewport` · `slide` · `inner` · `img` 의 `:focus / :focus-within / :active / :hover / .is-active` 전부 `outline:none; box-shadow:none; border:0`
2. **`:focus-visible` 만으로는 부족**했습니다 — 한 번 키보드로 포커스가 잡히면 그 뒤 마우스로 클릭해도 브라우저가 `focus-visible` 을 유지합니다(실측). 그래서 `pointerdown` 에 `.is-pointer` 를 붙여 확실히 끄고, `keydown` 이 오면 다시 켭니다.

썸네일을 순서대로 3장 클릭하며 매 단계 검사한 결과:

| 단계 | ring |
|---|---|
| 초기 | 없음 |
| 클릭 직후 ×3 | **없음** |
| 전환 완료 후 ×3 | **없음** |
| hover + active | **없음** |
| 키보드 이동 | 접근성 표시 (의도) |
| 키보드 후 다시 마우스 | **없음** |

키보드 표시는 카드 테두리처럼 보이지 않게 **캐러셀 바깥으로 10px 띄운 ring** 입니다. 마우스에서는 어떤 경우에도 나타나지 않습니다.

### 02. Depth Hierarchy — 40% → 20% → 0% → 20% → 40%

이미지에 `filter` 를 걸지 않고 **별도 레이어의 opacity 만** 바꿉니다(GPU friendly). 섹션 배경 dim(`.worlds__wash` / `.worlds__scrim`)과 완전히 별개 레이어입니다.

```html
.slide__inner            overflow:hidden · border-radius
  ├── img
  └── .slide__dim        background:#000 · border-radius:inherit · opacity:var(--dim)
```

실측 (중앙 기준 좌 ← → 우)

| 뷰포트 | DIM 단계 | 이미지 radius | DIM radius | 일치 |
|---|---|---|---|---|
| 1920 | `.40 .40 **.20 .00 .20** .40 .40` | 22px | 22px | ✔ |
| 1440 / 1280 / 1024 / 768 | 동일 | 18px | 18px | ✔ |
| 430 / 390 / 375 / 360 | `.38 .38 **.20 .00 .20** .38 .38` | 16px | 16px | ✔ |

- **완벽히 대칭**이고, Active 는 언제나 정확히 0% 입니다.
- 모바일은 카드가 커서 40% 가 과해 보여 **38%** 로 optical adjust 했습니다(§14 의 35~40 범위).
- 전환은 `opacity 560ms cubic-bezier(.16,1,.3,1)` — 카드 이동 · scale · 배경 crossfade 와 같은 easing 이라 하나의 모션으로 읽힙니다.
- **hover 로 DIM 이 풀리지 않습니다.** 실제 Active 가 되어야만 0% 가 됩니다. Adjacent hover 는 `scale 1.02` 피드백만.

### 03. 카드 간격 확대

| | 이전 | 이후 |
|---|---|---|
| 중앙 ↔ 1차 (@1920) | 16~24 | **36** |
| 1차 ↔ 2차 (@1920) | 12~20 | **36** |
| 1440 / 1280 / 1024 | 〃 | 30 |
| 모바일 375 / 360 / 390 | 11~13 | **16** |
| 모바일 430 | 13 | **20** |

PC 값을 축소해 쓰지 않고 모바일 전용 spacing 으로 잡았습니다.

### 04. Scroll Indicator 교체

첨부해 주신 **84×42 흰색 chevron** 을 그대로 씁니다(`assets/scroll-cue.png`). 기존 인라인 SVG 체브론은 제거했습니다.

| 뷰포트 | 크기 | 비율 | 중앙 편차 | 하단 여백 | 터치 타깃 |
|---|---|---|---|---|---|
| **1920** | **52×26** | 2.000 | **0** | 48 | 64×48 |
| 1440 | 46×23 | 2.000 | 0 | 37 | 64×48 |
| 1280 | 44×22 | 2.000 | 0 | 33 | 64×48 |
| 1024 / 768 | 41 / 40 | 2.000 | 0 | 32 | 64×48 |
| 430 ~ 320 | **40×20** | 2.000 | **0** | 24 | 64×48 |

- 원본 84:42 비율 그대로 (`height:auto`), 왜곡 없음.
- 모바일 `bottom: calc(24px + env(safe-area-inset-bottom))` — Home Indicator 회피.
- 모션: `translateY 0 → 6px → 0` · `opacity 1 → .65 → 1` · 2.2s ease-in-out infinite. bounce / overshoot 없음.
- 밝은 화면에서도 사라지지 않게 `drop-shadow(0 2px 8px rgba(0,0,0,.18))` 만. Glow / outline 없음.
- 클릭 시 `#worlds` 로 이동하는 기존 동작 그대로.

### 05. QA

```
DIM 계층      9 뷰포트 · 좌우 완벽 대칭 · radius 100% 일치
흰 테두리      마우스 전 상태 0건 (클릭 직후 · 전환 후 · hover · 키보드 후 재클릭)
Scroll Cue    10 뷰포트 · 중앙 편차 0 · 비율 2.000 유지
전체          12 뷰포트 × 6 페이지 · worstOverflow 0 · errors 0
```

캐러셀 이동 방식 · Active 크기 · 배경 sync · 배경 crossfade · White Typography · Arrow · Progress · Drag / Swipe · 상하 gradient 제거 상태는 모두 그대로입니다.

---

## v32 — Hero Scroll Indicator 크기 재조정 (28 × 14 @1920)

v31 에서 키운 52px 는 폐기하고, **1920 기준 28 × 14px** 로 다시 잡았습니다.
리소스(`assets/scroll-cue.png` · 84×42)와 위치 · 링크 동작은 그대로입니다.

| 뷰포트 | 크기 | 비율 | 중앙 편차 | 하단 여백 | 터치 타깃 |
|---|---|---|---|---|---|
| 3840 / 2560 / **1920** | **28 × 14** | 2.000 | **0** | 36 | 48 × 44 |
| 1600 | 27 × 13 | 2.001 | 0 | 32 | 48 × 44 |
| 1440 | 26 × 13 | 2.001 | 0 | 29 | 48 × 44 |
| 1280 | 25 × 13 | 2.001 | 0 | 28 | 48 × 44 |
| 1024 | 24 × 12 | 2.000 | 0 | 28 | 48 × 44 |
| 768 | 23 × 11 | 2.001 | 0 | 28 | 48 × 44 |
| 430 / 390 / 375 / 360 / 320 | **21 × 11** | 2.000 | **0** | 26 | 48 × 44 |

```css
.shero__cue{
  position:absolute; z-index:5; left:50%;
  bottom:calc(clamp(28px, 2vw, 36px) + env(safe-area-inset-bottom, 0px));
  transform:translateX(-50%);
  min-width:48px; min-height:44px;      /* 아이콘은 작게, 클릭 영역은 넉넉하게 */
  display:grid; place-items:center;
  opacity:var(--cue, 1);
}
.shero__cue img{
  width:clamp(21px, calc(19px + .47vw), 28px);
  height:auto;                          /* 원본 84:42 비율 유지 — 왜곡 없음 */
  filter:drop-shadow(0 2px 8px rgba(0,0,0,.18));
  animation:cue 2s var(--ease-soft) infinite;
}
@keyframes cue{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(4px);opacity:.65}}
```

- 원 / 테두리 / glow / 텍스트 없음. 밝은 화면에서도 사라지지 않도록 아주 옅은 drop-shadow 만 남겼습니다.
- 모션은 `translateY 0 → 4px → 0` · `opacity 1 → .65 → 1` · 2s. bounce · overshoot 없음.
- `prefers-reduced-motion` 에서는 애니메이션이 꺼지고 정적으로 표시됩니다.

---

## v33 — Space Carousel 클릭 문제 구조적 해결 (축소 · 흰 테두리 · 선택 불가)

### 00. 원인 — CSS 를 덮어쓰는 문제가 아니었습니다

세 가지 증상이 **서로 다른 세 가지 원인**에서 나왔습니다. 실측으로 하나씩 확인했습니다.

| 증상 | 진짜 원인 |
|---|---|
| 클릭하면 흰 테두리가 생긴다 | `.slide` 의 배경색 **`#E8E8EA`**. 누르는 순간 안쪽 레이어가 `scale(.985)` 로 줄어들면서 이 밝은 배경이 카드 둘레에 **약 7px 링**으로 드러났습니다 (921.6px 카드 기준 (921.6 − 908.8) / 2 = 6.9px — 첨부해 주신 스크린샷의 테두리 두께와 일치). |
| 클릭하면 카드가 작아진다 | `.slide.is-active:hover{--hs:.98}`. 옆 카드를 hover(1.02)한 채 클릭하면 그 카드가 중앙에 도착하는 순간 **1.02 → 0.98** 로 4% 축소됐습니다. |
| 클릭해도 그 카드가 중앙으로 오지 않는다 | 드래그를 위해 stage 에 `setPointerCapture()` 를 걸고 있어서, 브라우저가 **click 이벤트를 stage 로 retarget** 합니다. 실측: `click.target = .worlds__stage`. 카드마다 달아 둔 click 리스너가 **한 번도 실행되지 않았습니다.** → 그래서 "눌렀다 → 작아졌다 → 테두리 → 제자리" 로만 보였습니다. |

### 01. 레이어 재구성 (FRAME / VISUAL / IMAGE / OVERLAY)

```
.slide            FRAME   위치 · 최종 크기 · aspect-ratio 16/9 · radius   (배경색 없음)
 └ .slide__inner  VISUAL  overflow:hidden · radius:inherit · scale(var(--vs))
    ├ img         IMAGE   프레임보다 2% 크게 (bleed) · object-fit:cover
    └ .slide__dim OVERLAY position:absolute · inset:0 · radius:inherit
```

- **width / height / padding / border 를 바꾸지 않습니다.** 카드 크기 변화는 전부 `transform:scale`.
- `.slide` 배경색을 **없앴습니다**. 안쪽이 아무리 줄어도 드러날 밝은 면 자체가 없습니다.
- `.slide__inner` 배경은 흰색 대신 `#11131A` — 이미지 로딩 중에도 흰 면이 보이지 않습니다.

### 02. IMAGE BLEED — 항상 프레임 밖까지 이미지가 나가 있습니다

```css
.slide__inner img{
  position:absolute; left:-1%; top:-1%; width:102%; height:102%;
  max-width:none;                  /* ⚠️ 전역 img{max-width:100%} 가 bleed 를 잘라냅니다 */
  object-fit:cover; object-position:center;
  transform:scale(var(--z,1.02));  /* 기본 1.02 → Active 1.00 으로 settle */
  transition:transform 640ms var(--ease);
}
.slide.is-active .slide__inner img{--z:1}
```

이미지가 프레임 밖으로 나가 있는 양(= 빈 틈이 생길 여유). **음수가 아니면 테두리가 보일 수 없습니다.**

| 뷰포트 | 정지 | hover | 누르는 중 | 전환 중 최악값 |
|---|---|---|---|---|
| 1920 | 9.20 / 5.17px | 14.82px | 7.64px | **5.17px** |
| 1440 | 7.59 / 4.27px | — | — | **4.27px** |
| 390 | 3.42 / 1.92px | — | — | **1.92px** |

### 03. Hover · Press · Active 상태 분리

| 상태 | 이전 | 이후 |
|---|---|---|
| Active + hover | `--hs:.98` (4% 축소) | **`--hs:1`** (변화 없음) + 안쪽 이미지만 `1.012` |
| Adjacent + hover | `--hs:1.02` | 그대로 |
| 누르는 중 | 안쪽 `scale(.985)` → 흰 링 | **`--vs:.995`** (0.5%) — bleed 덕분에 빈 틈 없음 |
| Adjacent → Center | keyframe `1.025 → 1` (일회성) | **상태 transition `1.02 → 1`** — 되돌아가도 항상 같은 값으로 수렴 |

일회성 `@keyframes kb` 를 없애고 상태 transition 으로 바꿨기 때문에, 빠르게 연속 클릭해도 애니메이션이 겹치거나 hover 와 충돌하지 않습니다.

### 04. 클릭 판정 — 좌표로 직접

`setPointerCapture` 때문에 카드별 click 리스너가 죽는 문제를, 카드 리스너를 걷어내고 `release()` 안에서 포인터 좌표로 판정하도록 바꿨습니다.

```js
function slideAt(x, y) { /* 겹친 카드 중 중앙에 가까운(위에 있는) 카드를 고릅니다 */ }
function release(e) {
  ...
  if (!moved && !dragged && e && e.type === 'pointerup') {
    var i = slideAt(e.clientX, e.clientY);
    if (i > -1) active = i;
  }
  render();
}
```

드래그 / 스와이프 / 화살표 / 키보드 / autoplay 는 전부 이전과 동일하게 동작합니다(실측 확인).

### 05. 모션 동기화 (§12)

이동 · DIM · 이미지 settle 을 **640ms · `cubic-bezier(.16,1,.3,1)`** 하나로 묶었습니다 (이전에는 700 / 560 / 620ms 로 조금씩 어긋나 있었습니다).

인접 카드 클릭 → 중앙 안착까지 실측 (1920):

| 시간 | 카드 폭 | 이미지 scale | DIM |
|---|---|---|---|
| t+0 | 714.4 | 1.020 | .20 |
| t+160ms | 819.9 | 1.016 | .098 |
| t+240ms | 863.4 | 1.014 | .056 |
| t+400ms | 910.5 | 1.012 | .011 |
| t+560ms | 921.3 | 1.001 | 0 |
| t+640ms | **921.6** | **1.000** | **0** |

폭이 **단조 증가**합니다 — 어느 프레임에서도 줄어드는 구간이 없습니다.

### 06. QA — 연속 클릭 6회 × 전환 중 6프레임 샘플링

```
1920   최종 크기 921.6 × 518.4 고정 · radius 22px 고정 · 빈 틈 최대 -5.17px · 테두리 0건
1440   최종 크기 760.0 × 427.5 고정 · radius 18px 고정 · 빈 틈 최대 -4.27px · 테두리 0건
390    최종 크기 343.2 × 193.0 고정 · radius 16px 고정 · 빈 틈 최대 -1.92px · 테두리 0건
```

- `border` / `outline` / `box-shadow` 를 **stage · slide · inner · img 네 레이어 모두에서** 매 프레임 검사했고 전부 0 이었습니다.
- 카드 간격 36.4px, DIM 0 / .2 / .4 는 그대로입니다.
- 키보드 focus ring 은 유지(카드 바깥 10px), 마우스 클릭 뒤에는 사라집니다.
- 모바일 탭: 중앙 카드를 탭해도 아무 일도 일어나지 않고, 옆 카드를 탭하면 중앙으로 옵니다.
- 12 뷰포트 × 6 페이지 — worstOverflow **0** · errors **0**.

### 확인 부탁드리는 것

1. 옆 카드를 연달아 빠르게 눌러 보셨을 때 크기 튐 / 테두리가 완전히 사라졌는지
2. 카드 위에 마우스를 올린 채 클릭했을 때도 축소되지 않는지
3. 640ms 전환 속도가 이전(700ms)보다 자연스러운지, 조금 더 느긋한 편이 좋은지

---

## v34 — Header 전체 비례 / Typography / Spacing 고도화

메뉴명 · 순서 · 로고 에셋 · 프로필 / 언어 / 다운로드 / 드롭다운 기능 · 인증 상태는 전부 그대로입니다.
바뀐 것은 **크기 · 비례 · 여백 · 타이포 위계 · 정렬 · 반응형** 뿐입니다.

### 00. 메인 내비게이션 → 1400 그리드 정중앙

§01 의 "CENTER / MAIN NAVIGATION" 대로, 그리고 첨부해 주신 Kakao · IMWEB 과 같은 구조로
`로고(좌) · 메뉴(정중앙) · 유틸리티(우)` 3열 그리드로 바꿨습니다.

```css
.header__inner{
  width:var(--container);                                   /* 1440 → 1400, 본문과 같은 축 */
  display:grid;
  grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);   /* 좌우 칸이 같은 폭 = 메뉴가 정중앙 */
  align-items:center;
  column-gap:clamp(20px,2vw,40px);
}
```

좌우 칸이 항상 같은 폭이라 **로고 폭과 유틸리티 폭이 달라도 메뉴 축이 흔들리지 않습니다.**
실측 중앙 편차: 1920 · 1600 · 1440 · 1280 · 1024 · 992 · 2200 · 2560 · 3840 **전부 ±0.01px**.

### 01. 1400 Grid 정렬 — 헤더가 본문보다 20px 밖으로 나가 있었습니다

헤더만 `--container-wide`(1440)를 쓰고 있어서, 로고와 다운로드 버튼이 본문 콘텐츠보다
좌우로 각각 20px 씩 바깥에 놓여 있었습니다. `--container`(1400)로 통일했습니다.

| 뷰포트 | 로고 좌측 ↔ 본문 좌측 | 유틸리티 우측 ↔ 본문 우측 |
|---|---|---|
| 3840 / 2560 / 2200 / 1920 / 1600 / 1440 / 1280 / 1200 / 1024 / 992 / 768 | **0.0px** | **0.0px** |
| 430 / 390 / 375 / 360 | 로고 좌측 = **20px** (본문 gutter 와 동일) | 햄버거 선 우측 = **20px** |

### 02. Header Height

```css
--header-h:clamp(64px, calc(60px + .833vw), 76px);
@media (min-width:2200px){ --header-h:80px }        /* 90px 을 넘기지 않습니다 */
@media (max-width:767px){  --header-h:64px }
@media (max-width:359px){  --header-h:60px }
```

| 뷰포트 | 이전 | 이후 |
|---|---|---|
| 3840 / 2560 | 96 | **80** |
| 1920 | 80 | **76** |
| 1600 | 73.6 | **73.3** |
| 1440 | 66.2 | **72** |
| 1280 | 60 | **70.7** |
| 1024 | 60 | **68.5** |
| 768 | 60 | **66.4** |
| 375 | 68 | **64** |

### 03. Logo — 높이가 아니라 "보이는 폭" 기준

원본 `logo-superplat.png` 는 366×132 이지만 **안에 투명 여백이 있습니다**(좌 15 · 우 12 · 상하 9px).
실제 잉크는 339×114 이라, 지정 폭의 **92.6%** 만 눈에 보입니다. 이걸 반영해 폭 기준으로 다시 잡았습니다.
원본 비율 · 에셋은 건드리지 않았습니다.

```css
.header__logo img{width:clamp(88px, calc(70.4px + 1.85vw), 106px);height:auto}
@media (max-width:767px){ .header__logo img{width:clamp(84px, 24.5vw, 96px)} }
```

| 뷰포트 | 지정 폭 | **보이는 폭** | 이전(보이는 폭) |
|---|---|---|---|
| 1920 | 106 | **98.1** | 94.2 |
| 1600 | 100 | 92.6 | 94.2 |
| 1440 | 97 | 89.9 | 70.7 |
| 1280 | 94.1 | 87.1 | 62.8 |
| 1024 | 89.3 | 82.8 | 50.3 |
| 768 | 88 | 81.5 | 37.7 |
| 430 | 96 | 88.9 | 82.6 |
| 375 | 91.9 | **85.1** | 82.6 |
| 360 | 88.2 | 81.7 | 79.3 |

1280 이하에서 로고가 급격히 작아지던 문제(1024 에서 50px)가 해결됐습니다.

### 04. Navigation — 15/16px · Medium · 40px gap

```css
.header__link{
  font-size:clamp(15px, calc(12px + .208vw), 16px);   /* 1920:16 · 1440~1024:15 */
  font-weight:500;                                    /* 600 → 500 (Medium) */
}
.header__nav{gap:clamp(30px, calc(6px + 1.77vw), 40px)}
```

| 뷰포트 | font-size | menu gap (이전) |
|---|---|---|
| 3840 / 2560 / 1920 | 16px | **40** (36) |
| 1600 | 15.3px | 34.3 (30.4) |
| 1440 | 15px | 31.5 (27.4) |
| 1280 | 15px | 30 (24.3) |
| 1024 | 15px | 30 (19.5) |

메뉴 간격은 세 곳 모두 **완전히 균일**합니다(1920 에서 39.9 / 39.9 / 39.9).

**Weight 를 500 으로 낮춘 대신** 사진 위에서 흰 글씨가 묻히지 않도록 아주 옅은 그림자만 더했습니다.
흰 배경(`.is-scrolled`)이나 드로어가 열린 상태(`.is-menu`)에서는 전혀 걸리지 않습니다.

```css
html:not(.is-menu) .header:not(.is-scrolled) .header__link{text-shadow:0 1px 8px rgba(0,0,0,.32)}
```

Hover 는 기존 그대로 `opacity .72` + 1px underline(220ms). Pill / Border / Scale / Sliding 없습니다.

### 05. 우측 유틸리티

| 항목 | 이전 | 이후 | 요청 |
|---|---|---|---|
| 아이콘 히트 영역 | 40×40 | **42×42** (모바일 44) | 40~44 |
| 아이콘 시각 크기 | 20 | **21** (모바일 22) | 20~22 |
| 프로필 아바타 (시각) | 36 | **34** (모바일 32) | 32~36 |
| 프로필 히트 영역 | 40 | **42** (모바일 44) | 40~44 |
| 유틸리티 간격 @1920 | 18 | **20 / 20** | 16~20 |
| Download 높이 @1920 | 44 | **42** | 40~42 |
| Download 좌우 padding | 22 | 22 | 18~22 |
| Download font | 16.9px / 600 | **15px / 600** | 14~15 / 600 |
| Download radius | pill | pill (= 21px) | 20~22 |

아바타가 Download CTA 보다 강해 보이지 않도록 시각 크기를 36 → 34 로 **낮췄습니다**(히트 영역은 오히려 키움).

### 06. 세로 중심축 (§12)

1920 기준 각 요소의 optical center Y — 소수점까지 동일합니다.

```
로고 37.98  ·  메뉴 37.99  ·  언어/프로필 아이콘 37.98  ·  Download 37.98
```

로고 PNG 는 상하 여백이 9px 로 대칭이라 별도 optical 보정이 필요 없었습니다(실측 확인).

### 07. Divider / Sticky (§13 · §14)

```css
.header:not(.is-scrolled){box-shadow:0 1px 0 rgba(255,255,255,.14)}   /* .22 → .14 */
.header.is-scrolled{
  background:rgba(255,255,255,.94);                                   /* .82 → .94 */
  backdrop-filter:saturate(180%) blur(14px);                          /* 18 → 14 */
  box-shadow:0 1px 0 rgba(0,0,0,.06);                                 /* 강한 회색 선 대신 */
}
```

Shadow 는 쓰지 않습니다. Glassmorphism 도 blur 14px 선에서 멈췄습니다.

### 08. Tablet (768~991) · Mobile

- **991px 이하** — 메뉴를 억지로 줄이지 않고 햄버거로 전환합니다(기존과 동일).
- **프로필을 남겼습니다** (§17). 이전에는 991 이하에서 프로필 아이콘까지 숨겨져 로고와 햄버거 둘뿐이었습니다.
  이제 우측은 **프로필 + 햄버거** 두 개이고, 언어 선택은 드로어 안(`.drawer__lang`)에서 그대로 제공합니다.
- 375 기준 실측: 헤더 64px · 로고 좌측 **20px** · 프로필 44×44 · 햄버거 44×44 ·
  햄버거 선 우측 끝 **20px** (본문 gutter 와 정확히 동일) · 두 아이콘의 시각 간격 23px.

### 09. Dropdown (§19)

새 스타일을 만들지 않았습니다. 언어 드롭다운은 기존 SuperPlat Dropdown System 토큰을 그대로 씁니다 — 실측:
`radius 14px · padding 7px · option height 42px · 아이콘 우측 정렬 편차 0 · 아이콘 아래 8px`.
프로필 드롭다운(`sp-auth.js`)도 같은 토큰을 계속 공유합니다.

### 10. QA

```
11 뷰포트  헤더 높이 · 로고 · 메뉴 · 간격 · 중심축 전부 실측 (표는 위)
정렬       1400 grid Δ 0.0px · 메뉴 중앙 편차 ±0.01px · 세로축 4개 요소 동일
페이지     index · world · news · support · auth · mypage 6개 모두 동일 값
기능       언어 드롭다운 · 프로필 드롭다운 · 드로어 열고 닫기 · 로그인 상태 아바타 — 정상
전체       12 뷰포트 × 6 페이지 · worstOverflow 0 · errors 0
```

### 확인 부탁드리는 것

1. 메뉴 정중앙 정렬이 의도하신 그림인지 (우측 유틸리티가 로고보다 무거워서 아주 살짝 왼쪽으로 보일 수 있습니다 — 원하시면 광학 보정으로 12~16px 오른쪽으로 밀 수 있습니다)
2. 내비게이션 Weight 500 이 사진 위에서 충분히 읽히는지 (600 으로 되돌리는 것도 한 줄입니다)
3. 1920 로고 보이는 폭 98px 이 적당한지, 조금 더 키울지

---

## v35 — Smart Header (Scroll Direction Interaction)

헤더 디자인 · 구조 · 로고 · 메뉴 · 프로필 · 언어 · Download CTA · 드롭다운 스타일은 그대로입니다.
**스크롤 방향에 따른 show / hide 인터랙션만** 추가했습니다.

### 00. 구현 위치 — 공통 모듈 한 곳

6개 페이지에 같은 스크립트를 복사하지 않고 **`assets/sp-ui.js` 한 곳**에 넣었습니다.
페이지마다 동작이 어긋날 일이 없고, 나중에 수치를 바꿀 때도 한 곳만 고치면 됩니다.

### 01. 상태 — TOP / SHOW / HIDE

`scrollY` 값을 그대로 비교하지 않고 **방향 + 누적 threshold** 로 판단합니다.

| 상태 | 조건 | 결과 |
|---|---|---|
| TOP | `y ≤ 80px` (입력 페이지는 240px) | 언제나 표시 |
| HIDE | 아래로 **누적 12px** 이동 (입력 페이지 72px) | `translateY(-100%)` |
| SHOW | 위로 **누적 8px** 이동 | `translateY(0)` |

```js
if (held() || y <= TOP_ZONE) { set(false); accDown = accUp = 0; return; }
if (dy > 0)      { accDown += dy; accUp = 0;   if (accDown > DOWN_T) set(true); }
else if (dy < 0) { accUp -= dy;   accDown = 0; if (accUp   > UP_T)   set(false); }
```

방향이 바뀌면 반대쪽 누적값을 0으로 리셋하기 때문에, 트랙패드가 ±6px 씩 떨려도 상태가 바뀌지 않습니다.
**실측: ±6px 을 14번 번갈아 흔들었을 때 상태 전환 0회** (1920 / 1440 / 1280 / 1024 / 768 전부).

### 02. 애니메이션

```css
.header{
  transform:translate3d(0,0,0);
  transition:… , transform 320ms var(--ease);   /* cubic-bezier(.16,1,.3,1) */
  will-change:transform;
}
html .header.is-hidden{transform:translate3d(0,-100%,0)}
@media (prefers-reduced-motion:reduce){ .header{transition-duration:1ms,1ms,1ms,1ms} }
```

숨는 동안 헤더 상단 y 좌표 실측 (1440, 40ms 간격):

```
0 → -37 → -60 → -66 → -70 → -71 → -72 → -72
```

overshoot 없이 감속만 하고 약 280ms 에 안착합니다. `display:none` 도 DOM 제거도 쓰지 않습니다.

⚠️ 인트로 전환(`.is-ready .header{transition:opacity 900ms}`)이 shorthand 라서 transform 전환을 덮어쓰고 있었습니다.
6개 페이지 전부 `transition:opacity 900ms …, transform 320ms …` 로 합쳐 두었습니다.

### 03. 절대 숨지 않는 경우 (§10 · §13 · §17)

```js
function held() {
  if (header.classList.contains('is-held')) return true;   /* SPHeader.hold(true) */
  if (root.classList.contains('is-menu')) return true;     /* 모바일 드로어 */
  if (활성 요소가 헤더 안 && :focus-visible) return true;    /* 키보드 내비게이션 */
  if (header.querySelector('[aria-expanded="true"]')) return true;
  if (document.querySelector(
      '.header__lang.is-open,.sp-menu.is-open,.spmenu.is-open,.spsel.is-open,.spscrim.is-open,.sp-scrim.is-open'
  )) return true;
  if (soft && 활성 요소가 input/textarea/select) return true;
  return false;
}
```

⚠️ 처음에는 "헤더 안에 포커스가 있으면 무조건 유지" 로 만들었는데, **마우스로 언어 버튼을 한 번 누르면
포커스가 헤더에 남아 그 뒤로 헤더가 영영 숨지 않았습니다**(실측). 그래서 `:focus-visible` 로 바꿔
**키보드 포커스일 때만** 붙잡습니다. 마우스 사용자는 드롭다운을 닫는 순간 정상 동작으로 돌아옵니다.

실측 결과:

| 상황 | 결과 |
|---|---|
| 언어 드롭다운 열고 아래로 스크롤 | 헤더 유지 ✔ |
| 마우스로 닫은 뒤 아래로 스크롤 | hide 재개 ✔ |
| Tab 으로 헤더에 포커스 후 아래로 스크롤 | 헤더 유지 ✔ |
| 모바일 햄버거 메뉴 열고 아래로 스크롤 | 헤더 유지 ✔ (430/390/375/360) |

### 04. 페이지 성격별 (§14)

`<body data-smart-header="soft">` — **auth · mypage · support** 세 페이지에 붙였습니다.

| | 마케팅 (index · world · news) | 입력 (auth · mypage · support) |
|---|---|---|
| 상단 안전 구간 | 80px | **240px** |
| 숨기기 threshold | 12px | **72px** |
| 입력 중(focus) | 일반 규칙 | **숨기지 않음** |

auth · mypage 는 전체 스크롤이 374px 라, 사실상 화면 대부분에서 헤더가 그대로 있습니다.

### 05. Space Carousel 충돌 (§09)

캐러셀 가로 드래그는 세로 스크롤 이벤트를 만들지 않으므로 헤더 상태가 바뀌지 않습니다.
**실측: 중앙 카드를 264px 가로로 드래그(세로 흔들림 ±1px 포함)해도 헤더 상태 변화 0.**

### 06. Layout Shift (§16)

헤더는 fixed 오버레이라 본문이 따라 움직이지 않습니다.

```
본문 요소의 문서상 위치   숨기기 전 4695.4  →  6번 show/hide 후 4695.4   (Δ 0.00px)
layout-shift 누적                                          0.0011  (헤더 기여분 0)
```

### 07. 재등장 시 배경 (§07)

`.is-scrolled` 상태 그대로입니다 — 실측 `rgba(255,255,255,.94)` · `blur(14px)` · `0 1px 0 rgba(0,0,0,.06)`.
Shadow 는 쓰지 않습니다. Hero 위에서 다시 나타날 때는 사진이 그대로 보이는 투명 상태를 유지합니다.

### 08. 성능 (§18)

- `scroll` 은 `{ passive:true }` + `requestAnimationFrame` 으로 **프레임당 1회**만 계산합니다.
- 계산은 `pageYOffset` 읽기 하나 + 산술 몇 줄 — 레이아웃을 강제로 재계산하지 않습니다.
- 상태가 실제로 바뀔 때만 `classList.toggle` 을 부릅니다.
- 스크롤 중이 아닐 때 열리는 드롭다운은 `focusin` / `pointerup` 에서만 한 번 더 확인합니다.

### 09. 외부에서 붙잡기

페이지 쪽에서 모달 같은 걸 띄울 때 쓸 수 있게 열어 두었습니다.

```js
SPHeader.show();          // 즉시 표시
SPHeader.hold(true);      // 닫을 때까지 계속 표시
SPHeader.isHidden();
```

### 10. QA — 6 페이지 × 데스크톱/모바일

```
index   1440 / 375   top show · down HIDE · up SHOW · back-to-top SHOW
world   1440 / 375   〃
news    1440 / 375   〃
support 1440 / 375   〃   (soft)
auth    1440 / 375   〃   (soft)
mypage  1440 / 375   〃   (soft)

flicker         ±6px 14회 → 상태 전환 0회 (1920·1440·1280·1024·768)
reduced motion  transition 1µs · show/hide 정상
전체            12 뷰포트 × 6 페이지 · worstOverflow 0 · errors 0
```

### 확인 부탁드리는 것

1. 숨기기 threshold 12px 이 적당한지 (조금 더 늦게 사라지길 원하시면 20~24px 로 올릴 수 있습니다)
2. 320ms 전환 속도
3. auth · mypage · support 를 "보수적 모드"로 묶은 기준이 맞는지 (news 는 마케팅 쪽으로 뒀습니다)

---

## v36 — My Page 전체 UI/UX 리디자인 (SuperPlat Account Center)

기능 · 데이터 · 화면 이동은 그대로 두고, **정보 구조 · 정렬 · 타이포 · 컨트롤 규격**을 다시 잡았습니다.

### 00. 가장 큰 문제 — 메뉴가 두 겹이었습니다

「캐시 내역」 안에 **보유 재화 / 이용 내역 / 정산 관리 / 구독 관리 / 결제 수단**이 가로 탭으로
한 번 더 들어 있었습니다. 왼쪽 내비게이션과 가로 탭이 같은 화면에서 경쟁했고,
사용자는 "구독을 바꾸려면 캐시 내역으로 들어가야 한다"는 걸 외워야 했습니다.

다섯 개를 전부 **좌측 내비게이션의 1depth 로 끌어올리고**, 가로 탭 바(`.mptabs`)를 없앴습니다.

```
마이페이지 │ 프로필
계정      │ 개인 및 약관 · 계정 관리
결제      │ 캐시 · 재화 · 구독 관리 · 결제수단 · 결제 · 환불 내역 · 정산 관리
```

§01 의 8개 항목과 정확히 일치합니다. 비어 있던 「수익 관리 · 콘텐츠 관리」 자리는
실제 화면이 있는 **정산 관리**가 대신합니다.

- 주소도 페이지마다 생겼습니다 — `#profile` `#terms` `#account` `#assets` `#sub` `#pay` `#ledger` `#payout`
- **예전 링크는 그대로 살아 있습니다** — `#cash` → 캐시 · 재화, `#cash/sub` → 구독 관리, `#cash/pay` → 결제수단 (실측 확인)
- ⚠️ **해시가 바뀌어도 화면이 안 바뀌던 버그**를 함께 잡았습니다. 예전에는 `hashchange` 처리가 없어서
  뒤로가기나 주소 직접 입력으로 `#sub` → `#pay` 를 해도 주소만 바뀌고 화면은 그대로였습니다(실측).
- 모바일 드롭다운도 같은 그룹으로 나옵니다 — sp-ui.js 의 공통 Dropdown 에 `<optgroup>` 캡션 지원을 추가했습니다.

### 01. 페이지 헤더 통일 (§04)

모든 화면이 `마이페이지(eyebrow) → 제목 → 설명` 한 구조로 시작합니다.
예전에는 제목이 **언제나 "마이페이지"** 였고 설명만 바뀌어서, 지금 어느 화면인지 제목이 알려주지 못했습니다.

하위 화면(정산 요청 · 환불 요청 · 카드 등록)에서는 설명을 비우고, 화면 안의 되돌아가기 버튼이 위치를 알려 줍니다.

### 02. 프로필 / 계정 관리 분리 (§09 · §18)

**비밀번호 변경을 프로필 → 계정 관리로 옮겼습니다.**
프로필은 "내가 보여지는 정보", 계정 관리는 "로그인 · 보안"입니다.
덕분에 프로필 화면에는 **저장 버튼이 정확히 하나만** 남았습니다.

```
프로필      프로필 사진 · 기본 정보 → [변경 내용 저장]  (Primary CTA 1개)
계정 관리   로그인 정보 · 비밀번호 · 회원 탈퇴(시각적으로 분리 + Danger Secondary)
```

### 03. 타이포그래피 (§24)

사이트 공통 토큰은 히어로 · 랜딩 기준이라 설정 화면에서는 컸습니다.
**공통 토큰은 건드리지 않고** `html.mypage` 안에서만 Consumer 설정 스케일을 따로 정의했습니다.

| 1920 기준 | 이전 | 이후 | 요청 |
|---|---|---|---|
| Page Title | 40px | **32px** | 28~32 |
| Section Title | 27px | **22px** | 20~22 |
| Label | 15px | **15px** | 14~15 |
| Input | 18px | **16px** | 15~16 |
| Body / Description | 18px | **16px** | 15~16 |
| Caption | 13px | **14px** | 13~14 |

375 기준은 24 / 19 / 14 / 15 / 15 / 13 으로, 375↔1920 사이를 선형으로 잇습니다.

### 04. 컨트롤 규격 (§06 · §07 · §08)

| | 이전 | 이후 | 요청 |
|---|---|---|---|
| Input · Select 높이 | 56px | **52px** | PC 48~52 |
| Input radius | 14px | **10px** | 8~10 |
| Button Large | 52px | **48px** | 44~48 |
| Button Medium | 48px | **44px** | 44~48 |
| Button radius | 12px | **10px** | 8~10 |
| 「변경 내용 저장」 폭 | 175px | **150px** | 120~160 |

⚠️ **768 에서 select 하나만 규격이 달랐습니다.** 공통 Dropdown(sp-ui.js)이 자기 토큰
(`--sp-fld-h:56px` · `--sp-fld-r:12px`)을 쓰고 있어서, 같은 줄의 input 은 52/10 인데
select 만 56/12 였습니다(실측). 마이페이지 안에서 두 토큰을 같은 값으로 맞췄습니다.

### 05. 정렬 실측 (§06 — 가장 중요)

8개 페이지 × 6개 뷰포트에서 **Label · Input · Helper · Section Title 의 x 좌표**를 전부 측정했습니다.
값은 콘텐츠 좌측 기준 상대 좌표입니다.

| 뷰포트 | Label X | Input X | Helper X | Section X | Input 높이 | radius |
|---|---|---|---|---|---|---|
| 1920 | 0 / 494 | 0 / 494 | 0 / 494 | 0 | 52 | 10px |
| 1440 | 0 / 490.8 | 0 / 490.8 | 0 / 490.8 | 0 | 52 | 10px |
| 1280 | 0 / 440.3 | 0 / 440.3 | 0 / 440.3 | 0 | 52 | 10px |
| 1024 | 0 / 323.5 | 0 / 323.5 | 0 / 323.5 | 0 | 52 | 10px |
| 768 | 0 / 361.3 | 0 / 361.3 | 0 / 361.3 | 0 | 52 | 10px |
| 375 | 0 | 0 | 0 | 0 | 52 | 10px |

**8개 페이지 전부 동일한 값**입니다. 1~3px 틀어진 곳은 없습니다.

### 06. 레이아웃 (§02)

| | 이전 | 이후 |
|---|---|---|
| Left Navigation | 240px | 240px (유지) |
| Nav ↔ Content | 1920:72 · 1440:63 · 1024:45 | **1920:80 · 1440:66 · 1280:61 · 1024:56** |
| Content max | 960px | 960px (목록 · 표 · 카드) |
| Form readable width | 680px | **760px** (§02 720~840) |
| 모바일 좌우 여백 | 20px | 20px — 430/390/375/360 전부 **정확히 20** |

### 07. 결제수단 (§16 · §17)

- 등록된 결제수단에 **[변경]** 을 추가했습니다. 새 수단을 등록하면 기본 결제수단이 옮겨가고,
  **기존 카드를 임의로 지우지 않습니다** (구독 결제에 물려 있을 수 있어서).
- 추가 진입점을 `+ 결제 카드 등록` → **`+ 결제수단 추가`** 로 바꾸고, 그 사이에 **결제수단 선택 화면**을 두었습니다.
- **Progressive Disclosure** — 처음에는 「신용 · 체크카드」만 보이고, 「다른 결제수단 보기」를 눌러야
  간편결제 · 계좌이체 · 휴대폰 결제가 펼쳐집니다.
- ⚠️ 실제로 동작하는 것은 카드 하나뿐이므로, 나머지는 **`준비 중` 배지 + 비활성 + 점선 테두리**로
  "지원이 확정되지 않았다"는 것을 그대로 씁니다. 지원한다고 단정하지 않습니다.
- 로고를 늘어놓지 않았습니다 — 실제 계약된 PG · 카드사가 없는데 로고를 깔면 사실이 아닌 화면이 됩니다.

### 08. 결제 · 환불 내역 표 (§12)

⚠️ 금액 셀이 「증감 / 잔액」 두 줄인데 desktop 에서는 한 줄로 흐르다 줄바꿈돼서
**행 높이가 들쭉날쭉했습니다**(실측). 셀을 세로 flex 로 고정하고 컬럼 폭을 108/132 로 조정했습니다.

```
행 높이   이전: 64 · 79 · 79 · 64 · 64 · 79   →   이후: 76 · 76 · 76 · 76 · 76 · 76
```

### 09. Full width 버튼 제거 (§08 · §22)

보유 재화 카드 안의 `정산 요청` 버튼이 카드 폭 전체를 차지하고 있었습니다.
내용 폭으로 바꾸고 좌측 정렬했습니다. 모바일에서도 저장 · 액션 버튼은 Full width 가 아닙니다
(모달 · 2버튼 확인 화면에서만 칸을 나눠 씁니다).

### 10. 그 밖에 고친 것

- **안내 배너 → 첫 섹션 여백이 사라져 있었습니다.** 가로 탭을 없애면서 Notice 가 본문 직속이 되었는데,
  여백 규칙이 `.mppane > .mpnotice` 에만 걸려 있었습니다. 두 경우 모두 잡았습니다.
- 「결제 수단 변경」(구독) · 「정산 요청」(캐시 · 재화) 같은 화면 간 이동에서
  **좌측 메뉴 선택 상태와 주소가 함께 따라갑니다.**

### 11. QA

```
정렬       8 페이지 × 6 뷰포트 · Label/Input/Helper/Section x좌표 전부 동일
컨트롤     Input 52 / radius 10 · Button 48·44 / radius 10 — 8 페이지 전부 동일
반응형     1920 1440 1280 1024 768 430 390 375 360 — overflow 0
모바일     좌우 여백 정확히 20px · 사이드바 → 그룹 드롭다운 · 버튼 48px
흐름       정산 요청 · 환불 · 구독 변경 · 결제수단 추가/변경 · 회원 탈퇴 4단계 — 정상
주소       #cash · #cash/sub · #cash/pay 예전 링크 호환 · hashchange 대응
전체       12 뷰포트 × 6 페이지 · worstOverflow 0 · errors 0
```

### 정책 데이터 원칙 (그대로 유지)

환산율 · 수수료율 · 세율 · 최소 정산액 · 정산 주기 · 지급일은 여전히 만들지 않았습니다.
카드는 `brand / last4`, 계좌는 `bank / holder / last4` 만 저장하고, 전체 번호는 어디에도 두지 않습니다.

### 확인 부탁드리는 것

1. 좌측 메뉴 그룹 이름(마이페이지 / 계정 / 결제)과 8개 항목 순서가 맞는지
2. 비밀번호 변경을 「계정 관리」로 옮긴 것이 의도와 맞는지 (프로필에 남기길 원하시면 되돌립니다)
3. 결제수단 추가에서 "간편결제 · 계좌이체 · 휴대폰 결제"를 **준비 중 비활성**으로 둔 처리 (지원 확정 시 바로 켜집니다)

---

## v37 — World 카드 라운드 통일 · Header 비례 확대 · 공간 배경 Dim +10%p

### 01. World & IP 카드 Corner Radius (요청 ①)

먼저 실측했습니다. **카드마다 라운드가 다르지는 않았습니다** — 16개 카드 전부 같은 값이었고,
문제는 **시안(24px)과 구현(12px)이 달랐던 것**입니다.

| | 이전 | 이후 |
|---|---|---|
| PC (1920 · 1600 · 1440 · 1280 · 1024 · 768) | 12px | **24px** |
| Mobile (430 · 390 · 375 · 360) | 16px | 16px (유지) |
| 16개 카드 값 종류 | 1가지 | **1가지** |

**토큰으로 옮겼습니다** (§10). 카드마다 `border-radius` 를 반복해서 쓰지 않습니다.

```css
:root{ --radius-card:24px }
@media (max-width:767px){ :root{ --radius-card:16px } }

.wcard__shell{
  --wr:var(--radius-card);
  border-radius:var(--wr);
  overflow:hidden;      /* 프레임이 클리핑의 최종 기준 (§07) */
}
.wcard__clip{ border-radius:var(--wr) var(--wr) 0 0; overflow:hidden }
```

- 6개 페이지 전부에 토큰을 넣어 두었습니다 — 같은 카드 컴포넌트를 다른 페이지에서 쓸 때 그대로 재사용됩니다.
- ⚠️ 예전에는 카드 프레임(`.wcard__shell`)이 `overflow:visible` 이었습니다. 그림자를 쓰지 않으므로
  `overflow:hidden` 으로 바꿔, hover 확대 중에도 이미지가 둥근 모서리 밖으로 새지 않게 했습니다.

**Hover 중 실측 (1920, 40ms 간격)**

| | +40ms | +140 | +300 | +520 | +700 |
|---|---|---|---|---|---|
| 카드 radius | 24px | 24px | 24px | 24px | **24px** |
| 상단 이미지 radius | 24px | 24px | 24px | 24px | **24px** |
| 카드 scale | 1.011 | 1.027 | 1.030 | 1.030 | 1.030 |
| 이미지가 프레임 밖으로 나간 양 | −0.76 | −2.19 | −2.48 | −2.57 | −2.59px |

전 구간 24px 고정이고, 이미지는 항상 프레임을 덮습니다(음수 = 빈 틈 없음).
누른 상태 · 탭 필터(전체 / 월드 / IP캐릭터) 재렌더 후에도 전부 24px 입니다.

### 02. Header — SHIFT UP 기준 비례 확대 (요청 ②)

로고를 브랜드 앵커로 키우고, 내비게이션 · 유틸리티는 한 단계 낮게 유지했습니다.
메뉴명 · Profile · Language · Download · Dropdown 기능은 그대로입니다.

| 뷰포트 | Header 높이 | 로고 **보이는 폭** | Nav | Menu Gap |
|---|---|---|---|---|
| **1920** | 76 → **80** | 98.1 → **113.9** | 16 / 500 → **15.5 / 600** | 40 → **44** |
| 1600 | 73 → **76** | 92.6 → **107.7** | 15.0 / 600 | 34 → **37.3** |
| 1440 | 72 → **74** | 89.9 → **104.6** | 14.7 / 600 | 31.5 → **34** |
| 1280 | 70.7 → **72** | 87.1 → **101.6** | 14.5 / 600 | 30 → **30.7** |
| 1024 | 68.5 → **68.8** | 82.8 → **96.6** | 14.1 / 600 | 30 → **28** |
| 768 | 66.4 → **66** | 81.5 → **91.7** | — | — |
| 430 | 64 → **66** | 88.9 → **100** | — | — |
| **375** | 64 → **66** | 85.1 → **93.8** | — | — |
| 360 | 64 → **66** | 81.7 → **90.8** | — | — |

요청값(1920 로고 108~120 · 헤더 76~84 · Nav 15~16 · Gap 40~48,
1440 로고 102~110 · 헤더 74~78, 1280 로고 96~104,
모바일 헤더 64~68 · 로고 92~100) 안에 전부 들어갑니다.

- 로고 원본 비율은 그대로입니다. 지정 폭 × 0.926 = 보이는 폭입니다(투명 여백 좌 15 · 우 12px).
- Navigation weight 를 500 → **600** 으로 올렸습니다(§03 · §19). 대신 사진 위 가독성용 그림자는
  한 단계 옅게(.32 → .26) 줄였습니다.
- 우측 유틸리티는 **키우지 않았습니다**(§04 · §08) — 아이콘 21 / 히트 42, 프로필 34, Download 42px · 15px / 600.
- 세로 중심축은 로고 · 메뉴 · 아이콘 · CTA 전부 동일합니다.

**좌우 균형 (§07 · §21)**

1920 기준 좌측 그룹(로고) **123px** · 우측 그룹(언어 + 프로필 + CTA) **219px** 입니다.
메뉴는 1400 그리드 **정중앙**(편차 ±0.01px)에 그대로 두었습니다 — 첨부해 주신 SHIFT UP 도,
앞서 선택하신 Kakao · IMWEB 도 모두 기하학적 중앙입니다. 로고가 커지면서 좌우 무게 차이는
96px(이전 113px)로 줄었습니다.

**Smart Header 재검증 (§12 · §13)**

```
translateY   1920:-80  1440:-74  1280:-72  1024:-68.8  768:-66   (헤더 높이와 정확히 일치)
transition   320ms · cubic-bezier(.16,1,.3,1)
hide 프레임   0 → -53 → -67 → -76 → -78 → -80   (overshoot 없이 약 280ms 안착)
flicker      ±6px 14회 → 상태 전환 0회
```

### 03. 공간 섹션 Background Dim +10%p (요청 ③)

이미지 자체의 brightness 는 건드리지 않고, 배경 위 **Black Overlay 의 opacity 만** 올렸습니다.

```js
wov = Math.min(.60, wov + .10);   // 밝기 자동 보정은 그대로 두고 전체를 한 단계 아래로
```

| 공간 | 이전 | 이후 |
|---|---|---|
| SuperTown (1920 · 1440 · 768) | 0.201 | **0.301** |
| My Gallery (1920 · 1440 · 768) | 0.334 | **0.434** |
| SuperTown (375) | 0.261 | **0.361** |
| My Gallery (375) | 0.394 | **0.494** |
| CSS 기본값 | .12 / 모바일 .17 | **.22 / .27** |

- **썸네일 명도 규칙은 그대로입니다** — Active 0% · 인접 20% · 바깥 40%(모바일 38%). 실측으로 확인했습니다.
- 배경 crossfade 중 opacity 를 프레임 단위로 측정했습니다 — `0.300 → 0.376 → 0.424 → 0.435` 로
  **단조 증가**만 하고, 밝아지거나 깜빡이는 구간이 없습니다.
- 공간마다 사진 밝기가 크게 달라서(상단 밴드 평균 65~172) 기존의 **밝기 자동 보정은 유지**했습니다.
  고정값 하나로 바꾸면 밝은 공간에서 흰 글씨가 묻힙니다. 전체를 일괄로 10%p 내리는 방식입니다.

### 04. QA

```
World 카드   7 뷰포트 × 16장 — radius 값 종류 1가지 · hover/press/필터 재렌더 중 변화 0
Header      10 뷰포트 — 높이 · 로고 · Nav · Gap 전부 요청 범위 안 · 중앙 편차 ±0.01px
Smart Header 5 뷰포트 — hide/show/flicker 정상 · translateY = 헤더 높이
배경 Dim     4 뷰포트 — +0.10 정확히 반영 · 썸네일 DIM 0/.2/.4 유지 · 전환 중 깜빡임 없음
Space 카드   클릭 6회 — 흰 테두리 0건 · 최종 크기 고정 (v33 상태 유지)
전체        12 뷰포트 × 6 페이지 · worstOverflow 0 · errors 0
```

### 확인 부탁드리는 것

1. 1920 로고 보이는 폭 **113.9px** 이 적당한지 (더 키우려면 120까지 여유가 있습니다)
2. Navigation weight 600 이 사진 위에서 너무 무겁지 않은지
3. 메뉴를 1400 그리드 정중앙에 그대로 둔 것 — 우측이 96px 무거워서 아주 살짝 왼쪽으로 보인다면
   16~24px 광학 보정을 넣을 수 있습니다

### 05. 기본 프로필 아이콘 (요청 ④)

원형 배경 크기 · 색상 · 아이콘 형태 · 색은 그대로 두고, 사람 아이콘만 조정했습니다.

⚠️ 예전에는 머리 + 몸통 그룹의 bbox 중심이 y=56 이라 원형 중심(48)보다 **8px 아래**에 있었고,
몸통 아래 모서리가 원형 마스크에 잘리고 있었습니다(꼭짓점이 중심에서 50px, 반지름 48px).

```svg
<g transform="translate(7.68 -0.54) scale(0.84)" fill="#FFFFFF" opacity=".92"> … </g>
```

렌더 실측 (프로필 원 112px 기준)

| | 이전 | 이후 |
|---|---|---|
| 사람 아이콘 크기 | 70 × 75 | **58 × 62** (이전 대비 82.9%) |
| 원 대비 폭 | 62.5% | **51.8%** |
| 좌 / 우 여백 | 21 / 21 | **27 / 27** (완전 대칭) |
| 상 / 하 여백 | 15 / 9(잘림) | **23 / 27** |
| 원형 마스크 잘림 | 있음 | **없음** |

상단 23 / 하단 27 은 의도한 값입니다 — 어깨 쪽 면적이 무거워서 기하학적 중심보다 1.5px 올린
optical alignment 입니다. 머리 + 몸통을 하나의 `<g>` 로 묶어 한 번에 변환하므로 PC / 태블릿 /
모바일에서 프로필 크기가 달라져도 **원 대비 비율은 항상 동일**합니다.

> 요청서의 "Person icon width 38~42% of circle"(§5)과 "현재 대비 82~85% 축소"(§2)가 서로 다른
> 값이라, 명시적으로 숫자를 주신 **§2(82~85%)** 를 따랐습니다. 결과는 원 대비 51.8% 입니다.
> 38~42% 까지 더 줄이려면 scale 을 0.84 → 0.64 로 낮추면 됩니다.

### 06. 로그인 페이지 상단 로고 제거 (요청 ⑤)

`display:none` 이 아니라 **요소 자체를 만들지 않도록** 했습니다(`Head()` 의 logo 분기 · `.ahead__logo` CSS 삭제).
빈 자리가 남지 않고, 브랜드는 상단 고정 헤더의 로고가 이미 보여 줍니다.

로고가 빠진 만큼 세로 리듬을 다시 잡았습니다.

```css
.asec{
  padding-block:calc(var(--header-h) + clamp(32px,3.1vw,60px)) clamp(64px,5.6vw,110px);
  min-height:calc(100svh - var(--header-h));
  display:flex;flex-direction:column;justify-content:center;   /* 남는 공간에서 광학 중앙 */
}
```

| 뷰포트 | 헤더 아래 ~ 타이틀 | 타이틀 → 설명 | 설명 → 폼 |
|---|---|---|---|
| 1920 | 59.5 | 15.9 | 49.9 |
| 1440 | 44.6 | 11.9 | 37.4 |
| 1280 | 39.7 | 10.6 | 33.3 |
| 768 | 52.6 | 10 | 28 |
| 375 / 360 | 36 | 10 | 28 |

입력창 폭(1920 · 1440 기준 460px) · 버튼 · 체크박스 · 회원가입 링크 · 데모 카드는 그대로입니다.
회원가입 · 비밀번호 찾기 화면은 원래 로고가 없었고, 같은 세로 리듬을 공유합니다.

---

## v38 — 뉴스 이전·다음글 / 검색 기능 / Back to Top / Header Shadow / DIM 2차 / 탈퇴 영역 / 결제수단 간격

### 01. 뉴스 상세 — 이전글 / 다음글 (레퍼런스 구조로 재구성)

텍스트만 있던 좌우 2열을 **[라벨] + [썸네일 + 카테고리 + 제목 + 날짜] 카드** 구조로 바꿨습니다.
중앙 divider 는 제거하고, 두 카드가 각자 완결된 프레임을 갖도록 했습니다.

**실측 — 좌우 대칭 (값이 1가지면 좌 = 우)**

| 뷰포트 | 칸 폭 | 카드 폭 | 카드 높이 | padding | radius | 썸네일 | 라벨 Y | 날짜 Y | 목록 버튼 중앙 편차 |
|---|---|---|---|---|---|---|---|---|---|
| 1920 | 686 | 686 | 280 | 40px | 16px | 299.5×168.5 | 1개 | 1개 | **0.00** |
| 1440 | 642.7 | 642.7 | 210.2 | 30.24 | 16px | 224.6×126.3 | 1개 | 1개 | −0.01 |
| 1280 | 570.4 | 570.4 | 186.9 | 26.88 | 16px | 199.7×112.3 | 1개 | 1개 | −0.01 |
| 1024 | 454.8 | 454.8 | 180 | 21.5 | 16px | 180×101.3 | 1개 | 1개 | 0.00 |
| 768 | 345.3 | 345.3 | 180 | 20 | 16px | 180×101.3 | 1개 | 1개 | 0.00 |
| 430 / 390 / 375 / 360 | 100% | 100% | 148.7 | 16 | 16px | 카드 폭 비례 | 세로 스택 | 세로 스택 | −0.01 |

- 제목은 2줄 clamp + `min-height:2줄` 이라 **한쪽이 1줄이어도 날짜 baseline 이 어긋나지 않습니다**.
- 이전글/다음글이 없을 때도 같은 프레임의 빈 카드를 만들어 폭 · padding · radius 를 유지합니다.
- Hover 는 좌우 동일 — 배경 tint + 썸네일 1.03. 카드 전체가 클릭 영역입니다.
- 「목록으로」는 목록의 「더보기」와 같은 컴포넌트지만 보조 액션이라 44~48px 로 따로 잡았습니다
  (1920 에서 65px 까지 커지던 문제).

### 02. 검색 — 트리거 → 입력창 (뉴스 · 고객지원)

기본은 「🔍 검색하기」 버튼 하나만, 누르면 같은 자리에서 입력창으로 넓어집니다.

```
닫힘  [ 🔍 검색하기 ]            152px
  ↓ click (width + opacity · 240ms · cubic-bezier(.22,1,.36,1))
열림  [ 🔍  검색어를 입력해주세요.        × ]   360px
```

| 뷰포트 | 닫힘 | 열림 |
|---|---|---|
| 1920 | 152 | **360** |
| 1440 | 137 | 360 |
| 768 | 136 | 280 |
| 375 / 390 / 430 | 100% (335) | 100% (335) |

동작 실측 (뉴스 · 고객지원 · 4 뷰포트 전부 동일)

```
클릭        입력창 확장 + 자동 focus ✔
"이용" Enter  결과 3건으로 필터 ✔ (입력 중에도 실시간 필터 유지)
없는 검색어   「검색 결과가 없습니다.」 Empty State ✔
× 1차        검색어 삭제 → 전체 10건 복원 → 입력창 유지 + focus ✔
× 2차        입력창 닫힘 → 「검색하기」 복귀 ✔
ESC          같은 규칙 ✔
```

- `type="search"` · `aria-label` · `aria-expanded` · Enter · 돋보기 클릭 · focus-visible 모두 지원합니다.
- ⚠️ 트리거와 입력창을 같은 프레임 안에 겹쳐 두고 wrap 의 width 만 바꾸므로 **주변 레이아웃이 밀리지 않습니다**.
- 카테고리 탭 · 리스트 · 페이지네이션 · 상세 · 헤더 · 푸터는 그대로입니다.

### 03. Back to Top

`assets/sp-ui.js` 한 곳에 넣어 6개 페이지가 함께 씁니다.

| | Desktop | Tablet(≤1023) | Mobile(≤767) |
|---|---|---|---|
| 크기 | 48×48 | 46×46 | 44×44 |
| 위치 | right 32 / bottom 32 | 24 / 24 | 20 / 20 (+ safe-area) |
| backdrop-filter | blur(10px) | blur(10px) | **없음** (저사양 스크롤 프레임 보호) |

- `scrollY > 480` 에서만 나타납니다 — `opacity 0→1` + `translateY(8px)→0` · 260ms · `cubic-bezier(.22,1,.36,1)`,
  숨김 상태는 `pointer-events:none`. display 토글이 아닙니다.
- 반투명 흰 배경 + 1px 테두리 + 아주 옅은 그림자만. TOP 텍스트 · glow · 큰 확대 없음. 아이콘 21px.
- Hover `translateY(-2px)` / Pressed `scale(.96)` / focus-visible 아웃라인.
- 클릭 → 네이티브 `scrollTo({behavior:'smooth'})`, `prefers-reduced-motion` 에서는 즉시 이동.
- 8 뷰포트 실측: 최상단 숨김 ✔ · 스크롤 후 노출 ✔ · 복귀 시 숨김 ✔ · 클릭 후 scrollY 0 ✔

### 04. Header Text Shadow 완전 제거

v34 에서 Weight 를 낮추며 넣었던 그림자를 전부 걷어냈습니다. 가독성은 Weight 600 · 흰색 ·
스크롤 후 흰 배경 대비로만 확보합니다.

```css
.header,.header *{text-shadow:none}
.header__link, .header__icon svg, .header__burger span, .btn-download, .sp-av__btn … {text-shadow:none;filter:none}
```

실측 — index / news / world / mypage × 1920 · 375 × (기본 · hover · 스크롤 후) **전부 0건**.
로고의 반전 필터(색 처리)는 그대로 유지했습니다.

### 05. 공간 섹션 DIM 2차 조정

| | 1차 전 | 1차 후 | **2차 후** |
|---|---|---|---|
| 배경 (SuperTown @1920) | 0.201 | 0.301 | **0.401** |
| 배경 (My Gallery @1920) | 0.334 | 0.434 | **0.534** |
| 배경 (SuperTown @375) | 0.261 | 0.361 | **0.461** |
| 인접 썸네일 | .20 | .20 | **.30** |
| 바깥 썸네일 | .40 | .40 | .40 (모바일 .38 유지) |
| 중앙 Active | 0 | 0 | **0** |

`40% → 30% → 0% → 30% → 40%` 계층이 실측으로 확인됩니다.
배경과 썸네일은 완전히 별개 레이어이고, Dim 레이어를 새로 겹치지 않고 기존 overlay 값만 올렸습니다.
전환 중 opacity 는 `0.400 → 0.475 → 0.514 → 0.533` 로 단조 증가 — 깜빡임 없음.

### 06. 회원 탈퇴 영역 — Danger Zone → Neutral Settings Row

붉은 카드를 없애고 위 「로그인 정보」와 **같은 Row + Divider 설정 UI** 로 맞췄습니다.

```
회원 탈퇴
─────────────────────────────────────────────────────────
계정 삭제      계정과 관련된 데이터 및 서비스 이용 정보를…      [회원 탈퇴]
─────────────────────────────────────────────────────────
```

| | 이전 | 이후 |
|---|---|---|
| 배경 | `var(--err-bg)` 분홍 | **transparent** |
| 테두리 | 1px 붉은 테두리 + radius 14 | **로그인 정보와 같은 상·하 1px divider** |
| 제목 | 「슈퍼플랫 계정을 삭제합니다」 (Red) | **「계정 삭제」 (기본 텍스트색)** |
| 라벨 열 폭 | — | **180px — 로그인 정보와 동일** |
| 버튼 | Danger 테두리 · 붉은 텍스트 | **중립 (hover/focus 에서만 Red)** · 40px / radius 10 |
| 화면 내 Red 배경 요소 | 1개 | **0개** (실측) |

Red 3단계 위계: 설정 화면 **중립** → 버튼 hover **은은한 danger** → 최종 확인 다이얼로그 **명확한 danger**.
회원 탈퇴 4단계 플로우와 최종 확인의 Red 버튼은 그대로입니다.

### 07. 등록된 결제수단 — 정보 간격

```
[카드]   신한카드  [기본 결제수단]
  20px        8px
         **** **** **** 1234
              ↑ 8px
```

margin 이 아니라 **flex gap** 으로 고정했습니다(§1). 실측 — 1920 / 1440 / 768 / 375 전부:
카드명↔배지 **8px**, 이름Row↔번호 **8px**, 아이콘↔텍스트 **20px**,
카드명·카드번호 시작 X **완전 일치**, 아이콘 세로 중앙 편차 **0**.
배지는 28px / 14px / 600 으로 카드명보다 약하게. 카드 컨테이너 · radius · 버튼은 그대로입니다.

⚠️ 좁은 화면에서 카드 아이콘이 텍스트와 분리되어 위로 올라가던 것도 함께 고쳤습니다(375 에서도 한 줄 유지).

### 08. QA

```
이전·다음글   9 뷰포트 — 좌우 폭·높이·padding·radius·썸네일·라벨Y·날짜Y 전부 1가지 값
검색         뉴스·고객지원 × 4 뷰포트 — 열기/포커스/Enter/빈결과/×1/×2 전부 정상
Back to Top  8 뷰포트 — 노출 임계 · 위치 · 크기 · 클릭 정상
Header       4 페이지 × 2 뷰포트 × 3 상태 — text-shadow 0건
공간 DIM     4 뷰포트 — 40/30/0/30/40 · 전환 중 깜빡임 없음
탈퇴 영역     1920 · 375 — Red 배경 0 · 라벨 X 로그인 정보와 일치
결제수단      4 뷰포트 — 8 / 8 / 20px 고정
전체         12 뷰포트 × 6 페이지 · worstOverflow 0 · errors 0
```

### 다음 작업 (아직 안 한 것)

**Toss-inspired Scroll Motion Refinement** 요청은 범위가 커서 이번 전달에 포함하지 않았습니다.
현재 히어로의 sticky scroll progress · 섹션 진입 애니메이션 · 배경 crossfade 는 이미
같은 방향(rAF · transform/opacity 중심 · overshoot 없음)으로 만들어져 있어서,
남은 것은 **텍스트 blur+fade cross-fade 구간 통일 · stagger 정리 · 모바일 강도 축소**입니다.
다음 차례로 진행하겠습니다.

---

## v39 — My Page Section Spacing 통일

「정산 내역」 제목과 표 헤더가 붙어 보이던 문제를 **정산 내역만 고치지 않고 마이페이지 전체의
Section 간격 규칙**으로 다시 잡았습니다. 기능 · 데이터 · 컬럼 구성은 그대로입니다.

### 01. 두 개의 값만 바꿨습니다

```css
/* Major Section Gap */
.mpcard + .mpcard{margin-top:clamp(96px, calc(72px + 2.5vw), 120px)}
@media (max-width:767px){ .mpcard + .mpcard{margin-top:clamp(64px, 20vw, 80px)} }

/* Section Title(+설명) → Content */
.mpcard__body{margin-top:clamp(40px, calc(32px + .83vw), 48px)}
@media (max-width:767px){ .mpcard__body{margin-top:clamp(28px, 8vw, 32px)} }
```

### 02. 실측 — 8개 페이지가 전부 같은 값

`프로필 · 개인 및 약관 · 계정 관리 · 캐시 · 재화 · 구독 관리 · 결제수단 · 결제 · 환불 내역 · 정산 관리`
전부에서 값이 **한 가지**로 나옵니다(= 페이지마다 다른 여백을 쓰지 않습니다).

| 뷰포트 | Section Gap (이전) | Section Title → Content (이전) | 요청 범위 |
|---|---|---|---|
| **1920** | **120** (88) | **47.9** (32) | 96~120 / 40~48 |
| 1440 | 108 (88) | 43.9 (32) | 〃 |
| 1280 | 104 (79) | 42.6 (28) | 〃 |
| 1024 | 97.6 (63) | 40.5 (22.5) | 〃 |
| 768 | 96 (56) | 40 (24) | 〃 |
| **430** | **80** (64) | **32** (24) | 64~80 / 28~32 |
| 375 | 75 (56) | 30 (24) | 〃 |
| 360 | 72 (54) | 29 (24) | 〃 |

### 03. 표 헤더 내부 여백 (§3)

```css
.mprow--head{min-height:0;padding-block:18px;align-items:center}
@media (max-width:767px){ .mprow--head{padding-block:14px} }
```

예전에는 `min-height:44px + padding 0` 이라 위아래 divider 와 글자가 붙어 있었습니다.
이제 상하 **18px**(모바일 14px)씩 확보되고, 컬럼은 `align-items:center` 로 세로 중앙에 정렬됩니다.
제목과 표 헤더 사이에 별도 divider 는 추가하지 않았습니다.

### 04. 정산 내역 실측 (1920)

```
[정산 받을 계좌 카드]
        ↓  120px      (Major Section Gap)
정산 내역
        ↓  48.9px     (Section Title → Content)
────────────────────────────────────────
신청일  재화  신청 수량  정산 금액  상태  지급일     ← 상하 18px
────────────────────────────────────────
[Empty State]
```

모바일(375): 섹션 간격 **75px** · 제목 → 내용 **30px** — 같은 규칙을 축소해서 적용합니다.

### 05. QA

```
간격 규칙   8 페이지 × 8 뷰포트 — Section Gap · Title→Content 값이 각 뷰포트마다 1가지
표 헤더     상하 18px(모바일 14px) · 컬럼 세로 중앙 정렬
Empty State 기존 디자인 유지 · 표 헤더 아래 자연스럽게 이어짐
전체        12 뷰포트 × 6 페이지 · worstOverflow 0 · errors 0
```

### 알려드릴 점

1024 에서 정산 내역 표는 7개 컬럼이 631px 안에 들어가면서 헤더가 두 줄로 접힙니다(81px).
이번 요청 범위(간격)를 넘는 부분이라 손대지 않았습니다 — 필요하시면 1024 이하에서
「신청 수량 / 정산 금액」을 한 칸으로 합치거나 가로 스크롤로 바꿀 수 있습니다.

---

## v40 — 모바일 NEWS / DOWNLOAD 디테일 · 드라이버 카드 리소스 교체

### 01. 검색 아이콘 중복 — 원인 제거

⚠️ **공통 Dropdown 모듈이 원인이었습니다.** `assets/sp-ui.js` 는 `input[type="search"]` 를 자동으로
자체 검색 컴포넌트로 업그레이드하면서 자기 아이콘(`.spsearch__ico`)을 하나 더 그립니다.
v38 에서 만든 「검색하기」 트리거에도 아이콘이 있어서 **두 개가 겹쳐 보였습니다**(실측 확인).

opacity 로 가리지 않고, sp-ui 가 이미 갖고 있던 opt-out 속성으로 업그레이드 자체를 막았습니다.

```html
<input class="nsearch" id="nQuery" type="search" data-sp-skip aria-label="뉴스 검색" …>
```

실측 — 375 에서 검색 영역의 보이는 아이콘 **1개**(트리거), 나머지는 열렸을 때만 노출됩니다.
뉴스 · 고객지원 두 페이지 모두 적용했습니다.

### 02. 모바일 게시글 제목 강화

| | 이전 | 이후 |
|---|---|---|
| 제목 크기 | 15~16px | **18~20px** (430:20 · 375:18.75 · 360:18) |
| 제목 weight | 700 | 700 |
| 제목 색 | `var(--ink)` | `var(--ink)` = **rgb(25,31,40)** |
| 제목 줄 수 | 무제한 | **2줄 clamp** (카드 높이 편차 방지) |
| Meta 크기 | 15px | **13~14px** |
| Meta 색 | `--body` (진함) | **`--body-2nd`** (중립 회색) |
| 제목 → Meta | 8px | **16px** |
| 행 padding | 15/16 | **18/20** · row 전체가 터치 영역 |

제목과 Meta 의 크기 · 색 대비가 벌어져서 위계가 분명해집니다.

### 03. PC 버전 드라이버 카드 — 리소스 교체 + 컴포넌트 통일

첨부해 주신 **AMD Radeon 카드 시안을 기준**으로 네 카드를 같은 컴포넌트로 다시 만들었습니다.
로고는 첨부해 주신 원본 PNG 그대로입니다(투명 배경 유지 · 재생성 · 크롭 · 비율 변경 없음).

```
assets/drv-amd.png     239×190
assets/drv-intel.png   208×198
assets/drv-nvidia.png  208×198
assets/drv-directx.png 208×198
```

⚠️ 예전에는 `.drv__logo{object-fit:cover}` 라서 **로고가 잘리고 있었습니다**(AMD 배지 아랫부분).
`contain` + flex 중앙 정렬로 바꿨습니다.

```css
.drv{display:flex;flex-direction:column;border-radius:16px;overflow:hidden;background:#fff;
     border:1px solid rgba(23,26,33,.10)}
.drv__media{display:flex;align-items:center;justify-content:center;aspect-ratio:332/250;background:#F3F3F3}
.drv__logo{width:52%;max-height:64%;height:auto;object-fit:contain;object-position:center}
.drv__btn{margin-top:16px;width:100%;height:48px;border-radius:10px}
```

**실측 — 9 뷰포트 × 4 카드 (값이 1가지면 네 카드가 완전히 동일)**

| 뷰포트 | 카드 폭 | 카드 높이 | radius | 로고 영역 높이 | 로고 중앙 편차 | 이름 Y | 버튼 Y | 버튼 높이 | 카드 gap |
|---|---|---|---|---|---|---|---|---|---|
| 1920 | 329 | 378.6 | 16px | 246.2 | **Δx 0.0 / Δy 0.0** | 267.2 | 309.6 | 48 | 28 |
| 1440 | 311.3 | 363.6 | 16px | 232.9 | 0.0 / 0.0 | 253.9 | 294.6 | 48 | 22 |
| 1280 | 276.3 | 337.3 | 16px | 206.5 | 0.0 / 0.0 | 227.5 | 268.3 | 48 | 19 |
| 1024 | 219.8 | 294.7 | 16px | 164 | 0.0 / 0.0 | 185 | 225.7 | 48 | 16 |
| 768 | 337.8 | 383.6 | 16px | 252.8 | 0.0 / 0.0 | 273.8 | 314.6 | 48 | 16 |
| 430 / 390 / 375 / 360 | 100% | 동일 | 16px | 동일 | 0.0 / 0.0 | 동일 | 동일 | 48 | **16** |

- 네 로고 모두 **가로·세로 정중앙**(편차 0.0px), `object-fit:contain` 이라 잘림 없음.
- 로고 잉크 폭이 캔버스의 64~74% 로 비슷해서, 같은 `width:52%` 를 주면 **솔리드한 AMD 배지가
  자연스럽게 조금 작게** 보여 네 브랜드의 시각적 무게가 맞습니다(원본 비율은 그대로).
- Hover 는 `translateY(-2px)` + border 만. 확대 · 그림자 없음. 모바일은 `:active`.
- 640px 이하에서 1-column, gap 16px.

### 04. QA

```
검색 아이콘   375 — 보이는 아이콘 1개 (뉴스 · 고객지원)
뉴스 제목     430/390/375/360 — 18~20px · 700 · near-black · Meta 13~14 회색
드라이버 카드  9 뷰포트 × 4장 — 폭·높이·radius·로고영역·이름Y·버튼Y·버튼높이 전부 1가지 값
로고 정렬     4개 전부 Δx 0.0 / Δy 0.0 · contain · 잘림 없음
전체         12 뷰포트 × 6 페이지 · worstOverflow 0 · errors 0
```

### 아직 남은 것

이번 전달에는 **명확히 지적해 주신 버그와 카드 컴포넌트**를 먼저 처리했습니다.
아래 두 가지는 범위가 커서 다음 차례로 진행하겠습니다.

1. **모바일 전역 QA** — 20px 좌우 기준선 · spacing 토큰 · 타이포 위계를 6개 페이지 전체에서 통일
2. **Toss-inspired Scroll Motion** — 텍스트 blur+fade 교차 구간 통일 · stagger 정리 · 모바일 강도 축소

---

## v41 — 커뮤니티 섹션 문구·모션 · 다운로드 카드 Hover

### 01. "같은 공간에, 다른 사람들이 있습니다."

문구를 쉼표 · 마침표까지 반영하고, **데스크톱에서도 두 줄**로 고정했습니다
(예전에는 한 줄로 이어졌습니다). 영문도 같은 구조로 맞췄습니다.

| 뷰포트 | 제목 크기 | 줄 수 | 제목 → 카드 |
|---|---|---|---|
| 1920 | **56px** / 700 | 2 | **79.9px** |
| 1440 | 48px | 2 | 67.4 |
| 1280 | 45.3px | 2 | 63.3 |
| 768 | 36.8px | 2 | 50 |
| 430 / 375 / 360 | **33px** | 2 | 41.2 / 40 / 40 |

요청 범위(Desktop 48~56 · Mobile 30~36 · 제목→카드 Desktop 64~80 / Mobile 40~56) 안입니다.
카드 아래 → 다음 섹션은 Desktop 180px(기존 토큰), Mobile은 96~120px로 따로 잡았습니다.

### 02. Blur + Fade 헤드라인 (재사용 가능한 변형)

⚠️ 기존 `.r-line` 은 **마스크 안에서 밀어 올리는** 방식이라 blur 를 얹으면 번짐이 마스크에 잘립니다.
그래서 마스크를 푸는 변형 `.r-line--soft` 를 만들었습니다. 다음 사이트 전체 모션 정리 때 그대로 재사용합니다.

```css
.js .r-line--soft{overflow:visible;padding-bottom:0;margin-bottom:0}
.js .r-line--soft > span{
  transform:translateY(var(--rv-y)); opacity:0; filter:blur(6px);
  transition:transform var(--t-reveal) var(--ease),
             opacity   var(--t-reveal) var(--ease),
             filter    var(--t-reveal) var(--ease);
}
.js .is-in .r-line--soft > span{transform:none;opacity:1;filter:blur(0)}
@media (max-width:767px){ .js .r-line--soft > span{filter:blur(4px)} }
```

**등장 순서 실측 (1920, 110ms 간격 · opacity)**

| 시간 | 문장 1 | 문장 2 | 카드 A | 카드 B |
|---|---|---|---|---|
| 110ms | 0.42 | 0.00 | 0.00 | 0.00 |
| 220ms | 0.79 | 0.58 | 0.17 | 0.00 |
| 330ms | 0.92 | 0.85 | 0.69 | 0.27 |
| 440ms | 0.97 | 0.94 | 0.89 | 0.74 |
| 660ms | 1.00 | 0.99 | 0.99 | 0.96 |
| 880ms | 1.00 | 1.00 | 1.00 | 1.00 |

문장 1 → 문장 2(+80ms) → 카드 A(+160ms) → 카드 B(+260ms) 순으로 끊김 없이 이어집니다.
카드는 `scale .985 → 1`(모바일 .992)을 함께 씁니다. blur 는 6px → 0(모바일 4px → 0).

`prefers-reduced-motion` 에서는 blur · translate 없이 완성 상태로 바로 표시됩니다(실측 확인).

### 03. Hover — 카드 내부만 (§06 · §08)

DIM 20% · radius · 영상 재생/정지는 그대로. 영상 `scale 1.02`, 제목 `translateY -4px`,
설명 `opacity .88 → 1`(400ms). 그림자 · glow 없음.

### 04. 다운로드 카드 Hover — 프레임 고정 + 이미지만 zoom

⚠️ 예전에는 **카드 전체가 `scale(1.02)`** 로 확대되고, 드라이버 카드는 `translateY(-2px)` + 테두리
색까지 변했습니다. 요청대로 프레임 변화를 전부 걷어내고 안쪽 이미지만 확대합니다.

| | 게임 클라이언트 카드 | 드라이버 카드 |
|---|---|---|
| 카드 위치 · 크기 | **고정** [58,359,1310,281] → 동일 | **고정** [58,318,311,364] → 동일 |
| 카드 transform | `none` → `none` | `none` → `none` |
| radius / shadow / border / background | **동일** | **동일** |
| 텍스트 · 버튼 위치 | **고정** | **고정** |
| 이미지 scale | **1 → 1.03 → 1** | **1 → 1.02 → 1** |
| duration / easing | 550ms · `cubic-bezier(.22,1,.36,1)` | 〃 |

- 캐릭터 이미지는 `transform-origin:center bottom` 이라 아래를 기준으로 가까워집니다 — 위쪽이 잘리거나 흔들리지 않습니다.
- `.drv__media` 에 `overflow:hidden` 을 추가해 로고가 확대돼도 카드 밖으로 나가지 않습니다.
- 모바일은 hover 가 없고 press 확대도 넣지 않았습니다(정적 유지). `prefers-reduced-motion` 에서는 transition 제거.

### 05. QA

```
문구/타이포   7 뷰포트 — 2줄 고정 · 56~33px · 제목→카드 80~40px
등장 순서     문장1 → 문장2 → 카드A → 카드B (실측 표)
reduced      blur·translate 없이 완성 상태
Hover        영상 1.02 · 제목 -4px · 설명 .88→1 · DIM 20% 유지 · radius 불변
다운로드 hover 프레임/텍스트/버튼 완전 고정 · 이미지만 1.03 / 로고 1.02
전체         12 뷰포트 × 6 페이지 · worstOverflow 0 · errors 0
```

---

## v42 — 캐릭터 섹션 여백 / hover indicator · 모바일 다운로드 · 헤더·푸터 아이콘

이번 버전은 요청 6건을 한 번에 반영했습니다.

### 1. Character Section — 상하 여백 확장

`#about` 아래 섹션(`#cine`)은 `padding-top:0` 인 full-bleed 이미지로 시작합니다.
그래서 위/아래를 같은 값으로 두면 rail 바로 밑에서 다음 장면이 시작되는 인상이 남습니다.
**하단을 한 단계 더 크게** 잡았습니다. (padding 기반 — height 를 강제로 고정하지 않았습니다)

```
                 v41 상 / 하      v42 상 / 하      증가
1920            200 / 200        240 / 264       +40 / +64
1600            180 / 180        220 / 242       +40 / +62
1440            170 / 170        210 / 231       +40 / +61
1280            160 / 160        200 / 220       +40 / +60
1024            136 / 136        168 / 184       +32 / +48
 768            120 / 120        144 / 160       +24 / +40
 430            116 / 116        128 / 148       +12 / +32
 390            108 / 108        112 / 124        +4 / +16
 375            104 / 104        111 / 123        +7 / +19
 320             88 /  88        106 / 118       +18 / +30
```

내부 리듬 (실측)

```
                Title→Desc     Desc→Rail     Rail→Section Bottom
1920             25px           96px          264px
1440             26px           88px          231px
1280             26px           88px          220px
1024             25px           80px          215px
 768             25px           72px          160px
 390             21px           64px          124px
```

* Title ↔ Description 은 CSS margin 32 / 30 / 26px 입니다. 두 텍스트의 line-height
  여백이 서로를 먹어서, **실제로 보이는 글자 사이 간격**이 위 표의 24~28px 입니다.
* 1024 는 `min-height:88svh` + 세로 중앙 정렬 구간이라 padding(168)보다
  실제 여백(200 / 215)이 더 큽니다 — padding 은 "최소 호흡"으로만 남아 있습니다.

진입 stagger — 여백이 넓어진 만큼 세 덩어리가 한꺼번에 튀어나오지 않게 벌렸습니다.

```
            v41            v42
Title       0ms            0ms
Desc        +80ms          +120ms
Rail        +160ms         +280ms   (카드당 +60ms → +55ms)
```

모션 종류는 그대로 `opacity + translateY` 뿐입니다. scale / bounce 없음.

**바꾸지 않은 것** — 캐릭터 이미지 크기·비율, rail 가로 구성, 흰 배경,
텍스트 정렬/폭, hover interaction, 반응형 breakpoint.

### 2. Character Card — Hover Cursor Indicator

커서 모양은 그대로 두고(기본 cursor 유지), 커서 옆에 작은 "손 인사" pill 이 따라옵니다.

```
pill        38 × 38 · radius 999 · rgba(255,255,255,.92)
            border 1px rgba(0,0,0,.06) · shadow 0 4px 14px rgba(0,0,0,.08)
            backdrop-filter blur(9px)
아이콘      22px 손 실루엣 (stroke 1.6)
추종        cursor + 14 / + 14 · rAF lerp .22 (≈90~110ms 수렴)
enter       opacity 0→1 · scale .85→1 · translateY 4→0 / 220ms cubic-bezier(.22,1,.36,1)
exit        opacity 1→0 · scale 1→.9 / 160ms
wave        rotate 0→12→-8→6→0deg / 540ms — 진입 시 1회만 (무한 반복 아님)
press       scale 1→.9→1 / 120ms — 파티클·리플 없음
```

실측 (1920)

```
initial        element 1개 · opacity 0 · pointer-events none
enter +60ms    opacity .56 · scale .933
enter +260ms   opacity 1    · scale 1
follow         커서 (353,699) → pill (367,713)   = +14 / +14 ✔
press          scale .9
40회 mousemove element 여전히 1개  ✔ (mousemove 마다 DOM 생성 없음)
leave          opacity 0 · scale .9
touch 기기     .mqcur 0개  ✔ (모바일은 기존 :active scale(.99) 만)
reduced motion is-wave 없음 · transform none · opacity 1
```

* 요소는 문서당 **딱 1개**만 만들어 재사용합니다.
* 매 프레임 쓰는 값은 바깥 요소의 `transform` 하나뿐입니다. 등장/퇴장은 안쪽 요소가
  CSS transition 으로 담당해서, 두 값이 서로 덮어쓰지 않습니다.
* `pointer-events:none` — 카드의 hit-test 를 절대 가리지 않습니다.
* 카드 → 옆 카드로 넘어갈 때는 다시 흔들지 않고 그대로 따라갑니다.
* 카드 이미지 / 크기 / radius / 섹션 여백 / typography / 가로 rail / 흰 edge fade /
  모바일 스와이프는 **전혀 건드리지 않았습니다.**

### 3. 모바일 다운로드 카드 — 슬롯 재구성

원인은 세 가지였습니다.

1. 순서가 시안과 반대였습니다 (이미지 → 텍스트 → 버튼).
2. 그래서 캐릭터 몸통이 카드 **중간에서 수평으로 잘려** 끊긴 것처럼 보였습니다.
   (배경색은 원래부터 동일했습니다 — 실측 `rgb(179,190,212)` 로 이미지·본문 완전 일치.
    색을 덮어쓴 게 아니라 구조를 바꿔서 해결했습니다)
3. 원본(640×407) 위쪽 52px 은 그림 바깥의 흰 여백입니다(왼쪽 위 라운드 코너 포함).
   이전 crop(30px)이 부족해서 흰 띠가 남아 있었습니다.

수정 후 구조 — 하나의 Parent Slot

```
.dl__card   flex column · background · radius 16 · overflow hidden
            padding 32~40 / 0 / 0   ← 좌우 0 (비주얼이 카드 폭을 꽉 채웁니다)
  .dl__body   order 1 · padding-inline 20 · text-align center
    Title       20~22px / 700 / 1.3
    Note        기존 안내 문구 유지
    CTA         100% (max 295) × 54 · radius 12 · 15px/600
  .dl__art    order 2 · aspect-ratio 640/355 · object-fit cover · bottom 정렬
```

내부에 배경을 가진 요소가 **하나도 없어서** 중간 경계가 생길 수 없는 구조입니다.
DOM 순서(img → body)는 PC 와 공유하므로 그대로 두고 `order` 로만 바꿨습니다.

실측 (게임 클라이언트 / 모바일 설치 두 카드)

```
375   card 335×410 · radius 16 · Title y 458 (동일) · CTA 295×54 (동일)
      CTA→Visual 26px · Visual 하단 = 카드 하단 (오차 0)
360   card 320×397 · CTA 280×54 · CTA→Visual 25px · 오차 0
430   card 390×435 · CTA 295×54 · CTA→Visual 30px · 오차 0
전 뷰포트 horizontal overflow 0
```

터치 시 `.dl__card:active{scale(.99)}` 를 제거했습니다 — 카드 프레임은 완전히 고정,
버튼만 pressed 상태를 갖습니다.

### 4. 모바일 PC 사양 표

마지막 행 아래의 "굵은 라인"은 border 가 아니라 **가로 스크롤바 thumb** 이었습니다.
표에 `min-width:520px` 이 걸린 채 `overflow-x:auto` 안에 들어 있어서,
스크롤바가 생기고 3번째 열(권장사양)이 화면 밖으로 숨어 있었습니다.

```
before   .dl__tablewrap{overflow-x:auto}  .dl__table{min-width:520px}
         → scrollWidth 520 > clientWidth 335 → 스크롤바 노출
after    overflow visible · min-width 0 · 표를 세로로 쌓음
         → scrollWidth 335 = clientWidth 335 · 스크롤바 없음
```

정리한 내용

```
행 divider   행의 border-bottom 1px rgba(23,26,33,.10) 한 줄만
             (셀 border 전부 제거 — 겹쳐서 2px 로 보이던 원인)
표 상/하단   1px rgba(23,26,33,.30) 각 한 번씩
열 divider   항목 셀의 border-right 1px — grid row span + align-self:stretch 라
             정확히 행 높이만큼만 그려지고 표 밖으로 튀어나오지 않습니다
열 비율      항목 33% / 값 67%
padding      행 padding-block 18px · column-gap 14px
typography   항목 15px/600 ink · 값 15px/1.55 body · 열 이름 13px/600 52% ink
섹션 리듬    Title→Desc 16 · Desc→Table 30 · Table→다음 섹션 56~72
```

**확인 부탁드리는 것** — 모바일에서 표를 세로로 쌓으면서 상단 헤더 띠
(`구분 | 최소사양 | 권장사양`)가 화면에서 빠졌습니다. 대신 각 값 위에 열 이름을
직접 붙였습니다(`최소사양` / `권장사양`). 헤더 `<thead>` 는 DOM 에 그대로 남아 있어서
스크린리더는 계속 읽습니다. 헤더 띠를 다시 보이게 하려면 말씀해 주세요.

### 5. 프로필 / 언어 아이콘 — Bootstrap Icons

`bi-person-fill` · `bi-globe2` 원본 path 를 **인라인 SVG** 로 넣었습니다
(CDN·웹폰트 의존 없음 — 오프라인에서도 동일하게 뜹니다).

Bootstrap Icons 는 stroke 가 아니라 fill 기반이라, 기존 stroke 규칙을 `.ic` 에서 뒤집었습니다.

Optical size — 박스 크기가 아니라 **보이는 크기**를 맞췄습니다.

```
             path bbox      Desktop 박스 → 보이는 크기    Mobile 박스 → 보이는 크기
globe2       16/16 = 100%   18.5px → 18.5px              20px   → 20px
person-fill  12/16 =  75%   24px   → 18.0px              26.5px → 19.9px
```

중심선 실측 (index.html)

```
1920   언어 y 40.0 (42×42) · 프로필 y 40.0 (42×42)
1440   언어 y 37.0 (42×42) · 프로필 y 37.0 (42×42)
 768   프로필 y 33.0 (44×44) · 햄버거 y 33.0 (44×44)
 375   프로필 y 33.0 (44×44) · 햄버거 y 33.0 (44×44)
```

* 992px 미만에서 `.header__icon` 을 44×44 로 맞춰 햄버거와 히트 영역을 통일했습니다.
* 로그인 상태의 기본 아바타(96 캔버스)도 같은 person-fill 로 교체했습니다.
  `scale 4.1667` → 50px (캔버스의 52%). 이전 글리프(53.8px / 56%)보다 한 단계 작습니다.
  세로 중심은 46.5 — 어깨가 무거워 기하학적 중심(48)보다 1.5px 올린 optical alignment.
* Header 높이 · 로고 · padding · nav typography · 프로필 원형 배경 · 반응형 동작은
  전혀 바꾸지 않았습니다.

### 6. Footer SNS

6개 페이지 footer 하단에 Discord / YouTube / Instagram 아이콘을 추가했습니다.
(Bootstrap Icons 인라인 SVG — 위 헤더 아이콘과 같은 시스템)

```
Default   currentColor(var(--ink-soft)) · opacity .65 · 브랜드 컬러 없음
          원형 배경 없음 · 그림자 없음
Hover     opacity 1 · color var(--ink) · translateY(-2px) / 200ms cubic-bezier(.22,1,.36,1)
Focus     2px outline · offset 2px
링크      target="_blank" rel="noopener noreferrer" · aria-label "SuperPlat <서비스>"
```

크기 · 정렬 실측

```
히트 영역     40 × 44 (3개 동일)
아이콘        discord 21px · youtube 20px · instagram 20px   ← optical 보정
보이는 간격   19.5px / 20.0px
중심선        1920 / 768 / 375 모두 3개 완전 일치
우측 정렬     마지막 아이콘 ink 오른쪽 = 콘텐츠 그리드 오른쪽 (1652.5 = 1652.5)
모바일 375    Copyright 아래로 내려와 좌측 정렬 · 첫 아이콘 ink left 19.5 ≈ 본문 20
```

**확인 부탁드리는 것** — 히트 영역을 44×44 로 두면 아이콘 사이의 보이는 간격이
24px 이 되어 요청하신 16~20px 을 벗어납니다. 그래서 40×44 로 잡아 간격을 정확히
20px 로 맞췄습니다(세로는 44px 유지). 44×44 를 우선하실 경우 말씀해 주세요.

### QA

```
15 뷰포트 × 6 페이지
3840 · 2560 · 1920 · 1600 · 1440 · 1280 · 1024 · 768 · 430 · 412 · 393 · 390 · 375 · 360 · 320

worst horizontal overflow : 0
JS errors                 : 0
```

---

## v43 — Dark Mode · 마이페이지 i18n · World & IP Gallery · 이용약관 / 개인정보처리방침

이번 버전은 요청 5건입니다.

### 1. Premium Dark Mode — 전체 적용

색을 세 층으로 나눠 관리합니다. Light 는 한 줄도 새로 그리지 않았습니다.

**① 채널 토큰** — 이게 이번 작업의 핵심입니다.

사이트 곳곳에 `rgba(23,26,33, α)` 형태로 흩어져 있던 테두리 · divider · 보조 텍스트 ·
미세 배경이 **278곳**이었습니다. 이걸 전부 `rgba(var(--ink-rgb), α)` 로 바꿨습니다.
border / outline 에 쓰인 검정은 따로 `--line-rgb` 로 분리했습니다
(그림자 · 이미지 DIM · 마스크는 건드리지 않았습니다).

```
                    Light            Dark
--ink-rgb           23,26,33         243,246,251
--line-rgb          0,0,0            255,255,255
치환 건수           ink 178 · line 16 (6개 페이지 + sp-ui.js + sp-auth.js)
```

알파(=계층)는 그대로라서 Light 에서 만든 위계가 Dark 에서 비율 그대로 뒤집힙니다.
테두리 8~16% / 텍스트 46~68% 가 그대로 white 8~16% / 46~68% 가 됩니다.

**② 시맨틱 토큰** — 페이지 CSS 가 이미 쓰던 이름을 Dark 값으로 재정의합니다.

```
Surface   --bg #131518 · --bg-gray #181B1F · --card #1B1F24 · --band #16191D
          elevated(드롭다운 · 모달 · 토스트) #23272E
Text      primary #F3F6FB(96%) · secondary 74% · tertiary 56% · disabled 36%
Border    기본 white 8~12% · hover 16~26% · focus 24~32%   (Pure White 없음)
Semantic  --ok #5FD69B · --err #FF8A80   (Hue 유지 · 명도만 상향)
Dropdown  --sp-menu-bg #23272E · --sp-opt-hover white 6% · --sp-fld-bd white 12%
```

Pure Black(#000)은 페이지 배경으로 쓰지 않았습니다.

**③ 컴포넌트 예외** — 토큰만으로 안 되는 것만 개별 처리했습니다.

* `background:var(--ink)` 인 버튼 19종 — Dark 에서 `--ink` 가 흰색이 되므로
  글자색을 `#14171B` 로 뒤집었습니다 (spec §18 "Light button on Dark").
  Primary / Secondary / Tertiary / Danger 위계는 그대로입니다.
* Disabled — 흰 버튼에 opacity 를 걸면 회색 덩어리로 떠 보여서,
  표면(#242830)으로 가라앉히고 글자를 36% 로 내렸습니다.
* 로고 — 원본이 흰색이라 Light 에서만 `invert(1)` 로 뒤집고 있었습니다.
  Dark 에서는 filter 를 걷어 원본 그대로 씁니다.
* 다운로드 카드는 브랜드 라이트 블루(#B3BED4 / #B3C5D4)를 **그대로 유지**하고,
  카드 안 텍스트 · 버튼도 Light 와 동일하게 두어 대비를 지켰습니다.
* 드라이버 로고(AMD · Intel · NVIDIA · DirectX)는 원본 브랜드 색 그대로,
  media 영역만 밝게 유지했습니다. White filter 변환 없음.

**이미지에는 어떤 filter 도 걸지 않았습니다.** 사진 · 3D 캐릭터 · 게임 공간의 색은
그대로입니다. 공간 섹션의 확정 DIM 값(배경 wash · 중앙 0% · 인접 30% · 외곽 40%)도
Dark 라고 더 어둡게 만들지 않았습니다.

**Theme Toggle**

```
위치      Desktop [ Language ] [ Theme ] [ Profile ] [ Download ]
          Mobile  [ Profile ] [ Theme ] [ Hamburger ]   (CSS order 로만 재배치)
아이콘    bi-moon(Light 상태) / bi-sun(Dark 상태) — 인라인 SVG
크기      moon 17.5px · sun 19px (Desktop) / 19px · 20.5px (Mobile)  ← optical 보정
히트 영역 42×42 (Desktop) · 44×44 (≤991)
전환      background-color / color / border-color 200ms cubic-bezier(.22,1,.36,1)
          평소에는 transition 이 꺼져 있고, 토글을 누른 순간에만 260ms 동안 켭니다.
          이미지 · 영상에는 걸지 않습니다 (사진이 페이드되지 않게).
aria      "다크 모드로 전환" ↔ "라이트 모드로 전환" (언어 전환도 따라갑니다)
```

**저장 / FLASH 방지**

```
localStorage['sp.theme'] = light | dark | system
우선순위  ① 사용자가 고른 값 ② OS prefers-color-scheme ③ light
적용 시점 assets/sp-theme.js 를 <head> 안, 페이지 <style> 보다 먼저 동기 로드
          → DOM 이 그려지기 전에 data-theme 확정 (defer/async 금지)
```

Header UI 는 단순 토글이지만 내부는 **light / dark / system 3단계**를 이미 지원합니다.
나중에 Theme Dropdown 으로 확장할 때 `sp-theme.js` 는 손대지 않아도 됩니다.

실측

```
초기            data-theme=light
토글 후         data-theme=dark · localStorage sp.theme=dark
                body background rgb(19,21,24) · color rgb(243,246,251)
새로고침 후     data-theme=dark 유지 · 첫 페인트부터 dark (flash 없음)
```

### 2. Character Section — 손 흔드는 Cursor Indicator 제거

v42 에서 넣었던 indicator 를 **완전히 제거**했습니다.
남은 코드가 없습니다 — `.mqcur` 검색 결과 0건.

```
제거   전용 DOM(1개) · CSS(.mqcur / .mqcur__in / .mqcur__ico / @keyframes mqwave)
       JS(마우스 follow · rAF lerp · wave · press · pointerover/out 핸들러)
       Dark Theme 의 indicator 규칙
유지   캐릭터 이미지 · 카드 크기 · radius · 가로 rail · 흰 edge fade
       모바일 스와이프 · 섹션 타이포 · Scroll Reveal
Hover  transform:scale(1.02) / 420ms cubic-bezier(.22,1,.36,1)
       (v42: translateY(-5px) scale(1.035) / 680ms)
       custom cursor · 손 아이콘 · floating UI · tooltip · glow · particle 없음
```

### 3. My Page — 언어 선택 연동

**공용 locale state 하나**를 새로 만들어 사이트 전체가 그것만 봅니다.
마이페이지 전용 번역 로직은 만들지 않았습니다.

```
assets/sp-i18n.js   localStorage['sp.locale'] = ko | en
                    <head> 안에서 동기 로드 → 첫 렌더 전에 <html lang> 확정
                    (마이페이지 · 뉴스 · 고객지원은 본문을 JS 로 그립니다)
API                 SPI18N.get() / .set(v) / .t(ko) / .subscribe(fn)
6개 페이지의 setLang → SPI18N.set(lang) 을 호출하고, 부팅 시 저장된 언어를 적용
```

**사전 구조** — 화면에 나가는 **한국어 원문 자체가 키**입니다.

```
키 개수      485개  (마이페이지 417 + 공통 계정 모듈 75, 중복 7 병합)
장점         키를 따로 만들지 않으므로 코드와 화면이 어긋날 수 없습니다.
             사전에 없는 문자열은 한국어 원문이 그대로 나가서 화면이 깨지지 않습니다.
호출         T('회원 탈퇴')            → 사전에서 영문을 찾습니다
             T('회원 탈퇴', 'Delete')  → 두 번째 인자 우선 (기존 호출부 호환)
치환 건수    마이페이지 JS 안의 한국어 문자열 549곳을 T() 로 감쌌습니다
```

언어를 바꾸면 문자열을 들고 있던 표 16개(MENU · PAGE · WD_SECTIONS · LEGAL ·
LEDGER_KINDS · PAY_METHODS · CARD_BRANDS …)를 `rebuildI18n()` 이 다시 만들고,
`buildNav()` → `render()` 로 현재 화면을 그대로 다시 그립니다.
탭 · 하위 화면 · 탈퇴 단계 같은 상태는 그대로 유지됩니다.

**번역 누락 QA** — English 로 바꾼 뒤 마이페이지 전체 텍스트 노드를 훑었습니다.

```
남은 한국어 :  "한국어" (언어 메뉴 항목 — 각 언어를 그 언어로 표기하는 관례)
               "슈퍼플레이어" (데모 계정의 닉네임 — 사용자 데이터)
그 외        :  0건
aria-label   :  data-i18n-aria 로 처리 (SuperPlat 홈 · 주요 메뉴 · 언어 선택 ·
                마이페이지 메뉴 · 맨 위로 이동 · 내 계정 …) — 남은 한국어 0건
```

**영문 길이 대응 QA** (Profile / Terms / Account / Assets / Sub / Pay / Ledger / Payout 8개 탭)

```
1440 · 768 · 430 · 390 · 375 · 360   전부 horizontal overflow 0 · errors 0
```

고유명사는 번역하지 않았습니다 — SuperPlat · SuperTown · SuperStory · SuperBoard ·
MySpace · Super Bean / Wing / Star · Free / Basic / Advance / Advance+ / Pro / Premium ·
카드사 브랜드명.

법적 문서(이용약관 · 개인정보처리방침)는 공식 영문본이 없어 **번역하지 않았습니다.**
영문 모드에서는 문서 위에 "한국어로만 제공된다"는 안내 한 줄만 표시합니다.

### 4. World & IP — Gallery Lightbox

카드를 누르면 현재 페이지 위에 어두운 갤러리가 열립니다. 상세 페이지가 아닙니다.

```
Backdrop   rgba(0,0,0,.85) + backdrop-filter blur(2px)
이미지     원본 비율 그대로(contain). 흰 모달 박스 · 카드 컨테이너 ·
           두꺼운 테두리 · 강한 그림자 없음 — 어두운 배경 위에 이미지만.
정보       Title(20~22 / 700) · Category(13~14 / white 55%) ·
           Description(14 / white 72%) · 순서(12 / white 42%)
           별도 Card Background 없음. 데이터는 카드와 같은 ITEMS 하나만 씁니다.
Close      우상단 46×46 (모바일 44×44) · 아이콘만 · opacity .72 → 1
Prev/Next  화면 좌우 52×52 · hover 시 opacity 1 + translateX ±3px
           (모바일에서는 화면 하단 좌우 48×48 — 엄지로 닿는 자리)
```

**이미지 크기** — `max-width` 만으로는 원본이 작은 이미지를 키울 수 없어서
표시 크기를 직접 계산합니다.

```
PC       폭 min(72vw, 1100px, 원본 × 1.8) · 높이 72vh
Mobile   폭 화면폭 - 40 (좌우 20px) · 높이 60dvh
공통     비율은 항상 원본 그대로. 원본보다 1.8배를 넘겨 늘리지 않습니다.
```

실측 (원본 비율 유지 · 화면 밖으로 나가지 않음 · overflow 0)

```
1920 / 1440 / 1024   603×418  (원본 335×232)   ratio ✔
 768                 553×383                    ratio ✔
 430                 390×270                    ratio ✔
 390                 350×242                    ratio ✔
 375                 335×232                    ratio ✔
 360                 320×222                    ratio ✔
1600×900 원본       1037×583  (72vw 상한)       ratio ✔
```

**동작**

```
열기       backdrop opacity 0→1 · 이미지 opacity 0→1 scale .98→1 ·
           정보 opacity 0→1 translateY 8→0 / 380ms cubic-bezier(.22,1,.36,1)
좌우 이동  현재 opacity 1→0 translateX ±12px (160ms)
           → 교체 → 새 이미지 ∓12px→0 opacity 0→1 (300ms)
           정보는 blur 0→4px→0 을 함께 — 이미지보다 눈에 띄지 않게
닫기       scale 1→.98 · opacity 1→0 / 280ms
키보드     ESC 닫기 · ← → 이동 · Tab 은 닫기/이전/다음 안에서만 순환(포커스 트랩)
스와이프   모바일 가로 48px 이상 + |dx| > |dy| × 1.4 일 때만 (세로 스크롤과 충돌 없음)
preload    현재 ±1장만
접근성     role="dialog" · aria-modal · aria-label(닫기 / 이전 이미지 / 다음 이미지)
           이미지 alt = "제목 — 카테고리"
```

**닫으면 원래 상태 그대로**

```
스크롤 위치   정확히 복원 (position:fixed 로 잠갔다 풀 때 레이아웃을 한 번
              강제 계산시킨 뒤 이동 — 안 그러면 짧아진 문서 높이로 잘립니다)
Layout Shift  스크롤바 폭만큼 padding-right 로 보정 → 열고 닫을 때 좌우 이동 없음
필터 / 더보기 그대로. 좌우 탐색 범위도 "지금 화면에 보이는 카드" 기준입니다.
              (월드 필터 → 월드 카드만, 더보기 전이면 로드된 만큼만)
```

**확인 부탁드리는 것** — World & IP 이미지 30장 중 16장이 원본 해상도가 작습니다
(`world-figure.jpg` · `world-shop.jpg` · `char-bori.jpg` 335×232, 캐릭터 PNG 415~604px).
갤러리에서 더 크게 보시려면 고해상도 원본이 필요합니다. 지금은 흐려지지 않도록
원본의 1.8배까지만 확대하고 있습니다.

### 5. 이용약관 / 개인정보처리방침 페이지

`terms.html` · `privacy.html` 두 페이지를 새로 만들었습니다.
본문은 thecrossinglab.com 원문 그대로이며 요약 · 재작성 · 추가 없이 옮겼습니다.

```
이용약관        24개 조항 + 목차 24 + 회사 정보  (12,916자)
개인정보처리방침 12개 조항 + 목차 12 + 표 2개 + 회사 정보  (7,026자)
검수            조항 수 · 순서 · 목차 · 표 행 · 날짜 · 회사명 · 주소 ·
                사업자등록번호 · 책임자 성명 · 이메일 · [이메일],[주소],[전화번호]
                자리표시까지 원문 그대로 확인. HTML escape 잔재 0건.
```

**레이아웃**

```
바깥 폭     사이트 공통 1400 그리드
읽는 폭     940px (실측 940 / 모바일 335)
Page Title  42px (1440) / 32px (375)        · 700~800
조항 제목   19~24px / 700
본문        16px (1440) / 15px (375) · line-height 1.8
조항 간     40~64px + 아주 얇은 divider (조항마다 카드로 감싸지 않았습니다)
문단 간     12~16px · 목록 간 8~12px
모바일      좌우 20px · 상단 여백 106~122px
긴 문자열   overflow-wrap:anywhere (이메일 · URL)
표          Desktop 일반 표 / 모바일 가로 스크롤 (내용 삭제·축약 없음)
목차        원문의 "개요" 목록 그대로 + 앵커 이동 (헤더 높이만큼 scroll-margin)
```

**연결**

```
Footer          6개 페이지 전부 → terms.html · privacy.html
회원가입        약관 시트의 "전문 보기" → 해당 문서 새 탭
마이페이지      개인 및 약관 → 서비스 이용약관 / 개인정보 수집 및 이용 /
                개인정보 처리방침 항목에 "전문 보기" 링크
                (페이지마다 약관 본문을 복제하지 않고 문서 페이지 하나만 원본)
Header/Footer   기존 그대로. Smart Header 동작 유지.
                히어로가 없는 흰 화면이라 헤더는 처음부터 solid 로 시작합니다.
```

### QA

```
11 뷰포트 × 8 페이지 × 2 테마 × 2 언어
1920 · 1600 · 1440 · 1280 · 1024 · 768 · 430 · 412 · 390 · 375 · 360
index · world · news · support · auth · mypage · terms · privacy

LIGHT / KO   horizontal overflow 0 · JS errors 0
DARK  / KO   horizontal overflow 0 · JS errors 0
LIGHT / EN   horizontal overflow 0 · JS errors 0
DARK  / EN   horizontal overflow 0 · JS errors 0
```

### 새로 추가된 파일

```
assets/sp-theme.js    Theme runtime (light / dark / system · FOUC 방지)
assets/sp-theme.css   Dark Theme 전체 (토큰 재정의 + 컴포넌트 예외)
assets/sp-i18n.js     공용 locale + KO→EN 사전 485개
terms.html            이용약관
privacy.html          개인정보처리방침
```

---

## v44 — WORLD & IP 배너 / 하단 Download 비주얼 리소스 교체

디자인 수정이 아니라 **이미지 파일만 교체**하는 작업입니다.
Section height · Container · aspect-ratio · padding · margin · grid · typography ·
button · header · footer · breakpoint · 애니메이션 · Light/Dark 디자인은
한 줄도 바꾸지 않았습니다.

### 교체한 파일

```
assets/world-hero.jpg      1920×394  →  1920×450   (첨부 1 · WORLD & IP 배너)
assets/cta-characters.png  375×269   →  819×556    (첨부 2 · 하단 Download 캐릭터)
```

두 리소스 모두 **AI 재생성 · 캐릭터 수정 · 색보정 · 배경 합성 · 텍스트 추가 없이**
첨부해 주신 원본 그대로입니다. Light / Dark 모두 같은 파일 하나만 씁니다.

### 1. WORLD & IP 배너

배너 컨테이너는 원래 **1920:450 시안 규격**으로 만들어져 있었고
(`height:clamp(200px, 23.4vw, 480px)`), 새 이미지가 정확히 1920×450 이라
Desktop 에서는 사실상 crop 이 일어나지 않습니다.

컨테이너 높이 실측 — 교체 전후 **완전히 동일**

```
1920  1905 × 449      768   753 × 200
1440  1425 × 337      375   375 × 220
```

`object-position` 만 새 이미지의 구도에 맞춰 옮겼습니다.
(캐릭터 그룹의 가로 중심 = 51.7% · 세로 범위 0~88.7%)

```
              before        after
Desktop       50% 50%   →   52% 50%
≤1023         56% 50%   →   52% 50%
≤767          62% 46%   →   52% 50%
```

실제로 보이는 원본 영역 (그룹은 25.2%~78.3% 구간)

```
1920   0.3% ~ 99.7%   세로 0~100%   그룹 전체 노출 ✔
1440   0.5% ~ 99.6%   세로 0~100%   그룹 전체 노출 ✔
1024   0.7% ~ 99.4%   세로 0~100%   그룹 전체 노출 ✔
 768   6.1% ~ 94.4%   세로 0~100%   그룹 전체 노출 ✔
 430 / 375 / 360      31.2% ~ 71.2% 세로 0~100%
```

모바일(375×220)은 컨테이너 비율이 1.70 이라 4.27 짜리 이미지의 가로 40% 만
보일 수 있습니다. 그룹 중심(51.7%)을 기준으로 잘라서 여섯 캐릭터의 얼굴이 모두
남고, 좌우 끝의 큰 캐릭터 팔·망토 가장자리만 살짝 걸칩니다
(컨테이너 크기를 바꾸지 않는 한 구조적으로 더 담을 수 없는 폭입니다).

로드 전 바탕색만 새 배너의 가장자리 색으로 맞췄습니다 — `#43526A → #7482CD`.
이미지가 뜨기 전 다른 색이 번쩍이지 않게 하는 값이라 레이아웃과 무관합니다.

Entrance motion(`opacity 0→1` + `scale 1.015`)은 기존 그대로이며 새로 추가한
zoom / parallax 는 없습니다. Dark Mode 에서도 brightness filter 를 쓰지 않아
캐릭터 색감이 원본 그대로입니다.

### 2. 하단 Download 캐릭터

`.cta__art` 의 컨테이너 규칙(`width`/`height` clamp · `aspect-ratio:375/269` ·
`object-fit:contain` · margin)은 그대로입니다. 파일만 교체했습니다.

레이아웃 박스 실측 — 교체 전후 **완전히 동일**

```
1920  318 × 228   ·  CTA 섹션 높이 300
1440  285 × 205   ·  267
1024  257 × 184   ·  240
 768  239 × 172   ·  222
 430  204 × 146   ·  363
 375  178 × 128   ·  360
 360  171 × 122   ·  359
```

**투명 배경** — 새 PNG 는 알파 채널이 살아 있습니다(전체의 57.5% 가 완전 투명,
네 모서리 모두 alpha 0). 이전 리소스는 배경이 `#F2F3F6` 로 구워진 불투명 PNG 라
Dark Mode 에서 밝은 사각형이 비칠 수 있었는데, 이번 교체로 그 문제도 함께
사라졌습니다. 이미지 뒤에 background-color 를 넣지 않았습니다.

**크기 미세 조정** — 새 캔버스(819×556)는 캐릭터 바깥으로 좌우 약 10.6% 의
투명 여백을 갖고 있습니다. 같은 슬롯에 `contain` 으로 넣으면 캐릭터가 이전보다
약 8% 작게 보여서, **레이아웃은 그대로 두고 그리기 단계에서만** 되돌렸습니다.

```
transform:scale(1.09);  transform-origin:center center;
```

`transform` 은 layout box 에 영향을 주지 않으므로 컨테이너 · 여백 · 섹션 높이는
위 표 그대로입니다. 확대분(각 변 4.5%)은 투명 여백(10.6%) 안에서 흡수되어
캐릭터가 컨테이너 밖으로 나가거나 잘리지 않습니다.

캐릭터 실측 폭 × 높이 (1440 기준)

```
이전 리소스   245 × 175
교체 직후     225 × 161   (-8%)
scale 적용    245 × 175   ← 이전과 동일한 optical size 로 복원
```

기존 entrance(`scale .96 → 1`, `translate 12px → 0`)는 개별 CSS 속성이라
`transform` 과 곱해져 그대로 동작합니다. 비율 왜곡 없음(`object-fit:contain`),
`index / world / news / support` 네 페이지가 같은 리소스를 공유합니다.

### QA

```
11 뷰포트 × 8 페이지 × 2 테마
1920 · 1600 · 1440 · 1280 · 1024 · 768 · 430 · 412 · 390 · 375 · 360

LIGHT   horizontal overflow 0 · JS errors 0
DARK    horizontal overflow 0 · JS errors 0

□ 배너 컨테이너 높이 교체 전후 동일          ✔
□ Download 이미지 레이아웃 박스 동일         ✔
□ CTA 섹션 높이 동일                          ✔
□ 이미지 비율 왜곡 없음                       ✔
□ PNG 투명 배경 정상 (Light / Dark)           ✔
□ Dark Mode 이미지 filter 없음                ✔
□ 모바일 캐릭터 3개 모두 노출                 ✔
```

---

## v45 — 모바일 Header / 전체 메뉴 UX 고도화

모바일·태블릿 Header 와 전체 메뉴를 다시 설계했습니다.
**PC Header(≥992px)는 한 픽셀도 바뀌지 않습니다** — 아래 QA 에 실측 diff 를 남겨 두었습니다.

### 새로 추가 / 수정한 파일

```
assets/sp-nav.css   ← 신규. 모바일 Header · 전체 메뉴 · 화면 설정 세그먼트 (8 페이지 공용)
assets/sp-i18n.js   ← data-i18n-ko 텍스트 번역 경로 + 메뉴 문자열 8개
assets/sp-theme.js  ← set() 이 mode 변경만 있어도 구독자에게 알리도록 / 전환 창 340ms
assets/sp-ui.js     ← themeToggle() 이 [data-theme-set] 세그먼트도 함께 관리
assets/sp-theme.css ← 색 transition 200 → 280ms · 모바일 테마 아이콘 순서 규칙 제거
*.html (8개)        ← .drawer__lang → .drawer__prefs 교체 + sp-nav.css 링크
```

컴포넌트를 페이지마다 복제하지 않았습니다. 메뉴 마크업 조각 하나(`.drawer__prefs`)와
스타일시트 하나(`sp-nav.css`)를 8 페이지가 공유합니다.
Light / Dark 도 컴포넌트를 두 벌 만들지 않고, 기존 채널 토큰
`rgba(var(--ink-rgb), α)` 위에서 그린 뒤 **선택된 칸의 표면색 2줄만** 다크 예외로 뒀습니다.

### 1. 모바일 Header — 아이콘 3개로 정리

```
[ SuperPlat ]                          [ Profile ] [ ☰ ]
```

| 항목 | 값 |
|---|---|
| Header height | 74px (≤767) · 70px (≤359) — 요청 72~80 구간 |
| 좌우 padding | 20px (`--gutter`, 본문과 동일 축) · ≤359 18px |
| Profile / Menu 히트 영역 | 44 × 44 |
| 두 버튼 사이 간격 | 8px |
| Profile 아이콘 시각 크기 | 21px (`bi-person-fill` 박스 28px × 잉크 비율 0.75) |

테마 토글과 언어 드롭다운은 Header 에서 내렸습니다(`display:none` at ≤991).
두 기능은 메뉴 안 「화면 설정」으로 이동했고, **같은 전역 상태**를 봅니다.

Profile 버튼은 강조하지 않되 눌리는 곳임이 보이도록 neutral surface 를 얕게 깔았습니다.
사진 위(투명 헤더)에서는 흰 계열 `rgba(255,255,255,.13)` + `inset ring .20`,
스크롤 후·흰 배경 페이지·메뉴 열림 상태에서는 잉크 계열
`rgba(var(--ink-rgb),.05)` + `inset ring rgba(var(--line-rgb),.12)` 로 자동 전환됩니다.
로그인 상태의 아바타도 같은 칩을 쓰며, 링이 이중으로 생기지 않게 아바타 자체 ring 은 껐습니다.

### 2. 햄버거 ↔ 닫기

가운데 줄은 `opacity` + `scaleX(.6)`, 바깥 두 줄만 45° 로 모입니다 (240ms).
과한 회전은 쓰지 않습니다. 메뉴가 열려 있어도 Header 의
`[ SuperPlat ] [ Profile ] [ × ]` 세 요소는 그대로 남습니다.

### 3. 전체 메뉴 — 정보 위계

```
Navigation          26~32px / 700 / lh 1.25 / 항목 간 24px
──────────────────  divider
화면 설정            13px / 600 / 보조색
  테마              [ ☀ 라이트 │ 다크 🌙 ]
  언어              [ 한국어  │ English  ]
──────────────────  divider
로그인 / 마이페이지
다운로드            56px pill
```

- Navigation 은 PC Header 텍스트를 재사용하지 않고 모바일 전용 크기를 씁니다.
- 화면 설정은 Navigation 과 같은 레벨이 아니므로 divider 로 끊고 한 단계 작게 뒀습니다.
- 세그먼트는 두 행의 **좌우 끝이 정확히 맞도록** 폭을 198px 로 고정했습니다.
  라벨이 「테마 / 언어」든 「Theme / Language」든 세그먼트 위치는 움직이지 않습니다.
- 선택된 칸에만 얕은 surface(`--sp-elev`) + `0 1px 2px rgba(0,0,0,.06)`.
  Accent color · 큰 카드 · gradient · glassmorphism · 큰 토글 스위치는 쓰지 않았습니다.
- ≤339px 에서는 라벨을 위로 올리고 세그먼트가 가로를 채웁니다.
- 600~991px(태블릿)에서는 읽기 폭을 540px 로 제한해 「테마 …… [세그먼트]」가
  화면 폭만큼 벌어지지 않게 했습니다.

### 4. 전역 상태 — 하나의 source of truth

```
theme   localStorage['sp.theme']    light | dark | system   (assets/sp-theme.js)
locale  localStorage['sp.locale']   ko | en                 (assets/sp-i18n.js)
```

PC Header 토글 · 모바일 메뉴 세그먼트 · My Page 가 **같은 객체 하나**를 봅니다.
세그먼트는 `SPTheme.subscribe` / `SPI18N.subscribe` 로 상태를 되받아 그리므로
어디서 바꾸든 나머지가 따라옵니다. Fake toggle 이 아니라 실제 콘텐츠가 바뀝니다.

`SPTheme.set()` 은 적용값(`resolved`)이 그대로여도 설정(`mode`)이 바뀌면
구독자에게 알리도록 고쳤습니다 (`system` → `light` 처럼 화면은 같고 설정만 바뀌는 경우).

메뉴 문자열은 페이지마다 EN 사전을 만들지 않고, sp-i18n.js 에 새로 추가한
`data-i18n-ko` 경로로 공용 사전(한국어 원문이 곧 키) 하나만 씁니다.
`textContent` 만 교체하므로 언어 전환 시 layout shift 가 없습니다.

### 5. 모션

| 대상 | 값 |
|---|---|
| 메뉴 배경 fade-in | opacity 260ms |
| Navigation | opacity + translateY 14px → 0, 360ms, stagger 25ms (60 / 85 / 110 / 135ms) |
| 하단(화면 설정 · 액션) | 360ms · delay 160ms |
| 닫기 | 내용 150ms → 패널 240ms(delay 60ms) → unmount |
| 햄버거 morph | 240ms |
| 테마 색 전환 | 280ms `cubic-bezier(.22,1,.36,1)` — 이미지에는 transition/filter 없음 |

패널이 위에서 떨어지던 `translateY(-14px)` 는 제거하고 배경은 fade 만 남겼습니다.
`prefers-reduced-motion` 에서는 전부 1ms + delay 0.

### 6. 고친 버그 — 메뉴 하단이 원래 보이지 않았습니다

`.js` 와 `.is-menu` 는 **둘 다 `<html>` 위에** 있습니다.
그래서 기존 규칙 `.js .is-menu .drawer__foot { opacity:1 }` 은 자손 결합자라
**한 번도 매치된 적이 없었고**, 모바일 메뉴 하단(언어 · 로그인 · 다운로드)이
`opacity:0` 인 채로 화면에 나오지 않았습니다.
`html.js.is-menu .drawer__foot` (붙여 쓴 복합 선택자)로 바로잡았습니다.

### 7. 접근성 · 안전영역

- Profile / Menu / Close / Theme / Language 모두 히트 영역 44 × 44 이상
- `role="radiogroup"` + `aria-checked` (테마) · `aria-current` (언어)
- `aria-label` 도 로케일을 따라 번역 (`data-i18n-aria`)
- `:focus-visible` 링 — 키보드 사용자에게만
- Header `padding-top:env(safe-area-inset-top)`,
  메뉴 `padding-bottom:calc(env(safe-area-inset-bottom) + 28px)`
- body scroll lock + 스크롤 위치 복원, 메뉴 내부만 `overflow-y:auto` +
  `overscroll-behavior:contain` (iOS background scroll leakage 방지)
- ESC 로 닫기, ≥992 로 넓어지면 자동 닫기, `inert` 로 배경 포커스 차단

### QA

```
[모바일 메뉴]  8 페이지 × 8 뷰포트 × 2 테마
320 · 360 · 375 · 390 · 412 · 430 · 768 · 834

□ 헤더에 로고 / 프로필 / 햄버거 3개만 노출        ✔
□ 문서 · 메뉴 가로 overflow 0                     ✔
□ 세그먼트 버튼 높이 ≥ 44px                       ✔
□ 세그먼트 우측 끝이 뷰포트 안                    ✔
□ 선택 상태가 테마/언어 각각 정확히 1개           ✔
□ body scroll lock 적용 · 닫으면 위치 복원        ✔
□ 다운로드 CTA 가 화면 안에 들어옴                ✔
□ JS 오류 0                                       ✔

[전체 사이트]  8 페이지 × 11 뷰포트 × (Light/Dark × KO/EN)
1920 · 1600 · 1440 · 1280 · 1024 · 768 · 430 · 412 · 390 · 375 · 360

LIGHT/KO  overflow 0 · errors 0
DARK/KO   overflow 0 · errors 0
LIGHT/EN  overflow 0 · errors 0
DARK/EN   overflow 0 · errors 0

[PC 회귀]  index / world / mypage × 1024 · 1280 · 1440 · 1600 · 1920 · 2560
sp-nav.css 있음 / 없음 두 조건에서 logo · nav · lang · theme · login ·
download · burger 의 x / y / width / height / display 를 전수 비교

→ PC IDENTICAL (모든 값 일치, diff 0)

[기능]
□ 메뉴 세그먼트로 Dark 선택 → data-theme · localStorage · body 배경 전환   ✔
□ 메뉴 세그먼트로 English 선택 → html lang · 메뉴 · 헤더 · 라벨 전부 전환  ✔
□ 페이지 이동 후에도 테마 / 언어 유지                                      ✔
□ 스크롤 1400px 지점에서 메뉴 열고 ESC → 정확히 1400px 로 복원             ✔
□ 로그인 상태에서 화면 설정 → 프로필 → 마이페이지 / 로그아웃 순서 유지     ✔
```

---

## v46 — Dark Mode Download 버튼 · WORLD & IP 이미지 리소스

### 1. Dark Mode — Header 다운로드 버튼 가시성 (버그 수정)

Dark 에서 Hero 위(투명 헤더)의 다운로드 버튼이

```
background: var(--white) = #FFFFFF
color:      var(--ink)   = #F3F6FB      ← Dark 에서 --ink 가 거의 흰색
```

이 되어 **흰 글씨가 흰 배경 위**에 놓여 있었습니다 (실측 대비 **1.04 : 1**).
기존 규칙이 "스크롤 후 / auth · mypage · legal · detail" 상태만 뒤집고 있어서
Hero 위 기본 상태가 빠져 있었던 것이 원인입니다.

색을 selector 마다 하드코딩하지 않고 토큰으로 모았습니다 (`assets/sp-theme.css` §3-1b).

| Token | Light | Dark |
|---|---|---|
| `--dl-bg` / `--dl-fg` | `#FFFFFF` / `var(--ink)` | `#EDEFF4` / `#111318` |
| `--dl-bg-hover` | `#EFEFEF` | `#FFFFFF` |
| `--dl-bg-active` | `#EFEFEF` (기존과 동일) | `#DCE1E9` |
| `--dl-solid-bg` / `-fg` | `var(--ink)` / `#FFFFFF` | `#EDEFF4` / `#111318` |
| `--dl-solid-hover` | `#333B45` | `#FFFFFF` |

`--dl-solid-*` 는 **PC 헤더의 불투명 상태와 모바일 메뉴 CTA(`.drawer__cta`)가 같이 씁니다.**
순백 대신 `#EDEFF4` 를 써서 Header Navigation 보다 과하게 튀지 않게 했습니다.
Focus ring 은 `outline:2px solid var(--dl-solid-bg)` — 표면의 반대색이라
Light/Dark × 투명/불투명 헤더 네 경우 모두 보입니다.
text-shadow 는 쓰지 않았습니다. 대비는 색으로만 해결했습니다.

```
대비 실측 (index / world / auth / mypage / terms × 1440, drawer CTA × 390)

          default   hover   scrolled
LIGHT     16.56     14.40   16.56      ← 교체 전과 완전히 동일 (Light 불변)
DARK      16.15     18.58   16.15      ← 1.04 → 16.15
```

### 2. WORLD & IP 상세보기 — 옷가게 / Figure Collection

`ITEMS` 에 `detail` 필드를 추가했습니다. 카드 썸네일(`img`)과 상세 이미지(`detail`)를
분리하고, `detailSrc(it) = it.detail || it.img` 한 곳에서만 결정합니다.

```js
{ kind:'world', title:'옷가게',            img:'world-shop.jpg',   detail:'world-shop-detail.png' },
{ kind:'world', title:'Figure collection', img:'world-figure.jpg', detail:'world-figure-detail.png' },
```

두 장 모두 **1920×1080 원본을 재가공 없이 그대로** 넣었습니다(색보정·crop·리사이즈 없음).
나머지 카드는 `detail` 이 없으므로 기존 동작 그대로입니다.

WORLD 상세보기는 16:9 고정 프레임이 되었습니다 (IP 캐릭터는 기존 `contain` 유지).

```
PC      폭 min(86vw, 1400, 화살표 자리 제외) · 높이 62vh 안에서 16:9
Mobile  폭 calc(100vw - 40px) · 16:9
        이미지 → 제목 → 카테고리 → 설명 → 번호, 좌우 이동은 화면 아래
```

좌우 화살표(52px)가 이미지를 덮지 않도록 `lbFit()` 이 화살표 자리를 먼저 빼고 폭을 정합니다
(768px 태블릿에서 겹치던 문제 수정).

### 3. IP 캐릭터 4종 이미지 교체

배경색으로 대상을 확정한 뒤 원본을 그대로 덮어썼습니다.

| 카드 | 파일 | 배경 (원본 코너 픽셀) |
|---|---|---|
| 해피넛츠 | `char-crowd.png` | `#FFABEF` |
| 스파이시 패밀리 | `char-robots.png` | `#FFABAC` |
| KU | `char-cow.png` | `#CBC6A7` |
| 엔카이브 | `char-band.png` | `#B9B7E8` |

네 장 모두 **335×232** — 카드 이미지 프레임(`aspect-ratio:335/232`)과 **비율이 정확히 같아
잘리는 곳이 전혀 없습니다.** 그래서 `object-position` 을 따로 주지 않았습니다.
`detail` 이 없으므로 상세보기도 자동으로 같은 새 리소스를 씁니다.

### 4. 카드 이미지 Fill 규칙 통일

기존에는 월드 카드만 `cover`, IP 캐릭터는 `contain` + 배경색이었습니다
(세로형 PNG 를 잘리지 않게 하려던 처리). 이제 **전부 `cover`** 로 통일했습니다.

```css
.wcard__clip img{ width:100%; height:100%; object-fit:cover; object-position:center }
```

crop 위치는 강제하지 않고 이미지마다 `ITEMS.pos` 로 따로 줍니다.
프레임보다 세로로 긴 원본(415×604 · 476×476)만 값을 갖습니다.

| 카드 | 원본 | pos | 이유 |
|---|---|---|---|
| 블루콘 | 415×604 | `center 18%` | 아이스크림 콘 + 머리 |
| 올드보이 | 415×604 | `center 18%` | 얼굴 + 어깨 |
| 스파이시 패밀리(duo) | 476×476 | `center 18%` | 두 인물 머리 |
| 부기 | 415×604 | `center 24%` | 안경 + 눈 + 부리 |
| 키키 / 마루 / 스푸키 | 415×604 | `center 30%` | 얼굴 전체 |
| 나머지 9장 | 프레임 비율과 동일 또는 가로형 | (없음) | 잘림 없음 |

프레임 비율이 전 breakpoint 에서 동일(335:232)하므로 PC/Tablet/Mobile 의 crop 이 같습니다.

### 5. WORLD & IP 배너 교체

`assets/world-hero.png` (1920×450, 원본 PNG 무손실). 기존 `world-hero.jpg` 는 제거하고
`world.html · terms.html · privacy.html` 의 preload 까지 함께 갱신했습니다.

**컨테이너는 한 줄도 바꾸지 않았습니다.** 높이 `clamp(200px, 23.4vw, 480px)` 의 23.4vw 가
원본 비율 1/4.267 과 같아서 **854~2051px 구간에서는 crop 이 아예 없습니다.**

| 구간 | object-position | 보이는 가로 범위 |
|---|---|---|
| ≥1024 | `50% 50%` | 0.00 ~ 1.00 (crop 없음) |
| ≤1023 | `38% 50%` | 0.045 ~ 0.927 |
| ≤767 | `28% 50%` | 0.168 ~ 0.567 |
| ≤400 | `26% 50%` | 0.156 ~ 0.555 |

캐릭터는 가로 23~40%(얼굴 33%)에 있어 **모든 구간에서 프레임 안에 들어옵니다.**
세로는 어느 폭에서도 100% 라 얼굴이 잘리지 않습니다.

스크림은 원본에 좌우 그라데이션이 이미 구워져 있으므로 **52% → 30% 로 낮췄습니다**
(중복 dim 제거). 이미지에는 `filter` 를 쓰지 않았고 Light/Dark 가 같은 파일을 씁니다.
로드 전 바탕색도 새 배너의 가장자리 색 `#897C73` 로 맞춰 플래시를 없앴습니다.

### QA

```
[Lightbox]  옷가게 · Figure Collection × 11 뷰포트 × 2 테마
1920×1080 · 1600×900 · 1440×900 · 1280×800 · 1024×768 · 768×1024
430×932 · 390×844 · 375×667 · 360×740 · 320×568

□ 표시 비율 16:9 (오차 ±0.02)              ✔
□ object-fit: cover                          ✔
□ 원본 1920×1080 로드 확인                   ✔
□ detail 파일 매핑 정확                      ✔
□ 제목·카테고리·설명·번호가 화면 안          ✔
□ 좌우 화살표가 이미지와 겹치지 않음         ✔
□ 가로 overflow 0 · JS 오류 0                ✔

[배너]  9 뷰포트 × 2 테마
1920 · 1440 · 1280 · 1024 · 768 · 430 · 390 · 375 · 360

□ 배너 높이 교체 전과 동일                   ✔
□ 세로 crop 0 (얼굴 잘림 없음)               ✔
□ 캐릭터(23~40%)가 항상 프레임 안            ✔
□ 이미지 비율 왜곡 없음                      ✔
□ CSS filter 없음                            ✔
□ 텍스트와 캐릭터 겹침 없음                  ✔
□ Light / Dark 동일 리소스                   ✔

[카드]  IP 14장 전수
□ 전부 object-fit: cover                     ✔
□ 프레임에 여백 없이 Fill                    ✔
□ 소스 파일 매핑 정확                        ✔

[전체 사이트]  8 페이지 × 11 뷰포트 × (Light/Dark × KO/EN)
LIGHT/KO · DARK/KO · LIGHT/EN · DARK/EN — overflow 0 · JS 오류 0
```

---

## v47 — 모바일 Navigation 전면 개편 · 캐릭터 리소스 추가

### 1. 모바일 메뉴 — 구조를 JS 하나로 모았습니다

드로어 마크업이 8개 페이지에 그대로 복제돼 있었습니다. 아코디언 · 사용자 영역 · CTA 가
들어가면 복제본을 8벌 관리하게 되므로, **구조는 `assets/sp-nav.js` 에서 한 번만** 만들고
페이지에는 `<div id="drawer">` 껍데기와 기존 `<a>` 4개만 남겼습니다.

기존 `<a>` 는 **다시 만들지 않고 그대로 옮겨** 씁니다. 페이지마다 href 가 다르고
(`index` 는 `#about`, 나머지는 `index.html#about`), `aria-current="page"` 로 현재 위치가
표시돼 있고, `data-i18n` 으로 각 페이지 `setLang()` 이 텍스트를 갈아끼우기 때문입니다.
노드를 이동시키면 이 세 가지가 전부 살아남습니다.

```
새 파일   assets/sp-nav.js      드로어 구조 · 아코디언 · 사용자 영역 · 해시 딥링크
수정      assets/sp-nav.css     모바일 헤더 + 풀스크린 메뉴 (전면 재작성)
수정      assets/sp-i18n.js     메뉴 문자열 7개
수정      *.html (8개)          sp-nav.js 로드
```

### 2. 헤더 — 유틸리티는 한 곳에만

```
닫힘   [ SuperPlat ]                    [ Profile ] [ ☰ ]
열림   [ SuperPlat ]              [ ◐ ] [ 🌐 ] [ × ]
```

테마 · 언어는 메뉴가 열렸을 때만 헤더에 나타나고, 프로필은 자리를 내줍니다.
**메뉴 하단에는 테마/언어를 다시 노출하지 않습니다**(중복 제거).

| 항목 | 값 |
|---|---|
| 히트 영역 | 46 × 46 (세 아이콘 동일) |
| 아이콘 visual | globe 21 · moon 20 · sun 21.5 · person 21(박스 28 × 잉크비 .75) |
| 아이콘 간 gap | 4px (시각 간격 ≈ 6px) |
| Header height | 74px (≤767) · 70px (≤359) |

세 아이콘의 세로 중심축이 정확히 일치하는지 QA 에서 `±0.6px` 로 검증합니다.

언어는 globe → 작은 셀렉터. 현재 언어에 **체크 + weight 700** 만 주고 두꺼운 박스나
강한 그림자는 쓰지 않습니다.

### 3. 메뉴 계층

```
About                    ›
World & IP               ›
• News                   ⌃      ← 현재 페이지는 점 하나로만 표시
    공지사항
    업데이트
    이벤트
Support                  ⌄
─────────────────────────────
[person]  마이페이지        ›
          user@superplat.com
로그아웃                        ← 작은 secondary
[   SuperPlat 다운로드  ↓   ]
```

- Navigation `clamp(28px, 7.6vw, 32px)` / 700 / lh 1.28 · 터치 높이 60px
- 제목은 링크, **오른쪽 chevron 만** 아코디언 토글 — 제목을 눌러 이동할 수도, 화살표를
  눌러 펼칠 수도 있습니다. 현재 페이지의 아코디언은 처음부터 펼쳐집니다.
- 하위 링크는 `news.html#notice` 형태이고, `sp-nav.js` 가 해시를 읽어 해당 탭을
  실제로 선택합니다(`hashchange` 포함). 링크가 장식이 아니라 동작합니다.
- 현재 페이지 표시는 배경 블록 없이 6px 점 하나 (§05)

### 4. CTA — 다운로드

`--dl-solid-bg / --dl-solid-fg` (v46 에서 만든 헤더 다운로드 토큰)를 **그대로 공유**합니다.
Light 는 잉크 배경 + 흰 글씨, Dark 는 `#EDEFF4` + `#111318` — v46 에서 고친 다크 대비
문제가 모바일 CTA 에서도 재발하지 않습니다. height 56 · radius 14.

### 5. 모션

| 대상 | 값 |
|---|---|
| 메뉴 열기 | opacity 340ms `cubic-bezier(.22,1,.36,1)` |
| 메뉴 닫기 | opacity 220ms (delay 40ms) — 열 때보다 빠르게 |
| Navigation | opacity + translateY 10px → 0, 340ms, stagger **36ms** |
| 하단(사용자·CTA) | 340ms · delay 210ms |
| 아코디언 | height + opacity 320ms(열기) / 300ms(닫기), chevron 180° 동시 회전 |

`prefers-reduced-motion` 에서는 전부 1ms + delay 0.

### 6. 고친 버그 — 320px 영문 가로 스크롤

Community 카드 그리드가 `grid-template-columns:1fr` 였습니다. `1fr` 의 최소값은
`auto`(=콘텐츠 min-content)라서 영문 문구가 길어지면 **트랙이 컨테이너보다 넓어져**
320px 화면에서 가로 스크롤이 생겼습니다(한국어에서는 우연히 들어맞아 드러나지 않던 문제).
`minmax(0,1fr)` + `min-width:0` + `overflow-wrap:anywhere` 로 바로잡았습니다.

### 7. 캐릭터 갤러리 — 고양이 추가 + 비율 정정

「좋아하는 캐릭터에게 말을 걸어보세요」의 `CHARACTERS` 는 원본 비율별로 카드 박스를
만들고 `object-fit:contain` 을 씁니다(잘림도, 남는 여백도 없음).

- 새 `char-cat.png` (238×238) 를 **맨 앞**에 `ratio:'square'` 로 추가
- 교체된 4장(cow · crowd · band · robots)은 335×232 이므로 `'square'` → **`'wide'`** 로
  정정하고 `aspect-ratio:335/232` 트랙을 새로 만들었습니다. 예전 값을 두면 위아래에
  빈 띠가 생깁니다.

측정 결과 14장 모두 **이미지 박스 = 카드 박스**(letterbox 0 · crop 0).

### 8. WORLD & IP — 고양이 IP 추가

`ITEMS` 맨 앞에 새 IP 항목을 추가했습니다. 카드 · 상세보기 · 좌우 슬라이더가
**같은 파일 하나**(`char-cat.png`)를 참조합니다 — `detailSrc(it) = it.detail || it.img`.

```
카드      char-cat.png · object-fit:cover · 238×238 이 프레임 335:232 에서
          가로는 꽉 차고 세로만 미세 crop
상세보기  char-cat.png · object-fit:contain · 428×428 (1:1 원본 비율 유지, 강제 16:9 아님)
개수      01 / 15 — visible.length 로 자동 계산 (하드코딩 없음)
```

⚠️ **캐릭터명은 `(이름 미정)` placeholder 입니다.** 공식 이름/설정을 임의로 만들지
말라는 요청에 따라 비워 두었습니다. `world.html` 의 `ITEMS` 첫 항목 `title` 만
바꾸면 카드·상세보기·aria-label 이 한 번에 반영됩니다.

### QA

```
[모바일 메뉴]  8 페이지 × 10 뷰포트 × (Light/KO · Dark/EN)
320 · 360 · 375 · 390 · 393 · 412 · 430 · 768 · 834 · 991

□ 닫힘/열림 모두 가로 overflow 0            ✔
□ 메뉴 내부 가로 overflow 0                  ✔
□ 로고와 아이콘 충돌 없음                    ✔
□ Close 히트 영역 ≥ 44px                     ✔
□ 세 아이콘 세로 중심축 일치 (±0.6px)        ✔
□ Navigation 텍스트 줄바꿈 없음 (영문 포함)  ✔
□ body scroll lock 적용                      ✔
□ CTA 높이 52~58px · 화면 안                 ✔
□ JS 오류 0                                  ✔

[기능]
□ 메뉴 헤더 ◐ → data-theme · localStorage · body 배경 전환      ✔
□ 메뉴 헤더 🌐 → 셀렉터 → English → 메뉴·헤더·CTA·사용자 전환   ✔
□ 아코디언 펼침 + 하위 링크가 실제 탭으로 딥링크                ✔
□ 스크롤 1500px 에서 열고 ESC → 정확히 1500px 복원              ✔
□ 로그인 상태 → 마이페이지 + 이메일 + 로그아웃(secondary)       ✔

[캐릭터 · IP]
□ 갤러리 14장 이미지 박스 = 카드 박스 (letterbox 0)  ✔
□ 고양이가 갤러리 첫 번째                            ✔
□ 카드 · 상세보기 · 슬라이더가 동일 파일 참조        ✔
□ 상세보기 1:1 비율 유지 (강제 16:9 아님)            ✔
□ pagination 01 / 15 자동 계산                       ✔

[전체 사이트]  8 페이지 × 11 뷰포트 × (Light/Dark × KO/EN)
LIGHT/KO · DARK/KO · LIGHT/EN · DARK/EN — overflow 0 · JS 오류 0
```

---

## v48 — PC Hover Dropdown · 모바일 메뉴 정리 · 캐릭터 리소스 교체

### 1. PC 헤더 Hover Dropdown

`News` / `Support` 에만 붙습니다. `About` / `World & IP` 는 Direct Link 라서
chevron 도 드롭다운도 없습니다 — **모바일 메뉴와 같은 규칙**입니다.

핵심은 데이터를 하나로 둔 것입니다. `assets/sp-nav.js` 의 `SUB` 한 곳에서
PC 드롭다운과 모바일 아코디언을 **둘 다** 만듭니다. PC/모바일 메뉴 내용이
서로 달라질 수 없습니다.

```
SUB = {
  'news.html':    [notice 공지사항 · update 업데이트 · event 이벤트],
  'support.html': [faq FAQ · inquiry 1:1 문의 · download 다운로드]
}
        ├─ PC   .hdrop__menu   (hover / focus)
        └─ 모바일 .mnav__sub    (tap accordion)
```

표면 · 옵션 · 모션은 사이트 공통 Dropdown 토큰(`--sp-menu-bg` / `--sp-menu-sh` /
`--sp-opt-h` / `--sp-opt-hover`)을 그대로 씁니다. 새 디자인 시스템을 만들지 않았고,
Dark 값은 `sp-theme.css` 가 이미 정의해 둔 것을 그대로 물려받습니다.

| 항목 | 값 |
|---|---|
| min-width | 190px · padding 7px · radius 14px |
| item | min-height 42px · padding 0 15px · radius 9px |
| 헤더와의 간격 | 10px (+ 14px **invisible bridge** 로 hover 가 끊기지 않음) |
| 등장 | opacity 0→1, translateY(-4px)→0, scale .98→1, 220ms `cubic-bezier(.22,1,.36,1)` |
| 닫힘 지연 | 150ms — 커서가 헤더→메뉴로 넘어가는 동안 유지 |

접근성: `aria-haspopup` / `aria-expanded` / `role="menu"` · `menuitem`,
focus 로도 열리고 Tab 으로 탐색, ESC 로 닫힘, 바깥 클릭으로 닫힘,
다른 메뉴에 hover 하면 이전 것이 자동으로 닫힙니다.
드롭다운이 열려 있는 동안에는 스크롤 방향과 무관하게 헤더가 숨지 않습니다
(`sp-ui.js` 의 `HOLD_SEL` 에 `.hdrop.is-open` 추가).

**고친 버그** — ESC 로 닫은 뒤 포커스를 링크로 되돌리면 그 `focusin` 이
드롭다운을 즉시 다시 열었습니다. 되돌리는 순간만 잠그도록 고쳤습니다.

### 2. 모바일 메뉴 — Direct Link 정리

```
소개                          ← 우측 아이콘 없음
월드 & IP                     ← 우측 아이콘 없음
뉴스                      ⌄
고객지원                   ⌄
```

- 하위 메뉴가 없는 항목의 chevron-right 를 제거했습니다.
  "아이콘이 있으면 펼쳐진다"는 규칙이 PC/모바일 모두에서 일관됩니다.
- 현재 페이지 앞의 **dot 을 완전히 삭제**하고, 아주 얇은 밑줄
  (`text-decoration` 2px / offset 7px / 잉크 28%)로만 표시합니다.
  `::before` 를 쓰지 않으므로 텍스트 기준선이 움직이지 않습니다.
- 좌측 기준선(20px)과 Row 높이(60px)는 네 항목 모두 이전과 동일합니다.

### 3. 캐릭터 갤러리 — 라운드 통일 + 원본 교체

**문제** — 원본 PNG 대부분은 모서리 라운드가 파일에 구워져 있어서(코너 alpha=0)
카드에 `border-radius` 를 걸지 않는 구조였습니다. 그런데 나중에 교체된 일부
이미지는 코너가 **불투명**(alpha=255)이라 그대로 직각으로 보였습니다.

**해결** — 이미지마다 다르게 처리하지 않고 **공통 wrapper 한 곳**에서 통일했습니다.

```css
.marquee__card{ border-radius:clamp(9px,.78vw,12px); overflow:hidden }
.marquee__card img{ width:100%; height:100%; object-fit:cover; object-position:center }
```

곡률은 원본 baked radius(21px @415~604px ≈ 화면 11px)와 같게 맞춰서,
이미 라운드가 있는 이미지도 모양이 달라지지 않습니다.
PC · Tablet · Mobile 모두 같은 규칙입니다.

**리소스 교체** — 순서 · 슬롯 · 카드 크기 · 비율 · 간격 · 애니메이션은
하나도 바꾸지 않고, **각 슬롯의 이미지 파일만** 새 원본으로 교체했습니다.
매칭은 눈대중이 아니라 **배경색 대조**로 확정했습니다.

| 슬롯 | 배경 | 원본 |
|---|---|---|
| char-cat / sprouts / polarbear / duck / duo / suit / monsters / pink / puppy | `#FFEDAB` `#889A7A` `#99A9C6` `#BFBFBF` `#C48D8D` `#7A7A7A` `#DFCCEC` `#FFCC9F` `#99BEC6` | 원본 비율 그대로 → **crop 0%** |
| char-cow (KU) | `#CBC6A7` | 476×476 → 슬롯 335:232, `object-position:center 34%` |
| char-robots | `#FFABAC` | 476×476 → 슬롯 335:232, `object-position:center 40%` |

교체본이 오지 않은 3장(char-crowd · char-blob · char-band)은 그대로 두었고,
그중 코너가 불투명한 2장도 위 wrapper 덕분에 이제 라운드가 적용됩니다.

⚠️ cow · robots 두 장은 새 원본이 1:1 인데 슬롯은 16:11 이라 세로가 약 31%
잘립니다. "카드 비율을 바꾸지 말고 object-position 만 조정" 요청에 따라
슬롯 비율은 유지했고, 잘리는 위치를 후보값과 비교해 얼굴이 온전히 남는 값으로
정했습니다. 슬롯을 정사각으로 바꾸면 크롭 없이 보여줄 수 있습니다.

### QA

```
[PC Dropdown]  index · news · support · world × Light/Dark
□ News / Support 에만 드롭다운 (2개)                ✔
□ About / World & IP 는 aria-haspopup 없음          ✔
□ hover 로 열림 · opacity 1 · 헤더와 간격 10px      ✔
□ 폭 190~230px · 화면 밖으로 안 나감                ✔
□ 배경이 투명하지 않음 (Light/Dark 모두)            ✔
□ ESC 로 닫힘 (다시 열리지 않음)                     ✔
□ JS 오류 0                                          ✔

[모바일 메뉴]  8 페이지 × 10 뷰포트 × 2 조합 — 전 항목 통과
□ 소개 / 월드 & IP 우측 아이콘 없음                  ✔
□ dot 없음 · 현재 페이지는 밑줄만                    ✔
□ 좌측 기준선 20px · Row 높이 60px 유지              ✔

[캐릭터 갤러리]  1440 · 768 · 375
□ 14장 모두 radius 동일 (11.23px / 9px)             ✔
□ 14장 모두 overflow:hidden · object-fit:cover      ✔
□ 원본 비율과 슬롯이 같은 12장 crop 0%              ✔
□ 순서 · 슬롯 · 카드 크기 변경 없음                  ✔

[전체 사이트]  8 페이지 × 11 뷰포트 — overflow 0 · JS 오류 0
```

---

## v49 — IP 데이터 정리 · 모바일 메뉴 Typography

### 1. WORLD & IP — IP 캐릭터 데이터 정리

| 항목 | 처리 |
|---|---|
| 보리 중복 | 배열에서 **실제로 제거** (`char-bori.jpg` 항목 삭제) — 15 → 14장 |
| 맨 앞 고양이 | `(이름 미정)` → **보리**, 영문 `Bori` |
| 해피넛츠 | `char-crowd.png` ← 최신 원본 (476×476, 핑크 `#FFABEF`) |
| 엔카이브 | `char-band.png` ← 최신 원본 (604×375, 연보라 `#B9B7E8`) |

두 원본 모두 **모서리 라운드가 파일에 구워져** 있어(코너 alpha=0) 카드에서
직각으로 보이던 문제도 함께 사라졌습니다.

**개수는 어디에도 하드코딩돼 있지 않습니다.** Grid · 필터 · 검색 · Lightbox
pagination · Prev/Next 가 전부 `visible.length` 로 계산되므로 항목 하나를 지우면
`01 / 14` … `14 / 14` 로 자동 갱신됩니다.

카드 · 상세보기 · 좌우 슬라이더는 `detailSrc(it) = it.detail || it.img` 한 곳에서
경로를 정하므로 썸네일과 상세 이미지가 갈라질 수 없습니다.

이름도 같은 방식으로 통일했습니다. 새 `ttl()` 헬퍼가 카드 제목 · aria-label ·
Lightbox 제목 · alt 를 **모두 같은 공용 사전**(`assets/sp-i18n.js`)에 통과시킵니다.
사전에 없는 이름은 원문 그대로 나가므로 고유명사는 안전하고, `보리 → Bori` 만
등록해 두었습니다.

### 2. 모바일 메뉴 Typography

큰 글자에 기대던 계층을 **글자는 한 단계 줄이고 여백을 키우는** 쪽으로 바꿨습니다.

| 항목 | 이전 | 현재 |
|---|---|---|
| Main nav | `clamp(28px, 7.6vw, 32px)` / 700 / `-.035em` | `clamp(30px, 8vw, 32px)` / **680** / `-.02em` |
| Row 높이 | 60px | **72px** |
| Chevron | 17px | **19px** |
| 로그인 | 17px / 600 | **21px / 650** |
| 안내문 | 13px | **14.5px** |
| Download CTA | 56px | 56px (그대로) |

실측 — 360:30px · 375:30px · 390:31.2px · 430:32px (요청 표와 일치)

⚠️ 요청하신 "min-height 72~80px" 와 "메뉴 간 visual gap 20~28px" 는 서로
충돌합니다. 30px 글자의 줄 상자가 38.4px 이라 행 높이 72px 이면 남는 여백이
33.6px 이 되기 때문입니다. 터치 영역이 더 중요하다고 보아 **min-height 72px**
(범위의 최소값)를 택했고, 그 결과 gap 은 31~34px 입니다. gap 을 28px 이하로
맞추려면 행 높이를 66px 로 내리면 됩니다.

### QA

```
[IP 데이터]  9 뷰포트 × 2 테마 × 2 언어 (1920 · 1440 · 1280 · 1024 · 768 · 430 · 390 · 375 · 360)
□ IP 카드 14장 · 보리 정확히 1개 · 첫 카드가 보리     ✔
□ char-bori.jpg 더 이상 참조되지 않음                  ✔
□ 해피넛츠 / 엔카이브 썸네일 = 상세보기 이미지          ✔
□ 이미지 비율 왜곡 없음 (natAR = boxAR)                ✔
□ Lightbox pagination "/ 14"                           ✔
□ 카드 radius 일관 · object-fit cover 일관              ✔
□ 한/영 이름 동기화 (보리 / Bori)                       ✔
□ 가로 overflow 0 · JS 오류 0                           ✔

[Typography]  4 뷰포트 × 2 테마 × 2 언어
□ 360:30 · 375:30 · 390:31.2 · 430:32                  ✔
□ weight 680 · line-height 1.28 · letter-spacing -.02em ✔
□ row 72px · chevron 19px · 로그인 21px · 안내문 14.5px  ✔
□ 메뉴 텍스트 줄바꿈 없음 (실제 줄 상자 수로 검증)       ✔
□ CTA 56px · 화면 안                                    ✔

[모바일 메뉴 전체]  8 페이지 × 10 뷰포트 × 2 조합 — 전 항목 통과
[전체 사이트]  8 페이지 × 11 뷰포트 — overflow 0 · JS 오류 0
```

---

## v50 — 카드 서브텍스트 전면 교체 · 모바일 메뉴 타입 스케일

### 1. WORLD / IP 카드 서브텍스트

모든 카드에 공통으로 박혀 있던 **"전시 / 도슨트 캐릭터"** 를 없애고,
공간 12개 · 캐릭터 13개에 각각의 한 줄 설명을 넣었습니다.
문구는 화면에 하드코딩하지 않고 **`ITEMS[].desc` 한 필드**에만 두었습니다.

```
ITEMS[].desc  ──┬── 카드 서브텍스트   (.wcard__meta)
                ├── 상세보기 설명     (.wlb__desc)
                └── 검색 · 필터 결과   (같은 배열을 그대로 씀)
```

영문은 `ttl()` 이 공용 사전(`assets/sp-i18n.js`)에서 같은 문장을 키로 찾아옵니다.
PC/모바일이 별도 번역 데이터를 갖지 않고, 사전에 없으면 원문이 그대로 나갑니다.

**가독성** — Light `#1C1C1C` / `opacity:1` 고정, Dark 는 새 토큰으로 분기합니다.

```css
:root{ --wcard-desc:#1C1C1C }
html[data-theme="dark"]{ --wcard-desc:rgba(255,255,255,.82) }
.wcard__meta{ color:var(--wcard-desc); opacity:1 }
```

기존 다크 규칙이 `--body-2nd`(흰색 56%)로 덮어쓰고 있어서 토큰이 먹지 않았는데,
그 한 줄도 같은 토큰으로 돌렸습니다. 실측 대비 Light 17.0 : 1 · Dark 18.3 : 1.

**타이포 · 높이** — WORLD 와 IP 가 같은 `.wcard__meta` 하나를 쓰므로 탭을 오가도
밀도가 달라지지 않습니다.

| | 값 |
|---|---|
| font-size | `clamp(14px, .35vw + 12.9px, 16px)` · 모바일 15px · ≤374px 14px |
| line-height / weight | 1.55 / 400 |
| 줄 수 | `-webkit-line-clamp:2` |

⚠️ 2줄 자리를 `min-height` 로 잡았더니 1줄 카드와 2줄 카드의 반올림이 갈려
**46 / 47px 로 1px 씩 어긋났습니다.** `height` 로 고정해서 모든 카드가 같은 값으로
떨어지게 했습니다.

**⚠️ 오해하기 쉬운 부분 — 카드 높이는 고정값이 아닙니다.**
`height` 를 준 것은 `.wcard__meta`(설명 2줄 자리) 하나뿐이고, 그마저도 `em` 기준
(`calc(2 * 1.55em)`)이라 폰트 크기를 따라 같이 줄어듭니다.
`.wcard` 자체에는 `height` 선언이 없고, 이미지 영역이 `aspect-ratio:335/232` 로
열 너비를 따라가므로 카드 전체 높이는 breakpoint 마다 달라집니다.

```
vw     열   카드 높이   이미지 높이   설명 폰트 / 2줄 높이
1920   4    499px      232px        16px    / 49.6px
1440   4    441px      218px        16px    / 49.6px   ← README 본문의 441 은 이 한 지점의 실측값
1280   4    403px      193px        16px    / 49.6px
1024   3    400px      207px        16px    / 49.6px
 768   2    412px      234px        15.6px  / 48.3px
 430   1    438px      270px        15px    / 46.5px
 390   1    411px      242px        15px    / 46.5px
 375   1    400px      232px        15px    / 46.5px
 360   1    387px      222px        14px    / 43.4px
```

각 breakpoint 안에서는 모든 카드 높이가 서로 같고(정렬 유지), 설명이 2줄을 넘어
잘리는 카드는 없습니다.

⚠️ Blue Lagoon · Broccoli Ent 두 장은 문구 목록에 없어서, 이미지에서 확인되는
범위로만 적어 두었습니다 (`world.html` ITEMS 의 해당 두 줄에 주석 표시).
Cafe 두 번째 카드는 같은 공간이라 첫 번째와 같은 문장을 씁니다.

### 2. 모바일 메뉴 타입 스케일

메인 메뉴가 화면을 압도하지 않도록 한 단계 더 내렸습니다.
램프를 두 지점(375→26 · 430→27)으로 풀어서 **375px 에서 정확히 26px** 이 나옵니다.

```css
font-size: clamp(25px, calc(19.2px + 1.82vw), 27px);
/* 실측  360:25.75 · 375:26.03 · 390:26.30 · 430:27.00 */
```

| | 이전 | 현재 |
|---|---|---|
| font-size @375 | 30px | **26px** |
| weight / line-height | 680 / 1.28 | **670 / 1.3** |
| Row min-height | 72px | **60px** |
| 메뉴 간 visual gap | 31~34px | **33~34.5px** (list gap 8px) |
| Chevron | 19px | **17px** |

로고 · 유틸리티 · 계정 · 로그아웃 · CTA 는 그대로입니다. PC 헤더는 무관합니다.

### QA

```
[카드 설명]  2 탭 × 9 뷰포트 × 2 테마 × 2 언어
1920 · 1440 · 1280 · 1024 · 768 · 430 · 390 · 375 · 360

□ "전시 / 도슨트 캐릭터" 완전 제거 (KO/EN 모두)   ✔
□ 카드마다 서로 다른 설명 (중복 없음)             ✔
□ EN 모드에 한국어 잔존 없음 / KO 모드에 영문 없음 ✔
□ Light #1C1C1C · opacity 1                       ✔
□ Dark rgba(255,255,255,.82) · 대비 18.3:1        ✔
□ font 14~16 · line-height 1.55 · weight 400      ✔
□ line-clamp 2 · 설명 영역 높이 전 카드 동일       ✔
□ 카드 높이 전 카드 동일 (441px)                   ✔
□ 상세보기 = 카드와 같은 문장                      ✔
□ 가로 overflow 0 · JS 오류 0                      ✔

[모바일 메뉴 타이포]  4 뷰포트 × 2 테마 × 2 언어
□ 375px computed font-size = 26.03px              ✔
□ 360:25.75 · 390:26.30 · 430:27.00 (25~27 안)    ✔
□ weight 670 · line-height 1.3 · ls -.02em        ✔
□ row 60px (56~64) · gap 33~34.5px (34~42)        ✔
□ chevron 17px (16~18)                            ✔
□ 메뉴 텍스트 줄바꿈 없음                          ✔

[모바일 메뉴 전체]  8 페이지 × 10 뷰포트 × 2 조합 — 통과
[전체 사이트]  8 페이지 × 11 뷰포트 — overflow 0 · JS 오류 0
```

---

## v51 — IP캐릭터 상세보기 1:1 이미지

### 1. 데이터 — 썸네일과 상세 이미지 분리

IP 14개 항목에 `detail` 을 추가했습니다. **카드 썸네일(`img`)은 한 장도 건드리지
않았습니다.**

```js
{ kind:'ip', title:'보리', img:'char-cat.png',      // 카드 썸네일 238×238 (그대로)
                        detail:'char-cat-detail.png' } // 상세보기 1080×1080 (신규)
```

경로는 기존 `detailSrc(it) = it.detail || it.img` 한 곳에서만 정해집니다.
WORLD 항목은 `detail` 이 이미 있거나(옷가게 · Figure collection) 없으면 썸네일을
그대로 쓰므로 **16:9 상세보기는 이전과 완전히 동일**합니다.

연결은 첨부 순서 = 현재 카드 순서로 **위치 기준** 매칭했습니다
(보리 · 푸푸 · 블루콘 · 두유 · KU · 키키 · 올드보이 · 스파이시 패밀리 · 부기 ·
엔카이브 · 마루 · 해피넛츠 · 스파이시 패밀리 · 스푸키).

### 2. 상세보기 — 같은 컴포넌트, 비율만 분기

Detail Viewer 를 새로 만들지 않고 기존 컴포넌트에서 타입만 갈라냅니다.

```
WORLD  → .is-world   aspect-ratio:16/9 · object-fit:cover
IP     → .is-ip      aspect-ratio:1/1  · object-fit:contain
```

`contain` 이라 1080×1080 원본이 정사각 박스 안에 **전체가 그대로** 들어갑니다 —
crop 없음, 왜곡 없음, 얼굴·머리 잘림 없음. 새 배경색 · gradient · dim · blur 도
추가하지 않았습니다.

크기는 PC 고정 px 이 아니라 viewport 기준으로 계산합니다.

```
PC      min(86vw − 좌우 화살표 자리, 62vh, 620)   → 1024~1920 에서 558px
Mobile  min(100vw − 40, 56vh)                     → 360:320 · 375:335 · 390:350 · 430:390
```

Overlay · Close · Prev/Next · 캐릭터명 · 카테고리 · 설명 · `01 / 14` ·
등장/퇴장 애니메이션은 손대지 않았습니다.

### 3. 보리 상세 이미지 재교체

첫 번째 카드 보리의 `char-cat-detail.png` 만 새 1080×1080 원본으로 다시
교체했습니다. 썸네일(`char-cat.png` 238×238)과 나머지 13장은 그대로입니다.

### QA

```
[IP 상세보기]  14장 전수 × 9 뷰포트 × 2 테마 (총 252 케이스)
1920 · 1440 · 1280 · 1024 · 768 · 430 · 390 · 375 · 360

□ 카드 썸네일 14장 모두 변경 없음               ✔
□ 상세 이미지가 detail 파일로 정확히 매핑        ✔
□ 상세 원본 naturalSize 1080×1080               ✔
□ 표시 비율 1:1 (오차 ±0.01)                     ✔
□ object-fit: contain (crop 0)                   ✔
□ 이미지가 viewport 를 넘지 않음                 ✔
□ pagination "/ 14"                              ✔
□ JS 오류 0                                      ✔

[WORLD 상세보기 회귀]  11 뷰포트 × 2 테마 — 16:9 · cover · 1920×1080 유지  ✔
[전체 사이트]  8 페이지 × 11 뷰포트 — overflow 0 · JS 오류 0
```

---

## v52 — 마이페이지 구독 관리 · 플랜 비교표 Dark Mode

### 고친 버그 두 가지

**① 선택 컬럼이 다크에서 흰색으로 남아 있었습니다.**
`.mpmatrix .is-cur{background:#F4F8FD}` 가 리터럴이라 다크에도 그대로 적용돼,
현재 플랜 열만 밝게 떠 보였습니다.

**② sticky 헤더 배경이 `transparent` 였습니다.**
스크롤하면 아래 행이 헤더 글자와 겹쳐 보였습니다.

두 값 모두 리터럴을 토큰으로 빼고 Dark 만 분기했습니다.
**Light 값은 실측으로 이전과 동일**합니다 (`rgb(244,248,253)` / `rgb(245,246,247)`).

| Token | Light (불변) | Dark |
|---|---|---|
| `--mx-head-bg` | `#F5F6F7` | `#1B1F24` (불투명) |
| `--mx-sel-bg` | `#F4F8FD` | `rgba(255,255,255,.055)` |
| `--mx-sel-line` | `transparent` | `rgba(255,255,255,.34)` — 헤더 상단 2px |
| `--mx-row-hover` | `transparent` | `rgba(255,255,255,.03)` |
| `--mx-line` / `-strong` | `rgba(ink,.08)` | `.08` / `.12` |
| `--mx-key` (기능명) | `var(--ink)` | `rgba(255,255,255,.88)` |
| `--mx-base` (값 기본) | `var(--body)` | `rgba(255,255,255,.78)` |
| `--mx-val` (지원) | `var(--ink)` | `rgba(255,255,255,.94)` |
| `--mx-off` (미지원) | `var(--body)` | `rgba(255,255,255,.34)` |

미지원 값(`-` / `—`)에 `is-off` 클래스를 붙여 **지원/미지원 대비를 나눴습니다**
(다크 16.19 : 1 vs 3.11 : 1). Light 에서는 `--mx-off` 가 기존 `--body` 라 변화 없습니다.

⚠️ 작업 중 만든 실수 — 처음에 `html[data-theme="dark"] .mpmatrix td{color:…}` 로
한 번에 덮었더니 특이도(0,2,2)가 `.mpmatrix td.is-on`(0,2,1)을 이겨서 **모든 셀이
같은 색**이 됐습니다. 계층이 사라지는 것을 QA 가 잡아냈고, 기본색도 토큰
(`--mx-base`)으로 돌려 해결했습니다.

### 함께 정리한 것

- **행/열 추적** — 기능명 열을 `position:sticky; left:0` 으로 고정해 가로 스크롤에서도
  어떤 항목인지 놓치지 않습니다. 헤더는 기존대로 `top:0` 고정(이제 불투명).
- **Row hover** — 다크에서만 `rgba(255,255,255,.03)`, 160ms. 선택 컬럼보다 약합니다.
- 표는 별도 흰 박스를 만들지 않고 페이지 배경 위에서 이어집니다(기존 구조 유지).
- 모바일은 표 구조를 그대로 두고 가로 스크롤로 대응(재설계 없음).

### QA

```
9 뷰포트 × 2 테마 (1920 · 1440 · 1280 · 1024 · 768 · 430 · 390 · 375 · 360)

□ Light 선택컬럼 / 헤더 색 이전과 동일               ✔
□ Dark 선택컬럼이 밝은 배경이 아님 (alpha .055)      ✔
□ Dark sticky 헤더 불투명                            ✔
□ 플랜명 대비 ≥ 4.5:1                                ✔ (16.2:1)
□ 기능명 대비 ≥ 4.5:1                                ✔ (14.2:1)
□ 지원값 대비 ≥ 4.5:1                                ✔ (16.2:1)
□ 미지원값이 지원값보다 흐림                          ✔ (3.11:1)
□ 헤더 / 기능명 열 sticky                            ✔
□ 페이지 가로 overflow 0 · JS 오류 0                 ✔

[전체 사이트]  8 페이지 × 11 뷰포트 × Light/Dark — overflow 0 · JS 오류 0
```

---

## v52a — IP 상세 이미지 미노출 (패키징 버그 수정)

**코드 문제가 아니라 제 압축 방식 문제였습니다.**

v51/v52 에서 `superplat-detail-assets.zip` 을 `zip -j`(junk paths) 로 만들었습니다.
그 결과 압축을 풀면 **폴더 구조 없이 PNG 14장이 최상위에 흩어져서** 나왔고,
`superplat/assets/` 안으로 들어가지 못해 14장 전부 404 가 됐습니다.

점검 결과 코드 쪽은 이상이 없었습니다.

```
□ 14장 모두 superplat/assets/ 에 존재            ✔
□ ITEMS[].detail 값 = 실제 파일명 (대소문자 포함) ✔ 16/16 일치
□ 절대경로 · file:// · 업로드 임시경로 참조       없음 (전부 파일명만)
□ 브라우저 요청 경로 = assets/파일명.png (상대)   ✔
□ detailSrc(it) = it.detail || it.img 로직        그대로 유지
```

### 패키징 수정

`-j` 를 빼고 경로를 그대로 담습니다.

```
superplat-detail-assets.zip
└─ superplat/
   └─ assets/
      ├─ char-cat-detail.png
      └─ … (14장)
```

두 zip 을 **같은 위치에 풀어서 덮어쓰기만 하면** 바로 동작합니다.
경로를 손댈 필요가 없습니다.

### 검증 — 실제로 두 zip 을 풀어서 확인했습니다

작업 폴더가 아니라 **두 zip 을 새 디렉터리에 병합 해제한 결과물**을 서버로 띄우고,
Playwright 로 14개 카드를 하나씩 열어 Network 응답과 렌더 상태를 실측했습니다.

```
Light @1440 · Dark @390 — 각 14장

01 보리 · 02 포포스 · 03 블루 · 04 두유 · 05 건국프렌즈 · 06 키키 ·
07 올드보이(이우진) · 08 사공이호 · 09 부기 · 10 엔카이브 · 11 마루 ·
12 Happy Nuts · 13 스파이시 패밀리 · 14 스푸키

□ HTTP 200                       28/28  ✔
□ naturalSize 1080×1080          28/28  ✔
□ broken image (naturalWidth 0)  0건    ✔
□ pagination 01/14 … 14/14       ✔
□ JS 오류 0                       ✔
```

UI · 썸네일 · 카드 순서 · WORLD 16:9 · IP 1:1 · contain · Modal · 제목 · 설명 ·
Light/Dark · 반응형 · 애니메이션은 **한 줄도 바꾸지 않았습니다.**

---

## v53 — NEWS 모바일 정보 위계 + 다운로드 드라이버 카드 Dark Mode

두 건 모두 **해당 영역 밖은 한 줄도 건드리지 않았습니다.**
레이아웃 · 순서 · 이미지 · 데이터 · 인터랙션 · 애니메이션 · 브레이크포인트 변경 없음.

### A. NEWS 모바일 — 제목이 가장 진하게 읽히도록

**원인**
탭 비활성 · 메타 label · 메타 value 가 전부 같은 `--body-2nd`(잉크 46~56%)
하나를 쓰고 있었습니다. 그래서

- 비활성 탭이 **Disabled 처럼** 보이고
- label 과 value 가 한 덩어리로 뭉쳐 읽히고
- 제목이 메타보다 뚜렷하게 앞서지 못했습니다.

**수정** — 5개 토큰으로 층을 갈랐습니다.

| 토큰 | Light | Dark |
|---|---|---|
| `--news-title` | `#1C1C1C` | `#F5F5F5` |
| `--news-tab-off` | `#5F6368` | `rgba(255,255,255,.72)` |
| `--news-meta-label` | `#8A8F98` | `rgba(255,255,255,.56)` |
| `--news-meta-value` | `#6B7078` | `rgba(255,255,255,.74)` |
| `--news-divider` | `rgba(var(--ink-rgb),.12)` | `rgba(255,255,255,.10)` |

적용 규칙은 **전부 `@media (max-width:767px)` 안에만** 있습니다.
Light 토큰은 `news.html`, Dark 토큰은 `sp-theme.css` 의 기존
`html[data-theme="dark"]` 블록 안에 넣어 테마 분기만 했습니다.

- 제목 `font-weight:700` · `opacity:1` — secondary 토큰 / 투명도 미사용
- 리스트는 카드 UI 가 아니라 **divider** 유지 (그림자 · 테두리 없음)
- 검색 UI · PC NEWS · 뉴스 데이터 · 상세 페이지 · 필터 · 페이지네이션 그대로

이벤트 탭(`.ecard`)도 같은 제목 · 메타 토큰을 쓰게 했습니다.
⚠️ `.ecard__title` 기본 규칙과 명시도가 같아서, override 를 **기본 규칙보다
뒤쪽** `@media (max-width:767px)` 블록에 두어야 이깁니다. 처음엔 앞에 두어
`rgb(25,31,40)`(=`--ink`)이 그대로 나왔고, QA 실측에서 잡아 옮겼습니다.

**QA — 360 / 375 / 390 / 430 × Light / Dark × 3탭 = 24조합**

```
□ 제목 색 Light rgb(28,28,28) / Dark rgb(245,245,245)   24/24 ✔
□ 제목 weight 700 · opacity 1                           24/24 ✔
□ 제목 최대 2줄 (폰트 축소 없음)                          maxLines 2 ✔
□ 가로 overflow                                         0건   ✔
```

대비 (알파는 배경에 합성 후 측정)

| | Light | Dark |
|---|---|---|
| 제목 | 17.04 : 1 | 16.78 : 1 |
| 탭 Active | 17.04 : 1 | 16.88 : 1 |
| 탭 Inactive | 6.05 : 1 | 9.78 : 1 |
| 메타 value | 4.98 : 1 | 10.28 : 1 |
| 메타 label | 3.25 : 1 | 6.34 : 1 |

> 메타 label Light 3.25:1 은 요청하신 `#8A8F98` 값 그대로입니다.
> 본문이 아닌 보조 라벨이라 그대로 두었지만, AA(4.5:1)를 맞추려면
> `#767B84` 정도로 한 단계만 내리면 됩니다. 지시해주시면 반영하겠습니다.

**PC 무변경 실측** (1920/1440/1280/1024/768 × Light/Dark)

```
title  Light rgb(25,31,40) = --ink       Dark rgb(243,246,251) = --ink
tab off rgba(23,26,33,.46)               rgba(243,246,251,.56)
divider rgba(23,26,33,.10)               rgba(243,246,251,.10)
→ 전부 수정 이전 값과 동일
```

### B. 다운로드 — 드라이버 카드 Dark Mode

`sp-theme.css` 의 `html[data-theme="dark"]` 안에서만 수정했습니다.
새 컴포넌트를 만들지 않고 기존 `.drv` 컴포넌트의 Dark 값만 바꿉니다.

| 층 | 값 |
|---|---|
| Card | `#191919` · border `rgba(255,255,255,.10)` · shadow 없음 · radius 16px 유지 |
| Info Area | `#0D0D0D` — **divider 없이 색으로만** 분리 |
| Product Name | `#E5E5E5` · 700 · `opacity:1` |
| Button | `#444444` / `#FFFFFF` / border `rgba(255,255,255,.06)` |
| Hover | `#505050` |
| Active | `#3A3A3A` + `scale(.99)` |
| Transition | 200ms · `prefers-reduced-motion` 시 transform 제거 |
| Focus | `outline:2px solid #FFFFFF` · offset 2px |

토큰(`--drv-card` / `--drv-info` / `--drv-btn` …)으로 뺐으니 값 조정은 한 줄입니다.

**⚠️ 로고 영역만 시안값(#191919)을 쓰지 않았습니다 — 실측 근거**

네 벤더 로고 PNG 의 불투명 픽셀을 측정했습니다.

| 파일 | 평균 휘도 L | 어두운 픽셀(L<70) |
|---|---|---|
| `drv-directx.png` | **0.0** | **100.0 %** |
| `drv-amd.png` | 79.3 | 73.1 % |
| `drv-nvidia.png` | 112.1 | 32.5 % |
| `drv-intel.png` | 97.4 | 1.0 % |

네 로고 모두 **투명 배경 + 어두운 잉크**입니다.
`#191919`(L≈25) 위에 얹으면 DirectX 는 완전히 사라지고 AMD 워드마크도
거의 읽히지 않습니다. 로고에 `filter` / 색보정을 거는 것은 금지 사항이라
(§ "이미지에는 어떤 filter 도 걸지 않습니다") **로고 판만 밝게 남겼습니다.**

밝은 색 로고 원본을 주시면 `--drv-media` 한 줄만 `#191919` 로 바꾸면 됩니다.

**⚠️ 모바일 버튼 높이 — 시안 52~56px vs 현재 48px**

시안에는 모바일 다운로드 버튼 `min-height: 52~56px` 이 있습니다.
높이는 테마와 무관한 값이라 올리면 **Light Mode 레이아웃도 함께 바뀝니다.**
"Light Mode 변경 금지" 를 우선해 48px 을 유지했습니다
(터치 타깃 ≥44px 은 충족). 두 테마 모두 52px 로 올려도 되는지 알려주세요.

**QA — 1920/1440/1280/1024/768/430/390/375/360 × Light / Dark**

```
□ card #191919 · line rgba(255,255,255,.10) · box-shadow none   ✔
□ info #0D0D0D · name #E5E5E5 w700 o1                           ✔
□ button #444444 / #FFFFFF / border rgba(255,255,255,.06)       ✔
□ 로고 object-fit:contain · filter:none · 원본 비율             ✔
□ 카드 4장 높이 동일 (예: 1440 → 364/364/364/364)               ✔
□ 로고 영역 높이 동일 · 버튼 높이 48/48/48/48 · 버튼 width 100% ✔
□ 가로 overflow 0                                               ✔
```

대비

```
name #E5E5E5 on #0D0D0D   15.43 : 1   (AA / AAA)
btn  #FFFFFF on #444444    9.74 : 1   (AA / AAA)
btn  #444444 on #191919    1.81 : 1   (표면 분리 — 텍스트 아님)
info #0D0D0D on #191919    1.11 : 1   (표면 분리 — 텍스트 아님)
```

**Light 무변경 실측** — 두 테마를 같은 스크립트로 돌려 비교했습니다.

```
Light card rgb(255,255,255) · media rgb(243,243,243) · btn rgb(25,31,40)/#fff
카드 높이 1920~360 : 379/364/337/295/384/408/378/366/355
Dark 카드 높이     : 379/364/337/295/384/408/378/366/355   → diff 0
```

### 전체 회귀

```
8 페이지 × 3840~320 × Light/Dark × KO/EN
□ 가로 overflow 최대   0 (여백 -15 = 스크롤바)  ✔
□ JS 오류             0                        ✔
```

---

## v53a — 패키징: 단일 실행 ZIP

`superplat.zip` **하나만** 전달합니다. 한 번 풀면 바로 실행됩니다.
별도 asset zip 을 수동 병합하는 방식은 폐기했습니다.

```
superplat.zip
└─ superplat/
   ├─ index.html · world.html · news.html · support.html
   ├─ auth.html · mypage.html · terms.html · privacy.html
   └─ assets/
      ├─ 사이트 리소스 · WORLD 상세 이미지
      ├─ IP캐릭터 상세 이미지 14장 (char-*-detail.png)
      └─ fonts/ (Pretendard Variable 로컬 폴백)
```

**UI / CSS / JS / 카드 / NEWS / Dark Mode / Responsive 는 변경하지 않았습니다.**

### 왜 용량 작업이 필요했나

전달 채널의 업로드 상한이 **30 MiB** 입니다. v53 원본을 그대로 하나로 묶으면
**31.61 MiB** 라서 실제로 거부됩니다(추측이 아니라 업로드를 시도해 확인했습니다).
그래서 **화면에 보이는 것을 바꾸지 않는 범위**에서만 줄였습니다.

| 작업 | 절감 | 화질 영향 |
|---|---|---|
| PNG 무손실 재인코딩 (`optimize` + `optipng -o5 -strip all`) | 2.7 MiB | **없음 — 픽셀 동일** |
| 불투명 RGBA → RGB (알파가 전부 255인 17장) | 위에 포함 | **없음 — 알파가 무의미한 파일만** |
| 미참조 파일 8개 삭제 | 0.76 MiB | 없음 (코드에서 한 번도 참조 안 됨) |
| JPEG 무손실 최적화 (`jpegtran -optimize -progressive`) | 0.008 MiB | **없음 — 픽셀 동일** |
| `.webm` 소스 3개 제거 | 2.48 MiB | 아래 참고 |

**PNG 픽셀 동일성 검증** — 40장 전부 원본과 1:1 비교했습니다.

```
compared 40 PNGs — mismatches: 0
(알파가 있는 파일은 RGBA, 없는 파일은 RGB 로 맞춰 전 픽셀 diff)
```

삭제한 미참조 파일: `char-bori.jpg` · `drv-{amd,directx,intel,nvidia}.jpg` ·
`hero-day.jpg` · `hero-night.jpg` · `world-in-the-stillness.jpg`
(모든 html / js / css 를 문자열 검색해 참조 0건 확인. 필요하시면 되돌립니다.)

### ⚠️ `.webm` 제거 — 판단이 필요한 부분입니다

`index.html` 의 `<video>` 3개는 `<source mp4>` 가 **먼저** 선언되어 있어,
H.264 를 지원하는 브라우저는 webm 을 절대 쓰지 않습니다.
Chrome · Edge · Safari · Firefox 는 전부 H.264 를 재생하므로
실사용 환경에서 화면 변화가 없습니다. 그래서 webm 3개와
해당 `<source>` 3줄을 제거했습니다.

다만 정직하게 적어둡니다 — **독점 코덱이 빠진 Chromium 빌드**
(일부 리눅스 배포판 Chromium, headless CI)에서는 webm 이 실제 폴백이었습니다.
이 저장소 QA용 headless Chromium 이 정확히 그 경우라, 아래처럼 관측됩니다.

```
제거 전 : currentSrc = superplat-video-720.webm   readyState 4 (재생 가능)
제거 후 : currentSrc = superplat-video.mp4        readyState 0 (headless 에 H.264 없음)
→ 파일 문제가 아닙니다. video.error = null, HTTP 200, ffprobe 결과 h264 정상
   superplat-video.mp4      h264 1920×1080 17.2s
   superplat-video-720.mp4  h264 1280× 720 17.2s
   community-friends.mp4    h264 1114× 626 10.0s
   community-events.mp4     h264 1118× 628 10.0s
```

webm 을 되살리려면 대신 2.5 MiB 를 다른 곳에서 빼야 합니다.
후보는 (a) 번들 폰트 `PretendardVariable.woff2` 1.96 MiB 제거 — CDN 이 1순위라
온라인에서는 동일하지만 **오프라인에서 타이포가 전부 바뀝니다**,
(b) 1920×1080 WORLD 상세 PNG 2장을 손실 재인코딩 — 이미지 재가공 금지 규칙에
어긋납니다. 둘 다 webm 제거보다 부작용이 커서 webm 을 골랐습니다.
다른 선택을 원하시면 말씀해주세요.

### 전달 전 검증 — 지시하신 6단계 그대로

```
1. 새 빈 디렉터리 /tmp/verify 생성                                    ✔
2. superplat.zip 하나만 압축 해제                                     ✔
   → html 8 · char-*-detail.png 14 · mp4 4 · fonts 2 · webm 0
3. 해당 압축 해제본을 http://127.0.0.1:8199 로 실제 서빙               ✔
4. WORLD & IP > IP캐릭터 상세보기 14개 전부 열기 (Light@1440 · Dark@390) ✔
5. Network 에서 detail 이미지 HTTP 200                    28/28 ✔
   naturalSize 1080×1080                                 28/28 ✔
   경로가 전부 상대경로 assets/…                          28/28 ✔
   pagination 01/14 … 14/14                                    ✔
6. broken image                                            0건 ✔
   non-200 리소스 (8페이지 전체)                            0건 ✔
   JS 오류                                                 0건 ✔
```

> QA 스크립트 수정 2건 — 이전 실행에서 뜬 오탐이었습니다.
> · 라이트박스는 닫을 때 `src` 를 지웁니다(다음에 열 때 잔상 방지).
>   `src` 없고 숨겨진 `img` 를 "깨진 이미지"로 세고 있어 제외 조건을 넣었습니다.
> · `cdn.jsdelivr.net` 폰트 요청 실패는 이 샌드박스의 egress 차단입니다.
>   로컬 `assets/fonts/PretendardVariable.woff2` 폴백이 200 으로 서빙되므로
>   패키징 결함이 아닙니다. 외부 도메인 실패는 집계에서 뺐습니다.

### 반응형 회귀 (압축 해제본 기준)

```
8 페이지 × 3840 / 2560 / 1920 / 1600 / 1440 / 1280 / 1024 / 768 / 430 / 412 / 390 / 375 / 360 / 320
□ 가로 overflow 최대   0 (여백 -15 = 스크롤바)   Light · Dark  ✔
□ JS 오류             0                                      ✔
```

### 최종

```
superplat.zip   29.14 MiB   (상한 30 MiB)
```

---

## v54 — 이벤트 상세를 공지사항 상세와 같은 중앙 정렬 시스템으로 통일

`news.html` 만 수정했습니다. 이벤트 데이터 · 제목 · 날짜 · 대표 이미지 파일 ·
공유 기능 · Header · Footer · NEWS 목록 · 검색 · 필터 · 이전/다음글 · 테마 구조 ·
route 는 그대로입니다.

### 원인 — 컨테이너는 이미 같았고, override 3줄이 축을 틀고 있었습니다

`.article` 컨테이너는 두 상세가 **처음부터 동일**했습니다.

```css
.article{--read:min(730px,100%); width:var(--read); margin-inline:auto}
.article__meta {justify-content:center}
.article__title{text-align:center}
.article__share{justify-content:center}
```

그런데 아래 3줄이 이벤트에서만 그걸 되돌리고 있었습니다.

```css
.article--event .article__title{text-align:left}       /* 삭제 */
.article--event .article__meta {justify-content:flex-start}  /* 삭제 */
.article--event .article__share{justify-content:flex-start}  /* 삭제 */
```

3줄을 지우니 max-width · top spacing · title size · metadata 위계 ·
share 크기 · section spacing 이 **자동으로** 공지사항과 같아졌습니다.
새 레이아웃을 만들지 않았습니다.

### 대표 이미지 — 자리만 옮기고 파일 · 비율 · radius 는 그대로

이전에는 `<article>` 최상단, meta 보다도 위에 있어서 제목 영역과 이미지의
좌우 기준선이 달라 보였습니다. 이제 본문 안에서 공지사항의 `.article__fig` 와
**같은 자리(리드 문단 바로 아래)** 에 놓입니다.

```
[Category + Date] → [Title] → [Share] → [Body 리드] → [대표 이미지] → [본문/추가]
```

마크업에서 `class="article__fig article__hero"` 두 개를 함께 붙여
공지사항과 같은 상하 리듬(`margin-top:clamp(28px,3.1vw,60px)`)을 쓰고,
`aspect-ratio:16/9` · `border-radius:24px(모바일 16px)` 만 이벤트 값으로
유지합니다. 이미지 파일 · 원본 비율 · `object-fit` 은 그대로입니다.
캡션(`사진제공 = SuperPlat`)은 이벤트에 원래 없던 문구라 붙이지 않았습니다.

페이지 구조는 중앙, 본문 문단은 좌측 정렬 — 실측 `text-align: start` 유지.

### ⚠️ 같이 고친 선행 버그 — `}` 하나가 규칙을 삼키고 있었습니다

수정 후에도 `aspect-ratio` 가 `690/402` 로 나와서 파고들었더니,
`news.html` 1157행에 **닫는 중괄호가 하나 더** 있었습니다.

```css
@media (prefers-reduced-motion:reduce){
  .pn__card,.pn__t,.pn__thumb img{transition:none}
}
}   ← 여분
```

top-level 의 여분 `}` 를 만나면 브라우저 CSS 파서는 오류 복구 모드로 들어가
**바로 다음 규칙 하나를 통째로 버립니다.** 실제로 브라우저에서 확인했습니다.

```
<style> 텍스트에 규칙 있음 : true
sheet.cssRules 에 있음     : false   ← 파서가 버림
바로 다음 @media 규칙       : 정상 파싱됨
```

수정 전에는 이 자리에 `.article--event .article__hero{margin-bottom:…}` 이
있었으니 **그 규칙도 원래부터 적용되지 않고 있었습니다.**
여분 `}` 를 제거해 4개 `<style>` 블록 모두 균형을 맞췄습니다.

```
style@8    len=1504  finalDepth=0  strayClosers=[]
style@20   len=696   finalDepth=0  strayClosers=[]
style@43   len=62114 finalDepth=0  strayClosers=[]
style@1508 len=43078 finalDepth=0  strayClosers=[]
```

### QA — 1920/1440/1280/1024/768/430/390/375/360 × Light/Dark, 공지 vs 이벤트 동시 측정

스크롤바 때문에 "뷰포트 중앙"은 브라우저마다 몇 px 흔들려서,
① 각 요소가 content column 중앙에 있는지 ② 그 column 이 공지사항 상세와
정확히 같은 자리인지를 직접 쟀습니다.

```
□ meta / title / share / 대표이미지 / body 가 column 중앙   18/18 ✅
□ column 좌표가 공지사항과 완전 일치 (l·r·center)            18/18 ✅
□ content width 공지사항과 동일   730 / 730 (768→692, 430→390, 375→335, 360→320)
□ title font-size 동일            44 / 34.56 / 30.72 / 24.576 / 24px
□ title margin-top · share margin-top · body margin-top · fig margin-top 동일
□ share 버튼 개수 4개 동일 · 원형 스타일 유지
□ <article> 자식 순서 공지사항과 동일
   article__meta | article__title | article__share | article__body
□ 대표 이미지 aspect-ratio 16/9 · column 100% 폭 · naturalWidth 1118 (정상)
□ 본문 문단 text-align: start (좌측)
□ 가로 overflow 0
```

### 회귀

```
8 페이지 × 3840~320 × Light/Dark × KO/EN → overflow 0 · JS 오류 0
v53 NEWS 모바일 QA(24조합) 재실행 → ALL PASS (제목 색 · weight · 2줄 유지)
```

---

## v55 — 프로토타입/데모 안내 UI 전면 제거

화면(Production UI)에서 프로토타입임을 드러내는 안내를 전부 없앴습니다.
**기능과 레이아웃은 그대로**이고, 보조 안내만 제거·교체했습니다.
개발자 주석과 내부 변수명(`DEMO`, `devCode`, `PROTOTYPE ONLY` 코멘트)은
화면에 노출되지 않으므로 그대로 두었습니다 — 지시하신 대로입니다.

### ① 로그인 — 데모 박스 완전 삭제

`auth.html` 에서 아래를 통째로 지웠습니다.

```
PROTOTYPE 배지 · "데모 계정으로 바로 둘러볼 수 있어요."
데모 이메일 · 데모 비밀번호 · "데모 계정으로 로그인" 버튼
박스 전체 + .ademo* CSS (border/background/padding/margin 포함)
sp-theme.css 의 .ademo 다크 규칙 4건
```

박스는 `.afoot`(회원가입 링크) **아래**에 `margin-top:28px` 로 붙어 있었으므로,
제거만으로 회원가입 링크 → Footer 가 자연스럽게 이어집니다. 남는 여백 없음.
데모 계정 자체는 QA 용으로 살아 있습니다 — `user@superplat.com` /
`superplat1!` 로 그냥 로그인됩니다.

### ② 회원가입 — 테스트 인증번호 안내 삭제

```
PROTOTYPE 배지 · "테스트용 인증번호 000000"
"실제 서비스에서는 이메일로만 발송됩니다." · .acode-hint* CSS
CodeHint() 함수와 호출부 4곳
```

인증 요청 / 인증번호 입력 / 3:00 타이머 / 재전송 쿨다운은 **그대로** 두어
실서비스처럼 동작합니다. 안내 문구도 서비스 문구입니다 —
"인증번호를 보냈어요. 메일함을 확인해주세요."

**⚠️ 메일 서버가 없는 프로토타입이라 인증번호를 어디론가는 내보내야 합니다.**
화면 대신 **개발자 콘솔**로만 보냅니다. QA 가 가입 플로우를 끝까지 진행할 수
있으면서 화면에는 한 글자도 노출되지 않습니다.

```js
/* ⚠️ PROTOTYPE ONLY — 실제 서비스 인증 구현이 아닙니다. */
console.info('[SUPERPLAT PROTOTYPE ONLY] 인증번호:', devCode);
```

실측: `[SUPERPLAT PROTOTYPE ONLY] 인증번호: 863320` — 콘솔에만 출력됩니다.
실서비스에서는 `SPAuth.CONFIG.DEV_CODE_HINT = false` + 메일 발송으로 교체합니다.

### ③ 마이페이지 — 안내 박스 삭제 · 문구 서비스형 교체

| 위치 | 이전 | 이후 |
|---|---|---|
| 캐시 · 재화 | "프로토타입 데이터 / 재화 수량과 거래 내역은 화면 확인용 예시입니다…" Notice | **삭제** — 페이지 설명 → 보유 재화로 바로 이어짐 |
| 기본 정보 | "…프로토타입에서는 변경할 수 없습니다." | "…변경할 수 없습니다." |
| 가입일 | "데모 계정" | `—` |
| 정산 계좌 | "실제 서비스에서는 예금주 확인 등…" | "정산을 위해 예금주 확인 등…" |
| 결제수단 | "프로토타입은 카드 브랜드와 끝 4자리만 보관합니다. 실제 서비스에서는 PG사 토큰화가…" | "카드 브랜드와 끝 4자리만 표시됩니다. 전체 카드번호 · 유효기간 · 비밀번호는 저장하지 않습니다." |
| 계좌 등록 | "프로토타입은 은행 · 예금주 · 끝 4자리만 보관합니다…" | "은행 · 예금주 · 끝 4자리만 표시됩니다. 전체 계좌번호는 저장하지 않습니다." |
| 카드 등록 | "프로토타입은 …실제 서비스에서는 PG사 결제창과 토큰화가 필요합니다." | "…전체 카드번호 · 유효기간 · 생년월일 · 결제 비밀번호는 저장하지 않습니다." |
| 수익 / 콘텐츠 관리 | `PROTOTYPE` 배지 + "…임의의 금액을 만들지 않았습니다." | 배지 삭제 · "판매 수익과 정산 내역이 이곳에 표시됩니다." |
| 슈퍼스타 정산 | "정산 가능 재화 여부가 확정되지 않아…" | "현재 정산을 신청할 수 없는 재화입니다." |

`.mptag`(PROTOTYPE 배지) CSS 와 `Card(opts.tag)` 주입부, 마이페이지에 복사돼
있던 `.acode-hint*` / `.ademo*` 죽은 CSS 도 함께 제거했습니다.
`sp-i18n.js` 는 사라진 문구 9건을 지우고 새 문구 8건의 EN 을 추가했습니다.

**⚠️ 정책 미확정 문구는 그대로 두었습니다 (판단이 필요합니다).**
"지원 여부가 확정되지 않았습니다"(간편결제 · 계좌이체 · 휴대폰 결제),
"환산 금액 · 수수료 · 공제는 정산 정책이 확정된 뒤 계산됩니다" 같은 문구는
프로토타입 고지가 아니라 **정책이 정해지지 않았다는 사실** 자체입니다.
이걸 지우려면 환산율 · 수수료 · 세율 · 정산 주기를 지어내야 하는데,
"정책 데이터를 만들어내지 말 것" 이 계속 유지 중인 지시라 손대지 않았습니다.
확정된 값을 주시면 바로 반영하겠습니다.

### 전수 검토 QA — 8 페이지 × 마이페이지 8 탭 × 회원가입 2단계

지정하신 금칙어를 **렌더된 화면의 보이는 텍스트와 속성**(placeholder ·
aria-label · title · alt)에서 검사했습니다. 숨겨진 요소와 주석은 제외입니다.

```
PROTOTYPE / Prototype / prototype / 프로토타입 / 데모 / Demo / demo /
테스트용 / 테스트 데이터 / 샘플 / Sample / sample / 예시입니다 /
실제 서비스에서는 / 화면 확인용 / 임시 데이터

index · world · news · support · terms · privacy       각 36 조합  ✅
login · signup-1 · signup-2                            각 36 조합  ✅
mypage 8탭 (profile/privacy/account/assets/
            subscription/cards/history/payout)          각 36 조합  ✅
────────────────────────────────────────────────────────────────
총 612 조합 (Light/Dark × KO/EN × 1920·1440·1280·1024·768·430·390·375·360)
□ 화면 노출 금칙어      0 건  ✅
□ 가로 overflow        0 건  ✅
```

> QA 스크립트 오탐 1건 — "본문 200자 이상" 조건을 넣어 두었는데, 데모 박스가
> 빠진 로그인 화면이 172자가 되어 28건이 실패로 잡혔습니다. 금칙어 0건 ·
> overflow 0 이었고, 스크린샷으로도 정상 렌더를 확인했습니다.

---

## v56 — NEWS > 이벤트 진행중 / 종료됨 필터 + 상태 태그

`news.html` 과 `sp-theme.css` 토큰만 수정했습니다. Hero · 공지사항 ·
업데이트 · 이벤트 이미지 · 제목 · 날짜 · 검색 · 상세보기 · Header · Footer ·
테마 구조 · 브레이크포인트는 변경 없습니다.

### 상태는 날짜에서 계산합니다

`period` 문자열 하나가 원본이라 거기서 시작/종료를 파싱합니다.
표기가 `(KST)` 라 UTC+9 로 해석해서, 보는 사람의 시간대와 무관하게
같은 결과가 나옵니다.

```js
now > end  → 'ended'      나머지 → 'ongoing'
it.status = 'ongoing' | 'ended' 를 넣으면 계산보다 우선 (운영 데이터 확장 지점)
```

### ⚠️ 지금은 8개 이벤트가 전부 「종료됨」입니다

오늘이 **2026-09-06** 인데 가장 늦게 끝나는 이벤트가 **2026-07-28** 종료라,
날짜 기준으로 계산하면 진행중이 0건입니다.

```
2026.03.28 ~ 2026.05.08   종료됨
2026.04.02 ~ 2026.05.10   종료됨
2026.04.15 ~ 2026.05.20   종료됨
2026.05.01 ~ 2026.06.12   종료됨
2026.05.06 ~ 2026.06.18   종료됨
2026.05.20 ~ 2026.06.30   종료됨
2026.06.02 ~ 2026.07.14   종료됨
2026.06.18 ~ 2026.07.28   종료됨
```

기능이 고장난 게 아니라 데이터가 그렇습니다. 「진행중」을 누르면
"현재 진행 중인 이벤트가 없습니다." empty state 가 정상적으로 나옵니다.
날짜는 변경 금지 항목이라 손대지 않았습니다 — 진행중 카드를 보시려면
① `EVENTS` 의 기간을 오늘 이후로 바꾸시거나 ② 해당 항목에
`status:'ongoing'` 을 넣으시면 됩니다.

### 필터 UI

기존 1차 탭(공지사항/업데이트/이벤트)과 검색 UI는 그대로 두고,
그 **아래 별도 한 줄**에 2차 필터를 두었습니다 — 검색 셀렉트와 한 덩어리로
붙어 보이지 않게 하기 위해서입니다. 이벤트 탭에서만 나타납니다.

```
[ 전체 ] [ 진행중 ] [ 종료됨 ]      기본값: 전체
```

`.nchip` — 마이페이지 `.mpchip` 과 같은 pill 시스템입니다(같은 다크 규칙 재사용).
PC 38~42px · Mobile **44px**(터치 타깃), `flex-wrap:nowrap` + 가로 스크롤이라
줄바꿈으로 깨지지 않습니다. 필터 변경은 새로고침 없이 리스트만 갱신합니다.

검색과 독립적으로 걸리므로 **"진행중 + 제목 검색"** 조합이 그대로 됩니다.
실측: 종료됨 + "Gallery" → 2건.

### 상태 태그

기존 「이벤트」 배지 자리에 상태가 들어갑니다. 크기 시스템은 하나,
색만 갈립니다 — 높이 24~26px · 12~13px · 600 · line-height 1 · pill.

| | Light | Dark |
|---|---|---|
| 진행중 | bg `#EAF7EE` · text `#177F47` · line `rgba(23,127,71,.14)` | bg `rgba(52,199,123,.16)` · text `#7BE3AC` |
| 종료됨 | bg `#F2F3F5` · text `#696E76` | bg `rgba(255,255,255,.07)` · text `rgba(255,255,255,.70)` |

**⚠️ 배경은 시안값 그대로지만 글자색만 한 단계 진하게 잡았습니다.**
시안값의 실측 대비가 AA(작은 글씨 4.5:1)를 아주 살짝 못 넘겼습니다.

```
#18864B on #EAF7EE = 4.18 : 1   →  #177F47 = 4.57 : 1
#6B7078 on #F2F3F5 = 4.49 : 1   →  #696E76 = 4.62 : 1
Dark   진행중 8.85 : 1 · 종료됨 8.20 : 1
```

원래 값을 그대로 쓰길 원하시면 `news.html` 의 `--ev-on-fg` / `--ev-off-fg`
두 줄만 되돌리면 됩니다.

### 그 외

- 종료 이벤트의 카드 opacity · 이미지 filter는 건드리지 않았습니다 (실측 `opacity:1` · `filter:none`)
- 기간 정보 `2026.03.28 09:00 ~ 2026.05.08 09:00 (KST)` 유지
- 정렬은 **기존 순서 그대로** — 이미 확정된 이벤트 순서가 있으면 유지하라는 §10 단서를 따랐습니다
- Empty state 3종: 진행중 없음 / 종료됨 없음 / 조건에 맞는 이벤트 없음
- i18n: `전체 All` · `진행중 Ongoing` · `종료됨 Ended` + empty 문구 — PC/Mobile 같은 소스

### QA — 1920/1440/1280/1024/768/430/390/375/360 × Light/Dark × KO/EN (36 조합)

```
□ 다른 탭에서 필터 미노출 · 이벤트 탭에서만 노출          36/36 ✅
□ 전체 = 진행중 + 종료됨 개수 일치                        36/36 ✅
□ 기존 「이벤트」 배지 0건 · 전 카드가 상태 태그          36/36 ✅
□ 진행중 필터에 종료 카드 없음 / 종료 필터에 진행 카드 없음 36/36 ✅
□ 필터 + 검색 조합 (종료됨 + "Gallery" → 2건)             36/36 ✅
□ chip 라벨 KO 전체·진행중·종료됨 / EN All·Ongoing·Ended  36/36 ✅
□ chip 높이 PC 38~42 · Mobile 44                          36/36 ✅
□ badge 높이 24~26 · weight 600                           36/36 ✅
□ 대비 진행중 4.57 / 8.85 · 종료됨 4.62 / 8.20 (AA)       36/36 ✅
□ 기간 문구 유지 · 카드 opacity 1 · 이미지 filter none    36/36 ✅
□ empty state 3종 문구                                    36/36 ✅
□ 상세보기 진입 회귀 없음 (필터도 같이 숨김)              36/36 ✅
□ 가로 overflow 0                                         36/36 ✅
```

### 회귀

```
8 페이지 × 3840~320 × Light/Dark × KO/EN → overflow 0 · JS 오류 0
v53 NEWS 모바일 QA (24 조합)  → ALL PASS
v54 이벤트 상세 정렬 QA (18 조합) → ALL PASS
```

---

## v57 — 전수 QA + 개별 요청 6건

### 계측 방식

추측이 아니라 실제 렌더링을 측정했습니다.

```
27개 화면 상태 × 12 뷰포트(3840 제외, 1366·834 포함) × Light/Dark × KO/EN
  = 1,320 행 수집 (overflow · 타이포 · 대비 · 터치 타깃 · 컨테이너 · 애니메이션 · a11y · 미번역)
대비는 조상 배경을 전부 합성한 뒤 측정 (반투명 오버레이 오탐 제거)
```

---

## CRITICAL

| # | Page | Issue | Before | Fix | PC/Mobile |
|---|---|---|---|---|---|
| C1 | Main · WORLD 캐러셀 | **「In the Stillness」 카드가 검은 빈 박스** | `world-in-the-stillness.jpg` 없음 → broken image | 파일 복원 | 둘 다 |
| C2 | 고객지원 · 1:1 문의 | **로그인해도 계속 잠김** | `var isLoggedIn = false` 로컬 플래그 | `SPAuth.me()` 세션을 읽고 `SPAuth.on()` 구독 | 둘 다 |
| C3 | 마이페이지 안내 배너 | **Dark 에서 글자가 안 보임** | `#F4F8FD` 위 흰 글자 = **1.01 : 1** | 토큰 분기 (결제수단·계좌·카드·정산 4곳) | 둘 다 |
| C4 | 전 페이지 | 없는 404 | 404 시 서버 기본 화면 | `404.html` 신규 (기존 컴포넌트만 조합) | 둘 다 |

**C1 은 제 실수입니다.** v55 에서 미참조 파일을 지울 때 문자열 grep 만 했는데,
이 파일은 `w.img = 'assets/world-' + w.id + '.jpg'` 로 **동적 생성**되고 있어서
grep 에 걸리지 않았습니다. 나머지 7개 삭제 파일은 동적 참조까지 다시 확인했고
(정적·동적 모두 0건), 앞으로 파일 삭제는 grep 이 아니라 **런타임 broken-image 0**
으로 검증합니다.

---

## MAJOR

| # | Page | Issue | Before | Fix | PC/Mobile |
|---|---|---|---|---|---|
| M1 | 전 페이지 | **보조 텍스트가 AA 미달 (사이트 전체)** | `--body-2nd` = 잉크 46% → **2.97 : 1** · 실패 스타일 138종 | 계단을 한 단계씩: `.46→.64` / `.62→.70` / `.68→.78` → **5.22 : 1** | 둘 다 |
| M2 | 고객지원 FAQ | Q 배지 흰 글자 | `#DCDCDE` 배경 → **1.37 : 1** | `#6B7078` → **4.98 : 1** | 둘 다 |
| M3 | NEWS 모바일 | 메타 라벨 | `#8A8F98` → 3.25 : 1 | `#72777F` → **4.51 : 1** | Mobile |
| M4 | 드롭다운 | 옵션 높이 42px | 터치 44 미달 | 모바일 팝업 48px (시트 52 유지) | Mobile |
| M5 | 약관·개인정보 | 목차 링크 36px | 터치 44 미달 | 모바일 44px (텍스트 위치 불변) | Mobile |
| M6 | 로그인·회원가입 | 인라인 링크 21px | 터치 44 미달 | padding 12 + margin −12 (레이아웃 1px 불변) | Mobile |
| M7 | NEWS 상세 | 공유 버튼 40px | 터치 44 미달 | 모바일 44px (PC 40 유지) | Mobile |
| M8 | 모바일 메뉴 | 로그아웃 40px | 터치 44 미달 | 44px | Mobile |

M1 적용 후 **AA 미달 138종 → 8종**(Light) / **5종**(Dark). 남은 것은 전부 비결함:
히어로 영상·사진 위 흰 제목(스크림 + text-shadow, 픽셀 샘플링 불가)과
`opacity:.34` **disabled 버튼**(WCAG 는 비활성 컨트롤을 제외합니다).

---

## MINOR — 요청 6건

| # | 요청 | 결과 |
|---|---|---|
| N1 | 숨겨진 테스트 계정 유지 | **이미 그렇게 되어 있었습니다.** v55 는 UI 만 지웠고 계정은 살아 있습니다. 8조합 실측: 화면 노출 0 · 오류 메시지도 계정 미노출 · `user@superplat.com` 직접 입력 로그인 성공 · 마이페이지 8탭 접근 · 로그아웃 정상 |
| N2 | 다운로드 설치 카드 이미지 | 배경 합성 JPG(640×407, `cover`) → **투명 PNG(335×186, `contain`)**. crop·왜곡 0. 9뷰포트 실측 |
| N3 | 모바일 헤더 로그인 아이콘 | 원형 46→**44×44**, 글리프 실측 20.3px. 로고·아이콘·햄버거 세로 중앙 동일 |
| N4 | 이전/다음 카드 | `sp-pn.css` + `sp-pn.js` **공통 컴포넌트 신설**. 공지·업데이트·이벤트·고객지원 4화면이 같은 소스 |
| N5 | 모바일 Full Menu | 영문 1Depth · 24px/700 · row 88px · divider 1px · 좌우 32px(360→24) · CTA 58px/r17 |
| N6 | 전수 QA | 이 리포트 |

### N2 — 다운로드 카드

`object-fit:contain` 이라 **어떤 해상도에서도 잘리지 않습니다.**
투명 여백이 곧 레이아웃이라 좌표 보정도 없앴습니다.

```
1920/1440/1280/1024/768/430/390/375/360 × Light·Dark
□ contain · 원본 비율 · 카드 안쪽    2/2 카드 전부 ✅
□ 모자 · 얼굴 · 상반신 잘림          0건 ✅
□ 휴대폰 전체 + 양손                 0건 잘림 ✅
□ horizontal overflow                0 ✅
□ 새 이미지 HTTP 200 · broken 0      ✅
```

> ⚠️ **원본 해상도만 알려드립니다.** 주신 PNG 는 335×186 이고, 캐릭터 실제 잉크는
> 114×179 · 휴대폰은 212×172 입니다. 1920 데스크톱 카드의 이미지 영역은
> CSS 550×300(레티나 1100×600)이라 캐릭터가 약 1.6배 확대되어 다소 부드럽게
> 보입니다. 잘리지는 않습니다. 더 선명하게 하려면 2~3배 원본을 주시면
> 파일만 교체하겠습니다 (CSS 변경 불필요).

### N4 — 이전/다음 공통 컴포넌트

```
assets/sp-pn.css   유일한 스타일 소스 (:root 토큰 → sp-theme.css 에서 다크 분기)
assets/sp-pn.js    SPPrevNext.build({prev, next, list, labels}) → DocumentFragment
```

news.html 에 있던 `.pn*` CSS 130줄과 `pnCol()` 은 삭제했습니다. 페이지가 넘기는
것은 data 뿐입니다 — 이벤트는 badge 가 진행중/종료됨, 고객지원은 문의 유형.
썸네일이 없는 1:1 문의는 `.pn__card--notext` 로 1열이 되고 padding·radius·
typography·hover 는 완전히 동일합니다. 없는 쪽은 빈 카드를 남기지 않고
한쪽만 남으면 `.pn--one` 으로 전체 폭을 씁니다.

레퍼런스 밀도에 맞춰: 썸네일 `clamp(220px,30%,320px)` · 16:9 · r16,
카드 padding 16~20 · r20~24 · border+surface, 제목 2줄 clamp, 강제 min-height 제거.

```
4개 상세 × 1440/1024/375 × Light/Dark
□ 카드 스펙 1종으로 수렴 (padding|radius|bg|font|clamp)   ✅
□ 제목 2줄 · 썸네일 16:9 · 좌우 카드 높이 동일             ✅
□ 모바일 1열 · 썸네일 100%                                 ✅
□ 목록으로 버튼 4/4 동일                                   ✅
```

### N5 — 모바일 Full Menu

```
375 실측
ABOUT / WORLD & IP / NEWS / SUPPORT   24px · 700 · row 88px
divider 1px · chevron NEWS·SUPPORT 만 · 하위 17px/500 · 아코디언 210~230ms
좌우 축      nav 32 = 로고 32 = 계정 32 = 메뉴 32   (360 은 전부 24)
CTA 58px · radius 17px · 닫기 44×44 · overflow 0
```

> ⚠️ 만드는 중 스스로 낸 버그 하나를 실측으로 잡았습니다 — row 전체를 버튼으로
> 바꾸면서 진입 stagger 규칙(`.is-menu .mnav__link`)에 `.mnav__row` 를 빠뜨려
> **NEWS · SUPPORT 글자가 opacity:0 으로 통째로 안 보였습니다.** 스크린샷으로
> 발견해 고쳤고, QA 에 `opacity === '1'` 검사를 추가했습니다.

---

## 검수했지만 고치지 않은 것 (근거 포함)

| 항목 | 실측 | 판단 |
|---|---|---|
| Content width | `.wrap` 1400/1310/1163 이 **27개 화면 전부 동일**, `.article` 730, `.aform` 460/640 | 이미 일관됨 — 변경 없음 |
| 모바일 좌우 여백 | 375·360 에서 **모든 페이지 20px** | 이미 일관됨 |
| 타이포 계층 | 같은 유형끼리 완전 일치 (world/news/support의 phero·ntitle, terms/privacy, auth 4상태, mypage 8탭). 모바일은 `@media(max-width:767px)` 공통 규칙으로 페이지 타이틀이 31.5px 로 통일 | 재설계 불필요 |
| Easing | `cubic-bezier(.16,1,.3,1)` ×2470 · `cubic-bezier(.22,1,.36,1)` ×542 두 종류뿐. `ease` ×135 는 `visibility` 에 붙는 브라우저 기본값(불연속 속성이라 체감 없음) | 정상 |
| phero 제목이 모바일에서 21px | 히어로 배너 라벨이고 실제 페이지 타이틀은 바로 아래 31.5px. world/news/support 3페이지 동일 | 의도된 편집 위계 — 유지 |
| 정책 미확정 문구 | "지원 여부가 확정되지 않았습니다" 등 | 지우려면 수수료·세율·정산주기를 지어내야 함 → 유지 |

---

### 회귀

```
9 페이지 × 3840~320 × Light/Dark × KO/EN   overflow 0 · JS 오류 0
프로토타입/데모 금칙어 전수 (612 조합)      노출 0
테스트 계정 (8 조합)                        로그인·마이페이지·로그아웃 정상
단일 ZIP 6단계 검증                         IP 상세 28/28 · broken 0 · JS 오류 0
```

### 수정 파일

```
신규   404.html · assets/sp-pn.css · assets/sp-pn.js
       assets/download-client-character.png · download-mobile-device.png
복원   assets/world-in-the-stillness.jpg
수정   index/world/news/support/auth/mypage/terms/privacy .html (토큰)
       assets/sp-nav.css · sp-nav.js · sp-theme.css · sp-ui.js · sp-auth.js
```

---

## v58 — WORLD 캐러셀 배경: 사진 → Semantic Color Family

### 무엇이 바뀌었나

「오늘은 어디부터 가볼까요?」 캐러셀에서 **선택된 공간 사진을 확대해 배경으로 깔던 레이어를 제거**하고,
그 자리에 공간이 속한 **색 계열(Semantic Color Family) 한 겹**을 깔았습니다.
가운데 카드 이미지가 배경 사진과 경쟁하지 않게 되어, Active 카드가 항상 화면에서 가장 강한 요소가 됩니다.

레이어 스택 (아래 → 위)

```
①  .worlds__bg     Semantic Base Color   background-color: var(--world-bg)   ← 새로 들어온 레이어
②  .worlds__wash   전역 dim              rgba(0,0,0,var(--wov))              ← 유지
③  .worlds__scrim  Gradient / Vignette   radial ×2 + linear ×1               ← 유지 + 깊이 보강
④  Carousel · Typography · Progress                                          ← 그대로
```

**단색 Flat 방지**: ③에 (a) 상단 중앙의 아주 옅은 광원 `rgba(255,255,255,.13)`,
(b) 하단 vignette `rgba(0,0,0,.30)` 두 겹을 추가했습니다.
섹션 안에서 실측한 세로 밝기 진폭은 Light 30 / Dark 19 단계로, 한 덩어리 색으로 읽히지 않습니다.

### 색은 19개가 아니라 6계열

HEX 는 딱 두 곳에만 있습니다 — `index.html :root`(Light) / `assets/sp-theme.css`(Dark).
공간 데이터에는 `fam:'rose'` 처럼 **계열 이름만** 적습니다.

| Family | Light | Dark |
|---|---|---|
| ROSE | `#A8757F` | `#51383F` |
| WARM | `#9F8378` | `#4D3F39` |
| BLUE | `#7185A5` | `#363F52` |
| AQUA | `#769B9C` | `#394B4C` |
| SAGE | `#84977D` | `#3F493B` |
| NEUTRAL | `#707070` | `#383838` |

현재 이미지가 등록된 14개 공간의 매핑

| # | 공간 | fam | | # | 공간 | fam |
|---|---|---|---|---|---|---|
| 01 | SuperTown | blue | | 08 | Broccoli Entertainment | sage |
| 02 | My Gallery | aqua | | 09 | My Gallery : Neon | rose |
| 03 | Music Festival | rose | | 10 | VOD Space | rose |
| 04 | Blue Lagoon | aqua | | 11 | Cafe | warm |
| 05 | Art Gallery | warm | | 12 | Stadium | blue |
| 06 | Pop-up Store | rose | | 13 | Private Gallery | blue |
| 07 | In the Stillness | aqua | | 14 | My Gallery : Minimal | warm |

아직 이미지가 없는 5개(Clothing Store / Figure Collection / In the Sky / Art Space ×2)는
`fam` 을 미리 적어 둔 주석 줄로 배열 아래에 대기시켜 두었습니다. 파일이 오면 주석만 풀면 됩니다.

> ⚠️ `fam` 은 사진에서 색을 뽑은 값이 **아니라** 지정된 매핑 값입니다.
> 사진 색과 계열이 달라 보여도(예: Stadium 사진은 주황 계열이지만 BLUE) 임의로 바꾸지 마세요.

### Light / Dark 전환에 JS 가 개입하지 않습니다

JS 는 HEX 를 모릅니다. `--world-bg` 에 `var(--world-rose)` 같은 **토큰 이름만** 씁니다.

```js
worldsSec.style.setProperty('--world-bg', 'var(--world-' + f + ')');
```

그래서 테마를 바꾸면 CSS 가 알아서 계열 HEX 를 갈아끼우고,
**active index · 스크롤 위치 · 캡션이 그대로 유지**됩니다 (실측 06 → 06 유지, scrollY 차이 0).

### 전환

`background-color 700ms cubic-bezier(.22, 1, .36, 1)` — 오버슈트 없음.
같은 계열끼리 이동하면 `famNow` 가드가 걸려 전환이 아예 일어나지 않습니다
(실측 시퀀스에서 `rose → rose`, `blue → blue` 구간 재설정 0회).
`prefers-reduced-motion` 은 파일 하단의 전역 리셋이 그대로 처리합니다.

### 제거된 것

| 대상 | 이유 |
|---|---|
| `<img id="wBg0"> / <img id="wBg1">` | 확대 배경 사진 2겹 crossfade |
| `.worlds__bgimg` · `@keyframes wbgIn` · `--wbg-o` | 위 레이어 전용 스타일 |
| `autoWash()` / `lumCache` (canvas 밝기 샘플링 67줄) | 배경이 사진이 아니게 되어 불필요 · dynamic sampling 은 이번 범위에서 금지 |

**이미지 파일은 하나도 건드리지 않았습니다.** `assets/world-*` 19개 그대로,
`w.img = 'assets/world-' + w.id + '.jpg'` 도 그대로입니다 (카드 이미지는 계속 사진을 씁니다).

### QA (실측)

| 항목 | 결과 |
|---|---|
| 14개 공간 × Light/Dark 계열·HEX 매핑 | ✅ 28/28 일치, JS 오류 0 |
| 배경 `<img>` 잔존 | ✅ 0개 (16뷰포트 × 2테마 전수) |
| 테마 토글 시 active index / scrollY 유지 | ✅ 06 → 06, Δy = 0 |
| 전환 duration / easing | ✅ `0.7s cubic-bezier(.22,1,.36,1)`, 300ms 지점 중간색 확인 |
| 같은 계열 전환 no-op | ✅ 토큰 재설정 0회 |
| Flat 여부 (섹션 내부 세로 밝기 진폭) | ✅ Light 30 · Dark 19 단계 |
| WCAG 대비 (합성된 배경 픽셀 실측, 14공간 × 2테마 × 1440/390 × 5요소) | ✅ 최저 **4.77:1**, 실패 0 |
| 반응형 3840~320 (16뷰포트) × Light/Dark | ✅ overflow 0 · 깨진 이미지 0 · JS 오류 0 |
| 전 페이지 회귀 (9페이지 × 14뷰포트 × Light/KO · Dark/EN) | ✅ worst −15 clean, errors 0 |
| 스타일시트 파싱 (중괄호 균형 · 규칙 삼킴) | ✅ 9페이지 전부 정상 |

대비가 기준에 못 미친 곳이 한 군데 있었습니다 — 모바일 Light 의 AQUA 계열에서
`.section-desc` 가 **4.47:1** 로 4.5 에 미달. **HEX 를 바꾸지 않고** 모바일 dim 만
`.30 → .34` 로 한 단계 올려 해결했습니다 (4.77:1).

### 수정 파일

- `index.html` — 색 토큰 6개(Light) · 배경 레이어 CSS · 배경 `<img>` 2개 제거 · `WORLDS[].fam` · `syncBg()` 재작성 · `autoWash` 제거
- `assets/sp-theme.css` — 색 토큰 6개(Dark) + `--wov` Dark 값

---

## v59 — 홈 캐러셀 ↔ WORLD & IP 콘텐츠 동기화 (Single Source of Truth)

### 문제

두 화면이 **서로 다른 하드코딩 배열**을 들고 있었습니다. 그래서 같은 공간이
화면마다 다른 이름 · 다른 이미지 · 다른 문장으로 나왔습니다. WORLD & IP 쪽에서 확인된 것:

| 증상 | 실제 상태 |
|---|---|
| 이름 ↔ 이미지 교차 | `Studium → world-vod.jpg`, `VOD → world-stadium.jpg` |
| 한 칸씩 밀림 | `In the Stillness → world-private-gallery.jpg`, `Private Gallery → world-art-gallery.jpg` |
| 중복 | `My gallery2` ×2, `Cafe` ×2 |
| 누락 | `SuperTown`, `In the Stillness` 이미지가 카드에 한 번도 안 나옴 |

### 해결 — `assets/sp-worlds.js` 하나만 봅니다

```js
{ id:'blue-lagoon', name:'Blue Lagoon', fam:'aqua',
  ko:'파라솔 아래, 여유를 즐기기 좋은 해변입니다.',
  img:'world-blue-lagoon.jpg' }
```

- 홈 캐러셀: `window.SPWorlds.ready()` → `{title, desc, img}` 로 이름만 바꿔 담습니다
- WORLD & IP: 같은 배열 → `{kind:'world', title, img, desc}` + IP 카드 14장을 뒤에 붙입니다
- 영문은 **공용 사전**(`sp-i18n.js`)이 국문 원문을 키로 찾습니다 → 국문은 `sp-worlds.js`, 영문은 사전, **한 군데씩**
- 두 화면 모두 `.ready()` 를 지나므로 개수·순서가 어긋날 수 없습니다

기존 렌더 코드 · 레이아웃 · 카드 스타일 · 캐러셀 구조 · 라이트박스는 그대로입니다.
바뀐 것은 **데이터가 어디서 오는지** 하나뿐입니다.

### 콘텐츠 (확정 문구 그대로, 지정 순서)

| # | 공간 | 이미지 | fam |
|---|---|---|---|
| 01 | VOD | `world-vod.jpg` | rose |
| 02 | My gallery2 | `world-my-gallery-neon.jpg` | rose |
| 03 | Clothing store | `world-shop.jpg` | warm |
| 04 | Music Festival | `world-music-festival.jpg` | rose |
| 05 | Studium | `world-stadium.jpg` | blue |
| 06 | Figure collection | `world-figure.jpg` | blue |
| 07 | BMA | `world-private-gallery.jpg` | blue |
| 08 | Blue Lagoon | `world-blue-lagoon.jpg` | aqua |
| 09 | **In the sky** | **이미지 미수령** | blue |
| 10 | My gallery1 | `world-my-gallery.jpg` | aqua |
| 11 | Broccoli Entertainment | `world-broccoli.jpg` | sage |
| 12 | SuperTown | `world-supertown.jpg` | blue |
| 13 | Art Gallery | `world-art-gallery.jpg` | warm |
| 14 | Popup store | `world-popup.jpg` | rose |
| 15 | Cafe | `world-cafe.jpg` | warm |
| 16 | In the Stillness | `world-in-the-stillness.jpg` | aqua |
| 17 | **Art Space2** | **이미지 미수령** | neutral |
| 18 | **Art Space1** | **이미지 미수령** | neutral |
| 19 | My gallery3 | `world-my-gallery-minimal.jpg` | warm |

**19개 중 16개가 렌더됩니다.** 09 / 17 / 18 은 이미지 파일을 받지 못해
`pending:true` 로 표시해 두었고 **두 화면 모두 렌더에서 제외**됩니다
(placeholder 를 만들거나 다른 이미지를 재사용하지 않았습니다 — 깨진 이미지 0을 유지하기 위해).
확정 문구 · fam · 순서는 이미 데이터에 들어가 있으므로, 파일이 오면
`img` 를 채우고 `pending` 줄만 지우면 두 화면에 동시에 나타납니다.

#### 파일명과 공간 이름이 다른 두 곳 (rename 하지 않았습니다)

- **BMA** → `world-private-gallery.jpg` — 물 위에 놓인 미술관 외관. 부산시립미술관 협업 공간
- **Clothing store** → `world-shop.jpg` — 기존 「옷가게」 카드의 이미지 그대로

### 이미지

새로 만들거나 복제하거나 이름을 바꾼 파일이 **하나도 없습니다.**
홈과 WORLD & IP 가 `assets/` 아래 **같은 파일 하나**를 참조합니다.
`world-shop-detail.png` · `world-figure-detail.png` 고해상도 상세보기 연결도 그대로 유지됩니다(1920×1080).

### QA (실측)

| 항목 | 결과 |
|---|---|
| 홈 ↔ WORLD & IP 1:1 비교 (이름 · 국문 · 이미지 파일 · 순서) | ✅ 16/16 일치 × Light·Dark × KO·EN = 4조합 |
| 중복 이름 / 중복 이미지 | ✅ 0 |
| EN 전환 | ✅ 16/16 번역, 국문 잔존 0, 카드 순서·이미지 변화 없음 |
| 월드 상세보기(Lightbox) 16장 | ✅ 전부 로드, detail 원본 2장 1920×1080 |
| 깨진 이미지 | ✅ 0 (`In the Stillness` 포함) |
| 배경 Semantic Color Family 16개 | ✅ 지정 매핑과 100% 일치 |
| 카드 설명 잘림 (11뷰포트 × 16카드) | ✅ 0 — 확정 문구가 기존 2줄 자리에 그대로 들어갑니다 |
| 홈 캡션 잘림 / 넘침 (10뷰포트 × 16공간) | ✅ 0, 모바일 좌측 여백 20px 유지 |
| Horizontal overflow 1920~320 | ✅ 0 |
| WCAG 대비 (합성 배경 실측, 16공간 × 2테마 × 2폭 × 5요소) | ✅ 최저 4.77:1, 회귀 없음 |
| 전 페이지 회귀 (9페이지 × 14뷰포트 × Light/KO · Dark/EN) | ✅ worst −15 clean, JS 오류 0 |
| 스타일시트 파싱 | ✅ 9페이지 정상 |

### 수정 파일

- `assets/sp-worlds.js` — **신규.** 공간 19개 단일 데이터 소스
- `index.html` — 하드코딩 `WORLDS` 배열(25줄) 삭제 → `SPWorlds.ready()` 매핑, 캡션 영문을 공용 사전 경로로 통일, preload 를 첫 카드(VOD)로 교체
- `world.html` — 하드코딩 월드 카드 15개 삭제 → `SPWorlds.ready()` 매핑, preload 교체
- `assets/sp-i18n.js` — 확정 문구 11건의 영문 추가
