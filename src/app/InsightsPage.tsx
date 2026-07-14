import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import logo from "@/assets/Samton_logo_with_text.png";

const categories = [
  {
    id: "basics",
    label: "DMRV와 탄소시장의 기초",
    shortLabel: "DMRV·탄소시장 기초",
    description: "어렵게 느껴지는 DMRV와 탄소시장의 구조를 데이터 관점에서 쉽게 설명합니다.",
  },
  {
    id: "news",
    label: "샘튼 소식",
    shortLabel: "샘튼 소식",
    description: "협약, 프로젝트, 출장과 행사, 시스템 업데이트 등 샘튼의 새로운 활동을 전합니다.",
  },
  {
    id: "reports",
    label: "리포트",
    shortLabel: "리포트",
    description: "탄소·규제·모빌리티 데이터에 관한 최신 자료를 샘튼의 관점으로 정리합니다.",
  },
  {
    id: "technology",
    label: "기술·조직 이야기",
    shortLabel: "기술·조직 이야기",
    description: "샘튼의 시스템을 만드는 기술과 설계 과정, 그 일을 수행하는 사람들의 이야기를 담습니다.",
  },
] as const;

type CategoryId = (typeof categories)[number]["id"];
type FilterId = "all" | CategoryId;

const articles = [
  {
    category: "basics" as CategoryId,
    type: "DMRV BASICS",
    title: "DMRV란 무엇이며 기업에는 왜 필요한가",
    summary: "측정·보고·검증이 하나의 데이터 흐름으로 이어지는 DMRV의 기본 구조를 살펴봅니다.",
    number: "01",
    date: "2026.07.14",
  },
  {
    category: "basics" as CategoryId,
    type: "CARBON DATA",
    title: "탄소시장에서 데이터의 공신력은 어떻게 만들어지는가",
    summary: "원천 데이터와 산정 근거, 변경 이력이 탄소 결과의 신뢰도를 결정하는 과정을 설명합니다.",
    number: "02",
    date: "2026.07.11",
  },
  {
    category: "news" as CategoryId,
    type: "PARTNERSHIP",
    title: "샘튼의 새로운 협약과 프로젝트 소식",
    summary: "기업과 기관, 현장 파트너와 함께 시작하는 새로운 데이터 프로젝트를 소개할 예정입니다.",
    number: "03",
    date: "2026.07.08",
  },
  {
    category: "news" as CategoryId,
    type: "FIELD NOTE",
    title: "현장에서 만난 탄소 데이터의 과제",
    summary: "출장과 현장 방문, 행사에서 확인한 문제와 샘튼이 찾은 해결 방향을 기록합니다.",
    number: "04",
    date: "2026.07.04",
  },
  {
    category: "reports" as CategoryId,
    type: "MARKET BRIEF",
    title: "탄소시장과 환경규제 변화 브리프",
    summary: "기업이 주목해야 할 제도와 시장 변화를 핵심 내용과 적용 관점 중심으로 정리합니다.",
    number: "05",
    date: "2026.06.27",
  },
  {
    category: "reports" as CategoryId,
    type: "DATA REPORT",
    title: "모빌리티 탄소 데이터 리포트",
    summary: "운행과 연료, 배차 데이터를 통해 확인할 수 있는 탄소 정보와 산업적 의미를 살펴봅니다.",
    number: "06",
    date: "2026.06.20",
  },
  {
    category: "technology" as CategoryId,
    type: "TECHNOLOGY",
    title: "검증 가능한 데이터를 만드는 샘튼의 방식",
    summary: "데이터 연결부터 무결성, 규제, 산정과 증빙까지 샘튼 엔진이 작동하는 방식을 소개합니다.",
    number: "07",
    date: "2026.06.13",
  },
  {
    category: "technology" as CategoryId,
    type: "INSIDE SAMTON",
    title: "프로젝트마다 하나의 시스템을 설계하는 과정",
    summary: "검증된 기술 모듈을 고객의 현장과 업무에 맞는 하나의 소프트웨어로 구성하는 과정을 다룹니다.",
    number: "08",
    date: "2026.06.06",
  },
];

const isFilterId = (value: string): value is FilterId =>
  value === "all" || categories.some((category) => category.id === value);

