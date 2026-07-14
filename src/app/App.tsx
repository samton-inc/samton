import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Cpu,
  Database,
  FileCheck2,
  FileText,
  Menu,
  Network,
  Newspaper,
  Scale,
  ShieldCheck,
  Workflow,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import logo from "@/assets/Samton_logo_with_text.png";
import kacisScreen from "@/assets/projects/kacis.png";
import karisScreen from "@/assets/projects/karis.png";
import charterBusScreen from "@/assets/projects/charter-bus.png";
import servingHandsLogo from "@/assets/partners/serving-hands-logo.jpg";

const partnerLogos = [
  { name: "Kakao Mobility", logo: "https://t1.kakaocdn.net/kakaomobility/company_website/images/logo.svg", kind: "wide" },
  { name: "HI Consulting", logo: "https://hiconsulting.co.kr/wp-content/uploads/2023/06/%EA%B7%B8%EB%A6%BC4-1.png", kind: "wide" },
  { name: "KM Solution", logo: "https://cdn.imweb.me/thumbnail/20250806/237259c2943c7.png", kind: "wide" },
  { name: "Swiss Tour", logo: "https://web.archive.org/web/20240225075949im_/http://www.bus1st.com/theme/basic/common/img/logo.png", kind: "wide" },
  { name: "HAID", logo: "https://haid.kr/assets/transparent_logo.svg", kind: "wide" },
  { name: "힐빙케어", logo: "https://imgs.jobkorea.co.kr/img1/_whitebg/200X80/Co_Logo/Logo/2020/10/20/2770m00aRh_nKan7i7oj3121h0gmYoIl_4m3p2mh.png", kind: "wide" },
  { name: "인천창조경제혁신센터", logo: "https://www.venturesquare.net/wp-content/uploads/2022/01/%EB%B6%99%EC%9E%841-%EC%9D%B8%EC%B2%9C%EC%B0%BD%EC%A1%B0%EA%B2%BD%EC%A0%9C%ED%98%81%EC%8B%A0%EC%84%BC%ED%84%B0-CI.jpg", kind: "ccei" },
  { name: "인천광역시 서구시설관리공단", logo: "https://www.issi.or.kr/images/logo.png", kind: "institution" },
  { name: "Better Life Yeonsu", logo: "https://www.yeonsu.go.kr/welfare/images/main/logo.png", kind: "institution" },
  { name: "한국환경공단", logo: "https://www.keco.or.kr/images/new/web/header/logo.png", kind: "institution" },
  { name: "창업진흥원", logo: "https://www.kised.or.kr/landing/images/logo_kstartup.png", kind: "institution" },
  { name: "KOSME 중소벤처기업진흥공단", logo: "https://www.kosmes.or.kr/intro/img/img-LOGOKOSME.png", kind: "institution" },
  { name: "CNTTECH", logo: "https://www.cntt.co.kr/kr/resources/images/common/logo_210525.png", kind: "wide" },
  { name: "섬김의손길", logo: servingHandsLogo, kind: "wide" },
] as const;

const partnerLogoFaces = Array.from({ length: 8 }, (_, cardIndex) =>
  Array.from({ length: 4 }, (_, faceIndex) =>
    partnerLogos[(cardIndex + faceIndex * 8) % partnerLogos.length],
  ),
);

