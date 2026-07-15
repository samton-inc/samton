import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import logo from "@/assets/Samton_logo_with_text.png";
import { featuredInsight, insightArticles, type InsightArticle } from "@/content/insights/registry";
import MarkdownContent from "@/app/components/MarkdownContent";

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

const isFilterId = (value: string): value is FilterId =>
  value === "all" || categories.some((category) => category.id === value);

function ArticleVisual({ article }: { article: InsightArticle }) {
  return (
    <div className={`journal-card-visual journal-card-visual--${article.category}${article.thumbnail ? " has-thumbnail" : ""}`}>
      {article.thumbnail && <img src={article.thumbnail} alt={article.thumbnailAlt ?? article.title} />}
      <span>{article.type}</span>
    </div>
  );
}

export default function InsightsPage() {
  const articleSlug = new URLSearchParams(window.location.search).get("article");
  const activeArticle = articleSlug ? insightArticles.find((article) => article.slug === articleSlug) : undefined;
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const closeMenu = () => setMenuOpen(false);
  const rememberLandingSection = (sectionId: string) => {
    window.sessionStorage.setItem("samton-scroll-target", sectionId);
    closeMenu();
  };

  useEffect(() => {
    const syncFilterWithHash = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveFilter(isFilterId(hash) ? hash : "all");
    };

    syncFilterWithHash();
    window.addEventListener("hashchange", syncFilterWithHash);
    return () => window.removeEventListener("hashchange", syncFilterWithHash);
  }, []);

  useEffect(() => {
    if (!activeArticle) return;
    const previousTitle = document.title;
    document.title = `${activeArticle.title} | Samton`;
    return () => { document.title = previousTitle; };
  }, [activeArticle]);

  const filteredArticles = useMemo(
    () => activeFilter === "all" ? insightArticles : insightArticles.filter((article) => article.category === activeFilter),
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
          <a href="/#company" onClick={() => rememberLandingSection("company")}>회사소개</a>
          <a href="/#engines" onClick={() => rememberLandingSection("engines")}>기술 엔진</a>
          <a href="/#projects" onClick={() => rememberLandingSection("projects")}>프로젝트</a>
          <a className="is-current" href="/insights/" onClick={closeMenu}>소식·인사이트</a>
          <a className="nav__cta" href="/#contact" onClick={() => rememberLandingSection("contact")}>프로젝트 문의</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="메뉴 열기" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main className={`journal${activeArticle ? " journal--article" : ""}`}>
        {activeArticle ? (
          <article className="insight-article">
            <a className="insight-article__back" href={`/insights/#${activeArticle.category}`}><ArrowLeft size={16} /> 소식·인사이트로 돌아가기</a>
            <header className="insight-article__header">
              <div className="insight-article__meta">
                <span>{categories.find((category) => category.id === activeArticle.category)?.shortLabel}</span>
                <time dateTime={activeArticle.date.replaceAll(".", "-")}>{activeArticle.date}</time>
              </div>
              <h1>{activeArticle.title}</h1>
              <p>{activeArticle.summary}</p>
            </header>
            <MarkdownContent markdown={activeArticle.body} title={activeArticle.title} images={activeArticle.images} />
          </article>
        ) : (
          <>
        <section className="journal-masthead">
          <div>
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

        <div className={`journal-body${activeFilter === "all" ? "" : " journal-body--filtered"}`}>
          {activeFilter === "all" && featuredInsight && (
            <section className="journal-feature" aria-labelledby="journal-feature-heading">
              <div className="journal-section-heading">
                <div>
                  <h2 id="journal-feature-heading">먼저 읽어볼 글</h2>
                </div>
              </div>

              <a className="journal-editor-row" href={`/insights/?article=${featuredInsight.slug}`}>
                    <ArticleVisual article={featuredInsight} />
                  <div className="journal-editor-row__copy">
                    <div className="journal-card-meta">
                      <span>{categories.find((category) => category.id === featuredInsight.category)?.shortLabel}</span>
                      <time dateTime={featuredInsight.date.replaceAll(".", "-")}>{featuredInsight.date}</time>
                    </div>
                    <h3>{featuredInsight.title}</h3>
                    <p>{featuredInsight.summary}</p>
                  </div>
              </a>
            </section>
          )}

          <section className={`journal-archive${activeFilter === "all" ? "" : " journal-archive--filtered"}`} aria-labelledby="journal-archive-heading">
            <div className="journal-section-heading journal-section-heading--archive">
              <div>
                <h2 id="journal-archive-heading">{activeFilter === "all" ? "전체 콘텐츠" : activeCategory?.label}</h2>
              </div>
              <p>{activeCategory?.description ?? "기초 해설, 샘튼 소식, 리포트와 기술·조직 이야기를 한곳에서 확인하세요."}</p>
            </div>

            <div className="journal-card-grid">
              {filteredArticles.map((article) => {
                const category = categories.find((item) => item.id === article.category)!;
                return (
                  <a className="journal-card" href={`/insights/?article=${article.slug}`} key={article.slug}>
                    <ArticleVisual article={article} />
                    <div className="journal-card__copy">
                      <div className="journal-card-meta">
                        <span>{category.shortLabel}</span>
                        <time dateTime={article.date.replaceAll(".", "-")}>{article.date}</time>
                      </div>
                      <h3>{article.title}</h3>
                      <p>{article.summary}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer__brand">
          <img src={logo} alt="Samton" />
          <div className="footer__description">
            <p><strong>Samton™</strong>은 고객의 복잡한 요구사항을 구조화하고,<br />데이터 기반의 소프트웨어와 전문가 팀으로 직접 해결하는 <strong>기술 파트너</strong>입니다.</p>
          </div>
        </div>
        <div className="footer__links"><a href="/#company" onClick={() => rememberLandingSection("company")}>회사소개</a><a href="/#engines" onClick={() => rememberLandingSection("engines")}>기술 엔진</a><a href="/#projects" onClick={() => rememberLandingSection("projects")}>프로젝트</a><a href="/insights/">소식·인사이트</a></div>
        <div className="footer__contact"><a href="mailto:shim@samton.co.kr">shim@samton.co.kr</a><a href="tel:070-4107-9524">070-4107-9524</a></div>
        <div className="footer__bottom"><span>© 2026 Samton Inc. All rights reserved.</span><span>Environmental · Carbon · Data Technology</span></div>
      </footer>
    </div>
  );
}
