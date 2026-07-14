import { useEffect, useState } from "react";
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
import carbonBasicsImage from "@/assets/insights/carbon-basics-industrial.jpg";
import reportsImage from "@/assets/insights/reports-desk.jpg";
import samtonNewsImage from "@/assets/insights/samton-news-embassy.jpg";
import techPeopleImage from "@/assets/insights/tech-people-field.jpg";
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

const methodologyModules = [
  {
    id: "mobility",
    name: "수송·모빌리티",
    code: "MOBILITY METHOD",
    source: "DTG · FUEL · DISTANCE",
    description: "운행거리, 연료, 차종과 운행 데이터를 방법론에 맞춰 배출량과 감축량으로 산정합니다.",
  },
  {
    id: "energy",
    name: "에너지·발전",
    code: "ENERGY METHOD",
    source: "METER · IoT · POWER",
    description: "계량기, 발전량과 에너지 사용 데이터를 산정 기준과 배출계수에 연결합니다.",
  },
] as const;

const regulationModules = [
  {
    id: "credit",
    name: "탄소 크레딧",
    code: "CARBON CREDIT",
    output: "발급·검증 패키지",
    description: "등록, 모니터링, 검증과 발급에 필요한 기준과 증빙 항목을 시스템에 적용합니다.",
  },
  {
    id: "compliance",
    name: "규제·컴플라이언스",
    code: "COMPLIANCE",
    output: "규제 대응 보고",
    description: "기업에 적용되는 법령, 고시와 보고 기준을 연결해 대응 항목과 제출 근거를 관리합니다.",
  },
  {
    id: "disclosure",
    name: "공급망·공시 대응",
    code: "DISCLOSURE",
    output: "공시·요청 대응 자료",
    description: "공급망과 고객사, 공시 요구에 맞춰 필요한 탄소 데이터와 산정 근거를 구성합니다.",
  },
] as const;

const dmrvModuleCatalog = [
  { ...methodologyModules[0], kind: "methodology" as const, meta: methodologyModules[0].source },
  { ...regulationModules[0], kind: "regulation" as const, meta: regulationModules[0].output },
  { ...methodologyModules[1], kind: "methodology" as const, meta: methodologyModules[1].source },
  { ...regulationModules[1], kind: "regulation" as const, meta: regulationModules[1].output },
  { ...regulationModules[2], kind: "regulation" as const, meta: regulationModules[2].output },
] as const;

const creditMethodologies = [
  { id: "gcc-nmt-017", code: "GCC NMT 017", name: "전기 모빌리티 전환", input: "차량 · 운행 · 충전 데이터" },
  { id: "transport-reduction", code: "TRANSPORT", name: "수송 감축 방법론", input: "거리 · 연료 · 운송 실적" },
  { id: "fuel-switching", code: "FUEL SWITCH", name: "연료 전환 방법론", input: "연료 사용 · 배출계수" },
  { id: "renewable-energy", code: "RENEWABLE", name: "재생에너지 방법론", input: "발전량 · 계량 데이터" },
] as const;

