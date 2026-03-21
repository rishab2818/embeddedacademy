export const roControllers = [
  {
    id: "ro16",
    label: "RO uController 16",
    wordBits: 16,
    registerType: "uint16_t",
    registerDigits: 4,
    summary:
      "A small 16-bit controller where GPIO registers are naturally handled as 16-bit values.",
    analogy:
      "Think of it as a compact desk with shorter sheets of paper. It still controls 8 pins, but its natural register size is 16 bits.",
  },
  {
    id: "ro32",
    label: "RO uController 32",
    wordBits: 32,
    registerType: "uint32_t",
    registerDigits: 8,
    summary:
      "A 32-bit controller that still has 8 GPIO pins here, but its natural register size is 32 bits.",
    analogy:
      "This one is a wider desk with larger sheets of paper. The GPIO idea stays the same, but the CPU likes working with 32-bit words.",
  },
];

export const gpioScenarios = [
  {
    id: "output",
    label: "GPIO output",
    explain:
      "Your code configures one pin as output and then drives an LED high or low by writing to the output register.",
  },
  {
    id: "input",
    label: "GPIO input",
    explain:
      "Your code configures one pin as input, reads the external level, and then decides what another output pin should do.",
  },
];

export const gpioDriverNotes = [
  {
    title: "Device driver is a helper layer",
    body:
      "A GPIO driver hides raw register details behind readable functions like mode, write, and read. That makes the application code easier to understand.",
  },
  {
    title: "Registers are still underneath",
    body:
      "Even when you call a nice driver function, the driver usually ends up setting bits inside GPIO registers such as direction, output, and input.",
  },
  {
    title: "Same hardware, different views",
    body:
      "The same action can be shown as driver code, direct C register code, assembly, opcode fields, and final machine code bytes.",
  },
];

export const gpioPins = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  label: `GPIO${index}`,
}));
