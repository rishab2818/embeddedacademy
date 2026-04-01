export const controllerProfiles = [
  {
    id: "pic16",
    label: "PIC16",
    shortTitle: "PIC16",
    chapterTitle: "PIC16 bus view",
    vendor: "Microchip",
    family: "Enhanced mid-range PIC16F1 style",
    bitWidth: 8,
    dataBusBits: 8,
    instructionBusBits: 14,
    visibleAddressBits: 12,
    architecture: "Dual-bus Harvard",
    registerLabel: "WREG + file registers",
    widthMeaning:
      "An 8-bit controller naturally handles one byte at a time in its main ALU path. Multi-byte work is still possible, but it takes more instruction steps.",
    widthWarning:
      "8-bit describes the CPU's natural data width. It does not mean every address is only 8 bits long, and it does not mean the whole chip can only count to 255.",
    busLook:
      "Classic PIC16 keeps program fetch and data movement on separate paths, which is why it feels very register-centric and efficient for small control tasks.",
    compileToolchain: "MPLAB XC8",
    instructionFetchNote:
      "Program instructions are fetched on a separate 14-bit instruction path while data work happens on an 8-bit data bus.",
    addressNote:
      "This animation shows only the lower 12 address bits of a small data-space view so the bus stays readable on screen.",
    memoryCells: [
      { address: 0x000c, label: "PORTA", value: 0x2d, note: "8-bit peripheral file register" },
      { address: 0x0013, label: "STATUS", value: 0x18, note: "flags and bank state" },
      { address: 0x0021, label: "RAM temp", value: 0x63, note: "general-purpose RAM byte" },
      { address: 0x0091, label: "ADRESH", value: 0x80, note: "ADC result high byte" },
    ],
    busFacts: [
      "Separate instruction and data paths are a Harvard-style design choice.",
      "The data bus is 8 bits wide, so one byte is the natural transfer chunk.",
      "Peripheral registers often look like individual named bytes in the memory map.",
    ],
  },
  {
    id: "pic24",
    label: "PIC24",
    shortTitle: "PIC24",
    chapterTitle: "PIC24 bus view",
    vendor: "Microchip",
    family: "PIC24 / dsPIC style 16-bit MCU",
    bitWidth: 16,
    dataBusBits: 16,
    instructionBusBits: 24,
    visibleAddressBits: 16,
    architecture: "Modified Harvard",
    registerLabel: "W0-W15 register set",
    widthMeaning:
      "A 16-bit controller naturally adds, shifts, compares, and moves 16-bit values in one main step. That is a comfortable middle ground between small-control and wider arithmetic work.",
    widthWarning:
      "16-bit does not mean the whole system is limited to 65,536 things. It mainly tells you the natural width of the core's data path and registers.",
    busLook:
      "PIC24 and dsPIC devices still separate instruction fetch from data activity, but the data side is wider and the register set feels more CPU-like than classic 8-bit PIC parts.",
    compileToolchain: "MPLAB XC16",
    instructionFetchNote:
      "A 24-bit program instruction stream feeds the CPU while a separate 16-bit data path handles RAM and peripheral work.",
    addressNote:
      "This animation shows the lower 16 address bits of data space to keep the signal picture readable.",
    memoryCells: [
      { address: 0x0800, label: "buffer[0]", value: 0x1234, note: "16-bit RAM value" },
      { address: 0x0210, label: "PORTB", value: 0x00f3, note: "port register" },
      { address: 0x0300, label: "TMR1", value: 0x4567, note: "16-bit timer register" },
      { address: 0x0340, label: "ADCBUF0", value: 0x02a1, note: "ADC sample register" },
    ],
    busFacts: [
      "The instruction side is 24 bits wide, but data memory and peripherals operate on a separate 16-bit data bus.",
      "The wider data path means 16-bit arithmetic feels natural instead of being stitched together byte by byte.",
      "Many peripherals are still memory-mapped, but the programmer sees more CPU-style working registers.",
    ],
  },
  {
    id: "stm32",
    label: "STM32",
    shortTitle: "STM32",
    chapterTitle: "STM32 bus view",
    vendor: "STMicroelectronics",
    family: "STM32F1 / Cortex-M3 style",
    bitWidth: 32,
    dataBusBits: 32,
    instructionBusBits: 32,
    visibleAddressBits: 16,
    architecture: "Load/store 32-bit Cortex-M",
    registerLabel: "r0-r15 register set",
    widthMeaning:
      "A 32-bit controller naturally works on 32-bit registers and arithmetic. That makes pointers, counters, structured data, and memory-mapped peripherals feel much wider and more uniform.",
    widthWarning:
      "32-bit usually means the core, registers, and main address model are 32-bit friendly. It does not mean every physical bus everywhere on the chip is always 32 wires wide in every moment.",
    busLook:
      "STM32 style designs are strongly memory-mapped: RAM, Flash, and peripherals all live in an address space, and the Cortex-M core performs explicit load and store operations.",
    compileToolchain: "arm-none-eabi-gcc",
    instructionFetchNote:
      "The Cortex-M3 core uses separate code and data/system interfaces internally, then reaches Flash, SRAM, and peripherals through the bus matrix and memory map.",
    addressNote:
      "STM32 uses a much larger address space than we can draw here, so this animation shows only the lower 16 address bits of the selected address.",
    memoryCells: [
      { address: 0x0800, label: "Flash word", value: 0x20001004, note: "example fetched word" },
      { address: 0x0010, label: "SRAM[0x20000010]", value: 0x12345678, note: "32-bit RAM value" },
      { address: 0x0808, label: "GPIOA_IDR", value: 0x00000011, note: "input data register" },
      { address: 0x080c, label: "GPIOA_ODR", value: 0x000000a5, note: "output data register" },
    ],
    busFacts: [
      "The Cortex-M3 core is a 32-bit RISC load/store design.",
      "Peripherals such as GPIO and timers appear as memory-mapped addresses.",
      "The core can fetch instructions and access data through separate internal interfaces, which helps performance.",
    ],
  },
];

