export const gpioTeachingControllers = [
  {
    id: "ro16",
    label: "RO uController 16",
    chapterLabel: "16-bit microcontroller",
    wordBits: 16,
    registerType: "uint16_t",
    registerDigits: 4,
    pinCount: 8,
    pinPrefix: "P",
    addresses: {
      dir: 0x9000,
      data: 0x9002,
      input: 0x9004,
    },
    summary:
      "This controller likes 16-bit words. We will control 8 GPIO pins with three simple memory locations: direction, data, and input.",
    analogy:
      "Think of it as a small control panel with 8 switches. One memory word says which switches are outputs, another word writes output values, and another word reads external input levels.",
  },
  {
    id: "ro32",
    label: "RO uController 32",
    chapterLabel: "32-bit microcontroller",
    wordBits: 32,
    registerType: "uint32_t",
    registerDigits: 8,
    pinCount: 16,
    pinPrefix: "P",
    addresses: {
      dir: 0xa000,
      data: 0xa004,
      input: 0xa008,
    },
    summary:
      "This controller likes 32-bit words. The GPIO idea is exactly the same, but now the natural register size is 32 bits and we expose 16 GPIO pins.",
    analogy:
      "Think of it as a wider control panel. The labels and pins increased, but the same basic memory idea still works: direction word, data word, input word.",
  },
];

export const gpioScenarios = [
  {
    id: "output",
    label: "Output example",
    explain:
      "We choose one pin, mark it as OUTPUT, and write HIGH or LOW so an LED connected to that pin turns on or off.",
  },
  {
    id: "input",
    label: "Input example",
    explain:
      "We choose one pin as INPUT, read an external switch level, and then decide whether an LED output pin should turn on or off.",
  },
];

export const advancedCViews = [
  {
    id: "bitfield",
    label: "Bitfield",
    title: "Bitfields let C name single bits",
    explain:
      "A bitfield can make one register easier to read by giving names to individual bits. It is useful for learning, but many embedded teams still prefer masks because bitfield layout can depend on the compiler.",
    code: [
      "typedef struct {",
      "  unsigned p0 : 1;",
      "  unsigned p1 : 1;",
      "  unsigned p2 : 1;",
      "  unsigned p3 : 1;",
      "  unsigned rest : 12;",
      "} gpio_bits_t;",
    ],
  },
  {
    id: "packed-struct",
    label: "Packed struct",
    title: "A packed struct can mirror memory byte by byte",
    explain:
      "A packed struct asks the compiler not to insert padding bytes. That matters when memory layout must match hardware or a communication packet exactly.",
    code: [
      "#pragma pack(push, 1)",
      "typedef struct {",
      "  unsigned short DIR;",
      "  unsigned short DATA;",
      "  unsigned short INPUT;",
      "} gpio_map_t;",
      "#pragma pack(pop)",
    ],
  },
  {
    id: "union",
    label: "Union",
    title: "A union lets the same bytes be seen in two ways",
    explain:
      "A union is useful when you want the same register data as a full word and also as named pieces, but it should be used carefully because you are overlaying memory views.",
    code: [
      "typedef union {",
      "  unsigned short word;",
      "  gpio_bits_t bits;",
      "} gpio_union_t;",
      "",
      "gpio_union_t port;",
      "port.word = 0x0008;",
    ],
  },
];
