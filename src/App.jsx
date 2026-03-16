import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChapterOne from "./chapters/ChapterOne";
import ChapterTwo from "./chapters/ChapterTwo";
import ChapterThree from "./chapters/ChapterThree";
import { chapterCards } from "./data/chapters";
import { clamp, clampToByte, toBinary, toSignedByte } from "./utils/bitMath";

export default function App() {
  const [byteValue, setByteValue] = useState(221);
  const [mosfetOn, setMosfetOn] = useState(true);
  const [selectedWidth, setSelectedWidth] = useState(8);
  const [systemBits, setSystemBits] = useState(8);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  const signedByte = useMemo(() => toSignedByte(byteValue), [byteValue]);
  const binaryByte = useMemo(() => toBinary(byteValue, 8), [byteValue]);

  function handleByteChange(nextValue) {
    setByteValue(clampToByte(nextValue));
  }

  function handleAddressSelect(index) {
    setSelectedAddressIndex(clamp(index, 0, 11));
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="site-layout">
        <Sidebar chapters={chapterCards} />

        <main className="main-shell">
          <header className="page-hero" id="top">
            <div className="hero-copy">
              <p className="eyebrow">Embedded Programming Fundamentals</p>
              <h1>Learn how bits, bytes, memory and addresses really work</h1>
              <p className="hero-text">
                This site now has chapter cards in the sidebar and three interactive lessons.
                Chapter 1 explains how computers think in bits. Chapter 2 shows memory and
                addresses. Chapter 3 teaches basic data types, including signed and unsigned
                integers plus IEEE 754 floating-point memory.
              </p>

              <div className="hero-actions">
                <a href="#chapter-1" className="primary-link">
                  Open chapter 1
                </a>
                <a href="#chapter-2" className="secondary-link">
                  Open chapter 2
                </a>
                <a href="#chapter-3" className="secondary-link">
                  Open chapter 3
                </a>
              </div>
            </div>

            <div className="hero-summary panel">
              <div className="summary-row">
                <span>Current byte</span>
                <strong>{byteValue}</strong>
              </div>
              <div className="summary-row">
                <span>Binary</span>
                <strong>{binaryByte}</strong>
              </div>
              <div className="summary-row">
                <span>Signed view</span>
                <strong>{signedByte}</strong>
              </div>
              <div className="summary-row">
                <span>Memory example</span>
                <strong>221 at 0x2000</strong>
              </div>
              <div className="summary-row">
                <span>New lesson</span>
                <strong>IEEE 754 basics</strong>
              </div>
            </div>
          </header>

          <ChapterOne
            byteValue={byteValue}
            mosfetOn={mosfetOn}
            onByteChange={handleByteChange}
            onMosfetToggle={() => setMosfetOn((current) => !current)}
            selectedWidth={selectedWidth}
            onWidthChange={setSelectedWidth}
          />

          <ChapterTwo
            byteValue={byteValue}
            onByteChange={handleByteChange}
            systemBits={systemBits}
            onSystemBitsChange={setSystemBits}
            selectedAddressIndex={selectedAddressIndex}
            onAddressSelect={handleAddressSelect}
          />

          <ChapterThree />
        </main>
      </div>
    </div>
  );
}
