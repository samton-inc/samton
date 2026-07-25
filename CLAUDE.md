# Samton project guidance

이 저장소의 작업 규칙은 `AGENTS.md` 한 곳에서 관리한다. 아래 내용을 그대로 따른다.

@AGENTS.md

## 글쓰기 규칙 (가장 자주 어기는 규칙)

**긴 줄표(`—`, em dash)를 쓰지 않는다. 붙임표(`-`)를 쓴다.** 짧은 줄표(`–`)도 쓰지 않는다.
채팅 답변, 문서, 커밋 메시지, 코드 주석, 게시물 본문과 제목에 예외 없이 적용한다.
덧붙이는 말은 붙임표를 쓰거나 마침표, 쉼표, 괄호로 바꿔 쓴다.

## 요약 (자세한 내용은 위 문서)

- 소식·인사이트 포스트 작업은 `$manage-samton-insights` 스킬을 먼저 쓴다.
- 새 URL이나 새 게시물에는 Open Graph 태그, JSON-LD 구조화 데이터, canonical, hreflang, 사이트맵 항목을 **한국어·영어·일본어 페이지마다 빠짐없이** 넣는다.
- 게시물은 `scripts/generate-static-pages.mjs`가 빌드 때 언어별로 자동 처리하므로 손으로 만들지 않는다. 새 정적 HTML 엔트리만 직접 넣는다.
- 언어는 주소 경로로 구분한다. 한국어는 루트(`/insights/<slug>/`), 영어·일본어는 `/en`, `/ja` 접두사를 쓴다. 내부 링크는 `localizedHref`, 주소 파싱은 `splitLocalePath`를 거친다.
- 빌드가 본문을 정적 HTML로 프리렌더해 `<div id="root">`에 넣는다. `MarkdownContent.tsx`를 고치면 `generate-static-pages.mjs`의 `renderMarkdown`도 같이 고쳐 출력이 일치하게 유지한다.
- **새 사진은 HDR 게인맵을 제거한 뒤에 넣는다.** 게인맵이 남으면 HDR 화면에서 그 사진만 밝게 튄다. 확인은 JPEG 안 SOI 마커(`FF D8`) 개수가 2 이상인지 보고, 제거는 `sips -s format jpeg -s formatOptions 95 <파일> --out /tmp/out.jpg && mv /tmp/out.jpg <파일>`. `MPF` 문자열 grep은 오탐이 나므로 쓰지 않는다. 자세한 절차는 AGENTS.md의 「사진 규칙」.
