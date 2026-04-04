export const architectureModels = {
  von: {
    id: "von",
    label: "Von Neumann",
    shortLabel: "Unified memory",
    headline: "One main memory space stores both instructions and data.",
    analogy:
      "Imagine one library building with one main corridor. The CPU walks through the same corridor whether it wants the next instruction or the next piece of data.",
    memoryShape:
      "Program bytes and data bytes live in the same overall addressable memory model, so the CPU conceptually talks to one shared store.",
    strength:
      "Simple mental model, flexible memory usage, and easy to imagine as one unified machine state.",
    weakness:
      "Instruction fetches and data transfers can compete for the same path, creating the classic Von Neumann bottleneck.",
    bestFit:
      "General-purpose computing and systems where flexibility, shared address space, and software convenience matter a lot.",
  },
  harvard: {
    id: "harvard",
    label: "Harvard",
    shortLabel: "Split memory",
    headline: "Instructions and data travel on separate paths.",
    analogy:
      "Imagine two buildings and two roads: one path is reserved for program instructions, and another path is reserved for working data.",
    memoryShape:
      "Program memory and data memory are treated as distinct spaces, often with separate buses so the CPU can fetch code and access data more independently.",
    strength:
      "Higher possible throughput and better real-time rhythm because instruction fetch and data access do not have to fight for one road.",
    weakness:
      "The memory model is less uniform, and toolchains or programmers may need to think harder about where constants and code live.",
    bestFit:
      "Microcontrollers, DSP-style workloads, and repeated control loops where deterministic movement of instructions and data matters.",
  },
  modified: {
    id: "modified",
    label: "Modified Harvard",
    shortLabel: "Hybrid modern design",
    headline: "Separate instruction and data paths exist internally, but software often sees a more unified model.",
    analogy:
      "Think of it as a building with separate service corridors behind the walls, even though the front desk makes it feel like one connected campus.",
    memoryShape:
      "Many modern MCUs and CPUs fetch instructions and data on separate internal paths or caches while still presenting a more unified address view to software.",
    strength:
      "Keeps much of Harvard's performance advantage while reducing some of the programmer-facing awkwardness of a strict split-memory machine.",
    weakness:
      "The machine becomes more subtle. Beginners can assume it is purely Von Neumann or purely Harvard and miss what the hardware is really doing.",
    bestFit:
      "Modern Cortex-M and Cortex-A style systems where performance and programmer convenience both matter.",
  },
};

export const architecturePrimerItems = [
  {
    title: "Architecture",
    body: "Here, architecture means the organized path the CPU uses to fetch instructions and reach data. It is the map of how the machine thinks and moves.",
  },
  {
    title: "Instruction stream",
    body: "Instructions are the machine's action words. The CPU must fetch them repeatedly, decode them, and act on them in order.",
  },
  {
    title: "Data stream",
    body: "Data is the working material: sensor samples, counters, buffers, coefficients, status flags, and every changing value your program uses.",
  },
  {
    title: "Bottleneck",
    body: "A bottleneck appears when two kinds of traffic want the same narrow path. Von Neumann machines often teach this clearly because code fetch and data access can compete.",
  },
];

export const architectureImportanceCards = [
  {
    title: "Why experts care",
    body: "Architecture changes timing, throughput, determinism, memory layout, compiler behavior, and even how easy it is to protect code from accidental data writes.",
  },
  {
    title: "Why beginners should care",
    body: "Without this topic, later chapters on buses, flash, RAM, execution, DMA, or caches can feel like unrelated facts. Architecture ties them into one machine story.",
  },
  {
    title: "Why product teams care",
    body: "A flight computer, a washing machine controller, an audio DSP, and a laptop are not judged by the same tradeoffs. Architecture helps explain why.",
  },
  {
    title: "Why debuggers care",
    body: "When instruction fetches stall, code is stored in a special region, or data reads are delayed, architecture often explains the symptom before any single line of code does.",
  },
];

export const architectureTrapCards = [
  {
    title: "Trap 1",
    body: "Thinking the architecture is only a textbook diagram. In real design work, it affects timing budgets, code placement, memory protection, and performance ceilings.",
  },
  {
    title: "Trap 2",
    body: "Thinking Harvard is always better. Separate instruction and data paths help many embedded loops, but the extra separation can also complicate programming models.",
  },
  {
    title: "Trap 3",
    body: "Thinking Von Neumann is outdated. A unified memory model is still extremely powerful for general-purpose software, dynamic loading, and broad software ecosystems.",
  },
  {
    title: "Trap 4",
    body: "Thinking modern processors are pure examples of one school only. Many real products are hybrids that borrow ideas from both.",
  },
];

