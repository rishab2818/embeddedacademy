import { useMemo } from "react";
import SectionHeading from "../components/SectionHeading";
import { clampToByte, formatAddress, toBinary, toHex } from "../utils/bitMath";

const systemOptions = [
  {
    bits: 8,
    title: "8-bit system",
    summary: "Naturally works with 1 byte at a time.",
    registerText: "Registers and data paths are 8 bits wide.",
    accessText: "A natural memory access is 1 byte.",
  },
  {
    bits: 32,
    title: "32-bit system",
    summary: "Naturally works with 4 bytes at a time.",
    registerText: "Registers and data paths are 32 bits wide.",
    accessText: "A natural memory access is 4 contiguous bytes.",
  },
];

const fillerValues = [34, 17, 91, 12, 77, 144, 3, 208, 52, 11, 189, 6];

function SystemExplorer({ systemBits, onSystemBitsChange }) {
  const selected = systemOptions.find((option) => option.bits === systemBits) ?? systemOptions[0];
  const laneCount = systemBits === 8 ? 8 : 16;

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="button-row">
          {systemOptions.map((option) => (
            <button
              key={option.bits}
              type="button"
              className={`chip-button ${systemBits === option.bits ? "active" : ""}`}
              onClick={() => onSystemBitsChange(option.bits)}
            >
              {option.title}
            </button>
          ))}
        </div>

        <h3>{selected.title}</h3>
        <p className="panel-copy">{selected.summary}</p>

        <div className="stat-grid">
          <div className="stat-box">
            <span>Register width</span>
            <strong>{systemBits} bits</strong>
          </div>
          <div className="stat-box">
            <span>Natural chunk</span>
            <strong>{systemBits / 8} byte(s)</strong>
          </div>
          <div className="stat-box">
            <span>Bus idea</span>
            <strong>{selected.accessText}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">System sketch</p>
        <div className="system-sketch">
          <div className="sketch-card">
            <span>CPU</span>
            <strong>{systemBits}-bit</strong>
            <p>{selected.registerText}</p>
          </div>
          <div className="bus-lanes" aria-hidden="true">
            {Array.from({ length: laneCount }).map((_, index) => (
              <span
                key={`${systemBits}-${index}`}
                className="bus-lane"
                style={{ animationDelay: `${index * 70}ms` }}
              />
            ))}
          </div>
          <div className="sketch-card memory-card">
            <span>Memory</span>
            <strong>Byte boxes</strong>
            <p>Every address points to a stored byte.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemoryExplorer({
  byteValue,
  onByteChange,
  systemBits,
  selectedAddressIndex,
  onAddressSelect,
}) {
  const accessWidth = systemBits / 8;
  const cells = useMemo(
    () =>
      fillerValues.map((value, index) => ({
        address: 0x2000 + index,
        value: index === selectedAddressIndex ? byteValue : value,
      })),
    [byteValue, selectedAddressIndex]
  );

  const activeCells = cells.filter(
    (_, index) => index >= selectedAddressIndex && index < selectedAddressIndex + accessWidth
  );
  const selectedCell = cells[selectedAddressIndex];

  return (
    <div className="panel">
      <div className="panel-header stacked">
        <div>
          <p className="eyebrow">Contiguous memory block</p>
          <h3>Memory is a long line of byte-sized boxes with addresses</h3>
        </div>
      </div>

      <div className="control-row">
        <label htmlFor="memoryByte">Value stored at the selected address</label>
        <div className="slider-row">
          <input
            id="memoryByte"
            type="range"
            min="0"
            max="255"
            value={byteValue}
            onChange={(event) => onByteChange(clampToByte(Number(event.target.value)))}
          />
          <input
            className="number-input"
            type="number"
            min="0"
            max="255"
            value={byteValue}
            onChange={(event) => onByteChange(clampToByte(Number(event.target.value)))}
          />
        </div>
      </div>

      <div className={`memory-grid width-${systemBits}`}>
        {cells.map((cell, index) => {
          const inWindow =
            index >= selectedAddressIndex && index < selectedAddressIndex + accessWidth;
          const selected = index === selectedAddressIndex;

          return (
            <button
              key={cell.address}
              type="button"
              className={`memory-cell ${selected ? "selected" : ""} ${inWindow ? "window" : ""}`}
              onClick={() => onAddressSelect(index)}
            >
              <span>{formatAddress(cell.address)}</span>
              <strong>{toHex(cell.value)}</strong>
              <small>{cell.value}</small>
            </button>
          );
        })}
      </div>

      <div className="callout memory-callout">
        <strong>Reading the picture</strong>
        <span>
          {formatAddress(selectedCell.address)} is an address. It is the name of a memory
          location. The value stored there is {selectedCell.value}, which is {toHex(selectedCell.value)} in hex and {toBinary(selectedCell.value, 8)} in binary.
        </span>
      </div>

      <div className="stat-grid">
        <div className="stat-box">
          <span>Selected address</span>
          <strong>{formatAddress(selectedCell.address)}</strong>
        </div>
        <div className="stat-box">
          <span>Byte stored there</span>
          <strong>{selectedCell.value}</strong>
        </div>
        <div className="stat-box">
          <span>Contiguous block touched</span>
          <strong>
            {formatAddress(activeCells[0].address)} to {formatAddress(activeCells[activeCells.length - 1].address)}
          </strong>
        </div>
      </div>
    </div>
  );
}

function AddressStory({ byteValue, systemBits, selectedAddressIndex }) {
  const selectedAddress = formatAddress(0x2000 + selectedAddressIndex);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel">
        <p className="eyebrow">Address vs value</p>
        <h3>{selectedAddress} is the location, {byteValue} is the data</h3>
        <p className="panel-copy">
          When we say "221 is stored at address {selectedAddress}", we mean the memory box
          named {selectedAddress} contains the byte value 221. The address is not the data.
          It is only the label for where the data lives.
        </p>
      </div>

      <div className="panel panel-note">
        <strong>What changes between 8-bit and 32-bit?</strong>
        <p className="panel-copy">
          Memory is still arranged as byte addresses in both systems. The main difference is
          how wide the CPU registers and data paths are, so an {systemBits}-bit system
          naturally works with {systemBits / 8} byte(s) at a time.
        </p>
      </div>
    </div>
  );
}

