import {
  assemblyGlossary,
  bitwiseOperators,
  bitwiseTypes,
  codeFocuses,
  cycleStages,
  modeCodeOptions,
} from "../data/chapterEleven";

const MEMORY_MAP = {
  g_totalCycles: 0x120,
  g_systemEnabled: 0x121,
  g_modeCode: 0x122,
  g_lastResult: 0x124,
};

const OPCODES = {
  LOAD: 0x10,
  LOADB: 0x11,
  STORE: 0x12,
  ADD: 0x20,
  SUB: 0x21,
  MUL: 0x22,
  DIV: 0x23,
  ANDI: 0x30,
  OR: 0x31,
  XOR: 0x32,
  SHL: 0x33,
  CMP: 0x40,
  BEQ: 0x41,
  MOV: 0x50,
  MOVI: 0x51,
  RET: 0xff,
};

const REGISTER_MAP = Object.fromEntries(Array.from({ length: 16 }, (_, index) => [`r${index}`, index]));

export function getBitwiseType(typeId) {
  return bitwiseTypes.find((item) => item.id === typeId) ?? bitwiseTypes[0];
}

export function getBitwiseOperator(operatorId) {
  return bitwiseOperators.find((item) => item.id === operatorId) ?? bitwiseOperators[0];
}

export function clampToTypeRange(typeId, value) {
  const type = getBitwiseType(typeId);
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : type.min;
  return Math.min(type.max, Math.max(type.min, Math.trunc(numericValue)));
}

export function buildBitwiseScene({ typeId, operatorId, leftValue, rightValue }) {
  const type = getBitwiseType(typeId);
  const operator = getBitwiseOperator(operatorId);
  const width = type.width;
  const left = clampToTypeRange(typeId, leftValue);
  const rightBase = operator.needsRightOperand ? clampToTypeRange(typeId, rightValue) : 0;
  const shiftAmount = Math.max(0, Math.min(7, Math.abs(rightBase)));

  const leftStored = encodeStoredValue(left, width, type.kind === "signed");
  const rightStored = encodeStoredValue(rightBase, width, type.kind === "signed");

  let resultStored = leftStored;

  switch (operator.id) {
    case "and":
      resultStored = leftStored & rightStored;
      break;
    case "or":
      resultStored = leftStored | rightStored;
      break;
    case "xor":
      resultStored = leftStored ^ rightStored;
      break;
    case "not":
      resultStored = maskForWidth(width) & ~leftStored;
      break;
    case "lshift":
      resultStored = maskForWidth(width) & (leftStored << BigInt(shiftAmount));
      break;
    case "rshift":
      resultStored = (leftStored >> BigInt(shiftAmount)) & maskForWidth(width);
      break;
    default:
      break;
  }

  const leftBits = buildBitCells(leftStored, width);
  const rightBits = buildBitCells(rightStored, width);
  const resultBits = buildBitCells(resultStored, width, {
    leftBits,
    rightBits,
  });

  const signed = type.kind === "signed";
  const resultValue = decodeStoredValue(resultStored, width, signed);

  return {
    type,
    operator,
    width,
    leftValue: left,
    rightValue: rightBase,
    shiftAmount,
    leftStored,
    rightStored,
    resultStored,
    leftBits,
    rightBits,
    resultBits,
    resultValue,
    leftLabel: formatTypedValue(type.id, leftStored, left),
    rightLabel: formatTypedValue(type.id, rightStored, rightBase),
    resultLabel: formatTypedValue(type.id, resultStored, resultValue),
    leftHex: formatHex(leftStored, width),
    rightHex: formatHex(rightStored, width),
    resultHex: formatHex(resultStored, width),
    explanation: buildBitwiseExplanation({
      type,
      operator,
      left,
      right: rightBase,
      shiftAmount,
      resultValue,
    }),
  };
}

