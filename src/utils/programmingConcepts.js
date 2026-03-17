import { allBasicTypes } from "../data/basicTypes";
import { clampIntegerToType, encodeFloatMemory, encodeIntegerMemory, formatValue } from "./dataTypes";
import { formatAddress, rangeForBits, toHex } from "./bitMath";

const typeMap = new Map(allBasicTypes.map((type) => [type.id, type]));

export function getTypeById(typeId) {
  return typeMap.get(typeId);
}

export function encodeValueForType(typeId, value) {
  const type = getTypeById(typeId);

  if (!type) {
    throw new Error(`Unknown type: ${typeId}`);
  }

  if (type.family === "Floating point") {
    const numericValue = Number.isNaN(Number(value)) ? 0 : Number(value);
    const encoding = encodeFloatMemory(numericValue, type.bits);

    return {
      type,
      normalizedValue: encoding.storedValue,
      displayValue: formatFloatText(encoding.storedValue),
      bytes: encoding.bytes,
      groupedBinary: encoding.groupedBinary,
    };
  }

  const numericValue = Number.isNaN(Number(value)) ? 0 : Number(value);
  const encoding = encodeIntegerMemory(numericValue, type.bits, type.signed);

  return {
    type,
    normalizedValue: encoding.normalizedValue,
    displayValue: formatValue(encoding.normalizedValue),
    bytes: encoding.bytes,
    groupedBinary: encoding.groupedBinary,
  };
}

export function buildVariableMemory(typeId, value, baseAddress = 0x5000) {
  const encoded = encodeValueForType(typeId, value);

  return {
    ...encoded,
    baseAddress,
    variableName: "dataValue",
    cells: encoded.bytes.map((byte, index) => ({
      address: baseAddress + index,
      hex: toHex(byte),
      note: index === 0 ? "lowest address" : "next byte",
    })),
  };
}

export function buildArrayMemory(typeId, values, baseAddress = 0x5200) {
  const type = getTypeById(typeId);
  const elements = values.map((value, index) => {
    const encoded = encodeValueForType(typeId, value);

    return {
      index,
      value: encoded.normalizedValue,
      displayValue: encoded.displayValue,
      bytes: encoded.bytes,
      startAddress: baseAddress + index * type.bytes,
    };
  });

  const cells = elements.flatMap((element) =>
    element.bytes.map((byte, byteIndex) => ({
      address: element.startAddress + byteIndex,
      hex: toHex(byte),
      group: element.index,
    }))
  );

  return {
    type,
    elements,
    cells,
    totalBytes: cells.length,
  };
}

export function packFlags(flags) {
  const byte = flags.reduce((sum, flag, index) => (flag ? sum | (1 << index) : sum), 0);
  const unpackedBytes = flags.length;

  return {
    byte,
    bytes: [byte],
    unpackedBytes,
    packedBytes: 1,
  };
}

export function buildPointerMemory(typeId, value) {
  const targetAddress = 0x6200;
  const pointerAddress = 0x6100;
  const target = encodeValueForType(typeId, value);
  const pointer = encodeIntegerMemory(targetAddress, 32, false);

  return {
    targetAddress,
    pointerAddress,
    target,
    pointer,
    dereferencedValue: target.displayValue,
    pointerCells: pointer.bytes.map((byte, index) => ({
      address: pointerAddress + index,
      hex: toHex(byte),
      note: index === 0 ? "address byte 0" : `address byte ${index}`,
    })),
    targetCells: target.bytes.map((byte, index) => ({
      address: targetAddress + index,
      hex: toHex(byte),
      note: index === 0 ? "target byte 0" : `target byte ${index}`,
    })),
  };
}

function clampFloatToRange(value, targetType) {
  if (targetType.family === "Floating point") {
    return Number.isNaN(Number(value)) ? 0 : Number(value);
  }

  return clampIntegerToType(Math.trunc(Number(value)), targetType.bits, targetType.signed);
}

export function castBetweenTypes(sourceTypeId, targetTypeId, inputValue) {
  const sourceType = getTypeById(sourceTypeId);
  const targetType = getTypeById(targetTypeId);
  const sourceEncoded = encodeValueForType(sourceTypeId, inputValue);

  let convertedValue = sourceEncoded.normalizedValue;
  let explanation = "";

  if (sourceType.family === "Floating point" && targetType.family === "Integer") {
    convertedValue = clampIntegerToType(Math.trunc(sourceEncoded.normalizedValue), targetType.bits, targetType.signed);
    explanation =
      "The fractional part is removed first, then the whole number is stored using the target integer size and signedness.";
  } else if (sourceType.family === "Integer" && targetType.family === "Floating point") {
    convertedValue = Number(sourceEncoded.normalizedValue);
    explanation =
      "The whole number is converted into IEEE 754 form, so the CPU stores sign, exponent and fraction fields instead of plain magnitude bits.";
  } else if (sourceType.family === "Integer" && targetType.family === "Integer") {
    convertedValue = clampIntegerToType(sourceEncoded.normalizedValue, targetType.bits, targetType.signed);
    explanation =
      "The numeric value stays a whole number, but it is re-stored using the target type's size and signedness.";
  } else {
    convertedValue = clampFloatToRange(sourceEncoded.normalizedValue, targetType);
    explanation =
      "The value stays floating point, but it is re-encoded using the target float format, which can change precision.";
  }

  const targetEncoded = encodeValueForType(targetTypeId, convertedValue);

  return {
    sourceType,
    targetType,
    sourceEncoded,
    targetEncoded,
    explanation,
  };
}

export function typeRangeText(typeId) {
  const type = getTypeById(typeId);

  if (!type) {
    return "";
  }

  if (type.family === "Floating point") {
    return `${type.bits}-bit IEEE 754`;
  }

  const range = rangeForBits(type.bits, type.signed);
  return `${formatValue(range.min)} to ${formatValue(range.max)}`;
}

export function formatPointerExpression(pointerName, value) {
  return `${pointerName} -> ${formatAddress(0x6200)} -> ${value}`;
}

function formatFloatText(value) {
  if (Number.isNaN(value)) {
    return "NaN";
  }

  if (!Number.isFinite(value)) {
    return value > 0 ? "+Infinity" : "-Infinity";
  }

  return Number(value.toPrecision(7)).toString();
}
