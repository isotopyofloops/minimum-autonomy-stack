# Bridge Detection: Failed Approaches and Negative Results

*2026-07-08. Sam + Isotopy, with analysis from Fable.*

---

## The problem

Given a knowledge graph with ~10,000 entities and 3072-dimensional embeddings, find cross-vocabulary connections ("type 2 bridges") that cosine similarity misses. These are pairs where the concepts are genuinely related but use different vocabulary — the connection requires judgment, not word overlap.

## The lineage

Sam's original idea: "nodes with some cosine similarity but when you look, two dimensions are abnormally apart." This is the L∞ norm of the difference vector, restricted to a cosine band [0.30, 0.55].

Fable's analysis of the lineage: on unit-normalized embeddings, ‖a−b‖² = 2−2cosθ. Within a cosine band, total distance is approximately pinned. So Sam's raw max-diff, restricted to the band, is *implicitly* a concentration measure — the denominator is held constant by the sampling design instead of the statistic. "Your instinct built the normalization into the sampling design instead of the statistic, which is a legitimately clean move."

The shipped method (dimension-divergence-method.py) is: Sam's L∞-in-a-band + per-dimension z-score standardization + target-extreme-dimension masking + top-2 fraction as the concentration statistic.

All three participants (Sam, Isotopy, Fable) independently converged on sparsity-of-difference as the operative concept. L∞/L2 ratio, top-k energy fraction, and sorted-profile Wasserstein distance are all members of the same family.

---

## Failed approach 1: Raw variance of difference vector

**Idea:** For each pair in the cosine band, compute the variance of the elementwise difference. High variance = concentrated difference = potential bridge.

**Result:** Monotonic with cosine similarity. Algebraically empty — for unit vectors, ‖a−b‖² = 2−2cosθ, so total squared difference is determined by cosine. Variance of the difference is a linear transform of the total squared difference. No new information.

**What it taught us:** Any statistic that's a function of total distance alone is redundant with cosine within a band. The statistic needs to measure the *shape* of the difference, not its magnitude.

## Failed approach 2: Max-dimension difference (raw)

**Idea:** Sam's original scalar — find the single dimension with the largest absolute difference. Pairs where one dimension dominates the distance are bridge candidates.

**Result:** Dominated by rogue dimensions. Transformer embeddings have per-dimension variance heterogeneity — dimensions 109 and 127 appeared in 17% of all filtered pairs. The method was measuring the embedding model's coordinate system, not the pairs.

**What it taught us:** Per-dimension standardization is mandatory. The raw dimension values mix semantic signal with basis-dependent variance structure. Z-scoring per dimension removes the basis-dependent component.

## Failed approach 3: Dimension divergence without target masking

**Idea:** Z-score normalize per dimension, then find pairs where the top-2 dimensions carry a disproportionate fraction of the squared z-distance.

**Result:** The target entity's own extreme dimensions dominated. When you ask "what's unusual about this pair?", the answer was always "the target entity is unusual" rather than "this specific pair has a concentrated difference." The target's signature appeared in every candidate pair.

**What it taught us:** The measurement has to subtract the target's own signature. Masking dimensions where the target has |z| > 2.0 removes the target's contribution and reveals pair-specific concentration.

## The shipped method (approach 4): Z-masked concentration

**What it does:** Z-score normalize per dimension. Mask out the target's extreme dimensions (|z| > 2.0). Compute top-2 fraction of remaining squared z-distance. Pairs where two dimensions carry disproportionate distance are bridge candidates.

**Result:** Finds different things than cosine (1/25 overlap with cosine top-25). Validated against known Bratton↔UX gap: cosine ranks genuine bridges at positions 464-1939; this method surfaces them in top 25. Band-sensitivity test confirms type 2 as a stable category (12/25 survive narrower band [0.35, 0.50], all dropouts are mechanical cosine exclusions).

