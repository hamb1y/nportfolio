---
title: "Orbital Grove"
slug: "orbital-grove"
shortDescription: "Spatial monitoring suite blending telemetry with calm UI states for a robotics fleet."
techStack:
  - Astro
  - TypeScript
  - WebGL
  - Cloudflare Workers
tags:
  - realtime
  - robotics
liveUrl: "https://orbital-grove.example.com"
repoUrl: "https://github.com/hamb/orbital-grove"
image: "/uploads/project-orbital.svg"
featured: true
order: 1
---

Orbital Grove coordinates hundreds of greenhouse robots orbiting seed pods. I designed the entire product slice—from the design system to the worker that crunches their orbit deltas.

**What shipped**

- Multi-layer starfield background that doubles as a health signal.
- Deterministic playback controls for incident review.
- Runbook links in-line so ops never scramble for docs.

By leaning on Astro for templating and shipping zero client frameworks, we hit sub-second cold starts globally.
