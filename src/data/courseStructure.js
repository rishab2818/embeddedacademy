export const courseChapters = [
  {
    id: "chapter-0",
    number: "0",
    title: "Foundations of Embedded Systems",
    summary:
      "The first six lessons cover bits, memory, data types, pointers, data flow, and the basic idea of embedded systems.",
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
];

export const flatLessons = courseChapters.flatMap((chapter) =>
  chapter.lessons.map((lesson, index, lessons) => ({
    ...lesson,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    previousSlug: index > 0 ? lessons[index - 1].slug : null,
    nextSlug: index < lessons.length - 1 ? lessons[index + 1].slug : null,
  }))
);

export function findLessonBySlug(slug) {
  return flatLessons.find((lesson) => lesson.slug === slug);
}
