export const integerTypes = [
  {
    id: "signed-char",
    label: "signed char",
    family: "Integer",
    bits: 8,
    bytes: 1,
    signed: true,
    summary: "Stores small whole numbers that can be positive or negative.",
    explain:
      "A signed char uses 8 bits. One bit participates in the sign through two's complement, so it can store values from -128 to 127.",
    example: -35,
  },
  {
    id: "unsigned-char",
    label: "unsigned char",
    family: "Integer",
    bits: 8,
    bytes: 1,
    signed: false,
    summary: "Stores one raw byte with no negative values.",
    explain:
      "An unsigned char uses all 8 bits for magnitude, so it stores values from 0 to 255. This is great for raw bytes, color values and registers.",
    example: 221,
  },
  {
    id: "signed-int16",
    label: "signed int16",
    family: "Integer",
    bits: 16,
    bytes: 2,
    signed: true,
    summary: "Stores 16-bit whole numbers with positive and negative values.",
    explain:
      "A signed 16-bit integer uses 2 bytes. In two's complement it stores values from -32,768 to 32,767.",
    example: -12345,
  },
  {
    id: "unsigned-int16",
    label: "unsigned int16",
    family: "Integer",
    bits: 16,
    bytes: 2,
    signed: false,
    summary: "Stores 16-bit whole numbers with no negative values.",
    explain:
      "An unsigned 16-bit integer uses all 16 bits for magnitude, so it stores values from 0 to 65,535.",
    example: 50000,
  },
  {
    id: "signed-int32",
    label: "signed int32",
    family: "Integer",
    bits: 32,
    bytes: 4,
    signed: true,
    summary: "Stores 32-bit whole numbers with a sign.",
    explain:
      "A signed 32-bit integer uses 4 bytes. It can represent very large positive and negative whole numbers.",
    example: -2000000000,
  },
  {
    id: "unsigned-int32",
    label: "unsigned int32",
    family: "Integer",
    bits: 32,
    bytes: 4,
    signed: false,
    summary: "Stores large 32-bit whole numbers with no negative values.",
    explain:
      "An unsigned 32-bit integer also uses 4 bytes, but all bits hold magnitude, so the range goes from 0 to 4,294,967,295.",
    example: 3000000000,
  },
];

export const floatTypes = [
  {
    id: "float16",
    label: "float16",
    family: "Floating point",
    bits: 16,
    bytes: 2,
    exponentBits: 5,
    fractionBits: 10,
    summary: "A compact floating-point format with limited precision.",
    explain:
      "A 16-bit float follows IEEE 754 with 1 sign bit, 5 exponent bits and 10 fraction bits. It saves memory, but it cannot keep as much precision as float32.",
    example: 3.25,
  },
  {
    id: "float32",
    label: "float32",
    family: "Floating point",
    bits: 32,
    bytes: 4,
    exponentBits: 8,
    fractionBits: 23,
    summary: "The common single-precision IEEE 754 floating-point format.",
    explain:
      "A 32-bit float uses 1 sign bit, 8 exponent bits and 23 fraction bits. It is the usual floating-point type on microcontrollers and desktop CPUs.",
    example: 3.25,
  },
];

export const allBasicTypes = [...integerTypes, ...floatTypes];
