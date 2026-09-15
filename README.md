# SuperPlat Website Prototype

SuperPlat 공식 웹사이트의 프론트엔드 프로토타입입니다.
**빌드 도구·프레임워크·의존성이 없는 정적 사이트**(HTML + CSS + Vanilla JS)로,
9개 페이지의 화면·흐름·반응형·Light/Dark·인터랙션이 구현되어 있습니다.

> 로그인은 **프로토타입 전용 mock authentication** 입니다. 실제 인증 구현이 아닙니다.
> 자세한 내용과 교체 방법은 `DEVELOPER_HANDOFF.md` §11 을 보세요.

## 실행 방법

```bash
cd superplat-web
python3 -m http.server 8000
# → http://localhost:8000
```

빌드 단계가 없습니다. 정적 서버면 무엇이든 됩니다 (`npx serve .`, VS Code Live Server,
GitHub Pages, 정적 호스팅 업로드 등). `file://` 로 더블클릭해도 열립니다.

모든 리소스 참조가 상대경로라 **GitHub Pages 하위경로(`/superplat-web/`) 배포에서도
그대로 동작**합니다. 외부 요청은 폰트 CDN 하나뿐입니다 (`DEVELOPER_HANDOFF.md` §2).

## 주요 폴더

```
superplat-web/
├─ index.html      홈
├─ world.html      WORLD & IP
├─ news.html       NEWS (공지 · 업데이트 · 이벤트)
├─ support.html    고객지원 (FAQ · 1:1 문의 · 다운로드)
├─ auth.html       로그인 · 회원가입 · 비밀번호 찾기
├─ mypage.html     마이페이지 (8개 탭)
├─ terms.html      이용약관
├─ privacy.html    개인정보 처리방침
├─ 404.html        Not Found
└─ assets/         공용 JS·CSS (sp-*.js / sp-*.css) · 이미지 · 영상 · 폰트
```

## 문서

| 문서 | 내용 |
|---|---|
| **[DEVELOPER_HANDOFF.md](./DEVELOPER_HANDOFF.md)** | **개발 인수인계 문서.** 프로젝트 구조 · 반응형 · 테마 · i18n · 공용 컴포넌트 · 인증 · Mock 데이터 · Production 연동 필요 영역 · 테스트 계정 · 알려진 한계 |
| [CHANGELOG.md](./CHANGELOG.md) | 버전별 변경 이력과 디자인 결정 근거 |

**개발을 시작하기 전에 `DEVELOPER_HANDOFF.md` 를 먼저 읽어주세요.**
