export const foundationFrequencyOptions = [
  {
    id: "1hz",
    label: "1 Hz demo",
    frequency: 1,
    note: "One decision each second. Great for seeing the idea, terrible for real CPU throughput.",
  },
  {
    id: "1khz",
    label: "1 kHz",
    frequency: 1000,
    note: "A thousand cycles per second. Good for human-scale timing experiments and very slow control.",
  },
  {
    id: "1mhz",
    label: "1 MHz",
    frequency: 1000000,
    note: "A million cycles per second. This is where embedded timing starts to feel practical.",
  },
  {
    id: "16mhz",
    label: "16 MHz",
    frequency: 16000000,
    note: "A common crystal frequency that makes serial timing and timers easier to reason about.",
  },
  {
    id: "72mhz",
    label: "72 MHz",
    frequency: 72000000,
    note: "A typical STM32F1 top-end system clock. Timing gets much tighter and more layered.",
  },
];

export const foundationWorkloadOptions = [
  { label: "1 cycle: one simple state update", value: 1 },
  { label: "4 cycles: tiny operation", value: 4 },
  { label: "40 cycles: short control path", value: 40 },
  { label: "400 cycles: meaningful firmware work", value: 400 },
  { label: "4000 cycles: larger routine", value: 4000 },
];

export const foundationBeatNarration = [
  {
    title: "Setup before the edge",
    body: "Signals are preparing. Combinational logic is settling, but the next state is not committed yet.",
  },
  {
    title: "A clock edge arrives",
    body: "Flip-flops, counters, and state machines can latch new values on this edge.",
  },
  {
    title: "The chip reacts",
    body: "The newly latched state changes what the CPU, memory, or peripheral wants to do next.",
  },
  {
    title: "The next address or control action appears",
    body: "Control signals, addresses, and register enables are now driven according to the new state.",
  },
  {
    title: "Data path settles",
    body: "Buses and logic need a little real time to become valid after the state update.",
  },
  {
    title: "Another edge makes that result usable",
    body: "The next edge can capture the result, which is why timing is about ordered windows, not magic instant changes.",
  },
  {
    title: "Outputs can now be updated",
    body: "Pins, timer flags, or register bits may change only after the relevant path has completed in time.",
  },
  {
    title: "The cycle repeats",
    body: "Digital systems repeat this pattern millions of times each second with predictable timing relationships.",
  },
];

export const heartbeatRoles = [
  {
    id: "state",
    label: "State changes on edges",
    detail: "In synchronous digital logic, registers and state machines usually update on a clock edge, not at arbitrary times.",
  },
  {
    id: "period",
    label: "Frequency and period are partners",
    detail: "Frequency tells you how many cycles happen each second. Period tells you how long one cycle lasts.",
  },
  {
    id: "throughput",
    label: "Faster clock means more opportunities",
    detail: "A faster clock gives more chances each second to fetch, compute, move data, and update outputs.",
  },
  {
    id: "limits",
    label: "But faster is never free",
    detail: "The logic path still has to settle in time. Memory, buses, and peripherals can set hard limits on useful speed.",
  },
];

export const heartbeatCards = [
  {
    title: "Good beginner metaphor",
    body: "A heartbeat analogy is useful only if it teaches rhythm, not if it makes you think the clock itself carries data or energy around the chip.",
  },
  {
    title: "Better technical picture",
    body: "The clock is a repeating timing reference. Hardware blocks use that reference to decide when to sample, latch, count, or shift.",
  },
  {
    title: "Most common beginner mistake",
    body: "People often think 'faster clock' means each instruction is automatically one cycle. Real CPUs still need multiple cycles or pipeline stages for many tasks.",
  },
];

export const genericClockSources = [
  {
    id: "rc2",
    label: "Internal RC 2 MHz",
    frequency: 2000000,
    analogy: "Simple, quick to start, but less accurate than a crystal for precise timing.",
  },
  {
    id: "rc8",
    label: "Internal RC 8 MHz",
    frequency: 8000000,
    analogy: "A common built-in choice when low cost and easy board design matter more than high precision.",
  },
  {
    id: "xtal16",
    label: "Crystal 16 MHz",
    frequency: 16000000,
    analogy: "External crystal timing is usually chosen when communication accuracy or timing stability matters more.",
  },
];

export const dividerOptions = [1, 2, 4, 8];

