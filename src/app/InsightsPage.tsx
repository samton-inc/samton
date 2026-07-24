import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import logo from "@/assets/Samton_logo_with_text.png";
import { getFeaturedInsight, getInsightArticles, type InsightArticle } from "@/content/insights/registry";
import MarkdownContent from "@/app/components/MarkdownContent";
import { LanguageSwitcher, localizedHref, useLocale } from "@/i18n";

const categories = [
  {
    id: "dmrv",
    label: "DMRV 이해하기",
    shortLabel: "DMRV 이해하기",
    description: "DMRV가 왜 필요하고 현장 데이터가 어떻게 검증 가능한 탄소 데이터로 이어지는지 쉽게 설명합니다.",
  },
  {
    id: "carbon",
    label: "탄소시장 기초",
    shortLabel: "탄소시장 기초",
    description: "탄소크레딧, 배출권, 표준과 국제 규칙 등 탄소시장의 기본 구조를 쉽게 설명합니다.",
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
    description: "탄소시장의 규모·가격·발급량과 규제 동향 등 최신 정량 데이터를 분석합니다.",
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
  const { locale, setLocale, tr } = useLocale();
  const insightArticles = useMemo(() => getInsightArticles(locale), [locale]);
  const featuredInsight = useMemo(() => getFeaturedInsight(locale), [locale]);
  const pathSlug = decodeURIComponent(window.location.pathname).match(/^\/insights\/([^/]+)\/?$/)?.[1];
  const articleSlug = pathSlug ?? new URLSearchParams(window.location.search).get("article");
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

  useEffect(() => {
    if (activeArticle) return;
    document.title = locale === "ko"
      ? "소식·인사이트 | Samton"
      : locale === "ja"
        ? "ニュース・インサイト | Samton"
        : "News & Insights | Samton";
  }, [activeArticle, locale]);

  const filteredArticles = useMemo(
    () => activeFilter === "all" ? insightArticles : insightArticles.filter((article) => article.category === activeFilter),
    [activeFilter, insightArticles],
  );

  const activeCategory = categories.find((category) => category.id === activeFilter);

  const selectFilter = (filter: FilterId) => {
    setActiveFilter(filter);
    const url = new URL(window.location.href);
    url.searchParams.delete("article");
    url.hash = filter === "all" ? "" : filter;
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <div className={`site-shell site-shell--${locale} insights-page`}>
      <header className="header">
        <a className="brand" href={localizedHref("/", locale)} aria-label={tr("Samton 홈")} onClick={closeMenu}>
          <img src={logo} alt="Samton" />
        </a>
        <nav className={`nav${menuOpen ? " is-open" : ""}`} aria-label={tr("주요 메뉴")}>
          <a href={localizedHref("/#company", locale)} onClick={() => rememberLandingSection("company")}>{tr("회사소개")}</a>
          <a href={localizedHref("/#engines", locale)} onClick={() => rememberLandingSection("engines")}>{tr("기술 엔진")}</a>
          <a href={localizedHref("/#projects", locale)} onClick={() => rememberLandingSection("projects")}>{tr("프로젝트")}</a>
          <a className="is-current" href={localizedHref("/insights/", locale)} onClick={closeMenu}>{tr("소식·인사이트")}</a>
          <LanguageSwitcher locale={locale} onChange={setLocale} />
          <a className="nav__cta" href={localizedHref("/#contact", locale)} onClick={() => rememberLandingSection("contact")}>{tr("프로젝트 문의")}</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={tr("메뉴 열기")} aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main className={`journal${activeArticle ? " journal--article" : ""}`}>
        {activeArticle ? (
          <article className="insight-article">
            <a className="insight-article__back" href={localizedHref(`/insights/#${activeArticle.category}`, locale)}><ArrowLeft size={16} /> {tr("소식·인사이트로 돌아가기")}</a>
            <header className="insight-article__header">
              <div className="insight-article__meta">
                <span>{tr(categories.find((category) => category.id === activeArticle.category)?.shortLabel ?? "")}</span>
                <time dateTime={activeArticle.date.replaceAll(".", "-")}>{activeArticle.date}</time>
              </div>
              <h1>{activeArticle.title}</h1>
              <p>{activeArticle.summary}</p>
            </header>
            <MarkdownContent markdown={activeArticle.body} title={activeArticle.title} images={activeArticle.images} locale={locale} />
          </article>
        ) : (
          <>
        <section className="journal-masthead">
          <div>
            <h1>{tr("소식·인사이트")}</h1>
          </div>
          <p>{tr("탄소와 데이터에 대한 이해부터 샘튼의 현장, 연구와 기술 이야기를 차곡차곡 기록합니다.")}</p>
        </section>

        <nav className="journal-filter" aria-label={tr("소식·인사이트 카테고리")}>
          <button className={activeFilter === "all" ? "is-active" : ""} type="button" onClick={() => selectFilter("all")}>{tr("전체")}</button>
          {categories.map((category) => (
            <button
              className={activeFilter === category.id ? "is-active" : ""}
              type="button"
              onClick={() => selectFilter(category.id)}
              key={category.id}
            >
              {tr(category.shortLabel)}
            </button>
          ))}
        </nav>

        <div className={`journal-body${activeFilter === "all" ? "" : " journal-body--filtered"}`}>
          {activeFilter === "all" && featuredInsight && (
            <section className="journal-feature" aria-labelledby="journal-feature-heading">
              <div className="journal-section-heading">
                <div>
                  <h2 id="journal-feature-heading">{tr("먼저 읽어볼 글")}</h2>
                </div>
              </div>

              <a className="journal-editor-row" href={localizedHref(`/insights/${featuredInsight.slug}/`, locale)}>
                    <ArticleVisual article={featuredInsight} />
                  <div className="journal-editor-row__copy">
                    <div className="journal-card-meta">
                      <span>{tr(categories.find((category) => category.id === featuredInsight.category)?.shortLabel ?? "")}</span>
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
                <h2 id="journal-archive-heading">{activeFilter === "all" ? tr("전체 콘텐츠") : tr(activeCategory?.label ?? "")}</h2>
              </div>
              <p>{tr(activeCategory?.description ?? "DMRV와 탄소시장 해설, 샘튼 소식, 리포트와 기술·조직 이야기를 한곳에서 확인하세요.")}</p>
            </div>

            <div className="journal-card-grid">
              {filteredArticles.map((article) => {
                const category = categories.find((item) => item.id === article.category)!;
                return (
                  <a className="journal-card" href={localizedHref(`/insights/${article.slug}/`, locale)} key={article.slug}>
                    <ArticleVisual article={article} />
                    <div className="journal-card__copy">
                      <div className="journal-card-meta">
                        <span>{tr(category.shortLabel)}</span>
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
            <p>{tr("Samton™은 고객의 복잡한 요구사항을 구조화하고, 데이터 기반의 소프트웨어와 전문가 팀으로 직접 해결하는 기술 파트너입니다.")}</p>
          </div>
        </div>
        <div className="footer__links"><a href={localizedHref("/#company", locale)} onClick={() => rememberLandingSection("company")}>{tr("회사소개")}</a><a href={localizedHref("/#engines", locale)} onClick={() => rememberLandingSection("engines")}>{tr("기술 엔진")}</a><a href={localizedHref("/#projects", locale)} onClick={() => rememberLandingSection("projects")}>{tr("프로젝트")}</a><a href={localizedHref("/insights/", locale)}>{tr("소식·인사이트")}</a></div>
        <div className="footer__contact"><a href="mailto:samton-nature@samton.co.kr">samton-nature@samton.co.kr</a><a href="tel:070-4107-9524">070-4107-9524</a><LanguageSwitcher locale={locale} onChange={setLocale} variant="footer" /></div>
        <div className="footer__bottom"><span>© 2026 Samton Inc. All rights reserved.</span><span>Environmental · Carbon · Data Technology</span></div>
      </footer>
    </div>
  );
}
