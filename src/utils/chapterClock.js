function formatNumber(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: value >= 100 ? 0 : 2 }).format(
    value
  );
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

  const microseconds = 1000000 / frequency;

  if (microseconds >= 1000) {
    return `${formatNumber(microseconds / 1000)} ms per cycle`;
  }

  return `${formatNumber(microseconds)} us per cycle`;
}

export function buildPulseSequence(length, activeBeat) {
  return Array.from({ length }, (_, index) => ({
    index,
    active: index === activeBeat,
    trailing: index < activeBeat,
  }));
}

export function computeGenericClockTree({ sourceFrequency, pllEnabled, pllMultiplier, cpuDivider, busDivider }) {
  const pllFrequency = pllEnabled ? sourceFrequency * pllMultiplier : sourceFrequency;
  const cpuFrequency = pllFrequency / cpuDivider;
  const busFrequency = cpuFrequency / busDivider;
  const timerFrequency = busFrequency;
  const uartFrequency = busFrequency / 2;

  return {
    sourceFrequency,
    pllFrequency,
    cpuFrequency,
    busFrequency,
    timerFrequency,
    uartFrequency,
  };
}

export function describeClockFeel(cpuFrequency) {
  if (cpuFrequency <= 1000000) {
    return {
      title: "Slow, visible, power-friendly",
      body: "The controller gets fewer work opportunities per second. Response is slower, but the rhythm is easier to explain and often easier on power.",
    };
  }

  if (cpuFrequency <= 8000000) {
    return {
      title: "Balanced teaching zone",
      body: "Fast enough to run useful logic while still being simple to reason about. Many beginner-friendly MCUs live around here.",
    };
  }

  return {
    title: "Fast and layered",
    body: "The chip can do much more each second, but timing trees, wait states, and bus limits matter more. Faster clocks demand more careful configuration.",
  };
}

export function computePicClock({ source, internalFrequency }) {
  const oscillatorFrequency = source === "internal" ? internalFrequency : 8000000;
  const instructionFrequency = oscillatorFrequency / 4;
  const instructionPeriodUs = 1000000 / instructionFrequency;

  return {
    oscillatorFrequency,
    instructionFrequency,
    instructionPeriodUs,
  };
}

export function buildPicCodeLines({ sourceLine, ircfBits, frequencyLabel, sourceLabel }) {
  return {
    register: [
      "// PIC16-style educational setup",
      sourceLine,
      `OSCCONbits.IRCF = 0b${ircfBits}; // ${frequencyLabel} internal oscillator`,
      "while (!OSCCONbits.HTS) { } // wait until the high-frequency source is stable",
      "// CPU instruction clock now runs at Fosc / 4",
    ],
    flow: [
      `1. Select ${sourceLabel}.`,
      `2. Choose ${frequencyLabel} if the internal oscillator is being used.`,
      "3. Wait for the source to become stable.",
      "4. Remember that classic PIC mid-range CPUs execute one instruction cycle every 4 oscillator ticks.",
    ],
  };
}

export function computeStmClock({ sourceFrequency, pllEnabled, pllMultiplier, ahbDivider, apb1Divider, apb2Divider }) {
  const sysclk = pllEnabled ? sourceFrequency * pllMultiplier : sourceFrequency;
  const hclk = sysclk / ahbDivider;
  const pclk1 = hclk / apb1Divider;
  const pclk2 = hclk / apb2Divider;
  const timerClock = apb1Divider === 1 ? pclk1 : pclk1 * 2;

  return {
    sysclk,
    hclk,
    pclk1,
    pclk2,
    timerClock,
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
  const sourceSelect = sourceId === "hse" ? "RCC_CFGR_SW_HSE" : "RCC_CFGR_SW_HSI";
  const pllSourceLine = sourceId === "hse" ? "RCC->CFGR |= RCC_CFGR_PLLSRC;" : "RCC->CFGR &= ~RCC_CFGR_PLLSRC;";

  return {
    register: [
      "// STM32F1 educational RCC bring-up",
      `RCC->CR |= ${sourceCode};`,
      `while ((RCC->CR & ${waitFlag}) == 0U) { }`,
      `RCC->CFGR |= HPRE_DIV${ahbDivider} | PPRE1_DIV${apb1Divider} | PPRE2_DIV${apb2Divider};`,
      pllEnabled
        ? pllSourceLine
        : "// PLL disabled, system clock comes straight from the selected source",
      pllEnabled
        ? `RCC->CFGR |= PLLMUL_X${pllMultiplier};`
        : "// PLL multiplier line skipped",
      pllEnabled ? "RCC->CR |= RCC_CR_PLLON;" : "// RCC_CR_PLLON not used here",
      pllEnabled ? "while ((RCC->CR & RCC_CR_PLLRDY) == 0U) { }" : "// no PLL ready wait needed",
      pllEnabled ? "RCC->CFGR |= RCC_CFGR_SW_PLL;" : `RCC->CFGR |= ${sourceSelect};`,
    ],
    driver: [
      `1. Enable ${sourceId.toUpperCase()} and wait until it is ready.`,
      pllEnabled ? `2. Feed that source into the PLL and multiply it by ${pllMultiplier}.` : "2. Skip PLL and keep the raw source as SYSCLK.",
      `3. Divide AHB by ${ahbDivider}, APB1 by ${apb1Divider}, and APB2 by ${apb2Divider}.`,
      "4. Switch SYSCLK only after the selected path is stable.",
      "5. Enable each peripheral clock only when that block is actually needed.",
    ],
  };
}

export function buildTimelineRows(activeBeat, busMode) {
  const serialBits = [1, 0, 1, 1, 0, 0, 1, 0];
  const parallelBits = [1, 0, 1, 0, 1, 1, 0, 1];

  return {
    clock: Array.from({ length: 8 }, (_, index) => ({
      label: index % 2 === 0 ? "HIGH" : "LOW",
      active: index === activeBeat,
      kind: index % 2 === 0 ? "high" : "low",
    })),
    cpu: [
      "Fetch",
      "Decode",
      "ALU",
      "Store",
      "Fetch",
      "Decode",
      "Branch",
      "Latch",
    ].map((label, index) => ({ label, active: index === activeBeat, kind: "cpu" })),
    memory: [
      "Addr",
      "Read",
      "Data",
      "Write",
      "Addr",
      "Read",
      "Data",
      "Idle",
    ].map((label, index) => ({ label, active: index === activeBeat, kind: "memory" })),
    serial: serialBits.map((bit, index) => ({
      label: busMode === "serial" ? String(bit) : index === activeBeat ? "sync" : "hold",
      active: index === activeBeat,
      kind: busMode === "serial" ? (bit ? "high" : "low") : "muted",
    })),
    parallel: parallelBits.map((bit, index) => ({
      label: busMode === "parallel" ? String(bit) : index === activeBeat ? "wait" : "hold",
      active: index === activeBeat,
      kind: busMode === "parallel" ? (bit ? "high" : "low") : "muted",
    })),
    gpio: [
      "Sample in",
      "Compare",
      "Decision",
      "Drive out",
      "Sample in",
      "Compare",
      "Decision",
      "Drive out",
    ].map((label, index) => ({ label, active: index === activeBeat, kind: "gpio" })),
  };
}