export const busOperations = [
  {
    id: "read",
    label: "Read",
    arrow: "Memory -> CPU",
    summary: "The CPU places an address on the address bus, then memory or a peripheral returns data on the data bus.",
  },
  {
    id: "write",
    label: "Write",
    arrow: "CPU -> Memory",
    summary: "The CPU places an address on the address bus and drives the data bus with the value that should be stored.",
  },
];

export const busStepLabels = [
  { id: "choose", label: "Choose address" },
  { id: "address", label: "Drive address bus" },
  { id: "data", label: "Move data" },
  { id: "commit", label: "Complete transfer" },
];

export const compileTargets = [
  {
    id: "pic16",
    label: "PIC16 target",
    toolchain: "MPLAB XC8",
    assemblyLabel: "Small register-centric assembly",
    assembly: [
      "MOVF  sensor, W",
      "SUBLW 50",
      "BTFSC STATUS, C",
      "GOTO  led_on",
      "CLRF  ledState",
      "GOTO  done",
      "led_on:",
      "MOVLW 0x01",
      "MOVWF ledState",
      "done:",
      "RETURN",
    ],
    objectBits: [
      "0010 1010 0001 0011",
      "0011 1100 0011 0010",
      "0001 0100 1000 0110",
    ],
    finalArtifact: "main.hex ready for PIC programming tools",
    targetNote: "XC8 aims at an 8-bit PIC instruction set, register file, and device-specific linker script.",
  },
  {
    id: "pic24",
    label: "PIC24 target",
    toolchain: "MPLAB XC16",
    assemblyLabel: "16-bit working-register assembly",
    assembly: [
      "MOV   sensor, W0",
      "MOV   #50, W1",
      "CP    W0, W1",
      "BRA   GT, led_on",
      "CLR   ledState",
      "BRA   done",
      "led_on:",
      "MOV   #1, W2",
      "MOV   W2, ledState",
      "done:",
      "RETURN",
    ],
    objectBits: [
      "1001 0000 0000 0001 0000 0000",
      "0110 0110 0011 0001 0000 0100",
      "0101 1110 0000 1000 0000 0011",
    ],
    finalArtifact: "main.hex or main.elf for PIC24 / dsPIC flashing",
    targetNote: "XC16 generates code for the wider 16-bit data path and working-register model used by PIC24 and dsPIC devices.",
  },
  {
    id: "stm32",
    label: "STM32 target",
    toolchain: "arm-none-eabi-gcc",
    assemblyLabel: "ARM Cortex-M load/store assembly",
    assembly: [
      "LDR   r1, [r0]",
      "CMP   r1, #50",
      "BLE   led_off",
      "MOVS  r2, #1",
      "STR   r2, [r3]",
      "BX    lr",
      "led_off:",
      "MOVS  r2, #0",
      "STR   r2, [r3]",
      "BX    lr",
    ],
    objectBits: [
      "0110 1000 0000 0001 0000 0000 0001 0011",
      "0010 1001 0011 0010 0000 0000 0011 0010",
      "0110 0000 0001 1010 0000 0011 0000 0010",
    ],
    finalArtifact: "firmware.elf plus .bin/.hex image for STM32 flashing",
    targetNote: "The Arm toolchain emits Cortex-M machine code, then links it to a memory map that places code in Flash and data in SRAM/peripheral space.",
  },
];