export function getCodeLines() {
  return [
    "#include <stdbool.h>",
    "#include <stdint.h>",
    "",
    "int32_t g_totalCycles = 120;",
    "bool g_systemEnabled = true;",
    "char g_modeCode = 'A';",
    "int32_t g_lastResult = 0;",
    "",
    "int32_t run_demo(int16_t sensorA, int16_t sensorB) {",
    "  int32_t sum = sensorA + sensorB;",
    "  int32_t difference = sensorA - sensorB;",
    "  int32_t product = sensorA * sensorB;",
    "  int32_t quotient = (sensorB != 0) ? (sensorA / sensorB) : 0;",
    "  int32_t masked = sum & 0x0F;",
    "  int32_t shifted = masked << 1;",
    "  int32_t modeBoost = g_modeCode & 0x0F;",
    "  int32_t combined = (shifted | difference) ^ product;",
    "  int32_t result = g_systemEnabled ? (combined + quotient + g_totalCycles + modeBoost) : 0;",
    "  g_lastResult = result;",
    "  return result;",
    "}",
  ];
}

export function buildProgramState({ sensorA, sensorB, totalCycles, systemEnabled, modeCode }) {
  const safeSensorA = Math.trunc(sensorA);
  const safeSensorB = Math.trunc(sensorB);
  const safeTotalCycles = Math.trunc(totalCycles);
  const chosenMode = modeCodeOptions.includes(modeCode) ? modeCode : modeCodeOptions[0];
  const modeAscii = chosenMode.charCodeAt(0);
  const sum = safeSensorA + safeSensorB;
  const difference = safeSensorA - safeSensorB;
  const product = safeSensorA * safeSensorB;
  const quotient = safeSensorB === 0 ? 0 : Math.trunc(safeSensorA / safeSensorB);
  const masked = sum & 0x0f;
  const shifted = masked << 1;
  const modeBoost = modeAscii & 0x0f;
  const combined = (shifted | difference) ^ product;
  const result = systemEnabled ? combined + quotient + safeTotalCycles + modeBoost : 0;

  return {
    sensorA: safeSensorA,
    sensorB: safeSensorB,
    totalCycles: safeTotalCycles,
    systemEnabled: Boolean(systemEnabled),
    modeCode: chosenMode,
    modeAscii,
    sum,
    difference,
    product,
    quotient,
    masked,
    shifted,
    modeBoost,
    combined,
    result,
    globals: {
      g_totalCycles: safeTotalCycles,
      g_systemEnabled: Boolean(systemEnabled),
      g_modeCode: chosenMode,
      g_lastResult: result,
    },
    locals: {
      sensorA: safeSensorA,
      sensorB: safeSensorB,
      sum,
      difference,
      product,
      quotient,
      masked,
      shifted,
      modeBoost,
      combined,
      result,
    },
  };
}

export function describeCodeFocus(focusId, programState) {
  const focus = codeFocuses.find((item) => item.id === focusId) ?? codeFocuses[0];

  const metric = (() => {
    switch (focus.id) {
      case "globals":
        return `g_totalCycles=${programState.totalCycles}, g_systemEnabled=${programState.systemEnabled}, g_modeCode='${programState.modeCode}', g_lastResult=${programState.result}`;
      case "locals":
        return `sum=${programState.sum}, difference=${programState.difference}, product=${programState.product}, quotient=${programState.quotient}`;
      case "add":
        return `${programState.sensorA} + ${programState.sensorB} = ${programState.sum}`;
      case "subtract":
        return `${programState.sensorA} - ${programState.sensorB} = ${programState.difference}`;
      case "multiply":
        return `${programState.sensorA} * ${programState.sensorB} = ${programState.product}`;
      case "divide":
        return programState.sensorB === 0
          ? "sensorB is 0, so quotient safely becomes 0"
          : `${programState.sensorA} / ${programState.sensorB} = ${programState.quotient}`;
      case "bitwise":
        return `masked=${programState.masked}, shifted=${programState.shifted}, modeBoost=${programState.modeBoost}, combined=${programState.combined}`;
      case "return":
        return `result=${programState.result}, g_lastResult=${programState.result}`;
      default:
        return "";
    }
  })();

  return {
    ...focus,
    metric,
  };
}

