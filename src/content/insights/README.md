# 소식·인사이트 콘텐츠 관리

글은 `posts` 폴더 안에서 글별 폴더로 관리합니다. 새 글을 추가할 때는 기존 글 폴더를 통째로 복사한 뒤 `index.md`의 항목과 본문을 수정하세요.

```md
---
slug: 영문-주소-이름
type: CARBON CREDIT
title: 글 제목
summary: 목록 카드에 표시할 짧은 설명
date: "2026.07.14"
featured: false
published: true
---

# 글 제목

본문을 Markdown으로 작성합니다.
```

글을 작성할 때는 내용에 맞는 다음 분류 폴더 안에 새 글 폴더를 만듭니다.

- `DMRV-탄소시장-기초`
- `샘튼-소식`
- `리포트`
- `기술-조직-이야기`

글 번호는 `date`가 최신인 글부터 01, 02, 03 순서로 자동 생성됩니다. MD 파일에 번호를 적을 필요가 없습니다. `featured: true`인 글은 에디터스 픽에 표시됩니다. `published: false`로 바꾸면 파일을 삭제하지 않고 목록에서 숨길 수 있습니다. 새 Markdown 파일은 `registry.ts`가 자동으로 읽으므로 별도의 목록 수정은 필요하지 않습니다.

콘텐츠 카드를 누르면 해당 파일의 `slug`를 주소로 사용해 상세 글 화면이 열립니다. 본문에서는 제목, 문단, 목록, 인용문, 링크, 굵게, 기울임, 인라인 코드와 이미지를 사용할 수 있습니다.

각 글의 폴더 구조는 다음과 같습니다.

```text
posts/
└── 리포트/
    └── new-article/
        ├── index.md
        └── images/
            └── example.jpg
```

이미지는 해당 글의 `images` 폴더에 넣고 `index.md` 본문에서 다음처럼 불러옵니다.

```md
![이미지 설명](images/example.jpg)
```

지원 형식은 PNG, JPG, JPEG, WebP, GIF, AVIF, SVG입니다. 이미지 파일도 사이트 빌드에 자동 포함됩니다.
