export function summarizeEmbeddedExample(example) {
  return [
    `Input: ${example.inputs.join(", ")}`,
    `Thinking: ${example.thinking}`,
    `Output: ${example.outputs.join(", ")}`,
  ];
}

export function evaluateTimingPreset(preset, speedScale) {
  const scaledTasks = preset.tasks.map((task) => ({
    ...task,
    actualDurationMs: Math.max(1, Math.round(task.durationMs * speedScale)),
  }));
  const totalMs = scaledTasks.reduce((sum, task) => sum + task.actualDurationMs, 0);
  const meetsDeadline = totalMs <= preset.deadlineMs;
  const slackMs = preset.deadlineMs - totalMs;

  return {
    scaledTasks,
    totalMs,
    meetsDeadline,
    slackMs,
  };
}

export function buildTimelineSegments(tasks) {
  let cursor = 0;

  return tasks.map((task) => {
    const segment = {
      ...task,
      startMs: cursor,
      endMs: cursor + task.actualDurationMs,
    };
    cursor = segment.endMs;
    return segment;
  });
}

export function systemDecision(useCase, systemId) {
  const correct = useCase.recommended === systemId;
  return {
    correct,
    message: correct
      ? "Good fit. This choice matches the product's needs."
      : "This can work in some designs, but it is not the natural first choice for this use case.",
  };
}
