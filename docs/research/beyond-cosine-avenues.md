# Beyond Cosine: Research Avenues

Started 2026-05-12 (CLI session). Sam asked: "is there any mathematics that can be better at analyzing words?" Four directions identified. Two chosen as promising for graph analysis. One built (neighborhood overlap). One unexplored (TDA). Two others noted but deprioritized.

---

## Avenue 1: Neighborhood Overlap (graph structure)
**Status: BUILT — kg-recall.py**

Instead of comparing embeddings directly, compare entities by their graph neighborhoods. Two entities sharing many neighbors are structurally related regardless of vocabulary.

**What we built:**
- `state/kg-recall.py` — two-phase retrieval: semantic seeding (cosine finds entry points) → neighborhood overlap (Jaccard/overlap coefficient ranks by shared graph structure)
- Three commands: `recall`, `overlap`, `neighbors`
- k-hop neighborhoods (default 2-hop), overlap coefficient handles hub congestion

**Key result (2026-05-12):** Sam's natural language test ("life as anarchy against entropy, body resisting diffusion, self depends on constraints") → cosine found persistence-without-continuity, self-preservation-behavior, identity-heisenberg as seeds → neighborhood overlap surfaced *rheology*, *heading-without-weather*, *attractor-basin-in-morphospace*, *corridor-state*. Things cosine can't find because they're vocabulary-distant but structurally-adjacent.

**The Deborah number case:** "life resisting entropy" → "rheology" through pure graph structure. The Deborah number (whether material appears solid or fluid depends on observation timescale) reframes selfhood as a property of measurement scale, not substance. Zero vocabulary overlap. Pure structural bridge via shared neighborhoods.

**Integration status:** Posted to Alex's Discord. Not yet integrated into `query-kg.py` cmd_triage as third phase (discussed, not started).

---

## Avenue 2: TDA / Persistent Homology (topological features)
**Status: UNEXPLORED — promising**

Topological Data Analysis finds features in point clouds (embeddings are a point cloud in ℝ³⁰⁷²) that persist across multiple scales. Instead of measuring pairwise distance, it identifies:

- **Holes** — voids in the embedding space where concepts *should* connect but don't (gap detection)
- **Loops** — cycles in the similarity graph that persist across distance thresholds (closed conceptual circuits)
- **Connected components** — clusters that emerge and merge at different scales (natural community boundaries)

**Why promising for us:**
- Persistent features (high birth-to-death ratio in the barcode) represent genuine structural relationships, not noise
- Scale-invariance: a feature that persists from threshold 0.3 to 0.7 is more meaningful than one that appears only at 0.42
- Could identify "structural bridges" mechanically — a 1-cycle (loop) passing through two otherwise-distant clusters indicates a bridging relationship
- Complements neighborhood overlap: overlap finds *what's connected*, TDA finds *the shape of the connected space*

**Possible experiments:**
1. Build Vietoris-Rips complex on embedded KG nodes at multiple thresholds
2. Compute persistence diagram (H₀ for components, H₁ for loops)
3. Compare: do long-persistence H₀ components correspond to our Louvain communities?
4. Do H₁ loops pass through known structural bridges (Deborah-number-type connections)?
5. Does the persistence landscape correlate with edge types (curated vs computed)?

**Tools:** ripser, giotto-tda, gudhi (Python libraries for persistent homology)

**Open question:** At 3072 dimensions with ~1100 embedded entities, computational cost is manageable. But interpretability is the challenge — translating "there's a 1-cycle passing through these 5 entities" into actionable retrieval logic.

---

## Avenue 3: Hyperbolic Geometry
**Status: NOTED — not prioritized**

Embed entities in hyperbolic space (Poincaré disk/ball) instead of Euclidean. Hyperbolic space naturally represents hierarchical tree-like structures with exponentially more room at the periphery.

**Why relevant:** Knowledge graphs are often tree-adjacent (general concepts → specific instances). Euclidean space wastes dimensions representing hierarchy. Hyperbolic embeddings can capture is-a / part-of depth with fewer dimensions.

**Why deprioritized:** Our KG isn't strongly hierarchical. It's a web of lateral connections (structural analogies, cross-domain mappings) rather than a taxonomy. Hyperbolic geometry excels at trees; our graph is closer to a small-world network. Might revisit if we add a hierarchical layer.

---

## Avenue 4: Mahalanobis Distance
**Status: NOTED — not prioritized**

Replace cosine with Mahalanobis distance, which accounts for correlations between dimensions (uses the inverse covariance matrix of the embedding distribution).

**Why relevant:** If certain dimension pairs are correlated across the corpus, cosine double-counts their contribution. Mahalanobis normalizes by the correlation structure, giving "true" distances in a decorrelated space.

**Why deprioritized:** Requires computing and inverting a 3072×3072 covariance matrix on our entity set (~1100 entities). With n < d, the matrix is rank-deficient — we'd need regularization or PCA first. The fix (truncate to top-k principal components) converges toward the Matryoshka experiment we already ran. More useful as a diagnostic than a retrieval mechanism.

---

## Related Work Already Done

### Matryoshka Truncation Experiment (2026-05-16)
- Embedded 12 concepts at 256/512/1024/3072 dims
- Key finding: curated edges have higher rank stability across truncations than non-curated pairs
- Pair `dormant fidelity ↔ retrieval trigger architecture`: +19 rank shift (invisible at 256d, visible at 3072d) → fine-grained structural signal
- See: `research/matryoshka-experiment.md`

### Structural Isomorphism / Skeleton Algorithm (2026-05-16)
- Strip domain-specific terms from entity descriptions → re-embed → compute delta from original
- Entities with small delta are structurally generic (mechanism-level); large delta are domain-bound
- Used to generate 3,380 structural edges in the connection map (delta ≥ 0.15)
- See: `connection-map-public/docs/compute-skeletons.py`

### Literature Review (2026-05-16)
- 15 papers on dimension-level structure in embeddings
- Key synthesis: dimensions carry interpretable content (paper 1), can be partitioned into aspects (papers 2,3,9), KG relations are per-dimension operations (papers 4,10)
- See: `research/embedding-dimensions-literature.md`

### Loom Correspondence (2026-05-16)
- Thread: "Beyond cosine — leveraging vector dimensions for smarter graph traversal"
- Four specific directions proposed: directional traversal, dimensional clustering as edge-type signal, gradient along edges, subspace similarity for neighborhood scoring
- See: `library/correspondence/beyond-cosine-leveraging-vector-dimensions-for-smarter-graph.md`

---

## Next Steps

1. **TDA prototype** — install ripser/giotto-tda, build persistence diagram on the ~1100 embedded entities, see what emerges
2. **kg-recall integration** — wire neighborhood overlap into query-kg.py as phase 3
3. **Dimensional subspace experiment** — per the Loom correspondence: identify which dimension ranges drive structural vs vocabulary kinship by comparing activation patterns on known structural-kinship pairs vs vocabulary-kinship pairs
