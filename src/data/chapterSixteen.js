export const microcontrollerPrimerItems = [
  {
    title: "CPU core",
    body: "The CPU is the decision-making engine. It fetches instructions, decodes them, works on data in registers, and tells the rest of the microcontroller what to do next.",
  },
  {
    title: "Memory",
    body: "Flash usually stores the long-term program image, RAM stores changing runtime state, and some devices add cache, EEPROM, tightly coupled RAM, or external memory interfaces.",
  },
  {
    title: "Peripherals",
    body: "Peripherals are hardware assistants such as GPIO, timers, UART, SPI, I2C, ADC, DAC, PWM, DMA, watchdogs, and interrupt controllers. They let the CPU interact with the real world efficiently.",
  },
  {
    title: "Buses and clocks",
    body: "Internal buses move addresses and data between blocks, while clocks create the timing rhythm that lets each transfer and peripheral action happen in an ordered way.",
  },
];

export const systemBlocks = [
  {
    id: "cpu",
    label: "CPU core",
    kicker: "Brain",
    summary:
      "Executes instructions, performs arithmetic and logic, branches through code, and coordinates the rest of the chip through registers and control signals.",
    beginnerView:
      "This is the part most people imagine when they say 'the microcontroller is running code.'",
    expertView:
      "In practice this means program counter, decoder, register file, ALU, branch/control logic, and often interrupt entry and pipeline behavior.",
    whenUsed:
      "Always active whenever firmware is fetching instructions, making decisions, servicing interrupts, or configuring peripherals.",
    watchOut:
      "The CPU is not the whole chip. It depends on clocks, memories, buses, and peripherals to make those instructions matter in hardware.",
    related: ["flash", "ram", "bus", "interrupt", "gpio"],
  },
  {
    id: "clock",
    label: "Clock and reset",
    kicker: "Rhythm",
    summary:
      "Provides the timing base that lets the core, buses, timers, serial peripherals, and converters operate in an ordered and repeatable way.",
    beginnerView:
      "Without a stable timing source, the chip has no reliable pace for fetching, sampling, counting, or communicating.",
    expertView:
      "Real devices use clock trees, PLLs, startup oscillators, reset supervisors, and domain dividers to keep the system legal and stable.",
    whenUsed:
      "Shows up in UART baud generation, timer periods, PWM frequency, ADC sampling rate, and worst-case execution timing.",
    watchOut:
      "A faster clock is not automatically better. Accuracy, stability, legal limits, and downstream timing assumptions matter just as much.",
    related: ["cpu", "timer", "adc", "bus"],
  },
  {
    id: "flash",
    label: "Flash / program memory",
    kicker: "Stored firmware",
    summary:
      "Keeps the program image and constants when power is removed, so the chip can boot and fetch instructions again next time it starts.",
    beginnerView:
      "This is where your compiled firmware lives long-term.",
    expertView:
      "Instruction fetches may come directly from flash, through prefetch logic, through caches, or from copied hot routines depending on the MCU family.",
    whenUsed:
      "Important during boot, instruction fetch, constant lookup tables, calibration data, and field firmware updates.",
    watchOut:
      "Flash is not the same as fast working memory. It is persistent and useful, but it has different write and access characteristics than RAM.",
    related: ["cpu", "cache", "bus", "ram"],
  },
  {
    id: "ram",
    label: "RAM / working memory",
    kicker: "Live state",
    summary:
      "Holds changing values such as variables, buffers, stack frames, DMA targets, and temporary state while the program runs.",
    beginnerView:
      "Flash keeps the script. RAM keeps the things that keep changing while the script runs.",
    expertView:
      "Different RAM regions may exist for stack, heap, DMA-safe buffers, tightly coupled memory, or fast deterministic access.",
    whenUsed:
      "Shows up whenever a sensor sample is stored, a communication buffer fills, an interrupt saves context, or the stack grows during function calls.",
    watchOut:
      "Running out of RAM or placing the wrong buffer in the wrong region can break a system even if the source code logic is otherwise correct.",
    related: ["cpu", "dma", "bus", "flash"],
  },
  {
    id: "bus",
    label: "Bus fabric",
    kicker: "Internal roads",
    summary:
      "Moves addresses and payloads between CPU, flash, SRAM, DMA, timers, GPIO, ADC, and serial peripherals inside the chip.",
    beginnerView:
      "Think of it as the road system inside the microcontroller.",
    expertView:
      "Real MCUs may use separate code/data interfaces, AHB/APB style buses, bridges, arbitration, wait states, and memory-mapped peripherals.",
    whenUsed:
      "Relevant every time a register is read or written, an instruction is fetched, a DMA transfer runs, or a peripheral returns a result.",
    watchOut:
      "Performance problems are often traffic problems. The CPU can be fast while a bus path still becomes the bottleneck.",
    related: ["cpu", "flash", "ram", "dma", "timer", "gpio"],
  },
  {
    id: "gpio",
    label: "GPIO and pin matrix",
    kicker: "Digital edge",
    summary:
      "Turns internal register decisions into real pin voltages and lets external voltages become readable digital input state.",
    beginnerView:
      "GPIO is how the chip touches LEDs, buttons, chip-select lines, enable pins, and other simple digital signals.",
    expertView:
      "Real pins support mode selection, pull resistors, input buffers, output drivers, alternate functions, interrupt edges, and electrical limits.",
    whenUsed:
      "Used for direct digital I/O and as the front door for alternate functions like SPI, I2C, UART, PWM, and interrupts.",
    watchOut:
      "A GPIO pin cannot directly power every load. Current limits, voltage levels, pull-ups, and driver stages still matter.",
    related: ["cpu", "timer", "comms", "interrupt"],
  },
  {
    id: "timer",
    label: "Timers, counters, PWM",
    kicker: "Time engine",
    summary:
      "Count clock ticks, generate periodic events, measure time, trigger ADC sampling, create PWM waveforms, and schedule real-time behavior.",
    beginnerView:
      "Timers are the hardware blocks that keep exact count of time without the CPU manually incrementing everything in software.",
    expertView:
      "They support prescalers, auto-reload values, input capture, output compare, quadrature decoding, one-pulse modes, and event triggering.",
    whenUsed:
      "Used in blinking, motor control, servo control, input capture, pulse measurement, real-time scheduling, PWM dimming, and sampling loops.",
    watchOut:
      "Timer behavior only makes sense if the clock source, divider, compare values, and pin routing are understood together.",
    related: ["clock", "gpio", "adc", "cpu"],
  },
  {
    id: "adc",
    label: "ADC / analog front end",
    kicker: "Real-world input",
    summary:
      "Converts an analog voltage from sensors or measurement circuitry into a digital number the CPU can store, scale, filter, and reason about.",
    beginnerView:
      "This is the bridge from changing real-world voltage to bits in memory.",
    expertView:
      "Real ADC use involves resolution, sample time, reference voltage, input impedance, trigger timing, quantization error, and calibration.",
    whenUsed:
      "Used with thermistors, light sensors, potentiometers, current shunts, battery monitors, microphones, and many analog transducers.",
    watchOut:
      "An ADC reading is not magic truth. Reference accuracy, noise, source impedance, grounding, and sampling strategy all affect quality.",
    related: ["clock", "timer", "ram", "cpu"],
  },
  {
    id: "dac",
    label: "DAC / analog output",
    kicker: "Analog drive",
    summary:
      "Turns a digital value inside the controller into a proportional analog voltage or current-oriented analog stage.",
    beginnerView:
      "It is the reverse bridge of the ADC: bits back into an analog level.",
    expertView:
      "Many designs use DAC plus buffering or filtering, while other designs emulate analog behavior using PWM and external filtering instead of a true DAC.",
    whenUsed:
      "Used for control references, waveform generation, analog setpoints, and biasing external circuits.",
    watchOut:
      "Not every MCU has a true DAC. Many low-cost parts rely on PWM plus analog filtering when a smooth output is needed.",
    related: ["timer", "gpio", "cpu", "bus"],
  },
  {
    id: "comms",
    label: "Communication engines",
    kicker: "Off-chip conversation",
    summary:
      "Hardware blocks like UART, SPI, I2C, CAN, USB, and Ethernet let the controller exchange data with sensors, memories, radios, displays, and other controllers.",
    beginnerView:
      "These peripherals are translators between internal register values and external digital conversations on wires.",
    expertView:
      "Each protocol has its own framing, timing, electrical assumptions, topology, arbitration rules, and typical use cases.",
    whenUsed:
      "Used to connect IMUs, EEPROM, displays, motor drivers, modems, wireless chips, other MCUs, and debug consoles.",
    watchOut:
      "Protocol choice is a system decision: wire count, speed, robustness, latency, and software complexity all matter.",
    related: ["gpio", "bus", "dma", "interrupt"],
  },
  {
    id: "interrupt",
    label: "Interrupt system",
    kicker: "Urgent events",
    summary:
      "Lets hardware events interrupt the normal instruction stream so urgent work can be handled quickly and then returned to the main flow.",
    beginnerView:
      "Interrupts are how the chip says, 'Something important happened right now, deal with it.'",
    expertView:
      "Priority, latency, nesting, context save/restore, jitter, and shared-data discipline become central in real interrupt design.",
    whenUsed:
      "Used for timers, external pin edges, serial receive events, DMA completion, ADC conversion complete, and fault handling.",
    watchOut:
      "Poor interrupt design can create race conditions, missed deadlines, stack pressure, and systems that become hard to reason about.",
    related: ["cpu", "timer", "comms", "adc"],
  },
  {
    id: "dma",
    label: "DMA / data mover",
    kicker: "Traffic offload",
    summary:
      "Moves data between peripherals and memory with little or no CPU involvement, which helps throughput and frees the core for control and logic work.",
    beginnerView:
      "DMA is a helper engine that copies data for you.",
    expertView:
      "It matters for streaming ADC, SPI, UART, audio, display refresh, and memory-to-memory operations where bus ownership and buffer placement become important.",
    whenUsed:
      "Used when a peripheral produces or consumes many bytes quickly and the CPU should not waste cycles moving each one manually.",
    watchOut:
      "DMA helps performance, but now buffer ownership, completion timing, and cache coherency on larger MCUs must be handled carefully.",
    related: ["ram", "bus", "comms", "adc"],
  },
  {
    id: "cache",
    label: "Cache and accelerators",
    kicker: "Optional speed-up",
    summary:
      "Some larger microcontrollers add caches, prefetch, tightly coupled memory, or acceleration logic so repeated code and data access can happen faster.",
    beginnerView:
      "This is not present on every MCU, but it becomes important as cores and memory systems get faster and more complex.",
    expertView:
      "Caches reduce average access cost but can complicate timing determinism, DMA coherence, and worst-case analysis if the design is not careful.",
    whenUsed:
      "Shows up in higher-performance Cortex-M7 style parts, graphics-heavy MCUs, and systems with external memory.",
    watchOut:
      "Never teach cache as universal MCU behavior. Small controllers may have none, while larger ones need explicit cache-aware software design.",
    related: ["flash", "ram", "bus", "dma", "cpu"],
  },
];

