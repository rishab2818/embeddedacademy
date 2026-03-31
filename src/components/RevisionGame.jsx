import { useMemo, useState } from "react";

function createInitialMissionState(missions) {
  return Object.fromEntries(
    missions.map((mission) => [
      mission.id,
      {
        selectedOptionId: null,
        solved: false,
        attempts: 0,
        lastFeedback: null,
      },
    ])
  );
}

function MissionHud({ missions, missionState, onReset }) {
  const solvedCount = missions.filter((mission) => missionState[mission.id]?.solved).length;
  const attemptCount = missions.reduce(
    (total, mission) => total + (missionState[mission.id]?.attempts ?? 0),
    0
  );
  const firstTryCount = missions.filter(
    (mission) => missionState[mission.id]?.solved && missionState[mission.id]?.attempts === 1
  ).length;
  const stability = Math.round((solvedCount / missions.length) * 100);
  const precision = attemptCount ? Math.round((solvedCount / attemptCount) * 100) : 100;

  return (
    <div className="chapter-grid revision-hud-grid">
      <div className="panel">
        <p className="eyebrow">Campaign status</p>
        <h3>Signal Rescue progression</h3>
        <div className="revision-stat-grid">
          <div className="revision-stat-card">
            <span>System stability</span>
            <strong>{stability}%</strong>
            <small>Based on repaired missions</small>
          </div>
          <div className="revision-stat-card">
            <span>Resolved missions</span>
            <strong>
              {solvedCount}/{missions.length}
            </strong>
            <small>Every solved mission unlocks deeper topics</small>
          </div>
          <div className="revision-stat-card">
            <span>Precision</span>
            <strong>{precision}%</strong>
            <small>Successes compared with total deployments</small>
          </div>
          <div className="revision-stat-card">
            <span>First-try clears</span>
            <strong>{firstTryCount}</strong>
            <small>Shows genuine technical confidence</small>
          </div>
        </div>
      </div>

      <div className="panel revision-ambient-panel">
        <p className="eyebrow">Control room</p>
        <h3>Not a quiz, a repair deck</h3>
        <p className="panel-copy">
          Each mission is a system failure. You stabilize it by choosing the repair move that
          truly matches how embedded hardware and software behave.
        </p>
        <button type="button" className="secondary-link revision-reset-button" onClick={onReset}>
          Reset campaign
        </button>
      </div>
    </div>
  );
}

