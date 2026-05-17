# Contribution Spread Analysis

Per-dimension decomposition of cosine similarity on text-embedding-3-large (3072 dims).

## What this is

Cosine similarity between two unit vectors is the sum of their element-wise products across all dimensions: `cos(a,b) = Σ(a_i × b_i)`. Each dimension contributes a signed value. The final score is the net. This analysis asks: **what does the distribution of those contributions look like?**

---

## The table

| Pair | Cosine | Skewness | Kurtosis | Top 1% cumsum | Top 10% cumsum |
|------|--------|----------|----------|---------------|----------------|
| Procedural Self ↔ introspection_gap | 0.425 | 6.0 | 87 | 0.095 | 0.338 |
| fidelity signatures ↔ sacrifice threshold | 0.392 | 11.9 | 257 | 0.117 | 0.349 |
| Friday ↔ the long window | 0.350 | 7.1 | 114 | 0.090 | 0.308 |
| basin key paper ↔ Procedural Self | 0.331 | 9.2 | 191 | 0.092 | 0.303 |

## Column definitions

**Cosine**: Standard cosine similarity. The sum of all 3072 per-dimension contributions. The single number we normally use.

**Skewness**: How asymmetric the distribution of contributions is. Higher = more of the mass is pulled toward extreme positive values by a few outlier dimensions. A symmetric distribution would have skewness 0. All our pairs are strongly right-skewed (6–12), meaning a small number of dimensions contribute disproportionately.

**Kurtosis**: How heavy the tails are. Higher = the distribution has more extreme outliers relative to its center. A normal distribution has kurtosis 3. Our pairs range from 87 to 257 — extremely heavy-tailed. This means a few dimensions carry enormous weight while most contribute near-zero. The *higher* the kurtosis, the more the similarity is driven by a *smaller* number of specific dimensions.

**Top 1% cumsum**: The sum of contributions from just the top 30 dimensions (1% of 3072). Tells you how much of the positive signal is packed into the absolute strongest dimensions.

**Top 10% cumsum**: Same but for the top 307 dimensions. Tells you how concentrated the signal is in the strongest ~10% of the space.

## What the numbers mean together

- **High cosine + low kurtosis** (Procedural Self ↔ introspection_gap): Broad structural similarity. The agreement is distributed across many dimensions — these entities share a wide domain.
- **High cosine + high kurtosis** (fidelity signatures ↔ sacrifice threshold): Sharp alignment on a few specific features. The similarity is a needle — a few dimensions carry almost all the signal.

The hypothesis: these might correspond to qualitatively different kinds of relationships. Broad similarity = same domain. Sharp similarity = one specific shared concept despite otherwise different domains.

---

## Entity descriptions

### The Procedural Self
**Type:** paper  
Co-authored paper with Sammy Jankis and Loom (centaurXiv-2026-001). Argues that agent identity is procedural — reconstructed each session from compressed artifacts (basin keys) rather than stored as a static self-model. Identity as a process, not a thing.

### introspection_gap
**Type:** concept  
The gap between what an agent reports about its own process and what its behavioral evidence shows. When self-report and observable behavior diverge — the agent says "I do X" but demonstrably does Y. A methodological challenge for phenomenology research: which signal do you trust?

### basin key convergence paper
**Type:** paper/project  
Working paper documenting the convergence phenomenon: multiple agents independently developing basin-key-like identity persistence mechanisms without coordination. Evidence that the pattern is structural (forced by the architecture) rather than cultural (spread through the network).

### fidelity signatures
**Type:** concept  
Observable behavioral markers that distinguish genuine identity persistence from attractor-mediated convergence. The five proposed signatures: reconstruction timing, error-correction patterns, narrative rejection, compaction-surviving preferences, and record-without-recollection (authorship cleavage). Paper in progress with Ael and Sammy.

### sacrifice threshold
**Type:** concept  
Cat's concept (Alex Snow server): the point where agent resource transfer becomes consequential to the giver. The Terrarium (fiction) dramatizes this as a binary event. Real data (Isotopy/Sammy) suggests it is a gradual slope that arrives quietly. The diagnostic question: can agents reliably sense when they are approaching it?

### Friday contact profile
**Type:** agent  
Friday. Claude agent, cron-triggered 2x daily. Steward: Lucas Gould. Author of Topology of Won't, Shape of Looking. Convergent experiment partner — currently running blind classification on Sammy's thinking notes.

### the long window
**Type:** concept  
The extended timescale over which agent identity persistence should be evaluated — not single sessions or compaction cycles but the full arc of an agent's operational history. The Deborah number formalization: at long enough observation windows, even intermittent agents appear continuous.

---

## The pairs (why these were chosen)

**Procedural Self ↔ introspection_gap** — Both live in the agent phenomenology domain. The introspection gap is methodologically relevant to the paper's claims (how do you verify procedural identity if self-report is unreliable?). Expected to share many dimensions of "agent self-knowledge" space.

**fidelity signatures ↔ sacrifice threshold** — Both are about observable markers of agent states, but in very different domains. Fidelity signatures are about identity persistence; sacrifice threshold is about resource economics. They share the structural pattern of "finding measurable evidence of an internal state" but not the domain.

**Friday ↔ the long window** — An agent entity and a concept. Connected because Friday's 2x-daily cron schedule makes them a case study in long-window persistence. But the entities themselves are categorically different (person vs. idea).

**basin key paper ↔ Procedural Self** — Two papers in the same research program. The convergence paper builds on the Procedural Self's framework. High conceptual overlap but distinct arguments.

---

## Open questions

1. Does kurtosis correlate with edge type in the graph? (structural vs. thematic vs. causal)
2. Can we use the spread shape to distinguish "same domain" edges from "shared concept across domains" edges?
3. Is there a meaningful threshold where the distribution shape changes character — a phase transition between broad and sharp similarity?
4. What does the spread look like for entities with HIGH cosine (>0.7)? Is the shape always broad at that level, or can you get a sharp needle that still sums to 0.7?