export const architectureFlowScenarios = [
  {
    id: "thermal-loop",
    label: "Thermal control loop",
    requirementQuote:
      "\"Every 1 ms, read the temperature sensor, compare it against 70 C, and update the cooling fan output.\"",
    overview:
      "This is a classic embedded control loop. The same few instructions repeat while sensor data changes every cycle.",
    whyItMatters: [
      "You can feel whether instruction fetch and data reads are competing.",
      "It exposes why deterministic control loops often like split instruction and data paths.",
      "It also shows that the CPU is not doing magic; it is fetching, reading, deciding, and writing on every round.",
    ],
    metrics: {
      von: {
        performance: "Adequate for modest loops, but one shared path can serialize fetches and reads.",
        fit: "Good when the loop is small and the memory model simplicity matters more than maximum overlap.",
        caution: "The instruction fetch may need to wait while the sensor value is being read.",
      },
      harvard: {
        performance: "Strong fit because instruction fetch and sensor-data access can be separated.",
        fit: "Excellent for fixed real-time loops that repeat forever with predictable structure.",
        caution: "The firmware toolchain may need to care more explicitly about program-space versus data-space placement.",
      },
    },
    beats: [
      {
        id: "fetch-load",
        title: "Fetch the load instruction",
        von: {
          programTask: "Unified memory sends the opcode bytes for the load instruction.",
          dataTask: "The sensor sample is still waiting; the shared path is busy with code fetch first.",
          cpuTask: "The decoder prepares to read the ADC or memory-mapped sensor register.",
          traffic: "One shared road is carrying instruction bytes right now.",
          parallel: "No parallel fetch/data action yet.",
          takeaway: "In a Von Neumann machine, code fetch uses the same main road that later data traffic wants to use.",
        },
        harvard: {
          programTask: "Program memory sends the load opcode on the instruction path.",
          dataTask: "The data path stays ready for the upcoming sensor read.",
          cpuTask: "The CPU can prepare for the load without occupying the data road yet.",
          traffic: "Instruction traffic is isolated from the data side.",
          parallel: "Separation is available even before overlap becomes visible.",
          takeaway: "Harvard starts by making instruction traffic independent from data traffic.",
        },
      },
      {
        id: "read-sensor",
        title: "Read the sensor sample",
        von: {
          programTask: "The next instruction fetch pauses because the shared path is now busy with data.",
          dataTask: "The sensor value travels back across the same memory path.",
          cpuTask: "The sample lands in a working register.",
          traffic: "Code and data are taking turns on one road.",
          parallel: "Instruction fetch waits while data arrives.",
          takeaway: "This competition is the heart of the Von Neumann bottleneck.",
        },
        harvard: {
          programTask: "The next compare instruction can already be prefetched from program memory.",
          dataTask: "The sensor sample comes in on the data bus at the same time.",
          cpuTask: "The register file is filled while the next opcode is already on deck.",
          traffic: "Instruction and data traffic move on separate roads.",
          parallel: "Yes, fetch and data access can overlap here.",
          takeaway: "Harvard is attractive when your control loop repeatedly needs both code and data every cycle.",
        },
      },
      {
        id: "fetch-compare",
        title: "Fetch the compare and threshold work",
        von: {
          programTask: "The shared memory path now returns to instruction fetch so the compare opcode can arrive.",
          dataTask: "The threshold constant and sample both need attention, but only one transfer path exists.",
          cpuTask: "The CPU lines up the compare step after the data read completes.",
          traffic: "Everything queues on the same memory road.",
          parallel: "Useful work still happens, but the path is serialized.",
          takeaway: "Unified memory is simple, but simple does not mean unconstrained.",
        },
        harvard: {
          programTask: "Program memory continues streaming the compare instruction sequence.",
          dataTask: "The threshold or working sample can be reached on the data side without blocking instruction fetch.",
          cpuTask: "The compare becomes a smoother flow with less waiting.",
          traffic: "The two streams stay distinct and easier to schedule.",
          parallel: "Overlap remains possible as the loop advances.",
          takeaway: "Harvard improves the rhythm of repetitive fetch-plus-data workloads.",
        },
      },
      {
        id: "branch-decide",
        title: "Decide whether the fan should switch",
        von: {
          programTask: "The branch or output instruction must still be fetched on the shared path.",
          dataTask: "The sample result is already local, but the next memory need can still create delay.",
          cpuTask: "The ALU compares and decides whether the branch or store should happen.",
          traffic: "Instruction fetch remains another turn on the same main road.",
          parallel: "Decision logic is fast, but fetch traffic is still serialized.",
          takeaway: "The CPU core may be ready, yet the shared path still shapes throughput.",
        },
        harvard: {
          programTask: "The branch or output instruction is already close at hand from the instruction side.",
          dataTask: "Working data remains available independently.",
          cpuTask: "The CPU compares, decides, and moves toward the GPIO write with less traffic conflict.",
          traffic: "Instruction readiness is less likely to be delayed by data movement.",
          parallel: "The machine feels more pipelined.",
          takeaway: "Separate instruction and data paths help the CPU stay fed during tight loops.",
        },
      },
      {
        id: "write-output",
        title: "Write the GPIO output and start the next loop",
        von: {
          programTask: "After the output write, the loop-start instruction must again compete for the shared memory path.",
          dataTask: "The GPIO or memory-mapped output register consumes the same general transfer path model.",
          cpuTask: "The control loop finishes one round and prepares to repeat.",
          traffic: "One road serves output writes and future instruction fetches.",
          parallel: "The next iteration starts after the current transfers clear the road.",
          takeaway: "Von Neumann can still work very well, but you have to respect the shared-path budget.",
        },
        harvard: {
          programTask: "The next loop instruction can already be lined up on the instruction path.",
          dataTask: "The GPIO write happens on the data side.",
          cpuTask: "The control loop feels more continuous from one iteration to the next.",
          traffic: "Output write and next-code readiness stop interfering as much.",
          parallel: "This is exactly why many control-oriented designs like Harvard ideas.",
          takeaway: "A split-path architecture often improves loop cadence and predictability.",
        },
      },
    ],
  },
  {
    id: "audio-stream",
    label: "Audio DSP stream",
    requirementQuote:
      "\"Process a fresh audio sample every time it arrives, multiply it by coefficients, and push the result back out with minimal latency.\"",
    overview:
      "Streaming audio or motor-control math often means a CPU is constantly hungry for both instructions and data at the same time.",
    whyItMatters: [
      "DSP-style tasks make the Harvard advantage easy to notice because they repeatedly mix instruction fetches with coefficient and sample reads.",
      "If the instruction path starves, the signal-processing loop misses throughput targets.",
      "This scenario also shows why embedded designers talk about buses and architecture, not only clock speed.",
    ],
    metrics: {
      von: {
        performance: "Possible, but the shared-memory path becomes a real pressure point when every sample needs repeated fetches and data reads.",
        fit: "Best when the workload is modest or when the surrounding software ecosystem values unified memory more than raw loop efficiency.",
        caution: "Heavy fetch and sample traffic can pile up on one path.",
      },
      harvard: {
        performance: "Excellent because code fetch, sample fetch, and coefficient access can be organized far more efficiently.",
        fit: "A natural match for DSPs, signal processing, and motor-control loops.",
        caution: "The memory map and toolchain rules may be more specialized than a general-purpose computer's.",
      },
    },
    beats: [
      {
        id: "fetch-mac",
        title: "Fetch the multiply-accumulate instruction",
        von: {
          programTask: "Unified memory supplies the MAC instruction bytes first.",
          dataTask: "The new sample and coefficient still wait for the shared path.",
          cpuTask: "The execution unit prepares the arithmetic step.",
          traffic: "Instruction fetch gets first turn on one road.",
          parallel: "Data access must wait behind code fetch.",
          takeaway: "When every sample needs many operations, waiting quickly becomes expensive.",
        },
        harvard: {
          programTask: "Instruction memory streams the MAC instruction immediately.",
          dataTask: "The data side stays ready for sample and coefficient fetches.",
          cpuTask: "The arithmetic pipeline can stay better supplied.",
          traffic: "Instruction traffic does not consume the data road.",
          parallel: "The machine is ready to overlap sample movement with code fetch.",
          takeaway: "This is the textbook-friendly reason DSP engineers love Harvard-like organization.",
        },
      },
      {
        id: "load-sample",
        title: "Load the incoming sample",
        von: {
          programTask: "The next instruction fetch is delayed while the shared path brings in the audio sample.",
          dataTask: "The sample uses the same memory path the code uses.",
          cpuTask: "One register now contains the latest sample.",
          traffic: "Code and stream data collide on the same route.",
          parallel: "No overlap between this data load and the next fetch.",
          takeaway: "Streaming data workloads expose the shared-path cost very quickly.",
        },
        harvard: {
          programTask: "The next arithmetic instruction can already be prefetched.",
          dataTask: "The sample arrives on the data side right away.",
          cpuTask: "The pipeline stays better prepared for the next operation.",
          traffic: "Instruction and sample traffic stay out of each other's lane.",
          parallel: "Yes, fetch and data load can happen together.",
          takeaway: "Harvard keeps the code stream fed while the data stream stays active.",
        },
      },
      {
        id: "load-coefficient",
        title: "Load the coefficient or previous state",
        von: {
          programTask: "Another instruction fetch must again take turns with another data read.",
          dataTask: "Coefficient and state accesses keep competing with code fetches.",
          cpuTask: "The accumulator waits for both the data and the correct next opcode.",
          traffic: "One road now serves a very traffic-heavy loop.",
          parallel: "The queue grows conceptually even if the CPU is fast.",
          takeaway: "A fast clock cannot fully hide an architectural traffic jam.",
        },
        harvard: {
          programTask: "The instruction stream stays warm while the coefficient arrives separately.",
          dataTask: "The coefficient or state value rides the data path.",
          cpuTask: "The MAC unit is fed more smoothly.",
          traffic: "Two paths keep the loop moving.",
          parallel: "Harvard keeps overlap alive exactly where DSP workloads need it.",
          takeaway: "Architecture choice can matter as much as clock speed in stream processing.",
        },
      },
      {
        id: "compute-output",
        title: "Compute the filtered output",
        von: {
          programTask: "The shared path must still deliver whatever instruction comes next before the loop advances.",
          dataTask: "The arithmetic result is local now, but the traffic delay already shaped the pace.",
          cpuTask: "The ALU or MAC unit produces the filtered sample.",
          traffic: "Execution is ready, but the shared memory model still sets the rhythm.",
          parallel: "Core math can be quick; feeding the core is the harder part.",
          takeaway: "Architectures are often judged by how well they keep the CPU fed, not just by raw arithmetic ability.",
        },
        harvard: {
          programTask: "The instruction side keeps future steps ready.",
          dataTask: "The processed sample can move out on the data side.",
          cpuTask: "The arithmetic unit spends more time computing and less time waiting.",
          traffic: "The loop feels continuous rather than stop-and-go.",
          parallel: "Separated traffic keeps latency lower and throughput steadier.",
          takeaway: "This is why Harvard ideas remain so important in real-time signal chains.",
        },
      },
    ],
  },
  {
    id: "app-runtime",
    label: "General-purpose runtime",
    requirementQuote:
      "\"Run many applications, load libraries, allocate memory dynamically, and let programs manipulate large shared data structures.\"",
    overview:
      "This scenario shifts away from fixed loops and toward broad software flexibility, where a unified memory model is often easier to work with.",
    whyItMatters: [
      "It shows why architecture is not only about raw speed. Software flexibility and ecosystem size matter too.",
      "It explains why a general-purpose CPU can still be architecturally attractive even when a pure Harvard machine wins some throughput arguments.",
      "It also sets up the idea of modified Harvard designs that try to balance both worlds.",
    ],
    metrics: {
      von: {
        performance: "Strong conceptual fit because the software model is uniform and memory can often be treated more flexibly.",
        fit: "Great for desktops, servers, rich operating systems, dynamic loading, and large programming ecosystems.",
        caution: "Throughput challenges still exist, so modern CPUs often add caches and other tricks rather than staying naively simple.",
      },
      harvard: {
        performance: "Possible in principle, but a strict split-memory model can feel awkward for software stacks that expect large unified address spaces.",
        fit: "Less natural when the software world wants code, data, libraries, and dynamic structures to interact more fluidly.",
        caution: "Strict separation can make some software models or toolchains more cumbersome.",
      },
    },
    beats: [
      {
        id: "fetch-runtime",
        title: "Fetch the next instruction from a large program",
        von: {
          programTask: "The unified memory model fits a large runtime image naturally.",
          dataTask: "Shared data structures live in the same broad conceptual space.",
          cpuTask: "The CPU fetches the next instruction from the same overall memory world it uses for data.",
          traffic: "One model ties the whole software system together.",
          parallel: "The model is conceptually simple even if performance tricks are added later.",
          takeaway: "Von Neumann remains powerful because software teams love a coherent mental model.",
        },
        harvard: {
          programTask: "Program fetch still works, but strict split spaces become more visible and sometimes less convenient.",
          dataTask: "Data structures are not conceptually in the same place as code.",
          cpuTask: "The machine can still execute, but the software model feels less unified.",
          traffic: "The split that helped a tiny controller may now feel restrictive.",
          parallel: "Parallel paths help performance, but the programmer-facing model can be less convenient here.",
          takeaway: "Architecture choice depends on product goals, not on one universal winner.",
        },
      },
      {
        id: "read-object",
        title: "Read and update a shared object in memory",
        von: {
          programTask: "Instructions and object data are both part of one broad addressable system model.",
          dataTask: "The runtime can allocate, share, and pass references more naturally.",
          cpuTask: "The software stack treats memory as a flexible resource pool.",
          traffic: "The system feels more uniform to compilers, loaders, and debuggers.",
          parallel: "Performance may still need caches, but the model is flexible.",
          takeaway: "Unification is a major software engineering advantage, not just a textbook detail.",
        },
        harvard: {
          programTask: "Instruction space remains separate while the object lives on the data side.",
          dataTask: "The runtime must keep the split in mind more explicitly.",
          cpuTask: "The machine still works, but the programmer-friendly simplicity is reduced.",
          traffic: "The benefits of separation are less dramatic for this style of workload.",
          parallel: "Parallel paths help less than memory flexibility does here.",
          takeaway: "This is why general-purpose systems often prefer a more unified model or a hybrid one.",
        },
      },
      {
        id: "dynamic-load",
        title: "Load code, data, and libraries over time",
        von: {
          programTask: "A unified memory model matches dynamic loaders and rich software stacks well.",
          dataTask: "Large data and code ecosystems can be managed in one conceptual map.",
          cpuTask: "The operating system and runtime tools gain flexibility.",
          traffic: "The model is broad and software-friendly.",
          parallel: "Modern implementations then add caches or separate internal paths to improve speed.",
          takeaway: "Modified Harvard often appears here: the software model feels unified, while the hardware uses internal separation for performance.",
        },
        harvard: {
          programTask: "Strict split spaces can complicate dynamic code and data handling if the system wants fluid movement between them.",
          dataTask: "The software stack must respect the separation carefully.",
          cpuTask: "Some benefits remain, but the fit is less natural for a rich app ecosystem.",
          traffic: "The architecture is now fighting the dominant software goal.",
          parallel: "Throughput is not the only design criterion; flexibility matters too.",
          takeaway: "Harvard is excellent in many embedded contexts, but it is not the universal answer for all computing products.",
        },
      },
    ],
  },
];