export default function InsightsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const syncFilterWithHash = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveFilter(isFilterId(hash) ? hash : "all");
    };

    syncFilterWithHash();
    window.addEventListener("hashchange", syncFilterWithHash);
    return () => window.removeEventListener("hashchange", syncFilterWithHash);
  }, []);

  const filteredArticles = useMemo(
    () => activeFilter === "all" ? articles : articles.filter((article) => article.category === activeFilter),
    [activeFilter],
  );

  const activeCategory = categories.find((category) => category.id === activeFilter);

  const selectFilter = (filter: FilterId) => {
    setActiveFilter(filter);
    window.history.replaceState(null, "", filter === "all" ? "/insights/" : `/insights/#${filter}`);
  };

  return (
    <div className="site-shell insights-page">
      <header className="header">
        <a className="brand" href="/" aria-label="Samton 홈" onClick={closeMenu}>
          <img src={logo} alt="Samton" />
        </a>
        <nav className={`nav${menuOpen ? " is-open" : ""}`} aria-label="주요 메뉴">
          <a href="/#company" onClick={closeMenu}>회사소개</a>
          <a href="/#engines" onClick={closeMenu}>기술 엔진</a>
          <a href="/#projects" onClick={closeMenu}>프로젝트</a>
          <a className="is-current" href="/insights/" onClick={closeMenu}>소식·인사이트</a>
          <a className="nav__cta" href="/#contact" onClick={closeMenu}>프로젝트 문의</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="메뉴 열기" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main className="journal">
        <section className="journal-masthead">
          <div>
            <span>SAMTON JOURNAL</span>
            <h1>소식·인사이트</h1>
          </div>
          <p>탄소와 데이터에 대한 이해부터 샘튼의 현장, 연구와 기술 이야기를 차곡차곡 기록합니다.</p>
        </section>

        <nav className="journal-filter" aria-label="소식·인사이트 카테고리">
          <button className={activeFilter === "all" ? "is-active" : ""} type="button" onClick={() => selectFilter("all")}>전체</button>
          {categories.map((category) => (
            <button
              className={activeFilter === category.id ? "is-active" : ""}
              type="button"
              onClick={() => selectFilter(category.id)}
              key={category.id}
            >
              {category.shortLabel}
            </button>
          ))}
        </nav>

        <div className="journal-body">
          {activeFilter === "all" && (
            <section className="journal-feature" aria-labelledby="journal-feature-heading">
              <div className="journal-section-heading">
                <div>
                  <span>EDITOR'S PICK</span>
                  <h2 id="journal-feature-heading">먼저 읽어볼 글</h2>
                </div>
                <span>콘텐츠 준비 중</span>
              </div>

              <article className="journal-editor-row">
                  <div className="journal-card-visual journal-card-visual--basics">
                    <span>DMRV BASICS</span>
                    <b>01</b>
                    <i aria-hidden="true" />
                  </div>
                  <div className="journal-editor-row__copy">
                    <div className="journal-card-meta">
                      <span>DMRV와 탄소시장의 기초</span>
                      <time dateTime="2026-07-14">2026.07.14</time>
                    </div>
                    <h3>DMRV란 무엇이며 기업에는 왜 필요한가</h3>
                    <p>측정·보고·검증이 하나의 데이터 흐름으로 이어지는 DMRV의 기본 구조를 살펴봅니다.</p>
                    <span className="journal-read">곧 공개됩니다 <ArrowRight size={15} /></span>
                  </div>
              </article>
            </section>
          )}

          <section className="journal-archive" aria-labelledby="journal-archive-heading">
            <div className="journal-section-heading journal-section-heading--archive">
              <div>
                <span>{activeFilter === "all" ? "ALL STORIES" : activeCategory?.shortLabel}</span>
                <h2 id="journal-archive-heading">{activeFilter === "all" ? "전체 콘텐츠" : activeCategory?.label}</h2>
              </div>
              <p>{activeCategory?.description ?? "기초 해설, 샘튼 소식, 리포트와 기술·조직 이야기를 한곳에서 확인하세요."}</p>
            </div>

            <div className="journal-card-grid">
              {filteredArticles.map((article) => {
                const category = categories.find((item) => item.id === article.category)!;
                return (
                  <article className="journal-card" key={article.title}>
                    <div className={`journal-card-visual journal-card-visual--${article.category}`}>
                      <span>{article.type}</span>
                      <b>{article.number}</b>
                      <i aria-hidden="true" />
                    </div>
                    <div className="journal-card__copy">
                      <div className="journal-card-meta">
                        <span>{category.shortLabel}</span>
                        <time dateTime={article.date.replaceAll(".", "-")}>{article.date}</time>
                      </div>
                      <h3>{article.title}</h3>
                      <p>{article.summary}</p>
                      <span className="journal-read">곧 공개됩니다 <ArrowRight size={15} /></span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="footer__brand"><img src={logo} alt="Samton" /><p>Trusted data technology for a measurable future.</p></div>
        <div className="footer__links"><a href="/#company">회사소개</a><a href="/#engines">기술 엔진</a><a href="/#projects">프로젝트</a><a href="/insights/">소식·인사이트</a></div>
        <div className="footer__contact"><a href="mailto:shim@samton.co.kr">shim@samton.co.kr</a><a href="tel:070-4107-9524">070-4107-9524</a></div>
        <div className="footer__bottom"><span>© 2026 Samton Inc. All rights reserved.</span><span>Environmental · Carbon · Data Technology</span></div>
      </footer>
    </div>
  );
}