const insightCategories = [
  {
    type: "CARBON BASICS",
    title: "DMRV와 탄소시장의 기초",
    description: "DMRV, 탄소 산정과 탄소시장의 구조를 데이터 관점에서 쉽게 설명합니다.",
    tone: "blue",
    href: "/insights/#basics",
    icon: BookOpen,
    image: carbonBasicsImage,
    imageAlt: "연기를 배출하는 산업 시설과 굴뚝",
  },
  {
    type: "SAMTON NEWS",
    title: "샘튼 소식",
    description: "협약, 프로젝트, 출장과 행사, 새로운 시스템 업데이트를 전합니다.",
    tone: "green",
    href: "/insights/#news",
    icon: Newspaper,
    image: samtonNewsImage,
    imageAlt: "주케냐 대한민국 대사관에서 진행한 샘튼 현장 미팅",
  },
  {
    type: "REPORTS",
    title: "리포트",
    description: "탄소·규제·모빌리티 데이터에 관한 최신 자료와 핵심 내용을 공유합니다.",
    tone: "orange",
    href: "/insights/#reports",
    icon: FileText,
    image: reportsImage,
    imageAlt: "책상 위의 보고서와 문서를 검토하는 모습",
  },
  {
    type: "TECH & PEOPLE",
    title: "기술·조직 이야기",
    description: "샘튼의 시스템을 만드는 기술과 설계 과정, 사람들의 이야기를 담습니다.",
    tone: "purple",
    href: "/insights/#technology",
    icon: Cpu,
    image: techPeopleImage,
    imageAlt: "케냐 현장에서 관계자들과 논의하는 샘튼 기술 조직",
  },
];

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <div className={`section-label${light ? " section-label--light" : ""}`}>{children}</div>;
}