export const gpioModes = [
  {
    id: "input",
    label: "Digital input",
    headline: "External voltage becomes a readable bit",
    summary:
      "A button, switch, hall sensor, or digital output from another chip changes the pin voltage first. The GPIO input path samples it and software reads the corresponding input register bit later.",
    useCases: ["Buttons and keypads", "Limit switches", "Interrupt edge detection", "Digital-ready sensors"],
    caution:
      "Inputs need correct voltage levels, pull-ups or pull-downs when required, and protection against bouncing or noise.",
    beats: [
      {
        label: "Beat 1",
        title: "The outside world changes the pin",
        detail: "A switch closes or another device drives the wire HIGH or LOW. The GPIO hardware did not create this event; it is reacting to it.",
        active: ["pad", "pull"],
      },
      {
        label: "Beat 2",
        title: "The input buffer recognizes the logic level",
        detail: "The pin voltage enters the digital input buffer, which decides whether the level is a valid 1 or 0 according to the device thresholds.",
        active: ["pad", "input", "pull"],
      },
      {
        label: "Beat 3",
        title: "The state appears in a GPIO register",
        detail: "The port input register now reflects the pin state so software or an interrupt controller can observe it.",
        active: ["input", "register", "interrupt"],
      },
      {
        label: "Beat 4",
        title: "The CPU reacts",
        detail: "Firmware reads the bit or enters an interrupt service routine, then decides what to do next.",
        active: ["register", "cpu", "interrupt"],
      },
    ],
  },
  {
    id: "output",
    label: "Digital output",
    headline: "A register write becomes a physical voltage",
    summary:
      "The CPU or a peripheral writes a bit value, the GPIO output driver takes over, and the pin begins actively driving a HIGH or LOW level to the outside world.",
    useCases: ["LED control", "Chip enable pins", "Relays through driver stages", "Simple logic outputs"],
    caution:
      "A GPIO pin can drive logic-level loads directly, but heavier loads usually need a transistor, MOSFET, relay driver, or H-bridge between the MCU and the actuator.",
    beats: [
      {
        label: "Beat 1",
        title: "Firmware writes an output register bit",
        detail: "A CPU instruction stores 1 or 0 into the GPIO output data register or bit-set/reset register.",
        active: ["cpu", "register"],
      },
      {
        label: "Beat 2",
        title: "The output driver takes control",
        detail: "The port logic enables the output driver transistors for that pin and prepares to source or sink current within its ratings.",
        active: ["register", "output", "mux"],
      },
      {
        label: "Beat 3",
        title: "The pin voltage changes",
        detail: "The physical pin now becomes HIGH or LOW, which the external circuit sees as a real electrical command.",
        active: ["output", "pad"],
      },
      {
        label: "Beat 4",
        title: "The outside circuit responds",
        detail: "An LED lights, an enable line changes state, or a driver transistor turns on and energizes a larger load.",
        active: ["pad", "driver", "load"],
      },
    ],
  },
  {
    id: "alternate",
    label: "Alternate function",
    headline: "A peripheral block borrows the pin",
    summary:
      "The pin is no longer controlled as plain GPIO. Instead, the alternate-function matrix routes a timer, SPI, I2C, UART, or another peripheral to that pad.",
    useCases: ["SPI signals", "UART TX/RX", "PWM outputs", "I2C SCL/SDA"],
    caution:
      "If the alternate-function mapping or pin mode is wrong, the peripheral may work internally while nothing useful appears on the pin.",
    beats: [
      {
        label: "Beat 1",
        title: "Software selects the alternate function",
        detail: "Registers configure the pin mode so the normal GPIO path gives way to a specific peripheral block.",
        active: ["cpu", "register", "mux"],
      },
      {
        label: "Beat 2",
        title: "The peripheral generates or samples the signal",
        detail: "A timer, SPI engine, or UART block now becomes the real source or sink of the pin activity.",
        active: ["peripheral", "mux"],
      },
      {
        label: "Beat 3",
        title: "The mux routes that signal to the pad",
        detail: "The alternate-function matrix connects the selected peripheral signal to the physical pin driver or input path.",
        active: ["peripheral", "mux", "pad"],
      },
      {
        label: "Beat 4",
        title: "Another device sees the protocol signal",
        detail: "The outside device now observes a clock line, a chip-select edge, a UART frame, or a PWM waveform rather than a plain GPIO level.",
        active: ["pad", "device", "load"],
      },
    ],
  },
  {
    id: "analog",
    label: "Analog pin mode",
    headline: "The digital path gets out of the way",
    summary:
      "For ADC and other analog uses, the pin is placed in analog mode so the input buffer and digital switching noise interfere less with the measurement.",
    useCases: ["Thermistors", "Battery monitoring", "Potentiometers", "Current sensing"],
    caution:
      "Analog mode is about signal integrity. Sampling quality still depends on source impedance, reference quality, grounding, and timing.",
    beats: [
      {
        label: "Beat 1",
        title: "A sensor creates an analog voltage",
        detail: "A thermistor divider, light sensor, or current shunt produces a voltage that can vary continuously rather than only HIGH or LOW.",
        active: ["sensor", "pad"],
      },
      {
        label: "Beat 2",
        title: "The pin is switched into analog mode",
        detail: "The GPIO block reduces digital interference and routes the signal toward the analog front end instead of the digital input buffer.",
        active: ["pad", "analog", "mux"],
      },
      {
        label: "Beat 3",
        title: "The ADC samples the voltage",
        detail: "A sample-and-hold stage captures the sensor voltage long enough for the converter to quantize it into a digital number.",
        active: ["analog", "adc", "clock"],
      },
      {
        label: "Beat 4",
        title: "The digital result lands in a register",
        detail: "Firmware can now read, filter, scale, or log the converted value as an ordinary number.",
        active: ["adc", "register", "cpu"],
      },
    ],
  },
];

