function formatNumber(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: value >= 100 ? 0 : 2 }).format(
    value
  );
}

function formatDurationSeconds(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "stopped";
  }

  if (seconds >= 1) {
    return `${formatNumber(seconds)} s`;
  }

  if (seconds >= 0.001) {
    return `${formatNumber(seconds * 1000)} ms`;
  }

  if (seconds >= 0.000001) {
    return `${formatNumber(seconds * 1000000)} us`;
  }

  return `${formatNumber(seconds * 1000000000)} ns`;
}

export function formatHz(value) {
  if (value >= 1000000) {
    return `${formatNumber(value / 1000000)} MHz`;
  }

  if (value >= 1000) {
    return `${formatNumber(value / 1000)} kHz`;
  }

  return `${formatNumber(value)} Hz`;
}

export function formatPeriodUs(frequency) {
  if (!frequency) {
    return "stopped";
  }

  return `${formatDurationSeconds(1 / frequency)} per cycle`;
}

export function formatCycles(value) {
  if (value < 1) {
    return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value)} cycles`;
  }

  if (value >= 1000000) {
    return `${formatNumber(value / 1000000)} million cycles`;
  }

  if (value >= 1000) {
    return `${formatNumber(value / 1000)} thousand cycles`;
  }

  return `${formatNumber(value)} cycles`;
}

export function buildPulseSequence(length, activeBeat) {
  return Array.from({ length }, (_, index) => ({
    index,
    active: index === activeBeat,
    trailing: index < activeBeat,
  }));
}

export function computeCycleMetrics({ frequency, workloadCycles }) {
  const periodSeconds = frequency ? 1 / frequency : 0;
  const cyclesPerMillisecond = frequency / 1000;
  const cyclesPerMicrosecond = frequency / 1000000;
  const workloadSeconds = workloadCycles / frequency;

  return {
    periodLabel: formatDurationSeconds(periodSeconds),
    cyclesPerMillisecondLabel: formatCycles(cyclesPerMillisecond),
    cyclesPerMicrosecondLabel:
      cyclesPerMicrosecond >= 1
        ? `${formatNumber(cyclesPerMicrosecond)} cycles per us`
        : `${formatNumber(1 / cyclesPerMicrosecond)} us per cycle group`,
    workloadLabel: formatDurationSeconds(workloadSeconds),
  };
}

export function computeGenericClockTree({ sourceFrequency, pllEnabled, pllMultiplier, cpuDivider, busDivider }) {
  const pllInputFrequency = sourceFrequency;
  const pllFrequency = pllEnabled ? pllInputFrequency * pllMultiplier : pllInputFrequency;
  const cpuFrequency = pllFrequency / cpuDivider;
  const busFrequency = cpuFrequency / busDivider;
  const timerFrequency = busFrequency;
  const timerPeriodLabel = formatDurationSeconds(1 / timerFrequency);

  return {
    sourceFrequency,
    pllInputFrequency,
    pllFrequency,
    cpuFrequency,
    busFrequency,
    timerFrequency,
    timerPeriodLabel,
  };
}

export function describeClockFeel(cpuFrequency) {
  if (cpuFrequency <= 1000000) {
    return {
      title: "Slow enough to reason about beat by beat",
      body: "At low frequencies, every state update is far apart in time. This is great for teaching and for very low-power control, but response and throughput are limited.",
    };
  }

  if (cpuFrequency <= 16000000) {
    return {
      title: "Fast enough for useful work, still easy to teach",
      body: "This range is where many beginner-friendly systems become practical. You still need timing discipline, but the tree is easier to reason about than very high-speed designs.",
    };
  }

  return {
    title: "Fast clocks demand design discipline",
    body: "At higher frequencies, bus limits, flash wait states, peripheral domains, and clock accuracy matter much more. The clock tree stops being a detail and becomes part of system design.",
  };
}

export function computePicClock({ source, internalFrequency }) {
  const oscillatorFrequency = source === "internal" ? internalFrequency : 8000000;
  const instructionFrequency = oscillatorFrequency / 4;
  const instructionPeriodLabel = formatDurationSeconds(1 / instructionFrequency);
  const instructionCyclesPerMillisecond = instructionFrequency / 1000;
  const hundredCycleTimeLabel = formatDurationSeconds(100 / instructionFrequency);

  return {
    oscillatorFrequency,
    instructionFrequency,
    instructionPeriodLabel,
    instructionCyclesPerMillisecond,
    hundredCycleTimeLabel,
  };
}

export function buildPicCodeLines({ sourceLine, ircfBits, frequencyLabel, sourceLabel, sourceId }) {
  const internalLine =
    sourceId === "internal"
      ? `OSCCONbits.IRCF = 0b${ircfBits}; // select ${frequencyLabel} internal oscillator`
      : "// internal frequency field matters only when the internal oscillator is selected";

  return {
    register: [
      "// Educational PIC16-style clock sequence",
      sourceLine,
      internalLine,
      "// wait until the selected oscillator reports ready (status bit names vary by PIC16 family)",
      "// on classic and enhanced mid-range PIC16 parts, one instruction cycle = 4 oscillator cycles",
    ],
    flow: [
      `1. Choose ${sourceLabel}.`,
      sourceId === "internal"
        ? `2. Select the ${frequencyLabel} internal oscillator step.`
        : "2. Follow the external or primary oscillator path configured for the device.",
      "3. Wait until the oscillator is stable enough to trust.",
      "4. Convert Fosc to CPU instruction timing using the PIC rule: instruction cycle = Fosc / 4.",
    ],
  };
}

