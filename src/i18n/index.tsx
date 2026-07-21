import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";

export const supportedLocales = ["ko", "en", "ja"] as const;
export type Locale = (typeof supportedLocales)[number];

export const localeMeta: Record<Locale, { label: string; shortLabel: string; htmlLang: string }> = {
  ko: { label: "한국어", shortLabel: "KO", htmlLang: "ko" },
  en: { label: "English", shortLabel: "EN", htmlLang: "en" },
  ja: { label: "日本語", shortLabel: "JA", htmlLang: "ja" },
};

const english: Record<string, string> = {
  "회사소개": "Company",
  "기술 엔진": "Technology Engines",
  "프로젝트": "Projects",
  "소식·인사이트": "News & Insights",
  "프로젝트 문의": "Start a Project",
  "메뉴 열기": "Open menu",
  "Samton 홈": "Samton home",
  "주요 메뉴": "Main navigation",
  "고객과 파트너": "Clients and partners",
  "순환하는 고객과 파트너 로고": "Rotating client and partner logos",
  "크레딧 발급까지, End-to-End": "From raw data to credit issuance, end to end",
  "탄소 데이터 시스템을 구축합니다.": "We build carbon data systems.",
  "탄소 데이터의 수집과 산정부터 보고·검증(DMRV)까지, 기업의 현장과 업무에 맞는 하나의 시스템으로 설계합니다. 모든 결과의 근거를 확인할 수 있고 변화에도 유연하게 확장됩니다.": "From carbon-data collection and calculation to reporting and verification (DMRV), we design one system around your operations and workflows. Every result remains traceable to its evidence, and the system expands flexibly as requirements change.",
  "구축 사례 보기": "Explore the Architecture",
  "기술 구조 보기": "View Technology",
  "탄소 데이터 시스템": "Carbon data system",
  "수집 · 검증 · 산정 · 추적": "Collect · Validate · Calculate · Trace",
  "신뢰로 함께하는 고객과 파트너": "Clients and partners who work with us on trust",
  "글로벌 완성차 기업부터 모빌리티·환경·공공기관까지, 다양한 산업의 데이터 과제를 함께 해결해 왔습니다.": "From global automakers to mobility, environmental and public-sector organizations, we have solved complex data challenges across industries.",
  "소프트웨어를 넘어,": "Beyond software,",
  "데이터 자산화": "we enable data to become an asset",
  "를 지원합니다.": ".",
  "주식회사 샘튼은 환경·탄소·모빌리티 데이터의 수집부터 검증, 산정과 보고까지 연결하는 B2B 데이터 기술기업입니다.": "Samton is a B2B data technology company connecting the collection, validation, calculation and reporting of environmental, carbon and mobility data.",
  "고객에게는 하나의 완성된 맞춤형 시스템을 제공합니다. 그 내부에는 현장과 프로젝트에서 검증된 기술 엔진이 작동해 새로운 데이터와 규제, 업무 기능을 유연하게 확장할 수 있습니다.": "We deliver one complete system tailored to each client. Inside it, technology engines proven in real projects make it easy to extend the system for new data, regulations and business functions.",
  "출처를 확인할 수 있는 데이터": "Data with verifiable provenance",
  "검증과 처리 과정이 남는 데이터": "Data with a recorded validation and processing trail",
  "산정 기준과 결과를 설명할 수 있는 데이터": "Data with explainable methods and results",
  "하나의 맞춤형 시스템을": "One tailored system,",
  "구성하는 ": "powered by ",
  "검증된 소프트웨어 엔진": "proven software engines",
  "엔진은 별개의 제품이 아닙니다. 고객의 데이터와 업무에 맞춘 하나의 시스템 안에서 필요한 역할을 수행하며, 확장성과 데이터 공신력을 함께 만듭니다.": "These engines are not separate products. Each performs a specific role inside one system tailored to the client’s data and operations, creating both scalability and trusted data.",
  "자세히 보기": "Learn more",
  "지원 범위": "capabilities",
  "필요한 엔진을 조립해 만드는,": "Assemble the engines you need",
  "하나의 Samton DMRV": "into one Samton DMRV",
  "고정된 데이터 기반 위에 사업과 목적에 필요한 방법론·탄소 산정 엔진과 규제 엔진을 복수로 조합해 맞춤형 DMRV를 구성합니다.": "Build a tailored DMRV by combining the methodology, carbon-calculation and regulatory engines required for your project and objectives on a consistent data foundation.",
  "필요한 엔진을 선택해 조립해 보세요.": "Select and assemble the engines you need.",
  "엔진을 선택하면 아래 조립 캔버스에 바로 반영됩니다.": "Selected engines appear immediately in the assembly canvas below.",
  "조립 가능한 소프트웨어 엔진": "Available software engines",
  "방법론·탄소 산정 엔진에 적용할 산정 기준과 세부 방법론": "Standards and methodologies for the methodology and carbon calculation engine",
  "기업 인벤토리·제품 탄소발자국·탄소 크레딧 목적에 맞는 기준을 선택할 수 있습니다.": "Choose standards for corporate inventories, product carbon footprints or carbon-credit projects.",
  "세부 탄소 방법론 선택": "Select carbon standards and methodologies",
  "초기화": "Reset",
  "원천 데이터": "Raw data",
  "데이터 검증·무결성 엔진": "Data Validation & Integrity Engine",
  "방법론을 선택해 주세요.": "Select a methodology.",
  "처리 엔진을 선택해 주세요.": "Select a processing engine.",
  "선택한 엔진이 이 영역에 조립됩니다.": "Selected engines are assembled in this area.",
  "탄소 데이터 자산화": "Carbon data assets",
  "엔진 조합이 완성되면 생성 가능한 대외 활용 결과가 표시됩니다.": "Externally usable outputs appear when the required engine combination is complete.",
  "연결·산정·운영 엔진을 조합하면 내부 활용 데이터가 표시됩니다.": "Combine connection, calculation and operations engines to create data for internal use.",
  "엔진 설명 닫기": "Close engine details",
  "제거": "remove",
  "방법론 제거": "remove methodology",
  "샘튼의 기술과 현장을": "Explore Samton’s technology",
  "더 깊이 살펴보세요.": "and fieldwork in depth.",
  "샘튼의 새로운 활동과 데이터·규제·탄소 기술에 대한 인사이트를 전합니다.": "Read about Samton’s latest work and our insights into data, regulation and carbon technology.",
  "전체 소식·인사이트 보기": "View all news & insights",
  "바로가기": "Explore",
  "우리 회사에 필요한": "Let’s design the DMRV",
  "DMRV를 함께": "your organization needs,",
  "설계해 보세요.": "together.",
  "데이터 환경과 업무를 이해하는 것에서 시작해, 확장 가능한 하나의 시스템을 만듭니다.": "We start by understanding your data environment and workflows, then build one scalable system.",
  "프로젝트 문의하기": "Start a project",
  "Samton™은 고객의 복잡한 요구사항을 구조화하고, 데이터 기반의 소프트웨어와 전문가 팀으로 직접 해결하는 기술 파트너입니다.": "Samton™ is a technology partner that structures complex client requirements and solves them directly with data-driven software and an expert team.",
  "데이터 연결·표준화 엔진": "Data Connection & Standardization Engine",
  "데이터 기반": "Data foundation",
  "API, IoT, DTG와 외부 데이터를 연결하고 일관된 구조로 표준화합니다.": "Connects APIs, IoT, DTG and external data, then standardizes them into a consistent structure.",
  "API·IoT·DTG 연동": "API · IoT · DTG integration",
  "데이터 표준화": "Data standardization",
  "확장형 인터페이스": "Extensible interfaces",
  "검증·무결성": "Validation & integrity",
  "데이터 품질을 검증하고 원본 출처와 변경 이력을 전 과정에 보존합니다.": "Validates data quality and preserves provenance and change history throughout the process.",
  "감사 추적성": "Audit traceability",
  "원본·변경이력 보존": "Source and change-history retention",
  "검증 로직 적용": "Validation logic",
  "규제 엔진": "Regulatory Engine",
  "규제": "Regulation",
  "법령·고시·인증요건과 적용 대상을 체계적으로 관리합니다.": "Systematically manages laws, notices, certification requirements and their applicability.",
  "규제 적합성 관리": "Regulatory compliance management",
  "법령·고시 버전관리": "Law and notice versioning",
  "적용 대상 판별": "Applicability assessment",
  "방법론·탄소 산정 엔진": "Methodology & Carbon Calculation Engine",
  "방법론·산정": "Methodology & calculation",
  "탄소 방법론을 적용하고 배출량과 감축량을 근거와 함께 산정합니다.": "Applies carbon methodologies and calculates emissions and reductions with supporting evidence.",
  "국제 산정기준 대응": "International calculation standards",
  "방법론 적합성 관리": "Methodology applicability",
  "배출계수 이력관리": "Emission-factor versioning",
  "운영·모니터링·증빙 엔진": "Operations, Monitoring & Evidence Engine",
  "운영·증빙": "Operations & evidence",
  "업무 흐름과 현황을 관리하고 검증 가능한 보고·증빙 결과를 생성합니다.": "Manages workflows and status while generating verifiable reports and evidence.",
  "검증 증빙 체계": "Verification evidence framework",
  "권한·승인 이력": "Access and approval history",
  "운영 모니터링": "Operational monitoring",
  "서로 다른 현장 데이터를 하나의 언어로 연결합니다.": "Connects diverse field data through one common language.",
  "기업마다 다른 API, IoT, DTG, 업무 시스템의 데이터를 안정적으로 수집하고 같은 기준으로 해석할 수 있는 구조를 만듭니다.": "Creates a reliable structure for collecting data from each company’s APIs, IoT devices, DTG and business systems and interpreting it under consistent rules.",
  "연결": "Connection",
  "API·센서·운행정보·외부 시스템 등 다양한 원천 데이터를 실시간 또는 배치 방식으로 연결합니다.": "Connects APIs, sensors, driving records and external systems in real time or batches.",
  "표준화": "Standardization",
  "단위와 형식, 코드가 다른 데이터를 공통 구조로 변환해 이후 엔진이 일관되게 사용할 수 있도록 합니다.": "Transforms differing units, formats and codes into a common structure for consistent downstream use.",
  "확장": "Expansion",
  "새로운 데이터 소스가 추가되어도 기존 시스템을 크게 바꾸지 않고 연결 범위를 확장할 수 있습니다.": "Expands to new data sources without requiring major changes to the existing system.",
  "모든 데이터가 어디에서 왔고 어떻게 바뀌었는지 남깁니다.": "Records where every data point came from and how it changed.",
  "수집부터 최종 결과까지 데이터 품질을 검사하고 원본, 처리 과정, 변경 이력을 보존해 설명 가능한 결과를 만듭니다.": "Checks quality from collection to final output and preserves sources, processing steps and change history to create explainable results.",
  "품질 검증": "Quality validation",
  "누락·중복·이상값과 기준 불일치를 자동으로 점검해 신뢰할 수 있는 데이터만 다음 단계로 전달합니다.": "Automatically detects missing, duplicate and anomalous values and rule mismatches before passing reliable data forward.",
  "이력 보존": "History retention",
  "원본 출처와 수정 내용, 처리 시점과 담당 흐름을 기록해 데이터의 전 과정을 추적할 수 있습니다.": "Records provenance, modifications, processing times and responsibility so the full data lifecycle can be traced.",
  "감사 대응": "Audit readiness",
  "검증이나 보고 과정에서 요구되는 근거를 다시 확인하고 동일한 결과를 재현할 수 있도록 지원합니다.": "Supports evidence review and reproducibility for verification and reporting.",
  "복잡한 규제를 기업이 실행할 수 있는 정보로 바꿉니다.": "Turns complex regulations into information a company can act on.",
  "법령·고시·인증요건의 변화와 적용 대상을 구조화하고 기업의 제품, 차량, 업무에 필요한 규제를 빠르게 판단합니다.": "Structures changes and applicability across laws, notices and certification requirements so relevant rules can be identified quickly.",
  "규제 구조화": "Regulatory structuring",
  "국가와 기관별로 흩어진 규제 문서를 분야·대상·시점에 따라 분류하고 연결합니다.": "Classifies and connects regulatory documents by field, subject and effective date across countries and institutions.",
  "개정 관리": "Revision management",
  "규제의 신설·개정·폐지 이력과 시행 시점을 관리해 언제 어떤 기준이 적용되는지 확인합니다.": "Tracks enactment, amendment, repeal and effective dates to show which rules apply when.",
  "적용 판단": "Applicability assessment",
  "기업·제품·차종의 조건과 규제 요건을 연결해 실제 대응이 필요한 항목을 선별합니다.": "Matches company, product and vehicle conditions to requirements and identifies necessary actions.",
  "탄소 방법론과 산정 근거를 하나의 계산 흐름으로 만듭니다.": "Builds one calculation flow from carbon methodologies and supporting evidence.",
  "활동 데이터에 적합한 방법론과 배출계수를 적용하고 배출량과 감축량을 근거와 함께 계산합니다.": "Applies appropriate methodologies and emission factors to activity data and calculates emissions and reductions with evidence.",
  "방법론 적용": "Methodology application",
  "사업 유형과 데이터 조건에 맞는 탄소 방법론을 선택하고 버전과 적용 기준을 관리합니다.": "Selects methodologies for the project and data conditions and manages versions and applicability criteria.",
  "탄소 산정": "Carbon calculation",
  "활동 데이터와 배출계수를 연결해 배출량·감축량을 일관된 계산식으로 산정합니다.": "Links activity data and emission factors to calculate emissions and reductions consistently.",
  "근거 연결": "Evidence linkage",
  "각 결과에 사용된 데이터, 방법론, 계수와 계산 과정을 함께 보존해 검증 가능한 결과를 만듭니다.": "Preserves the data, methodology, factors and calculations behind each result for verification.",
  "데이터를 실제 업무와 모니터링, 증빙 결과로 연결합니다.": "Connects data to real operations, monitoring and evidence.",
  "기업의 승인·배차·인증·보고 흐름을 시스템 안에서 운영하고 현황을 확인하며 필요한 보고서와 증빙을 생성합니다.": "Runs approval, dispatch, certification and reporting workflows in the system while producing required reports and evidence.",
  "업무 운영": "Workflow operations",
  "기업별 프로세스와 권한, 승인 절차를 반영해 현장의 실제 업무가 시스템 안에서 이어지게 합니다.": "Reflects company-specific processes, permissions and approvals so field operations continue inside the system.",
  "모니터링": "Monitoring",
  "데이터 수집과 처리 상태, 주요 지표와 이상 상황을 대시보드와 알림으로 확인합니다.": "Tracks collection and processing status, key indicators and anomalies through dashboards and alerts.",
  "보고·증빙": "Reporting & evidence",
  "검증된 데이터와 처리 이력을 바탕으로 규제 대응, 인증, DMRV에 필요한 결과물을 생성합니다.": "Produces outputs for regulatory response, certification and DMRV from validated data and processing history.",
  "GHG Protocol 기업 인벤토리 기준": "GHG Protocol Corporate Inventory Standard",
  "Scope 1 · 2 · 3 활동 데이터": "Scope 1 · 2 · 3 activity data",
  "ISO 14067 제품 탄소발자국 기준": "ISO 14067 Product Carbon Footprint Standard",
  "원료 · 생산 · 운송 · 사용 · 폐기 데이터": "Materials · Production · Transport · Use · End-of-life data",
  "수송·모빌리티 감축 방법론": "Transport & Mobility Reduction Methodology",
  "거리 · 연료 · 차량 · 운송 실적": "Distance · Fuel · Vehicle · Transport activity",
  "재생에너지 발전 방법론": "Renewable Energy Generation Methodology",
  "발전량 · 계량 · 전력 데이터": "Generation · Metering · Electricity data",
  "에너지 효율 개선 방법론": "Energy Efficiency Improvement Methodology",
  "에너지 사용 · 설비 · 생산 데이터": "Energy use · Equipment · Production data",
  "폐기물 메탄 회수 방법론": "Waste Methane Recovery Methodology",
  "폐기물 · 메탄 회수 · 처리 데이터": "Waste · Methane recovery · Treatment data",
  "산림·토지 탄소흡수 방법론": "Forestry & Land Carbon Removal Methodology",
  "토지 · 생장량 · 탄소저장 데이터": "Land · Growth · Carbon stock data",
  "내부 탄소관리 데이터": "Internal carbon-management data",
  "법·제도 기준 관리 데이터": "Regulatory-mapped management data",
  "탄소 크레딧 발급 준비 데이터": "Carbon-credit issuance-ready data",
  "규제 대응 제출 준비 데이터": "Regulatory submission-ready data",
  "공시용 Scope 1·2·3 산정 데이터": "Scope 1, 2 & 3 disclosure data",
  "제품 탄소발자국 산정 데이터": "Product carbon-footprint data",
  "검증·감사 대응 증빙 패키지": "Verification and audit evidence package",
  "DMRV 이해하기": "Understanding DMRV",
  "현장 데이터가 검증 가능한 탄소 데이터와 자산으로 이어지는 과정을 설명합니다.": "How field data becomes verifiable carbon data and assets.",
  "태양광 발전 현장의 데이터 계측 장비와 모니터링 화면": "Data metering equipment and monitoring screens at a solar power site",
  "탄소시장 기초": "Carbon Market Basics",
  "탄소크레딧과 배출권, 표준과 국제 규칙 등 탄소시장의 구조를 쉽게 설명합니다.": "Clear explanations of carbon credits, allowances, standards and international market rules.",
  "연기를 배출하는 산업 시설과 굴뚝": "Industrial facilities and smokestacks",
  "샘튼 소식": "Samton News",
  "협약, 프로젝트, 출장과 행사, 새로운 시스템 업데이트를 전합니다.": "Partnerships, projects, field trips, events and system updates from Samton.",
  "주케냐 대한민국 대사관에서 진행한 샘튼 현장 미팅": "A Samton field meeting at the Embassy of the Republic of Korea in Kenya",
  "리포트": "Reports",
  "탄소시장의 규모·가격·발급량과 규제 동향 등 최신 정량 데이터를 분석합니다.": "Analysis of market size, prices, issuance volumes and regulatory trends.",
  "책상 위의 보고서와 문서를 검토하는 모습": "Reviewing reports and documents at a desk",
  "기술·조직 이야기": "Technology & People",
  "샘튼의 시스템을 만드는 기술과 설계 과정, 사람들의 이야기를 담습니다.": "The technology, design process and people behind Samton’s systems.",
  "케냐 현장에서 관계자들과 논의하는 샘튼 기술 조직": "Samton’s technology team meeting with stakeholders in Kenya",
  "소식·인사이트로 돌아가기": "Back to News & Insights",
  "탄소와 데이터에 대한 이해부터 샘튼의 현장, 연구와 기술 이야기를 차곡차곡 기록합니다.": "A growing record of carbon and data insights, Samton’s fieldwork, research and technology.",
  "소식·인사이트 카테고리": "News and insights categories",
  "전체": "All",
  "먼저 읽어볼 글": "Start here",
  "전체 콘텐츠": "All content",
  "DMRV와 탄소시장 해설, 샘튼 소식, 리포트와 기술·조직 이야기를 한곳에서 확인하세요.": "Explore DMRV and carbon-market explainers, Samton news, reports, and technology and people stories in one place.",
  "DMRV가 왜 필요하고 현장 데이터가 어떻게 검증 가능한 탄소 데이터로 이어지는지 쉽게 설명합니다.": "Clear explanations of why DMRV matters and how field data becomes verifiable carbon data.",
  "탄소크레딧, 배출권, 표준과 국제 규칙 등 탄소시장의 기본 구조를 쉽게 설명합니다.": "Clear explanations of carbon credits, allowances, standards and international market rules.",
  "협약, 프로젝트, 출장과 행사, 시스템 업데이트 등 샘튼의 새로운 활동을 전합니다.": "Updates on Samton partnerships, projects, field trips, events and systems.",
  "샘튼의 시스템을 만드는 기술과 설계 과정, 그 일을 수행하는 사람들의 이야기를 담습니다.": "Stories about the technology, design process and people behind Samton’s systems.",
  "콘텐츠 대표 이미지": "Article cover image",
};