export const architectureComparisonLenses = [
  {
    id: "simplicity",
    label: "Mental model",
    question: "Which style is easiest to reason about as one big software-visible memory world?",
    notes: {
      von: {
        title: "Von Neumann leads on simplicity",
        body: "One main memory model is easy to teach, easy to debug conceptually, and natural for operating systems, compilers, loaders, and programmers.",
      },
      harvard: {
        title: "Harvard asks for stronger memory discipline",
        body: "The split makes excellent engineering sense, but the programmer may need to care about program-space versus data-space placement more explicitly.",
      },
      modified: {
        title: "Modified Harvard tries to offer both",
        body: "It keeps separate internal pathways for speed while often presenting a more unified story to software.",
      },
    },
  },
  {
    id: "throughput",
    label: "Throughput",
    question: "Which style feeds repetitive loops and data-heavy pipelines more effectively?",
    notes: {
      von: {
        title: "Von Neumann can be limited by shared traffic",
        body: "When code fetches and data reads want the same path repeatedly, the CPU may spend more time waiting for memory traffic to clear.",
      },
      harvard: {
        title: "Harvard shines when both streams stay busy",
        body: "Repeated control loops, DSP kernels, and stream processing benefit from instruction and data traffic moving independently.",
      },
      modified: {
        title: "Modified Harvard uses internal separation to recover speed",
        body: "Modern designs often keep separate caches or internal paths precisely because the pure shared-road model can starve performance.",
      },
    },
  },
  {
    id: "determinism",
    label: "Real-time rhythm",
    question: "Which style is more attractive when the system repeats a strict timing loop?",
    notes: {
      von: {
        title: "Von Neumann can work, but the traffic budget matters",
        body: "A small loop on a modest system can still behave predictably, but the shared-path contention has to be respected carefully.",
      },
      harvard: {
        title: "Harvard naturally supports fixed repeated loops",
        body: "It is easier to picture code and data being supplied with less interference, which helps deterministic embedded workloads.",
      },
      modified: {
        title: "Modified Harvard dominates many modern MCUs",
        body: "It offers a practical compromise: instruction and data movement are helped by internal separation while the device still feels modern and flexible.",
      },
    },
  },
];

