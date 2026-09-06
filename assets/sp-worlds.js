/* ══════════════════════════════════════════════════════════════════════════
   SuperPlat — WORLD 공간 데이터 (Single Source of Truth)

   홈의 「오늘은 어디부터 가볼까요?」 캐러셀과 WORLD & IP 페이지의 월드 카드가
   **이 배열 하나만** 봅니다. 두 화면에서 공간 이름 · 이미지 · 설명 · 순서가
   갈라질 수 없습니다.

   ⚠️ 이 파일은 <head> 안에서 동기 로드됩니다 (sp-i18n.js 와 같은 이유).
      defer / async 를 붙이면 첫 렌더에서 배열이 비어 있습니다.

   필드
     id      내부 식별자. **이미지 파일명과 1:1 이 아닙니다** — 아래 img 를 보세요.
     name    화면에 나가는 공간 이름 (KO / EN 공통. 고유명사라 번역하지 않습니다)
     ko      확정 국문 설명. 임의로 축약하거나 다시 쓰지 마세요.
     img     assets/ 아래 실제 파일명. 홈 캐러셀과 WORLD & IP 가 같은 파일을
             참조합니다 — 복제본을 만들지 않습니다.
     detail  상세보기(Lightbox)용 고해상도 원본이 따로 있을 때만.
     fam     배경 Semantic Color Family (rose / warm / blue / aqua / sage / neutral).
             홈 캐러셀 배경이 이 값을 씁니다. index.html :root · sp-theme.css 에
             --world-<fam> 토큰으로 정의되어 있습니다.
     pending 아직 이미지 파일을 받지 못한 공간. **두 화면 모두 렌더에서 제외**합니다
             (깨진 이미지가 생기지 않게). 파일이 오면 img 를 채우고 이 줄을 지우세요.

   영문 설명은 여기 두지 않습니다. 사이트 공용 사전(assets/sp-i18n.js)이
   국문 원문을 키로 찾아 줍니다 — 국문은 여기, 영문은 사전, 한 군데씩입니다.

   ⚠️ 이미지 자산 관련 금지 사항
      재생성 · 색 보정 · 삭제 · rename · path 변경 · 복제본 생성 모두 금지입니다.
      문자열 grep 결과만으로 "미사용" 을 판단해 파일을 지우지 마세요 —
      여기 img 는 런타임에 'assets/' + img 로 조립되므로 grep 에 잡히지 않습니다.
   ══════════════════════════════════════════════════════════════════════════ */
