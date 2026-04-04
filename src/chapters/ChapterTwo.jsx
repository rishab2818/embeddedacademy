import { useMemo } from "react";
import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import RecapCheckpoint from "../components/RecapCheckpoint";
import SectionHeading from "../components/SectionHeading";
import { formatSectionLabel } from "../utils/courseLabels";
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
        <p className="panel-copy">
          {selected.summary} This does not mean memory suddenly changes size from bytes into larger
          boxes. It means the CPU's natural register width and data path width are wider, so it can
          process more bytes in one ordinary operation.
        </p>

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
            <p>Every address still points to one byte, even when the CPU itself is 32-bit.</p>
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
          If the CPU wants a wider value, it reads several neighboring byte addresses and combines
          them according to its type and instruction rules.
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
          It is only the label for where the data lives. Low-level programming gets much easier
          once you stop confusing a location with the value stored at that location.
        </p>
      </div>

      <div className="panel panel-note">
        <strong>What changes between 8-bit and 32-bit?</strong>
        <p className="panel-copy">
          Memory is still arranged as byte addresses in both systems. The main difference is
          how wide the CPU registers and data paths are, so an {systemBits}-bit system
          naturally works with {systemBits / 8} byte(s) at a time. This is why words like
          "byte", "halfword", and "word" matter in real embedded documentation.
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
  chapterNumber = "2",
}) {
  return (
    <section className="chapter" id="chapter-2">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Memory, addresses, and how computers locate real data</h2>
        <p>
          This chapter turns the first chapter's bits and bytes into an addressable machine.
          You will learn what it means for memory to be byte-addressable, why CPUs still think in
          larger chunks such as words, and why every variable, stack frame, array, and peripheral
          register eventually comes down to addresses pointing at stored bytes.
        </p>
      </div>

      <ChapterPrimer
        title="Four memory rules you should never forget"
        items={[
          {
            title: "Memory is a long ordered space",
            body: "At the beginner level, imagine memory as a very long street of numbered byte boxes. The number on the box is the address.",
          },
          {
            title: "An address answers where",
            body: "An address is not the data. It tells you where the data lives, just like a house number tells you where a person lives.",
          },
          {
            title: "A value answers what",
            body: "The bits stored at that address are the value. You need both the location and the interpretation to know what the machine is really holding.",
          },
          {
            title: "Wider CPUs still use byte-addressable memory",
            body: "A 32-bit CPU usually still reads from byte-addressed memory. It simply fetches and combines several neighboring bytes more naturally than an 8-bit CPU.",
          },
        ]}
        callout={{
          title: "Expert habit",
          body: "Whenever you debug memory, say the sentence precisely: address X contains value Y. That discipline prevents a huge number of beginner mistakes.",
        }}
      />

      <section className="chapter-section" id="chapter-2-systems">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="Compare an 8-bit system with a 32-bit system"
          description="Switch between them and notice the critical distinction: memory is still byte-addressable, but the CPU's natural working width changes the size of ordinary operations."
        />
        <SystemExplorer systemBits={systemBits} onSystemBitsChange={onSystemBitsChange} />
        <RecapCheckpoint
          title="Checkpoint: system width changes the CPU's natural chunk"
          items={[
            "An 8-bit or 32-bit system still uses byte-addressable memory.",
            "What mainly changes is the natural width of registers and data handling.",
            "Wide CPUs do not erase the byte model; they work by grouping multiple bytes together more naturally.",
          ]}
          question="Can you explain why a 32-bit machine still needs byte addresses?"
        />
        <DeepDiveBlock
          title="Natural width versus the whole machine"
          summary="Open this for the more exact hardware-reading version."
          points={[
            {
              title: "Not every path is identical",
              body: "A CPU may be 32-bit even though some peripheral buses or special transfer paths are narrower or organized differently.",
            },
            {
              title: "Compiler implications",
              body: "The target width changes what integer sizes feel efficient, how many instructions large values need, and how structure layouts are aligned.",
            },
            {
              title: "Memory stays byte-addressed",
              body: "This is why one big value can still be described as several neighboring bytes in memory.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-2-memory">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Memory is a contiguous set of addressed byte locations"
          description="Each cell below is one byte. Click any address, move the value, and see how wider systems naturally involve several neighboring bytes as one logical chunk."
        />
        <MemoryExplorer
          byteValue={byteValue}
          onByteChange={onByteChange}
          systemBits={systemBits}
          selectedAddressIndex={selectedAddressIndex}
          onAddressSelect={onAddressSelect}
        />
        <RecapCheckpoint
          title="Checkpoint: memory is a long row of byte boxes"
          items={[
            "Each address names one byte-sized location.",
            "Multi-byte values use neighboring addresses in sequence.",
            "Selecting one starting address is the first step toward building arrays, structs, stacks, and peripheral registers.",
          ]}
          question="If a value needs four bytes, do you know which addresses it will occupy after the first byte?"
        />
        <DeepDiveBlock
          title="Why contiguous storage matters"
          summary="This is the rule behind almost every later memory concept."
          points={[
            {
              title: "Arrays",
              body: "Array indexing works because the CPU can calculate base address plus index times element size.",
            },
            {
              title: "Words and endianness",
              body: "The CPU later decides how to combine adjacent bytes into bigger values, which is where endianness becomes important.",
            },
            {
              title: "Peripheral maps",
              body: "Hardware registers also live at addresses, so the same address model is used for both RAM values and I/O control blocks.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-2-addresses">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="Address tells where, value tells what"
          description="This single distinction is behind variables, arrays, stacks, pointers, peripheral registers, and almost every low-level bug you will ever debug."
        />
        <AddressStory
          byteValue={byteValue}
          systemBits={systemBits}
          selectedAddressIndex={selectedAddressIndex}
        />
        <RecapCheckpoint
          title="Checkpoint: address means where, value means what"
          items={[
            "An address is a location label, not the payload.",
            "The data at that address is the actual stored byte or bytes.",
            "Mixing up location and value is one of the earliest low-level reasoning mistakes.",
          ]}
          question="If someone says '0x2000 equals 221', can you tell whether they mean the address or the value stored there?"
        />
        <DeepDiveBlock
          title="Why this distinction becomes critical later"
          summary="Pointers, stacks, DMA, and memory-mapped I/O all depend on this."
          points={[
            {
              title: "Pointer logic",
              body: "A pointer stores an address, not the final data itself. If you mix those roles up, pointer reasoning collapses quickly.",
            },
            {
              title: "Debugging dumps",
              body: "A memory dump shows locations and contents. Good engineers read both columns separately and carefully.",
            },
            {
              title: "Hardware control",
              body: "Peripheral programming is really just reading and writing special addresses whose contents control real hardware behavior.",
            },
          ]}
        />
      </section>
    </section>
  );
}