export const communicationProtocols = [
  {
    id: "spi",
    label: "SPI",
    wires: "SCK, MOSI, MISO, CS",
    topology: "Point-to-point or one controller with several chip-select lines",
    bestFor: "Fast sensors, displays, ADCs, DACs, flash memory, RF chips",
    whyItFits:
      "SPI is simple, fast, full-duplex, and easy to reason about when one controller actively clocks each bit and explicitly chooses the target device with chip-select.",
    caution:
      "It uses more wires than I2C and normally needs one chip-select per target device.",
    beats: [
      {
        label: "Step 1",
        title: "Controller selects the device",
        detail: "The controller pulls the target chip-select line active so only one device pays attention.",
        active: ["controller", "cs", "device"],
      },
      {
        label: "Step 2",
        title: "The controller generates the clock",
        detail: "Each clock edge defines when bits should be launched and sampled on MOSI and MISO.",
        active: ["controller", "clock", "wire"],
      },
      {
        label: "Step 3",
        title: "Data shifts both ways",
        detail: "MOSI carries outgoing command or address bits while MISO can return status or data at the same time.",
        active: ["controller", "wire", "device"],
      },
      {
        label: "Step 4",
        title: "The peripheral register changes",
        detail: "The sensor, memory, or converter receives the command and updates its internal state or returns the requested bytes.",
        active: ["device", "memory", "wire"],
      },
    ],
    examples: ["IMU over SPI", "External flash", "Fast display controller", "DAC command stream"],
  },
  {
    id: "i2c",
    label: "I2C",
    wires: "SCL, SDA",
    topology: "Two-wire shared bus with addressed devices",
    bestFor: "Configuration sensors, EEPROM, RTCs, PMICs, board-level helpers",
    whyItFits:
      "I2C saves wires and supports many addressed devices on one shared bus, which makes it attractive for board-level sensor and control networks.",
    caution:
      "It is slower than SPI, relies on pull-up resistors and open-drain behavior, and needs careful attention to bus capacitance and addressing.",
    beats: [
      {
        label: "Step 1",
        title: "The controller starts the bus",
        detail: "The controller creates a START condition so every attached device knows a new I2C transaction is beginning.",
        active: ["controller", "wire", "device"],
      },
      {
        label: "Step 2",
        title: "The address is broadcast",
        detail: "The controller puts the target device address plus read/write bit on SDA while toggling SCL.",
        active: ["controller", "wire", "memory"],
      },
      {
        label: "Step 3",
        title: "The addressed device acknowledges",
        detail: "Only the matching device responds with ACK, which is how the shared bus avoids every device talking at once.",
        active: ["device", "wire", "controller"],
      },
      {
        label: "Step 4",
        title: "Registers or data bytes transfer",
        detail: "Command bytes, register addresses, and payload bytes move across the same shared two-wire bus before a STOP condition ends the exchange.",
        active: ["controller", "wire", "device", "memory"],
      },
    ],
    examples: ["Temperature sensor", "RTC", "EEPROM", "Power-management helper"],
  },
  {
    id: "uart",
    label: "UART",
    wires: "TX, RX",
    topology: "Point-to-point asynchronous serial link",
    bestFor: "Debug consoles, simple modules, bootloaders, Bluetooth/Wi-Fi modems",
    whyItFits:
      "UART is easy to wire and excellent for human-readable logging, simple command protocols, and module-to-module communication where only TX and RX are needed.",
    caution:
      "There is no shared clock wire, so both ends must agree closely enough on baud timing or frames will be sampled incorrectly.",
    beats: [
      {
        label: "Step 1",
        title: "The transmitter frames a byte",
        detail: "A start bit, data bits, optional parity, and stop bit are prepared using the selected baud rate.",
        active: ["controller", "clock", "wire"],
      },
      {
        label: "Step 2",
        title: "The line toggles with timed bits",
        detail: "The TX line carries a timed serial waveform rather than parallel data bits all at once.",
        active: ["wire", "controller"],
      },
      {
        label: "Step 3",
        title: "The receiver samples the frame",
        detail: "Using its own baud generator, the receiver samples the line at expected times to reconstruct the byte.",
        active: ["device", "wire", "clock"],
      },
      {
        label: "Step 4",
        title: "The byte lands in a receive register",
        detail: "Firmware reads the received byte from a UART data register or lets DMA move it into RAM.",
        active: ["device", "memory", "ram"],
      },
    ],
    examples: ["USB serial bridge", "GPS module", "Cellular modem", "Boot messages"],
  },
  {
    id: "can",
    label: "CAN",
    wires: "CANH, CANL via transceiver",
    topology: "Shared differential multi-node network",
    bestFor: "Automotive, industrial control, robust noisy environments",
    whyItFits:
      "CAN is built for noisy multi-node systems where arbitration, fault tolerance, and robust message delivery matter more than simple point-to-point wiring.",
    caution:
      "It is not a drop-in replacement for SPI or UART. It needs a transceiver, bus design discipline, and message-oriented software handling.",
    beats: [
      {
        label: "Step 1",
        title: "A node requests the bus",
        detail: "The MCU prepares a message in the CAN controller and waits for a legal transmission opportunity on the shared network.",
        active: ["controller", "memory", "wire"],
      },
      {
        label: "Step 2",
        title: "Arbitration decides priority",
        detail: "If more than one node tries to speak, the dominant identifier bits decide which frame continues first without destroying the bus state.",
        active: ["controller", "wire", "device"],
      },
      {
        label: "Step 3",
        title: "The transceiver drives the differential pair",
        detail: "The electrical transceiver converts the controller's logic-level message activity into the real CANH/CANL physical signaling.",
        active: ["driver", "wire", "device"],
      },
      {
        label: "Step 4",
        title: "Receiving nodes filter and store the frame",
        detail: "Interested nodes accept the message into receive buffers where the CPU can inspect it later.",
        active: ["device", "memory", "ram"],
      },
    ],
    examples: ["Vehicle network", "Industrial machine modules", "Distributed actuator nodes", "Robust control networks"],
  },
];

