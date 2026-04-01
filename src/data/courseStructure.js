export const courseChapters = [
  {
    id: "chapter-1",
    number: "1",
    slug: "bits-and-signedness",
    title: "Bits and Signedness",
    chapterLabel: "Chapter 1",
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
    componentKey: "chapterNine",
    summary:
      "Play through interactive embedded rescue missions that force you to reason through bits, memory, floats, pointers, bus flow, and real-time design instead of memorizing definitions.",
    sections: [{ id: "chapter-8-game", label: "8.1 Revision arena" }],
  },
  {
    id: "chapter-9",
    number: "9",
    slug: "microcontroller-clocks-and-timing",
    title: "Clocks and Timing",
    chapterLabel: "Chapter 9",
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
    id: "chapter-13",
    number: "13",
    slug: "runtime-rescue",
    title: "Runtime Rescue",
    chapterLabel: "Chapter 13",
    componentKey: "chapterFourteen",
    summary:
      "Play through deeper system-debugging missions that connect clocks, buses, compilation, flash, RAM, fetch-decode-execute, and GPIO behavior into one picture.",
    sections: [{ id: "chapter-13-game", label: "13.1 Revision arena" }],
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
