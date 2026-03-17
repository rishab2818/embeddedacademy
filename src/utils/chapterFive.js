import { formatAddress, toHex } from "./bitMath";

export function buildPressureMemory(sensorValue, ledOn) {
  return [
    {
      address: 0x7000,
      addressLabel: formatAddress(0x7000),
      hex: toHex(sensorValue),
      note: "live pressure sensor register",
      group: "sensor",
    },
    {
      address: 0x7001,
      addressLabel: formatAddress(0x7001),
      hex: toHex(Math.max(0, sensorValue - 40)),
      note: "older sample",
      group: "noise",
    },
    {
      address: 0x7002,
      addressLabel: formatAddress(0x7002),
      hex: toHex(Math.min(255, sensorValue + 15)),
      note: "calibration byte",
      group: "noise",
    },
    {
      address: 0x7010,
      addressLabel: formatAddress(0x7010),
      hex: ledOn ? "01" : "00",
      note: "LED output register",
      group: "output",
    },
  ];
}

export function evaluatePressureProgram(sourceAddress, threshold, sensorValue) {
  const readValue =
    sourceAddress === "0x7000"
      ? sensorValue
      : sourceAddress === "0x7001"
        ? Math.max(0, sensorValue - 40)
        : Math.min(255, sensorValue + 15);

  return {
    readValue,
    ledOn: readValue > threshold,
    correctSource: sourceAddress === "0x7000",
  };
}

export function detectSignalEvent(mode, previous, current) {
  if (mode === "rising") {
    return previous === 0 && current === 1;
  }

  if (mode === "falling") {
    return previous === 1 && current === 0;
  }

  return current === 1;
}

export function buildSignalWaveform(step) {
  const pattern = [0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0];
  return pattern.map((value, index) => ({
    index,
    value,
    active: index === step % pattern.length,
  }));
}

export function buildProtocolBuffer(packet, parsedValue, actionState) {
  return packet.map((byte, index) => ({
    address: 0x7300 + index,
    addressLabel: formatAddress(0x7300 + index),
    hex: toHex(byte),
    note:
      index === 0
        ? "start byte"
        : index === 1
          ? "sensor id"
          : index === 2
            ? "payload byte"
            : "checksum",
    group: "rx",
  })).concat([
    {
      address: 0x7310,
      addressLabel: formatAddress(0x7310),
      hex: toHex(parsedValue),
      note: "parsed application value",
      group: "app",
    },
    {
      address: 0x7311,
      addressLabel: formatAddress(0x7311),
      hex: actionState ? "01" : "00",
      note: "output action register",
      group: "app",
    },
  ]);
}

export function evaluateProtocolProgram(packet, startByteText, valueIndex, action) {
  const startByte = Number.parseInt(startByteText, 16);
  const validStart = packet[0] === startByte;
  const parsedValue = validStart ? packet[valueIndex] : 0;
  const actionState = action === "alarm" ? parsedValue > 50 : parsedValue;

  return {
    validStart,
    parsedValue,
    actionState,
  };
}
