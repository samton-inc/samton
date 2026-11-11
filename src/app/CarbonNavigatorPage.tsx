import { useEffect, useRef, useState } from "react";
import SiteHeader from "@/app/components/SiteHeader";
import { localizedHref, useLocale } from "@/i18n";
import navigatorDocument from "@/content/carbon-navigator.html?raw";

export default function CarbonNavigatorPage() {
  const { locale, setLocale, tr } = useLocale();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const toolLocale = locale === "ko" ? "ko" : "en";
  // 문서를 다시 로드하지 않고 언어만 바꿔 선택한 답변을 유지한다.
  const [documentSource] = useState(() => navigatorDocument.replace('<html lang="en">', `<html lang="${toolLocale}">`));

  const syncFrameContext = () => {
    frameRef.current?.contentWindow?.postMessage({
      type: "samton-carbon-navigator-context",
      locale: toolLocale,
      homeHref: localizedHref("/", locale),
    }, window.location.origin);
  };

  useEffect(() => {
    document.title = `${tr("탄소 내비게이터")} | Samton`;
    syncFrameContext();
  }, [locale]);

  return (
    <div className={`site-shell site-shell--${locale} carbon-navigator-page`}>
      <SiteHeader locale={locale} onLocaleChange={setLocale} currentPage="carbon-navigator" />
      <main className="carbon-navigator-main">
        {locale === "ja" && <p className="carbon-navigator-language-note" lang="ja">このツールは韓国語・英語に対応しています。以下は英語で表示しています。</p>}
        <iframe
          ref={frameRef}
          className="carbon-navigator-frame"
          title={tr("필리핀 태양광 탄소 표준 사전 검토")}
          srcDoc={documentSource}
          onLoad={syncFrameContext}
          allow="clipboard-write"
        />
      </main>
    </div>
  );
}
