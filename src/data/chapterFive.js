export const pressureScenario = {
  sensorAddress: 0x7000,
  displayAddress: 0x7010,
  sourceOptions: ["0x7000", "0x7001", "0x7002"],
  thresholdOptions: [80, 140, 200],
};

export const signalScenario = {
  modes: [
    {
      id: "rising",
      label: "rising edge",
      explain: "Count once when the signal changes from 0 to 1.",
    },
    {
      id: "falling",
      label: "falling edge",
      explain: "Count once when the signal changes from 1 to 0.",
    },
    {
      id: "high",
      label: "level high",
      explain: "Act the whole time the signal stays high.",
    },
  ],
};

export const protocolScenario = {
  startByte: 0xaa,
  packetLength: 4,
  startOptions: ["0xAA", "0x55", "0x0F"],
  valueIndexOptions: [1, 2, 3],
  actionOptions: ["display", "alarm"],
  packets: [
    [0xaa, 0x01, 26, 0xc1],
    [0xaa, 0x01, 44, 0xd3],
    [0xaa, 0x01, 58, 0xe1],
    [0xaa, 0x01, 72, 0xf1],
  ],
};