function DmrvConfigurator() {
  type ModuleId = (typeof dmrvModuleCatalog)[number]["id"];
  type MethodologyId = (typeof creditMethodologies)[number]["id"];
  const [selectedModuleIds, setSelectedModuleIds] = useState<ModuleId[]>(["mobility", "credit", "energy"]);
  const [selectedMethodologyIds, setSelectedMethodologyIds] = useState<MethodologyId[]>(["gcc-nmt-017"]);
  const selectedModules = dmrvModuleCatalog.filter((module) => selectedModuleIds.includes(module.id));
  const selectedMethodologies = creditMethodologies.filter((methodology) => selectedMethodologyIds.includes(methodology.id));
  const hasCreditEngine = selectedModuleIds.includes("credit");

  const toggleModule = (moduleId: ModuleId) => {
    setSelectedModuleIds((current) => (
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId]
    ));
  };

  const toggleMethodology = (methodologyId: MethodologyId) => {
    setSelectedMethodologyIds((current) => (
      current.includes(methodologyId)
        ? current.filter((id) => id !== methodologyId)
        : [...current, methodologyId]
    ));
  };

  return (
    <div className="dmrv-configurator">
      <div className="dmrv-configurator__bar">
        <div><strong>Samton DMRV</strong><span>MODULAR CARBON DATA SYSTEM</span></div>
        <span><i /> INTERACTIVE ASSEMBLY</span>
      </div>

      <div className="dmrv-module-library">
        <div className="dmrv-module-library__heading">
          <div><span>ENGINE LIBRARY</span><h3>필요한 엔진을 선택해 조립해 보세요.</h3></div>
          <p>엔진을 선택하면 아래 조립 캔버스에 바로 반영됩니다.</p>
        </div>
        <div className="dmrv-module-catalog" aria-label="조립 가능한 DMRV 엔진">
          {dmrvModuleCatalog.map((module) => {
            const isActive = selectedModuleIds.includes(module.id);
            const Icon = module.kind === "methodology" ? Calculator : Scale;
            return (
              <button
                className={`dmrv-module-card dmrv-module-card--${module.kind}${isActive ? " is-active" : ""}`}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleModule(module.id)}
                key={module.id}
              >
                <Icon size={19} strokeWidth={1.6} />
                <span>{module.kind === "methodology" ? "방법론·산정" : "규제"}</span>
                <strong>{module.name}</strong>
                <b aria-hidden="true">{isActive ? "✓" : "+"}</b>
              </button>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {hasCreditEngine && (
            <motion.div
              className="credit-method-library"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="credit-method-library__heading">
                <div><span>CARBON CREDIT ENGINE · METHOD CARTRIDGES</span><strong>탄소 크레딧에 적용할 방법론</strong></div>
                <p>필요한 방법론을 여러 개 선택해 하나의 발급 엔진 안에 끼워 넣을 수 있습니다.</p>
              </div>
              <div className="credit-method-library__tabs" aria-label="탄소 크레딧 방법론 선택">
                {creditMethodologies.map((methodology) => {
                  const isActive = selectedMethodologyIds.includes(methodology.id);
                  return (
                    <button
                      type="button"
                      aria-pressed={isActive}
                      className={isActive ? "is-active" : ""}
                      onClick={() => toggleMethodology(methodology.id)}
                      key={methodology.id}
                    >
                      <span>{methodology.code}</span>
                      <strong>{methodology.name}</strong>
                      <b aria-hidden="true">{isActive ? "✓" : "+"}</b>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="dmrv-builder" aria-live="polite">
        <div className="dmrv-builder__heading">
          <div><span>ASSEMBLY CANVAS</span><h3>Samton DMRV</h3></div>
          <button type="button" onClick={() => { setSelectedModuleIds(["mobility", "credit", "energy"]); setSelectedMethodologyIds(["gcc-nmt-017"]); }}>기본 구성으로 초기화</button>
        </div>

        <div className="dmrv-builder__frame">
          <div className="dmrv-builder__trust">
            <ShieldCheck size={21} strokeWidth={1.6} />
            <div><span>ALL-PROCESS TRUST LAYER</span><strong>데이터 검증·무결성 엔진</strong></div>
          </div>

          <div className="dmrv-builder__pipeline">
            <div className="dmrv-builder__fixed-node">
              <Network size={26} strokeWidth={1.5} />
              <span>FIXED FOUNDATION</span>
              <strong>데이터 연결·표준화</strong>
              <small>API · IoT · 원천 데이터</small>
            </div>

            <i className="dmrv-builder__connector" aria-hidden="true" />

            <AnimatePresence mode="popLayout">
              {selectedModules.map((module) => {
                const Icon = module.kind === "methodology" ? Calculator : Scale;
                return (
                  <motion.div
                    layout
                    key={module.id}
                    className="dmrv-builder__step"
                    initial={{ opacity: 0, scale: 0.88, x: -8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.88, x: 8 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className={`dmrv-builder__module dmrv-builder__module--${module.kind}`}>
                      <Icon size={19} strokeWidth={1.6} />
                      <span>{module.kind === "methodology" ? "METHOD" : "REGULATION"}</span>
                      <strong>{module.name}</strong>
                      <small>{module.meta}</small>
                      {module.id === "credit" && (
                        <div className="dmrv-builder__methodologies">
                          {selectedMethodologies.length > 0 ? selectedMethodologies.map((methodology) => (
                            <motion.button
                              layout
                              type="button"
                              key={methodology.id}
                              onClick={() => toggleMethodology(methodology.id)}
                              aria-label={`${methodology.name} 방법론 제거`}
                            >
                              <span>{methodology.code}</span>
                              <strong>{methodology.name}</strong>
                              <b aria-hidden="true">×</b>
                            </motion.button>
                          )) : (
                            <div className="dmrv-builder__methodology-empty">방법론을 선택해 주세요.</div>
                          )}
                        </div>
                      )}
                      <button className="dmrv-builder__remove" type="button" onClick={() => toggleModule(module.id)} aria-label={`${module.name} 엔진 제거`}>×</button>
                    </div>
                    <i className="dmrv-builder__connector" aria-hidden="true" />
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {selectedModules.length === 0 && (
              <div className="dmrv-builder__step dmrv-builder__step--empty">
                <div className="dmrv-builder__empty">
                  <Cpu size={22} strokeWidth={1.4} />
                  <strong>선택 엔진 없음</strong>
                  <span>위에서 엔진을 추가해 주세요.</span>
                </div>
                <i className="dmrv-builder__connector" aria-hidden="true" />
              </div>
            )}

            <div className="dmrv-builder__fixed-node dmrv-builder__fixed-node--output">
              <FileCheck2 size={26} strokeWidth={1.5} />
              <span>SYSTEM OUTPUT</span>
              <strong>탄소 데이터 자산화</strong>
              <small>{hasCreditEngine ? `${selectedMethodologies.length} METHODS · MR · EVIDENCE` : "REPORT · EVIDENCE · CREDIT"}</small>
            </div>
          </div>
        </div>
      </div>

      <div className="dmrv-configurator__summary">
        <span>CURRENT BUILD</span>
        <p>{selectedModules.length > 0
          ? <><strong>{selectedModules.length}개의 엔진</strong>{hasCreditEngine && selectedMethodologies.length > 0 ? `과 ${selectedMethodologies.length}개의 세부 방법론` : ""}이 하나의 Samton DMRV 안에 조립되어 있습니다.</>
          : <>고정 데이터 기반만 적용된 상태입니다. 필요한 엔진을 추가해 보세요.</>
        }</p>
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

        <div className="engine-modal__scroll">
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
              {detail.features.map((feature) => (
                <article key={feature.title}>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEngineId, setSelectedEngineId] = useState<EngineId | null>(null);
  const selectedEngine = selectedEngineId
    ? engines.find((engine) => engine.id === selectedEngineId) ?? null
    : null;

  useEffect(() => {
    const rememberedTarget = window.sessionStorage.getItem("samton-scroll-target");
    const hashTarget = window.location.hash.replace("#", "");
    const targetId = rememberedTarget || hashTarget;

    if (!targetId) return;
    window.sessionStorage.removeItem("samton-scroll-target");

    let firstFrame = 0;
    let secondFrame = 0;
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ block: "start" });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, []);

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
              <h2>신뢰로 함께하는 고객과 파트너</h2>
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
            <h2>소프트웨어를 넘어,<br /><em>데이터 자산화</em>를 지원합니다.</h2>
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
            <SectionLabel light>03 · SAMTON DMRV ARCHITECTURE</SectionLabel>
            <h2>필요한 엔진을 조립해 만드는,<br /><em>하나의 Samton DMRV</em></h2>
            <p>고정된 데이터 기반 위에 사업과 목적에 필요한 방법론·탄소 산정 엔진과 규제 엔진을 복수로 조합해 맞춤형 DMRV를 구성합니다.</p>
          </div>

          <DmrvConfigurator />
        </section>

        <section className="news section" id="news">
          <div className="section-heading section-heading--split">
            <div>
              <SectionLabel>04 · NEWS & INSIGHTS</SectionLabel>
              <h2>샘튼의 기술과 현장을<br />더 깊이 살펴보세요.</h2>
            </div>
            <div className="news__intro">
              <p>샘튼의 새로운 활동과 데이터·규제·탄소 기술에 대한 인사이트를 전합니다.</p>
              <a href="/insights/">전체 소식·인사이트 보기 <ArrowRight size={16} /></a>
            </div>
          </div>
          <div className="news-category-grid">
            {insightCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <a className={`news-category-card news-category-card--${category.tone}`} href={category.href} key={category.title}>
                  <div className="news-category-card__image">
                    <img src={category.image} alt={category.imageAlt} />
                    <span>0{index + 1}</span>
                  </div>
                  <div className="news-category-card__body">
                    <div className="news-category-card__top"><Icon size={22} strokeWidth={1.55} /><span>{category.type}</span></div>
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                    <span className="news-category-card__link">바로가기 <ArrowRight size={15} /></span>
                  </div>
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
        <div className="footer__brand">
          <img src={logo} alt="Samton" />
          <div className="footer__description">
            <p><strong>Samton™</strong>은 고객의 복잡한 요구사항을 구조화하고,<br />데이터 기반의 소프트웨어와 전문가 팀으로 직접 해결하는 <strong>기술 파트너</strong>입니다.</p>
            <p>기업과 정부가 요구하는 <strong>높은 수준의 기준을 이해</strong>하고,<br />이를 충족하는 자체 기술 역량으로 <strong>신뢰 가능한 결과</strong>를 만들어내고 있습니다.</p>
          </div>
        </div>
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
