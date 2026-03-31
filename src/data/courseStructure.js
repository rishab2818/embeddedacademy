export const courseChapters = [
  {
    id: "chapter-0",
    number: "0",
    title: "Foundations of Embedded Systems",
    summary:
      "The first six lessons build the base: bits, memory, data types, pointers, data flow, and the big-picture meaning of embedded systems.",
    lessons: [
      {
        id: "0.1",
        slug: "bits-and-signedness",
        title: "Bits, bytes and signedness",
        chapterLabel: "Chapter 0.1",
        componentKey: "chapterOne",
        summary:
          "How computers represent values using bits, MOSFET logic, decimal/binary/hex notation, and signed vs unsigned bytes.",
        chatbotContext:
          "This lesson teaches bit widths, MOSFETs as switches, binary/hex notation, signed and unsigned numbers, and why a char is storage rather than only a printed character.",
      },
      {
        id: "0.2",
        slug: "memory-and-addressing",
        title: "Memory and addressing",
        chapterLabel: "Chapter 0.2",
        componentKey: "chapterTwo",
        summary:
          "What 8-bit and 32-bit systems look like, what memory is, what an address means, and how values live in memory.",
        chatbotContext:
          "This lesson explains memory as addressed byte locations, compares 8-bit and 32-bit systems, and teaches the difference between an address and the value stored there.",
      },
      {
        id: "0.3",
        slug: "basic-data-types",
        title: "Basic data types",
        chapterLabel: "Chapter 0.3",
        componentKey: "chapterThree",
        summary:
          "Signed and unsigned integer types, float16, float32, IEEE 754 fields, and how all of them occupy memory.",
        chatbotContext:
          "This lesson introduces novice learners to signed char, unsigned char, 16-bit and 32-bit signed and unsigned integers, float16, float32, and the basics of IEEE 754 memory layout.",
      },
      {
        id: "0.4",
        slug: "variables-arrays-pointers",
        title: "Variables, arrays, pointers and casting",
        chapterLabel: "Chapter 0.4",
        componentKey: "chapterFour",
        summary:
          "How names map to memory, how arrays stay contiguous, how pointers store addresses, and what typecasting changes.",
        chatbotContext:
          "This lesson covers variables, arrays, packed arrays, pointers, dereferencing, and beginner-friendly typecasting explanations tied to memory layout.",
      },
      {
        id: "0.5",
        slug: "embedded-input-flow",
        title: "Embedded input, memory and output flow",
        chapterLabel: "Chapter 0.5",
        componentKey: "chapterFive",
        summary:
          "Three simple embedded loops that show data coming into memory and causing output actions.",
        chatbotContext:
          "This lesson explains input to memory to action loops using a pressure sensor, signal events, and protocol data parsing in a beginner-friendly embedded context.",
      },
      {
        id: "0.6",
        slug: "what-is-embedded-programming",
        title: "What embedded programming is",
        chapterLabel: "Chapter 0.6",
        componentKey: "chapterSix",
        summary:
          "The big picture of embedded programming, real-time deadlines, microcontrollers, microprocessors, and compilers.",
        chatbotContext:
          "This lesson explains what embedded programming is, what time-bound or real-time systems are, how microcontrollers differ from microprocessors, and how code becomes machine instructions through a compiler.",
      },
    ],
  },
  {
    id: "chapter-1",
    number: "1",
    title: "Serial and Parallel Bus Fundamentals",
    summary:
      "A visual beginner chapter that explains how values become bytes, how serial and parallel buses move them, and how those bits relate to MOSFET switching and real voltage.",
    lessons: [
      {
        id: "1.1",
        slug: "serial-and-parallel-bus-fundamentals",
        title: "Serial and parallel bus data flow",
        chapterLabel: "Chapter 1.1",
        componentKey: "chapterEight",
        summary:
          "Learn how char, int, and float values become bytes, flow through registers and buses, land in memory, and connect to MOSFET-driven voltage in practical hardware.",
        chatbotContext:
          "This lesson explains serial and parallel buses in beginner-friendly language, including analogies, data type encoding, register-to-bus-to-memory flow, MOSFET switching, and the advantages and disadvantages of each bus style.",
      },
      {
        id: "1.2",
        slug: "game-revision-1-signal-rescue",
        title: "Game Revision 1: Signal Rescue",
        chapterLabel: "Chapter 1.2",
        componentKey: "chapterNine",
        summary:
          "Play through interactive embedded rescue missions that force you to reason through bits, memory, floats, pointers, bus flow, and real-time design instead of memorizing definitions.",
        chatbotContext:
          "This lesson is an interactive embedded revision game with mission-based questions and explanations covering bits, signedness, memory addressing, data types, IEEE 754 floats, pointers, typecasting, embedded input flow, real-time design, serial and parallel buses, and MOSFET-driven voltage control.",
      },
    ],
  },
  {
    id: "chapter-x",
    number: "X",
    title: "Programming GPIO on RO uController",
    summary:
      "A hands-on beginner chapter kept aside for future numbering. It still teaches GPIO on fake 16-bit and 32-bit controllers using memory-mapped registers, simple examples, and code translation down to machine code.",
    lessons: [
      {
        id: "x.1",
        slug: "programming-gpio-on-ro-ucontroller",
        title: "Programming GPIO on RO uController",
        chapterLabel: "Chapter X.1",
        componentKey: "chapterSeven",
        summary:
          "Learn GPIO with a simple flow: plain English, memory addresses, C, assembly, opcode, and machine code on 16-bit and 32-bit RO uControllers.",
        chatbotContext:
          "This lesson teaches complete beginners how GPIO works on fake 16-bit and 32-bit RO uControllers, including input and output pins, memory-mapped DIR DATA and INPUT registers, simple C code, assembly, opcodes, machine code, and advanced C views like bitfields packed structs and unions.",
      },
    ],
  },
];

const lessonSequence = courseChapters.flatMap((chapter) =>
  chapter.lessons.map((lesson) => ({
    ...lesson,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
  }))
);

export const flatLessons = lessonSequence.map((lesson, index) => ({
  ...lesson,
  previousSlug: index > 0 ? lessonSequence[index - 1].slug : null,
  nextSlug: index < lessonSequence.length - 1 ? lessonSequence[index + 1].slug : null,
}));

export function findLessonBySlug(slug) {
  return flatLessons.find((lesson) => lesson.slug === slug);
}
