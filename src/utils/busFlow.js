import { clamp } from "./bitMath";

const int16Limits = { min: -32768, max: 32767 };
const int32Limits = { min: -2147483648, max: 2147483647 };

function clampNumber(value, limits, fallback) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(limits.max, Math.max(limits.min, value));
}

function byteToBits(byte) {
  return byte
    .toString(2)
    .padStart(8, "0")
    .split("")
    .map((bit) => Number(bit));
}

function escapeChar(char) {
  if (char === "\\") {
    return "\\\\";
  }

  if (char === "'") {
    return "\\'";
  }

  if (char === "\n") {
    return "\\n";
  }

  if (char === "\t") {
    return "\\t";
  }

  return char;
}

function encodeChar(rawInput) {
  const trimmed = rawInput.trim();
  const numericMode = /^-?\d+$/.test(trimmed);

  if (numericMode) {
    const parsed = Number.parseInt(trimmed, 10);
    const byte = clamp(parsed, 0, 255);
    const printable = byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : null;

    return {
      normalizedInput: String(byte),
      typeLabel: "char",
      typeSummary: "1 byte",
      valueLabel: printable ? `'${printable}' / ${byte}` : `${byte}`,
      sourceLine: `char symbol = ${byte};`,
      humanText: printable
        ? `A char is just one byte. ${byte} and '${printable}' both fit in the same byte.`
        : `A char is still one byte here, but this number is outside the friendly printable ASCII range.`,
      bytes: [byte],
      numericMeaning: byte,
      storageNote: "One byte is enough, so one addressed memory cell stores the whole char.",
      analogy:
        "A char is like one labeled locker. It can hold a letter, but the locker itself only sees a small number.",
    };
  }

  const safeInput = trimmed || "A";
  const character = safeInput[0];
  const byte = character.charCodeAt(0) & 0xff;

  return {
    normalizedInput: character,
    typeLabel: "char",
    typeSummary: "1 byte",
    valueLabel: `'${character}' / ${byte}`,
    sourceLine: `char symbol = '${escapeChar(character)}';`,
    humanText: `The character '${character}' is stored as the numeric code ${byte} before hardware ever sees it.`,
    bytes: [byte],
    numericMeaning: byte,
    storageNote: "That byte sits in one memory address because a char occupies exactly one byte.",
    analogy:
      "Think of ASCII like a dictionary: the letter is the name humans like, but the chip stores only the number.",
  };
}

function encodeInt16(rawInput) {
  const parsed = Number.parseInt(rawInput, 10);
  const value = clampNumber(parsed, int16Limits, 300);
  const buffer = new ArrayBuffer(2);
  const view = new DataView(buffer);
  view.setInt16(0, value, true);

  return {
    normalizedInput: String(value),
    typeLabel: "int16_t",
    typeSummary: "2 bytes",
    valueLabel: String(value),
    sourceLine: `int16_t counter = ${value};`,
    humanText: `The signed number ${value} is broken into 2 bytes because this type reserves 16 bits.`,
    bytes: Array.from(new Uint8Array(buffer)),
    numericMeaning: value,
    storageNote:
      "The bytes are stored in little-endian order here, so the least-significant byte lands at the lower address first.",
    analogy:
      "A 16-bit integer is like a number split across two envelopes. Together they describe one full value.",
  };
}

function encodeInt32(rawInput) {
  const parsed = Number.parseInt(rawInput, 10);
  const value = clampNumber(parsed, int32Limits, 1024);
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setInt32(0, value, true);

  return {
    normalizedInput: String(value),
    typeLabel: "int",
    typeSummary: "4 bytes in this demo",
    valueLabel: String(value),
    sourceLine: `int total = ${value};`,
    humanText:
      "This lesson assumes a 32-bit int, which is common on modern microcontrollers but not guaranteed on every platform.",
    bytes: Array.from(new Uint8Array(buffer)),
    numericMeaning: value,
    storageNote:
      "One variable can occupy several neighboring addresses. The CPU still thinks of it as one number, but memory stores it byte by byte.",
    analogy:
      "A 32-bit int is like four stacked drawers that together hold one larger number.",
  };
}

function encodeFloat32(rawInput) {
  const parsed = Number.parseFloat(rawInput);
  const value = Number.isFinite(parsed) ? parsed : 3.5;
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, value, true);
  const rounded = view.getFloat32(0, true);

  return {
    normalizedInput: String(value),
    typeLabel: "float",
    typeSummary: "4 bytes",
    valueLabel: `${rounded}`,
    sourceLine: `float temperature = ${value}f;`,
    humanText:
      "A float does not store digits directly. It stores sign, exponent, and fraction fields using IEEE 754 rules.",
    bytes: Array.from(new Uint8Array(buffer)),
    numericMeaning: rounded,
    storageNote:
      "The four bytes in memory are the float's encoded pattern, not a text string saying '3.5'.",
    analogy:
      "A float is like scientific notation packed into hardware-friendly fields instead of plain decimal digits.",
  };
}

export function encodeTypedValue(typeId, rawInput) {
  const safeInput = rawInput ?? "";
  let encoded;

  switch (typeId) {
    case "char":
      encoded = encodeChar(safeInput);
      break;
    case "int16":
      encoded = encodeInt16(safeInput);
      break;
    case "float32":
      encoded = encodeFloat32(safeInput);
      break;
    case "int32":
    default:
      encoded = encodeInt32(safeInput);
      break;
  }

  const bytes = encoded.bytes.map((byte, index) => ({
    index,
    value: byte,
    bits: byteToBits(byte),
  }));

  return {
    ...encoded,
    bytes,
    bitCount: bytes.length * 8,
    bitStream: bytes.flatMap((byte) => byte.bits),
  };
}