export function buildAssemblyInstructions(programState) {
  const instructions = [
    createInstruction({
      id: "load-cycles",
      asm: "LOAD r4, [g_totalCycles]",
      opcode: "LOAD",
      dest: "r4",
      extra: MEMORY_MAP.g_totalCycles,
      category: "load",
      source: "Read the global cycle budget from memory.",
      explain: `r4 now holds ${programState.totalCycles}, copied from global memory.`,
      result: `r4 = ${programState.totalCycles}`,
      executed: true,
    }),
    createInstruction({
      id: "load-enabled",
      asm: "LOADB r5, [g_systemEnabled]",
      opcode: "LOADB",
      dest: "r5",
      extra: MEMORY_MAP.g_systemEnabled,
      category: "load",
      source: "Read the global boolean flag from memory.",
      explain: `r5 receives ${programState.systemEnabled ? 1 : 0}. That is how the CPU sees true or false at the bit level.`,
      result: `r5 = ${programState.systemEnabled ? 1 : 0}`,
      executed: true,
    }),
    createInstruction({
      id: "load-mode",
      asm: "LOADB r6, [g_modeCode]",
      opcode: "LOADB",
      dest: "r6",
      extra: MEMORY_MAP.g_modeCode,
      category: "load",
      source: "Read the global char from memory.",
      explain: `r6 receives ASCII ${programState.modeAscii}, which is the stored form of '${programState.modeCode}'.`,
      result: `r6 = ${programState.modeAscii}`,
      executed: true,
    }),
    createInstruction({
      id: "add-sum",
      asm: "ADD r7, r1, r2",
      opcode: "ADD",
      dest: "r7",
      srcA: "r1",
      srcB: "r2",
      category: "alu",
      source: "sum = sensorA + sensorB",
      explain: `The ALU adds the function inputs and places ${programState.sum} into r7.`,
      result: `r7 = ${programState.sum}`,
      executed: true,
    }),
    createInstruction({
      id: "sub-difference",
      asm: "SUB r8, r1, r2",
      opcode: "SUB",
      dest: "r8",
      srcA: "r1",
      srcB: "r2",
      category: "alu",
      source: "difference = sensorA - sensorB",
      explain: `Subtraction leaves ${programState.difference} in r8.`,
      result: `r8 = ${programState.difference}`,
      executed: true,
    }),
    createInstruction({
      id: "mul-product",
      asm: "MUL r9, r1, r2",
      opcode: "MUL",
      dest: "r9",
      srcA: "r1",
      srcB: "r2",
      category: "alu",
      source: "product = sensorA * sensorB",
      explain: `Multiplication scales the inputs into ${programState.product}.`,
      result: `r9 = ${programState.product}`,
      executed: true,
    }),
    createInstruction({
      id: "div-quotient",
      asm: "DIV r10, r1, r2",
      opcode: "DIV",
      dest: "r10",
      srcA: "r1",
      srcB: "r2",
      category: "alu",
      source: "quotient = (sensorB != 0) ? (sensorA / sensorB) : 0",
      explain:
        programState.sensorB === 0
          ? "Our teaching ISA shows the divide step, but the high-level code guards against zero first and uses 0 as the safe quotient."
          : `Division truncates toward zero and produces ${programState.quotient}.`,
      result: `r10 = ${programState.quotient}`,
      executed: programState.sensorB !== 0,
    }),
    createInstruction({
      id: "andi-mask",
      asm: "ANDI r11, r7, #0x0F",
      opcode: "ANDI",
      dest: "r11",
      srcA: "r7",
      extra: 0x00f,
      category: "alu",
      source: "masked = sum & 0x0F",
      explain: `The mask keeps only the lowest four bits, giving ${programState.masked}.`,
      result: `r11 = ${programState.masked}`,
      executed: true,
    }),
    createInstruction({
      id: "shift-left",
      asm: "SHL r11, r11, #1",
      opcode: "SHL",
      dest: "r11",
      srcA: "r11",
      extra: 0x001,
      category: "alu",
      source: "shifted = masked << 1",
      explain: `A left shift moves the stored bits left by one place, turning ${programState.masked} into ${programState.shifted}.`,
      result: `r11 = ${programState.shifted}`,
      executed: true,
    }),
    createInstruction({
      id: "mode-mask",
      asm: "ANDI r12, r6, #0x0F",
      opcode: "ANDI",
      dest: "r12",
      srcA: "r6",
      extra: 0x00f,
      category: "alu",
      source: "modeBoost = g_modeCode & 0x0F",
      explain: `The char '${programState.modeCode}' becomes a small numeric boost of ${programState.modeBoost}.`,
      result: `r12 = ${programState.modeBoost}`,
      executed: true,
    }),
    createInstruction({
      id: "or-combine",
      asm: "OR r13, r11, r8",
      opcode: "OR",
      dest: "r13",
      srcA: "r11",
      srcB: "r8",
      category: "alu",
      source: "part of combined = (shifted | difference) ^ product",
      explain: `OR merges the shifted mask and difference before XOR runs.`,
      result: `r13 = ${programState.shifted | programState.difference}`,
      executed: true,
    }),
    createInstruction({
      id: "xor-combine",
      asm: "XOR r13, r13, r9",
      opcode: "XOR",
      dest: "r13",
      srcA: "r13",
      srcB: "r9",
      category: "alu",
      source: "combined = (shifted | difference) ^ product",
      explain: `XOR highlights where the merged value and product differ, leaving ${programState.combined}.`,
      result: `r13 = ${programState.combined}`,
      executed: true,
    }),
    createInstruction({
      id: "cmp-enabled",
      asm: "CMP r5, #0",
      opcode: "CMP",
      srcA: "r5",
      category: "branch",
      source: "Check whether g_systemEnabled is false.",
      explain: `The CPU compares r5 with zero. If the flag equals 0, the next branch jumps to the zero-output path.`,
      result: `compare ${programState.systemEnabled ? 1 : 0} with 0`,
      executed: true,
    }),
    createInstruction({
      id: "branch-zero",
      asm: "BEQ zero_out",
      opcode: "BEQ",
      extra: 0x015,
      category: "branch",
      source: "Jump if the system is disabled.",
      explain: programState.systemEnabled
        ? "The branch is not taken, so execution continues into the normal arithmetic path."
        : "The branch is taken, so the CPU skips the add-and-store path and jumps straight to zero_out.",
      result: programState.systemEnabled ? "branch not taken" : "branch taken",
      executed: true,
    }),
    createInstruction({
      id: "add-quotient",
      asm: "ADD r14, r13, r10",
      opcode: "ADD",
      dest: "r14",
      srcA: "r13",
      srcB: "r10",
      category: "alu",
      source: "Start building result from combined + quotient",
      explain: `The first accumulation step produces ${programState.combined + programState.quotient}.`,
      result: `r14 = ${programState.combined + programState.quotient}`,
      executed: programState.systemEnabled,
    }),
    createInstruction({
      id: "add-cycles",
      asm: "ADD r14, r14, r4",
      opcode: "ADD",
      dest: "r14",
      srcA: "r14",
      srcB: "r4",
      category: "alu",
      source: "Add the global cycle budget",
      explain: `Adding g_totalCycles moves the running result to ${programState.combined + programState.quotient + programState.totalCycles}.`,
      result: `r14 = ${programState.combined + programState.quotient + programState.totalCycles}`,
      executed: programState.systemEnabled,
    }),
    createInstruction({
      id: "add-mode",
      asm: "ADD r14, r14, r12",
      opcode: "ADD",
      dest: "r14",
      srcA: "r14",
      srcB: "r12",
      category: "alu",
      source: "Add the masked char contribution",
      explain: `The final enabled-path result becomes ${programState.result}.`,
      result: `r14 = ${programState.result}`,
      executed: programState.systemEnabled,
    }),
    createInstruction({
      id: "store-result",
      asm: "STORE [g_lastResult], r14",
      opcode: "STORE",
      srcA: "r14",
      extra: MEMORY_MAP.g_lastResult,
      category: "store",
      source: "g_lastResult = result",
      explain: `Store copies r14 back into global memory so other code can read the latest output.`,
      result: `memory[g_lastResult] = ${programState.result}`,
      executed: programState.systemEnabled,
    }),
    createInstruction({
      id: "move-return",
      asm: "MOV r0, r14",
      opcode: "MOV",
      dest: "r0",
      srcA: "r14",
      category: "return",
      source: "Prepare the return register",
      explain: `Many calling conventions use r0 for the return value. Here r0 receives ${programState.result}.`,
      result: `r0 = ${programState.result}`,
      executed: programState.systemEnabled,
    }),
    createInstruction({
      id: "ret-enabled",
      asm: "RET",
      opcode: "RET",
      category: "return",
      source: "Leave the function",
      explain: "RET sends control back to the caller. The caller now sees the result in the return register.",
      result: "return to caller",
      executed: programState.systemEnabled,
    }),
    createInstruction({
      id: "zero-out",
      asm: "MOVI r0, #0",
      opcode: "MOVI",
      dest: "r0",
      extra: 0x000,
      category: "branch",
      source: "zero_out: disabled path forces the answer to 0",
      explain: "When the branch is taken, the CPU loads 0 into the return register instead of using the computed value.",
      result: "r0 = 0",
      executed: !programState.systemEnabled,
    }),
    createInstruction({
      id: "store-zero",
      asm: "STORE [g_lastResult], r0",
      opcode: "STORE",
      srcA: "r0",
      extra: MEMORY_MAP.g_lastResult,
      category: "store",
      source: "g_lastResult = 0 on the disabled path",
      explain: "Even the disabled path stores a result, so the global last-result variable stays consistent.",
      result: "memory[g_lastResult] = 0",
      executed: !programState.systemEnabled,
    }),
    createInstruction({
      id: "ret-disabled",
      asm: "RET",
      opcode: "RET",
      category: "return",
      source: "Leave the function from the disabled path",
      explain: "The caller receives 0 because the system flag was disabled.",
      result: "return to caller",
      executed: !programState.systemEnabled,
    }),
  ];

  return instructions.map((instruction) => ({
    ...instruction,
    glossary: assemblyGlossary[instruction.category],
    machine: encodeInstruction(instruction),
  }));
}