export const analogPipelines = [
  {
    id: "adc",
    label: "ADC path",
    headline: "Analog sensor to digital value",
    summary:
      "A continuously varying voltage is sampled, quantized, and turned into a number that firmware can filter, compare, and log.",
    bestFor: "Thermistors, light sensors, battery monitor, current sense, potentiometers",
    caution:
      "Sampling too fast, using a noisy reference, or feeding the ADC from a source with high impedance can corrupt the measurement.",
    beats: [
      {
        label: "Step 1",
        title: "The sensor produces a real voltage",
        detail: "The physical world changes a voltage or current in the front-end circuit.",
        active: ["sensor", "front"],
      },
      {
        label: "Step 2",
        title: "The ADC samples at a chosen instant",
        detail: "The sampling capacitor briefly captures the present voltage so the converter can measure it.",
        active: ["front", "clock", "adc"],
      },
      {
        label: "Step 3",
        title: "The converter quantizes it",
        detail: "The analog level is mapped onto one of a finite number of digital codes based on reference voltage and resolution.",
        active: ["adc", "memory"],
      },
      {
        label: "Step 4",
        title: "Firmware turns code into meaning",
        detail: "Software scales the raw code into temperature, pressure, current, or another engineering unit.",
        active: ["memory", "cpu", "ram"],
      },
    ],
  },
  {
    id: "dac",
    label: "DAC path",
    headline: "Digital value to analog command",
    summary:
      "A register value is converted into an analog voltage so the MCU can command circuits that need a smoothly varying reference instead of only HIGH or LOW.",
    bestFor: "Analog setpoints, waveform generation, reference outputs, controlled bias voltages",
    caution:
      "The output usually needs buffering, filtering, or driver circuitry before it can control a real-world load robustly.",
    beats: [
      {
        label: "Step 1",
        title: "Firmware writes a target value",
        detail: "The CPU computes a desired analog setpoint and writes a numeric code into the DAC data register.",
        active: ["cpu", "memory"],
      },
      {
        label: "Step 2",
        title: "The DAC converts code into voltage",
        detail: "Internal conversion logic maps the code to a proportional analog output level.",
        active: ["dac", "clock", "memory"],
      },
      {
        label: "Step 3",
        title: "The analog stage conditions the signal",
        detail: "The output may be buffered or filtered so the next stage sees a stable and useful analog command.",
        active: ["dac", "front", "driver"],
      },
      {
        label: "Step 4",
        title: "The external circuit responds",
        detail: "An amplifier, reference input, or analog control stage uses that voltage to influence the physical system.",
        active: ["driver", "load", "sensor"],
      },
    ],
  },
  {
    id: "pwm",
    label: "PWM path",
    headline: "Digital pulses that behave like an analog command",
    summary:
      "A timer creates a fast pulse train whose duty cycle represents the commanded average level, and the outside world interprets or filters that pattern.",
    bestFor: "Motor control, LED dimming, heaters, fans, servos, power converters",
    caution:
      "PWM is not automatically smooth analog. Frequency, resolution, driver stage, and the load's electrical or mechanical behavior decide what the result actually feels like.",
    beats: [
      {
        label: "Step 1",
        title: "Firmware chooses duty cycle and period",
        detail: "The CPU configures timer compare values that represent how long the output should stay HIGH in each cycle.",
        active: ["cpu", "timer", "memory"],
      },
      {
        label: "Step 2",
        title: "The timer generates the waveform",
        detail: "The PWM hardware toggles the output on schedule without the CPU manually flipping the pin each time.",
        active: ["timer", "clock", "gpio"],
      },
      {
        label: "Step 3",
        title: "The driver stage handles the real load",
        detail: "A transistor, gate driver, or H-bridge turns the logic waveform into usable power switching for the actuator.",
        active: ["gpio", "driver", "load"],
      },
      {
        label: "Step 4",
        title: "The actuator averages or reacts to the pulses",
        detail: "A motor, LED, heater, or filter experiences the effective average energy of the PWM stream.",
        active: ["driver", "load", "sensor"],
      },
    ],
  },
];

