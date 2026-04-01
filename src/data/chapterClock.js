export const heartbeatCards = [
  {
    title: "Human body analogy",
    body:
      "Your heart does not carry thoughts, oxygen, or motion plans itself. It creates a rhythm so the rest of the body can act in an organized way.",
  },
  {
    title: "Microcontroller analogy",
    body:
      "The clock does the same for a microcontroller. It does not contain your application data, but it tells the CPU, memory, buses, and peripherals when each step should happen.",
  },
  {
    title: "Important technical truth",
    body:
      "A faster clock means more timing opportunities per second. It does not automatically make code good, but it gives the chip more chances to fetch, compute, sample, and update outputs.",
  },
];

export const heartbeatRoles = [
  { id: "cpu", label: "CPU", detail: "Fetches and executes instructions on each repeating timing window." },
  { id: "memory", label: "Memory", detail: "Stores and returns bits when the controller asks at the right time." },
  { id: "bus", label: "Bus", detail: "Moves bits between blocks in a predictable rhythm." },
  { id: "gpio", label: "GPIO", detail: "Samples input and updates output in sync with logic decisions." },
];

export const genericClockSources = [
  {
    id: "rc2",
    label: "Internal RC 2 MHz",
    frequency: 2000000,
    analogy: "Quick wake-up, simple setup, lower timing accuracy.",
  },
  {
    id: "rc8",
    label: "Internal RC 8 MHz",
    frequency: 8000000,
    analogy: "Common built-in source for low-part-count designs.",
  },
  {
    id: "xtal16",
    label: "Crystal 16 MHz",
    frequency: 16000000,
    analogy: "Better timing discipline, often used when communication accuracy matters.",
  },
];

export const dividerOptions = [1, 2, 4, 8];

export const anatomyCards = [
  {
    title: "Oscillator source",
    body: "The raw repeating signal. It might come from an internal RC block or an external crystal.",
  },
  {
    title: "PLL",
    body: "A multiplier stage. It takes a stable source and creates a faster working clock for the chip.",
  },
  {
    title: "Prescaler",
    body: "A divider stage. It slows a clock down for a bus or peripheral that cannot run as fast as the core.",
  },
  {
    title: "Clock domains",
    body: "Different chip regions can run at different derived speeds while still being related to one timing tree.",
  },
];

export const picClockProfiles = [
  { id: "31k", label: "31 kHz", frequency: 31000, ircf: "000", explanation: "Ultra slow, ultra low activity." },
  { id: "125k", label: "125 kHz", frequency: 125000, ircf: "001", explanation: "Good for sleepy low-power behavior." },
  { id: "250k", label: "250 kHz", frequency: 250000, ircf: "010", explanation: "Still slow, but easier to visualize than 31 kHz." },
  { id: "500k", label: "500 kHz", frequency: 500000, ircf: "011", explanation: "A modest internal oscillator step." },
  { id: "1m", label: "1 MHz", frequency: 1000000, ircf: "100", explanation: "Small jobs, low complexity, slower response." },
  { id: "2m", label: "2 MHz", frequency: 2000000, ircf: "101", explanation: "Balanced for simple control tasks." },
  { id: "4m", label: "4 MHz", frequency: 4000000, ircf: "110", explanation: "A common middle ground on classic PIC parts." },
  { id: "8m", label: "8 MHz", frequency: 8000000, ircf: "111", explanation: "Fastest internal oscillator option in this teaching model." },
];

export const picSources = [
  {
    id: "internal",
    label: "Internal oscillator block",
    scs: "1",
    sourceLine: "OSCCONbits.SCS = 1;",
    detail: "The PIC takes timing from the internal oscillator block selected through OSCCON.",
  },
  {
    id: "external",
    label: "External clock / crystal path",
    scs: "0",
    sourceLine: "OSCCONbits.SCS = 0;",
    detail: "The PIC follows the clock source chosen by the device configuration bits or external clock path.",
  },
];

export const picDriverViews = [
  {
    id: "register",
    label: "Register reading",
    title: "Read the PIC like a direct register driver",
    explain:
      "PIC clock setup is compact. A few fields in OSCCON control where the clock comes from and which internal frequency is selected.",
  },
  {
    id: "flow",
    label: "Driver story",
    title: "Read the intent behind the code",
    explain:
      "The driver first chooses the clock source, then picks the internal rate, then reasons about the instruction clock the CPU will actually execute.",
  },
];

export const stmSources = [
  {
    id: "hsi",
    label: "HSI 8 MHz internal",
    frequency: 8000000,
    sourceCode: "RCC_CR_HSION",
    detail: "Good for bring-up and simpler boards because it does not need an external crystal.",
  },
  {
    id: "hse",
    label: "HSE 8 MHz external crystal",
    frequency: 8000000,
    sourceCode: "RCC_CR_HSEON",
    detail: "Common when tighter timing or communication accuracy is needed.",
  },
];

export const stmPllMultipliers = [2, 3, 4, 6, 9];
export const stmBusDividers = [1, 2, 4, 8];

export const stmDriverViews = [
  {
    id: "register",
    label: "Register first",
    title: "Read STM32F1 as RCC register writes",
    explain:
      "STM32F1 clock code often begins in RCC->CR and RCC->CFGR. You enable a source, wait until it is ready, choose PLL and bus dividers, then switch SYSCLK.",
  },
  {
    id: "driver",
    label: "Driver style",
    title: "Read STM32F1 as a structured bring-up routine",
    explain:
      "The same behavior can be expressed as steps: enable source, wait for ready, configure PLL, divide buses safely, then select the final system clock.",
  },
];

export const beatNarration = [
  {
    id: 0,
    title: "Fetch",
    detail: "The CPU uses the clock edge to fetch the next instruction bytes from memory or flash.",
  },
  {
    id: 1,
    title: "Decode and prepare",
    detail: "Control logic decides which registers, ALU paths, or bus actions are needed next.",
  },
  {
    id: 2,
    title: "Move data",
    detail: "A register write, memory read, or bus transfer happens at a timed point that the hardware understands.",
  },
  {
    id: 3,
    title: "Observe and react",
    detail: "GPIO input can be sampled, logic can branch, and outputs can be updated for the next visible effect.",
  },
];

export const busModes = [
  {
    id: "serial",
    label: "Serial bus",
    headline: "One data wire, many clock edges",
    detail: "The receiver watches one bit after another on repeated clock moments.",
  },
  {
    id: "parallel",
    label: "Parallel bus",
    headline: "Many wires, one shared beat",
    detail: "Several bits become valid together on the same clock event.",
  },
];

export const timelineTracks = [
  {
    id: "clock",
    label: "Clock",
    type: "clock",
  },
  {
    id: "cpu",
    label: "CPU pipeline",
    type: "cpu",
  },
  {
    id: "memory",
    label: "Memory",
    type: "memory",
  },
  {
    id: "serial",
    label: "Serial bus",
    type: "serial",
  },
  {
    id: "parallel",
    label: "Parallel bus",
    type: "parallel",
  },
  {
    id: "gpio",
    label: "GPIO",
    type: "gpio",
  },
];