export function buildCycleCards(programState, instructions) {
  const codeLines = getCodeLines();
  const executedInstructions = instructions.filter((item) => item.executed);

  return cycleStages.map((stage) => {
    if (stage.id === "english") {
      return {
        ...stage,
        lines: [
          `1. Read two sensor values: ${programState.sensorA} and ${programState.sensorB}.`,
          `2. If the system flag is ${programState.systemEnabled ? "enabled" : "disabled"}, combine arithmetic and bitwise steps to compute an answer.`,
          `3. Use the global char '${programState.modeCode}' and cycle budget ${programState.totalCycles} as extra context.`,
          `4. Save the final answer in g_lastResult and return it to the caller.`,
        ],
      };
    }

    if (stage.id === "c") {
      return {
        ...stage,
        lines: codeLines.slice(8, 20),
      };
    }

    if (stage.id === "assembly") {
      return {
        ...stage,
        lines: executedInstructions.slice(0, 8).map((item) => item.asm),
      };
    }

    return {
      ...stage,
      lines: executedInstructions.slice(0, 6).map((item) => `${item.machine.hex}  ${item.asm}`),
    };
  });
}

function createInstruction(definition) {
  return {
    dest: null,
    srcA: null,
    srcB: null,
    extra: 0,
    ...definition,
  };
}

