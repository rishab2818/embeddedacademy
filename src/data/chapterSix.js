export const embeddedExamples = [
  {
    id: "thermostat",
    label: "Smart thermostat",
    analogy: "Like a room caretaker who keeps checking temperature and adjusting the heater.",
    inputs: ["temperature sensor", "button press"],
    thinking: "compare room temperature with target value",
    outputs: ["heater relay", "display"],
    whyEmbedded:
      "It is a dedicated computer inside one product, built to do one job again and again.",
  },
  {
    id: "traffic",
    label: "Traffic signal",
    analogy: "Like a strict conductor who must switch lights on time so the road stays safe.",
    inputs: ["timer tick", "pedestrian button"],
    thinking: "choose the current traffic state",
    outputs: ["red light", "yellow light", "green light"],
    whyEmbedded:
      "It constantly senses the world, makes a decision, and drives hardware outputs.",
  },
  {
    id: "washing",
    label: "Washing machine",
    analogy: "Like a helper following a fixed recipe: fill, rotate, drain, repeat.",
    inputs: ["water level sensor", "door switch"],
    thinking: "follow the selected wash program safely",
    outputs: ["motor", "valve", "buzzer"],
    whyEmbedded:
      "It runs inside an appliance and controls the real physical process of washing clothes.",
  },
];

export const timingPresets = [
  {
    id: "loose",
    label: "Comfortable deadline",
    deadlineMs: 20,
    tasks: [
      { name: "Read sensor", durationMs: 4 },
      { name: "Filter value", durationMs: 5 },
      { name: "Update actuator", durationMs: 3 },
    ],
  },
  {
    id: "tight",
    label: "Tight deadline",
    deadlineMs: 10,
    tasks: [
      { name: "Read sensor", durationMs: 4 },
      { name: "Filter value", durationMs: 5 },
      { name: "Update actuator", durationMs: 3 },
    ],
  },
  {
    id: "critical",
    label: "Motor control loop",
    deadlineMs: 6,
    tasks: [
      { name: "Read encoder", durationMs: 2 },
      { name: "Compute error", durationMs: 2 },
      { name: "Write PWM", durationMs: 1 },
    ],
  },
];

export const processingSystems = [
  {
    id: "mcu",
    label: "Microcontroller",
    analogy: "A compact workshop where the worker, tools, and small storage all live in one room.",
    builtIn: ["CPU core", "RAM", "flash", "GPIO", "timers", "UART/I2C/SPI"],
    bestFor: "Dedicated control tasks, low power devices, sensors, appliances, robots.",
    why: "Most embedded products want one chip that already includes the parts needed to sense and control hardware.",
  },
  {
    id: "mpu",
    label: "Microprocessor",
    analogy: "A manager who is powerful but depends on several separate rooms and support teams around it.",
    builtIn: ["CPU core", "needs external RAM", "needs external flash", "usually runs rich OS"],
    bestFor: "Complex interfaces, Linux systems, multimedia, gateways, and heavy applications.",
    why: "A microprocessor usually needs external memory and support chips, but can run much larger software stacks.",
  },
];

export const systemUseCases = [
  {
    id: "fan",
    label: "Ceiling fan controller",
    needs: "small cost, low power, simple timing",
    recommended: "mcu",
  },
  {
    id: "drone",
    label: "Flight controller",
    needs: "fast control loop, sensors, precise timing",
    recommended: "mcu",
  },
  {
    id: "camera",
    label: "Smart camera gateway",
    needs: "video, networking, complex software",
    recommended: "mpu",
  },
  {
    id: "dashboard",
    label: "Touch dashboard",
    needs: "graphics, apps, operating system",
    recommended: "mpu",
  },
];

export const compilerExample = {
  sourceCode: [
    "if pressure > 140:",
    "    led = ON",
    "else:",
    "    led = OFF",
  ],
  stages: [
    {
      id: "source",
      label: "Source code",
      explain: "This is the human-friendly form that programmers write.",
      output: ["pressure > 140 ?", "LED = ON/OFF"],
    },
    {
      id: "compiler",
      label: "Compiler",
      explain: "The compiler acts like a translator that converts your idea into CPU instructions.",
      output: ["compare register", "branch if greater", "store output bit"],
    },
    {
      id: "machine",
      label: "Machine code",
      explain: "Now the CPU has exact low-level instructions it can execute step by step.",
      output: ["LOAD", "CMP", "JGT", "STORE"],
    },
    {
      id: "hardware",
      label: "Hardware action",
      explain: "The running instructions finally change a real output pin and the LED reacts.",
      output: ["GPIO bit = 1", "LED glows"],
    },
  ],
};