export function computeStmClock({
  sourceId,
  sourceFrequency,
  pllEnabled,
  pllMultiplier,
  ahbDivider,
  apb1Divider,
  apb2Divider,
}) {
  const pllInput = pllEnabled ? (sourceId === "hsi" ? sourceFrequency / 2 : sourceFrequency) : 0;
  const sysclk = pllEnabled ? pllInput * pllMultiplier : sourceFrequency;
  const hclk = sysclk / ahbDivider;
  const pclk1 = hclk / apb1Divider;
  const pclk2 = hclk / apb2Divider;
  const timerClock = apb1Divider === 1 ? pclk1 : pclk1 * 2;
  const warnings = [];

  if (sysclk > 72000000) {
    warnings.push("SYSCLK is above the common 72 MHz maximum used by STM32F1 devices.");
  }

  if (pclk1 > 36000000) {
    warnings.push("APB1 is above the common 36 MHz STM32F1 peripheral limit.");
  }

  if (pllEnabled && sourceId === "hsi") {
    warnings.push("On STM32F1, HSI does not feed the PLL directly. The PLL input is HSI divided by 2.");
  }

  return {
    pllInput,
    sysclk,
    hclk,
    pclk1,
    pclk2,
    timerClock,
    warnings,
  };
}

export function buildStmCodeLines({
  sourceId,
  sourceCode,
  pllEnabled,
  pllMultiplier,
  ahbDivider,
  apb1Divider,
  apb2Divider,
}) {
  const waitFlag = sourceId === "hse" ? "RCC_CR_HSERDY" : "RCC_CR_HSIRDY";
  const sourceSwitch = sourceId === "hse" ? "RCC_CFGR_SW_HSE" : "RCC_CFGR_SW_HSI";
  const pllSourceLine =
    sourceId === "hse"
      ? "RCC->CFGR = (RCC->CFGR & ~RCC_CFGR_PLLSRC) | RCC_CFGR_PLLSRC; // HSE feeds PLL"
      : "RCC->CFGR &= ~RCC_CFGR_PLLSRC; // on STM32F1 this means HSI/2 feeds PLL";

  return {
    register: [
      "// Educational STM32F1 RCC sequence",
      `RCC->CR |= ${sourceCode};`,
      `while ((RCC->CR & ${waitFlag}) == 0U) { }`,
      `RCC->CFGR = (RCC->CFGR & ~(RCC_CFGR_HPRE | RCC_CFGR_PPRE1 | RCC_CFGR_PPRE2)) | RCC_CFGR_HPRE_DIV${ahbDivider} | RCC_CFGR_PPRE1_DIV${apb1Divider} | RCC_CFGR_PPRE2_DIV${apb2Divider};`,
      pllEnabled ? pllSourceLine : "// PLL not used; keep the chosen source as SYSCLK",
      pllEnabled
        ? `RCC->CFGR = (RCC->CFGR & ~RCC_CFGR_PLLMULL) | RCC_CFGR_PLLMULL${pllMultiplier};`
        : "// PLL multiplier setup skipped",
      pllEnabled ? "RCC->CR |= RCC_CR_PLLON;" : "// no PLL enable needed",
      pllEnabled ? "while ((RCC->CR & RCC_CR_PLLRDY) == 0U) { }" : "// no PLL ready wait needed",
      pllEnabled
        ? "RCC->CFGR = (RCC->CFGR & ~RCC_CFGR_SW) | RCC_CFGR_SW_PLL;"
        : `RCC->CFGR = (RCC->CFGR & ~RCC_CFGR_SW) | ${sourceSwitch};`,
    ],
    driver: [
      `1. Enable ${sourceId.toUpperCase()} and wait until it is stable.`,
      pllEnabled
        ? sourceId === "hsi"
          ? `2. Feed HSI/2 into the PLL, then multiply it by ${pllMultiplier}.`
          : `2. Feed HSE into the PLL, then multiply it by ${pllMultiplier}.`
        : "2. Skip the PLL and use the raw source directly.",
      `3. Divide AHB by ${ahbDivider}, APB1 by ${apb1Divider}, and APB2 by ${apb2Divider}.`,
      "4. Switch SYSCLK only after the final path is ready.",
      "5. Turn on peripheral clocks separately; SYSCLK existing does not automatically enable every block.",
    ],
  };
}

