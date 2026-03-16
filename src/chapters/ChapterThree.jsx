import { useMemo, useState } from "react";
import ByteMemoryStrip from "../components/ByteMemoryStrip";
import SectionHeading from "../components/SectionHeading";
import { allBasicTypes, floatTypes, integerTypes } from "../data/basicTypes";
import { rangeForBits } from "../utils/bitMath";
import { clampIntegerToType, encodeFloatMemory, encodeIntegerMemory, formatValue } from "../utils/dataTypes";

const floatSamples = [0.5, 1, 3.25, -12.75, 0.1];

function formatFloatDisplay(value, digits) {
  if (Number.isNaN(value)) {
    return "NaN";
  }

  if (!Number.isFinite(value)) {
    return value > 0 ? "+Infinity" : "-Infinity";
  }

  return Number(value.toPrecision(digits)).toString();
}

function describeType(type) {
  if (type.family === "Integer") {
    const range = rangeForBits(type.bits, type.signed);
    return `${type.bytes} byte(s), range ${formatValue(range.min)} to ${formatValue(range.max)}`;
  }

  return `${type.bytes} byte(s), IEEE 754 layout 1/${type.exponentBits}/${type.fractionBits}`;
}

function TypeCatalog({ selectedId, onSelect }) {
  const selectedType = allBasicTypes.find((type) => type.id === selectedId) ?? allBasicTypes[0];

  return (
    <div className="chapter-grid">
      <div className="type-grid">
        {allBasicTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`type-card ${selectedId === type.id ? "active" : ""}`}
            onClick={() => onSelect(type)}
          >
            <span>{type.family}</span>
            <strong>{type.label}</strong>
            <p>{type.summary}</p>
          </button>
        ))}
      </div>

      <div className="panel">
        <p className="eyebrow">Selected type</p>
        <h3>{selectedType.label}</h3>
        <p className="panel-copy">{selectedType.explain}</p>

        <div className="stat-grid">
          <div className="stat-box">
            <span>Family</span>
            <strong>{selectedType.family}</strong>
          </div>
          <div className="stat-box">
            <span>Size</span>
            <strong>{selectedType.bits} bits</strong>
          </div>
          <div className="stat-box">
            <span>What to remember</span>
            <strong>{describeType(selectedType)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegerLab({ selectedTypeId, integerInput, onIntegerInputChange, onTypeChange }) {
  const type = integerTypes.find((item) => item.id === selectedTypeId) ?? integerTypes[0];
  const requestedValue = Number(integerInput);
  const range = rangeForBits(type.bits, type.signed);
  const encoding = useMemo(
    () => encodeIntegerMemory(requestedValue, type.bits, type.signed),
    [requestedValue, type.bits, type.signed]
  );

  const clampedValue = clampIntegerToType(requestedValue, type.bits, type.signed);
  const clamped = !Number.isNaN(requestedValue) && requestedValue !== clampedValue;

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel">
        <div className="button-row">
          {integerTypes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${item.id === type.id ? "active" : ""}`}
              onClick={() => onTypeChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="control-row">
          <label htmlFor="integerValue">Enter a whole number</label>
          <div className="slider-row">
            <input
              id="integerValue"
              className="number-input wide-input"
              type="number"
              value={integerInput}
              onChange={(event) => onIntegerInputChange(event.target.value)}
            />
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-box">
            <span>Allowed range</span>
            <strong>
              {formatValue(range.min)} to {formatValue(range.max)}
            </strong>
          </div>
          <div className="stat-box">
            <span>Stored value</span>
            <strong>{formatValue(encoding.normalizedValue)}</strong>
          </div>
          <div className="stat-box">
            <span>Memory size</span>
            <strong>{type.bytes} byte(s)</strong>
          </div>
        </div>

        <div className="callout">
          <strong>How to read this</strong>
          <span>
            {type.label} stores whole numbers only. The same bytes are interpreted either as
            signed or unsigned depending on the type name.
            {clamped ? ` Your input was clamped to ${formatValue(clampedValue)} because it was outside the valid range.` : ""}
          </span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Stored bits and bytes</p>
        <h3>{encoding.groupedBinary}</h3>
        <p className="panel-copy">
          The bit pattern is broken into 8-bit chunks because memory is byte-addressable.
        </p>

        <ByteMemoryStrip
          bytes={encoding.bytes}
          baseAddress={0x3000}
          label={`${type.label} in memory`}
        />
      </div>
    </div>
  );
}

function FloatBitFields({ encoding, type }) {
  const signBits = [encoding.signBit.toString()];
  const exponentBits = encoding.exponentText.split("");
  const fractionBits = encoding.fractionText.split("");

  return (
    <div className="float-bit-layout">
      <div className="float-field sign">
        <span>Sign</span>
        <div className="float-bits">
          {signBits.map((bit, index) => (
            <div key={`sign-${index}`} className="float-bit on">
              {bit}
            </div>
          ))}
        </div>
        <p>{encoding.signBit === 0 ? "0 means positive" : "1 means negative"}</p>
      </div>

      <div className="float-field exponent">
        <span>Exponent</span>
        <div className="float-bits">
          {exponentBits.map((bit, index) => (
            <div key={`exp-${index}`} className={`float-bit ${bit === "1" ? "on" : ""}`}>
              {bit}
            </div>
          ))}
        </div>
        <p>
          Stored exponent: {encoding.exponentRaw} <br />
          Real exponent after bias: {encoding.exponentValue}
        </p>
      </div>

      <div className="float-field fraction">
        <span>Fraction</span>
        <div className="float-bits">
          {fractionBits.map((bit, index) => (
            <div key={`frac-${index}`} className={`float-bit ${bit === "1" ? "on" : ""}`}>
              {bit}
            </div>
          ))}
        </div>
        <p>
          Fraction bits help build the significand. Here it is {encoding.significandText}.
        </p>
      </div>

      <div className="callout">
        <strong>IEEE 754 formula</strong>
        <span>{encoding.formulaText}</span>
      </div>
    </div>
  );
}

function FloatLab({ selectedTypeId, floatInput, onFloatInputChange, onTypeChange }) {
  const type = floatTypes.find((item) => item.id === selectedTypeId) ?? floatTypes[0];
  const requestedValue = Number(floatInput);
  const safeValue = Number.isFinite(requestedValue) ? requestedValue : 0;
  const encoding = useMemo(() => encodeFloatMemory(safeValue, type.bits), [safeValue, type.bits]);
  const storedValueText = formatFloatDisplay(
    encoding.storedValue,
    type.bits === 16 ? 6 : 9
  );

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="button-row">
          {floatTypes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${item.id === type.id ? "active" : ""}`}
              onClick={() => onTypeChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="control-row">
          <label htmlFor="floatValue">Enter a decimal value</label>
          <div className="slider-row">
            <input
              id="floatValue"
              className="number-input wide-input"
              type="number"
              step="0.01"
              value={floatInput}
              onChange={(event) => onFloatInputChange(event.target.value)}
            />
          </div>
        </div>

        <div className="button-row sample-row">
          {floatSamples.map((sample) => (
            <button
              key={sample}
              type="button"
              className="chip-button"
              onClick={() => onFloatInputChange(String(sample))}
            >
              {sample}
            </button>
          ))}
        </div>

        <div className="stat-grid">
          <div className="stat-box">
            <span>You asked for</span>
            <strong>{floatInput}</strong>
          </div>
          <div className="stat-box">
            <span>Stored value</span>
            <strong>{storedValueText}</strong>
          </div>
          <div className="stat-box">
            <span>Why it matters</span>
            <strong>{type.bits === 16 ? "Less memory, less precision" : "More precision, more bytes"}</strong>
          </div>
        </div>

        <div className="callout">
          <strong>Beginner rule</strong>
          <span>
            Floating point stores a sign, an exponent and a fraction. That is why it can hold
            decimals, but it also means some values like 0.1 are only approximated.
          </span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">IEEE 754 breakdown</p>
        <h3>{type.label}: 1 sign bit, {type.exponentBits} exponent bits, {type.fractionBits} fraction bits</h3>
        <FloatBitFields encoding={encoding} type={type} />

        <ByteMemoryStrip
          bytes={encoding.bytes}
          baseAddress={0x4000}
          label={`${type.label} bytes in memory`}
        />
      </div>
    </div>
  );
}

export default function ChapterThree() {
  const [selectedCatalogId, setSelectedCatalogId] = useState(allBasicTypes[0].id);
  const [selectedIntegerId, setSelectedIntegerId] = useState(integerTypes[0].id);
  const [integerInput, setIntegerInput] = useState(String(integerTypes[0].example));
  const [selectedFloatId, setSelectedFloatId] = useState(floatTypes[0].id);
  const [floatInput, setFloatInput] = useState(String(floatTypes[0].example));

  function handleCatalogSelect(type) {
    setSelectedCatalogId(type.id);

    if (type.family === "Integer") {
      setSelectedIntegerId(type.id);
      setIntegerInput(String(type.example));
      return;
    }

    setSelectedFloatId(type.id);
    setFloatInput(String(type.example));
  }

  function handleIntegerTypeChange(id) {
    const type = integerTypes.find((item) => item.id === id) ?? integerTypes[0];
    setSelectedIntegerId(type.id);
    setSelectedCatalogId(type.id);
    setIntegerInput(String(type.example));
  }

  function handleFloatTypeChange(id) {
    const type = floatTypes.find((item) => item.id === id) ?? floatTypes[0];
    setSelectedFloatId(type.id);
    setSelectedCatalogId(type.id);
    setFloatInput(String(type.example));
  }

  return (
    <section className="chapter" id="chapter-3">
      <div className="chapter-header">
        <p className="chapter-kicker">Chapter 3</p>
        <h2>Basic data types and how they live in memory</h2>
        <p>
          This chapter is for complete beginners. It introduces common integer and floating-point
          data types, shows how many bytes each one uses, and explains how the exact same memory
          idea applies to both whole numbers and IEEE 754 floating-point values.
        </p>
      </div>

      <section className="chapter-section" id="chapter-3-overview">
        <SectionHeading
          eyebrow="Type map"
          title="Choose a basic data type and learn what it stores"
          description="Click each type card to see what it means, how much memory it uses, and what kind of values it can represent."
        />
        <TypeCatalog selectedId={selectedCatalogId} onSelect={handleCatalogSelect} />
      </section>

      <section className="chapter-section" id="chapter-3-integers">
        <SectionHeading
          eyebrow="Integer memory"
          title="Signed and unsigned integers are bytes interpreted as whole numbers"
          description="Experiment with char, 16-bit integers and 32-bit integers, then watch their exact byte layout in memory."
        />
        <IntegerLab
          selectedTypeId={selectedIntegerId}
          integerInput={integerInput}
          onIntegerInputChange={setIntegerInput}
          onTypeChange={handleIntegerTypeChange}
        />
      </section>

      <section className="chapter-section" id="chapter-3-floating">
        <SectionHeading
          eyebrow="Floating point"
          title="IEEE 754 floats store sign, exponent and fraction"
          description="Switch between float16 and float32 to see why decimals are encoded differently from integers and why some values are only approximate."
        />
        <FloatLab
          selectedTypeId={selectedFloatId}
          floatInput={floatInput}
          onFloatInputChange={setFloatInput}
          onTypeChange={handleFloatTypeChange}
        />
      </section>
    </section>
  );
}