function encodeInstruction(instruction) {
  const opcode = BigInt(OPCODES[instruction.opcode] ?? 0);
  const dest = BigInt(REGISTER_MAP[instruction.dest] ?? 0);
  const srcA = BigInt(REGISTER_MAP[instruction.srcA] ?? 0);
  const srcB = BigInt(REGISTER_MAP[instruction.srcB] ?? 0);
  const extra = BigInt(instruction.extra ?? 0) & 0xfffn;

  const word = (opcode << 24n) | (dest << 20n) | (srcA << 16n) | (srcB << 12n) | extra;
  const hex = `0x${word.toString(16).toUpperCase().padStart(8, "0")}`;
  const binary = word.toString(2).padStart(32, "0");

  return {
    word,
    hex,
    bytes: chunkString(hex.slice(2), 2).join(" "),
    binary,
    groupedBinary: chunkString(binary, 4).join(" "),
    fields: [
      {
        id: "opcode",
        bits: binary.slice(0, 8),
        meaning: `${instruction.opcode} (${Number(opcode)})`,
      },
      {
        id: "dest",
        bits: binary.slice(8, 12),
        meaning: instruction.dest ?? "unused",
      },
      {
        id: "srcA",
        bits: binary.slice(12, 16),
        meaning: instruction.srcA ?? "unused",
      },
      {
        id: "srcB",
        bits: binary.slice(16, 20),
        meaning: instruction.srcB ?? "unused",
      },
      {
        id: "extra",
        bits: binary.slice(20),
        meaning: formatExtraMeaning(instruction),
      },
    ],
  };
}

