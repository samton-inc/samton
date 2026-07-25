import { createRoot } from "react-dom/client";
import InsightsPage from "./app/InsightsPage.tsx";
import "./styles/index.css";

// 빌드가 #root 안에 넣어 둔 정적 본문(JS를 실행하지 않는 크롤러용)을 지우고 앱을 올린다.
// scripts/generate-static-pages.mjs의 prerenderArticle / prerenderList를 참고.
const container = document.getElementById("root")!;
container.innerHTML = "";
createRoot(container).render(<InsightsPage />);
