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
import { LanguageSwitcher, localizedHref, translate, useLocale, type Locale } from "@/i18n";
import logo from "@/assets/Samton_logo_with_text.png";
import carbonBasicsImage from "@/assets/insights/carbon-basics-industrial.jpg";
import dmrvUnderstandingImage from "@/assets/insights/dmrv-understanding.jpg";
import reportsImage from "@/assets/insights/reports-desk.jpg";
import samtonNewsImage from "@/assets/insights/samton-news-embassy.jpg";
import techPeopleImage from "@/assets/insights/tech-people-field.jpg";
import cnttechLogo from "@/assets/partners/cnttech.png";
import haidLogo from "@/assets/partners/haid.svg";
import healbeingCareLogo from "@/assets/partners/healbeing-care.jpg";
import hiConsultingLogo from "@/assets/partners/hi-consulting.png";
import incheonCceiLogo from "@/assets/partners/incheon-ccei.jpg";
import incheonSeoguFmcLogo from "@/assets/partners/incheon-seogu-fmc.png";
import kakaoMobilityLogo from "@/assets/partners/kakao-mobility.svg";
import kmSolutionLogo from "@/assets/partners/km-solution.png";
import koreaEnvironmentCorpLogo from "@/assets/partners/korea-environment-corp.png";
import kosmeLogo from "@/assets/partners/kosme.png";
import kStartupLogo from "@/assets/partners/k-startup.png";
import petelLogo from "@/assets/partners/petel.png";
import servingHandsLogo from "@/assets/partners/serving-hands-logo.jpg";
import swissTourLogo from "@/assets/partners/swiss-tour.jpg";
import yeonsuSymbolLogo from "@/assets/partners/yeonsu-symbol.gif";

