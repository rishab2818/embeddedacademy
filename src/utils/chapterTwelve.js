import {
  busOperations,
  busStepLabels,
  compileExample,
  compileStageOrder,
  compileTargets,
  controllerProfiles,
} from "../data/chapterTwelve";
import { clamp, toBinary, toHex } from "./bitMath";

export function getControllerProfile(controllerId) {
  return controllerProfiles.find((item) => item.id === controllerId) ?? controllerProfiles[0];
}

export function getCompileTarget(targetId) {
  return compileTargets.find((item) => item.id === targetId) ?? compileTargets[0];
}

export function buildWidthScene(controllerId) {
  const profile = getControllerProfile(controllerId);
  const registerCells = Array.from({ length: profile.bitWidth }, (_, index) => ({
    id: index,
    label: `b${profile.bitWidth - 1 - index}`,
    group: Math.floor(index / 8),
  }));

  return {
    profile,
    registerCells,
    byteCount: profile.bitWidth / 8,
    naturalHexDigits: Math.ceil(profile.bitWidth / 4),
    exampleMask: `0x${"F".repeat(Math.ceil(profile.bitWidth / 4))}`,
  };
}

export function buildBusScene({ controllerId, operationId, addressIndex, writeValue }) {
  const profile = getControllerProfile(controllerId);
  const operation = busOperations.find((item) => item.id === operationId) ?? busOperations[0];
  const selectedIndex = clamp(addressIndex, 0, profile.memoryCells.length - 1);
  const selectedCell = profile.memoryCells[selectedIndex] ?? profile.memoryCells[0];
  const maskedWriteValue = clampWriteValue(writeValue, profile.dataBusBits);
  const transferredValue = operation.id === "write" ? maskedWriteValue : selectedCell.value;
  const addressValue = visibleAddressSlice(selectedCell.address, profile.visibleAddressBits);
  const addressBinary = toBinary(addressValue, profile.visibleAddressBits, 4);
  const dataBinary = toBinary(transferredValue, profile.dataBusBits, 4);

  const stepCards = busStepLabels.map((step, index) => {
    if (step.id === "choose") {
      return {
        ...step,
        detail: `The CPU selects ${selectedCell.label} at address 0x${selectedCell.address.toString(16).toUpperCase()}.`,
      };
    }

    if (step.id === "address") {
      return {
        ...step,
        detail: `Those address bits appear on the address bus. The address bus tells memory where to look.`,
      };
    }

    if (step.id === "data") {
      return {
        ...step,
        detail:
          operation.id === "read"
            ? `Memory drives the data bus with ${formatValueHex(transferredValue, profile.dataBusBits)}.`
            : `The CPU drives the data bus with ${formatValueHex(transferredValue, profile.dataBusBits)} so memory can store it.`,
      };
    }

    return {
      ...step,
      detail:
        operation.id === "read"
          ? `The CPU captures the returning value and can now use it in registers.`
          : `The target location keeps the new value after the write completes.`,
    };
  });

  return {
    profile,
    operation,
    selectedIndex,
    selectedCell,
    transferredValue,
    maskedWriteValue,
    addressBits: createBitCells(addressBinary.replace(/\s/g, "")),
    dataBits: createBitCells(dataBinary.replace(/\s/g, "")),
    addressBinary,
    dataBinary,
    dataHex: formatValueHex(transferredValue, profile.dataBusBits),
    stepCards,
    directionLabel: operation.arrow,
    transferSummary:
      operation.id === "read"
        ? `${profile.shortTitle}: address goes out, data comes back.`
        : `${profile.shortTitle}: address and new data go out together so the target location can be updated.`,
  };
}

export function buildCompileStages(targetId) {
  const target = getCompileTarget(targetId);

  return compileStageOrder.map((stage) => {
    if (stage.id === "assemble") {
      return {
        ...stage,
        lines: target.assembly,
        note: `${target.assemblyLabel}. ${target.targetNote}`,
      };
    }

    if (stage.id === "link") {
      return {
        ...stage,
        lines: compileExample.link.concat([`Output image: ${target.finalArtifact}`]),
        note: `The linker makes the final memory map match the chosen target toolchain: ${target.toolchain}.`,
      };
    }

    if (stage.id === "flash") {
      return {
        ...stage,
        lines: compileExample.flash.concat(target.objectBits.map((item) => `bit pattern: ${item}`)),
        note: `These 1s and 0s are what finally become stored program bits for the ${target.label}.`,
      };
    }

    return {
      ...stage,
      lines: compileExample[stage.id] ?? [],
      note:
        stage.id === "source"
          ? `The same source can be retargeted later because the language stays above the hardware details.`
          : `Target toolchain for this demo: ${target.toolchain}.`,
    };
  });
}

export function buildBinaryReasonScene(voltage, noise) {
  const safeVoltage = clamp(Number(voltage), 0, 5);
  const safeNoise = clamp(Number(noise), 0, 1);
  const minSeen = clamp(safeVoltage - safeNoise, 0, 5);
  const maxSeen = clamp(safeVoltage + safeNoise, 0, 5);

  const binaryState =
    maxSeen <= 1.2 ? "Stable 0" : minSeen >= 3.5 ? "Stable 1" : "Uncertain zone";

  const decimalBucketSize = 0.5;
  const minBucket = Math.floor(minSeen / decimalBucketSize);
  const maxBucket = Math.floor(Math.min(maxSeen, 4.999) / decimalBucketSize);
  const decimalState = minBucket === maxBucket ? `Level ${minBucket}` : "Several levels overlap";

  return {
    voltage: safeVoltage,
    noise: safeNoise,
    minSeen,
    maxSeen,
    binaryState,
    decimalState,
    binarySafe: binaryState !== "Uncertain zone",
    decimalSafe: minBucket === maxBucket,
    binaryNarrative:
      binaryState === "Stable 0"
        ? "Even with noise, the signal still sits safely in the LOW region."
        : binaryState === "Stable 1"
          ? "Even with noise, the signal still sits safely in the HIGH region."
          : "Noise pushes the signal into the middle, where hardware needs extra care or might misread it.",
    decimalNarrative:
      minBucket === maxBucket
        ? "A many-level system could still decode this value right now, but the safe zone is much narrower."
        : "A many-level system would struggle here because the noisy signal overlaps several possible voltage levels.",
  };
}

function clampWriteValue(value, bits) {
  const max = bits === 32 ? 0xffffffff : 2 ** bits - 1;
  return clamp(Math.trunc(Number(value) || 0), 0, max);
}

function visibleAddressSlice(address, bits) {
  if (bits >= 32) {
    return address >>> 0;
  }

  return address & (2 ** bits - 1);
}

function formatValueHex(value, bits) {
  return `0x${toHex(value, Math.ceil(bits / 4))}`;
}

function createBitCells(binaryText) {
  return binaryText.split("").map((bit, index, array) => ({
    id: `${array.length - 1 - index}`,
    value: bit,
    label: `b${array.length - 1 - index}`,
    index,
  }));
}