export const compileStageOrder = [
  {
    id: "requirement",
    label: "Requirement",
    title: "A human goal comes first",
    why: "Computers do not invent the goal. A person states the desired behavior before any syntax exists.",
  },
  {
    id: "source",
    label: "Source",
    title: "C code expresses the idea in a human-friendly formal language",
    why: "Names, types, and control flow help humans organize logic without thinking directly in raw bit patterns.",
  },
  {
    id: "preprocess",
    label: "Preprocess",
    title: "The preprocessor expands macros and included text",
    why: "This stage cleans up convenience features like #define and #include so the compiler sees a fuller source file.",
  },
  {
    id: "compile",
    label: "Compile",
    title: "The compiler reasons about meaning and legality",
    why: "It checks syntax, types, and control flow, then decides how the behavior can be implemented efficiently for the target architecture.",
  },
  {
    id: "assemble",
    label: "Assemble",
    title: "Assembly mnemonics turn into numeric opcodes",
    why: "The assembler replaces instruction names, labels, and symbolic operands with machine-readable fields and addresses.",
  },
  {
    id: "link",
    label: "Link",
    title: "Object pieces become one final program image",
    why: "The linker combines your object files, libraries, startup code, and memory map into something the chip can actually load from Flash.",
  },
  {
    id: "flash",
    label: "Flash",
    title: "Bits land in non-volatile memory on the chip",
    why: "At this point the output is no longer just a file on your computer. It becomes physical binary data stored in the microcontroller's program memory.",
  },
];

export const compileExample = {
  requirement: [
    "If the sensor value is above 50, turn the LED state on.",
    "Otherwise, turn the LED state off.",
  ],
  source: [
    "#define LIMIT 50",
    "volatile int ledState = 0;",
    "",
    "void update(int sensor) {",
    "  if (sensor > LIMIT) {",
    "    ledState = 1;",
    "  } else {",
    "    ledState = 0;",
    "  }",
    "}",
  ],
  preprocess: [
    "volatile int ledState = 0;",
    "",
    "void update(int sensor) {",
    "  if (sensor > 50) {",
    "    ledState = 1;",
    "  } else {",
    "    ledState = 0;",
    "  }",
    "}",
  ],
  compile: [
    "1. Create a comparison between sensor and constant 50.",
    "2. Build two possible paths: true branch and false branch.",
    "3. Mark ledState as memory that must really be written because it is volatile.",
    "4. Choose branch instructions and store instructions suitable for the target CPU.",
  ],
  link: [
    "startup.o + update.o + runtime library + linker script",
    "-> place code in Flash region",
    "-> place ledState in RAM region",
    "-> resolve final addresses",
  ],
  flash: [
    "Programmer writes the final image into on-chip Flash.",
    "At reset, the CPU fetches the first instruction bits from program memory and starts executing.",
  ],
};

export const binaryReasonCards = [
  {
    title: "Transistors switch more reliably between two broad states",
    body: "Real hardware is analog underneath, but digital design becomes robust when the circuit only needs to distinguish LOW from HIGH instead of many tiny voltage levels.",
  },
  {
    title: "Noise margins stay larger in binary systems",
    body: "If a wire wiggles a little because of heat, interference, or imperfect edges, a wide LOW zone and a wide HIGH zone are easier to interpret safely.",
  },
  {
    title: "Logic gates are simpler when the states are only 0 and 1",
    body: "AND, OR, NOT, XOR, storage cells, and clocks become practical because the hardware only needs to decide between two switching conditions.",
  },
  {
    title: "Binary still scales to big ideas",
    body: "Text, pictures, audio, addresses, instructions, and floating-point numbers all become long patterns of 1s and 0s. Two symbols are enough when you combine many of them.",
  },
];

