import {
  codeViews,
  cycleStages,
  executionModes,
  executionProfiles,
  ioModes,
} from "../data/chapterThirteen";

export function getExecutionProfile(profileId) {
  return executionProfiles.find((item) => item.id === profileId) ?? executionProfiles[0];
}

export function buildMemoryPlacementScene({ profileId, viewId, executionModeId }) {
  const profile = getExecutionProfile(profileId);
  const view = codeViews.find((item) => item.id === viewId) ?? codeViews[0];
  const mode = executionModes.find((item) => item.id === executionModeId) ?? executionModes[0];

  const activeLines =
    view.id === "c" ? profile.sourceCode : view.id === "assembly" ? profile.assembly : profile.machineWords;

  const flashCells = profile.flashCells.map((cell, index) => ({
    ...cell,
    active: cell.kind === "instruction" && index > 0 && index < 4,
  }));

  const ramCells = profile.ramCells.map((cell) => ({
    ...cell,
    active:
      cell.kind === "variable" || (mode.id === "ramcopy" && cell.kind === "codecopy") || cell.kind === "stack",
  }));

  const narrative =
    mode.id === "flash"
      ? "The common path: machine instructions stay in flash, variables live in RAM, and the CPU fetches each instruction from flash as the program runs."
      : "The alternate teaching path: the final image starts in flash, then startup or a loader copies selected data and possibly a hot routine into RAM before the CPU runs from there.";

  return {
    profile,
    view,
    mode,
    activeLines,
    flashCells,
    ramCells,
    narrative,
  };
}

export function buildCpuFlowScene({ profileId, ioModeId, executionModeId, cycleIndex }) {
  const profile = getExecutionProfile(profileId);
  const ioMode = ioModes.find((item) => item.id === ioModeId) ?? ioModes[0];
  const executionMode = executionModes.find((item) => item.id === executionModeId) ?? executionModes[0];
  const currentIndex = cycleIndex % cycleStages.length;
  const currentStage = cycleStages[currentIndex];

  const unitStates = [
    { id: "flash", label: executionMode.id === "flash" ? "Flash" : "Flash source", active: currentStage.id === "fetch" },
    { id: "ram", label: "RAM", active: currentStage.id === "read" || currentStage.id === "writeback" },
    { id: "pc", label: "Program counter", active: currentStage.id === "fetch" },
    { id: "decoder", label: "Decoder", active: currentStage.id === "decode" },
    { id: "registers", label: "Registers", active: currentStage.id === "read" || currentStage.id === "writeback" },
    { id: "alu", label: "ALU", active: currentStage.id === "execute" },
    { id: "gpio", label: ioMode.id === "output" ? "GPIO output" : "GPIO input", active: currentStage.id === "read" || currentStage.id === "writeback" },
  ];

  const stageNarrative = buildStageNarrative({ profile, ioMode, executionMode, currentStage });

  return {
    profile,
    ioMode,
    executionMode,
    currentStage,
    unitStates,
    stageNarrative,
  };
}

export function buildFetchCycleCards(profileId) {
  const profile = getExecutionProfile(profileId);

  return cycleStages.map((stage) => ({
    ...stage,
    lines: buildCycleLines(profile, stage.id),
  }));
}

function buildStageNarrative({ profile, ioMode, executionMode, currentStage }) {
  const executionSource = executionMode.id === "flash" ? "flash" : "RAM copy";

  if (currentStage.id === "fetch") {
    return `The ${profile.bitWidth}-bit core uses its program counter to fetch the next instruction from ${executionSource} on a clocked step.`;
  }

  if (currentStage.id === "decode") {
    return `The decoder examines the instruction bits and decides whether the CPU should branch, read memory, update GPIO, or run an ALU operation.`;
  }

  if (currentStage.id === "read") {
    return ioMode.id === "input"
      ? "The instruction reads the GPIO input register or RAM value so the CPU can know what the outside world is doing."
      : "The instruction reads whatever operands it needs from registers, RAM, or constants before producing an output action.";
  }

  if (currentStage.id === "execute") {
    return ioMode.id === "input"
      ? "The ALU or compare logic decides what the input means and what the program should do next."
      : "The ALU or control logic turns the program's intention into a concrete result such as setting or clearing an output bit.";
  }

  return ioMode.id === "input"
    ? "The CPU stores the interpreted input result in RAM or a register so later code can use it."
    : "The CPU writes the result to a register, RAM, or GPIO output register so the pin can drive real hardware.";
}

function buildCycleLines(profile, stageId) {
  if (stageId === "fetch") {
    return [
      `${profile.label}: PC points at next instruction address`,
      `Instruction bits are fetched from ${profile.id === "stm32" ? "flash memory" : "program flash"}`,
      `Clock timing keeps the fetch aligned`,
    ];
  }

  if (stageId === "decode") {
    return [
      "Instruction register holds the fetched bits",
      "Decoder recognizes the opcode and operand fields",
      "Control logic prepares the needed CPU units",
    ];
  }

  if (stageId === "read") {
    return [
      "Read source registers, RAM, or peripheral register",
      "Place operands onto internal data paths",
      "Prepare ALU or branch comparison inputs",
    ];
  }

  if (stageId === "execute") {
    return [
      "Run ALU operation or branch decision",
      "Update flags / internal result",
      "Choose next control action",
    ];
  }

  return [
    "Write result back to register, RAM, or GPIO",
    "Advance program counter or branch target",
    "Ready for the next instruction fetch",
  ];
}
