import { gpioPins, roControllers } from "../data/chapterSeven";

function getController(controllerId) {
  return roControllers.find((controller) => controller.id === controllerId) ?? roControllers[0];
}

function bitMask(pin) {
  return 1 << pin;
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

export function buildGpioLesson(controllerId, scenarioId, config) {
  const controller = getController(controllerId);
  const registerDigits = controller.registerDigits;
  const byteCount = controller.wordBits / 8;
  const activePin = Number(config.pin);
  const outputPin = Number(config.outputPin ?? config.pin);
  const inputPin = Number(config.inputPin ?? config.pin);
  const outputValue = Number(config.outputValue ?? 0);
  const inputValue = Number(config.inputValue ?? 0);

  let dir = 0;
  let out = 0;
  let inReg = 0;
  let applicationValue = 0;
  let description = "";
  let driverCode = [];
  let cCode = [];
  let assembly = [];
  let opcodeWords = [];

  if (scenarioId === "output") {
    dir |= bitMask(activePin);
    out = outputValue ? bitMask(activePin) : 0;
    applicationValue = outputValue;
    description = `Configure GPIO${activePin} as output and drive it ${outputValue ? "HIGH" : "LOW"}.`;

    driverCode = [
      `${controller.registerType} pin = ${activePin};`,
      `ro_gpio_mode(pin, RO_GPIO_OUTPUT);`,
      `ro_gpio_write(pin, ${outputValue ? "RO_GPIO_HIGH" : "RO_GPIO_LOW"});`,
    ];
    cCode = [
      `RO_GPIO->DIR |= (1u << ${activePin});`,
      outputValue
        ? `RO_GPIO->OUT |= (1u << ${activePin});`
        : `RO_GPIO->OUT &= ~(1u << ${activePin});`,
    ];
    assembly = [
      `LOAD R1, [DIR]`,
      `OR   R1, #${formatWord(bitMask(activePin), registerDigits)}`,
      `STORE [DIR], R1`,
      `LOAD R2, [OUT]`,
      outputValue
        ? `OR   R2, #${formatWord(bitMask(activePin), registerDigits)}`
        : `AND  R2, #${formatWord(~bitMask(activePin), registerDigits).slice(- (2 + registerDigits))}`,
      `STORE [OUT], R2`,
    ];
    opcodeWords = [
      opcodeWord(0x10, activePin),
      opcodeWord(0x21, bitMask(activePin)),
      opcodeWord(0x31, activePin),
      opcodeWord(0x11, activePin),
      opcodeWord(outputValue ? 0x22 : 0x23, bitMask(activePin)),
      opcodeWord(0x32, activePin),
    ];
  } else {
    dir |= bitMask(outputPin);
    inReg |= inputValue ? bitMask(inputPin) : 0;
    const ledValue = inputValue ? 1 : 0;
    out = ledValue ? bitMask(outputPin) : 0;
    applicationValue = ledValue;
    description = `Configure GPIO${inputPin} as input, read it, and mirror the result to GPIO${outputPin}.`;

    driverCode = [
      `ro_gpio_mode(${inputPin}, RO_GPIO_INPUT);`,
      `ro_gpio_mode(${outputPin}, RO_GPIO_OUTPUT);`,
      `if (ro_gpio_read(${inputPin})) {`,
      `  ro_gpio_write(${outputPin}, RO_GPIO_HIGH);`,
      `} else {`,
      `  ro_gpio_write(${outputPin}, RO_GPIO_LOW);`,
      `}`,
    ];
    cCode = [
      `RO_GPIO->DIR &= ~(1u << ${inputPin});`,
      `RO_GPIO->DIR |= (1u << ${outputPin});`,
      `button = (RO_GPIO->IN >> ${inputPin}) & 1u;`,
      `RO_GPIO->OUT = button ? (RO_GPIO->OUT | (1u << ${outputPin})) : (RO_GPIO->OUT & ~(1u << ${outputPin}));`,
    ];
    assembly = [
      `LOAD R1, [IN]`,
      `TEST R1, #${formatWord(bitMask(inputPin), registerDigits)}`,
      `JZ   pin_low`,
      `LOAD R2, [OUT]`,
      `OR   R2, #${formatWord(bitMask(outputPin), registerDigits)}`,
      `STORE [OUT], R2`,
      `JMP  done`,
      `pin_low:`,
      `LOAD R2, [OUT]`,
      `AND  R2, #${formatWord(~bitMask(outputPin), registerDigits).slice(- (2 + registerDigits))}`,
      `STORE [OUT], R2`,
      `done:`,
    ];
    opcodeWords = [
      opcodeWord(0x14, inputPin),
      opcodeWord(0x41, bitMask(inputPin)),
      opcodeWord(0x52, 0x01),
      opcodeWord(0x11, outputPin),
      opcodeWord(0x22, bitMask(outputPin)),
      opcodeWord(0x32, outputPin),
      opcodeWord(0x53, 0x02),
      opcodeWord(0x11, outputPin),
      opcodeWord(0x23, bitMask(outputPin)),
      opcodeWord(0x32, outputPin),
    ];
  }

  const machineBytes = formatBytes(opcodeWords.flatMap((word) => toBytes(word, 2)));
  const opcodeText = opcodeWords.map((word) => formatWord(word, 4));

  const registers = [
    {
      id: "dir",
      name: "DIR",
      value: dir,
      formatted: formatWord(dir, registerDigits),
      note: "1 means output, 0 means input",
    },
    {
      id: "out",
      name: "OUT",
      value: out,
      formatted: formatWord(out, registerDigits),
      note: "Output data register",
    },
    {
      id: "in",
      name: "IN",
      value: inReg,
      formatted: formatWord(inReg, registerDigits),
      note: "Input sample register",
    },
  ];

  const pins = gpioPins.map((pin) => {
    const isOutput = Boolean(dir & bitMask(pin.id));
    const inputLevel = Boolean(inReg & bitMask(pin.id));
    const outputLevel = Boolean(out & bitMask(pin.id));
    const liveLevel = isOutput ? outputLevel : inputLevel;

    return {
      ...pin,
      mode: isOutput ? "output" : "input",
      level: liveLevel ? 1 : 0,
      highlighted:
        scenarioId === "output"
          ? pin.id === activePin
          : pin.id === inputPin || pin.id === outputPin,
      role:
        scenarioId === "output"
          ? pin.id === activePin
            ? "led"
            : "idle"
          : pin.id === inputPin
            ? "sensor"
            : pin.id === outputPin
              ? "led"
              : "idle",
    };
  });

  const driverHeader = [
    `typedef ${controller.registerType} ro_reg_t;`,
    `typedef struct {`,
    `  volatile ro_reg_t DIR;`,
    `  volatile ro_reg_t OUT;`,
    `  volatile ro_reg_t IN;`,
    `} RO_GPIO_Type;`,
    `void ro_gpio_mode(uint8_t pin, uint8_t mode);`,
    `void ro_gpio_write(uint8_t pin, uint8_t value);`,
    `uint8_t ro_gpio_read(uint8_t pin);`,
  ];

  return {
    controller,
    scenarioId,
    description,
    applicationValue,
    pins,
    registers,
    driverHeader,
    driverCode,
    cCode,
    assembly,
    opcodeText,
    machineBytes,
    memoryCells: registers.map((register, index) => ({
      address: 0x8000 + index * byteCount,
      addressLabel: `0x${(0x8000 + index * byteCount).toString(16).toUpperCase()}`,
      hex: register.formatted.replace("0x", ""),
      note: `${register.name} register`,
      group: register.id,
    })),
  };
}