const engines = [
  { id: "data", name: "데이터 연결·표준화 엔진", short: "데이터 기반", icon: Network, description: "API, IoT, DTG와 외부 데이터를 연결하고 일관된 구조로 표준화합니다.", tags: ["API·IoT·DTG 연동", "데이터 표준화", "확장형 인터페이스"] },
  { id: "trust", name: "데이터 검증·무결성 엔진", short: "검증·무결성", icon: ShieldCheck, description: "데이터 품질을 검증하고 원본 출처와 변경 이력을 전 과정에 보존합니다.", tags: ["감사 추적성", "원본·변경이력 보존", "검증 로직 적용"] },
  { id: "regulation", name: "규제 엔진", short: "규제", icon: Scale, description: "법령·고시·인증요건과 적용 대상을 체계적으로 관리합니다.", tags: ["규제 적합성 관리", "법령·고시 버전관리", "적용 대상 판별"] },
  { id: "methodology", name: "방법론·탄소 산정 엔진", short: "방법론·산정", icon: Calculator, description: "탄소 방법론을 적용하고 배출량과 감축량을 근거와 함께 산정합니다.", tags: ["국제 산정기준 대응", "방법론 적합성 관리", "배출계수 이력관리"] },
  { id: "operation", name: "운영·모니터링·증빙 엔진", short: "운영·증빙", icon: Workflow, description: "업무 흐름과 현황을 관리하고 검증 가능한 보고·증빙 결과를 생성합니다.", tags: ["검증 증빙 체계", "권한·승인 이력", "운영 모니터링"] },
] as const;

type EngineId = (typeof engines)[number]["id"];

const engineDetails: Record<EngineId, {
  headline: string;
  introduction: string;
  features: Array<{ title: string; description: string }>;
}> = {
  data: {
    headline: "서로 다른 현장 데이터를 하나의 언어로 연결합니다.",
    introduction: "기업마다 다른 API, IoT, DTG, 업무 시스템의 데이터를 안정적으로 수집하고 같은 기준으로 해석할 수 있는 구조를 만듭니다.",
    features: [
      { title: "연결", description: "API·센서·운행정보·외부 시스템 등 다양한 원천 데이터를 실시간 또는 배치 방식으로 연결합니다." },
      { title: "표준화", description: "단위와 형식, 코드가 다른 데이터를 공통 구조로 변환해 이후 엔진이 일관되게 사용할 수 있도록 합니다." },
      { title: "확장", description: "새로운 데이터 소스가 추가되어도 기존 시스템을 크게 바꾸지 않고 연결 범위를 확장할 수 있습니다." },
    ],
  },
  trust: {
    headline: "모든 데이터가 어디에서 왔고 어떻게 바뀌었는지 남깁니다.",
    introduction: "수집부터 최종 결과까지 데이터 품질을 검사하고 원본, 처리 과정, 변경 이력을 보존해 설명 가능한 결과를 만듭니다.",
    features: [
      { title: "품질 검증", description: "누락·중복·이상값과 기준 불일치를 자동으로 점검해 신뢰할 수 있는 데이터만 다음 단계로 전달합니다." },
      { title: "이력 보존", description: "원본 출처와 수정 내용, 처리 시점과 담당 흐름을 기록해 데이터의 전 과정을 추적할 수 있습니다." },
      { title: "감사 대응", description: "검증이나 보고 과정에서 요구되는 근거를 다시 확인하고 동일한 결과를 재현할 수 있도록 지원합니다." },
    ],
  },
  regulation: {
    headline: "복잡한 규제를 기업이 실행할 수 있는 정보로 바꿉니다.",
    introduction: "법령·고시·인증요건의 변화와 적용 대상을 구조화하고 기업의 제품, 차량, 업무에 필요한 규제를 빠르게 판단합니다.",
    features: [
      { title: "규제 구조화", description: "국가와 기관별로 흩어진 규제 문서를 분야·대상·시점에 따라 분류하고 연결합니다." },
      { title: "개정 관리", description: "규제의 신설·개정·폐지 이력과 시행 시점을 관리해 언제 어떤 기준이 적용되는지 확인합니다." },
      { title: "적용 판단", description: "기업·제품·차종의 조건과 규제 요건을 연결해 실제 대응이 필요한 항목을 선별합니다." },
    ],
  },
  methodology: {
    headline: "탄소 방법론과 산정 근거를 하나의 계산 흐름으로 만듭니다.",
    introduction: "활동 데이터에 적합한 방법론과 배출계수를 적용하고 배출량과 감축량을 근거와 함께 계산합니다.",
    features: [
      { title: "방법론 적용", description: "사업 유형과 데이터 조건에 맞는 탄소 방법론을 선택하고 버전과 적용 기준을 관리합니다." },
      { title: "탄소 산정", description: "활동 데이터와 배출계수를 연결해 배출량·감축량을 일관된 계산식으로 산정합니다." },
      { title: "근거 연결", description: "각 결과에 사용된 데이터, 방법론, 계수와 계산 과정을 함께 보존해 검증 가능한 결과를 만듭니다." },
    ],
  },
  operation: {
    headline: "데이터를 실제 업무와 모니터링, 증빙 결과로 연결합니다.",
    introduction: "기업의 승인·배차·인증·보고 흐름을 시스템 안에서 운영하고 현황을 확인하며 필요한 보고서와 증빙을 생성합니다.",
    features: [
      { title: "업무 운영", description: "기업별 프로세스와 권한, 승인 절차를 반영해 현장의 실제 업무가 시스템 안에서 이어지게 합니다." },
      { title: "모니터링", description: "데이터 수집과 처리 상태, 주요 지표와 이상 상황을 대시보드와 알림으로 확인합니다." },
      { title: "보고·증빙", description: "검증된 데이터와 처리 이력을 바탕으로 규제 대응, 인증, DMRV에 필요한 결과물을 생성합니다." },
    ],
  },
};