export const busStories = [
  {
    id: "fetch",
    label: "Instruction fetch",
    headline: "How code reaches the core",
    summary:
      "The program counter chooses the next instruction address, the bus fabric reaches flash or fast code memory, and the core receives the instruction bits it needs to keep executing.",
    caution:
      "Caches or prefetch may speed this up on larger MCUs, but many smaller MCUs simply fetch directly from flash with no cache at all.",
    beats: [
      {
        label: "Stage 1",
        title: "The program counter names the next instruction address",
        detail: "Execution begins with location selection. The core must know where the next instruction lives before anything else happens.",
        active: ["cpu", "bus"],
      },
      {
        label: "Stage 2",
        title: "The address goes through the code path",
        detail: "The bus or code interface forwards that location request toward flash or a faster code-memory region.",
        active: ["cpu", "bus", "flash"],
      },
      {
        label: "Stage 3",
        title: "Instruction bits are returned",
        detail: "Flash or cache responds with the instruction word or line of code bytes the core needs next.",
        active: ["flash", "cache", "bus"],
      },
      {
        label: "Stage 4",
        title: "The decoder takes over",
        detail: "Once the bits arrive, the core can decode the operation and decide which other resources are needed.",
        active: ["bus", "cpu", "cache"],
      },
    ],
  },
  {
    id: "peripheral-read",
    label: "Peripheral register read",
    headline: "How the core reads a sensor result or status bit",
    summary:
      "The CPU uses the address map to target a peripheral register, and the data bus returns the payload value from that location.",
    caution:
      "This works because peripherals are memory-mapped on many MCUs. The address looks like memory, but the destination is really a hardware register block.",
    beats: [
      {
        label: "Stage 1",
        title: "The CPU requests a memory-mapped register address",
        detail: "The instruction names the peripheral register location exactly as if it were reading an address in the memory map.",
        active: ["cpu", "bus", "apb"],
      },
      {
        label: "Stage 2",
        title: "The bridge routes the request to the peripheral side",
        detail: "An internal bus bridge takes the access off the faster core side and toward the lower-speed peripheral block.",
        active: ["bus", "apb", "peripheral"],
      },
      {
        label: "Stage 3",
        title: "The peripheral returns the register contents",
        detail: "The ADC result, status flag, GPIO input register, or serial byte appears on the data path back to the core.",
        active: ["peripheral", "apb", "bus"],
      },
      {
        label: "Stage 4",
        title: "The CPU stores or interprets the value",
        detail: "The returned register value lands in a CPU register and may then be written into RAM or used immediately in logic.",
        active: ["cpu", "ram", "bus"],
      },
    ],
  },
  {
    id: "dma-stream",
    label: "DMA stream",
    headline: "How data can move without the CPU touching every byte",
    summary:
      "A peripheral such as SPI, UART, ADC, or DAC can cooperate with DMA so bulk data moves between the peripheral and RAM while the CPU handles higher-level control logic.",
    caution:
      "Once DMA is involved, software must care about buffer ownership, completion timing, and cache coherency on larger MCUs.",
    beats: [
      {
        label: "Stage 1",
        title: "The CPU arms the DMA engine",
        detail: "Firmware configures source, destination, length, and trigger conditions before stepping back.",
        active: ["cpu", "dma", "ram"],
      },
      {
        label: "Stage 2",
        title: "The peripheral requests a transfer",
        detail: "A receive-ready event or converter-complete event tells DMA that another data word is ready to move.",
        active: ["peripheral", "dma", "interrupt"],
      },
      {
        label: "Stage 3",
        title: "DMA uses the bus to move the payload",
        detail: "The bus fabric temporarily serves the DMA engine so the payload goes directly between the peripheral and RAM.",
        active: ["dma", "bus", "ram", "peripheral"],
      },
      {
        label: "Stage 4",
        title: "The CPU handles the filled buffer later",
        detail: "Firmware reacts only when the buffer is ready, which is much more efficient than handling every byte in software.",
        active: ["cpu", "ram", "interrupt"],
      },
    ],
  },
  {
    id: "cache",
    label: "Cache-assisted access",
    headline: "Why bigger MCUs add memory helpers",
    summary:
      "On some higher-performance parts, repeated code or data access may be served from cache or tightly coupled memory instead of always reaching slower flash or external memory directly.",
    caution:
      "This is an advanced feature, not a universal MCU rule. It helps average speed but can complicate deterministic timing and DMA behavior.",
    beats: [
      {
        label: "Stage 1",
        title: "The core asks for an instruction or data line",
        detail: "From the CPU's point of view, the request looks normal: it needs something at a given address.",
        active: ["cpu", "cache"],
      },
      {
        label: "Stage 2",
        title: "The cache checks whether it already has it",
        detail: "If the requested line is present, the core is fed quickly without going all the way to slower backing memory.",
        active: ["cache", "cpu"],
      },
      {
        label: "Stage 3",
        title: "A miss falls back to the real memory path",
        detail: "If the cache does not have the line, flash, SRAM, or external memory still has to be accessed across the bus fabric.",
        active: ["cache", "bus", "flash", "ram"],
      },
      {
        label: "Stage 4",
        title: "The helper speeds future repeats",
        detail: "Once filled, repeated accesses can be quicker, but software must stay aware of coherence rules when DMA or shared memory enters the picture.",
        active: ["cache", "dma", "ram"],
      },
    ],
  },
];

