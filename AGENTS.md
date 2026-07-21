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
