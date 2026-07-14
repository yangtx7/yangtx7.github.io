---
layout: post
title: "Agent for Optimization: Anthropic's Performance Takehome"
date: 2026-07-14 12:00:00+08:00
description: Using Claude Opus 4.8 to optimize Anthropic's kernel performance takehome down to 986 cycles.
tags: [agent, HPC]
categories: [blog]
giscus_comments: false
---

## Preface

Since graduating from college, I have still been working on optimization, but it has long had little to do with performance optimization. Recently, because I have been doing various kinds of agent-related research, I have seen agents being applied to algorithm design, data generation, kernel writing, and many other areas. After gaining what I consider to be a modest understanding of the latest progress and points of attention across different fields, I currently believe that all kinds of **code structures**—whether kernels, algorithmic frameworks, or something else—will inevitably be produced fully automatically in the near future, without humans having to write them manually. For a given ISA and a given computational operation, the optimal kernel, assuming we can prove optimality, must be rather "ugly." It will not have the elegance of a universal algorithm.

One philosophical idea is that "anything that can be well evaluated can eventually be achieved." This explains, to some extent, the rapid improvement in LLM capabilities after various RL algorithms were applied. Kernels are different from many other domains in that they are exactly a **single-objective optimization problem**, which makes them a suitable target for a breakthrough.

## Problem Description

Through a series of coincidences, I happened to come across Anthropic's [original_performance_takehome](https://github.com/anthropics/original_performance_takehome). The task is to optimize a kernel, running on a simulated ISA, that performs batched binary-tree traversal plus hashing. The goal is to minimize the number of cycles.

On the GitHub page, its performance is described as follows:

<div class="row justify-content-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/pic21.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
</div>

The GitHub repo also says that if you can optimize it below 1487 cycles, you can email Anthropic to *get us excited about hiring you*. In its copyright file, it says: "Permission is granted to modify and use, but not to publish or redistribute your solutions so it's hard to find spoilers."

For a repo this well known, it is impossible that nobody has published their own solution. With some simple searching, one can find solutions posted online claiming 1076 cycles. I did not verify their correctness or whether they involved cheating; I am simply reporting their claimed results here. There are also results such as 1103 and 1149 cycles. If I had not achieved a result better than those published online, there would have been no reason for me to write this blog. That said, I will still respect the repo's copyright. I will only describe my solution vaguely here and will not publish my code. If you are interested or would like to discuss it with me, feel free to reach out.

## My Solution

I used Claude Opus 4.8 with the default Claude Code harness. My approach was to read the solutions written by the agent, explicitly tell the agent how it should modify them, and suggest what kinds of methods it should try.

| Version | What was done | Cycles |
| --- | --- | ---: |
| 0 | baseline | 147734 |
| 1 | vectorize + fuse the hash + eliminate the wrap + keep state resident + list scheduler | 1864 |
| 2 | dedupe shallow gathers — compute `node_val` from the address bits via multilinear interpolation | 1693 |
| 3 | software pipelining; offload the index update to the idle scalar ALU | 1412 |
| 4 | design and adopt a DSL: virtual-register IR → allocate → lower → schedule | 1455 |
| 5 | scheduler picks the engine dynamically + change of state representation | 1274 |
| 6 | load-aware tie-breaking | 1258 |
| 7 | per-group pipeline offsets | 1204 |
| 8 | max out the scratch reuse distance + iterative reordering | 1190 |
| 9 | level 0 of the select tree switched to arithmetic | 1171 |
| 10 | LSB reuse — every tree mask becomes free | 1153 |
| 11 | hoist a constant XOR off the load critical path | 1150 |
| 12 | reclaim dead resident vectors | 1147 |
| 13 | let `pause` ride an empty slot in an existing bundle | 1146 |
| 14 | hill-climb the per-group pipeline offsets | 1135 |
| 15 | dead-code elimination, per-round direction choice, multilinear trees, bit-reversed trees, ALU-synthesized constants, **joint program search over structure × offsets** | 1035 |
| 16 | tighten the hash's temporaries, tighten the dial's structure | 1025 |
| 17 | revisit the DSL's design | 986 |


It took me half an hour to reach version 1, about 2 hours in total to reach version 7, about 4 hours in total to reach version 13, and roughly 6 hours to reach the final performance of version 17. I think that, given unlimited time, I could optimize it to around 900 cycles. My guess is that the current best performance is somewhere around 800–900 cycles.

And that is the vague version of my solution. The end.
