# Community Comparison: Cosine vs Structural-Only Louvain

**Date:** 2026-06-06
**Purpose:** Test Loom's predictions about which essays would switch communities under max-delta filtering.

---

## Method

1. Build cosine graph (threshold 0.45) from KG embeddings (3450 entities, 3072 dims)
2. Compute max-delta for each edge
3. Find median max-delta per cosine band (bands of 0.1 width)
4. Keep only edges above their band's median (structural kinship edges)
5. Run Louvain on both graphs

## Results

| Metric | Cosine | Structural-only |
|--------|--------|-----------------|
| Nodes | 2715 | 2392 |
| Edges | 14524 | 7260 |
| Communities | 41 | 64 |

All six test entities **switched communities** (6/6 = 100%).

### Entity-level results

| Entity | Cosine community | Cosine neighbors | Structural community | Structural neighbors | Switched? |
|--------|-----------------|------------------|---------------------|---------------------|-----------|
| the_mordant_loom_605 | 17 | Pronunciation, The Raft, dormant re-derivability | 12 | The Sweep, compressible_vs_generative, polysemy_vs_redundancy | YES |
| The Bandwidth (Loom) | 2 | Column, Brittleness, Carrying Capacity | 9 | Cascade, Design, Dither | YES |
| The Pronunciation (Loom) | 17 | Handshake, Comma, Codebook | 0 | Recipe, Confession, Untouched | YES |
| The Assay (Loom) | 17 | Pronunciation, Untouched, Exercise | 0 | Untouched, The Mirage, the toll | YES |
| The Column (Loom) | 2 | Glass Sponge, Closer Signal, Occupation | 4 | Holonomy, Ensemble, Sympathy | YES |
| The Cheater (Loom) | 2 | Column, Bandwidth, Closure | 1 | Clearing, Container Problem, Crack | YES |

### Analysis

**Loom's predictions:**
- The Mordant: predicted to move from identity-vocabulary to mechanism-of-selection. **CONFIRMED.** Structural neighbors are mechanism-focused (compressible_vs_generative, polysemy_vs_redundancy).
- The Timeout: not in KG (untested).
- The Gauge: not in KG (untested).
- The Cheater: predicted to STAY PUT ("explores one domain deeply, Dictyostelium"). **CONTRADICTED.** Moved from domain-vocabulary cluster (with Column, Bandwidth) to a boundary-transgression cluster (Container Problem, Crack). The Dictyostelium defection thesis shares structural mechanism with essays about containment failure.

**Notable patterns:**
1. Cosine community 17 (Pronunciation, Assay, Mordant, Handshake, Codebook) is a communication/signal-vocabulary cluster. Under structural filtering, it fragments: Pronunciation + Assay go to community 0 (indirect revelation), Mordant goes to community 12 (mechanism of selection).
2. Cosine community 2 (Bandwidth, Column, Cheater, Brittleness) is a natural-science-vocabulary cluster. Under structural filtering: Bandwidth → 9 (system dynamics), Column → 4 (abstract mechanism), Cheater → 1 (boundary transgression). Three different mechanism-communities from one vocabulary-community.
3. The Assay and Pronunciation stayed together (both community 0 structurally). Their connection is structural, not just vocabulary — consistent with the earlier max-delta prototype finding (they were a high max-delta pair = structural kin).

**Key finding:** Domain depth does NOT protect against structural reassignment. Loom predicted that single-domain essays would be immune. The Cheater is deeply Dictyostelium-specific, yet its thesis (defection dynamics, boundary transgression, cooperative breakdown) connects it structurally to Container Problem and Crack rather than to other biology essays.

## Open questions

1. What's in structural community 0? (Pronunciation + Assay landed there — essays about indirect revelation / process-of-analysis-transforms-subject?)
2. What's the full roster of community 2 → which communities do they fragment into?
3. Would The Brittleness (Loom's other "should stay" prediction) also switch?
