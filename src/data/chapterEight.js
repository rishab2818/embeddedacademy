export const busModes = [
  {
    id: "serial",
    label: "Serial bus",
    headline: "One lane, many moments",
    analogy: "A single-lane bridge: one car crosses at a time, in a very clear order.",
    detail:
      "A serial bus reuses one data line again and again. Bits leave the sender one after another, so the wiring stays simple even when the message is long.",
    practical:
      "This is why protocols such as UART, SPI, I2C, USB, and CAN can move useful data with fewer wires.",
    lanes: "1 data lane reused repeatedly",
    flowLabel: "Bit after bit",
  },
  {
    id: "parallel",
    label: "Parallel bus",
    headline: "Many lanes, same moment",
    analogy: "A wide highway: many cars can move side by side at the same time.",
    detail:
      "A parallel bus uses several wires together. One byte can appear across eight lines at once because every line carries one bit in the same clock moment.",
    practical:
      "This is common inside chips and boards where the distance is short and the designer can afford more traces.",
    lanes: "8 data lanes in one beat",
    flowLabel: "Byte all at once",
  },
];

export const sampleTypeOptions = [
  {
    id: "char",
    label: "char",
    description: "1 byte. Great for letters, symbols, and tiny numeric values.",
    placeholder: "A or 65",
    defaultValue: "A",
    codeLabel: "char",
  },
  {
    id: "int16",
    label: "int16_t",
    description: "2 bytes. Small signed whole numbers.",
    placeholder: "300",
    defaultValue: "300",
    codeLabel: "int16_t",
  },
  {
    id: "int32",
    label: "int",
    description: "4 bytes in this lesson's 32-bit-style demo.",
    placeholder: "1024",
    defaultValue: "1024",
    codeLabel: "int",
  },
  {
    id: "float32",
    label: "float",
    description: "4 bytes. Fractional values stored using IEEE 754.",
    placeholder: "3.5",
    defaultValue: "3.5",
    codeLabel: "float",
  },
];

export const busTradeoffs = [
  {
    title: "Wires and board complexity",
    serial:
      "Needs fewer wires, so connectors, PCB traces, and routing stay cheaper and simpler.",
    parallel:
      "Needs more wires, so routing gets wider and more expensive but each transfer can move more bits together.",
  },
  {
    title: "Speed over distance",
    serial:
      "Usually easier to keep clean over longer distances because there are fewer lines to match.",
    parallel:
      "Fast over short distances, but timing mismatch between many lines becomes harder as traces get longer.",
  },
  {
    title: "Debugging",
    serial:
      "One stream is easy to probe and log, but you must decode time order carefully.",
    parallel:
      "You can see many bits at once, but more wires means more places for timing trouble.",
  },
  {
    title: "Beginner mental model",
    serial:
      "Very intuitive if you imagine a queue: first bit, then second bit, then third bit.",
    parallel:
      "Very intuitive if you imagine a row of switches all changing together at once.",
  },
];

export const bridgeSteps = [
  {
    id: "software",
    label: "Software writes a value",
    detail: "A typed variable starts life as a number or character in source code.",
  },
  {
    id: "register",
    label: "CPU/register view",
    detail: "The CPU treats that value as raw bits grouped into bytes.",
  },
  {
    id: "bus",
    label: "Bus movement",
    detail: "Those bits become HIGH and LOW voltages moving across one lane or many lanes.",
  },
  {
    id: "memory",
    label: "Memory landing",
    detail: "The destination memory cells store the arriving byte pattern at named addresses.",
  },
  {
    id: "mosfet",
    label: "MOSFET switching",
    detail: "Transistors inside the chip store and steer those logic levels.",
  },
  {
    id: "voltage",
    label: "Practical electrical effect",
    detail: "A stored bit can later drive a GPIO pin, which can switch a MOSFET and control a real load.",
  },
];
