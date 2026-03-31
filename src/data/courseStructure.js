export const courseChapters = [
  {
    id: "chapter-1",
    number: "1",
    slug: "bits-and-signedness",
    title: "Bits, bytes and signedness",
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
    title: "Memory and addressing",
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
    title: "Basic data types",
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
    title: "Variables, arrays, pointers and casting",
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
    title: "Embedded input, memory and output flow",
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
    title: "What embedded programming is",
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
    title: "Serial and parallel bus data flow",
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
    title: "Game Revision 1: Signal Rescue",
    chapterLabel: "Chapter 8",
    componentKey: "chapterNine",
    summary:
      "Play through interactive embedded rescue missions that force you to reason through bits, memory, floats, pointers, bus flow, and real-time design instead of memorizing definitions.",
    sections: [{ id: "chapter-8-game", label: "8.1 Revision arena" }],
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
