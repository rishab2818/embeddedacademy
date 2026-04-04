import { useMemo, useState } from "react";
import ByteMemoryStrip from "../components/ByteMemoryStrip";
import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import RecapCheckpoint from "../components/RecapCheckpoint";
import SectionHeading from "../components/SectionHeading";
import { allBasicTypes, floatTypes, integerTypes } from "../data/basicTypes";
import { rangeForBits } from "../utils/bitMath";
import { formatSectionLabel } from "../utils/courseLabels";
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
        <p className="panel-copy">
          At the expert level, a type is not just a label for the programmer. It is a contract
          that tells the compiler how many bytes to reserve, what operations are valid, and how the
          CPU should interpret the resulting bit pattern.
        </p>

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
            {clamped ? ` Your input was clamped to ${formatValue(clampedValue)} because it was outside the valid range.` : ""} This is the beginning of understanding overflow, truncation, and why exact integer sizes matter in embedded systems.
          </span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Stored bits and bytes</p>
        <h3>{encoding.groupedBinary}</h3>
        <p className="panel-copy">
          The bit pattern is broken into 8-bit chunks because memory is byte-addressable. A multi-byte integer is still one value in the program, but memory stores it a byte at a time.
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
            That approximation is normal hardware behavior, not a bug in your calculator.
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

export default function ChapterThree({ chapterLabel = "Chapter 3", chapterNumber = "3" }) {
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
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Data types and why the same bytes can mean very different things</h2>
        <p>
          This chapter teaches one of the most important transitions in low-level thinking:
          memory only stores bytes, but software types define how those bytes are grouped,
          interpreted, limited, and operated on. That is the bridge between raw storage and useful
          computation.
        </p>
      </div>

      <ChapterPrimer
        title="What a type really does in a low-level program"
        items={[
          {
            title: "It chooses a size",
            body: "The type tells the compiler how many bytes to reserve for the value in memory or in a register.",
          },
          {
            title: "It chooses an interpretation",
            body: "Those bytes might mean unsigned magnitude, signed two's complement, or an IEEE 754 floating-point number.",
          },
          {
            title: "It changes valid operations",
            body: "Adding integers, comparing signed and unsigned values, and calculating with floats are not all the same at the hardware level.",
          },
          {
            title: "It changes error behavior",
            body: "Small integers can overflow, signedness can change meaning, and floats can approximate values instead of storing them exactly.",
          },
        ]}
        callout={{
          title: "Expert habit",
          body: "When a value looks wrong, inspect three things: the type, the byte pattern, and the interpretation rule. Most low-level bugs live in that triangle.",
        }}
      />

      <section className="chapter-section" id="chapter-3-overview">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="Choose a basic data type and learn what it stores"
          description="Click each type card to see what it means, how much memory it uses, what range or layout it has, and why that matters in real firmware."
        />
        <TypeCatalog selectedId={selectedCatalogId} onSelect={handleCatalogSelect} />
        <RecapCheckpoint
          title="Checkpoint: a type is a storage-and-meaning contract"
          items={[
            "A type decides size, interpretation, and legal operations.",
            "Memory stores bytes either way; the type tells the compiler and CPU how to treat them.",
            "Choosing the wrong type can silently create overflow, truncation, or precision problems.",
          ]}
          question="If two variables show the same bytes, could they still mean different things because their types differ?"
        />
        <DeepDiveBlock
          title="Why the compiler cares deeply about type"
          summary="This is the step from beginner memory pictures to systems programming."
          points={[
            {
              title: "Allocation",
              body: "Type tells the compiler how many bytes to reserve and how to align those bytes in memory.",
            },
            {
              title: "Instruction choice",
              body: "Integer math, signed comparisons, and floating-point operations may use completely different instruction sequences.",
            },
            {
              title: "Bug surface",
              body: "Many embedded faults happen because the type chosen by the programmer does not match the physical range or format of the incoming data.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-3-integers">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Signed and unsigned integers are bytes interpreted as whole numbers"
          description="Experiment with small and large integers, then connect range, overflow limits, and byte layout to what the machine is really storing."
        />
        <IntegerLab
          selectedTypeId={selectedIntegerId}
          integerInput={integerInput}
          onIntegerInputChange={setIntegerInput}
          onTypeChange={handleIntegerTypeChange}
        />
        <RecapCheckpoint
          title="Checkpoint: integers are exact, but only within their limits"
          items={[
            "Integer types use a fixed number of bytes and an exact whole-number interpretation.",
            "Signedness changes the range, not the byte count.",
            "When the requested value falls outside the allowed range, the result can clamp, wrap, or otherwise stop matching the programmer's intention.",
          ]}
          question="Can you explain why `uint8_t` and `int8_t` are both one byte but do not share the same valid range?"
        />
        <DeepDiveBlock
          title="Overflow, range, and hardware realism"
          summary="Open this when you want the engineering consequence of integer limits."
          points={[
            {
              title: "Sensor scaling",
              body: "A raw ADC reading may fit easily in 12 bits, but the moment you scale, offset, or combine it, the chosen integer width may become too small.",
            },
            {
              title: "Protocol parsing",
              body: "Packet fields often define exact widths and signedness. If the code guesses wrong, the bytes are still correct but the meaning is corrupted.",
            },
            {
              title: "Design habit",
              body: "Choose integer sizes based on the real physical range of the signal and the later math, not just on what compiles first.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-3-floating">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="IEEE 754 floats store sign, exponent and fraction"
          description="Switch between float16 and float32 to see why decimals are encoded differently from integers, why precision is limited, and why exact decimal storage is often impossible."
        />
        <FloatLab
          selectedTypeId={selectedFloatId}
          floatInput={floatInput}
          onFloatInputChange={setFloatInput}
          onTypeChange={handleFloatTypeChange}
        />
        <RecapCheckpoint
          title="Checkpoint: floats trade exactness for range and convenience"
          items={[
            "Floating point stores sign, exponent, and fraction rather than a plain integer magnitude.",
            "This format can represent a huge range of values, but many decimals are stored only approximately.",
            "Float16 saves memory while float32 usually keeps more precision.",
          ]}
          question="If 0.1 prints as a nearby value in memory, do you know why that is normal floating-point behavior instead of a random bug?"
        />
        <DeepDiveBlock
          title="Where float mistakes hurt embedded systems"
          summary="Use this to connect IEEE 754 theory to product behavior."
          points={[
            {
              title: "Control loops",
              body: "Small rounding errors can accumulate if a loop repeatedly integrates or filters signals using floating-point math.",
            },
            {
              title: "Memory budget",
              body: "Float32 is friendlier for precision, but float-heavy firmware can grow memory and execution costs quickly on small MCUs.",
            },
            {
              title: "Debug reading",
              body: "When a float looks strange, inspect both the IEEE 754 fields and the original physical quantity the value is supposed to represent.",
            },
          ]}
        />
      </section>
    </section>
  );
}
