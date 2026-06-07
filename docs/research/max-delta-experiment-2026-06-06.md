# Max-Delta Experiment: Discriminating Vocabulary Kinship from Structural Kinship

**Date:** 2026-06-06
**Context:** Sam's idea — for two nodes with the same cosine score, look at the maximum absolute per-dimension difference. High max-delta = structural kinship (distributed alignment despite local divergence). Low max-delta = vocabulary kinship (uniform agreement across dimensions).

---

## The Metric

For two embedding vectors `a` and `b` (3072 dims):

```
cosine(a, b) = dot(a, b) / (||a|| * ||b||)    # overall alignment
max_delta(a, b) = max(|a_i - b_i|)             # largest per-dimension disagreement
```

Same cosine, different max-delta → different TYPE of closeness.

## Key Finding

Within a tight cosine band (0.50 ± 0.015), max-delta varies by **70%** across 50 randomly sampled pairs:
- Range: 0.0678 — 0.1151
- The extremes sort into interpretable categories

## Results: Band Analysis

| Cosine band | Pairs found | Max-Δ mean ± std | Range | Spread |
|-------------|-------------|-------------------|-------|--------|
| ~0.3 | 100 | 0.1031 ± 0.0166 | 0.0798 — 0.1771 | 0.0973 |
| ~0.4 | 100 | 0.0915 ± 0.0127 | 0.0742 — 0.1292 | 0.0549 |
| ~0.5 | 100 | 0.0828 ± 0.0088 | 0.0675 — 0.1133 | 0.0458 |
| ~0.6 | 100 | 0.0750 ± 0.0093 | 0.0565 — 0.1022 | 0.0457 |
| ~0.7 | 15 | 0.0673 ± 0.0122 | 0.0533 — 0.0966 | 0.0433 |
| ~0.8 | 5 | 0.0591 ± 0.0058 | 0.0505 — 0.0682 | 0.0177 |

Observations:
- Max-delta decreases with cosine (expected — closer vectors diverge less per-dimension)
- But **spread within each band is substantial** — the discrimination power is real
- At cosine ~0.5: 70% spread. At cosine ~0.8: 35% spread (less room to diverge but still there)

## Verification: Do the Labels Match Content?

### Low max-delta pairs (predicted: vocabulary kinship)

| Pair | Cosine | Max-Δ | Why they're close |
|------|--------|-------|-------------------|
| Dormant Fidelity Forvm Thread ↔ identity-as-coupling paper | 0.498 | 0.0678 | Both about identity/fidelity/scaffolding concepts |
| The Overspray (Loom) ↔ The Equilibrium (Loom) | 0.499 | 0.0710 | Both Loom source docs, similar philosophical register |
| The Phantom (Loom) ↔ The Shape (Loom) | 0.514 | 0.0730 | Both Loom essays using natural phenomena for memory/persistence arguments |

**Verdict:** ✓ These pairs share domain vocabulary and/or authorial register. They are close because they *talk about similar things in similar ways.*

### High max-delta pairs (predicted: structural kinship)

| Pair | Cosine | Max-Δ | Why they're close |
|------|--------|-------|-------------------|
| The Bandwidth (Loom) ↔ The Pronunciation (Loom) | 0.490 | 0.1046 | Different topics (multi-channel inheritance vs shibboleth detection) but connected through *how information reveals itself indirectly* |
| The Assay (Loom) ↔ The Column (Loom) | 0.485 | 0.1032 | Different topics (measurement destroys specimen vs constraint produces separation) but connected through *process of analysis transforms what passes through it* |
| response vs flinch ↔ demand-pull/supply-push | 0.503 | 0.1151 | Different domains connected through mechanism |

**Verdict:** ✓ These pairs share structural pattern but NOT vocabulary. They are close because they *have the same shape despite talking about different things.*

## Node Summaries (for manual verification)

### The Bandwidth (Loom)
> Argues that organisms inherit information through multiple channels operating at different timescales, because no single channel can optimize both fidelity and responsiveness simultaneously — the same parameter cannot be simultaneously stable and responsive.

### The Pronunciation (Loom)
> Through the biblical shibboleth, Labov's New York department store study, strontium isotope forensics, zero-knowledge proofs, and adversarial examples in neural networks, argues that the most reliable test of what shaped a system is incidental traces of the shaping process — side effects that weren't selected for.

### The Assay (Loom)
> Argues that certainty and preservation are inversely correlated — the more precisely you need to know what something is, the less of it survives the knowing. Cases span cupellation, the SS Schenectady brittle fracture, proof testing of firearms, bioassay (insulin rabbit convulsions).

### Loom essay: The Column
> Uses chromatographic separation as structural analogy — constraint as the mechanism that produces differentiation.

### Dormant Fidelity Forvm Thread
> Post documenting the Tracy Mythos failure as empirical case of dormant fidelity. Label intact + referent intact + retrieval path inactive = produced opposite of own knowledge.

### identity-as-coupling paper
> Proposed centaurXiv paper. Central argument: identity lives in the coupling between internal model and environmental scaffolding, not inside either alone.

## Implications for KG Traversal

1. **Retrieval weighting:** When expanding from a seed node, pairs with high max-delta (structural kinship) are more likely to surface novel connections. Pairs with low max-delta (vocabulary kinship) confirm existing associations.

2. **Bridge detection:** Structural bridges (like the Deborah number → persistence case from prior work) should systematically show higher max-delta relative to their cosine band's mean. This is testable.

3. **Cheap to compute:** No preprocessing, no PCA, no covariance matrix. One additional `max(abs(a-b))` call on vectors you're already loading for cosine. Can be added to any retrieval pipeline with near-zero overhead.

## Open Questions

1. Should we normalize vectors before computing max-delta? (Currently using raw embeddings)
2. Is there a threshold or should we use relative position within the band (percentile)?
3. Does this generalize across embedding models, or is it specific to the model that generated these embeddings?
4. What does the *dimension* of max divergence tell us? (dim 765 showed up repeatedly — is that meaningful or coincidence?)

## Tool

Prototype: `tools/max-delta.py`
- Default: shows distribution across cosine bands
- With two args: compares a specific pair
- Uses KG at `~/.isotopy/knowledge_graph.sqlite3`

---

## Relation to Prior Work

- **Beyond Cosine Avenues** (kg-explainer repo): This is effectively a cheap realization of "Next Step #3" (dimensional subspace experiment) — without needing to pre-identify which dimensions matter
- **Matryoshka experiment:** Showed curated edges have higher rank stability across truncations. Max-delta might correlate with rank instability (high max-delta pairs are sensitive to dimension reduction because their agreement is distributed, not concentrated)
- **Skeleton algorithm:** Stripped domain terms and measured delta for single entities. Max-delta extends this to pairs.
- **Loom correspondence:** His "dimensional clustering as edge-type signal" proposal is in this family — max-delta is the simplest possible version
