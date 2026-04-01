import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AbbreviationsPage from "./pages/AbbreviationsPage";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import SiteTopBar from "./components/SiteTopBar";
import { clamp, clampToByte } from "./utils/bitMath";

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
    chapterEight: {},
    chapterNine: {},
    chapterTen: {},
    chapterEleven: {},
    chapterTwelve: {},
    chapterThirteen: {},
    chapterFourteen: {},
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <SiteTopBar theme={theme} onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/abbreviations" element={<AbbreviationsPage />} />
        <Route
          path="/lesson/:lessonSlug"
          element={<LessonPage sharedChapterProps={sharedChapterProps} />}
        />
      </Routes>
    </div>
  );
}