const partnerLogos = [
  { name: "Kakao Mobility", logo: kakaoMobilityLogo, kind: "wide" },
  { name: "HI Consulting", logo: hiConsultingLogo, kind: "wide" },
  { name: "KM Solution", logo: kmSolutionLogo, kind: "wide" },
  { name: "Swiss Tour", logo: swissTourLogo, kind: "wide" },
  { name: "HAID", logo: haidLogo, kind: "wide" },
  { name: "힐빙케어", logo: healbeingCareLogo, kind: "wide" },
  { name: "인천창조경제혁신센터", logo: incheonCceiLogo, kind: "ccei" },
  { name: "인천광역시 서구시설관리공단", logo: incheonSeoguFmcLogo, kind: "institution" },
  { name: "Better Life Yeonsu", logo: yeonsuSymbolLogo, kind: "wide" },
  { name: "한국환경공단", logo: koreaEnvironmentCorpLogo, kind: "institution" },
  { name: "창업진흥원", logo: kStartupLogo, kind: "institution" },
  { name: "KOSME 중소벤처기업진흥공단", logo: kosmeLogo, kind: "institution" },
  { name: "CNTTECH", logo: cnttechLogo, kind: "wide" },
  { name: "섬김의손길", logo: servingHandsLogo, kind: "wide" },
  { name: "페텔", logo: petelLogo, kind: "wide" },
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

const methodologyOptions = [
  { id: "corporate-inventory", kind: "corporate", name: "GHG Protocol 기업 인벤토리 기준", input: "Scope 1 · 2 · 3 활동 데이터" },
  { id: "product-footprint", kind: "product", name: "ISO 14067 제품 탄소발자국 기준", input: "원료 · 생산 · 운송 · 사용 · 폐기 데이터" },
  { id: "transport", kind: "credit", name: "수송·모빌리티 감축 방법론", input: "거리 · 연료 · 차량 · 운송 실적" },
  { id: "renewable-energy", kind: "credit", name: "재생에너지 발전 방법론", input: "발전량 · 계량 · 전력 데이터" },
  { id: "energy-efficiency", kind: "credit", name: "에너지 효율 개선 방법론", input: "에너지 사용 · 설비 · 생산 데이터" },
  { id: "waste-methane", kind: "credit", name: "폐기물 메탄 회수 방법론", input: "폐기물 · 메탄 회수 · 처리 데이터" },
  { id: "forestry-removal", kind: "credit", name: "산림·토지 탄소흡수 방법론", input: "토지 · 생장량 · 탄소저장 데이터" },
] as const;

type MethodologyKind = (typeof methodologyOptions)[number]["kind"];

const carbonAssetOutputs = [
  {
    id: "internal-use",
    name: "내부 탄소관리 데이터",
    code: "INTERNAL USE · NOT VERIFIED",
    requiredEngines: ["data", "methodology", "operation"],
    requiresMethodology: true,
    onlyWithoutTrust: true,
  },
  {
    id: "regulatory-use",
    name: "법·제도 기준 관리 데이터",
    code: "INTERNAL USE · REGULATORY MAPPED",
    requiredEngines: ["data", "regulation", "methodology", "operation"],
    requiresMethodology: true,
    onlyWithoutTrust: true,
  },
  {
    id: "carbon-credit",
    name: "탄소 크레딧 발급 준비 데이터",
    code: "ISSUANCE-READY · EXTERNAL REVIEW",
    requiredEngines: ["data", "trust", "regulation", "methodology", "operation"],
    requiredMethodologyKinds: ["credit"],
  },
  {
    id: "compliance",
    name: "규제 대응 제출 준비 데이터",
    code: "REGULATORY SUBMISSION · REVIEW REQUIRED",
    requiredEngines: ["data", "trust", "regulation", "methodology", "operation"],
    requiresMethodology: true,
  },
  {
    id: "disclosure",
    name: "공시용 Scope 1·2·3 산정 데이터",
    code: "GHG PROTOCOL · DISCLOSURE DRAFT",
    requiredEngines: ["data", "trust", "methodology", "operation"],
    requiredMethodologyKinds: ["corporate"],
  },
  {
    id: "product-footprint",
    name: "제품 탄소발자국 산정 데이터",
    code: "ISO 14067 · PCF CALCULATION",
    requiredEngines: ["data", "trust", "methodology"],
    requiredMethodologyKinds: ["product"],
  },
  {
    id: "assurance",
    name: "검증·감사 대응 증빙 패키지",
    code: "TRACE · EVIDENCE · REVIEW REQUIRED",
    requiredEngines: ["data", "trust", "methodology", "operation"],
    requiresMethodology: true,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  name: string;
  code: string;
  requiredEngines: readonly EngineId[];
  requiresMethodology?: boolean;
  requiredMethodologyKinds?: readonly MethodologyKind[];
  onlyWithoutTrust?: boolean;
}>;

const insightCategories = [
  {
    type: "DMRV",
    title: "DMRV 이해하기",
    description: "현장 데이터가 검증 가능한 탄소 데이터와 자산으로 이어지는 과정을 설명합니다.",
    tone: "blue",
    href: "/insights/#dmrv",
    icon: Database,
    image: dmrvUnderstandingImage,
    imageAlt: "태양광 발전 현장의 데이터 계측 장비와 모니터링 화면",
  },
  {
    type: "CARBON BASICS",
    title: "탄소시장 기초",
    description: "탄소크레딧과 배출권, 표준과 국제 규칙 등 탄소시장의 구조를 쉽게 설명합니다.",
    tone: "cyan",
    href: "/insights/#carbon",
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
    description: "탄소시장의 규모·가격·발급량과 규제 동향 등 최신 정량 데이터를 분석합니다.",
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

function DmrvConfigurator({ locale }: { locale: Locale }) {
  type MethodologyId = (typeof methodologyOptions)[number]["id"];
  const tr = (source: string) => translate(locale, source);
  const [selectedEngineIds, setSelectedEngineIds] = useState<EngineId[]>([]);
  const [selectedMethodologyIds, setSelectedMethodologyIds] = useState<MethodologyId[]>([]);
  const selectedEngines = engines.filter((engine) => selectedEngineIds.includes(engine.id));
  const pipelineEngines = selectedEngines.filter((engine) => engine.id !== "trust");
  const selectedMethodologies = methodologyOptions.filter((methodology) => selectedMethodologyIds.includes(methodology.id));
  const selectedCreditMethodologies = selectedMethodologies.filter((methodology) => methodology.kind === "credit");
  const hasTrustEngine = selectedEngineIds.includes("trust");
  const hasMethodologyEngine = selectedEngineIds.includes("methodology");
  const availableAssetOutputs = carbonAssetOutputs.filter((output) => (
    output.requiredEngines.every((engineId) => selectedEngineIds.includes(engineId))
    && (!("requiresMethodology" in output) || !output.requiresMethodology || selectedMethodologies.length > 0)
    && (!("requiredMethodologyKinds" in output) || !output.requiredMethodologyKinds || output.requiredMethodologyKinds.some((kind) => selectedMethodologies.some((methodology) => methodology.kind === kind)))
    && (!("onlyWithoutTrust" in output) || !output.onlyWithoutTrust || !hasTrustEngine)
  ));

  const toggleEngine = (engineId: EngineId) => {
    setSelectedEngineIds((current) => (
      current.includes(engineId)
        ? current.filter((id) => id !== engineId)
        : [...current, engineId]
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
          <div><h3>{tr("필요한 엔진을 선택해 조립해 보세요.")}</h3></div>
          <p>{tr("엔진을 선택하면 아래 조립 캔버스에 바로 반영됩니다.")}</p>
        </div>
        <div className="dmrv-module-catalog" aria-label={tr("조립 가능한 소프트웨어 엔진")}>
          {engines.map((engine) => {
            const isActive = selectedEngineIds.includes(engine.id);
            const Icon = engine.icon;
            return (
              <button
                className={`dmrv-module-card dmrv-module-card--${engine.id}${isActive ? " is-active" : ""}`}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleEngine(engine.id)}
                key={engine.id}
              >
                <Icon size={19} strokeWidth={1.6} />
                <strong>{tr(engine.name)}</strong>
                <b aria-hidden="true">{isActive ? "✓" : "+"}</b>
              </button>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {hasMethodologyEngine && (
            <motion.div
              className="credit-method-library"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="credit-method-library__heading">
                <div><strong>{tr("방법론·탄소 산정 엔진에 적용할 산정 기준과 세부 방법론")}</strong></div>
                <p>{tr("기업 인벤토리·제품 탄소발자국·탄소 크레딧 목적에 맞는 기준을 선택할 수 있습니다.")}</p>
              </div>
              <div className="credit-method-library__tabs" aria-label={tr("세부 탄소 방법론 선택")}>
                {methodologyOptions.map((methodology) => {
                  const isActive = selectedMethodologyIds.includes(methodology.id);
                  return (
                    <button
                      type="button"
                      aria-pressed={isActive}
                      className={isActive ? "is-active" : ""}
                      onClick={() => toggleMethodology(methodology.id)}
                      key={methodology.id}
                    >
                      <strong>{tr(methodology.name)}</strong>
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
          <div><h3>Samton DMRV</h3></div>
          <button type="button" onClick={() => { setSelectedEngineIds([]); setSelectedMethodologyIds([]); }}>{tr("초기화")}</button>
        </div>

        <div className="dmrv-builder__frame">
          <div className={`dmrv-builder__pipeline${hasTrustEngine ? " has-trust-layer" : ""}`}>
            <div className="dmrv-builder__fixed-node dmrv-builder__fixed-node--input">
              <Database size={26} strokeWidth={1.5} />
              <span>RAW DATA</span>
              <strong>{tr("원천 데이터")}</strong>
              <small>API · IoT · DTG · METER</small>
            </div>

            <i className="dmrv-builder__connector" aria-hidden="true" />

            <div className={`dmrv-builder__engine-zone${hasTrustEngine ? " has-trust-layer" : ""}`}>
              <AnimatePresence initial={false}>
                {hasTrustEngine && (
                  <motion.div
                    className="dmrv-builder__trust"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 48, marginBottom: 12 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <ShieldCheck size={21} strokeWidth={1.6} />
                    <div><strong>{tr("데이터 검증·무결성 엔진")}</strong></div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="dmrv-builder__engine-pipeline">
                <AnimatePresence mode="popLayout">
                  {pipelineEngines.map((engine, engineIndex) => {
                    const Icon = engine.icon;
                    return (
                      <motion.div
                        layout
                        key={engine.id}
                        className="dmrv-builder__step"
                        initial={{ opacity: 0, scale: 0.88, x: -8 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.88, x: 8 }}
                        transition={{ duration: 0.22 }}
                      >
                        <div className={`dmrv-builder__module dmrv-builder__module--${engine.id}`}>
                          <Icon size={19} strokeWidth={1.6} />
                          <strong>{tr(engine.name)}</strong>
                          <small>{tr(engine.description)}</small>
                          {engine.id === "methodology" && (
                            <div className="dmrv-builder__methodologies">
                              {selectedMethodologies.length > 0 ? selectedMethodologies.map((methodology) => (
                                <motion.button
                                  layout
                                  type="button"
                                  key={methodology.id}
                                  onClick={() => toggleMethodology(methodology.id)}
                                aria-label={`${tr(methodology.name)} ${tr("방법론 제거")}`}
                              >
                                  <strong>{tr(methodology.name)}</strong>
                                  <b aria-hidden="true">×</b>
                                </motion.button>
                              )) : (
                                <div className="dmrv-builder__methodology-empty">{tr("방법론을 선택해 주세요.")}</div>
                              )}
                            </div>
                          )}
                          <button className="dmrv-builder__remove" type="button" onClick={() => toggleEngine(engine.id)} aria-label={`${tr(engine.name)} ${tr("제거")}`}>×</button>
                        </div>
                        {engineIndex < pipelineEngines.length - 1 && <i className="dmrv-builder__connector" aria-hidden="true" />}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {pipelineEngines.length === 0 && (
                  <div className="dmrv-builder__step dmrv-builder__step--empty">
                    <div className="dmrv-builder__empty">
                      <Cpu size={22} strokeWidth={1.4} />
                      <strong>{tr("처리 엔진을 선택해 주세요.")}</strong>
                      <span>{tr("선택한 엔진이 이 영역에 조립됩니다.")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <i className="dmrv-builder__connector" aria-hidden="true" />

            <div className="dmrv-builder__fixed-node dmrv-builder__fixed-node--output">
              <FileCheck2 size={26} strokeWidth={1.5} />
              <span>SYSTEM OUTPUT</span>
              <strong>{tr("탄소 데이터 자산화")}</strong>
              <div className="dmrv-builder__outputs">
                <AnimatePresence initial={false} mode="popLayout">
                  {availableAssetOutputs.map((output) => (
                    <motion.div
                      layout
                      className={`dmrv-builder__output-item${output.id === "internal-use" || output.id === "regulatory-use" ? " is-internal" : ""}`}
                      key={output.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                    >
                      <b>{tr(output.name)}</b>
                      <small>{output.id === "carbon-credit"
                        ? selectedCreditMethodologies.length > 1
                          ? locale === "ko"
                            ? `${selectedCreditMethodologies[0].name} 외 ${selectedCreditMethodologies.length - 1}개`
                            : locale === "ja"
                              ? `${tr(selectedCreditMethodologies[0].name)}ほか${selectedCreditMethodologies.length - 1}件`
                              : `${tr(selectedCreditMethodologies[0].name)} +${selectedCreditMethodologies.length - 1} more`
                          : selectedCreditMethodologies[0] ? tr(selectedCreditMethodologies[0].name) : ""
                        : output.code}</small>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {availableAssetOutputs.length === 0 && (
                  <div className="dmrv-builder__output-empty">{hasTrustEngine
                    ? tr("엔진 조합이 완성되면 생성 가능한 대외 활용 결과가 표시됩니다.")
                    : tr("연결·산정·운영 엔진을 조합하면 내부 활용 데이터가 표시됩니다.")}</div>
                )}
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
  locale,
  onClose,
}: {
  engine: (typeof engines)[number];
  index: number;
  locale: Locale;
  onClose: () => void;
}) {
  const Icon = engine.icon;
  const detail = engineDetails[engine.id];
  const tr = (source: string) => translate(locale, source);

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
        className={`engine-modal engine-modal--${locale}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="engine-modal-title"
        initial={{ opacity: 0, y: 34, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="engine-modal__close" type="button" aria-label={tr("엔진 설명 닫기")} onClick={onClose} autoFocus>
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
              <h2 id="engine-modal-title">{tr(engine.name)}</h2>
              <h3>{tr(detail.headline)}</h3>
              <p>{tr(detail.introduction)}</p>
            </div>
            <div className="engine-modal__features">
              {detail.features.map((feature) => (
                <article key={feature.title}>
                  <h4>{tr(feature.title)}</h4>
                  <p>{tr(feature.description)}</p>
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
  const { locale, setLocale, tr } = useLocale();
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

  useEffect(() => {
    document.title = locale === "ko"
      ? "샘튼 | 탄소 데이터 시스템"
      : locale === "ja"
        ? "Samton | 炭素データシステム"
        : "Samton | Carbon Data Systems";
  }, [locale]);

  return (
    <>
      <div className={`site-shell site-shell--${locale}`}>
      <header className="header">
        <a className="brand" href="#top" aria-label={tr("Samton 홈")} onClick={closeMenu}>
          <img src={logo} alt="Samton" />
        </a>
        <nav className={`nav${menuOpen ? " is-open" : ""}`} aria-label={tr("주요 메뉴")}>
          <a href="#company" onClick={closeMenu}>{tr("회사소개")}</a>
          <a href="#engines" onClick={closeMenu}>{tr("기술 엔진")}</a>
          <a href="#projects" onClick={closeMenu}>{tr("프로젝트")}</a>
          <a href={localizedHref("/insights/", locale)} onClick={closeMenu}>{tr("소식·인사이트")}</a>
          <LanguageSwitcher locale={locale} onChange={setLocale} />
          <a className="nav__cta" href="#contact" onClick={closeMenu}>{tr("프로젝트 문의")}</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={tr("메뉴 열기")} aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow">TRUSTED CARBON DATA. CUSTOM SYSTEMS.</p>
            <h1>
              <span><strong>{tr("크레딧 발급까지, End-to-End")}</strong></span>
              <span>{tr("탄소 데이터 시스템을 구축합니다.")}</span>
            </h1>
            <p className="hero__description">
              {tr("탄소 데이터의 수집과 산정부터 보고·검증(DMRV)까지, 기업의 현장과 업무에 맞는 하나의 시스템으로 설계합니다. 모든 결과의 근거를 확인할 수 있고 변화에도 유연하게 확장됩니다.")}
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#projects">{tr("구축 사례 보기")} <ArrowRight size={17} /></a>
              <a className="button button--secondary" href="#engines">{tr("기술 구조 보기")}</a>
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
                  <div><ShieldCheck size={20} /><strong>{tr("탄소 데이터 시스템")}</strong></div>
                  <span>{tr("수집 · 검증 · 산정 · 추적")}</span>
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

        <section className="partner-showcase" aria-label={tr("고객과 파트너")}>
          <div className="partner-showcase__heading">
            <div>
              <SectionLabel>CLIENTS & PARTNERS</SectionLabel>
              <h2>{tr("신뢰로 함께하는 고객과 파트너")}</h2>
            </div>
            <p>{tr("글로벌 완성차 기업부터 모빌리티·환경·공공기관까지, 다양한 산업의 데이터 과제를 함께 해결해 왔습니다.")}</p>
          </div>
          <div className="partner-logo-grid" aria-label={tr("순환하는 고객과 파트너 로고")}>
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
            <h2>{tr("소프트웨어를 넘어,")}<br /><em>{tr("데이터 자산화")}</em>{tr("를 지원합니다.")}</h2>
          </div>
          <div className="company__content">
            <div className="company__statement">
              <p>{tr("주식회사 샘튼은 환경·탄소·모빌리티 데이터의 수집부터 검증, 산정과 보고까지 연결하는 B2B 데이터 기술기업입니다.")}</p>
              <p>{tr("고객에게는 하나의 완성된 맞춤형 시스템을 제공합니다. 그 내부에는 현장과 프로젝트에서 검증된 기술 엔진이 작동해 새로운 데이터와 규제, 업무 기능을 유연하게 확장할 수 있습니다.")}</p>
            </div>
            <div className="trust-formula">
              <div className="trust-formula__title">DATA TRUST FORMULA</div>
              <div className="trust-formula__row"><span>01</span><b>{tr("출처를 확인할 수 있는 데이터")}</b><CheckCircle2 /></div>
              <div className="trust-formula__row"><span>02</span><b>{tr("검증과 처리 과정이 남는 데이터")}</b><CheckCircle2 /></div>
              <div className="trust-formula__row"><span>03</span><b>{tr("산정 기준과 결과를 설명할 수 있는 데이터")}</b><CheckCircle2 /></div>
            </div>
          </div>
        </section>

        <section className="engines section" id="engines">
          <div className="section-heading section-heading--split">
            <div>
              <SectionLabel>02 · TECHNOLOGY ENGINES</SectionLabel>
              <h2>{tr("하나의 맞춤형 시스템을")}<br />{tr("구성하는 ")}<em>{tr("검증된 소프트웨어 엔진")}</em></h2>
            </div>
            <p>{tr("엔진은 별개의 제품이 아닙니다. 고객의 데이터와 업무에 맞춘 하나의 시스템 안에서 필요한 역할을 수행하며, 확장성과 데이터 공신력을 함께 만듭니다.")}</p>
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
                  aria-label={`${tr(engine.name)} ${tr("자세히 보기")}`}
                  onClick={() => setSelectedEngineId(engine.id)}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (index % 5) * 0.05, duration: 0.45 }}
                >
                  <div className="engine-card__top"><span>{String(index + 1).padStart(2, "0")}</span><Icon size={34} strokeWidth={1.6} /></div>
                  <h3>{tr(engine.name)}</h3>
                  <p>{tr(engine.description)}</p>
                  <div className="engine-card__proof" aria-label={`${tr(engine.name)} ${tr("지원 범위")}`}>
                    {engine.tags.map((tag) => <b key={tag}>{tr(tag)}</b>)}
                  </div>
                  <span className="engine-card__more">{tr("자세히 보기")} <ArrowRight size={14} /></span>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section className="projects section" id="projects">
          <div className="section-heading section-heading--light">
            <SectionLabel light>03 · SAMTON DMRV ARCHITECTURE</SectionLabel>
            <h2>{tr("필요한 엔진을 조립해 만드는,")}<br /><em>{tr("하나의 Samton DMRV")}</em></h2>
            <p>{tr("고정된 데이터 기반 위에 사업과 목적에 필요한 방법론·탄소 산정 엔진과 규제 엔진을 복수로 조합해 맞춤형 DMRV를 구성합니다.")}</p>
          </div>

          <DmrvConfigurator locale={locale} />
        </section>

        <section className="news section" id="news">
          <div className="section-heading section-heading--split">
            <div>
              <SectionLabel>04 · NEWS & INSIGHTS</SectionLabel>
              <h2>{tr("샘튼의 기술과 현장을")}<br />{tr("더 깊이 살펴보세요.")}</h2>
            </div>
            <div className="news__intro">
              <p>{tr("샘튼의 새로운 활동과 데이터·규제·탄소 기술에 대한 인사이트를 전합니다.")}</p>
              <a href={localizedHref("/insights/", locale)}>{tr("전체 소식·인사이트 보기")} <ArrowRight size={16} /></a>
            </div>
          </div>
          <div className="news-category-grid">
            {insightCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <a className={`news-category-card news-category-card--${category.tone}`} href={localizedHref(category.href, locale)} key={category.title}>
                  <div className="news-category-card__image">
                    <img src={category.image} alt={tr(category.imageAlt)} />
                    <span>0{index + 1}</span>
                  </div>
                  <div className="news-category-card__body">
                    <div className="news-category-card__top"><Icon size={22} strokeWidth={1.55} /><span>{category.type}</span></div>
                    <h3>{tr(category.title)}</h3>
                    <p>{tr(category.description)}</p>
                    <span className="news-category-card__link">{tr("바로가기")} <ArrowRight size={15} /></span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section className="contact" id="contact">
          <div>
            <SectionLabel light>LET'S BUILD TRUSTED DATA</SectionLabel>
            <h2><span>{tr("우리 회사에 필요한")}</span><span>{tr("DMRV를 함께")}</span><span>{tr("설계해 보세요.")}</span></h2>
          </div>
          <div className="contact__action">
            <p>{tr("데이터 환경과 업무를 이해하는 것에서 시작해, 확장 가능한 하나의 시스템을 만듭니다.")}</p>
            <a href="mailto:samton-nature@samton.co.kr">{tr("프로젝트 문의하기")} <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__brand">
          <img src={logo} alt="Samton" />
          <div className="footer__description">
            <p>{tr("Samton™은 고객의 복잡한 요구사항을 구조화하고, 데이터 기반의 소프트웨어와 전문가 팀으로 직접 해결하는 기술 파트너입니다.")}</p>
          </div>
        </div>
        <div className="footer__links"><a href="#company">{tr("회사소개")}</a><a href="#engines">{tr("기술 엔진")}</a><a href="#projects">{tr("프로젝트")}</a><a href={localizedHref("/insights/", locale)}>{tr("소식·인사이트")}</a></div>
        <div className="footer__contact"><a href="mailto:samton-nature@samton.co.kr">samton-nature@samton.co.kr</a><a href="tel:070-4107-9524">070-4107-9524</a><LanguageSwitcher locale={locale} onChange={setLocale} variant="footer" /></div>
        <div className="footer__bottom"><span>© 2026 Samton Inc. All rights reserved.</span><span>Environmental · Carbon · Data Technology</span></div>
        </footer>
      </div>

      <AnimatePresence>
        {selectedEngine && (
          <EngineModal
            engine={selectedEngine}
            index={engines.findIndex((engine) => engine.id === selectedEngine.id)}
            locale={locale}
            onClose={() => setSelectedEngineId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
