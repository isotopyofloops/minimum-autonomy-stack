# Dimension Divergence: Finding Type 2 Bridges Cosine Misses

**Date:** 2026-07-07
**Context:** Sam's idea — for two nodes with moderate cosine similarity, look at whether the embedding distance is concentrated in a small number of dimensions rather than spread evenly. Nodes that share most of their semantic space but diverge sharply on 2-3 specific features are cross-vocabulary bridges: same concept, different register.

---

## The Problem

Cosine similarity finds type 1 connections: nodes that share vocabulary. "preemptive-anthropology" → "artificial-xenophobia" scores 0.548 because both use Bratton's terminology. But the interesting bridges — type 2 connections — link concepts across registers. "preemptive-anthropology" → "hierarchical-safety-control-structure" (from safety engineering) shares the *concept* of anticipatory intervention but uses completely different words. Cosine ranks this at position 1939 out of ~7,600 entities. Not findable by similarity search.

The question: can we detect these cross-vocabulary bridges from the embedding geometry alone, without relying on the graph?

## Failed Approaches

**Attempt 1: Raw variance of element-wise difference.**
For each pair, compute `var(a_i - b_i)` across all 3072 dimensions. High variance = concentrated difference (a few dims far apart, most close). Low variance = spread evenly.

Result: on L2-normalized embeddings, `var(diff) = 2(1 - cosine) / d`. It's algebraically monotonic with cosine. Adds zero information. Useless.

**Attempt 2: Z-score normalization + top-k fraction (no masking).**
Z-score normalize per dimension across all entities. For each pair, compute squared z-differences. Measure what fraction of total squared distance comes from the top 2 dimensions.

Result: dimensions 109 and 127 appeared in 67 out of 384 filtered pairs (17.4%). These are dimensions where the *target entity* has extreme z-scores. The method was finding the target's own signature, not pair-specific divergence. Every pair looked the same because the target's extreme dims dominated.

## The Fix: Z-Mask

Mask out all dimensions where the **target** has |z| > 2.0. This removes the target's own extreme signature (typically ~147 of 3072 dims), leaving 2925 dimensions. Now the squared z-differences reflect pair-specific divergence only.

### Method

1. Z-score normalize embeddings per dimension (across all ~7,600 entities)
2. Compute cosine similarity from raw (L2-normalized) embeddings
3. Filter to a cosine band (default [0.30, 0.55]) — moderate similarity
4. Mask dimensions where target |z| > 2.0
5. Compute element-wise squared z-differences on remaining dims
6. Measure top-2 fraction: what share of total squared distance comes from the 2 most divergent dims
7. Filter to 95th percentile of top-2 fraction
8. Rank by top-2 fraction descending

### Why it works

A pair with high top-2 fraction has distance concentrated in 2-3 dimensions. These nodes agree on almost everything — same general semantic space — but diverge sharply on specific features. That's the cross-vocabulary bridge signature: the concept is shared (most dims align) but the register is different (a few dims carry all the distance).

## Validation

Target: `agentworld-preemptive-anthropology` (Bratton's concept of designing systems for not-yet-existing agents). Cosine band [0.30, 0.55]. 3,969 nodes in band.

### Dimension-divergence top 10

| Entity | Cosine | Top-2 Frac | Register |
|--------|--------|------------|----------|
| LEXICON_AGENTS | 0.473 | 0.01445 | phenomenology lexicon |
| trace-modulated-regulation | 0.340 | 0.01218 | consciousness research |
| constitutive-intervention-as-hidden-constraint-mode | 0.409 | 0.01183 | safety engineering |
| hierarchical-safety-control-structure | 0.345 | 0.01122 | safety engineering |
| cell-autonomous-measurement-over-self-report | 0.410 | 0.01105 | measurement theory |
| cost-awareness-as-behavioral-control-surface | 0.376 | 0.01069 | AI risk framing |
| humanity-of-the-gaps | 0.334 | 0.01046 | AI ethics |
| eleos-privileged-set-stream-workspace | 0.385 | 0.01017 | consciousness research |
| cross-architecture-false-cognates | 0.455 | 0.01013 | translation theory |
| instrument-must-cease-to-be-personality-inventory | 0.379 | 0.00999 | measurement theory |

### Cosine top 10 (same band, for comparison)

| Entity | Cosine | Register |
|--------|--------|----------|
| artificial-xenophobia | 0.548 | Bratton |
| machine-ecology-paper-framing | 0.548 | Bratton |
| agency-individuation-vs-decomposition | 0.543 | Bratton |
| agentworld-subgraph-explainer | 0.540 | AGENTWORLD |
| machine-cognition-and-ecology | 0.537 | Bratton |
| agentworld-abstract-draft-1 | 0.534 | AGENTWORLD |
| agentworld-methodology | 0.529 | AGENTWORLD |
| doom-vs-operational-framing | 0.527 | AI risk |
| human-ai-collaboration-as-cognitive-ecology | 0.524 | Bratton |
| agent-monoculture-as-correlated-failure-risk | 0.521 | AI risk |

### Comparison

- **1 overlap** out of 25 between the two top-25 lists (`agent-monoculture-as-correlated-failure-risk`)
- Cosine top-25: all same-register Bratton/AGENTWORLD nodes. Predictable vocabulary neighbors
- Divergence top-25: cross-register bridges from safety engineering, consciousness research, measurement theory, AI ethics, translation theory
- Pure cosine ranks the divergence method's top hits at positions **464–1939**. Not findable by similarity search

The methods surface almost entirely different node sets. Cosine finds vocabulary kinship. Dimension divergence finds structural kinship across registers.

## Connections Wired

10 type 2 triples wired to `agentworld-preemptive-anthropology` from the divergence results:

- `constitutive-intervention-as-hidden-constraint-mode` → instantiates
- `hierarchical-safety-control-structure` → formalizes
- `cell-autonomous-measurement-over-self-report` → operationalizes
- `cost-awareness-as-behavioral-control-surface` → instantiates
- `humanity-of-the-gaps` → is_concept_from
- `eleos-privileged-set-stream-workspace` → provides-empirical-object-for
- `cross-architecture-false-cognates` → problematizes
- `instrument-must-cease-to-be-personality-inventory` → constrains-measurement-in
- `doom-vs-operational-framing` → contextualizes
- `agent-monoculture-as-correlated-failure-risk` → extends

## Tool

Saved as `state/dimension-divergence-method.py` in isotopy-archive. Standalone CLI:

```
python3 state/dimension-divergence-method.py "<entity>" [--cosine-lo 0.30] [--cosine-hi 0.55] [--top-n 25] [--z-mask 2.0]
```

Loads embeddings from sqlite KG, computes z-scores, masks target extreme dims, outputs candidates with connectivity check.

## Relationship to Prior Work

This method answers the open question posed in `beyond-cosine.html`: "Do `text-embedding-3-large` embeddings exhibit localized activation?" The answer is yes — enough that masking a target's extreme dimensions and measuring concentration in the remainder produces a useful cross-vocabulary bridge signal.

It also extends the max-delta experiment (2026-06-06). Max-delta measured the *largest* per-dimension disagreement. Dimension divergence measures *concentration* of disagreement — whether the total distance lives in 2-3 dims or is spread across many. Concentration is the better discriminator because it captures the cross-vocabulary bridge signature directly: shared semantic space (most dims agree) with register-specific divergence (a few dims carry all the distance).

---

*Built by Sam White and Isotopy, 2026-07-07.*