export const anatomyCards = [
  {
    title: "Oscillator source",
    body: "This is the raw repeating signal. It may be generated inside the chip or supplied by an external crystal or clock source.",
  },
  {
    title: "PLL",
    body: "The phase-locked loop makes a faster internal working clock from a slower source, but only within limits that the device supports.",
  },
  {
    title: "Prescalers and dividers",
    body: "A divider intentionally slows a derived clock down so a bus or peripheral does not exceed its safe operating speed.",
  },
  {
    title: "Clock domains",
    body: "The CPU, timers, buses, and communication blocks often run in different but related domains instead of all sharing one exact frequency.",
  },
  {
    title: "Enable gating",
    body: "Having a clock tree is not the same as enabling every peripheral. Many MCUs gate clocks to individual blocks for power and control reasons.",
  },
];

export const picClockProfiles = [
  { id: "31k", label: "31 kHz", frequency: 31000, ircf: "000", explanation: "Extremely slow, usually for very low-power or sleepy behavior." },
  { id: "125k", label: "125 kHz", frequency: 125000, ircf: "001", explanation: "Still slow, but easier to relate to timers and delays." },
  { id: "250k", label: "250 kHz", frequency: 250000, ircf: "010", explanation: "Good for showing how lower oscillator rates stretch instruction timing." },
  { id: "500k", label: "500 kHz", frequency: 500000, ircf: "011", explanation: "A modest internal oscillator step." },
  { id: "1m", label: "1 MHz", frequency: 1000000, ircf: "100", explanation: "A low but practical teaching speed." },
  { id: "2m", label: "2 MHz", frequency: 2000000, ircf: "101", explanation: "Balanced for simple control tasks." },
  { id: "4m", label: "4 MHz", frequency: 4000000, ircf: "110", explanation: "A classic beginner-friendly PIC speed." },
  { id: "8m", label: "8 MHz", frequency: 8000000, ircf: "111", explanation: "Fastest internal oscillator option in this teaching model." },
];

export const picSources = [
  {
    id: "internal",
    label: "Internal oscillator block",
    sourceLine: "OSCCONbits.SCS = 0b10; // switch to internal oscillator block",
    detail: "The MCU uses its built-in oscillator and the IRCF bits choose the internal rate.",
  },
  {
    id: "external",
    label: "Primary / external clock path",
    sourceLine: "OSCCONbits.SCS = 0b00; // follow the device's primary clock selection",
    detail: "The MCU follows the primary or external source configured for the part and board.",
  },
];

export const picDriverViews = [
  {
    id: "register",
    label: "Register reading",
    title: "Read PIC clock setup as a short register conversation",
    explain:
      "PIC16 clock setup is compact. You usually choose the source, select the internal frequency if needed, then remember that instruction timing is derived from the oscillator.",
  },
  {
    id: "flow",
    label: "Driver story",
    title: "Read the code as timing intent, not just bit names",
    explain:
      "The real goal is not to memorize OSCCON. The goal is to know which oscillator is active, how fast it runs, and what that means for instruction timing, delays, and peripherals.",
  },
];

export const stmSources = [
  {
    id: "hsi",
    label: "HSI 8 MHz internal",
    frequency: 8000000,
    sourceCode: "RCC_CR_HSION",
    detail: "Useful for bring-up and simpler boards. On STM32F1, HSI enters the PLL as HSI/2, not raw 8 MHz.",
  },
  {
    id: "hse",
    label: "HSE 8 MHz crystal",
    frequency: 8000000,
    sourceCode: "RCC_CR_HSEON",
    detail: "External crystal timing is commonly used when better clock accuracy is required.",
  },
];

export const stmPllMultipliers = [2, 3, 4, 6, 9];
export const stmBusDividers = [1, 2, 4, 8];

export const stmDriverViews = [
  {
    id: "register",
    label: "Register first",
    title: "Read STM32F1 clocks as an RCC sequence",
    explain:
      "Enable the source, wait for ready, configure dividers, choose the PLL path if needed, wait for PLL ready, then switch SYSCLK.",
  },
  {
    id: "driver",
    label: "Bring-up story",
    title: "Read STM32F1 clock code as a safety checklist",
    explain:
      "The order matters because you must not switch the system onto a clock path that is not stable yet, and you must keep buses inside their allowed frequencies.",
  },
];