const japanese: Record<string, string> = {
  ...english,
  "회사소개": "会社紹介",
  "기술 엔진": "技術エンジン",
  "프로젝트": "プロジェクト",
  "소식·인사이트": "ニュース・インサイト",
  "프로젝트 문의": "プロジェクト相談",
  "메뉴 열기": "メニューを開く",
  "Samton 홈": "Samton ホーム",
  "주요 메뉴": "メインメニュー",
  "고객과 파트너": "顧客・パートナー",
  "순환하는 고객과 파트너 로고": "切り替わる顧客・パートナーのロゴ",
  "크레딧 발급까지, End-to-End": "クレジット発行まで、\nEnd-to-Endで",
  "탄소 데이터 시스템을 구축합니다.": "炭素データシステムを\n構築します。",
  "탄소 데이터의 수집과 산정부터 보고·검증(DMRV)까지, 기업의 현장과 업무에 맞는 하나의 시스템으로 설계합니다. 모든 결과의 근거를 확인할 수 있고 변화에도 유연하게 확장됩니다.": "炭素データの収集・算定から報告・検証（DMRV）まで、企業の現場と業務に合わせた一つのシステムとして設計します。すべての結果を根拠まで追跡でき、要件の変化にも柔軟に拡張できます。",
  "구축 사례 보기": "構成を見る",
  "기술 구조 보기": "技術構造を見る",
  "탄소 데이터 시스템": "炭素データシステム",
  "수집 · 검증 · 산정 · 추적": "収集・検証・算定・追跡",
  "신뢰로 함께하는 고객과 파트너": "信頼でつながる顧客・パートナー",
  "글로벌 완성차 기업부터 모빌리티·환경·공공기관까지, 다양한 산업의 데이터 과제를 함께 해결해 왔습니다.": "グローバル自動車メーカーからモビリティ、環境、公共機関まで、多様な産業のデータ課題を共に解決してきました。",
  "소프트웨어를 넘어,": "ソフトウェアを超えて、",
  "데이터 자산화": "データの資産化",
  "를 지원합니다.": "を支援します。",
  "주식회사 샘튼은 환경·탄소·모빌리티 데이터의 수집부터 검증, 산정과 보고까지 연결하는 B2B 데이터 기술기업입니다.": "Samtonは、環境・炭素・モビリティデータの収集から検証、算定、報告までをつなぐB2Bデータテクノロジー企業です。",
  "고객에게는 하나의 완성된 맞춤형 시스템을 제공합니다. 그 내부에는 현장과 프로젝트에서 검증된 기술 엔진이 작동해 새로운 데이터와 규제, 업무 기능을 유연하게 확장할 수 있습니다.": "お客様には、一つの完成されたカスタムシステムを提供します。その内部では現場とプロジェクトで実証された技術エンジンが機能し、新しいデータ、規制、業務機能へ柔軟に拡張できます。",
  "출처를 확인할 수 있는 데이터": "出所を確認できるデータ",
  "검증과 처리 과정이 남는 데이터": "検証・処理履歴が残るデータ",
  "산정 기준과 결과를 설명할 수 있는 데이터": "算定基準と結果を説明できるデータ",
  "하나의 맞춤형 시스템을": "一つのカスタムシステムを",
  "구성하는 ": "構成する",
  "검증된 소프트웨어 엔진": "実証済みソフトウェアエンジン",
  "엔진은 별개의 제품이 아닙니다. 고객의 데이터와 업무에 맞춘 하나의 시스템 안에서 필요한 역할을 수행하며, 확장성과 데이터 공신력을 함께 만듭니다.": "エンジンは個別製品ではありません。顧客のデータと業務に合わせた一つのシステム内で必要な役割を担い、拡張性とデータの信頼性を同時に実現します。",
  "자세히 보기": "詳しく見る",
  "지원 범위": "対応範囲",
  "필요한 엔진을 조립해 만드는,": "必要なエンジンを組み合わせてつくる、",
  "하나의 Samton DMRV": "一つのSamton DMRV",
  "고정된 데이터 기반 위에 사업과 목적에 필요한 방법론·탄소 산정 엔진과 규제 엔진을 복수로 조합해 맞춤형 DMRV를 구성합니다.": "一貫したデータ基盤の上に、事業と目的に必要な方法論・炭素算定エンジンと規制エンジンを組み合わせ、カスタムDMRVを構成します。",
  "필요한 엔진을 선택해 조립해 보세요.": "必要なエンジンを選んで組み立ててください。",
  "엔진을 선택하면 아래 조립 캔버스에 바로 반영됩니다.": "選択したエンジンは、下の組立キャンバスにすぐ反映されます。",
  "조립 가능한 소프트웨어 엔진": "組み立て可能なソフトウェアエンジン",
  "방법론·탄소 산정 엔진에 적용할 산정 기준과 세부 방법론": "方法論・炭素算定エンジンに適用する算定基準と詳細方法論",
  "기업 인벤토리·제품 탄소발자국·탄소 크레딧 목적에 맞는 기준을 선택할 수 있습니다.": "企業インベントリ、製品カーボンフットプリント、炭素クレジットの目的に合う基準を選択できます。",
  "세부 탄소 방법론 선택": "炭素基準・方法論を選択",
  "초기화": "リセット",
  "원천 데이터": "原データ",
  "데이터 검증·무결성 엔진": "データ検証・完全性エンジン",
  "방법론을 선택해 주세요.": "方法論を選択してください。",
  "처리 엔진을 선택해 주세요.": "処理エンジンを選択してください。",
  "선택한 엔진이 이 영역에 조립됩니다.": "選択したエンジンがこの領域に組み込まれます。",
  "탄소 데이터 자산화": "炭素データの資産化",
  "엔진 조합이 완성되면 생성 가능한 대외 활용 결과가 표시됩니다.": "必要なエンジン構成が完成すると、外部利用可能な成果が表示されます。",
  "연결·산정·운영 엔진을 조합하면 내부 활용 데이터가 표시됩니다.": "接続・算定・運用エンジンを組み合わせると、社内利用データが表示されます。",
  "엔진 설명 닫기": "エンジン説明を閉じる",
  "제거": "削除",
  "방법론 제거": "方法論を削除",
  "샘튼의 기술과 현장을": "Samtonの技術と現場を",
  "더 깊이 살펴보세요.": "より深くご覧ください。",
  "샘튼의 새로운 활동과 데이터·규제·탄소 기술에 대한 인사이트를 전합니다.": "Samtonの最新活動と、データ・規制・炭素技術に関するインサイトをお届けします。",
  "전체 소식·인사이트 보기": "ニュース・インサイトをすべて見る",
  "바로가기": "見る",
  "우리 회사에 필요한": "自社に必要な",
  "DMRV를 함께": "DMRVを一緒に",
  "설계해 보세요.": "設計しませんか。",
  "데이터 환경과 업무를 이해하는 것에서 시작해, 확장 가능한 하나의 시스템을 만듭니다.": "データ環境と業務を理解することから始め、拡張可能な一つのシステムをつくります。",
  "프로젝트 문의하기": "プロジェクトを相談する",
  "Samton™은 고객의 복잡한 요구사항을 구조화하고, 데이터 기반의 소프트웨어와 전문가 팀으로 직접 해결하는 기술 파트너입니다.": "Samton™は、お客様の複雑な要件を構造化し、データドリブンなソフトウェアと専門家チームで直接解決する技術パートナーです。",
  "데이터 연결·표준화 엔진": "データ接続・標準化エンジン",
  "데이터 기반": "データ基盤",
  "API, IoT, DTG와 외부 데이터를 연결하고 일관된 구조로 표준화합니다.": "API、IoT、DTGと外部データを接続し、一貫した構造に標準化します。",
  "API·IoT·DTG 연동": "API・IoT・DTG連携",
  "데이터 표준화": "データ標準化",
  "확장형 인터페이스": "拡張可能なインターフェース",
  "검증·무결성": "検証・完全性",
  "데이터 품질을 검증하고 원본 출처와 변경 이력을 전 과정에 보존합니다.": "データ品質を検証し、原本の出所と変更履歴を全工程で保存します。",
  "감사 추적성": "監査トレーサビリティ",
  "원본·변경이력 보존": "原本・変更履歴の保存",
  "검증 로직 적용": "検証ロジックの適用",
  "규제 엔진": "規制エンジン",
  "규제": "規制",
  "법령·고시·인증요건과 적용 대상을 체계적으로 관리합니다.": "法令・告示・認証要件と適用対象を体系的に管理します。",
  "규제 적합성 관리": "規制適合性管理",
  "법령·고시 버전관리": "法令・告示の版管理",
  "적용 대상 판별": "適用対象の判定",
  "방법론·탄소 산정 엔진": "方法論・炭素算定エンジン",
  "방법론·산정": "方法論・算定",
  "탄소 방법론을 적용하고 배출량과 감축량을 근거와 함께 산정합니다.": "炭素方法論を適用し、排出量と削減量を根拠とともに算定します。",
  "국제 산정기준 대응": "国際算定基準への対応",
  "방법론 적합성 관리": "方法論の適合性管理",
  "배출계수 이력관리": "排出係数の履歴管理",
  "운영·모니터링·증빙 엔진": "運用・モニタリング・証跡エンジン",
  "운영·증빙": "運用・証跡",
  "업무 흐름과 현황을 관리하고 검증 가능한 보고·증빙 결과를 생성합니다.": "業務フローと状況を管理し、検証可能な報告・証跡を生成します。",
  "검증 증빙 체계": "検証証跡体系",
  "권한·승인 이력": "権限・承認履歴",
  "운영 모니터링": "運用モニタリング",
  "서로 다른 현장 데이터를 하나의 언어로 연결합니다.": "異なる現場データを一つの共通言語でつなぎます。",
  "기업마다 다른 API, IoT, DTG, 업무 시스템의 데이터를 안정적으로 수집하고 같은 기준으로 해석할 수 있는 구조를 만듭니다.": "企業ごとに異なるAPI、IoT、DTG、業務システムのデータを安定的に収集し、同じ基準で解釈できる構造をつくります。",
  "연결": "接続",
  "API·센서·운행정보·외부 시스템 등 다양한 원천 데이터를 실시간 또는 배치 방식으로 연결합니다.": "API、センサー、運行情報、外部システムなど多様な原データをリアルタイムまたはバッチで接続します。",
  "표준화": "標準化",
  "단위와 형식, 코드가 다른 데이터를 공통 구조로 변환해 이후 엔진이 일관되게 사용할 수 있도록 합니다.": "単位、形式、コードが異なるデータを共通構造に変換し、後続エンジンが一貫して利用できるようにします。",
  "확장": "拡張",
  "새로운 데이터 소스가 추가되어도 기존 시스템을 크게 바꾸지 않고 연결 범위를 확장할 수 있습니다.": "新しいデータソースが加わっても、既存システムを大きく変えずに接続範囲を拡張できます。",
  "모든 데이터가 어디에서 왔고 어떻게 바뀌었는지 남깁니다.": "すべてのデータがどこから来て、どう変わったかを記録します。",
  "수집부터 최종 결과까지 데이터 품질을 검사하고 원본, 처리 과정, 변경 이력을 보존해 설명 가능한 결과를 만듭니다.": "収集から最終結果まで品質を検査し、原本、処理過程、変更履歴を保存して説明可能な結果をつくります。",
  "품질 검증": "品質検証",
  "누락·중복·이상값과 기준 불일치를 자동으로 점검해 신뢰할 수 있는 데이터만 다음 단계로 전달합니다.": "欠損、重複、異常値、基準不一致を自動で確認し、信頼できるデータだけを次工程へ渡します。",
  "이력 보존": "履歴保存",
  "원본 출처와 수정 내용, 처리 시점과 담당 흐름을 기록해 데이터의 전 과정을 추적할 수 있습니다.": "原本の出所、修正内容、処理時点、担当フローを記録し、データの全工程を追跡できます。",
  "감사 대응": "監査対応",
  "검증이나 보고 과정에서 요구되는 근거를 다시 확인하고 동일한 결과를 재현할 수 있도록 지원합니다.": "検証や報告で求められる根拠を再確認し、同じ結果を再現できるよう支援します。",
  "복잡한 규제를 기업이 실행할 수 있는 정보로 바꿉니다.": "複雑な規制を企業が実行できる情報に変えます。",
  "법령·고시·인증요건의 변화와 적용 대상을 구조화하고 기업의 제품, 차량, 업무에 필요한 규제를 빠르게 판단합니다.": "法令・告示・認証要件の変更と適用対象を構造化し、製品・車両・業務に必要な規制を素早く判断します。",
  "규제 구조화": "規制の構造化",
  "국가와 기관별로 흩어진 규제 문서를 분야·대상·시점에 따라 분류하고 연결합니다.": "国や機関ごとに分散した規制文書を分野・対象・時点で分類し、接続します。",
  "개정 관리": "改訂管理",
  "규제의 신설·개정·폐지 이력과 시행 시점을 관리해 언제 어떤 기준이 적용되는지 확인합니다.": "規制の新設・改訂・廃止履歴と施行時点を管理し、いつどの基準が適用されるか確認できます。",
  "적용 판단": "適用判定",
  "기업·제품·차종의 조건과 규제 요건을 연결해 실제 대응이 필요한 항목을 선별합니다.": "企業・製品・車種の条件と規制要件を結び、実際に対応が必要な項目を選別します。",
  "탄소 방법론과 산정 근거를 하나의 계산 흐름으로 만듭니다.": "炭素方法論と算定根拠を一つの計算フローにします。",
  "활동 데이터에 적합한 방법론과 배출계수를 적용하고 배출량과 감축량을 근거와 함께 계산합니다.": "活動データに適した方法論と排出係数を適用し、排出量と削減量を根拠とともに計算します。",
  "방법론 적용": "方法論の適用",
  "사업 유형과 데이터 조건에 맞는 탄소 방법론을 선택하고 버전과 적용 기준을 관리합니다.": "事業類型とデータ条件に合う炭素方法論を選び、版と適用基準を管理します。",
  "탄소 산정": "炭素算定",
  "활동 데이터와 배출계수를 연결해 배출량·감축량을 일관된 계산식으로 산정합니다.": "活動データと排出係数を結び、排出量・削減量を一貫した計算式で算定します。",
  "근거 연결": "根拠の接続",
  "각 결과에 사용된 데이터, 방법론, 계수와 계산 과정을 함께 보존해 검증 가능한 결과를 만듭니다.": "各結果に使われたデータ、方法論、係数、計算過程を保存し、検証可能な結果をつくります。",
  "데이터를 실제 업무와 모니터링, 증빙 결과로 연결합니다.": "データを実務、モニタリング、証跡へつなぎます。",
  "기업의 승인·배차·인증·보고 흐름을 시스템 안에서 운영하고 현황을 확인하며 필요한 보고서와 증빙을 생성합니다.": "企業の承認・配車・認証・報告フローをシステム内で運用し、状況を確認しながら必要な報告書と証跡を生成します。",
  "업무 운영": "業務運用",
  "기업별 프로세스와 권한, 승인 절차를 반영해 현장의 실제 업무가 시스템 안에서 이어지게 합니다.": "企業別のプロセス、権限、承認手順を反映し、現場業務がシステム内で継続するようにします。",
  "모니터링": "モニタリング",
  "데이터 수집과 처리 상태, 주요 지표와 이상 상황을 대시보드와 알림으로 확인합니다.": "データ収集・処理状況、主要指標、異常をダッシュボードと通知で確認します。",
  "보고·증빙": "報告・証跡",
  "검증된 데이터와 처리 이력을 바탕으로 규제 대응, 인증, DMRV에 필요한 결과물을 생성합니다.": "検証済みデータと処理履歴から、規制対応、認証、DMRVに必要な成果物を生成します。",
  "GHG Protocol 기업 인벤토리 기준": "GHG Protocol 企業インベントリ基準",
  "Scope 1 · 2 · 3 활동 데이터": "Scope 1・2・3 活動データ",
  "ISO 14067 제품 탄소발자국 기준": "ISO 14067 製品カーボンフットプリント基準",
  "원료 · 생산 · 운송 · 사용 · 폐기 데이터": "原料・生産・輸送・使用・廃棄データ",
  "수송·모빌리티 감축 방법론": "輸送・モビリティ削減方法論",
  "거리 · 연료 · 차량 · 운송 실적": "距離・燃料・車両・輸送実績",
  "재생에너지 발전 방법론": "再生可能エネルギー発電方法論",
  "발전량 · 계량 · 전력 데이터": "発電量・計量・電力データ",
  "에너지 효율 개선 방법론": "エネルギー効率改善方法論",
  "에너지 사용 · 설비 · 생산 데이터": "エネルギー使用・設備・生産データ",
  "폐기물 메탄 회수 방법론": "廃棄物メタン回収方法論",
  "폐기물 · 메탄 회수 · 처리 데이터": "廃棄物・メタン回収・処理データ",
  "산림·토지 탄소흡수 방법론": "森林・土地炭素吸収方法論",
  "토지 · 생장량 · 탄소저장 데이터": "土地・成長量・炭素貯蔵データ",
  "내부 탄소관리 데이터": "社内炭素管理データ",
  "법·제도 기준 관리 데이터": "法制度基準管理データ",
  "탄소 크레딧 발급 준비 데이터": "炭素クレジット発行準備データ",
  "규제 대응 제출 준비 데이터": "規制対応提出準備データ",
  "공시용 Scope 1·2·3 산정 데이터": "開示用Scope 1・2・3算定データ",
  "제품 탄소발자국 산정 데이터": "製品カーボンフットプリント算定データ",
  "검증·감사 대응 증빙 패키지": "検証・監査対応証跡パッケージ",
  "DMRV 이해하기": "DMRVを理解する",
  "현장 데이터가 검증 가능한 탄소 데이터와 자산으로 이어지는 과정을 설명합니다.": "現場データが検証可能な炭素データと資産につながる過程を説明します。",
  "태양광 발전 현장의 데이터 계측 장비와 모니터링 화면": "太陽光発電現場のデータ計測機器とモニタリング画面",
  "탄소시장 기초": "炭素市場の基礎",
  "탄소크레딧과 배출권, 표준과 국제 규칙 등 탄소시장의 구조를 쉽게 설명합니다.": "炭素クレジット、排出枠、基準、国際ルールなど炭素市場の構造をわかりやすく説明します。",
  "연기를 배출하는 산업 시설과 굴뚝": "煙を排出する産業施設と煙突",
  "샘튼 소식": "Samtonニュース",
  "협약, 프로젝트, 출장과 행사, 새로운 시스템 업데이트를 전합니다.": "協定、プロジェクト、出張、イベント、新しいシステム更新をお届けします。",
  "주케냐 대한민국 대사관에서 진행한 샘튼 현장 미팅": "在ケニア韓国大使館で行われたSamtonの現地ミーティング",
  "리포트": "レポート",
  "탄소시장의 규모·가격·발급량과 규제 동향 등 최신 정량 데이터를 분석합니다.": "炭素市場の規模、価格、発行量、規制動向など最新の定量データを分析します。",
  "책상 위의 보고서와 문서를 검토하는 모습": "机上のレポートと文書を確認する様子",
  "기술·조직 이야기": "技術・組織ストーリー",
  "샘튼의 시스템을 만드는 기술과 설계 과정, 사람들의 이야기를 담습니다.": "Samtonのシステムをつくる技術、設計プロセス、人々の物語を紹介します。",
  "케냐 현장에서 관계자들과 논의하는 샘튼 기술 조직": "ケニアの現場で関係者と協議するSamton技術チーム",
  "소식·인사이트로 돌아가기": "ニュース・インサイトに戻る",
  "탄소와 데이터에 대한 이해부터 샘튼의 현장, 연구와 기술 이야기를 차곡차곡 기록합니다.": "炭素とデータの基礎から、Samtonの現場、研究、技術までを記録しています。",
  "소식·인사이트 카테고리": "ニュース・インサイトのカテゴリー",
  "전체": "すべて",
  "먼저 읽어볼 글": "まず読む記事",
  "전체 콘텐츠": "すべてのコンテンツ",
  "DMRV와 탄소시장 해설, 샘튼 소식, 리포트와 기술·조직 이야기를 한곳에서 확인하세요.": "DMRVと炭素市場の解説、Samtonニュース、レポート、技術・組織ストーリーをまとめてご覧いただけます。",
  "DMRV가 왜 필요하고 현장 데이터가 어떻게 검증 가능한 탄소 데이터로 이어지는지 쉽게 설명합니다.": "DMRVがなぜ必要か、現場データがどう検証可能な炭素データにつながるかをわかりやすく説明します。",
  "탄소크레딧, 배출권, 표준과 국제 규칙 등 탄소시장의 기본 구조를 쉽게 설명합니다.": "炭素クレジット、排出枠、基準、国際ルールなど市場の基本構造をわかりやすく説明します。",
  "협약, 프로젝트, 출장과 행사, 시스템 업데이트 등 샘튼의 새로운 활동을 전합니다.": "協定、プロジェクト、出張、イベント、システム更新などSamtonの最新活動をお届けします。",
  "샘튼의 시스템을 만드는 기술과 설계 과정, 그 일을 수행하는 사람들의 이야기를 담습니다.": "Samtonのシステムをつくる技術、設計プロセス、そして携わる人々の物語を紹介します。",
  "콘텐츠 대표 이미지": "記事の代表画像",
};

