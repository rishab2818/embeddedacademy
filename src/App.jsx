import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import RouteLoadingPanel from "./components/RouteLoadingPanel";
import SiteTopBar from "./components/SiteTopBar";
import { clamp, clampToByte } from "./utils/bitMath";

const AbbreviationsPage = lazy(() => import("./pages/AbbreviationsPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LessonPage = lazy(() => import("./pages/LessonPage"));

export default function App() {
  const [byteValue, setByteValue] = useState(221);
  const [mosfetOn, setMosfetOn] = useState(true);
  const [selectedWidth, setSelectedWidth] = useState(8);
  const [systemBits, setSystemBits] = useState(8);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [theme, setTheme] = useState(() => window.localStorage.getItem("embedded-theme") ?? "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("embedded-theme", theme);
  }, [theme]);

  function handleByteChange(nextValue) {
    setByteValue(clampToByte(nextValue));
  }

  function handleAddressSelect(index) {
    setSelectedAddressIndex(clamp(index, 0, 11));
  }

  const sharedChapterProps = {
    chapterOne: {
      byteValue,
      mosfetOn,
      onByteChange: handleByteChange,
      onMosfetToggle: () => setMosfetOn((current) => !current),
      selectedWidth,
      onWidthChange: setSelectedWidth,
    },
    chapterTwo: {
      byteValue,
      onByteChange: handleByteChange,
      systemBits,
      onSystemBitsChange: setSystemBits,
      selectedAddressIndex,
      onAddressSelect: handleAddressSelect,
    },
    chapterThree: {},
    chapterFour: {},
    chapterFive: {},
    chapterSix: {},
    chapterSeven: {},
    chapterEight: {},
    chapterNine: {},
    chapterTen: {},
    chapterEleven: {},
    chapterTwelve: {},
    chapterThirteen: {},
    chapterFourteen: {},
    chapterFifteen: {},
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <SiteTopBar
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />

      <Suspense
        fallback={
          <RouteLoadingPanel
            title="Loading view"
            body="Preparing the next page with route-level code splitting for a lighter initial load."
          />
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/abbreviations" element={<AbbreviationsPage />} />
          <Route
            path="/lesson/:lessonSlug"
            element={<LessonPage sharedChapterProps={sharedChapterProps} />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}
