export const embeddedExamples = [
  {
    id: "thermostat",
    label: "Smart thermostat",
    analogy: "Like a room caretaker who keeps checking temperature, comparing it with a goal, and adjusting the heating system before comfort is lost.",
    inputs: ["temperature sensor", "button press"],
    thinking: "compare room temperature with target value",
    outputs: ["heater relay", "display"],
    whyEmbedded:
      "It is a dedicated computer inside one product, built to monitor the environment continuously and control a physical system directly.",
  },
  {
    id: "traffic",
    label: "Traffic signal",
    analogy: "Like a strict conductor who must switch states on time, obey safety rules, and react correctly when a pedestrian requests a crossing.",
    inputs: ["timer tick", "pedestrian button"],
    thinking: "choose the current traffic state",
    outputs: ["red light", "yellow light", "green light"],
    whyEmbedded:
      "It continuously senses the world, tracks state, obeys timing constraints, and drives hardware outputs that affect safety.",
  },
  {
    id: "washing",
    label: "Washing machine",
    analogy: "Like a helper following a recipe with safety checks: fill, rotate, drain, spin, and react when something abnormal happens.",
    inputs: ["water level sensor", "door switch"],
    thinking: "follow the selected wash program safely",
    outputs: ["motor", "valve", "buzzer"],
    whyEmbedded:
      "It runs inside an appliance and controls a real physical process with sensors, actuators, state transitions, and timing limits.",
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
    why: "Most embedded products want one chip that already contains timing peripherals, memory, and I/O blocks so the design stays smaller, cheaper, lower power, and easier to control predictably.",
  },
  {
    id: "mpu",
    label: "Microprocessor",
    analogy: "A manager who is powerful but depends on several separate rooms and support teams around it, such as external RAM, storage, power management, and often an operating system.",
    builtIn: ["CPU core", "needs external RAM", "needs external flash", "usually runs rich OS"],
    bestFor: "Complex interfaces, Linux systems, multimedia, gateways, and heavy applications.",
    why: "A microprocessor usually needs external memory and support chips, but it can run much larger software stacks, richer interfaces, and more computationally demanding applications.",
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
    needs: "fast control loop, sensors, precise timing, deterministic behavior",
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
    "if pressure > threshold:",
    "    led = ON",
    "else:",
    "    led = OFF",
  ],
  stages: [
    {
      id: "source",
      label: "Source code",
      explain: "This is the human-friendly form that programmers write to describe decisions, not electrical activity directly.",
      output: ["read pressure", "compare with threshold", "choose LED state"],
    },
    {
      id: "compiler",
      label: "Compiler",
      explain: "The compiler translates your intention into specific operations the target CPU knows how to perform.",
      output: ["load sensor value", "compare register", "branch if greater", "store output bit"],
    },
    {
      id: "machine",
      label: "Machine code",
      explain: "Now the CPU has exact low-level instructions encoded in bytes and ready to execute step by step.",
      output: ["LOAD", "CMP", "JGT", "STORE"],
    },
    {
      id: "hardware",
      label: "Hardware action",
      explain: "The running instructions finally change a real output register and the hardware pin changes state.",
      output: ["GPIO bit updated", "pin voltage changes", "LED glows"],
    },
  ],
};
