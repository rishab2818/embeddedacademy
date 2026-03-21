import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import { clamp, clampToByte } from "./utils/bitMath";
import { useState } from "react";

export default function App() {
  const [byteValue, setByteValue] = useState(221);
  const [mosfetOn, setMosfetOn] = useState(true);
  const [selectedWidth, setSelectedWidth] = useState(8);
  const [systemBits, setSystemBits] = useState(8);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

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
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lesson/:lessonSlug" element={<LessonPage sharedChapterProps={sharedChapterProps} />} />
      </Routes>
    </div>
  );
}