const projects: Array<{
  id: string;
  number: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  result: string;
  engines: EngineId[];
  image?: string;
}> = [
  {
    id: "kacis",
    number: "01",
    name: "KACIS",
    category: "Automotive Certification",
    headline: "자동차 환경·인증 업무를 하나로 연결하는 통합 시스템",
    description: "자동차 환경 데이터를 검증하고 국가·인증별 규제 기준과 실무 프로세스를 연결해 인증 업무 전체를 관리합니다.",
    result: "규제 엔진과 운영·모니터링·증빙 엔진이 결합된 자동차 환경인증 레퍼런스",
    engines: ["data", "trust", "regulation", "operation"],
    image: kacisScreen,
  },
  {
    id: "karis",
    number: "02",
    name: "KARIS",
    category: "Regulatory Intelligence",
    headline: "변화하는 환경규제를 기업의 실행 정보로 바꾸는 시스템",
    description: "국내외 규제정보를 수집·분류하고 개정 이력과 출처를 보존해 기업과 차종에 적용되는 규제를 빠르게 판단합니다.",
    result: "규제 엔진을 대표하는 실시간 환경규제 모니터링 레퍼런스",
    engines: ["data", "trust", "regulation", "operation"],
    image: karisScreen,
  },
  {
    id: "charter-bus",
    number: "03",
    name: "전세버스",
    category: "Fleet Operations",
    headline: "운행·배차·연료 데이터를 하나의 운영 시스템으로",
    description: "DTG와 운행 데이터를 배차·ERP 업무에 연결하고 원본과 처리 이력을 보존해 효율적인 차량 운영을 지원합니다.",
    result: "데이터 연결·표준화 엔진과 운영·모니터링·증빙 엔진을 결합한 운송산업 레퍼런스",
    engines: ["data", "trust", "operation"],
    image: charterBusScreen,
  },
  {
    id: "samton-dmrv",
    number: "04",
    name: "Samton-DMRV",
    category: "Carbon DMRV",
    headline: "방법론부터 산정, 증빙까지 이어지는 신뢰 가능한 DMRV",
    description: "IoT·발전량·위성 데이터를 검증하고, 적용 가능한 방법론에 따라 탄소 배출량과 감축량을 산정해 증빙 가능한 결과로 만듭니다.",
    result: "방법론·탄소 산정 엔진을 대표하는 샘튼의 핵심 시스템",
    engines: ["data", "trust", "methodology", "operation"],
  },
];

