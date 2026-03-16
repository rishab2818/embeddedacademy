export function clamp(value, min, max) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.max(min, Math.min(max, value));
}

export function clampToByte(value) {
  return clamp(value, 0, 255);
}

export function toBinary(value, bits = 8, groupSize = 4) {
  const raw = (value >>> 0).toString(2).padStart(bits, "0");
  const grouped = raw.match(new RegExp(`.{1,${groupSize}}`, "g"));
  return grouped ? grouped.join(" ") : raw;
}

export function toHex(value, digits = 2) {
  return (value >>> 0).toString(16).toUpperCase().padStart(digits, "0");
}

export function toSignedByte(value) {
  return value > 127 ? value - 256 : value;
}

export function rangeForBits(bits, signed) {
  if (signed) {
    return {
      min: -(2 ** (bits - 1)),
      max: 2 ** (bits - 1) - 1,
    };
  }

  return {
    min: 0,
    max: 2 ** bits - 1,
  };
}

export function formatAddress(address) {
  return `0x${address.toString(16).toUpperCase().padStart(4, "0")}`;
}

export function charLabelForByte(value) {
  if (value >= 32 && value <= 126) {
    return `'${String.fromCharCode(value)}'`;
  }

  return "Raw byte";
}
