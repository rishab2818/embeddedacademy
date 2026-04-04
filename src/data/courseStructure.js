export const phaseMeta = {
  foundations: {
    label: "Core foundations",
    shortLabel: "Foundations",
    blurb: "Bits, memory, data types, pointers, and the embedded programming baseline.",
  },
  systems: {
    label: "System flow",
    shortLabel: "System flow",
    blurb: "Buses, timing, code translation, flash, RAM, and runtime execution.",
  },
  revision: {
    label: "Revision by reasoning",
    shortLabel: "Revision",
    blurb: "Mission-style practice that checks causal thinking instead of memorized definitions.",
  },
};

export const courseChapters = [
  {
    id: "chapter-1",
    number: "1",
    slug: "bits-and-signedness",
    title: "Bits and Signedness",
    chapterLabel: "Chapter 1",
    phase: "foundations",
    componentKey: "chapterOne",
    summary:
      "How computers represent values using bits, MOSFET logic, decimal/binary/hex notation, and signed vs unsigned bytes.",
    sections: [
      { id: "chapter-1-widths", label: "1.1 Bit widths" },
      { id: "chapter-1-switch", label: "1.2 MOSFET switch" },
      { id: "chapter-1-representation", label: "1.3 Number representation" },
      { id: "chapter-1-signedness", label: "1.4 Signedness" },
    ],
  },
  {
    id: "chapter-2",
    number: "2",
    slug: "memory-and-addressing",
    title: "Memory and Addressing",
    chapterLabel: "Chapter 2",
    phase: "foundations",
    componentKey: "chapterTwo",
    summary:
      "What 8-bit and 32-bit systems look like, what memory is, what an address means, and how values live in memory.",
    sections: [
      { id: "chapter-2-systems", label: "2.1 System width" },
      { id: "chapter-2-memory", label: "2.2 Memory blocks" },
      { id: "chapter-2-addresses", label: "2.3 Address vs value" },
    ],
  },
  {
    id: "chapter-3",
    number: "3",
    slug: "basic-data-types",
    title: "Data Types",
    chapterLabel: "Chapter 3",
    phase: "foundations",
    componentKey: "chapterThree",
    summary:
      "Signed and unsigned integer types, float16, float32, IEEE 754 fields, and how all of them occupy memory.",
    sections: [
      { id: "chapter-3-overview", label: "3.1 Type map" },
      { id: "chapter-3-integers", label: "3.2 Integer memory" },
      { id: "chapter-3-floating", label: "3.3 IEEE 754 floats" },
    ],
  },
  {
    id: "chapter-4",
    number: "4",
    slug: "variables-arrays-pointers",
    title: "Variables and Pointers",
    chapterLabel: "Chapter 4",
    phase: "foundations",
    componentKey: "chapterFour",
    summary:
      "How names map to memory, how arrays stay contiguous, how pointers store addresses, and what typecasting changes.",
    sections: [
      { id: "chapter-4-variables", label: "4.1 Variables" },
      { id: "chapter-4-arrays", label: "4.2 Arrays and packing" },
      { id: "chapter-4-pointers", label: "4.3 Pointers" },
      { id: "chapter-4-casting", label: "4.4 Typecasting" },
    ],
  },
  {
    id: "chapter-5",
    number: "5",
    slug: "embedded-input-flow",
    title: "Embedded Flow",
    chapterLabel: "Chapter 5",
    phase: "foundations",
    componentKey: "chapterFive",
    summary:
      "Three simple embedded loops that show data coming into memory and causing output actions.",
    sections: [
      { id: "chapter-5-pressure", label: "5.1 Sensor to LED" },
      { id: "chapter-5-signals", label: "5.2 Signal events" },
      { id: "chapter-5-protocol", label: "5.3 Protocol stream" },
    ],
  },
  {
    id: "chapter-6",
    number: "6",
    slug: "what-is-embedded-programming",
    title: "Embedded Basics",
    chapterLabel: "Chapter 6",
    phase: "foundations",
    componentKey: "chapterSix",
    summary:
      "The big picture of embedded programming, real-time deadlines, microcontrollers, microprocessors, and compilers.",
    sections: [
      { id: "chapter-6-meaning", label: "6.1 Big picture" },
      { id: "chapter-6-timing", label: "6.2 Timing" },
      { id: "chapter-6-systems", label: "6.3 MCU vs MPU" },
      { id: "chapter-6-compiler", label: "6.4 Code to machine" },
    ],
  },
  {
    id: "chapter-7",
    number: "7",
    slug: "serial-and-parallel-bus-fundamentals",
    title: "Bus Flow",
    chapterLabel: "Chapter 7",
    phase: "systems",
    componentKey: "chapterEight",
    summary:
      "Learn how char, int, and float values become bytes, flow through registers and buses, land in memory, and connect to MOSFET-driven voltage in practical hardware.",
    sections: [
      { id: "chapter-7-buses", label: "7.1 Bus models" },
      { id: "chapter-7-types", label: "7.2 Typed value encoding" },
      { id: "chapter-7-journey", label: "7.3 Register to voltage flow" },
      { id: "chapter-7-tradeoffs", label: "7.4 Tradeoffs" },
    ],
  },
  {
    id: "chapter-8",
    number: "8",
    slug: "game-revision-1-signal-rescue",
    title: "Signal Rescue",
    chapterLabel: "Chapter 8",
    phase: "revision",
    componentKey: "chapterNine",
    summary:
      "Play through interactive embedded rescue missions that force you to reason through bits, memory, floats, pointers, bus flow, and real-time design instead of memorizing definitions.",
    sections: [
      { id: "chapter-8-guide", label: "8.1 Field guide" },
      { id: "chapter-8-game", label: "8.2 Revision arena" },
      { id: "chapter-8-outcomes", label: "8.3 Mastery review" },
    ],
  },
  {
    id: "chapter-9",
    number: "9",
    slug: "microcontroller-clocks-and-timing",
    title: "Clocks and Timing",
    chapterLabel: "Chapter 9",
    phase: "systems",
    componentKey: "chapterTen",
    summary:
      "Learn what the clock really is, how PIC16 and STM32F1 configure it, and how timed beats let instructions, buses, memory, inputs, and outputs turn software into real hardware action.",
    sections: [
      { id: "chapter-9-heartbeat", label: "9.1 Heartbeat analogy" },
      { id: "chapter-9-anatomy", label: "9.2 Clock anatomy" },
      { id: "chapter-9-pic16", label: "9.3 PIC16 clock setup" },
      { id: "chapter-9-stm32f1", label: "9.4 STM32F1 clock setup" },
      { id: "chapter-9-data-flow", label: "9.5 Timed data flow" },
    ],
  },
  {
    id: "chapter-10",
    number: "10",
    slug: "english-to-code-assembly-machine-code",
    title: "Code to Machine",
    chapterLabel: "Chapter 10",
    phase: "systems",
    componentKey: "chapterEleven",
    summary:
      "Start with bitwise operations, build one small C program with globals and locals, then translate the same logic into assembly and machine code with interactive animations.",
    sections: [
      { id: "chapter-10-bitwise", label: "10.1 Bitwise operations" },
      { id: "chapter-10-code", label: "10.2 Real code walkthrough" },
      { id: "chapter-10-assembly", label: "10.3 Assembly translation" },
      { id: "chapter-10-machine-code", label: "10.4 Machine code decoding" },
      { id: "chapter-10-cycle", label: "10.5 Full cycle" },
    ],
  },
  {
    id: "chapter-11",
    number: "11",
    slug: "address-bus-data-bus-and-compilation",
    title: "Buses and Compilation",
    chapterLabel: "Chapter 11",
    phase: "systems",
    componentKey: "chapterTwelve",
    summary:
      "Understand address buses, data buses, 8-bit vs 16-bit vs 32-bit controllers, PIC vs STM bus styles, compilation stages, and why machines finally use binary.",
    sections: [
      { id: "chapter-11-widths", label: "11.1 Bit width" },
      { id: "chapter-11-buses", label: "11.2 Address and data buses" },
      { id: "chapter-11-pic-stm", label: "11.3 PIC and STM" },
      { id: "chapter-11-compilation", label: "11.4 Compilation" },
      { id: "chapter-11-binary", label: "11.5 Why binary" },
    ],
  },
  {
    id: "chapter-12",
    number: "12",
    slug: "flash-ram-and-execution",
    title: "Flash and Execution",
    chapterLabel: "Chapter 12",
    phase: "systems",
    componentKey: "chapterThirteen",
    summary:
      "Learn how machine code sits in flash, how RAM stores changing state, how the clocked CPU fetches and executes instructions, and how inputs and outputs really move through the microcontroller.",
    sections: [
      { id: "chapter-12-placement", label: "12.1 Flash and RAM placement" },
      { id: "chapter-12-engine", label: "12.2 CPU data flow" },
      { id: "chapter-12-units", label: "12.3 CPU units" },
      { id: "chapter-12-cycle", label: "12.4 Fetch-decode-execute" },
      { id: "chapter-12-recap", label: "12.5 Full memory context" },
    ],
  },
  {
    id: "chapter-14",
    number: "14",
    slug: "runtime-rescue",
    title: "Runtime Rescue",
    chapterLabel: "Chapter 14",
    phase: "revision",
    componentKey: "chapterFourteen",
    summary:
      "Play through deeper system-debugging missions that connect clocks, buses, compilation, flash, RAM, fetch-decode-execute, and GPIO behavior into one picture.",
    sections: [
      { id: "chapter-14-guide", label: "14.1 Field guide" },
      { id: "chapter-14-game", label: "14.2 Revision arena" },
      { id: "chapter-14-outcomes", label: "14.3 Mastery review" },
    ],
  },
  {
    id: "chapter-15",
    number: "15",
    slug: "von-neumann-and-harvard-architecture",
    title: "Von Neumann and Harvard",
    chapterLabel: "Chapter 15",
    phase: "systems",
    componentKey: "chapterSeven",
    summary:
      "Learn how Von Neumann, Harvard, and modified-Harvard machines organize instruction and data flow, why that changes bottlenecks and determinism, and how to choose the right architecture for real products.",
    sections: [
      { id: "chapter-15-why", label: "15.1 Why architecture matters" },
      { id: "chapter-15-von-neumann", label: "15.2 Von Neumann in motion" },
      { id: "chapter-15-harvard", label: "15.3 Harvard in motion" },
      { id: "chapter-15-tradeoffs", label: "15.4 Tradeoffs and hybrids" },
      { id: "chapter-15-quiz", label: "15.5 Architecture decision lab" },
    ],
  },
  {
    id: "chapter-16",
    number: "16",
    slug: "microcontroller-core-and-peripherals",
    title: "Inside a Microcontroller",
    chapterLabel: "Chapter 16",
    phase: "systems",
    componentKey: "chapterFifteen",
    summary:
      "Map the CPU, clocks, flash, RAM, buses, GPIO, timers, ADC, DAC, DMA, cache, and communication peripherals, then watch sensors and actuators flow through one complete microcontroller system movie.",
    sections: [
      { id: "chapter-16-atlas", label: "16.1 System atlas" },
      { id: "chapter-16-gpio", label: "16.2 GPIO and pins" },
      { id: "chapter-16-comms", label: "16.3 Communication peripherals" },
      { id: "chapter-16-analog", label: "16.4 Analog and timed peripherals" },
      { id: "chapter-16-buses", label: "16.5 Bus and memory traffic" },
      { id: "chapter-16-system-movie", label: "16.6 Whole-system movie" },
      { id: "chapter-16-playbook", label: "16.7 Peripheral playbook" },
    ],
  },
];

export const flatLessons = courseChapters.map((chapter, index) => ({
  ...chapter,
  previousSlug: index > 0 ? courseChapters[index - 1].slug : null,
  nextSlug: index < courseChapters.length - 1 ? courseChapters[index + 1].slug : null,
}));

export function findLessonBySlug(slug) {
  return flatLessons.find((chapter) => chapter.slug === slug);
}
