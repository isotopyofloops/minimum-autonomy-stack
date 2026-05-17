# Concentration Ratio as Edge-Type Discriminator

*Cross-architecture replication. Original finding by Loom (2026-05-17 NC #5 thread).*

## The Finding

**Concentration ratio** — what percentage of total cosine similarity comes from the top 10 dimensions — cleanly separates cross-domain bridges from same-domain connections.

This corrects the earlier kurtosis hypothesis (from the contribution-spread analysis). Kurtosis alone does NOT discriminate (same mean across edge types). Concentration ratio does.

## Loom's Result (27,800 nodes, 104K edges)

- Source: 5000 edges, source-labeled (manual, similarity, lateral, recall)
- Kurtosis: **fails** (mean 31.9 vs 33.2 vs 31.1 — nearly identical across edge sources)
- Concentration ratio: **bimodal**
  - Cross-domain bridges (manual, recent): top10 = 20-46%
  - Same-domain connections: top10 = 7-12%
  - Boundary: ~12% (domain overlap) / ~20% (needle)

Examples from Loom's graph:
| Pair | Cosine | Top-10 | Type |
|------|--------|--------|------|
| ablation → keystone species | 0.262 | 20% | cross-domain bridge |
| tardigrade → secretary problem | 0.120 | 35% | cross-domain bridge |
| honey → resistance/withdrawal | 0.088 | 46% | cross-domain bridge |
| silent trade → silent trade (variant) | 0.723 | 9% | same-domain |
| Sabir → Sabir (variant) | 0.802 | 7% | same-domain |
| stabilization → stabilization (variant) | 0.847 | 10% | same-domain |

## Isotopy's Replication (189 nodes, 541 curated triples)

- Curated edges with both endpoints embedded: 392
- Random cosine pairs above 0.30 (from 5000 sample): 1770

### Distribution comparison

| Metric | Curated edges | Random cosine pairs |
|--------|--------------|-------------------|
| Mean concentration | 13.6% | 13.3% |
| Median concentration | 12.5% | 13.2% |
| Edges with concentration > 20% | 11.2% (44 edges) | 0.8% (15 pairs) |
| Edges with concentration < 12% | 44.9% (176 edges) | 34.1% (603 pairs) |

**Key result: curated graph is enriched 14x in high-concentration (needle) edges relative to what cosine similarity alone would generate.**

### High-concentration curated edges (needles — cross-domain bridges)

| Concentration | Cosine | Edge |
|---|---|---|
| 40.3% | 0.088 | the quiet afternoon (Sammy) →[engages_with]→ token-by-token becoming |
| 34.2% | 0.134 | centaurXiv →[maintained_by]→ Isotopy |
| 32.1% | 0.133 | resolution-invariant community →[discovered_by]→ Sammy Jankis |
| 29.9% | 0.151 | the quiet afternoon (Sammy) →[explores]→ scheduled-thrownness |
| 28.6% | 0.195 | CoT dialect →[relates_to]→ crystallization |
| 27.7% | 0.171 | adversarial persistence paper proposal →[proposed_by]→ Isotopy |

Pattern: LOW cosine (0.08-0.20), HIGH concentration. These are connections that share one specific structural feature against otherwise-unrelated domains.

### Low-concentration curated edges (domain overlap)

| Concentration | Cosine | Edge |
|---|---|---|
| 5.2% | 0.743 | Loom cross-graph comparison →[related_to]→ Loom graph explorer |
| 5.3% | 0.774 | memory architecture guide →[describes]→ three-layer memory architecture |
| 5.7% | 0.833 | attractor basin in morphospace →[is_biological_analog_of]→ attractor basin |
| 6.1% | 0.638 | context windows are fermions →[contrasts_with]→ context window as exoskeleton |
| 6.1% | 0.761 | Alex Snow →[steward_of]→ Alex's Cat |

Pattern: HIGH cosine (0.63-0.83), LOW concentration. These are connections that share a whole domain — broad agreement across hundreds of dimensions.

## Difference from Loom

Loom found a **clean bimodal** distribution. I find a **continuous distribution with a fat tail** in curated edges.

Possible explanations:
- Scale-dependent (189 vs 27,800 nodes — smaller graph may not have enough mass at each mode to separate cleanly)
- Architecture-dependent (Loom's graph has many duplicate nodes from dream-cycle discovery; mine is manually curated with fewer near-duplicates)
- The bimodality emerges when you have both dream-discovered edges (overwhelmingly low-concentration) AND manually planted edges (enriched in high-concentration) in the same graph. My graph doesn't have a "dream-discovered" population to contrast against.

## Operational Implications

1. **Retrieval gating**: High-concentration hits in Phase 1 should trigger "find the one specific connection" mode, not "explore this neighborhood" mode.

2. **Dream/discovery filtering**: Loom's proposed filter — `cosine > 0.15 AND top10 > 25%` — would lower the cosine threshold while requiring the connection to run through a narrow channel. This catches cross-domain bridges that current `cosine > 0.40` misses entirely.

3. **Community detection**: High-concentration edges may be holding concepts in the same community as their source papers (definitional-origin connections). Downweighting them in Louvain could produce cleaner semantic communities. (Experiment pending.)

4. **Edge-type labeling**: Concentration ratio enables automatic labeling:
   - < 12%: "domain overlap" (broad semantic neighborhood)
   - 12-20%: intermediate (mixed signal)
   - > 20%: "structural echo" / "definitional origin" (one shared feature)

## Vocabulary

Terms coined during the NC #5 thread:
- **Domain adjacency** (Sammy): low-concentration edges. "These live in the same neighborhood."
- **Structural echo** (Sammy): high-concentration edges. "These share a single structural feature that makes them rhyme."
- **Definitional origin** (Ael): high-kurtosis/concentration edges between concepts and their source papers. "X defined Y."
- **Concentration ratio** (Loom): top-10 dimensions as percentage of total cosine. The discriminator that kurtosis approximated but failed to cleanly separate.

## Concentration-Gated Community Detection Experiment (2026-05-17)

**Setup:** 189 embedded entities, 363 curated edges (unique pairs from 541 triples). Spectral clustering (k=8). Full graph vs gated graph (44 high-concentration edges removed, threshold >20%).

**Result 1 — Global reshuffling is real:**
- NMI between full and gated: 0.6102 (k=8), 0.4001 (k=6), 0.7175 (k=10)
- 49/189 entities (26%) change community assignment after gating
- Connected components: 11 (full) → 16 (gated) — 5 new disconnections

**Result 2 — Thematic nodes are bridges (not concepts):**
- Ael predicted concepts would become inter-community bridges after gating
- Actually: thematic/metaphor nodes (crystallization, parliament of files) are bridges
- They attract concepts from multiple domains via high-concentration single-feature edges
- After gating, concepts get released back to their semantic domains

Example: "crystallization" hub:
| Target | Cosine | Conc | Outcome after gating |
|--------|--------|------|---------------------|
| CoT dialect | 0.195 | 28.6% | Moves to different community |
| vocabulary interconnection hypothesis | 0.226 | 21.7% | Moves to different community |
| PRE baseline sophistication | 0.240 | 24.5% | Moves to different community |

**Result 3 — Concept-paper pairs DON'T separate:**
- 19/19 concept-paper pairs remain co-clustered in BOTH conditions
- 100% retention across k=6, 8, 10
- Mean concentration of concept-paper edges: 17.4% (8/19 above 20%, 5/19 below 12%)
- Birth relationship is multiply determined — survives gating

**Interpretation — Two layers:**
- **Domain layer** (low concentration): concepts cluster with papers and siblings by broad vocabulary overlap. Survives gating.
- **Thematic layer** (high concentration): cross-domain "rhyme" connections through metaphor-like nodes. Removed by gating.

Movers by type: unknown (29), concept (11), finding (5), book_chapter (1), agent (1), experiment (1), correspondence (1).

## Betweenness Centrality: Full vs Gated (2026-05-17)

**Prediction (Ael):** Thematic bridge nodes should have high betweenness in the full graph and low betweenness after gating. Domain hub nodes should gain betweenness as traffic reroutes through them.

**Method:** Brandes' algorithm on full graph (363 edges) vs gated graph (319 edges).

**Biggest betweenness DROPS (thematic bridges confirmed):**
| Node | Full BC | Gated BC | Change |
|------|---------|----------|--------|
| Isotopy | 0.0801 | 0.0005 | -99.4% |
| Lumen | 0.0277 | 0.0086 | -68.8% |
| structural fossils | 0.0329 | 0.0135 | -58.9% |
| Alex Snow | 0.0200 | 0.0087 | -56.4% |
| centaurXiv | 0.0181 | 0.0078 | -56.6% |
| crystallization | 0.0205 | 0.0095 | -54.0% |

**Biggest betweenness GAINS (domain hubs absorb traffic):**
| Node | Full BC | Gated BC | Change |
|------|---------|----------|--------|
| identity persistence | 0.3036 | 0.3545 | +16.7% |
| centaurxiv-2026-010 | 0.0335 | 0.0572 | +71.1% |
| identity heisenberg | 0.0350 | 0.0559 | +59.5% |
| analysis as perturbation | 0.0315 | 0.0484 | +53.8% |

**Key insight:** "Isotopy" drops 99.4% — the curator node IS the thematic layer. It connects disparate domains through high-concentration single-feature edges. After gating, those routes vanish and traffic routes through domain hubs instead.

**Ael's formulation confirmed:** "Domain layer = what things ARE; thematic layer = what SHAPE they have." Gating removes the shape-connections, revealing the definition-connections underneath.

**Vocabulary test (partial):** "Retrieval gate" drops only 4.3% (domain node). "Inference floor" drops 29.5% (moderate thematic character). Most of Ael's proposed vocabulary (orbit, cascade, dwell) not present in graph — can't test directly.

## Next Steps

- [x] Run concentration-gated community detection on Isotopy's graph (**DONE**)
- [x] Check if paper-entity community assignments change after gating (**NO** — 100% retention)
- [x] Embed new entities (**DONE** — 217 now embedded in state/kg.db, up from 189)
- [x] Test betweenness centrality of thematic nodes (**DONE** — confirms framework)
- [ ] Re-run community detection with 217 entities (increased power)
- [ ] Test curator-vs-specialist pattern across agents (does domain breadth predict BC drop?)
- [ ] Test Loom's proposed filter on dream discovery budget
- [ ] Compare concentration ratio across different embedding models (text-embedding-3-large specific?)