export default function ChapterTwo({
  byteValue,
  onByteChange,
  systemBits,
  onSystemBitsChange,
  selectedAddressIndex,
  onAddressSelect,
  chapterLabel = "Chapter 2",
}) {
  return (
    <section className="chapter" id="chapter-2">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Memory, addresses and contiguous bytes</h2>
        <p>
          This chapter shows what an 8-bit system and a 32-bit system look like, what memory
          really is, why addresses are just labels, and what it means to say that the value
          221 is stored at address <code>0x2000</code>.
        </p>
      </div>

      <section className="chapter-section" id="chapter-2-systems">
        <SectionHeading
          eyebrow="System view"
          title="Compare an 8-bit system with a 32-bit system"
          description="Switch between them and notice how the CPU width changes the natural amount of data it handles in one operation."
        />
        <SystemExplorer systemBits={systemBits} onSystemBitsChange={onSystemBitsChange} />
      </section>

      <section className="chapter-section" id="chapter-2-memory">
        <SectionHeading
          eyebrow="Memory blocks"
          title="Memory is a contiguous set of addressed byte locations"
          description="Each cell below is one byte. Click any address to move the value 221 there and see which neighboring bytes are touched."
        />
        <MemoryExplorer
          byteValue={byteValue}
          onByteChange={onByteChange}
          systemBits={systemBits}
          selectedAddressIndex={selectedAddressIndex}
          onAddressSelect={onAddressSelect}
        />
      </section>

      <section className="chapter-section" id="chapter-2-addresses">
        <SectionHeading
          eyebrow="Address meaning"
          title="Address tells where, value tells what"
          description="This is the core idea behind variables, arrays, stacks and almost everything else in low-level programming."
        />
        <AddressStory
          byteValue={byteValue}
          systemBits={systemBits}
          selectedAddressIndex={selectedAddressIndex}
        />
      </section>
    </section>
  );
}
