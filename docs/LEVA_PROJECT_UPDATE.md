# Leva project and architecture snapshot

Date: 23 October 2026. The owner requested saving the Leva architecture analysis in the personal portfolio and GitHub, including the module graph.

## Published composition

- Personal home: approved Leva project entry and detail link. Creator content excludes this project.
- `/projects/leva`: project narrative, snapshot metrics, accessible module picker, source-checked directed overview, development limits and links to full graph/data/report.
- `/leva/graph.html`: full Graphify graph with 2,356 nodes, 7,381 links and 106 communities. The HTML visualizer loads vis-network 9.1.6 from unpkg; the overview does not require that CDN.
- `/leva/graph.json`, report and provenance: allowlisted, sanitized derived artifacts. No model weights, credentials, user databases, voice recordings, extractor logs or actual conversation content.
- Leva repository: `docs/architecture/` contains the same snapshot plus Mermaid overview and source trace. Source in that repository remains historical 0.3.0, explicitly distinguished from the mapped development snapshot 0.28.0.

The architecture is static evidence. INFERRED/AMBIGUOUS links, unresolved raw references, uncovered files and runtime limitations are disclosed; public metrics are graph counts, not fabricated activity or performance statistics. Source-file paths in the explorer refer to the 0.28.0 snapshot, not the repository's old import.

## Reproduce snapshot publication

Use the Leva repository's `scripts/export_graph_snapshot.py --source <local graphify-out> --output docs/architecture/graphify-out` in an environment with graphifyy and its NetworkX dependencies. Copy only the resulting allowlisted files into `apps/web/public/leva/`. Check SNAPSHOT.json hashes and run the portfolio checks before committing. The original private workspace is never added to Git.

## Validation

Publication tests validate audience boundaries, artifact hashes, graph endpoint integrity, UI/count parity and private-path/credential exclusion. Browser checks cover navigation, keyboard module selection, asset availability, creator-route exclusion, and 390/1440 px layouts. Full repository checks and production boundaries are recorded in the implementation log after execution.

This update adds public project documentation. It does not activate portfolio telemetry, owner authentication, laptop remote-control endpoints or a public Leva gateway.