export const architectureExamples = [
  {
    id: "pic16",
    label: "PIC16-style controller",
    leaning: "Harvard-leaning example",
    requirementQuote:
      "\"We need a tiny controller that repeats a fixed loop for years, reads a few sensors, and drives outputs safely at low cost.\"",
    deviceStory:
      "Many small microcontroller families make the split between program memory and data memory very visible. This suits compact control firmware well.",
    whyItFits:
      "The instruction stream is fixed, the data working set is small, and deterministic control behavior matters more than a huge general-purpose software ecosystem.",
    watchOut:
      "The software model can be less uniform than on a desktop-class system, so constants, tables, and memory placement must be understood carefully.",
  },
  {
    id: "avr",
    label: "AVR-style 8-bit MCU",
    leaning: "Harvard-leaning example",
    requirementQuote:
      "\"We want an educational robot brain that repeatedly reads sensors, makes decisions, and drives motors from a compact firmware image.\"",
    deviceStory:
      "AVR-family teaching examples often make Harvard ideas tangible because code lives in program memory while SRAM holds changing runtime data.",
    whyItFits:
      "It is great for showing beginners why code storage and changing state are not automatically the same thing.",
    watchOut:
      "When storing lookup tables or constants, the split memory story matters to both the code and the compiler toolchain.",
  },
  {
    id: "cortex-m",
    label: "ARM Cortex-M microcontroller",
    leaning: "Modified Harvard example",
    requirementQuote:
      "\"We need a drone controller that runs control loops, talks to peripherals, uses DMA, and still feels modern to program in C.\"",
    deviceStory:
      "Many Cortex-M systems execute from flash, work with SRAM data, and use separate internal instruction and data paths while still presenting a largely unified memory map to the programmer.",
    whyItFits:
      "This is the modern practical compromise for many embedded products: good throughput and good programming ergonomics together.",
    watchOut:
      "Beginners sometimes call Cortex-M purely Von Neumann because the map looks unified, or purely Harvard because the core has split paths. The truth is more nuanced.",
  },
  {
    id: "desktop",
    label: "Desktop or laptop CPU",
    leaning: "Von-Neumann-like software model with hybrid hardware reality",
    requirementQuote:
      "\"We need a computer that runs browsers, compilers, databases, media apps, virtual machines, and constantly changing software stacks.\"",
    deviceStory:
      "General-purpose computers are usually taught with a Von Neumann model because the software ecosystem expects a broad unified memory view, even though the hardware uses caches and pipelines internally.",
    whyItFits:
      "The software model must stay flexible for huge ecosystems, dynamic programs, and complex operating systems.",
    watchOut:
      "If you stop at the textbook diagram, you miss the fact that modern CPUs add a lot of internal structure to avoid the naive shared-path bottleneck.",
  },
];