const dictionaries: Record<Locale, Record<string, string>> = {
  ko: {},
  en: english,
  ja: japanese,
};

export const translate = (locale: Locale, source: string) => dictionaries[locale][source] ?? source;

const readLocale = (): Locale => {
  const parameter = new URLSearchParams(window.location.search).get("lang");
  if (supportedLocales.includes(parameter as Locale)) return parameter as Locale;
  const saved = window.localStorage.getItem("samton-locale");
  return supportedLocales.includes(saved as Locale) ? saved as Locale : "ko";
};

export const localizedHref = (href: string, locale: Locale) => {
  if (!href.startsWith("/")) return href;
  const url = new URL(href, window.location.origin);
  if (locale === "ko") url.searchParams.delete("lang");
  else url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}${url.hash}`;
};

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(readLocale);

  useEffect(() => {
    document.documentElement.lang = localeMeta[locale].htmlLang;
    window.localStorage.setItem("samton-locale", locale);
  }, [locale]);

  const setLocale = (nextLocale: Locale) => {
    const url = new URL(window.location.href);
    if (nextLocale === "ko") url.searchParams.delete("lang");
    else url.searchParams.set("lang", nextLocale);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    setLocaleState(nextLocale);
  };

  return { locale, setLocale, tr: (source: string) => translate(locale, source) };
}

export function LanguageSwitcher({
  locale,
  onChange,
  variant = "header",
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  variant?: "header" | "footer";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const selectLocale = (nextLocale: Locale) => {
    onChange(nextLocale);
    setOpen(false);
  };

  return (
    <div className={`language-switcher language-switcher--${variant}`} ref={rootRef}>
      <button
        className="language-switcher__trigger"
        type="button"
        aria-label="Language selection"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
      >
        {variant === "header" && <Languages size={15} strokeWidth={1.8} aria-hidden="true" />}
        <span>{localeMeta[locale].label}</span>
        <ChevronDown className={open ? "is-open" : ""} size={14} strokeWidth={1.8} aria-hidden="true" />
      </button>

      {open && (
        <div className="language-switcher__menu" role="menu" aria-label="Language">
          {supportedLocales.map((item) => (
            <button
              type="button"
              className={`language-switcher__option${locale === item ? " is-active" : ""}`}
              role="menuitemradio"
              aria-checked={locale === item}
              onClick={() => selectLocale(item)}
              key={item}
            >
              <span className="language-switcher__code">{localeMeta[item].shortLabel}</span>
              <span className="language-switcher__name">{localeMeta[item].label}</span>
              {locale === item && <Check size={15} strokeWidth={2} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
