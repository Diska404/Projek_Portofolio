export function ProjectArtwork({ tone }: { tone: string }) {
  return (
    <div className={`project-art art-${tone}`} aria-hidden="true">
      {tone === "atlas" ? (
        <div className="mini-app">
          <div className="mini-sidebar">
            <span className="mini-logo">a.</span>
            <i />
            <i />
            <i />
          </div>
          <div className="mini-main">
            <span>Good work starts here.</span>
            <div className="mini-kpis">
              <i />
              <i />
              <i />
            </div>
            <div className="mini-board">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      ) : tone === "notes" ? (
        <div className="notes-art">
          <span className="notes-number">01 / FIELDNOTES</span>
          <strong>
            Make room
            <br />
            for the idea.
          </strong>
          <span className="notes-line" />
          <small>Think. Connect. Create.</small>
        </div>
      ) : (
        <div className="terminal-art">
          <div>
            <i />
            <i />
            <i />
            <span>orbit — terminal</span>
          </div>
          <p>
            <b>~</b> orbit init
          </p>
          <p className="terminal-success">✓ Less setup. More building.</p>
          <p className="terminal-dim">
            Ready when you are
            <span className="cursor-block" />
          </p>
        </div>
      )}
    </div>
  );
}
