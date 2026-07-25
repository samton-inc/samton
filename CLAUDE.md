# Samton project guidance

이 저장소의 작업 규칙은 `AGENTS.md` 한 곳에서 관리한다. 아래 내용을 그대로 따른다.

@AGENTS.md

## 요약 (자세한 내용은 위 문서)

- 소식·인사이트 포스트 작업은 `$manage-samton-insights` 스킬을 먼저 쓴다.
- 새 URL이나 새 게시물에는 Open Graph 태그, JSON-LD 구조화 데이터, canonical, hreflang, 사이트맵 항목을 **한국어·영어·일본어 페이지마다 빠짐없이** 넣는다.
- 게시물은 `scripts/generate-static-pages.mjs`가 빌드 때 언어별로 자동 처리하므로 손으로 만들지 않는다. 새 정적 HTML 엔트리만 직접 넣는다.
- 언어는 주소 경로로 구분한다. 한국어는 루트(`/insights/<slug>/`), 영어·일본어는 `/en`, `/ja` 접두사를 쓴다. 내부 링크는 `localizedHref`, 주소 파싱은 `splitLocalePath`를 거친다.