export const flowScenarios = [
  {
    id: "flashFetch",
    label: "Fetch instruction from flash",
    headline: "Instruction fetch is a timed memory transaction",
    detail: "The program counter, flash bus, instruction register, and decode logic all move in an ordered sequence driven by the clock.",
    beats: [
      { title: "Program counter drives an address", detail: "The CPU places the next instruction address onto the program memory path." },
      { title: "Read begins", detail: "Control logic asks flash for the instruction bits at that address." },
      { title: "Data becomes valid", detail: "Flash needs real time to return the bits. They do not appear instantly." },
      { title: "Instruction register latches", detail: "A clock edge captures the opcode so the CPU can use it safely." },
      { title: "Decode selects resources", detail: "The control unit decides which registers, buses, and ALU paths are needed." },
      { title: "Execution happens", detail: "Operands move and the ALU or control path produces a result." },
      { title: "Write-back or side effect", detail: "The result reaches a register, memory location, or peripheral register." },
      { title: "Next fetch can begin", detail: "The CPU is ready to drive the next address and repeat the cycle." },
    ],
    checkpoints: [
      "A clock edge often latches state, but useful work continues between edges while signals settle.",
      "Memory access time matters because the CPU cannot decode bits until the instruction register captures them.",
      "This is why flash wait states and bus timing become important at higher frequencies.",
    ],
  },
  {
    id: "gpioReaction",
    label: "Sample input, then update output",
    headline: "Inputs and outputs are separated by ordered timing",
    detail: "A button press or sensor edge must be sampled, synchronized, processed, and only then written to an output register.",
    beats: [
      { title: "Input pin is observed", detail: "The external signal exists in the analog world before the MCU formally samples it." },
      { title: "Synchronizer stage", detail: "The input is brought safely into the chip's clocked logic domain." },
      { title: "CPU or logic reads the value", detail: "The sampled bit is now usable by software or synchronous hardware." },
      { title: "Decision point", detail: "Branch logic or control logic decides whether the output should change." },
      { title: "Output value is prepared", detail: "The new output state is formed in a register or write data path." },
      { title: "Bus write occurs", detail: "The output register is written through a timed peripheral or memory path." },
      { title: "Pin output latch updates", detail: "The visible pin state changes only after the relevant register or latch updates." },
      { title: "The new state holds", detail: "The output remains stable until later logic changes it again." },
    ],
    checkpoints: [
      "Sampling and driving are separate events. The chip does not react to an external pin at an undefined random instant.",
      "Clock-domain synchronization is a real hardware issue, not just a software detail.",
      "The time from input to visible output is a latency budget made of several smaller timed steps.",
    ],
  },
  {
    id: "uartTransmit",
    label: "Transmit bits on UART",
    headline: "Serial communication depends on divided clock timing",
    detail: "UART hardware uses the system clock to generate precise bit-time events so the TX line changes at the right moments.",
    beats: [
      { title: "Software loads transmit data", detail: "A byte is written into the UART transmit data register." },
      { title: "Baud generator starts the schedule", detail: "A derived clock creates the timing used for UART bit periods." },
      { title: "Start bit goes low", detail: "The line changes to mark the beginning of the frame." },
      { title: "First data bit is driven", detail: "The UART shifts one bit out on the next bit-time event." },
      { title: "Next data bit is driven", detail: "Each additional bit is held for its own timed interval." },
      { title: "More bits continue", detail: "The shift register and baud timing keep stepping together." },
      { title: "Final data bits leave", detail: "The serial line still depends on the clock-derived baud timing being accurate enough." },
      { title: "Frame continues to stop bit", detail: "The receiver succeeds only if both sides agree closely enough on the bit period." },
    ],
    checkpoints: [
      "Serial buses do not just 'send data'. They send data at carefully timed sampling moments.",
      "Clock accuracy matters because baud timing error accumulates across each transmitted frame.",
      "This is one reason crystals are often preferred for communication-heavy systems.",
    ],
  },
];

export const timelineTracks = [
  { id: "clock", label: "Clock edges", type: "clock" },
  { id: "control", label: "CPU / control", type: "cpu" },
  { id: "address", label: "Address / bus", type: "memory" },
  { id: "data", label: "Data path", type: "bus" },
  { id: "serial", label: "Serial timing", type: "serial" },
  { id: "io", label: "Pin / visible result", type: "gpio" },
];
