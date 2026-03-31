import { useMemo, useState } from "react";
import MemoryMap from "../components/MemoryMap";
import SectionHeading from "../components/SectionHeading";
import { castTypeIds, defaultArrayValues, packedFlagLabels, pointerTypeIds, variableTypeIds, arrayTypeIds } from "../data/chapterFour";
import { getTypeById, buildArrayMemory, buildPointerMemory, buildVariableMemory, castBetweenTypes, packFlags, typeRangeText } from "../utils/programmingConcepts";
import { toBinary, toHex } from "../utils/bitMath";
import { formatSectionLabel } from "../utils/courseLabels";

function TypeButtonRow({ ids, selectedId, onChange }) {
  return (
    <div className="button-row">
      {ids.map((typeId) => {
        const type = getTypeById(typeId);
        return (
          <button
            key={typeId}
            type="button"
            className={`chip-button ${selectedId === typeId ? "active" : ""}`}
            onClick={() => onChange(typeId)}
          >
            {type.label}
          </button>
        );
      })}
    </div>
  );
}

function VariableLab() {
  const [typeId, setTypeId] = useState("signed-int16");
  const [valueInput, setValueInput] = useState("-35");
  const variable = useMemo(() => buildVariableMemory(typeId, valueInput), [typeId, valueInput]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel">
        <TypeButtonRow ids={variableTypeIds} selectedId={typeId} onChange={setTypeId} />

        <div className="control-row">
          <label htmlFor="variableValue">Change the variable value</label>
          <input
            id="variableValue"
            className="number-input wide-input"
            type="number"
            step={variable.type.family === "Floating point" ? "0.25" : "1"}
            value={valueInput}
            onChange={(event) => setValueInput(event.target.value)}
          />
        </div>

        <div className="variable-card">
          <span>Variable name</span>
          <strong>{variable.variableName}</strong>
          <p className="panel-copy">
            A variable is a named piece of memory. The type tells the CPU how many bytes to use
            and how to interpret those bytes.
          </p>
        </div>

        <div className="stat-grid">
          <div className="stat-box">
            <span>Type</span>
            <strong>{variable.type.label}</strong>
          </div>
          <div className="stat-box">
            <span>Range / format</span>
            <strong>{typeRangeText(typeId)}</strong>
          </div>
          <div className="stat-box">
            <span>Stored value</span>
            <strong>{variable.displayValue}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Memory view</p>
        <h3>{variable.variableName} lives at one starting address</h3>
        <p className="panel-copy">
          The variable starts at <code>0x5000</code>. If the type needs more than one byte,
          the next bytes are stored in the following addresses.
        </p>

        <MemoryMap
          title={`${variable.type.label} bytes`}
          subtitle={`Bit pattern: ${variable.groupedBinary}`}
          cells={variable.cells}
          columns={Math.min(variable.cells.length, 4)}
        />
      </div>
    </div>
  );
}

