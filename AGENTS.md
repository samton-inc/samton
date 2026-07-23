# Samton project guidance

## 소식·인사이트 포스트 작업

`src/content/insights` 또는 샘튼 홈페이지의 소식·인사이트 포스트와 관련된 요청에는 설치된 `samton-insights-publisher` 플러그인의 `$manage-samton-insights` 스킬을 반드시 사용한다.

다음 요청을 모두 포스트 작업으로 간주한다.

- 새 포스트 작성, 기존 포스트 수정·삭제·숨김
- 제목, 요약, 본문, 문체, 카테고리와 게시 날짜 변경
- 한국어·영어·일본어 번역 작성 또는 동기화
- 이미지 추가·교체·크롭·보정과 캡션 수정
- 내부 링크, 외부 출처와 404 링크 검수
- 포스트 폴더명, frontmatter와 게시 순서 정리

작업을 시작하기 전에 `$manage-samton-insights`의 `SKILL.md`와 해당 작업에 필요한 참조 문서를 읽고 그 절차를 따른다. 새 글이나 한국어 수정사항은 영어 `index.en.md`와 일본어 `index.ja.md`에도 같은 작업에서 반영한다.

스킬이 현재 세션에서 제공되지 않거나 로드할 수 없다면 그 사실을 짧게 알리고, `src/content/insights/README.md`의 규칙을 대체 지침으로 사용한다.

## 공유 미리보기(Open Graph) 규칙

새 URL(정적 HTML 엔트리)이나 새 게시물이 생길 때마다 링크 공유 미리보기용 Open Graph 메타 태그도 반드시 함께 만든다.

- 새 정적 HTML 엔트리를 추가할 때(`vite.config.ts`의 `build.rollupOptions.input`에 항목이 늘어날 때)는 그 HTML의 `<head>`에 `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`와 `twitter:card` 계열 태그를 기존 `index.html`과 같은 구성으로 넣는다. `og:url`과 `og:image`는 `https://samton.co.kr`로 시작하는 절대 URL만 사용한다. 공용 카드 이미지는 `public/og-image.png`(1.91:1)다.
- 소식·인사이트 게시물은 빌드 시 `scripts/generate-insight-pages.mjs`가 게시물마다 `dist/insights/<slug>/index.html`을 생성해 그 글의 `title`, `summary`, 본문 첫 이미지를 OG 태그로 넣는다. 본문에 이미지가 없는 글은 공용 `/og-image.png`로 자동 폴백한다. 새 게시물은 frontmatter만 규칙대로 채우면 되고 OG 태그를 손으로 만들지 않는다.
- 게시물 상세 링크는 `/insights/<slug>/` 경로 형식을 사용한다. 예전 `/insights/?article=<slug>` 쿼리 형식은 하위 호환용으로만 남아 있으므로 새 링크에는 쓰지 않는다.
- 미리보기 관련 변경을 배포한 뒤 카카오톡에 이전 카드가 계속 보이면 카카오 공유 디버거(https://developers.kakao.com/tool/debugger/sharing)에서 해당 URL의 캐시를 초기화한다.