(function (w) {
  'use strict';

  w.SPWorlds = [
    { id:'vod',                name:'VOD',                    fam:'rose',
      ko:'다양한 콘텐츠와 이야기를 한자리에서 감상해보세요.',
      img:'world-vod.jpg' },

    { id:'my-gallery-neon',    name:'My gallery2',            fam:'rose',
      ko:'빛과 작품이 어우러진 감각적인 갤러리를 경험해보세요.',
      img:'world-my-gallery-neon.jpg' },

    { id:'clothing-store',     name:'Clothing store',         fam:'warm',
      ko:'나만의 스타일을 발견하고 새로운 모습으로 변신해보세요.',
      img:'world-shop.jpg', detail:'world-shop-detail.png' },

    { id:'music-festival',     name:'Music Festival',         fam:'rose',
      ko:'음악과 빛이 어우러지는 뜨거운 축제의 순간을 즐겨보세요.',
      img:'world-music-festival.jpg' },

    { id:'stadium',            name:'Studium',                fam:'blue',
      ko:'탁 트인 공간에서 함께 뛰고 즐기는 특별한 순간을 만나보세요.',
      img:'world-stadium.jpg' },

    { id:'figure-collection',  name:'Figure collection',      fam:'blue',
      ko:'개성 넘치는 캐릭터와 컬렉션을 가까이에서 만나보세요.',
      img:'world-figure.jpg', detail:'world-figure-detail.png' },

    /* 부산시립미술관 협업 공간. 이미지는 물 위에 놓인 미술관 외관
       (world-private-gallery.jpg) 입니다 — 파일명과 공간 이름이 다르지만
       같은 공간이 맞습니다. rename 하지 마세요. */
    { id:'private-gallery',    name:'BMA',                    fam:'blue',
      ko:'슈퍼플랫에서 부산시립미술관의 전시를 탐험해보세요.',
      img:'world-private-gallery.jpg' },

    { id:'blue-lagoon',        name:'Blue Lagoon',            fam:'aqua',
      ko:'파라솔 아래, 여유를 즐기기 좋은 해변입니다.',
      img:'world-blue-lagoon.jpg' },

    /* ⛔ 이미지 파일 미수령 — 확정 문구만 받아 두었습니다.
       world-in-the-sky.jpg 를 받으면 img 를 채우고 pending 을 지우세요. */
    { id:'in-the-sky',         name:'In the sky',             fam:'blue',
      ko:'슈퍼플랫에서 펼쳐지는 다양한 팝업을 만나보세요.',
      pending:true },

    { id:'my-gallery',         name:'My gallery1',            fam:'aqua',
      ko:'밝고 열린 공간에서 자유롭게 작품을 감상해보세요.',
      img:'world-my-gallery.jpg' },

    { id:'broccoli',           name:'Broccoli Entertainment', fam:'sage',
      ko:'IP 캐릭터들이 모여 사는 컬러풀한 브랜드 타운',
      img:'world-broccoli.jpg' },

    { id:'supertown',          name:'SuperTown',              fam:'blue',
      ko:'커다란 나무를 중심으로 이어지는 슈퍼플랫의 중심가',
      img:'world-supertown.jpg' },

    { id:'art-gallery',        name:'Art Gallery',            fam:'warm',
      ko:'작가들의 상상력이 자유롭게 펼쳐지는 갤러리입니다.',
      img:'world-art-gallery.jpg' },

    { id:'popup',              name:'Popup store',            fam:'rose',
      ko:'좋아하는 작가의 굿즈와 다양한 상품을 만나보세요.',
      img:'world-popup.jpg' },

    { id:'cafe',               name:'Cafe',                   fam:'warm',
      ko:'편안한 분위기 속에서 여유롭게 대화를 나눌 수 있는 공간입니다.',
      img:'world-cafe.jpg' },

    { id:'in-the-stillness',   name:'In the Stillness',       fam:'aqua',
      ko:'고요한 바다 위, 차분한 시간을 머물며 즐길 수 있는 공간입니다.',
      img:'world-in-the-stillness.jpg' },

    /* ⛔ 이미지 파일 미수령 */
    { id:'art-space-2',        name:'Art Space2',             fam:'neutral',
      ko:'빛과 어둠이 어우러진 신비로운 공간을 경험해보세요.',
      pending:true },

    /* ⛔ 이미지 파일 미수령 */
    { id:'art-space-1',        name:'Art Space1',             fam:'neutral',
      ko:'빛과 그림자가 만들어내는 몽환적인 공간을 탐험해보세요.',
      pending:true },

    { id:'my-gallery-minimal', name:'My gallery3',            fam:'warm',
      ko:'다양한 작품과 새로운 영감을 발견하는 전시 공간입니다.',
      img:'world-my-gallery-minimal.jpg' }
  ];

  /* 실제로 화면에 그릴 수 있는 공간(이미지가 있는 공간)만 돌려줍니다.
     홈 캐러셀 · WORLD & IP 가 모두 이 함수를 지나므로 두 화면의 개수와
     순서가 어긋날 수 없고, pending 항목 때문에 깨진 이미지가 생기지 않습니다. */
  w.SPWorlds.ready = function () {
    return w.SPWorlds.filter(function (s) { return !s.pending && s.img; });
  };
})(window);