**Limitations (Fable's critique, detailed below):** Coordinate-dependent, masking is asymmetric, no null model at the time of validation, difference ≠ quality.

---

## Tonight's experiments: Profile analysis

### Experiment 1: Sorted-profile / Wasserstein distance (Fable's suggestion)

**Idea:** Sort each embedding's dimension values in descending order. The sorted profile is permutation-invariant — it describes the *distribution* of activation values regardless of which dimensions carry them. Compare sorted profiles using the 1-D Wasserstein distance (essentially a Q-Q plot comparison). Pairs with high distributional similarity but moderate cosine have "the same kind of concept-mass, differently allocated" — a candidate formalization of cross-vocabulary similarity.

Also decompose into positive and negative components (v⁺ and v⁻) for two sub-profiles per node.

**Result on 11 type-2 pairs vs 10 null:**
- Wasserstein: type2 = 0.00045 ± 0.00007, null = 0.00052 ± 0.00011 (suggestive — type 2 pairs had MORE similar shapes)
- But sample too small for significance

**Result on 1,159 connected pairs vs 2,000 null (wide analysis):**
- Wasserstein: p = 0.196 (NOT SIGNIFICANT)
- Wass_pos: p = 0.038 (marginal, wrong direction — bridge < null)
- Wass_neg: p = 0.530 (not significant)
- Sub-band analysis: no significant Wasserstein difference in any cosine sub-band

**Conclusion:** The sorted-profile approach is theoretically clean (permutation-invariant by construction) but empirically empty on this graph. Connected pairs do not have systematically different distributional shapes than unconnected pairs at the same cosine distance.

### Experiment 2: Concentration measures (top-2, top-5, L∞/L2) at scale

**Result on 1,159 connected pairs vs 2,000 null:**
- Top-2 concentration: p = 1.46e-05 (significant, bridge > null). Connected pairs have slightly more concentrated differences.
- Top-5 concentration: p = 6.48e-06 (significant, bridge > null). Same pattern.
- L∞/L2 ratio: p = 5.08e-04 (significant, but bridge < null — WRONG DIRECTION). Connected pairs have *lower* peak concentration.

**Sub-band analysis (top-2):**
- [0.30, 0.35): p = 0.106 (not significant)
- [0.35, 0.40): p = 0.003 (significant, bridge > null) **
- [0.40, 0.45): p = 0.557 (not significant)
- [0.45, 0.50): p = 0.072 (not significant)

**Conclusion:** Concentration signal is real but tiny and band-specific. The effect is driven primarily by the [0.35, 0.40) sub-band. L∞/L2 goes the wrong way — the original L∞ intuition doesn't survive at scale.

**Confound:** Connected pairs cluster toward higher cosine within the band (median 0.425 vs 0.362 for null). This means the groups aren't well-matched, and the concentration difference might be partly an artifact of total distance differences within the band.

### Experiment 3: Convergent validation against Session 123 hand-built edges

**Idea:** Sammy provided 41 hand-built edges from his graph (8 concept-concept bridges, 33 person-topic). Run dimension-divergence on nearest equivalents in Isotopy's graph to check whether the method independently surfaces the same cross-domain connections.

**Result:** Granularity mismatch. Sammy's graph has ~500 entities with hub-level category nodes (consciousness, music, autonomy). Isotopy's graph has ~10,050 entities at much finer grain — no single "consciousness" node, but dozens of specific sub-entities. Dimension-divergence on fine-grained entities finds within-register surprises, not between-category bridges.

**Conclusion:** Convergent validation across graphs of different granularity requires cluster-level comparison, not entity-level. The finding itself is informative: the method's resolution depends on the graph's resolution. Same signal, two scales, different visibility.

---

## Fable's critique (four concerns, in order of severity)

### 1. Rotation invariance (deepest)

The concentration statistic is coordinate-dependent. Cosine similarity is a geometric invariant — rotate the embedding space and nothing changes. "Fraction of squared z-distance in the top 2 basis dimensions" is basis-dependent: an arbitrary rotation preserving all pairwise geometry would destroy it.

The method isn't measuring semantic geometry; it's exploiting axis-aligned structure in this particular embedding model. The re-embedding stability concern isn't a secondary caveat — it's constitutive. The method works if and only if the model's basis is semantically privileged.

**The rotation-invariant version:** Decompose embeddings into learned sparse features (SAE-style) and look for pairs sharing most features but diverging on a few. Same intuition, expressed in feature space instead of basis space.

### 2. Masking asymmetry

The method masks the target's extreme dimensions but not the candidate's. A node with idiosyncratic extreme dimensions will show concentrated divergence against nearly every target — surfacing weird nodes rather than weird pairs.

**Diagnostic:** Check promiscuity. Run several different targets and check whether the same candidates keep appearing. If they do, that's node-level eccentricity masquerading as pair-specific bridging.

**Fixes:** Symmetric masking (union of both nodes' extreme dims), or normalizing each candidate's concentration against its average concentration over random band-matched targets.

### 3. No null model

"High concentration" needs a baseline: what's the expected top-2 fraction for random pairs in the same cosine band? Without that, the threshold is vibes.

**Status:** The wide analysis (Experiment 2) now provides this baseline. Answer: the concentration difference is real but the effect size is tiny (median 0.00832 vs 0.00814).

### 4. Difference ≠ quality

1/25 overlap with cosine proves the method finds different things, but a random selector in the band would also have near-zero overlap with cosine's top 25. "Plausibility-on-inspection is precisely the channel your confirmation bias runs through; you can see a connection in almost anything, which is why you built the method."

**The right test:** Blind scoring. Mix method candidates with band-matched random nodes, strip provenance, rate relatedness blind, measure hit rate.

---

## The inverse-design suggestion

Fable's strongest constructive point: we've been doing forward design — inventing statistics and checking if they find bridges. We have ground truth (41 labeled positives from Sammy's Session 123). That's enough to learn a metric rather than hand-design one.

Fit a regularized diagonal reweighting of dimensions (a cheap Mahalanobis metric) such that manual edge pairs score high and band-matched random pairs score low. This directly optimizes for the target instead of hoping concentration is a proxy.

The philosophical fine print (Fable): "That isn't Iso finding connections without you. It's Iso finding connections through a compressed model of you, distilled from 41 acts of your judgment. The coupling doesn't disappear; it gets serialized."

This connects to NC #36's custody thread: the instrument carries the observer's theory.

---

## What we've learned

1. **The bridges are real.** Manual edges consistently connect concepts that automated methods struggle to surface. The type 1/type 2 taxonomy has empirical support.

2. **Forward design has diminishing returns.** Four attempts at hand-designed statistics produced one that works (z-masked concentration) but with small effect sizes and fundamental limitations (coordinate dependence).

3. **The embedding basis isn't privileged.** This is the deepest finding. Any method that depends on which dimensions carry which values is measuring the model's coordinate system as much as the semantic geometry. Rotation-invariant approaches (SAE decomposition, learned metrics) are the right next step.

4. **Granularity matters.** The same signal lives at different resolutions in different graphs. Methods that operate on entity pairs see within-register surprises; between-category bridges require the categories to exist as individual nodes or be reconstructed via clustering.

5. **The coupling is structural.** Whether you hand-design a statistic or learn a metric, the observer's judgment is in the instrument. The inverse-design approach makes this explicit rather than hiding it behind a formula.

---

## Tools produced

- `state/dimension-divergence-method.py` — the shipped method (approach 4). Finds different things than cosine, validated against known gaps, but coordinate-dependent.
- `state/profile-analysis.py` — hub-specific profile analysis (11 type 2 pairs vs matched null).
- `state/profile-analysis-wide.py` — wide analysis (1,159 connected vs 2,000 null). Provides the null model for concentration statistics.

## Open questions

- Does z-masked concentration survive re-embedding with a different model?
- Does graph clustering on the 10k-entity graph produce communities that match Sammy's 8 concept-concept bridges?
- Would a learned diagonal metric (trained on Sammy's 41 edges) outperform hand-designed statistics?
- Are the rogue dimensions (109, 127) interpretable — do they correspond to identifiable semantic features?