export const wholeSystemScenarios = [
  {
    id: "thermostat",
    label: "Thermostat and fan controller",
    quote:
      "\"Measure temperature, compare it with the target, and drive the fan just hard enough to hold the system in range.\"",
    overview:
      "This system combines analog sensing, ADC, RAM storage, CPU control logic, timer/PWM output, and a transistor-driven actuator in one repeating loop.",
    lessons: [
      "A sensor is not useful until its signal becomes a trustworthy digital representation.",
      "The CPU does not flip the fan pin manually at every instant. A timer/PWM block often does the repetitive waveform work.",
      "The physical system feeds back into the next ADC sample, which is why this is a true closed loop.",
    ],
    expertNote:
      "This is the skeleton of real control engineering: measurement, state update, decision, actuation, and feedback.",
    beats: [
      {
        title: "Temperature changes in the physical world",
        detail: "The real environment changes first. The microcontroller is reacting to physics, not inventing it.",
        active: ["sensor", "feedback"],
      },
      {
        title: "The analog front end and ADC capture the sensor",
        detail: "The thermistor divider presents a voltage, and the ADC samples it into a digital code.",
        active: ["sensor", "analog", "adc"],
      },
      {
        title: "The reading is stored and interpreted",
        detail: "The converted code lands in a register or RAM buffer so firmware can compare it with the desired target temperature.",
        active: ["adc", "ram", "cpu"],
      },
      {
        title: "The control law chooses a new fan command",
        detail: "The CPU decides what duty cycle or on/off state should be applied to keep temperature near the target.",
        active: ["cpu", "timer", "ram"],
      },
      {
        title: "PWM and the driver stage energize the fan",
        detail: "The timer creates the PWM waveform, and the transistor or driver stage switches the actual motor power path.",
        active: ["timer", "gpio", "driver", "actuator"],
      },
      {
        title: "The actuator changes the next sensor reading",
        detail: "Fan airflow changes the physical temperature, which becomes the next input sample, closing the loop.",
        active: ["actuator", "feedback", "sensor"],
      },
    ],
  },
  {
    id: "drone",
    label: "Flight-control sensing loop",
    quote:
      "\"Read IMU data, estimate attitude, run the controller, and update motor outputs every cycle without losing timing discipline.\"",
    overview:
      "This system adds digital sensors, communication peripherals, DMA, interrupts, RAM state, timer/PWM outputs, and a stricter real-time schedule.",
    lessons: [
      "Not every sensor is analog. Many modern sensors arrive over SPI or I2C and still become just another part of the data path.",
      "DMA and interrupts help the system keep up without the CPU manually moving every sample byte.",
      "The timer/PWM path is what finally turns state estimates into motor commands.",
    ],
    expertNote:
      "This is where MCU architecture, bus pressure, interrupt design, and deterministic timing all become inseparable from the control problem itself.",
    beats: [
      {
        title: "The IMU measures motion",
        detail: "Gyros and accelerometers produce fresh digital-ready samples describing what the drone is doing physically.",
        active: ["sensor", "feedback"],
      },
      {
        title: "SPI or I2C brings the sample into the chip",
        detail: "A serial peripheral engine clocks the data in, often assisted by DMA so the CPU is not trapped byte by byte.",
        active: ["sensor", "comms", "dma", "bus"],
      },
      {
        title: "RAM holds the latest state estimate",
        detail: "Sample buffers, filter state, and control variables live in RAM where each cycle can refine the current picture of the vehicle.",
        active: ["ram", "cpu", "dma"],
      },
      {
        title: "The CPU runs estimation and control",
        detail: "The controller computes corrections based on desired attitude and measured motion.",
        active: ["cpu", "clock", "ram"],
      },
      {
        title: "Timers update PWM outputs to the ESCs",
        detail: "Hardware timers create clean motor-control waveforms while the CPU prepares the next cycle's decisions.",
        active: ["timer", "gpio", "actuator"],
      },
      {
        title: "Motor thrust changes the next measurement",
        detail: "The physical response changes the next IMU reading, which is why this is a fast repeated feedback loop rather than a one-shot command.",
        active: ["actuator", "feedback", "sensor"],
      },
    ],
  },
  {
    id: "smart-node",
    label: "Industrial smart sensor node",
    quote:
      "\"Measure analog current, watch digital status inputs, talk to the network, and drive an actuator output only when the safety conditions stay valid.\"",
    overview:
      "This scenario combines ADC, GPIO input, interrupt handling, communication, watchdog thinking, and a safe output path.",
    lessons: [
      "A real MCU often runs several peripheral styles at once: analog measurement, digital status, communication, and output control.",
      "Safety and robustness depend on more than the CPU. Watchdogs, interrupts, drivers, and communication integrity matter too.",
      "Peripherals exist so the whole machine can keep responding even while multiple tasks overlap in time.",
    ],
    expertNote:
      "This is the embedded-systems mindset you want before entering more advanced architecture, driver, or operating-system topics: one coordinated machine, not a list of blocks.",
    beats: [
      {
        title: "Sensors and status inputs change",
        detail: "Analog current, digital fault pins, and command traffic all exist at once in the external system.",
        active: ["sensor", "analog", "feedback"],
      },
      {
        title: "ADC, GPIO, and communication peripherals capture the evidence",
        detail: "Different peripheral blocks each translate one part of the physical world into internal state.",
        active: ["adc", "gpio", "comms", "interrupt"],
      },
      {
        title: "RAM becomes the current system picture",
        detail: "Fresh samples, received commands, and fault flags all collect into RAM so the CPU can reason about the whole state coherently.",
        active: ["ram", "cpu", "bus"],
      },
      {
        title: "The CPU checks logic and safety conditions",
        detail: "Firmware decides whether the requested action is allowed and what exact output value should be driven.",
        active: ["cpu", "ram", "clock"],
      },
      {
        title: "The output stage drives the actuator",
        detail: "GPIO, PWM, DAC, or a communication command updates the next stage of the plant or network.",
        active: ["gpio", "driver", "actuator", "comms"],
      },
      {
        title: "Supervision keeps the system trustworthy",
        detail: "If communication stalls or software misbehaves, a watchdog or safety layer can force the system back toward a known-safe state.",
        active: ["interrupt", "cpu", "feedback"],
      },
    ],
  },
];