function MissionMap({ missions, missionState, activeMissionId, unlockedIndex, onSelectMission }) {
  return (
    <div className="panel revision-map-panel">
      <div className="panel-header stacked">
        <div>
          <p className="eyebrow">Mission map</p>
          <h3>Progress from basics to deep technical reasoning</h3>
        </div>
      </div>

      <div className="revision-map-grid">
        {missions.map((mission, index) => {
          const state = missionState[mission.id];
          const unlocked = index <= unlockedIndex || state?.solved;
          const status = state?.solved ? "solved" : unlocked ? "unlocked" : "locked";

          return (
            <button
              key={mission.id}
              type="button"
              className={`mission-node ${status} ${activeMissionId === mission.id ? "active" : ""}`}
              onClick={() => unlocked && onSelectMission(index)}
              disabled={!unlocked}
            >
              <span>{mission.code}</span>
              <strong>{mission.title}</strong>
              <small>{mission.difficulty}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MissionIntel({ mission }) {
  return (
    <div className="revision-intel-grid">
      <div className="revision-intel-card story">
        <span>Scenario</span>
        <strong>{mission.story}</strong>
        <p>{mission.objective}</p>
      </div>

      <div className="revision-intel-card refs">
        <span>Knowledge anchors</span>
        <div className="revision-chip-row">
          {mission.chapterRefs.map((item) => (
            <div key={`${mission.id}-${item}`} className="revision-chip">
              {item}
            </div>
          ))}
        </div>
        <p>{mission.hint}</p>
      </div>
    </div>
  );
}

function ActionDeck({ mission, selectedOptionId, onSelectOption }) {
  return (
    <div className="revision-action-grid">
      {mission.options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`revision-action-card ${selectedOptionId === option.id ? "active" : ""}`}
          onClick={() => onSelectOption(option.id)}
        >
          <span>{option.label}</span>
          <strong>{option.title}</strong>
          <p>{option.detail}</p>
        </button>
      ))}
    </div>
  );
}

function FeedbackPanel({ feedback, onNextMission, hasNextMission }) {
  if (!feedback) {
    return (
      <div className="revision-feedback-panel idle">
        <span>Awaiting deployment</span>
        <strong>Select a repair move and deploy it</strong>
        <p>
          The game responds with a technical explanation, not just a green tick or red cross.
        </p>
      </div>
    );
  }

  return (
    <div className={`revision-feedback-panel ${feedback.correct ? "success" : "danger"}`}>
      <span>{feedback.correct ? feedback.successTitle : "System still unstable"}</span>
      <strong>{feedback.result}</strong>
      <p>{feedback.correct ? feedback.successBody : feedback.result}</p>
      {!feedback.correct ? <small>Try another move. The wrong answer stays useful because it shows what broke the model.</small> : null}
      {feedback.correct && hasNextMission ? (
        <button type="button" className="primary-link revision-next-button" onClick={onNextMission}>
          Open next mission
        </button>
      ) : null}
    </div>
  );
}

function MissionArena({
  mission,
  missionState,
  onSelectOption,
  onDeploy,
  onNextMission,
  hasNextMission,
}) {
  const state = missionState[mission.id];

  return (
    <div className="panel revision-arena-panel">
      <div className="panel-header stacked">
        <div>
          <p className="eyebrow">Active mission</p>
          <h3>
            {mission.code}: {mission.title}
          </h3>
          <p className="panel-copy">{mission.prompt}</p>
        </div>
      </div>

      <MissionIntel mission={mission} />
      <ActionDeck
        mission={mission}
        selectedOptionId={state?.selectedOptionId}
        onSelectOption={onSelectOption}
      />

      <div className="revision-deploy-row">
        <div className="revision-deploy-meta">
          <strong>{mission.difficulty}</strong>
          <span>Attempts: {state?.attempts ?? 0}</span>
        </div>
        <button
          type="button"
          className="primary-link revision-deploy-button"
          disabled={!state?.selectedOptionId}
          onClick={onDeploy}
        >
          Deploy repair move
        </button>
      </div>

      <FeedbackPanel
        feedback={state?.lastFeedback}
        onNextMission={onNextMission}
        hasNextMission={hasNextMission}
      />
    </div>
  );
}

function MissionLog({ logs }) {
  return (
    <div className="panel revision-log-panel">
      <p className="eyebrow">Repair log</p>
      <h3>Recent system responses</h3>
      <div className="revision-log-stack">
        {logs.length ? (
          logs.map((entry) => (
            <article key={entry.id} className={`revision-log-card ${entry.correct ? "success" : "danger"}`}>
              <span>
                {entry.missionCode} • {entry.correct ? "stable" : "retry needed"}
              </span>
              <strong>{entry.title}</strong>
              <p>{entry.message}</p>
            </article>
          ))
        ) : (
          <div className="revision-log-card idle">
            <span>No deployments yet</span>
            <strong>The log will fill as missions react to your moves</strong>
            <p>Start with Mission 1 and work upward.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RevisionGame({ missions, lore }) {
  const [activeMissionIndex, setActiveMissionIndex] = useState(0);
  const [missionState, setMissionState] = useState(() => createInitialMissionState(missions));
  const [logs, setLogs] = useState([]);

  const unlockedIndex = useMemo(() => {
    let prefix = 0;

    while (prefix < missions.length && missionState[missions[prefix].id]?.solved) {
      prefix += 1;
    }

    return Math.min(prefix, missions.length - 1);
  }, [missions, missionState]);

  const activeMission = missions[activeMissionIndex];
  const activeState = missionState[activeMission.id];
  const hasNextMission = activeMissionIndex < missions.length - 1;

  function handleReset() {
    setMissionState(createInitialMissionState(missions));
    setActiveMissionIndex(0);
    setLogs([]);
  }

  function handleSelectMission(index) {
    setActiveMissionIndex(index);
  }

  function handleSelectOption(optionId) {
    setMissionState((current) => ({
      ...current,
      [activeMission.id]: {
        ...current[activeMission.id],
        selectedOptionId: optionId,
      },
    }));
  }

  function handleDeploy() {
    if (!activeState?.selectedOptionId) {
      return;
    }

    const option = activeMission.options.find((item) => item.id === activeState.selectedOptionId);

    if (!option) {
      return;
    }

    const feedback = {
      correct: Boolean(option.correct),
      result: option.result,
      successTitle: activeMission.successTitle,
      successBody: activeMission.successBody,
    };

    setMissionState((current) => ({
      ...current,
      [activeMission.id]: {
        ...current[activeMission.id],
        attempts: current[activeMission.id].attempts + 1,
        solved: current[activeMission.id].solved || Boolean(option.correct),
        lastFeedback: feedback,
      },
    }));

    setLogs((current) => [
      {
        id: `${activeMission.id}-${current.length}-${Date.now()}`,
        missionCode: activeMission.code,
        title: activeMission.title,
        message: option.result,
        correct: Boolean(option.correct),
      },
      ...current.slice(0, 7),
    ]);
  }

  function handleNextMission() {
    setActiveMissionIndex((current) => Math.min(current + 1, missions.length - 1));
  }

  return (
    <div className="revision-game-shell">
      <div className="panel revision-intro-panel">
        <div className="revision-intro-copy">
          <p className="eyebrow">Game Revision 1</p>
          <h3>Signal Rescue: repair the embedded stack</h3>
          <p className="panel-copy">
            This game turns revision into a set of technical rescue missions. You do not answer for
            marks. You deploy repair moves that either stabilize or further disturb the simulated
            system, and every response explains the engineering reason.
          </p>
        </div>

        <div className="revision-lore-stack">
          {lore.map((item) => (
            <div key={item} className="revision-lore-card">
              {item}
            </div>
          ))}
        </div>
      </div>

      <MissionHud missions={missions} missionState={missionState} onReset={handleReset} />

      <div className="revision-main-grid">
        <MissionMap
          missions={missions}
          missionState={missionState}
          activeMissionId={activeMission.id}
          unlockedIndex={unlockedIndex}
          onSelectMission={handleSelectMission}
        />

        <MissionArena
          mission={activeMission}
          missionState={missionState}
          onSelectOption={handleSelectOption}
          onDeploy={handleDeploy}
          onNextMission={handleNextMission}
          hasNextMission={hasNextMission}
        />
      </div>

      <MissionLog logs={logs} />
    </div>
  );
}
