import { rangeForBits, toBinary, toHex } from "./bitMath";

export function formatValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString("en-US");
  }

  return String(value);
}

export function clampIntegerToType(value, bits, signed) {
  const safe = Number.isNaN(value) ? 0 : Math.trunc(value);
  const range = rangeForBits(bits, signed);
  return Math.max(range.min, Math.min(range.max, safe));
}

export function encodeIntegerMemory(value, bits, signed) {
  const normalizedValue = clampIntegerToType(value, bits, signed);
  const byteCount = bits / 8;
  const modulo = 1n << BigInt(bits);
  let raw = BigInt(normalizedValue);

  if (raw < 0n) {
    raw += modulo;
  }

  const bytes = Array.from({ length: byteCount }, (_, index) =>
    Number((raw >> BigInt(index * 8)) & 0xffn)
  );

  return {
    normalizedValue,
    bytes,
    byteCount,
    groupedBinary: raw.toString(2).padStart(bits, "0").match(/.{1,8}/g)?.join(" ") ?? "",
  };
}

function rawToBytes(raw, byteCount) {
  return Array.from({ length: byteCount }, (_, index) =>
    Math.floor(raw / 2 ** (index * 8)) & 0xff
  );
}

function describeFloat(raw, exponentBits, fractionBits, bias, storedValue) {
  const signBit = raw >>> (exponentBits + fractionBits);
  const exponentMask = 2 ** exponentBits - 1;
  const fractionMask = 2 ** fractionBits - 1;
  const exponentRaw = (raw >>> fractionBits) & exponentMask;
  const fractionRaw = raw & fractionMask;
  const exponentText = exponentRaw.toString(2).padStart(exponentBits, "0");
  const fractionText = fractionRaw.toString(2).padStart(fractionBits, "0");

  let category = "normal";
  let exponentValue = exponentRaw - bias;
  let significandText = `1.${fractionText}`;
  let formulaText = `(-1)^${signBit} x 1.${fractionText} x 2^${exponentValue}`;

  if (exponentRaw === 0 && fractionRaw === 0) {
    category = "zero";
    exponentValue = 1 - bias;
    significandText = "0.0";
    formulaText = "Special case: exact zero";
  } else if (exponentRaw === 0) {
    category = "subnormal";
    exponentValue = 1 - bias;
    significandText = `0.${fractionText}`;
    formulaText = `(-1)^${signBit} x 0.${fractionText} x 2^${exponentValue}`;
  } else if (exponentRaw === exponentMask) {
    category = Number.isNaN(storedValue) ? "nan" : "infinity";
    significandText = fractionRaw === 0 ? "special" : "not-a-number";
    formulaText =
      category === "infinity"
        ? `Special case: ${signBit ? "-" : "+"}infinity`
        : "Special case: NaN";
  }

  return {
    signBit,
    exponentRaw,
    exponentText,
    exponentValue,
    fractionRaw,
    fractionText,
    significandText,
    formulaText,
    category,
  };
}

function encodeFloat16Raw(value) {
  if (Number.isNaN(value)) {
    return 0x7e00;
  }

  if (value === Infinity) {
    return 0x7c00;
  }

  if (value === -Infinity) {
    return 0xfc00;
  }

  const sign = value < 0 || Object.is(value, -0) ? 1 : 0;
  const abs = Math.abs(value);

  if (abs === 0) {
    return sign << 15;
  }

  const exp = Math.floor(Math.log2(abs));

  if (exp < -14) {
    const mantissa = Math.round(abs * 2 ** 24);
    return (sign << 15) | Math.min(0x03ff, mantissa);
  }

  if (exp > 15) {
    return (sign << 15) | 0x7c00;
  }

  let exponent = exp + 15;
  let mantissa = Math.round((abs / 2 ** exp - 1) * 1024);

  if (mantissa === 1024) {
    exponent += 1;
    mantissa = 0;
  }

  if (exponent >= 31) {
    return (sign << 15) | 0x7c00;
  }

  return (sign << 15) | (exponent << 10) | (mantissa & 0x03ff);
}

function decodeFloat16Raw(raw) {
  const sign = raw >>> 15 ? -1 : 1;
  const exponent = (raw >>> 10) & 0x1f;
  const fraction = raw & 0x03ff;

  if (exponent === 0x1f) {
    return fraction === 0 ? sign * Infinity : Number.NaN;
  }

  if (exponent === 0) {
    if (fraction === 0) {
      return sign === -1 ? -0 : 0;
    }

    return sign * (fraction / 1024) * 2 ** -14;
  }

  return sign * (1 + fraction / 1024) * 2 ** (exponent - 15);
}

export function encodeFloatMemory(value, bits) {
  if (bits === 16) {
    const raw = encodeFloat16Raw(value);
    const storedValue = decodeFloat16Raw(raw);
    const bytes = rawToBytes(raw, 2);

    return {
      raw,
      bits,
      bytes,
      storedValue,
      groupedBinary: toBinary(raw, 16),
      ...describeFloat(raw, 5, 10, 15, storedValue),
    };
  }

  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, value, false);
  const raw = view.getUint32(0, false);
  const storedValue = view.getFloat32(0, false);
  const bytes = rawToBytes(raw, 4);

  return {
    raw,
    bits,
    bytes,
    storedValue,
    groupedBinary: toBinary(raw, 32),
    ...describeFloat(raw, 8, 23, 127, storedValue),
  };
}

export function byteSummary(bytes) {
  return bytes.map((byte) => `${toHex(byte)} (${toBinary(byte, 8)})`);
}
