export const bitwiseTypes = [
  {
    id: "bool",
    label: "Boolean",
    width: 8,
    kind: "unsigned",
    min: 0,
    max: 1,
    defaultLeft: 1,
    defaultRight: 0,
    intro:
      "A boolean is usually stored in a byte, but only the idea of 0 or 1 matters. Bitwise logic lets you test and combine those tiny true-or-false flags.",
    note: "We display the whole byte so you can see the stored bits, even though only 0 and 1 are meaningful boolean values.",
  },
  {
    id: "char",
    label: "Char",
    width: 8,
    kind: "unsigned",
    min: 32,
    max: 126,
    defaultLeft: 65,
    defaultRight: 32,
    intro:
      "A char is just an 8-bit number. We often read it as a letter, but the CPU still sees raw bits that can be masked, shifted, or combined.",
    note: "Printable ASCII makes the lesson easier because you can connect numbers, letters, and bits at the same time.",
  },
  {
    id: "int16",
    label: "int16",
    width: 16,
    kind: "signed",
    min: -255,
    max: 255,
    defaultLeft: 45,
    defaultRight: 12,
    intro:
      "A 16-bit integer gives the CPU more room for arithmetic, masks, and packed flags. Negative values are still stored as bit patterns using two's complement.",
    note: "The bit pattern is what the hardware manipulates first. Signed meaning is an interpretation laid on top of that stored pattern.",
  },
  {
    id: "int32",
    label: "int32",
    width: 32,
    kind: "signed",
    min: -1024,
    max: 1024,
    defaultLeft: 300,
    defaultRight: 21,
    intro:
      "A 32-bit integer is the kind of everyday workhorse type you see in a lot of C code, device drivers, counters, and computation.",
    note: "Large widths do not change the idea of bitwise logic. They simply give the same logic more places to work.",
  },
];

export const bitwiseOperators = [
  {
    id: "and",
    label: "AND",
    symbol: "&",
    needsRightOperand: true,
    summary: "Keeps a 1 only where both inputs already have 1.",
    analogy: "Two switches in series: current passes only when both are closed.",
  },
  {
    id: "or",
    label: "OR",
    symbol: "|",
    needsRightOperand: true,
    summary: "Keeps a 1 wherever either input has 1.",
    analogy: "Two alternate paths: if either path is open, the signal can still get through.",
  },
  {
    id: "xor",
    label: "XOR",
    symbol: "^",
    needsRightOperand: true,
    summary: "Shows 1 only where the two inputs differ.",
    analogy: "A change detector: matching bits cancel, different bits stand out.",
  },
  {
    id: "not",
    label: "NOT",
    symbol: "~",
    needsRightOperand: false,
    summary: "Flips every stored bit: 1 becomes 0, and 0 becomes 1.",
    analogy: "A full inversion filter that turns every yes into no and every no into yes.",
  },
  {
    id: "lshift",
    label: "Left Shift",
    symbol: "<<",
    needsRightOperand: true,
    summary: "Moves stored bits to the left and fills the empty places with 0.",
    analogy: "Like sliding all the tiles one seat left and opening new empty seats on the right.",
  },
  {
    id: "rshift",
    label: "Right Shift",
    symbol: ">>",
    needsRightOperand: true,
    summary: "Moves stored bits to the right and fills from the left with 0 in this teaching model.",
    analogy: "Like pushing a row of tiles to the right while new empty seats appear on the left.",
  },
];

export const modeCodeOptions = ["A", "B", "C", "D", "M", "Z"];

export const codeFocuses = [
  {
    id: "globals",
    label: "Global variables",
    title: "Global variables live outside the function",
    lines: [4, 5, 6, 7],
    detail:
      "These variables are created before the function runs, and the whole file can use them. They are useful for shared state, configuration, or last-known results.",
    metricLabel: "Global state right now",
  },
  {
    id: "locals",
    label: "Local variables",
    title: "Local variables are temporary working notes inside the function",
    lines: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    detail:
      "Every local variable belongs to this one function call. It is the program's scratch paper: useful while the function runs, then gone when the function returns.",
    metricLabel: "Temporary values right now",
  },
  {
    id: "add",
    label: "Addition",
    title: "Addition combines quantities",
    lines: [10, 18],
    detail:
      "Addition shows up both in normal arithmetic and in the final result path. The CPU treats it as a direct numeric operation on registers.",
    metricLabel: "Current add result",
  },
  {
    id: "subtract",
    label: "Subtraction",
    title: "Subtraction measures the gap between two inputs",
    lines: [11],
    detail:
      "Subtraction is often used for comparison, error calculation, and finding how far one value is from another.",
    metricLabel: "Current difference",
  },
  {
    id: "multiply",
    label: "Multiplication",
    title: "Multiplication scales values quickly",
    lines: [12],
    detail:
      "Multiplication makes changes grow much faster than addition. Embedded code uses it in scaling, filtering, geometry, and signal math.",
    metricLabel: "Current product",
  },
  {
    id: "divide",
    label: "Division",
    title: "Division needs care when zero is possible",
    lines: [13],
    detail:
      "The code protects itself from division by zero. If the divisor is zero, the function safely uses 0 instead of crashing or producing undefined behavior.",
    metricLabel: "Current quotient",
  },
  {
    id: "bitwise",
    label: "Bitwise logic",
    title: "Bitwise operations shape the raw stored pattern",
    lines: [14, 15, 16, 17],
    detail:
      "Masking, shifting, OR, and XOR are common when we need to isolate flags, pack fields, or combine low-level values in exact binary form.",
    metricLabel: "Current bitwise flow",
  },
  {
    id: "return",
    label: "Return path",
    title: "The function ends by storing and returning the result",
    lines: [18, 19, 20],
    detail:
      "One copy of the result is saved globally as the last output, and one copy is returned to whoever called the function.",
    metricLabel: "Final output",
  },
];

export const assemblyGlossary = {
  load: {
    title: "Load",
    body:
      "A load instruction copies data from memory into a register. Memory is large but slower to reach, so CPUs usually load values into registers before working on them.",
  },
  store: {
    title: "Store",
    body:
      "A store instruction copies data from a register back into memory. This is how a calculation becomes a saved variable, register write, or output value.",
  },
  alu: {
    title: "ALU operation",
    body:
      "ALU stands for Arithmetic Logic Unit. This is the part of the CPU that adds, subtracts, multiplies, divides, shifts, and performs bitwise logic.",
  },
  branch: {
    title: "Branch",
    body:
      "A branch changes the normal step-by-step flow of execution. The CPU checks a condition and jumps to a different instruction address if needed.",
  },
  return: {
    title: "Return",
    body:
      "Return means the function is finished. The CPU jumps back to the caller, usually with the answer placed in a return register.",
  },
};

export const machineFieldLabels = [
  { id: "opcode", label: "Opcode" },
  { id: "dest", label: "Destination" },
  { id: "srcA", label: "Source A" },
  { id: "srcB", label: "Source B" },
  { id: "extra", label: "Immediate / address" },
];

export const cycleStages = [
  {
    id: "english",
    label: "English requirement",
    summary: "A human describes the behavior in plain language.",
  },
  {
    id: "c",
    label: "C code",
    summary: "A programmer turns the requirement into named variables and operations.",
  },
  {
    id: "assembly",
    label: "Assembly",
    summary: "The same job is rewritten as register-level CPU instructions.",
  },
  {
    id: "machine",
    label: "Machine code",
    summary: "Each instruction becomes raw bits and bytes that the processor can fetch and execute.",
  },
];
