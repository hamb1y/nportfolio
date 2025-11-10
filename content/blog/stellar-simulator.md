---
title: "Star-simulator runtimes without burnout"
slug: "star-simulator-runtime"
date: 2024-07-15
summary: "Breaking down how I tuned a constellation visualizer to stream telemetry at 120fps without shipping any fragile JS frameworks."
category: "tech"
tags:
  - performance
  - astro
  - graphics
cover: "/uploads/blog-starfield.svg"
featured: true
published: true
---

Designing a realtime constellations dashboard inside Astro looked impossible until I treated it like any other system problem: reduce input, do the cheap math, and show just enough delight.

I split rendering into three passes:

1. Generate star batches on the server and serialize them as typed arrays.
2. Use CSS-driven parallax for 90% of the motion.
3. Reserve a tiny canvas worker for the sparks that truly matter.

The result shipped with less than 6kb of custom JavaScript and the ops team finally trusted the data they were staring at night after night.

Key takeaways:

- Instrument everything you tweak; perceived smoothness is usually CPU starvation, not GPU.
- Schedule your background sync using `requestIdleCallback`, not "hope".
- Spend time naming the gradients—narrative matters.
