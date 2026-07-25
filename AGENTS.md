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

## 구조화 데이터(스키마 마크업) 규칙

검색엔진과 AI 크롤러가 읽는 JSON-LD 구조화 데이터를 **모든 페이지마다** 넣는다. 스키마 없는 URL이 배포되면 안 된다.

- **새 소식·인사이트 게시물**: 빌드 시 `scripts/generate-insight-pages.mjs`가 글마다 `Organization` + `WebSite` + `WebPage` + `ImageObject` + `BreadcrumbList` + `Article`(또는 `NewsArticle`) 그래프를 자동으로 넣는다. frontmatter의 `slug`, `title`, `summary`, `date`, 분류 폴더명, 본문 첫 이미지를 그대로 쓰므로 **스키마를 손으로 만들지 않는다.** frontmatter만 규칙대로 채우면 된다.
  - `date`는 `2026.07.15` 형식이어야 하며 빌드가 ISO 8601(`2026-07-15`)로 바꿔 `datePublished`·`dateModified`에 넣는다. 형식이 틀리면 빌드가 실패한다.
  - `샘튼-소식` 분류의 글은 `NewsArticle`, 나머지 분류는 `Article`로 자동 분기된다. 분류를 추가하면 `generate-insight-pages.mjs`의 `categoryLabels`에 표기를 등록하고, 회사 활동 소식이면 `newsCategories`에도 넣는다.
- **새 정적 HTML 엔트리**(`vite.config.ts`의 `build.rollupOptions.input`에 항목이 늘어날 때): 그 HTML의 `<head>`에 `<link rel="canonical">`과 `<script type="application/ld+json">` 블록을 손으로 넣는다. 기존 `index.html`처럼 `@graph` 안에서 `Organization`(`@id`: `https://samton.co.kr/#organization`)과 `WebSite`(`@id`: `https://samton.co.kr/#website`)를 참조하고, 그 페이지에 맞는 `WebPage`/`CollectionPage`와 `BreadcrumbList`를 더한다.
- **회사 정보(상호, 주소, 전화, 이메일, 로고)가 바뀌면** `index.html`, `insights/index.html`, `scripts/generate-insight-pages.mjs`의 `organizationNode` **세 곳을 함께 고친다.** 같은 `@id`를 쓰는 노드라 한 곳만 고치면 값이 어긋난다.
- `insights/index.html`은 게시물 페이지의 템플릿이다. 이 파일의 `<link rel="canonical">`이나 `ld+json` 블록을 지우면 게시물 생성이 실패하도록 되어 있으니 태그 자체는 유지한다.
- 배포 후에는 [리치 결과 테스트](https://search.google.com/test/rich-results)와 [스키마 검증기](https://validator.schema.org/)로 대표 URL을 한 번 확인한다.

## 색인(sitemap·robots·canonical) 규칙

- `dist/sitemap.xml`은 빌드 때 `scripts/generate-insight-pages.mjs`가 홈, `/insights/`, 게시물 상세를 최신 글 순으로 자동 생성한다. 새 게시물은 자동 반영되므로 손대지 않는다.
- **새 정적 HTML 엔트리를 추가하면** `generate-insight-pages.mjs`의 `sitemapEntries` 목록에도 그 주소를 직접 추가한다. 이 목록은 자동 수집이 아니다.
- `public/robots.txt`는 전체 허용에 사이트맵 주소를 알린다. AI 검색 노출을 위해 크롤러를 임의로 차단하지 않는다.
- 모든 페이지에 `<link rel="canonical">`을 절대 URL로 넣는다. 게시물 페이지는 빌드가 `/insights/<slug>/`로 자동 채운다.
- 다국어는 현재 `?lang=en`, `?lang=ja` 쿼리로 클라이언트에서 전환한다. 정적 호스팅(GitHub Pages)에서는 쿼리별로 다른 HTML을 줄 수 없어 `hreflang`을 정확히 넣을 수 없으므로 **일부러 넣지 않았다.** 언어별 검색 노출이 필요해지면 `?lang=` 대신 `/en/`, `/ja/` 경로 방식으로 옮긴 뒤 `hreflang`과 언어별 canonical을 함께 넣는다.
