export const revisionMissions = [
  {
    id: "signedness-breach",
    code: "M1",
    title: "Signedness Breach",
    difficulty: "Moderate",
    chapterRefs: ["Bits", "Signed vs unsigned"],
    story:
      "A calibration byte arrives as 0xDD. The telemetry UI shows 221, but the motor controller expects a signed 8-bit correction.",
    objective: "Stabilize the controller by choosing the interpretation that matches signed 8-bit hardware.",
    prompt:
      "Which repair action correctly explains what the firmware should do with 0xDD when it is stored in a signed 8-bit variable?",
    hint:
      "The stored bits do not change. Only the interpretation changes when the type becomes signed.",
    successTitle: "Calibration channel restored",
    successBody:
      "0xDD is 1101 1101. In signed 8-bit two's complement that pattern means -35, not 221. The same byte stayed in memory; only the meaning changed.",
    engineeringCheck:
      "Before touching the code, ask whether the byte pattern changed or whether only the receiving interpretation changed.",
    expertLesson:
      "Signedness bugs appear constantly at firmware boundaries: sensor packets, serial protocols, register maps, file formats, and telemetry dashboards can all preserve the same bits while disagreeing about their meaning.",
    diagnosticChecklist: [
      "What exact bit pattern is stored right now?",
      "What type does the producer assume and what type does the consumer assume?",
      "Is the downstream control logic expecting signed or unsigned behavior?",
    ],
    practicalTransfer:
      "This exact failure shows up in calibration channels, motor-control corrections, current offsets, and network packets where one software layer silently treats a signed correction as a large positive number.",
    options: [
      {
        id: "a",
        label: "Patch A",
        title: "Treat 0xDD as 221 forever",
        detail: "Assume bytes do not change meaning once stored.",
        result:
          "The motor keeps overshooting because the controller applies a positive correction instead of a negative one.",
      },
      {
        id: "b",
        label: "Patch B",
        title: "Interpret 0xDD as -35 in signed 8-bit form",
        detail: "Keep the same bits, but read them using signed two's complement rules.",
        result:
          "Correct. The byte pattern is unchanged, but signed interpretation turns it into the negative calibration offset the controller expects.",
        correct: true,
      },
      {
        id: "c",
        label: "Patch C",
        title: "Convert 0xDD to ASCII 'D'",
        detail: "Treat the byte as a printable character instead of a numeric correction.",
        result:
          "The telemetry screen may show a symbol, but the control loop still has no usable numeric correction.",
      },
      {
        id: "d",
        label: "Patch D",
        title: "Store 0xDD in two bytes to make it safe",
        detail: "Move the same value into a wider location without changing the signed interpretation problem.",
        result:
          "Wider storage does not solve the immediate issue because the controller is still expecting an 8-bit signed meaning.",
      },
    ],
  },
  {
    id: "memory-lane-lock",
    code: "M2",
    title: "Memory Lane Lock",
    difficulty: "Moderate",
    chapterRefs: ["Memory", "Addressing"],
    story:
      "A diagnostics tool writes a 32-bit sample starting at address 0x2000, but a teammate claims the value lives only at one address because it is one variable.",
    objective: "Choose the action that correctly describes how the bytes occupy memory.",
    prompt:
      "What is the best repair note to attach to this bug report on a byte-addressed system?",
    hint:
      "A variable can be one logical object in software and still occupy several contiguous byte addresses in memory.",
    successTitle: "Address map aligned",
    successBody:
      "On a byte-addressed machine, a 32-bit value occupies four neighboring byte addresses. The address names where the first byte starts; the value itself spans contiguous storage.",
    engineeringCheck:
      "Ask whether you are talking about the software name of the object or the physical bytes that actually occupy memory.",
    expertLesson:
      "Memory-model clarity is what lets engineers reason about structs, DMA buffers, packet layouts, linker maps, and debugger views without mixing up one logical variable with the many bytes that physically represent it.",
    diagnosticChecklist: [
      "How wide is the value in bits and bytes?",
      "Is the machine byte-addressed?",
      "Which contiguous addresses must be occupied to hold the entire value?",
    ],
    practicalTransfer:
      "This mental model is essential when you inspect peripheral registers byte by byte, decode packet buffers, or explain why one struct member overlaps the next in memory.",
    options: [
      {
        id: "a",
        label: "Patch A",
        title: "A 32-bit value uses only address 0x2000",
        detail: "Say the other three bytes are invisible because the programmer named only one variable.",
        result:
          "That breaks the memory model. Hardware still stores bytes in neighboring locations even when software gives them one variable name.",
      },
      {
        id: "b",
        label: "Patch B",
        title: "A 32-bit value occupies 0x2000 through 0x2003",
        detail: "Describe the value as one logical object spread across four contiguous byte addresses.",
        result:
          "Correct. Byte-addressed memory stores a larger value in adjacent byte cells even though software may refer to it as one variable.",
        correct: true,
      },
      {
        id: "c",
        label: "Patch C",
        title: "Store the value in the address bus instead",
        detail: "Move the concept of data from memory cells to the bus wires.",
        result:
          "The bus only transports the data. Memory cells are where the bytes finally sit.",
      },
      {
        id: "d",
        label: "Patch D",
        title: "Use the value itself as the address",
        detail: "Confuse 'where' with 'what'.",
        result:
          "That mixes up address and data. The address labels the location; the bytes stored there are the data.",
      },
    ],
  },
  {
    id: "float-fracture",
    code: "M3",
    title: "Float Fracture",
    difficulty: "Advanced",
    chapterRefs: ["Basic data types", "IEEE 754"],
    story:
      "A temperature packet should send the float value 3.5, but an intern tries to push the text characters '3', '.', and '5' onto the bus.",
    objective: "Repair the data encoding path so the receiver gets the real float representation.",
    prompt:
      "Which action best explains how a float should move from software into memory and across a bus?",
    hint:
      "A float in RAM is not stored as decimal text unless the program explicitly creates a string.",
    successTitle: "Floating-point channel restored",
    successBody:
      "A float uses IEEE 754 encoding. The bus carries the encoded bytes as raw bit patterns. The receiver reconstructs the numeric value from those bytes, not from printable text digits.",
    engineeringCheck:
      "Ask whether the transport layer expects a raw binary representation or a text protocol that humans can read.",
    expertLesson:
      "Embedded interfaces fail when teams confuse representation with presentation. A value in memory is usually a packed binary encoding first, while human-readable text is a deliberate conversion step layered on top.",
    diagnosticChecklist: [
      "What binary representation does this numeric type use in memory?",
      "Did the protocol specify raw bytes or printable text?",
      "Can the receiver reconstruct the same numeric meaning from the transmitted bytes?",
    ],
    practicalTransfer:
      "This is the difference between sending telemetry as a compact binary packet versus printing values as ASCII for a terminal or log viewer.",
    options: [
      {
        id: "a",
        label: "Patch A",
        title: "Send ASCII '3.5' because humans read it easily",
        detail: "Treat the float like a text string automatically.",
        result:
          "That only works if both sides intentionally agreed to text encoding. Raw float transport normally uses the IEEE 754 byte pattern.",
      },
      {
        id: "b",
        label: "Patch B",
        title: "Send the IEEE 754 bytes for the float",
        detail: "Move the raw encoded bytes through registers, bus lines, and memory.",
        result:
          "Correct. The CPU stores 3.5f as an IEEE 754 bit pattern, and those bytes are what actually travel through hardware.",
        correct: true,
      },
      {
        id: "c",
        label: "Patch C",
        title: "Split 3.5 into two integers: 3 and 5",
        detail: "Move whole and fractional digits separately without defining a format.",
        result:
          "That changes the meaning and loses the original float format unless a separate protocol is designed around it.",
      },
      {
        id: "d",
        label: "Patch D",
        title: "Store 3.5 in one byte because it looks small",
        detail: "Ignore the actual width of a float representation.",
        result:
          "A standard 32-bit float needs four bytes. One byte cannot hold the required sign, exponent, and fraction fields.",
      },
    ],
  },
  {
    id: "pointer-labyrinth",
    code: "M4",
    title: "Pointer Labyrinth",
    difficulty: "Advanced",
    chapterRefs: ["Variables", "Pointers", "Typecasting"],
    story:
      "A packet buffer contains four bytes: 0x34, 0x12, 0x78, 0x56. The debugger now views the same memory through a uint16_t pointer on a little-endian machine.",
    objective: "Pick the interpretation that matches the actual byte layout and cast.",
    prompt:
      "What does the second 16-bit element read when `uint16_t *view = (uint16_t *)&packet[0];` and the code accesses `view[1]`?",
    hint:
      "The pointer type changes how many bytes are grouped together. Little-endian changes the byte order inside each grouped value.",
    successTitle: "Pointer tunnel mapped",
    successBody:
      "The second 16-bit element uses bytes 2 and 3: 0x78 then 0x56 in memory. On a little-endian machine those combine into 0x5678 when read as one 16-bit value.",
    engineeringCheck:
      "Separate three ideas carefully: byte order in memory, grouping size chosen by the pointer type, and which element index the code is actually addressing.",
    expertLesson:
      "Pointer bugs usually come from one wrong assumption about layout. Type casts, alignment, endianness, and indexing all influence how the same bytes are reinterpreted by the CPU.",
    diagnosticChecklist: [
      "Which bytes belong to this indexed element after the cast?",
      "How many bytes does each pointer step cover?",
      "What byte order does the architecture use when grouping those bytes into one value?",
    ],
    practicalTransfer:
      "This kind of reasoning shows up in driver code, binary protocols, sensor frames, DMA descriptors, and packed communication buffers.",
    options: [
      {
        id: "a",
        label: "Patch A",
        title: "0x1234",
        detail: "Reuse the first two bytes instead of moving to the second 16-bit group.",
        result:
          "That is the first 16-bit element, not the second one.",
      },
      {
        id: "b",
        label: "Patch B",
        title: "0x7856",
        detail: "Group the right bytes but use big-endian interpretation.",
        result:
          "The correct bytes were chosen, but the byte order is reversed for a little-endian read.",
      },
      {
        id: "c",
        label: "Patch C",
        title: "0x5678",
        detail: "Use bytes 0x78 and 0x56 as the second 16-bit value in little-endian order.",
        result:
          "Correct. Casting the buffer to a 16-bit pointer changes the grouping, and little-endian interpretation produces 0x5678.",
        correct: true,
      },
      {
        id: "d",
        label: "Patch D",
        title: "0x3412",
        detail: "Reverse the first half-word and still read the wrong location.",
        result:
          "That mixes both the address grouping and the byte order.",
      },
    ],
  },
  {
    id: "sensor-chain",
    code: "M5",
    title: "Sensor Chain Reactor",
    difficulty: "Advanced",
    chapterRefs: ["Embedded input flow", "Memory to output"],
    story:
      "A pressure sensor sends fresh readings, but the actuator logic reacts to stale data because the firmware skips one stage in the loop.",
    objective: "Restore the full embedded data path from input to memory to decision to output.",
    prompt:
      "Which control move best describes the correct order for a dependable embedded input loop?",
    hint:
      "The controller should not act on guesses. It should capture the input, store or stage it, evaluate it, then drive the output.",
    successTitle: "Signal chain synchronized",
    successBody:
      "A healthy loop senses input, stores the latest value in registers or memory, applies logic, and only then updates the output. That prevents stale or imaginary data from driving hardware.",
    engineeringCheck:
      "Ask what the freshest trustworthy input sample is, where it is stored, and whether the output decision is based on that new state or on an older stale value.",
    expertLesson:
      "Control reliability depends on causality. Good firmware respects the order sense, store, decide, act. When that order is violated, outputs become disconnected from reality even if the code still 'runs'.",
    diagnosticChecklist: [
      "Where does the new input enter the system?",
      "When is the latest sample stored or latched?",
      "Which exact state does the output logic use when deciding what to drive?",
    ],
    practicalTransfer:
      "This is the core discipline behind motor drives, sensor fusion loops, thermostats, battery management, and any closed-loop controller that must react to real hardware rather than stale software assumptions.",
    options: [
      {
        id: "a",
        label: "Patch A",
        title: "Toggle the output first, then sample later",
        detail: "Let the actuator react before the new input exists in memory.",
        result:
          "That makes the output lead the measurement, which is the wrong causal order for a control loop.",
      },
      {
        id: "b",
        label: "Patch B",
        title: "Capture input, store it, evaluate it, then drive output",
        detail: "Preserve the full sense -> store -> decide -> act pipeline.",
        result:
          "Correct. Embedded systems become reliable when data is captured first, represented in memory, then used to make output decisions.",
        correct: true,
      },
      {
        id: "c",
        label: "Patch C",
        title: "Write a default output and ignore memory",
        detail: "Bypass the data path entirely.",
        result:
          "That may be a failsafe in special cases, but it does not repair a stale-data bug in the normal control path.",
      },
      {
        id: "d",
        label: "Patch D",
        title: "Keep only the previous sample to avoid bus traffic",
        detail: "Prefer old data over new data.",
        result:
          "That preserves the stale-data problem rather than solving it.",
      },
    ],
  },
  {
    id: "deadline-storm",
    code: "M6",
    title: "Deadline Storm",
    difficulty: "Highly Technical",
    chapterRefs: ["What embedded is", "Real-time systems", "MCU vs MPU"],
    story:
      "A braking controller must react within a tightly bounded time window on every cycle. A proposal suggests offloading the decision path to a heavier general-purpose platform with less predictable latency.",
    objective: "Choose the architecture note that respects deterministic timing.",
    prompt:
      "Which design response best fits a hard real-time style requirement?",
    hint:
      "Average speed is not enough. What matters is bounded worst-case behavior.",
    successTitle: "Deadline integrity recovered",
    successBody:
      "Hard real-time problems care about predictability, not just throughput. A smaller MCU with tightly controlled execution can be a better fit than a more powerful but less deterministic system.",
    engineeringCheck:
      "Ask for the worst-case response bound, not just the average benchmark speed or headline CPU frequency.",
    expertLesson:
      "Serious embedded design is about guarantees. A spectacular average throughput number is useless if one rare latency spike still causes a missed brake event, control-loop overrun, or safety violation.",
    diagnosticChecklist: [
      "What is the hard deadline and what counts as failure?",
      "Can the platform bound worst-case latency rather than only average latency?",
      "Which architecture choice makes the timing behavior easier to prove and validate?",
    ],
    practicalTransfer:
      "This is why braking ECUs, flight surfaces, industrial safety interlocks, and medical control loops are judged by predictability and verification, not only by raw compute power.",
    options: [
      {
        id: "a",
        label: "Patch A",
        title: "Choose the fastest average CPU regardless of latency jitter",
        detail: "Optimize for benchmark speed only.",
        result:
          "Averages do not save hard real-time systems. Missing the worst-case deadline is still a failure.",
      },
      {
        id: "b",
        label: "Patch B",
        title: "Prefer a deterministic controller path with bounded timing",
        detail: "Use an execution model designed to meet repeatable deadlines.",
        result:
          "Correct. Real-time embedded design values bounded response time and predictable behavior over raw headline performance.",
        correct: true,
      },
      {
        id: "c",
        label: "Patch C",
        title: "Move the timing-critical decision to the cloud",
        detail: "Assume network timing is good enough for a braking loop.",
        result:
          "Network delay and variability make that architecture unsuitable for a tight hardware control deadline.",
      },
      {
        id: "d",
        label: "Patch D",
        title: "Compile with more optimization flags and ignore scheduling",
        detail: "Assume compilation alone guarantees timing behavior.",
        result:
          "Compiler optimization can help performance, but it does not by itself guarantee deterministic end-to-end timing.",
      },
    ],
  },
  {
    id: "bus-gate-finale",
    code: "M7",
    title: "Bus Gate Finale",
    difficulty: "Highly Technical",
    chapterRefs: ["Serial vs parallel buses", "MOSFET bridge", "Registers to voltage"],
    story:
      "A controller must send configuration data over a narrow connector to a remote board, store it in memory, and then use one control bit to drive a MOSFET gate for a cooling fan.",
    objective: "Choose the move that keeps the explanation electrically and logically correct end to end.",
    prompt:
      "Which system description best connects software, bus transfer, memory storage, GPIO, and MOSFET switching?",
    hint:
      "The same information changes form as it moves: source code value -> bits -> bus voltages -> stored bytes -> output pin voltage.",
    successTitle: "Full stack signal path secured",
    successBody:
      "A narrow connector favors serial transfer. The arriving bits are reconstructed into bytes, stored in memory, then copied into a GPIO register. When the selected GPIO bit goes HIGH, that voltage can raise a MOSFET gate and switch the fan path on.",
    engineeringCheck:
      "Narrate the whole chain without skipping layers: software meaning, binary encoding, transport, storage, register update, and final electrical effect.",
    expertLesson:
      "Expert embedded engineers can walk a value from source code all the way to a transistor gate. That chain-thinking is what makes complex systems debuggable instead of mystical.",
    diagnosticChecklist: [
      "How is the value transported across the connector: serial or parallel, and why?",
      "Where is the received state stored before it becomes an output decision?",
      "Which register bit and voltage transition finally control the transistor gate?",
    ],
    practicalTransfer:
      "This same end-to-end reasoning appears in fan drivers, relays, power stages, LED control, actuator interfaces, and remote boards connected over SPI, I2C, UART, CAN, or custom serial links.",
    options: [
      {
        id: "a",
        label: "Patch A",
        title: "Use a serial link, reconstruct bytes, store them, then drive GPIO HIGH to switch the MOSFET",
        detail: "Keep the full software -> bus -> memory -> GPIO -> transistor chain intact.",
        result:
          "Correct. This preserves both the practical wiring advantage of serial communication and the actual electrical control path to the MOSFET gate.",
        correct: true,
      },
      {
        id: "b",
        label: "Patch B",
        title: "Write the source code text straight into the MOSFET gate",
        detail: "Skip binary encoding, buses, registers, and memory.",
        result:
          "Source code text never directly reaches a transistor gate. Hardware acts on encoded logic levels and stored register states.",
      },
      {
        id: "c",
        label: "Patch C",
        title: "Use parallel only because it is always faster, even across a narrow connector",
        detail: "Ignore wiring and signal-integrity tradeoffs.",
        result:
          "Parallel is not automatically the right answer. Connector width, trace count, and timing skew all matter.",
      },
      {
        id: "d",
        label: "Patch D",
        title: "Store the configuration only in the bus and never in memory",
        detail: "Confuse transport with storage again.",
        result:
          "The bus carries the information temporarily; memory or registers are where the controller keeps usable state.",
      },
    ],
  },
];

export const revisionLore = [
  "Each mission is a technical repair job, not a memorization test.",
  "Wrong moves do not end the game. They teach why the system stayed unstable.",
  "Every solved mission unlocks the next layer of the embedded stack.",
];