function ArrayLab() {
  const [typeId, setTypeId] = useState("unsigned-char");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [values, setValues] = useState(defaultArrayValues.map(String));
  const [flags, setFlags] = useState([true, false, true, true, false, true, false, false]);

  const numericValues = values.map((value) => Number(value));
  const arrayMemory = useMemo(() => buildArrayMemory(typeId, numericValues), [typeId, numericValues]);
  const packed = useMemo(() => packFlags(flags), [flags]);
  const selectedElement = arrayMemory.elements[selectedIndex];

  function updateElement(nextValue) {
    setValues((current) =>
      current.map((value, index) => (index === selectedIndex ? nextValue : value))
    );
  }

  function toggleFlag(index) {
    setFlags((current) => current.map((flag, item) => (item === index ? !flag : flag)));
  }

  return (
    <div className="array-stack">
      <div className="chapter-grid chapter-grid-wide">
        <div className="panel">
          <TypeButtonRow ids={arrayTypeIds} selectedId={typeId} onChange={setTypeId} />

          <div className="button-row array-index-row">
            {arrayMemory.elements.map((element) => (
              <button
                key={element.index}
                type="button"
                className={`chip-button ${selectedIndex === element.index ? "active" : ""}`}
                onClick={() => setSelectedIndex(element.index)}
              >
                array[{element.index}]
              </button>
            ))}
          </div>

          <div className="control-row">
            <label htmlFor="arrayValue">Change the selected element</label>
            <input
              id="arrayValue"
              className="number-input wide-input"
              type="number"
              step="1"
              value={values[selectedIndex]}
              onChange={(event) => updateElement(event.target.value)}
            />
          </div>

          <div className="callout">
            <strong>Array idea</strong>
            <span>
              An array is a list of same-type values stored back-to-back in memory. The address
              of each element is base address + index x element size.
            </span>
          </div>

          <div className="stat-grid">
            <div className="stat-box">
              <span>Element type</span>
              <strong>{arrayMemory.type.label}</strong>
            </div>
            <div className="stat-box">
              <span>Selected element</span>
              <strong>array[{selectedIndex}] = {selectedElement.displayValue}</strong>
            </div>
            <div className="stat-box">
              <span>Starts at</span>
              <strong>{`0x${selectedElement.startAddress.toString(16).toUpperCase()}`}</strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Contiguous memory</p>
          <h3>Each element occupies its own group of bytes</h3>
          <MemoryMap
            title="Array bytes"
            subtitle={`Total size: ${arrayMemory.totalBytes} byte(s)`}
            cells={arrayMemory.cells}
            activeGroup={selectedIndex}
            columns={4}
          />
        </div>
      </div>

      <div className="chapter-grid">
        <div className="panel">
          <p className="eyebrow">Packed array idea</p>
          <h3>Packed flags squeeze many small values into one byte</h3>
          <p className="panel-copy">
            A normal flag array often uses one whole byte per flag. A packed array stores each
            flag as one bit, so eight flags can fit into a single byte.
          </p>

          <div className="flag-grid">
            {packedFlagLabels.map((label, index) => (
              <button
                key={label}
                type="button"
                className={`flag-button ${flags[index] ? "on" : ""}`}
                onClick={() => toggleFlag(index)}
              >
                {label}: {flags[index] ? "1" : "0"}
              </button>
            ))}
          </div>

          <div className="stat-grid">
            <div className="stat-box">
              <span>Unpacked size</span>
              <strong>{packed.unpackedBytes} bytes</strong>
            </div>
            <div className="stat-box">
              <span>Packed size</span>
              <strong>{packed.packedBytes} byte</strong>
            </div>
            <div className="stat-box">
              <span>Packed byte</span>
              <strong>{toHex(packed.byte)} / {toBinary(packed.byte, 8)}</strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <MemoryMap
            title="Packed flags in memory"
            subtitle="Each bit now holds one flag"
            cells={[
              {
                address: 0x5400,
                hex: toHex(packed.byte),
                note: toBinary(packed.byte, 8),
              },
            ]}
            columns={1}
          />

          <div className="bit-row packed-bit-row" aria-label="Packed flags bit layout">
            {flags.map((flag, index) => (
              <div key={`${packed.byte}-${index}`} className={`bit-pill ${flag ? "on" : ""}`}>
                b{index}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PointerLab() {
  const [typeId, setTypeId] = useState("signed-int16");
  const [valueInput, setValueInput] = useState("221");
  const [followPointer, setFollowPointer] = useState(true);
  const pointerInfo = useMemo(() => buildPointerMemory(typeId, valueInput), [typeId, valueInput]);

  return (
    <div className="chapter-grid">
      <div className="panel">
        <TypeButtonRow ids={pointerTypeIds} selectedId={typeId} onChange={setTypeId} />

        <div className="control-row">
          <label htmlFor="pointerValue">Value stored in the target variable</label>
          <input
            id="pointerValue"
            className="number-input wide-input"
            type="number"
            value={valueInput}
            onChange={(event) => setValueInput(event.target.value)}
          />
        </div>

        <div className="pointer-card">
          <div className="pointer-box">
            <span>Pointer variable</span>
            <strong>p</strong>
            <small>{`stores 0x${pointerInfo.targetAddress.toString(16).toUpperCase()}`}</small>
          </div>
          <div className="pointer-link">
            <div className={`pointer-line ${followPointer ? "active" : ""}`}>
              <span className="pointer-dot" />
            </div>
          </div>
          <div className="pointer-box target">
            <span>Target variable</span>
            <strong>value</strong>
            <small>{`contains ${pointerInfo.dereferencedValue}`}</small>
          </div>
        </div>

        <button
          type="button"
          className={`toggle-button ${followPointer ? "on" : ""}`}
          onClick={() => setFollowPointer((current) => !current)}
        >
          {followPointer ? "Following *p" : "Animate *p"}
        </button>

        <div className="callout">
          <strong>Pointer meaning</strong>
          <span>
            A pointer stores an address. Dereferencing with <code>*p</code> means: go to that
            address and read the value found there using the pointer&apos;s type.
          </span>
        </div>
      </div>

      <div className="panel">
        <MemoryMap
          title="Pointer bytes"
          subtitle="The pointer itself is data too"
          cells={pointerInfo.pointerCells}
          columns={4}
        />

        <MemoryMap
          title="Target bytes"
          subtitle={`Dereferencing reads ${pointerInfo.target.type.label}`}
          cells={pointerInfo.targetCells}
          columns={Math.min(pointerInfo.targetCells.length, 4)}
        />
      </div>
    </div>
  );
}

function TypeCastingLab() {
  const [sourceTypeId, setSourceTypeId] = useState("float32");
  const [targetTypeId, setTargetTypeId] = useState("signed-int16");
  const [inputValue, setInputValue] = useState("221.75");
  const cast = useMemo(
    () => castBetweenTypes(sourceTypeId, targetTypeId, inputValue),
    [sourceTypeId, targetTypeId, inputValue]
  );

  return (
    <div className="chapter-grid">
      <div className="panel">
        <p className="eyebrow">Source value</p>
        <TypeButtonRow ids={castTypeIds} selectedId={sourceTypeId} onChange={setSourceTypeId} />

        <div className="control-row">
          <label htmlFor="castValue">Value before casting</label>
          <input
            id="castValue"
            className="number-input wide-input"
            type="number"
            step="0.25"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
        </div>

        <div className="stat-grid">
          <div className="stat-box">
            <span>Source type</span>
            <strong>{cast.sourceType.label}</strong>
          </div>
          <div className="stat-box">
            <span>Stored source value</span>
            <strong>{cast.sourceEncoded.displayValue}</strong>
          </div>
          <div className="stat-box">
            <span>Source bytes</span>
            <strong>{cast.sourceEncoded.bytes.map((byte) => toHex(byte)).join(" ")}</strong>
          </div>
        </div>

        <MemoryMap
          title="Before cast"
          subtitle="Original representation in memory"
          cells={cast.sourceEncoded.bytes.map((byte, index) => ({
            address: 0x6400 + index,
            hex: toHex(byte),
            note: `byte ${index}`,
          }))}
          columns={Math.min(cast.sourceEncoded.bytes.length, 4)}
        />
      </div>

      <div className="panel">
        <p className="eyebrow">Target type</p>
        <TypeButtonRow ids={castTypeIds} selectedId={targetTypeId} onChange={setTargetTypeId} />

        <div className="cast-arrow">
          <div className="cast-line">
            <span className="cast-dot" />
          </div>
          <strong>cast</strong>
        </div>

        <div className="stat-grid">
          <div className="stat-box">
            <span>Target type</span>
            <strong>{cast.targetType.label}</strong>
          </div>
          <div className="stat-box">
            <span>Converted value</span>
            <strong>{cast.targetEncoded.displayValue}</strong>
          </div>
          <div className="stat-box">
            <span>Target bytes</span>
            <strong>{cast.targetEncoded.bytes.map((byte) => toHex(byte)).join(" ")}</strong>
          </div>
        </div>

        <div className="callout">
          <strong>How this cast works</strong>
          <span>{cast.explanation}</span>
        </div>

        <MemoryMap
          title="After cast"
          subtitle="New representation after conversion"
          cells={cast.targetEncoded.bytes.map((byte, index) => ({
            address: 0x6500 + index,
            hex: toHex(byte),
            note: `byte ${index}`,
          }))}
          columns={Math.min(cast.targetEncoded.bytes.length, 4)}
        />
      </div>
    </div>
  );
}

export default function ChapterFour({ chapterLabel = "Chapter 4", chapterNumber = "4" }) {
  return (
    <section className="chapter" id="chapter-4">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Variables, arrays, pointers and typecasting</h2>
        <p>
          This chapter connects programming words to real memory. It shows how a variable is a
          named memory location, how arrays occupy contiguous addresses, how packed data saves
          space, how pointers store addresses, and how typecasting creates a new representation.
        </p>
      </div>

      <section className="chapter-section" id="chapter-4-variables">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="A variable is a name attached to bytes in memory"
          description="Choose a type and a value, then watch how the variable occupies one or more addresses depending on its type."
        />
        <VariableLab />
      </section>

      <section className="chapter-section" id="chapter-4-arrays">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Arrays store many same-type values back-to-back"
          description="Click an array element to see where it starts in memory, then compare that with a packed flag array that saves space by using bits."
        />
        <ArrayLab />
      </section>

      <section className="chapter-section" id="chapter-4-pointers">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="A pointer does not hold the data, it holds the address of the data"
          description="Follow the pointer to the target variable and see how dereferencing reads the value from the pointed address."
        />
        <PointerLab />
      </section>

      <section className="chapter-section" id="chapter-4-casting">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="Casting changes how a value is stored in the new type"
          description="Pick a source type and a target type to see that typecasting creates a new result and new bytes in memory."
        />
        <TypeCastingLab />
      </section>
    </section>
  );
}