export function buildTimelineRows(activeBeat, scenarioId) {
  const scenarios = {
    flashFetch: {
      control: ["PC out", "Read start", "Wait", "Latch IR", "Decode", "ALU", "Write back", "Next PC"],
      address: ["Flash addr", "Hold", "Hold", "Clear", "SRAM addr", "Hold", "Result addr", "Idle"],
      data: ["-", "-", "opcode", "IR load", "operand", "result", "store", "stable"],
      serial: ["idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"],
      io: ["no pin change", "no pin change", "no pin change", "no pin change", "no pin change", "no pin change", "possible update", "visible"],
    },
    gpioReaction: {
      control: ["Sample input", "Sync", "Compare", "Branch", "Prepare", "Write reg", "Latch out", "Hold"],
      address: ["GPIO IDR", "Bus stable", "CPU reads", "Decision", "GPIO ODR", "Bus write", "Latch", "Idle"],
      data: ["pin state", "sync bit", "compare", "decision", "output bit", "write", "new level", "stable"],
      serial: ["idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"],
      io: ["sensor high", "sensor high", "CPU knows", "branch", "LED target", "write pending", "LED changes", "LED stable"],
    },
    uartTransmit: {
      control: ["Load TDR", "Shift prep", "Start bit", "Bit 0", "Bit 1", "Bit 2", "Bit 3", "Continue..."],
      address: ["APB write", "baud tick", "baud tick", "baud tick", "baud tick", "baud tick", "baud tick", "baud tick"],
      data: ["0xA5", "shift reg", "0", "1", "0", "1", "0", "next bits"],
      serial: ["idle", "idle", "start", "1", "0", "1", "0", "..."],
      io: ["pin idle", "pin idle", "line low", "line sample", "line sample", "line sample", "line sample", "line continues"],
    },
  };

  const scenario = scenarios[scenarioId] ?? scenarios.flashFetch;

  return {
    clock: Array.from({ length: 8 }, (_, index) => ({
      label: index % 2 === 0 ? "edge" : "settle",
      active: index === activeBeat,
      kind: index % 2 === 0 ? "high" : "low",
    })),
    control: scenario.control.map((label, index) => ({
      label,
      active: index === activeBeat,
      kind: "cpu",
    })),
    address: scenario.address.map((label, index) => ({
      label,
      active: index === activeBeat,
      kind: "memory",
    })),
    data: scenario.data.map((label, index) => ({
      label,
      active: index === activeBeat,
      kind: "bus",
    })),
    serial: scenario.serial.map((label, index) => ({
      label,
      active: index === activeBeat,
      kind: label === "idle" ? "muted" : "serial",
    })),
    io: scenario.io.map((label, index) => ({
      label,
      active: index === activeBeat,
      kind: label.includes("idle") || label.includes("no") ? "muted" : "gpio",
    })),
  };
}
