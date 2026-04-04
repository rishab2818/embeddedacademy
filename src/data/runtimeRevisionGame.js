export const runtimeRescueLore = [
  "These missions connect clocks, buses, compilation, flash, RAM, and execution into one system picture.",
  "Each choice is a repair move inside a believable embedded failure, not a shallow quiz answer.",
  "The explanations are meant to leave you with a mental movie of what the machine is really doing.",
];

export const runtimeRescueConfig = {
  campaignLabel: "Game Revision 2",
  gameTitle: "Runtime Rescue: clock to output",
  introCopy:
    "This second rescue deck picks up where the basics ended. You will trace timing, buses, compilation, flash, RAM, fetch-decode-execute, and real I/O behavior as one connected machine instead of isolated topics.",
  statusTitle: "Runtime Rescue progression",
  statusCopy: "Every solved mission strengthens the end-to-end mental model",
  controlRoomTitle: "A systems-debugging game",
  controlRoomCopy:
    "These missions reward engineering reasoning. The right move is the one that preserves the real causal chain inside the microcontroller.",
  mapTitle: "From clock setup to runtime execution",
  logTitle: "Recent runtime diagnostics",
};

export const runtimeRescueMissions = [
  {
    id: "clock-slip",
    code: "R1",
    title: "Clock Slip",
    difficulty: "Moderate",
    chapterRefs: ["Clock source", "PLL", "Bus timing"],
    story:
      "A UART link that worked yesterday is now producing garbage characters after a clock-tree change.",
    objective: "Pick the repair move that matches how clock changes affect timed communication.",
    prompt:
      "What is the most technically correct first fix when a serial peripheral starts mis-timing after SYSCLK and bus-divider changes?",
    hint:
      "Communication blocks do not invent their own time base. Their timing usually depends on a known derived clock.",
    successTitle: "Timing chain repaired",
    successBody:
      "UART timing depends on a clock-derived baud calculation. If the clock tree changes, the peripheral timing assumptions must be recalculated or the serial bits no longer line up in time.",
    engineeringCheck:
      "Ask which exact clock domain the peripheral depends on and whether the configuration still matches that derived time base.",
    expertLesson:
      "Timing bugs often look like data corruption, but the deeper failure is a broken clock assumption. When the root clock or divider changes, every downstream timing budget that depended on it becomes suspect.",
    diagnosticChecklist: [
      "Which root clock, PLL, and divider path feeds this peripheral?",
      "What timing parameter was calculated from the old clock tree?",
      "Did the communication block keep its old configuration after the clock changed?",
    ],
    practicalTransfer:
      "This is the exact class of bug engineers hit after changing system clock setup and then watching UART, PWM, timers, ADC triggers, or communication sampling quietly drift out of spec.",
    options: [
      {
        id: "a",
        label: "Move A",
        title: "Recalculate the baud settings from the new clock tree",
        detail: "Treat the UART timing as a derived clock-budget problem.",
        result:
          "Correct. When the system or peripheral clock changes, the serial block must be reconfigured to match the new timing base.",
        correct: true,
      },
      {
        id: "b",
        label: "Move B",
        title: "Increase RAM size because timing errors are a memory problem",
        detail: "Confuse storage capacity with peripheral timing.",
        result:
          "The failure is about time, not storage. More RAM does not restore correct bit timing.",
      },
      {
        id: "c",
        label: "Move C",
        title: "Convert the UART data to hexadecimal text first",
        detail: "Change representation instead of fixing timing.",
        result:
          "Changing text representation does not solve the fact that the bits are sampled at the wrong time.",
      },
      {
        id: "d",
        label: "Move D",
        title: "Disable the clock so the UART stops making mistakes",
        detail: "Remove the timing source entirely.",
        result:
          "Without the proper clock, the peripheral cannot function at all.",
      },
    ],
  },
  {
    id: "bus-route",
    code: "R2",
    title: "Bus Route",
    difficulty: "Moderate",
    chapterRefs: ["Address bus", "Data bus", "Controller width"],
    story:
      "A teammate says the address bus is where the actual sensor value travels because it 'has lots of lines'.",
    objective: "Repair the mental model of bus roles before the team debugs the wrong thing.",
    prompt:
      "Which correction best explains the difference between address bus and data bus during a read?",
    hint:
      "One tells the system where to look. The other carries what was found there.",
    successTitle: "Bus roles clarified",
    successBody:
      "During a read, the CPU places the target location on the address bus. Memory or the peripheral then returns the stored value on the data bus. 'Where' and 'what' must stay separate in the mental model.",
    engineeringCheck:
      "Before debugging a bus transaction, say out loud which wires choose the location and which wires carry the returned payload.",
    expertLesson:
      "Once address and data roles are mentally separated, memory maps, register reads, DMA traces, and peripheral debugging become dramatically easier to reason about.",
    diagnosticChecklist: [
      "What location is being targeted?",
      "Which path identifies that location?",
      "Which path returns or accepts the actual payload value?",
    ],
    practicalTransfer:
      "This distinction is essential when reading logic-analyzer traces, debugging memory-mapped peripherals, or explaining why a transaction hit the right register but carried the wrong value.",
    options: [
      {
        id: "a",
        label: "Move A",
        title: "The address bus chooses the location, and the data bus carries the value",
        detail: "Keep location and value separate.",
        result:
          "Correct. The address bus identifies the target location, while the data bus carries the actual read or write value.",
        correct: true,
      },
      {
        id: "b",
        label: "Move B",
        title: "Both buses carry the same thing, just at different voltages",
        detail: "Treat the buses as duplicates.",
        result:
          "That collapses two distinct jobs into one and makes memory transactions much harder to reason about.",
      },
      {
        id: "c",
        label: "Move C",
        title: "Only 32-bit controllers have a data bus",
        detail: "Confuse controller width with the existence of buses.",
        result:
          "8-bit, 16-bit, and 32-bit controllers all need a way to move data. The width changes, but the role stays.",
      },
      {
        id: "d",
        label: "Move D",
        title: "The data bus stores values permanently, so RAM is optional",
        detail: "Confuse transport with storage again.",
        result:
          "Buses transport values briefly. Memory is where values are actually kept.",
      },
    ],
  },
  {
    id: "compile-myth",
    code: "R3",
    title: "Compile Myth",
    difficulty: "Advanced",
    chapterRefs: ["Compilation", "Assembly", "Machine code"],
    story:
      "An intern says the compiler simply replaces each C word with one machine-code word in a straight dictionary lookup.",
    objective: "Choose the correction that explains what the compiler really reasons about.",
    prompt:
      "What is the best explanation of why compilation is more than word-for-word translation?",
    hint:
      "The compiler has to preserve meaning, legality, and target-specific behavior, not just spelling.",
    successTitle: "Toolchain understanding improved",
    successBody:
      "The compiler reasons about syntax, types, control flow, storage, target instruction choices, and optimization tradeoffs. The assembler and linker then finish turning that meaning into the final binary image.",
    engineeringCheck:
      "Ask which stage is responsible for meaning, which stage emits numeric opcodes, and which stage finally assigns real addresses and memory layout.",
    expertLesson:
      "Toolchain literacy is part of embedded expertise because timing, startup, memory placement, and even debugger behavior all depend on how source meaning was lowered into a target-specific binary image.",
    diagnosticChecklist: [
      "What semantic checks must happen before code can become instructions?",
      "Which part of the toolchain turns symbols into numeric encodings?",
      "Which stage decides where code and data finally live in memory?",
    ],
    practicalTransfer:
      "This understanding helps when builds fail, map files look strange, startup code misbehaves, or optimized output no longer resembles the source at a one-line-per-line level.",
    options: [
      {
        id: "a",
        label: "Move A",
        title: "Compilation preserves meaning, checks legality, and chooses target-specific instruction strategies",
        detail: "Treat compilation as a reasoning and lowering pipeline.",
        result:
          "Correct. The compiler is not a simple dictionary. It transforms human-friendly source into target-specific executable form while preserving the program's intended behavior.",
        correct: true,
      },
      {
        id: "b",
        label: "Move B",
        title: "Compilation only removes comments and whitespace",
        detail: "Reduce the compiler to formatting cleanup.",
        result:
          "Comments and whitespace matter to humans, but the compiler does much more than strip them away.",
      },
      {
        id: "c",
        label: "Move C",
        title: "The linker is the only stage that understands code",
        detail: "Give all semantic work to the wrong stage.",
        result:
          "The linker mainly combines object pieces and resolves addresses. The compiler does the main semantic reasoning first.",
      },
      {
        id: "d",
        label: "Move D",
        title: "Machine code is written by humans directly inside flash",
        detail: "Skip the compilation chain entirely.",
        result:
          "That is not how normal embedded development works. Source usually passes through compiler, assembler, and linker stages first.",
      },
    ],
  },
  {
    id: "flash-vs-ram",
    code: "R4",
    title: "Flash vs RAM",
    difficulty: "Advanced",
    chapterRefs: ["Flash", "RAM", "Execution model"],
    story:
      "A study group concludes that every microcontroller must copy all code from flash into RAM before the CPU can execute anything.",
    objective: "Repair the runtime model without oversimplifying it.",
    prompt:
      "Which explanation is the most technically honest for typical microcontrollers?",
    hint:
      "Some systems copy selected data or code, but many MCUs fetch instructions directly from flash during execution.",
    successTitle: "Memory model corrected",
    successBody:
      "Flash commonly stores the program image long-term, and many microcontrollers fetch instructions directly from it. RAM usually holds variables, stack, buffers, and changing runtime state. Some systems also copy selected data or hot routines into RAM, but not all code on all devices.",
    engineeringCheck:
      "Ask which memory is persistent, which memory is mutable at runtime, and whether this platform executes code directly from flash or selectively copies only some content into RAM.",
    expertLesson:
      "The flash-versus-RAM distinction becomes crucial when you debug startup code, bootloaders, initialized data, stack growth, RAM exhaustion, or execution-speed tradeoffs on larger systems.",
    diagnosticChecklist: [
      "Where does the long-term program image live after power is removed?",
      "Which memory holds changing variables and stack state during execution?",
      "Does this specific controller execute from flash directly or copy only selected content into RAM?",
    ],
    practicalTransfer:
      "This is the mental model behind linker sections such as code in flash, initialized data copied to RAM at startup, and hot routines occasionally placed in faster RAM regions.",
    options: [
      {
        id: "a",
        label: "Move A",
        title: "Flash usually stores the program image; many MCUs execute from flash directly while RAM holds changing state",
        detail: "Use the common embedded execution picture with the important caveat.",
        result:
          "Correct. That is the honest beginner model: flash stores program bits long-term, RAM stores runtime state, and some systems optionally copy selected content into RAM.",
        correct: true,
      },
      {
        id: "b",
        label: "Move B",
        title: "Flash is temporary and RAM is permanent",
        detail: "Reverse the roles of the memories.",
        result:
          "That swaps the two memory types and breaks the basic runtime model.",
      },
      {
        id: "c",
        label: "Move C",
        title: "RAM is only for text strings, so variables should stay in flash",
        detail: "Ignore runtime mutability.",
        result:
          "Changing variables need working memory. Flash is not the normal home for rapidly changing runtime state.",
      },
      {
        id: "d",
        label: "Move D",
        title: "The ALU stores the whole program while the CPU is running",
        detail: "Confuse a compute block with a memory technology.",
        result:
          "The ALU computes on values; it does not replace flash or RAM as program storage.",
      },
    ],
  },
  {
    id: "cycle-order",
    code: "R5",
    title: "Cycle Order",
    difficulty: "Advanced",
    chapterRefs: ["Fetch", "Decode", "Execute", "Registers"],
    story:
      "A team diagram shows the ALU producing a result before the instruction is even decoded, because 'the CPU already knows what to do'.",
    objective: "Choose the sequence that respects the real fetch-decode-execute idea.",
    prompt:
      "Which stage order gives the best beginner-accurate picture of instruction execution?",
    hint:
      "The core needs instruction bits before it can decide which units to activate.",
    successTitle: "Execution loop restored",
    successBody:
      "A healthy mental model is: fetch instruction bits, decode what they mean, read operands, execute the required action, then write the result back where it belongs.",
    engineeringCheck:
      "Check whether the explanation respects causality: the CPU must know which instruction it has before it can select operands and perform the correct action.",
    expertLesson:
      "Execution becomes far easier to debug when you stop saying 'the code runs' and instead describe fetch, decode, operand read, execution, and write-back as separate responsibilities inside the CPU.",
    diagnosticChecklist: [
      "Where does the next instruction come from?",
      "When does the decoder learn what action is required?",
      "When are operands read and when is the result committed?",
    ],
    practicalTransfer:
      "This thinking helps when reading pipeline diagrams, single-stepping assembly, or explaining why a breakpoint, register value, or branch decision appears at one exact moment in the cycle.",
    options: [
      {
        id: "a",
        label: "Move A",
        title: "Execute -> fetch -> decode -> guess operands -> store",
        detail: "Start with action before meaning exists.",
        result:
          "That reverses causality. The core cannot execute correctly before it has fetched and decoded the instruction.",
      },
      {
        id: "b",
        label: "Move B",
        title: "Fetch -> decode -> read operands -> execute -> write back",
        detail: "Use the classic ordered loop.",
        result:
          "Correct. That sequence makes the instruction cycle readable and matches the basic logic of CPU execution.",
        correct: true,
      },
      {
        id: "c",
        label: "Move C",
        title: "Decode -> fetch -> execute -> read operands -> flash write",
        detail: "Ask the decoder to work before the instruction is available.",
        result:
          "Decode needs fetched instruction bits first. It cannot run ahead of the fetch stage in that way.",
      },
      {
        id: "d",
        label: "Move D",
        title: "Fetch -> execute everything -> RAM decides the rest",
        detail: "Treat RAM like a control unit.",
        result:
          "RAM stores data. It does not replace the decoder or the ordered control steps inside the CPU.",
      },
    ],
  },
  {
    id: "input-output-bridge",
    code: "R6",
    title: "Input Output Bridge",
    difficulty: "Highly Technical",
    chapterRefs: ["GPIO", "Input path", "Output path", "Clocked flow"],
    story:
      "A learner understands outputs but thinks inputs work the same way in reverse, as if the CPU first writes something and then the pin changes to match it.",
    objective: "Pick the explanation that correctly separates input capture from output drive.",
    prompt:
      "Which statement best contrasts output flow and input flow on a microcontroller pin?",
    hint:
      "Outputs begin with a CPU write. Inputs begin with an external electrical state that software later reads.",
    successTitle: "GPIO mental model stabilized",
    successBody:
      "For output, the CPU writes an output register and the hardware drives the pin. For input, the outside world changes the pin first, the input register reflects that state, and the CPU reads it later during execution.",
    engineeringCheck:
      "Ask which side creates the first causal event: the CPU for outputs, or the external world for inputs.",
    expertLesson:
      "Many GPIO misunderstandings vanish once the causal arrows are fixed. Output flow begins inside the processor. Input flow begins in physics outside the chip and only later becomes readable software state.",
    diagnosticChecklist: [
      "What event happens first in this path: a CPU register write or an external voltage change?",
      "Which register reflects the pin state for software?",
      "At what later instruction does the CPU actually observe or update that state?",
    ],
    practicalTransfer:
      "This distinction is central when debugging buttons, sensors, GPIO interrupts, transistor drivers, and any firmware path that must separate observed external reality from commanded output state.",
    options: [
      {
        id: "a",
        label: "Move A",
        title: "Outputs start with a CPU register write; inputs start with an external pin state that software later reads",
        detail: "Keep the causal arrows different for output and input.",
        result:
          "Correct. That difference is crucial: output flow begins inside the CPU, while input flow begins in the outside world and is sampled into the system.",
        correct: true,
      },
      {
        id: "b",
        label: "Move B",
        title: "Inputs and outputs are the same because both eventually use GPIO",
        detail: "Collapse two different directions into one vague idea.",
        result:
          "They may use the same peripheral block, but the causal direction is different and matters for understanding real systems.",
      },
      {
        id: "c",
        label: "Move C",
        title: "The ALU directly senses the voltage on a pin without registers or peripherals",
        detail: "Skip the hardware interface path.",
        result:
          "Pins are usually read through peripheral or GPIO registers, not directly by the ALU as raw analog wires.",
      },
      {
        id: "d",
        label: "Move D",
        title: "An input becomes valid only after the CPU writes the pin first",
        detail: "Force output causality onto input behavior.",
        result:
          "That confuses the two directions. Inputs are driven by external conditions, not by a prior CPU output write.",
      },
    ],
  },
  {
    id: "whole-machine",
    code: "R7",
    title: "Whole Machine",
    difficulty: "Highly Technical",
    chapterRefs: ["Clocks", "Buses", "Compilation", "Flash", "RAM", "Execution"],
    story:
      "A final review meeting asks for one faithful story from C code to output pin, with clocks, flash, RAM, fetch, decode, ALU, and GPIO all connected in the right order.",
    objective: "Choose the explanation that keeps the whole machine picture coherent from start to finish.",
    prompt:
      "Which end-to-end story is the strongest technical summary of chapters 9 through 12?",
    hint:
      "Look for the answer that preserves compilation, stored machine code, clocked fetch, CPU execution, and the final input/output bridge without skipping layers.",
    successTitle: "End-to-end model locked in",
    successBody:
      "Source code is compiled into machine code, the final image is stored in flash, the clocked CPU fetches and decodes instructions, operands come from registers, RAM, or peripherals, the ALU or control logic produces results, and those results can update memory or drive GPIO outputs. Inputs work by changing external pin states first, which later become readable values through GPIO registers.",
    engineeringCheck:
      "Demand one continuous chain from source meaning to stored binary to clocked execution to final hardware effect without allowing any magic jumps.",
    expertLesson:
      "This is the systems-engineering habit the whole course has been building: the ability to narrate a product as one connected machine, not as a pile of disconnected chapter terms.",
    diagnosticChecklist: [
      "Where was the behavior first described by a human?",
      "How did it become stored executable bits on the target machine?",
      "How do clocked CPU activity and peripherals finally create a visible hardware effect?",
    ],
    practicalTransfer:
      "This whole-chain reasoning is what separates casual familiarity from the kind of expertise needed to build control computers, phones, medical devices, robotics platforms, and other serious embedded products.",
    options: [
      {
        id: "a",
        label: "Move A",
        title: "Compile to machine code, store it in flash, fetch it on clocked steps, work through registers/ALU, then write GPIO or read GPIO as needed",
        detail: "Keep every main abstraction layer connected in the right order.",
        result:
          "Correct. This is the strongest overall mental movie: compilation creates the instruction image, flash stores it, the clocked CPU executes it, and peripherals connect that execution to the outside world.",
        correct: true,
      },
      {
        id: "b",
        label: "Move B",
        title: "Write C code directly into RAM and let the GPIO pin interpret the text",
        detail: "Skip the whole compilation and execution chain.",
        result:
          "Pins do not interpret C text. The chip executes machine instructions, not source-language sentences.",
      },
      {
        id: "c",
        label: "Move C",
        title: "The bus compiles the code, then the ALU stores it forever",
        detail: "Assign the wrong jobs to the wrong blocks.",
        result:
          "The bus transports, the compiler translates, and memory stores. Each block has its own role.",
      },
      {
        id: "d",
        label: "Move D",
        title: "The clock alone makes the output change even if no instruction is fetched",
        detail: "Treat timing as if it replaces software and control logic.",
        result:
          "The clock only coordinates when work can happen. It does not replace instructions, data, or control decisions.",
      },
    ],
  },
];