function formatExtraMeaning(instruction) {
  if (instruction.opcode === "LOAD" || instruction.opcode === "LOADB" || instruction.opcode === "STORE") {
    const name = Object.entries(MEMORY_MAP).find(([, value]) => value === instruction.extra)?.[0] ?? "memory";
    return `${name} @ 0x${instruction.extra.toString(16).toUpperCase()}`;
  }

  if (instruction.opcode === "BEQ") {
    return "branch target zero_out";
  }

  if (instruction.opcode === "ANDI" || instruction.opcode === "SHL" || instruction.opcode === "MOVI" || instruction.opcode === "CMP") {
    return `immediate ${instruction.extra}`;
  }

  return instruction.extra ? `${instruction.extra}` : "not used";
}

function encodeStoredValue(value, width, signed) {
  const numeric = BigInt(Math.trunc(value));
  return signed ? BigInt.asUintN(width, numeric) : BigInt.asUintN(width, numeric);
}

function decodeStoredValue(storedValue, width, signed) {
  return Number(signed ? BigInt.asIntN(width, storedValue) : BigInt.asUintN(width, storedValue));
}

function buildBitCells(storedValue, width, inputs = {}) {
  const binary = storedValue.toString(2).padStart(width, "0");
  return binary.split("").map((bit, index) => {
    const bitIndex = width - 1 - index;
    const leftBit = inputs.leftBits?.[index]?.value;
    const rightBit = inputs.rightBits?.[index]?.value;
    const changed =
      typeof leftBit === "string" && typeof rightBit === "string"
        ? bit !== leftBit || bit !== rightBit
        : false;

    return {
      id: `${bitIndex}`,
      index,
      bitIndex,
      value: bit,
      changed,
    };
  });
}

function buildBitwiseExplanation({ type, operator, left, right, shiftAmount, resultValue }) {
  if (operator.id === "not") {
    return `On ${type.label}, NOT flips every stored bit. Starting from ${left}, the inverted stored pattern reads back as ${resultValue}.`;
  }

  if (operator.id === "lshift" || operator.id === "rshift") {
    return `${operator.label} moves the stored bit pattern by ${shiftAmount} place${shiftAmount === 1 ? "" : "s"}. The new interpreted value is ${resultValue}.`;
  }

  return `${left} ${operator.symbol} ${right} produces ${resultValue}. ${operator.summary}`;
}

function formatTypedValue(typeId, storedValue, numericValue) {
  if (typeId === "bool") {
    return numericValue ? "true (1)" : "false (0)";
  }

  if (typeId === "char") {
    const code = Number(BigInt.asUintN(8, storedValue));
    const printable = code >= 32 && code <= 126 ? `'${String.fromCharCode(code)}'` : "non-printable";
    return `${printable} / ${code}`;
  }

  return `${numericValue}`;
}

function formatHex(storedValue, width) {
  const digits = Math.ceil(width / 4);
  return `0x${storedValue.toString(16).toUpperCase().padStart(digits, "0")}`;
}

function maskForWidth(width) {
  return (1n << BigInt(width)) - 1n;
}

function chunkString(value, size) {
  const chunks = [];

  for (let index = 0; index < value.length; index += size) {
    chunks.push(value.slice(index, index + size));
  }

  return chunks;
}
