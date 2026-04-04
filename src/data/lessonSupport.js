export const lessonSupport = {
  "bits-and-signedness": {
    title: "Start with the mental picture",
    intro:
      "This lesson is really about one idea: the same stored bits can be interpreted in different ways depending on the rules we apply.",
    takeaways: [
      "A bit is just a tiny yes-or-no state.",
      "A byte is 8 bits grouped together.",
      "Signed and unsigned do not change the stored pattern. They change the meaning we assign to it.",
    ],
    watchOut:
      "Do not mix up the physical bits in hardware with the human interpretation of those bits.",
  },
  "memory-and-addressing": {
    title: "Start with the mental picture",
    intro:
      "This lesson is really about locations and values. Memory is a long list of numbered storage slots, and addresses name those slots.",
    takeaways: [
      "An address tells you where to look.",
      "The value is what is stored at that place.",
      "Multi-byte values use neighboring addresses.",
    ],
    watchOut:
      "Beginners often confuse an address with the value sitting at that address. Keep those two ideas separate.",
  },
  "basic-data-types": {
    title: "Start with the mental picture",
    intro:
      "This lesson is about how different kinds of values occupy memory. A type is a rule for interpreting bits, not magic extra data.",
    takeaways: [
      "Integers and floats use different encoding rules.",
      "Width changes range and precision.",
      "Memory only stores bit patterns; type rules explain how to read them.",
    ],
    watchOut:
      "A float is not stored as decimal text. It is stored as a binary format with sign, exponent, and fraction fields.",
  },
  "variables-arrays-pointers": {
    title: "Start with the mental picture",
    intro:
      "This lesson connects names in code to memory locations. Variables name data, arrays group neighboring values, and pointers store addresses.",
    takeaways: [
      "A variable is a named piece of memory.",
      "An array keeps same-type elements next to each other.",
      "A pointer is a value whose meaning is an address.",
    ],
    watchOut:
      "A pointer is not the data itself. It is a value that points to where the data lives.",
  },
  "embedded-input-flow": {
    title: "Start with the mental picture",
    intro:
      "This lesson is about causal order in embedded systems: input arrives, software stores or reads it, logic decides, and output changes.",
    takeaways: [
      "Input comes first.",
      "Software works on stored or sampled data, not on vague ideas.",
      "Output is the result of a later decision.",
    ],
    watchOut:
      "If the order gets mixed up in your head, debugging gets much harder. Keep the pipeline in sequence.",
  },
  "what-is-embedded-programming": {
    title: "Start with the mental picture",
    intro:
      "This lesson explains why embedded programming is software with a hardware job and a timing responsibility.",
    takeaways: [
      "Embedded software exists to make a device behave correctly.",
      "Timing matters, not just correctness in the abstract.",
      "The hardware platform shapes what the software must care about.",
    ],
    watchOut:
      "Fast average performance is not the same thing as predictable timing.",
  },
  "serial-and-parallel-bus-fundamentals": {
    title: "Start with the mental picture",
    intro:
      "This lesson is about moving the same information through different wiring styles. Serial sends fewer bits at a time; parallel moves more together.",
    takeaways: [
      "The data meaning stays the same even if the transport style changes.",
      "Serial saves wires.",
      "Parallel can move more bits together but becomes harder to coordinate cleanly.",
    ],
    watchOut:
      "Do not treat serial and parallel as different data types. They are different transport methods.",
  },
  "game-revision-1-signal-rescue": {
    title: "How to use this game",
    intro:
      "This chapter is not a quiz for marks. It is a reasoning workout meant to expose weak mental models and repair them.",
    takeaways: [
      "Read the scenario like a real system problem.",
      "Choose the answer that keeps the physical and software story consistent.",
      "Use the explanation after each move to correct the picture in your head.",
    ],
    watchOut:
      "If you answer too quickly, you miss the point. The value of the game is in the reasoning.",
  },
  "microcontroller-clocks-and-timing": {
    title: "Start with the mental picture",
    intro:
      "This lesson is about timing rhythm. The clock does not carry your data. It coordinates when digital blocks are allowed to move, read, or change state.",
    takeaways: [
      "The clock is timing, not payload.",
      "Derived clocks feed the CPU and peripherals at related rates.",
      "Wrong clock configuration breaks later assumptions like UART timing and timer periods.",
    ],
    watchOut:
      "Saying 'the clock powers the bus' may help as a metaphor, but the accurate idea is that the clock synchronizes operations.",
  },
  "english-to-code-assembly-machine-code": {
    title: "Start with the mental picture",
    intro:
      "This lesson shows one behavior through several languages. English explains the goal, C organizes it, assembly makes the CPU steps visible, and machine code encodes those steps in bits.",
    takeaways: [
      "Each layer describes the same behavior differently.",
      "Assembly is closer to the CPU than C is.",
      "Machine code is what the processor finally executes.",
    ],
    watchOut:
      "Do not try to memorize each representation separately. Keep asking how each one expresses the same underlying action.",
  },
  "address-bus-data-bus-and-compilation": {
    title: "Start with the mental picture",
    intro:
      "This lesson combines two separate stories: how hardware moves addresses and data, and how software becomes binary in the first place.",
    takeaways: [
      "Address bus means where.",
      "Data bus means what value.",
      "Compilation turns human-friendly source into executable binary for a chosen target.",
    ],
    watchOut:
      "A controller being 32-bit does not mean every path or every memory detail is also exactly 32 bits wide.",
  },
  "flash-ram-and-execution": {
    title: "Start with the mental picture",
    intro:
      "This lesson is the runtime movie: program bits live in flash, changing state lives in RAM, and the CPU repeatedly fetches, decodes, executes, and reacts to inputs and outputs.",
    takeaways: [
      "Flash usually keeps the stored program image.",
      "RAM keeps changing working state.",
      "Registers and the ALU are fast working areas inside the execution path, not replacements for memory.",
    ],
    watchOut:
      "Many microcontrollers execute directly from flash. They do not all copy the whole program into RAM first.",
  },
  "von-neumann-and-harvard-architecture": {
    title: "Start with the mental picture",
    intro:
      "This lesson is about the machine's traffic plan. It explains whether instructions and data share one road or travel on separate roads, and why that changes timing, throughput, and programming style.",
    takeaways: [
      "Von Neumann teaches one broad memory model with a possible shared-path bottleneck.",
      "Harvard teaches separate instruction and data paths, which often helps repeated embedded loops.",
      "Many modern devices are hybrids, so the best answer depends on the product goal rather than on a slogan.",
    ],
    watchOut:
      "Do not treat architecture as only a history lesson. It directly affects real-time behavior, code placement, and how later memory and bus topics should be interpreted.",
  },
  "microcontroller-core-and-peripherals": {
    title: "Start with the mental picture",
    intro:
      "This lesson is the full controller tour. It shows how CPU, clocks, flash, RAM, buses, GPIO, timers, ADC, DAC, DMA, cache, and communication peripherals cooperate inside one real microcontroller.",
    takeaways: [
      "Peripherals are hardware helpers that translate between internal digital state and external physical signals.",
      "Pins can act as GPIO, analog inputs, or routed peripheral signals depending on configuration.",
      "A real embedded product is a repeated system movie from sensor to storage to logic to actuator and back again.",
    ],
    watchOut:
      "Do not reduce the microcontroller to only the CPU. Most practical embedded behavior depends on the surrounding peripheral and bus ecosystem.",
  },
  "runtime-rescue": {
    title: "How to use this game",
    intro:
      "This game is a systems-thinking chapter. It is designed to help you connect clocks, buses, compilation, flash, RAM, and I/O into one continuous chain.",
    takeaways: [
      "Treat each mission like a real debug case.",
      "Look for the answer that preserves causality across the whole machine.",
      "Use the explanations to strengthen the end-to-end picture.",
    ],
    watchOut:
      "The strongest answer is usually the one that keeps both hardware flow and software translation consistent at the same time.",
  },
};

export function getLessonSupport(slug) {
  return lessonSupport[slug] ?? null;
}