const insightCategories = [
  {
    type: "CARBON BASICS",
    title: "DMRV와 탄소시장의 기초",
    description: "DMRV, 탄소 산정과 탄소시장의 구조를 데이터 관점에서 쉽게 설명합니다.",
    tone: "blue",
    href: "/insights/#basics",
    icon: BookOpen,
  },
  {
    type: "SAMTON NEWS",
    title: "샘튼 소식",
    description: "협약, 프로젝트, 출장과 행사, 새로운 시스템 업데이트를 전합니다.",
    tone: "green",
    href: "/insights/#news",
    icon: Newspaper,
  },
  {
    type: "REPORTS",
    title: "리포트",
    description: "탄소·규제·모빌리티 데이터에 관한 최신 자료와 핵심 내용을 공유합니다.",
    tone: "orange",
    href: "/insights/#reports",
    icon: FileText,
  },
  {
    type: "TECH & PEOPLE",
    title: "기술·조직 이야기",
    description: "샘튼의 시스템을 만드는 기술과 설계 과정, 사람들의 이야기를 담습니다.",
    tone: "purple",
    href: "/insights/#technology",
    icon: Cpu,
  },
];

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <div className={`section-label${light ? " section-label--light" : ""}`}>{children}</div>;
}

function EngineFlow({ activeEngines }: { activeEngines: EngineId[] }) {
  const activeItems = activeEngines.map((id) => engines.find((engine) => engine.id === id)!);
  const primaryIds: EngineId[] = ["data", "regulation", "methodology", "operation"];
  const primaryItems = activeItems.filter((engine) => primaryIds.includes(engine.id));
  const columnCount = primaryItems.length + 2;
  const trustEngine = engines.find((engine) => engine.id === "trust")!;
  const hasTrustLayer = activeEngines.includes("trust");

  return (
    <div className="flow-map" aria-label="선택한 프로젝트의 데이터 엔진 흐름">
      <div className="flow-map__topline">
        <span>LIVE DATA FLOW</span>
        <span><i /> VERIFIED PIPELINE</span>
      </div>
      <div className="flow-map__viewport">
        <div
          className="flow-architecture"
          style={{ "--flow-columns": columnCount } as React.CSSProperties}
        >
          <div className={`flow-trust-frame${hasTrustLayer ? " is-active" : ""}`}>
            {hasTrustLayer && (
              <div className="flow-trust-frame__label">
                <trustEngine.icon size={30} strokeWidth={1.6} />
                <div>
                  <span>ALL-PROCESS TRUST LAYER</span>
                  <strong>{trustEngine.name}</strong>
                </div>
              </div>
            )}

            <div className="flow-primary">
              <div className="flow-primary__node flow-primary__node--source">
                <span>DATA SOURCE</span>
                <Database size={28} strokeWidth={1.6} />
                <strong>원천 데이터</strong>
                <small>API · IoT · DTG</small>
              </div>
              {primaryItems.map((engine, index) => {
                const Icon = engine.icon;
                return (
                  <div className="flow-primary__node flow-primary__node--engine" key={engine.id}>
                    <span>ENGINE {String(index + 1).padStart(2, "0")}</span>
                    <Icon size={30} strokeWidth={1.6} />
                    <strong>{engine.name}</strong>
                  </div>
                );
              })}
              <div className="flow-primary__node flow-primary__node--output">
                <span>SYSTEM OUTPUT</span>
                <FileCheck2 size={28} strokeWidth={1.6} />
                <strong>시스템 결과</strong>
                <small>DMRV · REPORT</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngineModal({
  engine,
  index,
  onClose,
}: {
  engine: (typeof engines)[number];
  index: number;
  onClose: () => void;
}) {
  const Icon = engine.icon;
  const detail = engineDetails[engine.id];

  return (
    <motion.div
      className="engine-modal__backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onMouseDown={onClose}
    >
      <motion.section
        className="engine-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="engine-modal-title"
        initial={{ opacity: 0, y: 34, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="engine-modal__close" type="button" aria-label="엔진 설명 닫기" onClick={onClose} autoFocus>
          <X size={20} />
        </button>

        <div className="engine-modal__visual">
          <span>TECHNOLOGY ENGINE · {String(index + 1).padStart(2, "0")}</span>
          <div><Icon size={76} strokeWidth={1.25} /></div>
          <p>PROVEN MODULE<br />CUSTOM SYSTEM</p>
        </div>

        <div className="engine-modal__content">
          <div className="engine-modal__intro">
            <span>SAMTON ENGINE ARCHITECTURE</span>
            <h2 id="engine-modal-title">{engine.name}</h2>
            <h3>{detail.headline}</h3>
            <p>{detail.introduction}</p>
          </div>
          <div className="engine-modal__features">
            {detail.features.map((feature, featureIndex) => (
              <div key={feature.title}>
                <span>0{featureIndex + 1}</span>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);
  const [selectedEngineId, setSelectedEngineId] = useState<EngineId | null>(null);
  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? projects[0],
    [activeProjectId],
  );
  const selectedEngine = selectedEngineId
    ? engines.find((engine) => engine.id === selectedEngineId) ?? null
    : null;

  useEffect(() => {
    if (!selectedEngineId) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedEngineId(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedEngineId]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="site-shell">
      <header className="header">
        <a className="brand" href="#top" aria-label="Samton 홈" onClick={closeMenu}>
          <img src={logo} alt="Samton" />
        </a>
        <nav className={`nav${menuOpen ? " is-open" : ""}`} aria-label="주요 메뉴">
          <a href="#company" onClick={closeMenu}>회사소개</a>
          <a href="#engines" onClick={closeMenu}>기술 엔진</a>
          <a href="#projects" onClick={closeMenu}>프로젝트</a>
          <a href="/insights/" onClick={closeMenu}>소식·인사이트</a>
          <a className="nav__cta" href="#contact" onClick={closeMenu}>프로젝트 문의</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="메뉴 열기" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow">TRUSTED CARBON DATA. CUSTOM SYSTEMS.</p>
            <h1>
              <span><strong>크레딧 발급까지, End-to-End</strong></span>
              <span>탄소 데이터 시스템을 구축합니다.</span>
            </h1>
            <p className="hero__description">
              탄소 데이터의 수집과 산정부터 보고·검증(DMRV)까지, 기업의 현장과 업무에 맞는 하나의 시스템으로 설계합니다. 모든 결과의 근거를 확인할 수 있고 변화에도 유연하게 확장됩니다.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#projects">구축 사례 보기 <ArrowRight size={17} /></a>
              <a className="button button--secondary" href="#engines">기술 구조 보기</a>
            </div>
          </div>

          <motion.div
            className="hero-system"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="hero-system__dots" />
            <div className="hero-system__block hero-system__block--blue" />
            <div className="hero-system__block hero-system__block--green" />
            <div className="hero-system__panel">
              <div className="hero-system__panel-head">
                <span>SAMTON CUSTOM SYSTEM</span>
                <i>LIVE</i>
              </div>
              <div className="hero-system__flow">
                <div className="hero-system__source">
                  <small>DATA SOURCE</small>
                  <b>API</b><b>IoT</b><b>DTG</b>
                </div>
                <ArrowRight size={22} />
                <div className="hero-system__core">
                  <small>CARBON DATA SYSTEM</small>
                  <div><ShieldCheck size={20} /><strong>탄소 데이터 시스템</strong></div>
                  <span>수집 · 검증 · 산정 · 추적</span>
                </div>
                <ArrowRight size={22} />
                <div className="hero-system__output">
                  <small>OUTPUT</small>
                  <b>REPORT</b><b>PMR</b><b>CARBON CREDIT</b>
                </div>
              </div>
              <div className="hero-system__metric">
                <span>DATA CONFIDENCE</span>
                <div><i style={{ width: "92%" }} /></div>
                <strong>TRACEABLE</strong>
              </div>
            </div>
            <div className="hero-system__caption">One system, built on proven engines.</div>
          </motion.div>
        </section>

        <section className="partner-showcase" aria-label="고객과 파트너">
          <div className="partner-showcase__heading">
            <div>
              <SectionLabel>CLIENTS & PARTNERS</SectionLabel>
              <h2>신뢰와 함께하는<br />고객과 파트너</h2>
            </div>
            <p>글로벌 완성차 기업부터 모빌리티·환경·공공기관까지, 다양한 산업의 데이터 과제를 함께 해결해 왔습니다.</p>
          </div>
          <div className="partner-logo-grid" aria-label="순환하는 고객과 파트너 로고">
            {partnerLogoFaces.map((faces, cardIndex) => (
              <div
                className="partner-flip-card"
                key={faces[0].name}
                aria-label={Array.from(new Set(faces.map((partner) => partner.name))).join(", ")}
                style={{ "--flip-delay": `${cardIndex * 0.22}s` } as React.CSSProperties}
              >
                <div className="partner-flip-card__cube" aria-hidden="true">
                  {faces.map((partner, faceIndex) => (
                    <div
                      className={`partner-flip-face partner-flip-face--${faceIndex + 1} partner-logo-card--${partner.kind}`}
                      key={`${partner.name}-${faceIndex}`}
                    >
                      <img
                        src={partner.logo}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.hidden = true;
                          event.currentTarget.parentElement?.classList.add("has-image-error");
                        }}
                      />
                      <span>{partner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="company section" id="company">
          <div className="section-heading">
            <SectionLabel>01 · WHO WE ARE</SectionLabel>
            <h2>소프트웨어를 만드는 것을 넘어,<br /><em>데이터를 믿을 수 있게</em> 만듭니다.</h2>
          </div>
          <div className="company__content">
            <div className="company__statement">
              <p>
                주식회사 샘튼은 환경·탄소·모빌리티 데이터의 수집부터 검증, 산정과 보고까지 연결하는
                B2B 데이터 기술기업입니다.
              </p>
              <p>
                고객에게는 하나의 완성된 맞춤형 시스템을 제공합니다. 그 내부에는 현장과 프로젝트에서
                검증된 기술 엔진이 작동해 새로운 데이터와 규제, 업무 기능을 유연하게 확장할 수 있습니다.
              </p>
            </div>
            <div className="trust-formula">
              <div className="trust-formula__title">DATA TRUST FORMULA</div>
              <div className="trust-formula__row"><span>01</span><b>출처를 확인할 수 있는 데이터</b><CheckCircle2 /></div>
              <div className="trust-formula__row"><span>02</span><b>검증과 처리 과정이 남는 데이터</b><CheckCircle2 /></div>
              <div className="trust-formula__row"><span>03</span><b>산정 기준과 결과를 설명할 수 있는 데이터</b><CheckCircle2 /></div>
            </div>
          </div>
        </section>

        <section className="engines section" id="engines">
          <div className="section-heading section-heading--split">
            <div>
              <SectionLabel>02 · TECHNOLOGY ENGINES</SectionLabel>
              <h2>하나의 맞춤형 시스템을<br />구성하는 <em>검증된 소프트웨어 엔진</em></h2>
            </div>
            <p>
              엔진은 별개의 제품이 아닙니다. 고객의 데이터와 업무에 맞춘 하나의 시스템 안에서
              필요한 역할을 수행하며, 확장성과 데이터 공신력을 함께 만듭니다.
            </p>
          </div>
          <div className="engine-grid">
            {engines.map((engine, index) => {
              const Icon = engine.icon;
              return (
                <motion.button
                  type="button"
                  className="engine-card"
                  key={engine.id}
                  aria-haspopup="dialog"
                  aria-label={`${engine.name} 자세히 보기`}
                  onClick={() => setSelectedEngineId(engine.id)}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (index % 5) * 0.05, duration: 0.45 }}
                >
                  <div className="engine-card__top"><span>{String(index + 1).padStart(2, "0")}</span><Icon size={34} strokeWidth={1.6} /></div>
                  <h3>{engine.name}</h3>
                  <p>{engine.description}</p>
                  <div className="engine-card__proof" aria-label={`${engine.name} 지원 범위`}>
                    {engine.tags.map((tag) => <b key={tag}>{tag}</b>)}
                  </div>
                  <span className="engine-card__more">자세히 보기 <ArrowRight size={14} /></span>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section className="projects section" id="projects">
          <div className="section-heading section-heading--light">
            <SectionLabel light>03 · REFERENCE ARCHITECTURE</SectionLabel>
            <h2>프로젝트마다 다른 하나의 시스템,<br />그 안에서 연결되는 <em>샘튼의 엔진</em></h2>
            <p>프로젝트를 선택하면 실제 시스템 내부에서 어떤 기술 엔진이 작동하는지 확인할 수 있습니다.</p>
          </div>

          <div className="project-lab">
            <div className="project-tabs" role="tablist" aria-label="프로젝트 선택">
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={activeProject.id === project.id}
                  className={activeProject.id === project.id ? "is-active" : ""}
                  onClick={() => setActiveProjectId(project.id)}
                >
                  <span>{project.number}</span>
                  <div><strong>{project.name}</strong><small>{project.category}</small></div>
                  <ArrowRight size={18} />
                </button>
              ))}
            </div>

            <motion.div
              className="project-detail"
              key={activeProject.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              role="tabpanel"
            >
              <div className="project-detail__meta"><span>{activeProject.category}</span><b>{activeProject.name}</b></div>
              <h3>{activeProject.headline}</h3>
              <p>{activeProject.description}</p>
              <div className="project-detail__result"><CheckCircle2 size={18} /><span>{activeProject.result}</span></div>
              {activeProject.image && (
                <figure className="project-screen">
                  <figcaption><span>ACTUAL SYSTEM SCREEN</span><b>{activeProject.name}</b></figcaption>
                  <div><img src={activeProject.image} alt={`${activeProject.name} 실제 시스템 화면`} /></div>
                </figure>
              )}
              <EngineFlow activeEngines={activeProject.engines} />
            </motion.div>
          </div>
        </section>

        <section className="news section" id="news">
          <div className="section-heading section-heading--split">
            <div>
              <SectionLabel>04 · NEWS & INSIGHTS</SectionLabel>
              <h2>샘튼의 기술과 현장을<br />더 깊이 살펴보세요.</h2>
            </div>
            <div className="news__intro">
              <p>회사 소식과 데이터·규제·탄소 기술에 대한 인사이트가 담길 예정입니다. 현재는 구성을 확인하기 위한 샘플 콘텐츠입니다.</p>
              <a href="/insights/">전체 소식·인사이트 보기 <ArrowRight size={16} /></a>
            </div>
          </div>
          <div className="news-category-grid">
            {insightCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <a className={`news-category-card news-category-card--${category.tone}`} href={category.href} key={category.title}>
                  <div className="news-category-card__top"><Icon size={30} strokeWidth={1.5} /><span>0{index + 1}</span></div>
                  <span>{category.type}</span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <span className="news-category-card__link">분류에서 보기 <ArrowRight size={15} /></span>
                </a>
              );
            })}
          </div>
        </section>

        <section className="contact" id="contact">
          <div>
            <SectionLabel light>LET'S BUILD TRUSTED DATA</SectionLabel>
            <h2><span>우리 회사에 필요한</span><span>DMRV를 함께</span><span>설계해 보세요.</span></h2>
          </div>
          <div className="contact__action">
            <p>데이터 환경과 업무를 이해하는 것에서 시작해, 확장 가능한 하나의 시스템을 만듭니다.</p>
            <a href="mailto:shim@samton.co.kr">프로젝트 문의하기 <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__brand"><img src={logo} alt="Samton" /><p>Trusted data technology for a measurable future.</p></div>
        <div className="footer__links"><a href="#company">회사소개</a><a href="#engines">기술 엔진</a><a href="#projects">프로젝트</a><a href="/insights/">소식·인사이트</a></div>
        <div className="footer__contact"><a href="mailto:shim@samton.co.kr">shim@samton.co.kr</a><a href="tel:070-4107-9524">070-4107-9524</a></div>
        <div className="footer__bottom"><span>© 2026 Samton Inc. All rights reserved.</span><span>Environmental · Carbon · Data Technology</span></div>
        </footer>
      </div>

      <AnimatePresence>
        {selectedEngine && (
          <EngineModal
            engine={selectedEngine}
            index={engines.findIndex((engine) => engine.id === selectedEngine.id)}
            onClose={() => setSelectedEngineId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
