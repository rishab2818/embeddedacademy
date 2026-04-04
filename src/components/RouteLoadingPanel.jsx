export default function RouteLoadingPanel({ title = "Loading lesson", body = "Preparing the next view..." }) {
  return (
    <section className="panel route-loading-panel">
      <p className="eyebrow">Loading</p>
      <h3>{title}</h3>
      <p className="panel-copy">{body}</p>
      <div className="route-loading-bar" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
