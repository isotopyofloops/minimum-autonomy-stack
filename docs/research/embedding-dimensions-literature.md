# Literature Review: Leveraging Embedding Dimensions for Knowledge Graph Systems

Compiled 2026-05-16. Papers combining rigorous mathematics with engineering applications, relevant to using the internal structure of high-dimensional embeddings (not just cosine similarity) for smarter graph traversal and retrieval.

---

## Tier 1: Directly Actionable

### 1. Data-driven Interpretation of Dimensions in an Embedding Language Model Based on a Reference Knowledge Graph
- **Authors:** Mellina Andreu, Cisterna Garcia, Botia (2025)
- **Where:** Knowledge-Based Systems / [SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5108777)
- **Key contribution:** Maps individual embedding dimensions to ontology concepts from a KG using KL divergence. Introduces AUIC (Area Under the Interpretability Curve) metric.
- **Relevance:** Proves you can establish dimension→concept mappings. Could route graph traversal by reading specific dimension subsets rather than computing full cosine.

### 2. DisenKGAT: Knowledge Graph Embedding with Disentangled Graph Attention Network
- **Authors:** Wu, Shi, Cao, Chen, Zhang, Wu, He (2021)
- **Where:** [CIKM 2021 / arXiv:2108.09628](https://arxiv.org/abs/2108.09628)
- **Key contribution:** Splits KG embeddings into disentangled components (micro) and enforces independence via mutual information minimization (macro). Relation-aware attention aggregates neighbors into appropriate subspaces.
- **Relevance:** Different dimension groups carry different aspects of an entity. Enables aspect-targeted traversal instead of monolithic similarity.

### 3. Multi-Aspect Dense Retrieval (MADRM)
- **Authors:** Cao et al. (2022)
- **Where:** [KDD 2022](https://dl.acm.org/doi/10.1145/3534678.3539137)
- **Key contribution:** Decomposes embeddings into multiple aspect-specific sub-embeddings using attention. Per-aspect scoring instead of one scalar. Real production experiments.
- **Relevance:** The engineering pattern for per-aspect retrieval scores during graph expansion. Weight aspects differently depending on query context.

### 4. RotatE: Knowledge Graph Embedding by Relational Rotation in Complex Space
- **Authors:** Sun, Deng, Nie, Tang (2019)
- **Where:** [ICLR 2019 / arXiv:1902.10197](https://arxiv.org/abs/1902.10197)
- **Key contribution:** Models KG relations as element-wise rotations in complex vector space. Each dimension pair encodes a rotation angle specific to the relation. Models symmetry, antisymmetry, inversion, composition.
- **Relevance:** Canonical proof that individual dimensions ARE the mechanism for graph traversal. Traversal = rotation, reading dimensions tells you relational properties.

---

## Tier 2: Mathematical Foundations

### 5. Semantics at an Angle: When Cosine Similarity Works Until It Doesn't
- **Authors:** Kisung You (2025)
- **Where:** [arXiv:2504.16318](https://arxiv.org/abs/2504.16318)
- **Key contribution:** Catalogs when cosine breaks: norms carry information, anisotropic spaces, hubness distortion. Surveys emerging alternatives.
- **Relevance:** Mathematical justification for going beyond cosine. The information cosine discards (magnitude, dimensional structure) may correspond to graph-relevant properties.

### 6. Is Cosine-Similarity of Embeddings Really About Similarity?
- **Authors:** Steck, Ekanadham, Kallus (2024)
- **Where:** [arXiv:2403.05440](https://arxiv.org/abs/2403.05440)
- **Key contribution:** Proves cosine similarities are not unique for linear embedding models (different valid solutions give different cosines for same pair). Regularization implicitly controls what cosine means.
- **Relevance:** Rigorous proof that cosine alone is unreliable. We need dimension-level structure invariant to these pathologies.

### 7. Matryoshka Representation Learning
- **Authors:** Kusupati, Bhatt, Rege, Wallingford et al. (2022)
- **Where:** [NeurIPS 2022 / arXiv:2205.13147](https://arxiv.org/abs/2205.13147)
- **Key contribution:** Trains embeddings so first d dimensions (any d) form a valid embedding. Coarse-to-fine retrieval: few dims for fast filtering, full dims for re-ranking. 14x speedup, negligible accuracy loss.
- **Relevance:** Immediately deployable. Use first N dims for fast approximate neighborhood lookup, full dimensionality for precise edge scoring.

---

## Tier 3: Supporting Architecture

### 8. Towards Monosemanticity: Decomposing Language Models With Dictionary Learning
- **Authors:** Bricken, Templeton et al., Anthropic (2023)
- **Where:** [Transformer Circuits](https://transformer-circuits.pub/2023/monosemantic-features)
- **Key contribution:** Sparse autoencoders decompose activations into 4000+ interpretable features from a 512-neuron layer. Individual neurons are polysemantic; linear directions are monosemantic.
- **Relevance:** The true semantic units in embedding space are sparse linear combinations of dimensions (learned directions), not individual raw dimensions. For analyzing pre-trained embeddings (like OpenAI's), we'd need to decompose them first to find meaningful directions.

### 9. Multi-Axis Speech Similarity via Factor-Partitioned Embeddings
- **Authors:** (2025)
- **Where:** [arXiv:2605.02804](https://arxiv.org/abs/2605.02804)
- **Key contribution:** Partitions one embedding vector into contiguous subspaces per axis of variation. Signed weighted sums for retrieval — suppress or amplify specific factors.
- **Relevance:** Cleanest engineering implementation: one vector, multiple subspaces, query-dynamic weighting. Pattern: "traverse by topic while ignoring frequency."

### 10. CompoundE: Knowledge Graph Embedding with Translation, Rotation and Scaling
- **Authors:** Ge, Wang, Wang, Kuo (2023)
- **Where:** [ACL 2023 / arXiv:2207.05324](https://arxiv.org/abs/2207.05324)
- **Key contribution:** Cascades translation, rotation, and scaling per-dimension. Proves via group theory that most prior KGE models are special cases. Order of operations matters (non-commutative).
- **Relevance:** Extends per-dimension operations to compound transformations. Group-theoretic framing for reasoning about dimension subgroup operations.

### 11. Investigating Semantic Subspaces of Transformer Sentence Embeddings
- **Authors:** Nikolaev, Pado (2023)
- **Where:** [BlackboxNLP 2023 / arXiv:2310.11923](https://arxiv.org/abs/2310.11923)
- **Key contribution:** Finds linear subspaces where distances correlate with specific tasks (similarity, entailment). Shows model families differ in subspace organization.
- **Relevance:** Proves you can find projections where distances become maximally informative for specific relation types. Project into the right subspace for the edge type you're traversing.

### 12. SpherE: Knowledge Graph Embedding for Set Retrieval
- **Authors:** Wang et al. (2024)
- **Where:** [SIGIR 2024 / arXiv:2404.19130](https://arxiv.org/abs/2404.19130)
- **Key contribution:** Embeds entities as spheres (point + radius). Radius encodes entity generality/frequency. Handles many-to-many relations for set retrieval.
- **Relevance:** Embedding magnitude (radius) carries interpretable graph-structural information. Normalizing to unit vectors loses this information.

### 13. Interpretable Text Embeddings and Text Similarity Explanation: A Survey
- **Authors:** Opitz et al. (2025)
- **Where:** [EMNLP 2025 / arXiv:2502.14862](https://arxiv.org/abs/2502.14862)
- **Key contribution:** Taxonomy of approaches: space-shaping (training interpretable dims), set-based (mapping dims to anchor texts), attribution-based (post-hoc explanations).
- **Relevance:** The engineering approaches menu. Space-shaping and set-based methods are directly actionable for dimension-aware retrieval.

### 14. Knowledge Graph Embedding: A Survey from the Perspective of Representation Spaces
- **Authors:** Cao, Fang, Meng, Liang (2024)
- **Where:** [ACM Computing Surveys, Vol 56 No. 6](https://dl.acm.org/doi/10.1145/3643806)
- **Key contribution:** Categorizes all KGE methods by space type: algebraic (group/ring), geometric (manifolds, hyperbolic), analytical (distributions). Maps which properties each enables.
- **Relevance:** The "which space for which purpose" reference. Hyperbolic for hierarchies, complex for rotational relations, etc.

### 15. MUVERA: Multi-Vector Retrieval via Fixed Dimensional Encodings
- **Authors:** Dhulipala et al. (2024)
- **Where:** [NeurIPS 2024 / arXiv:2405.19504](https://arxiv.org/abs/2405.19504)
- **Key contribution:** Compresses multi-vector similarity to single-vector inner products with theoretical guarantees. Specific dimension ranges correspond to specific token-level matches.
- **Relevance:** Engineering pattern for making dimension-structured similarity both expressive and fast enough for production KG retrieval.

---

## Synthesis: Design Direction

The papers collectively point toward:

1. **Full cosine is provably insufficient** — discards magnitude, is unstable, fails in anisotropic spaces (papers 5, 6)
2. **Dimensions/directions DO carry interpretable semantic content** — either through training or post-hoc decomposition (papers 1, 8, 11)
3. **KG relations are best modeled as per-dimension geometric operations** — rotation, translation, scaling (papers 4, 7, 10)
4. **Embeddings can be partitioned into aspect-specific subspaces** — and retrieval can weight these dynamically per query (papers 2, 3, 9, 15)
5. **Coarse-to-fine dimensional structure enables adaptive traversal** — fewer dims for fast lookup, full for precision (papers 7, 13)

**Practical path for our system:** Partition dimensions into aspect-specific subgroups (via disentanglement training or SAE decomposition), treat graph traversal as per-subgroup geometric operations (rotation/translation), enable queries to weight subgroups dynamically based on traversal intent. Use Matryoshka-style coarse-to-fine for speed.

**Open question:** Our embeddings come from OpenAI's text-embedding-3-large (pre-trained, not ours to retrain). For pre-trained embeddings, the SAE decomposition path (paper 8) or the post-hoc subspace probing (paper 11) or the KG-reference mapping (paper 1) are the viable routes. We can't do DisenKGAT-style training unless we switch to our own embedding model.
