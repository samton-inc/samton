import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/Samton_logo_with_text.png";
import { LanguageSwitcher, localizedHref, translate, type Locale } from "@/i18n";

type SitePage = "home" | "insights" | "carbon-navigator";

export default function SiteHeader({ locale, onLocaleChange, currentPage }: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  currentPage: SitePage;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tr = (text: string) => translate(locale, text);
  const closeMenu = () => setMenuOpen(false);
  const homeSection = (id: string) => localizedHref(currentPage === "home" ? `#${id}` : `/#${id}`, locale);
  const visitSection = (id: string) => {
    if (currentPage !== "home") window.sessionStorage.setItem("samton-scroll-target", id);
    closeMenu();
  };

  return (
    <header className="header">
      <a className="brand" href={localizedHref(currentPage === "home" ? "#top" : "/", locale)} aria-label={tr("Samton 홈")} onClick={closeMenu}>
        <img src={logo} alt="Samton" />
      </a>
      <nav id="site-navigation" className={`nav${menuOpen ? " is-open" : ""}`} aria-label={tr("주요 메뉴")}>
        <a href={homeSection("company")} onClick={() => visitSection("company")}>{tr("회사소개")}</a>
        <a href={homeSection("engines")} onClick={() => visitSection("engines")}>{tr("기술 엔진")}</a>
        <a href={homeSection("projects")} onClick={() => visitSection("projects")}>{tr("프로젝트")}</a>
        <a className={currentPage === "insights" ? "is-current" : undefined} aria-current={currentPage === "insights" ? "page" : undefined} href={localizedHref("/insights/", locale)} onClick={closeMenu}>{tr("소식·인사이트")}</a>
        <a className={currentPage === "carbon-navigator" ? "is-current" : undefined} aria-current={currentPage === "carbon-navigator" ? "page" : undefined} href={localizedHref("/carbon-navigator/", locale)} onClick={closeMenu}>{tr("탄소 내비게이터")}</a>
        <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
        <a className="nav__cta" href={homeSection("contact")} onClick={() => visitSection("contact")}>{tr("프로젝트 문의")}</a>
      </nav>
      <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={tr(menuOpen ? "메뉴 닫기" : "메뉴 열기")} aria-expanded={menuOpen} aria-controls="site-navigation">
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
}