export const architectureDepthCards = [
  {
    title: "Pure textbook examples are rare",
    body: "Real chips borrow ideas. A device can be programmer-friendly like a Von Neumann machine while still using Harvard-like split paths internally.",
  },
  {
    title: "Compilers feel architecture too",
    body: "On stricter Harvard machines, the compiler and linker may need special handling for constants, jump tables, or pointers into program memory versus data memory.",
  },
  {
    title: "Flash and RAM make the story concrete",
    body: "In many microcontrollers, instructions live in flash while variables live in RAM. That physical split helps explain why Harvard ideas feel so natural in embedded work.",
  },
  {
    title: "Caches are a performance response",
    body: "Many modern processors use instruction caches and data caches because architects want separate fast paths even when the programmer sees a more unified model.",
  },
];

export const architectureQuizScenarios = [
  {
    id: "washer",
    title: "Low-cost appliance controller",
    prompt:
      "A washing machine controller runs one repeating loop, samples water level and drum state, and drives motors and valves with tight cost and power limits.",
    quote: "\"The firmware is mostly fixed, the control loop repeats, and we care about predictable behavior more than running huge software stacks.\"",
    correct: "harvard",
    why:
      "A Harvard-leaning microcontroller is a strong fit because the instruction stream is stable, the data set is small, and separate instruction/data paths suit repetitive control loops well.",
    diagnostics: {
      von: "Von Neumann could still run the washer, but the shared instruction-and-data path is not the most natural fit for a small repetitive control loop where simple deterministic traffic is valuable.",
      harvard:
        "Harvard fits because the control code repeats, the data set is modest, and the architecture favors predictable instruction fetch plus data access for embedded control behavior.",
      modified:
        "Modified Harvard would also be workable, but it usually buys more flexibility than this appliance-class controller really needs.",
    },
  },
  {
    id: "laptop",
    title: "General-purpose personal computer",
    prompt:
      "A laptop must run many applications, update software constantly, manage large heaps, load libraries, and support operating-system abstractions comfortably.",
    quote: "\"We need one broad software world where code, data, files, processes, and dynamic allocation all make sense together.\"",
    correct: "von",
    why:
      "A Von-Neumann-like software model is the cleanest fit because flexibility and a broad unified address view matter enormously in a general-purpose machine.",
    diagnostics: {
      von: "Von Neumann is the strongest fit because general-purpose software benefits hugely from a broad unified memory model, dynamic allocation, process loading, and one coherent software-facing address world.",
      harvard:
        "A strict Harvard split is less natural here because large operating systems and dynamic application ecosystems prefer a far more flexible shared-memory programming model.",
      modified:
        "Modified Harvard ideas often exist internally in modern CPUs, but the software-facing reason this platform works so well is still much closer to a unified Von-Neumann-style programming model.",
    },
  },
  {
    id: "drone",
    title: "Modern flight controller",
    prompt:
      "A drone flight controller runs tight sensing and control loops, executes from flash, stores changing state in SRAM, and still needs a modern C toolchain and memory-mapped peripherals.",
    quote: "\"We want control-loop performance and clean programming ergonomics, not a purely old-school split or a purely naive unified model.\"",
    correct: "modified",
    why:
      "A modified Harvard design is the best answer because many modern MCUs use separate internal instruction and data paths while still giving software a practical unified memory map.",
    diagnostics: {
      von: "A pure Von Neumann story misses why modern flight controllers often benefit from better internal instruction/data separation for tight control loops and peripheral-heavy work.",
      harvard:
        "A strict Harvard answer misses the software ergonomics side. Modern flight controllers often want both good loop performance and a practical unified programming model.",
      modified:
        "Modified Harvard is the best fit because it captures the real modern compromise: separate internal paths for performance, but a friendlier software model for toolchains, peripherals, and firmware structure.",
    },
  },
  {
    id: "audio",
    title: "Streaming audio effects unit",
    prompt:
      "An effects processor repeatedly pulls audio samples and coefficients, runs filter math, and pushes data back out with low latency every cycle.",
    quote: "\"Our main problem is keeping the arithmetic loop fed with instructions and sample data at the same time.\"",
    correct: "harvard",
    why:
      "Harvard is the most direct fit because this workload is dominated by repetitive simultaneous demand for instruction fetches and data movement.",
    diagnostics: {
      von: "Von Neumann can process audio, but the shared path becomes a real bottleneck when every sample competes with instruction fetches and coefficient reads.",
      harvard:
        "Harvard is strongest here because streaming DSP-style work repeatedly needs instructions and data at the same time, and separate paths help keep the arithmetic loop fed.",
      modified:
        "Modified Harvard can also serve this job well in many modern chips, but the pure architectural pressure in this scenario is most directly explained by the classic Harvard advantage.",
    },
  },
];

export const architectureChoiceOptions = [
  { id: "von", label: "Von Neumann" },
  { id: "harvard", label: "Harvard" },
  { id: "modified", label: "Modified Harvard" },
];