export const peripheralPlaybook = [
  {
    title: "Timers and counters",
    body: "Measure time, generate PWM, trigger conversions, count pulses, and schedule periodic work without the CPU polling everything manually.",
  },
  {
    title: "Interrupt controller",
    body: "Lets urgent hardware events temporarily redirect the CPU so timing-critical work can be handled quickly and then returned to the main program flow.",
  },
  {
    title: "DMA",
    body: "Moves data between peripherals and memory efficiently, which matters for high-rate ADC sampling, display refresh, UART receive, SPI streaming, and audio-style workloads.",
  },
  {
    title: "Watchdog",
    body: "A safety timer that expects software to refresh it periodically. If the firmware hangs or gets stuck, the watchdog can reset the system.",
  },
  {
    title: "RTC and low-power blocks",
    body: "Keep time, wake the chip from sleep, and let embedded products save energy between useful work bursts.",
  },
  {
    title: "Comparators and op-amp helpers",
    body: "Some MCUs include analog helpers so threshold detection or signal conditioning can happen with less external circuitry.",
  },
  {
    title: "Debug and trace hardware",
    body: "SWD, JTAG, trace, breakpoints, and hardware watchpoints exist so engineers can inspect and control the system while it is alive.",
  },
  {
    title: "Power, reset, and brownout logic",
    body: "Real products need safe startup, legal voltage operation, and graceful recovery when supply conditions are bad.",
  },
];

export const connectionPatterns = [
  {
    title: "Analog sensor -> ADC",
    body: "Thermistors, light sensors, pressure transducers, and current shunts often create voltages that the MCU samples through the analog path.",
  },
  {
    title: "Digital sensor -> I2C or SPI",
    body: "IMUs, environmental sensors, EEPROM, displays, and converters often speak digital protocols instead of analog voltages.",
  },
  {
    title: "Low-power load -> GPIO",
    body: "An LED, enable pin, reset line, or logic-level control input may be driven directly by a GPIO output.",
  },
  {
    title: "Power load -> driver stage",
    body: "Motors, relays, solenoids, heaters, fans, and larger LEDs usually need a MOSFET, BJT, H-bridge, or dedicated driver between the MCU and the load.",
  },
  {
    title: "Network node -> transceiver",
    body: "CAN, RS-485, Ethernet, and other robust links usually need a physical-layer transceiver because the MCU peripheral alone is not the whole electrical interface.",
  },
  {
    title: "Precision analog output -> DAC plus conditioning",
    body: "When the outside world needs a smooth reference rather than pulses, the MCU may use a DAC and amplifier stage instead of plain GPIO or PWM alone.",
  },
];
