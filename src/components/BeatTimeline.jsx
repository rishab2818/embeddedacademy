export default function BeatTimeline({ tracks, rows }) {
  return (
    <div className="beat-timeline">
      {tracks.map((track) => (
        <div key={track.id} className="beat-track-row">
          <div className="beat-track-label">
            <strong>{track.label}</strong>
          </div>

          <div className="beat-track-cells" aria-label={track.label}>
            {rows[track.id].map((cell, index) => (
              <div
                key={`${track.id}-${index}`}
                className={`beat-cell ${cell.kind ?? track.type} ${cell.active ? "active" : ""}`}
              >
                {cell.label}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
