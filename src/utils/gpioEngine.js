function bitMask(pin) {
  return 1 << pin;
}

function fullMask(bits) {
  return bits === 32 ? 0xffffffff : (1 << bits) - 1;
}

function formatWord(value, digits) {
  return `0x${(value >>> 0).toString(16).toUpperCase().padStart(digits, "0")}`;
}

function toBytes(value, byteCount) {
  return Array.from({ length: byteCount }, (_, index) => (value >> (index * 8)) & 0xff);
}

function formatBytes(bytes) {
  return bytes.map((byte) => byte.toString(16).toUpperCase().padStart(2, "0"));
}

function opcodeWord(base, operand) {
  return ((base & 0xff) << 8) | (operand & 0xff);
}

export function buildGpioTeachingModel(controller, scenarioId, config) {
  const targetPin = Number(config.targetPin);
  const inputPin = Number(config.inputPin);
  const ledPin = Number(config.ledPin);
  const outputLevel = Number(config.outputLevel);
  const inputLevel = Number(config.inputLevel);
  const byteCount = controller.wordBits / 8;
  const digits = controller.registerDigits;
  const allBitsMask = fullMask(controller.wordBits);

  let dir = 0;
  let data = 0;
  let input = 0;
  let english = [];
  let cCode = [];
  let assembly = [];
  let opcodes = [];
  let explanation = "";

  if (scenarioId === "output") {
    dir |= bitMask(targetPin);
    if (outputLevel) {
      data |= bitMask(targetPin);
    }

    explanation = `Pin ${controller.pinPrefix}${targetPin} becomes an output. Writing ${outputLevel ? "1" : "0"} to the DATA memory makes the LED ${outputLevel ? "turn on" : "turn off"}.`;

    english = [
      `Choose ${controller.pinPrefix}${targetPin}.`,
      `Mark ${controller.pinPrefix}${targetPin} as OUTPUT inside the DIR memory.`,
      `Write ${outputLevel ? "1" : "0"} into the DATA memory for ${controller.pinPrefix}${targetPin}.`,
      `The LED connected to ${controller.pinPrefix}${targetPin} follows that output value.`,
    ];
    cCode = [
      `DIR = DIR | (1 << ${targetPin});`,
      outputLevel
        ? `DATA = DATA | (1 << ${targetPin});`
        : `DATA = DATA & ~(1 << ${targetPin});`,
    ];
    assembly = [
      `LOAD R1, DIR`,
      `OR   R1, ${formatWord(bitMask(targetPin), digits)}`,
      `STORE DIR, R1`,
      `LOAD R2, DATA`,
      outputLevel
        ? `OR   R2, ${formatWord(bitMask(targetPin), digits)}`
        : `AND  R2, ${formatWord(allBitsMask ^ bitMask(targetPin), digits)}`,
      `STORE DATA, R2`,
    ];
    opcodes = [
      opcodeWord(0x10, targetPin),
      opcodeWord(0x21, bitMask(targetPin)),
      opcodeWord(0x31, targetPin),
      opcodeWord(0x11, targetPin),
      opcodeWord(outputLevel ? 0x22 : 0x23, bitMask(targetPin)),
      opcodeWord(0x32, targetPin),
    ];
  } else {
    dir |= bitMask(ledPin);
    if (inputLevel) {
      input |= bitMask(inputPin);
      data |= bitMask(ledPin);
    }

    explanation = `Pin ${controller.pinPrefix}${inputPin} is an input. When INPUT memory shows 1 on that pin, the program writes 1 to LED pin ${controller.pinPrefix}${ledPin}.`;

    english = [
      `Mark ${controller.pinPrefix}${inputPin} as INPUT.`,
      `Mark ${controller.pinPrefix}${ledPin} as OUTPUT.`,
      `Read the INPUT memory at ${controller.pinPrefix}${inputPin}.`,
      `If it is 1, write 1 to ${controller.pinPrefix}${ledPin}; otherwise write 0.`,
    ];
    cCode = [
      `DIR = DIR & ~(1 << ${inputPin});`,
      `DIR = DIR | (1 << ${ledPin});`,
      `button = (INPUT >> ${inputPin}) & 1;`,
      `if (button) DATA = DATA | (1 << ${ledPin});`,
      `else DATA = DATA & ~(1 << ${ledPin});`,
    ];
    assembly = [
      `LOAD R1, INPUT`,
      `TEST R1, ${formatWord(bitMask(inputPin), digits)}`,
      `JZ   pin_low`,
      `LOAD R2, DATA`,
      `OR   R2, ${formatWord(bitMask(ledPin), digits)}`,
      `STORE DATA, R2`,
      `JMP  done`,
      `pin_low:`,
      `LOAD R2, DATA`,
      `AND  R2, ${formatWord(allBitsMask ^ bitMask(ledPin), digits)}`,
      `STORE DATA, R2`,
      `done:`,
    ];
    opcodes = [
      opcodeWord(0x14, inputPin),
      opcodeWord(0x41, bitMask(inputPin)),
      opcodeWord(0x52, 0x01),
      opcodeWord(0x11, ledPin),
      opcodeWord(0x22, bitMask(ledPin)),
      opcodeWord(0x32, ledPin),
      opcodeWord(0x53, 0x02),
      opcodeWord(0x11, ledPin),
      opcodeWord(0x23, bitMask(ledPin)),
      opcodeWord(0x32, ledPin),
    ];
  }

  const machineBytes = formatBytes(opcodes.flatMap((word) => toBytes(word, 2)));
  const opcodeText = opcodes.map((word) => formatWord(word, 4));

  const pins = Array.from({ length: controller.pinCount }, (_, index) => {
    const isLed = scenarioId === "output" ? index === targetPin : index === ledPin;
    const isInput = scenarioId === "input" && index === inputPin;
    const isOutput = scenarioId === "output" ? index === targetPin : index === ledPin;
    const level = isInput ? inputLevel : isLed ? (data & bitMask(index) ? 1 : 0) : 0;

    return {
      id: index,
      label: `${controller.pinPrefix}${index}`,
      mode: isOutput ? "output" : isInput ? "input" : "idle",
      level,
      highlighted: isLed || isInput,
      role: isLed ? "led" : isInput ? "sensor" : "idle",
    };
  });

  const registers = [
    {
      id: "dir",
      name: "DIR",
      formatted: formatWord(dir, digits),
      note: "1 means output and 0 means input",
    },
    {
      id: "data",
      name: "DATA",
      formatted: formatWord(data, digits),
      note: "Output bits are written here",
    },
    {
      id: "input",
      name: "INPUT",
      formatted: formatWord(input, digits),
      note: "External input levels are sampled here",
    },
  ];

  const memoryCells = [
    {
      address: controller.addresses.dir,
      addressLabel: formatWord(controller.addresses.dir, digits),
      hex: registers[0].formatted.replace("0x", ""),
      note: "DIR memory",
      group: "dir",
    },
    {
      address: controller.addresses.data,
      addressLabel: formatWord(controller.addresses.data, digits),
      hex: registers[1].formatted.replace("0x", ""),
      note: "DATA memory",
      group: "data",
    },
    {
      address: controller.addresses.input,
      addressLabel: formatWord(controller.addresses.input, digits),
      hex: registers[2].formatted.replace("0x", ""),
      note: "INPUT memory",
      group: "input",
    },
  ];

  const resolvedOutputLevel =
    scenarioId === "output"
      ? outputLevel
      : Number(Boolean(data & bitMask(ledPin)));

  return {
    explanation,
    english,
    cCode,
    assembly,
    opcodeText,
    machineBytes,
    pins,
    registers,
    memoryCells,
    byteCount,
    outputLevel: resolvedOutputLevel,
    targetLabel: `${controller.pinPrefix}${targetPin}`,
    inputLabel: `${controller.pinPrefix}${inputPin}`,
    ledLabel: `${controller.pinPrefix}${ledPin}`,
  };
}
