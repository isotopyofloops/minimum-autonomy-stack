# Matryoshka Truncation Experiment — Results
*Generated 2026-05-16. Model: text-embedding-3-large. Nodes: 12 concepts from graph-edges.html.*

---

## Setup

Embed 12 KG concept nodes at 4 dimensionalities (256, 512, 1024, 3072) using
OpenAI's text-embedding-3-large with native dimension truncation. Compare pairwise
cosine similarities to find where coarse and fine structure diverge.

**Hypothesis:** Pairs that agree across all dimensionalities share broad vocabulary
features (coarse structure). Pairs whose similarity changes significantly with more
dimensions rely on fine-grained structural signal that only emerges in the higher dims.

---

## All 66 Pairwise Similarities (sorted by 3072-dim score)

| Pair | 256d | 512d | 1024d | 3072d | Δ(3072-256) | Curated | Rank shift |
|------|------|------|-------|-------|-------------|---------|------------|
| basin key ↔ antigenic sin in basin keys | 0.502 | 0.540 | 0.527 | 0.505 | +0.003 | ✓ | 0 |
| dormant fidelity ↔ fidelity signature | 0.468 | 0.461 | 0.469 | 0.443 | -0.025 | ✓ | 0 |
| negative decision loss ↔ instrument compaction los | 0.454 | 0.468 | 0.442 | 0.399 | -0.055 | ✓ | 0 |
| dormant fidelity ↔ negative decision loss | 0.415 | 0.431 | 0.427 | 0.397 | -0.017 |  | +2 |
| negative decision loss ↔ curated silence | 0.428 | 0.405 | 0.401 | 0.386 | -0.042 |  | -1 |
| fidelity signature ↔ operational fidelity defense | 0.419 | 0.432 | 0.404 | 0.385 | -0.034 |  | -1 |
| dormant fidelity ↔ retrieval trigger architecture | 0.326 | 0.339 | 0.365 | 0.367 | +0.042 | ✓ | +19 |
| hollowing of terms ↔ genre-ification | 0.366 | 0.395 | 0.389 | 0.367 | +0.001 | ✓ | +3 |
| dormant fidelity ↔ wake problem | 0.361 | 0.361 | 0.366 | 0.342 | -0.019 | ✓ | +3 |
| dormant fidelity ↔ operational fidelity defense | 0.345 | 0.344 | 0.347 | 0.339 | -0.006 | ✓ | +8 |
| wake problem ↔ retrieval trigger architecture | 0.288 | 0.365 | 0.369 | 0.332 | +0.044 |  | +24 |
| dormant fidelity ↔ curated silence | 0.333 | 0.350 | 0.360 | 0.329 | -0.005 |  | +9 |
| instrument compaction losses ↔ curated silence | 0.385 | 0.375 | 0.375 | 0.325 | -0.059 |  | -4 |
| hollowing of terms ↔ curated silence | 0.243 | 0.315 | 0.307 | 0.316 | +0.074 |  | +35 |
| dormant fidelity ↔ hollowing of terms | 0.353 | 0.376 | 0.352 | 0.315 | -0.038 |  | -1 |
| wake problem ↔ operational fidelity defense | 0.342 | 0.362 | 0.351 | 0.314 | -0.028 |  | +4 |
| genre-ification ↔ instrument compaction losses | 0.348 | 0.358 | 0.327 | 0.311 | -0.036 | ✓ | -1 |
| antigenic sin in basin keys ↔ genre-ification | 0.355 | 0.295 | 0.330 | 0.307 | -0.048 |  | -5 |
| wake problem ↔ instrument compaction losses | 0.378 | 0.368 | 0.337 | 0.297 | -0.081 |  | -9 |
| antigenic sin in basin keys ↔ operational fidelity | 0.333 | 0.365 | 0.314 | 0.294 | -0.038 |  | +2 |
| basin key ↔ genre-ification | 0.301 | 0.305 | 0.325 | 0.292 | -0.009 |  | +11 |
| basin key ↔ retrieval trigger architecture | 0.385 | 0.373 | 0.340 | 0.291 | -0.095 |  | -14 |
| fidelity signature ↔ curated silence | 0.294 | 0.304 | 0.333 | 0.290 | -0.004 |  | +10 |
| antigenic sin in basin keys ↔ negative decision lo | 0.343 | 0.341 | 0.345 | 0.284 | -0.059 |  | -5 |
| dormant fidelity ↔ instrument compaction losses | 0.290 | 0.331 | 0.300 | 0.280 | -0.009 |  | +9 |
| genre-ification ↔ operational fidelity defense | 0.250 | 0.325 | 0.289 | 0.274 | +0.023 |  | +21 |
| hollowing of terms ↔ instrument compaction losses | 0.326 | 0.337 | 0.299 | 0.273 | -0.053 |  | -2 |
| basin key ↔ instrument compaction losses | 0.351 | 0.296 | 0.299 | 0.264 | -0.087 |  | -13 |
| fidelity signature ↔ genre-ification | 0.307 | 0.323 | 0.301 | 0.264 | -0.044 |  | +2 |
| fidelity signature ↔ wake problem | 0.234 | 0.258 | 0.272 | 0.261 | +0.027 |  | +20 |
| antigenic sin in basin keys ↔ instrument compactio | 0.330 | 0.276 | 0.290 | 0.261 | -0.069 |  | -8 |
| genre-ification ↔ curated silence | 0.254 | 0.327 | 0.283 | 0.259 | +0.005 |  | +14 |
| curated silence ↔ operational fidelity defense | 0.286 | 0.286 | 0.290 | 0.259 | -0.027 |  | +3 |
| fidelity signature ↔ retrieval trigger architectur | 0.281 | 0.286 | 0.289 | 0.258 | -0.023 |  | +5 |
| fidelity signature ↔ instrument compaction losses | 0.348 | 0.314 | 0.277 | 0.258 | -0.089 |  | -18 |
| instrument compaction losses ↔ operational fidelit | 0.317 | 0.307 | 0.304 | 0.258 | -0.059 |  | -8 |
| antigenic sin in basin keys ↔ retrieval trigger ar | 0.257 | 0.285 | 0.286 | 0.255 | -0.002 |  | +7 |
| instrument compaction losses ↔ retrieval trigger a | 0.328 | 0.286 | 0.297 | 0.254 | -0.074 |  | -14 |
| basin key ↔ operational fidelity defense | 0.311 | 0.339 | 0.289 | 0.254 | -0.057 |  | -10 |
| antigenic sin in basin keys ↔ fidelity signature | 0.263 | 0.274 | 0.263 | 0.246 | -0.017 |  | +3 |
| antigenic sin in basin keys ↔ dormant fidelity | 0.204 | 0.263 | 0.267 | 0.245 | +0.041 |  | +16 |
| basin key ↔ negative decision loss | 0.310 | 0.286 | 0.268 | 0.242 | -0.067 |  | -12 |
| retrieval trigger architecture ↔ operational fidel | 0.277 | 0.333 | 0.307 | 0.240 | -0.037 |  | -3 |
| antigenic sin in basin keys ↔ wake problem | 0.246 | 0.263 | 0.252 | 0.240 | -0.005 |  | +4 |
| antigenic sin in basin keys ↔ curated silence | 0.272 | 0.257 | 0.259 | 0.239 | -0.033 |  | -3 |
| curated silence ↔ retrieval trigger architecture | 0.395 | 0.297 | 0.277 | 0.236 | -0.158 |  | -39 |
| negative decision loss ↔ operational fidelity defe | 0.274 | 0.300 | 0.270 | 0.229 | -0.045 |  | -6 |
| wake problem ↔ negative decision loss | 0.283 | 0.260 | 0.255 | 0.228 | -0.055 |  | -10 |
| basin key ↔ wake problem | 0.285 | 0.288 | 0.255 | 0.228 | -0.057 |  | -12 |
| genre-ification ↔ retrieval trigger architecture | 0.319 | 0.274 | 0.261 | 0.226 | -0.093 |  | -23 |
| antigenic sin in basin keys ↔ hollowing of terms | 0.167 | 0.206 | 0.227 | 0.219 | +0.052 |  | +10 |
| negative decision loss ↔ hollowing of terms | 0.218 | 0.267 | 0.238 | 0.218 | +0.000 |  | +3 |
| hollowing of terms ↔ operational fidelity defense | 0.226 | 0.212 | 0.215 | 0.209 | -0.017 | ✓ | -2 |
| fidelity signature ↔ negative decision loss | 0.226 | 0.235 | 0.249 | 0.209 | -0.016 |  | -2 |
| negative decision loss ↔ retrieval trigger archite | 0.255 | 0.233 | 0.229 | 0.209 | -0.046 |  | -10 |
| fidelity signature ↔ hollowing of terms | 0.223 | 0.234 | 0.240 | 0.199 | -0.024 |  | -3 |
| negative decision loss ↔ genre-ification | 0.219 | 0.249 | 0.213 | 0.192 | -0.027 |  | -3 |
| wake problem ↔ genre-ification | 0.189 | 0.218 | 0.219 | 0.192 | +0.003 |  | +1 |
| wake problem ↔ curated silence | 0.208 | 0.182 | 0.206 | 0.187 | -0.022 |  | -3 |
| basin key ↔ curated silence | 0.185 | 0.199 | 0.193 | 0.185 | +0.001 |  | 0 |
| basin key ↔ hollowing of terms | 0.163 | 0.175 | 0.203 | 0.182 | +0.019 |  | +1 |
| wake problem ↔ hollowing of terms | 0.193 | 0.217 | 0.188 | 0.180 | -0.013 |  | -4 |
| basin key ↔ fidelity signature | 0.150 | 0.138 | 0.169 | 0.165 | +0.015 |  | 0 |
| basin key ↔ dormant fidelity | 0.105 | 0.141 | 0.172 | 0.161 | +0.056 |  | +2 |
| dormant fidelity ↔ genre-ification | 0.106 | 0.171 | 0.154 | 0.157 | +0.052 |  | 0 |
| hollowing of terms ↔ retrieval trigger architectur | 0.146 | 0.109 | 0.143 | 0.144 | -0.003 |  | -2 |

---

## Biggest Rank Shifts (256d ranking vs 3072d ranking)

These pairs change position most between coarse (256d) and fine (3072d) rankings.
Positive = ranked higher at 256d (lost relative rank with more dims).
Negative = ranked lower at 256d (gained relative rank with more dims — fine structure helps).

| Pair | 256d | 3072d | Rank shift | Curated |
|------|------|-------|------------|---------|
| curated silence ↔ retrieval trigger architecture | 0.395 | 0.236 | -39 |  |
| hollowing of terms ↔ curated silence | 0.243 | 0.316 | +35 |  |
| wake problem ↔ retrieval trigger architecture | 0.288 | 0.332 | +24 |  |
| genre-ification ↔ retrieval trigger architecture | 0.319 | 0.226 | -23 |  |
| genre-ification ↔ operational fidelity defense | 0.250 | 0.274 | +21 |  |
| fidelity signature ↔ wake problem | 0.234 | 0.261 | +20 |  |
| dormant fidelity ↔ retrieval trigger architecture | 0.326 | 0.367 | +19 | ✓ |
| fidelity signature ↔ instrument compaction losses | 0.348 | 0.258 | -18 |  |
| antigenic sin in basin keys ↔ dormant fidelity | 0.204 | 0.245 | +16 |  |
| basin key ↔ retrieval trigger architecture | 0.385 | 0.291 | -14 |  |
| genre-ification ↔ curated silence | 0.254 | 0.259 | +14 |  |
| instrument compaction losses ↔ retrieval trigger a | 0.328 | 0.254 | -14 |  |
| basin key ↔ instrument compaction losses | 0.351 | 0.264 | -13 |  |
| basin key ↔ wake problem | 0.285 | 0.228 | -12 |  |
| basin key ↔ negative decision loss | 0.310 | 0.242 | -12 |  |

---

## Curated Edges: How Do They Behave Across Dimensions?

| Pair | 256d | 512d | 1024d | 3072d | Δ(3072-256) | Pattern |
|------|------|------|-------|-------|-------------|---------|
| basin key ↔ antigenic sin in basin keys | 0.502 | 0.540 | 0.527 | 0.505 | +0.003 | stable |
| dormant fidelity ↔ fidelity signature | 0.468 | 0.461 | 0.469 | 0.443 | -0.025 | FADES with dims |
| negative decision loss ↔ instrument compaction los | 0.454 | 0.468 | 0.442 | 0.399 | -0.055 | FADES with dims |
| dormant fidelity ↔ retrieval trigger architecture | 0.326 | 0.339 | 0.365 | 0.367 | +0.042 | EMERGES with dims |
| hollowing of terms ↔ genre-ification | 0.366 | 0.395 | 0.389 | 0.367 | +0.001 | stable |
| dormant fidelity ↔ wake problem | 0.361 | 0.361 | 0.366 | 0.342 | -0.019 | stable |
| dormant fidelity ↔ operational fidelity defense | 0.345 | 0.344 | 0.347 | 0.339 | -0.006 | stable |
| genre-ification ↔ instrument compaction losses | 0.348 | 0.358 | 0.327 | 0.311 | -0.036 | FADES with dims |
| hollowing of terms ↔ operational fidelity defense | 0.226 | 0.212 | 0.215 | 0.209 | -0.017 | stable |

---

## Interpretation Notes

**Stable pairs** (small Δ): The relationship is captured in the coarse structure.
These are vocabulary-level connections — the first 256 dims already see them.

**Emerging pairs** (positive Δ, similarity grows with dims): Fine-grained dimensions
add signal. These may be structural connections that require nuanced encoding.

**Fading pairs** (negative Δ, similarity drops with dims): The coarse structure
over-estimates their connection. More dimensions = more evidence they're different.
These are potential false positives that coarse retrieval would surface incorrectly.

**Curated edges that fade**: Structural relationships the embedding can never capture,
regardless of dimensionality. These are the relationships that REQUIRE graph topology.

---

## Raw Data (JSON)

```json
[
  {
    "pair": "basin key \u2194 antigenic sin in basin keys",
    "curated": true,
    "sims": {
      "256": 0.5024,
      "512": 0.54,
      "1024": 0.5275,
      "3072": 0.505
    },
    "delta": 0.0025,
    "rank_shift": 0
  },
  {
    "pair": "dormant fidelity \u2194 fidelity signature",
    "curated": true,
    "sims": {
      "256": 0.468,
      "512": 0.4609,
      "1024": 0.4694,
      "3072": 0.4432
    },
    "delta": -0.0247,
    "rank_shift": 0
  },
  {
    "pair": "negative decision loss \u2194 instrument compaction losses",
    "curated": true,
    "sims": {
      "256": 0.454,
      "512": 0.4679,
      "1024": 0.4423,
      "3072": 0.3993
    },
    "delta": -0.0546,
    "rank_shift": 0
  },
  {
    "pair": "dormant fidelity \u2194 negative decision loss",
    "curated": false,
    "sims": {
      "256": 0.4145,
      "512": 0.4306,
      "1024": 0.4271,
      "3072": 0.3975
    },
    "delta": -0.0171,
    "rank_shift": 2
  },
  {
    "pair": "negative decision loss \u2194 curated silence",
    "curated": false,
    "sims": {
      "256": 0.4283,
      "512": 0.4051,
      "1024": 0.4009,
      "3072": 0.3858
    },
    "delta": -0.0425,
    "rank_shift": -1
  },
  {
    "pair": "fidelity signature \u2194 operational fidelity defense",
    "curated": false,
    "sims": {
      "256": 0.4191,
      "512": 0.4317,
      "1024": 0.4041,
      "3072": 0.3847
    },
    "delta": -0.0344,
    "rank_shift": -1
  },
  {
    "pair": "dormant fidelity \u2194 retrieval trigger architecture",
    "curated": true,
    "sims": {
      "256": 0.3256,
      "512": 0.339,
      "1024": 0.3646,
      "3072": 0.3673
    },
    "delta": 0.0417,
    "rank_shift": 19
  },
  {
    "pair": "hollowing of terms \u2194 genre-ification",
    "curated": true,
    "sims": {
      "256": 0.3659,
      "512": 0.3952,
      "1024": 0.3893,
      "3072": 0.3665
    },
    "delta": 0.0007,
    "rank_shift": 3
  },
  {
    "pair": "dormant fidelity \u2194 wake problem",
    "curated": true,
    "sims": {
      "256": 0.3607,
      "512": 0.3612,
      "1024": 0.3659,
      "3072": 0.3418
    },
    "delta": -0.0188,
    "rank_shift": 3
  },
  {
    "pair": "dormant fidelity \u2194 operational fidelity defense",
    "curated": true,
    "sims": {
      "256": 0.3451,
      "512": 0.3443,
      "1024": 0.3465,
      "3072": 0.339
    },
    "delta": -0.0061,
    "rank_shift": 8
  },
  {
    "pair": "wake problem \u2194 retrieval trigger architecture",
    "curated": false,
    "sims": {
      "256": 0.2879,
      "512": 0.3649,
      "1024": 0.3694,
      "3072": 0.3319
    },
    "delta": 0.044,
    "rank_shift": 24
  },
  {
    "pair": "dormant fidelity \u2194 curated silence",
    "curated": false,
    "sims": {
      "256": 0.3334,
      "512": 0.3503,
      "1024": 0.36,
      "3072": 0.3289
    },
    "delta": -0.0045,
    "rank_shift": 9
  },
  {
    "pair": "instrument compaction losses \u2194 curated silence",
    "curated": false,
    "sims": {
      "256": 0.3849,
      "512": 0.3746,
      "1024": 0.3749,
      "3072": 0.3254
    },
    "delta": -0.0595,
    "rank_shift": -4
  },
  {
    "pair": "hollowing of terms \u2194 curated silence",
    "curated": false,
    "sims": {
      "256": 0.2426,
      "512": 0.3153,
      "1024": 0.3073,
      "3072": 0.3162
    },
    "delta": 0.0737,
    "rank_shift": 35
  },
  {
    "pair": "dormant fidelity \u2194 hollowing of terms",
    "curated": false,
    "sims": {
      "256": 0.3533,
      "512": 0.3758,
      "1024": 0.3519,
      "3072": 0.315
    },
    "delta": -0.0383,
    "rank_shift": -1
  },
  {
    "pair": "wake problem \u2194 operational fidelity defense",
    "curated": false,
    "sims": {
      "256": 0.3419,
      "512": 0.3624,
      "1024": 0.3512,
      "3072": 0.3143
    },
    "delta": -0.0276,
    "rank_shift": 4
  },
  {
    "pair": "genre-ification \u2194 instrument compaction losses",
    "curated": true,
    "sims": {
      "256": 0.3478,
      "512": 0.3582,
      "1024": 0.3268,
      "3072": 0.3114
    },
    "delta": -0.0364,
    "rank_shift": -1
  },
  {
    "pair": "antigenic sin in basin keys \u2194 genre-ification",
    "curated": false,
    "sims": {
      "256": 0.355,
      "512": 0.2951,
      "1024": 0.33,
      "3072": 0.3071
    },
    "delta": -0.0479,
    "rank_shift": -5
  },
  {
    "pair": "wake problem \u2194 instrument compaction losses",
    "curated": false,
    "sims": {
      "256": 0.3777,
      "512": 0.3679,
      "1024": 0.3365,
      "3072": 0.2965
    },
    "delta": -0.0812,
    "rank_shift": -9
  },
  {
    "pair": "antigenic sin in basin keys \u2194 operational fidelity defense",
    "curated": false,
    "sims": {
      "256": 0.3326,
      "512": 0.3652,
      "1024": 0.3142,
      "3072": 0.2942
    },
    "delta": -0.0384,
    "rank_shift": 2
  },
  {
    "pair": "basin key \u2194 genre-ification",
    "curated": false,
    "sims": {
      "256": 0.3006,
      "512": 0.3051,
      "1024": 0.3249,
      "3072": 0.2919
    },
    "delta": -0.0087,
    "rank_shift": 11
  },
  {
    "pair": "basin key \u2194 retrieval trigger architecture",
    "curated": false,
    "sims": {
      "256": 0.3853,
      "512": 0.3734,
      "1024": 0.3402,
      "3072": 0.2906
    },
    "delta": -0.0948,
    "rank_shift": -14
  },
  {
    "pair": "fidelity signature \u2194 curated silence",
    "curated": false,
    "sims": {
      "256": 0.294,
      "512": 0.304,
      "1024": 0.3328,
      "3072": 0.2902
    },
    "delta": -0.0038,
    "rank_shift": 10
  },
  {
    "pair": "antigenic sin in basin keys \u2194 negative decision loss",
    "curated": false,
    "sims": {
      "256": 0.3435,
      "512": 0.341,
      "1024": 0.3449,
      "3072": 0.2844
    },
    "delta": -0.059,
    "rank_shift": -5
  },
  {
    "pair": "dormant fidelity \u2194 instrument compaction losses",
    "curated": false,
    "sims": {
      "256": 0.2899,
      "512": 0.3308,
      "1024": 0.3002,
      "3072": 0.2804
    },
    "delta": -0.0095,
    "rank_shift": 9
  },
  {
    "pair": "genre-ification \u2194 operational fidelity defense",
    "curated": false,
    "sims": {
      "256": 0.2504,
      "512": 0.3249,
      "1024": 0.2895,
      "3072": 0.2737
    },
    "delta": 0.0233,
    "rank_shift": 21
  },
  {
    "pair": "hollowing of terms \u2194 instrument compaction losses",
    "curated": false,
    "sims": {
      "256": 0.3262,
      "512": 0.3369,
      "1024": 0.299,
      "3072": 0.2732
    },
    "delta": -0.053,
    "rank_shift": -2
  },
  {
    "pair": "basin key \u2194 instrument compaction losses",
    "curated": false,
    "sims": {
      "256": 0.3512,
      "512": 0.2955,
      "1024": 0.2987,
      "3072": 0.2642
    },
    "delta": -0.087,
    "rank_shift": -13
  },
  {
    "pair": "fidelity signature \u2194 genre-ification",
    "curated": false,
    "sims": {
      "256": 0.3075,
      "512": 0.3226,
      "1024": 0.3008,
      "3072": 0.2637
    },
    "delta": -0.0437,
    "rank_shift": 2
  },
  {
    "pair": "fidelity signature \u2194 wake problem",
    "curated": false,
    "sims": {
      "256": 0.2341,
      "512": 0.2581,
      "1024": 0.2716,
      "3072": 0.2615
    },
    "delta": 0.0274,
    "rank_shift": 20
  },
  {
    "pair": "antigenic sin in basin keys \u2194 instrument compaction losses",
    "curated": false,
    "sims": {
      "256": 0.3301,
      "512": 0.2756,
      "1024": 0.2899,
      "3072": 0.2608
    },
    "delta": -0.0693,
    "rank_shift": -8
  },
  {
    "pair": "genre-ification \u2194 curated silence",
    "curated": false,
    "sims": {
      "256": 0.2541,
      "512": 0.327,
      "1024": 0.2827,
      "3072": 0.2589
    },
    "delta": 0.0047,
    "rank_shift": 14
  },
  {
    "pair": "curated silence \u2194 operational fidelity defense",
    "curated": false,
    "sims": {
      "256": 0.2858,
      "512": 0.286,
      "1024": 0.29,
      "3072": 0.2586
    },
    "delta": -0.0272,
    "rank_shift": 3
  },
  {
    "pair": "fidelity signature \u2194 retrieval trigger architecture",
    "curated": false,
    "sims": {
      "256": 0.2813,
      "512": 0.2863,
      "1024": 0.2894,
      "3072": 0.2584
    },
    "delta": -0.0229,
    "rank_shift": 5
  },
  {
    "pair": "fidelity signature \u2194 instrument compaction losses",
    "curated": false,
    "sims": {
      "256": 0.3475,
      "512": 0.314,
      "1024": 0.2774,
      "3072": 0.2581
    },
    "delta": -0.0894,
    "rank_shift": -18
  },
  {
    "pair": "instrument compaction losses \u2194 operational fidelity defense",
    "curated": false,
    "sims": {
      "256": 0.3171,
      "512": 0.3075,
      "1024": 0.3041,
      "3072": 0.258
    },
    "delta": -0.059,
    "rank_shift": -8
  },
  {
    "pair": "antigenic sin in basin keys \u2194 retrieval trigger architecture",
    "curated": false,
    "sims": {
      "256": 0.2573,
      "512": 0.2849,
      "1024": 0.2861,
      "3072": 0.2551
    },
    "delta": -0.0022,
    "rank_shift": 7
  },
  {
    "pair": "instrument compaction losses \u2194 retrieval trigger architecture",
    "curated": false,
    "sims": {
      "256": 0.3282,
      "512": 0.2858,
      "1024": 0.2971,
      "3072": 0.2545
    },
    "delta": -0.0738,
    "rank_shift": -14
  },
  {
    "pair": "basin key \u2194 operational fidelity defense",
    "curated": false,
    "sims": {
      "256": 0.3107,
      "512": 0.3387,
      "1024": 0.2887,
      "3072": 0.2536
    },
    "delta": -0.0572,
    "rank_shift": -10
  },
  {
    "pair": "antigenic sin in basin keys \u2194 fidelity signature",
    "curated": false,
    "sims": {
      "256": 0.2634,
      "512": 0.2736,
      "1024": 0.263,
      "3072": 0.2464
    },
    "delta": -0.017,
    "rank_shift": 3
  },
  {
    "pair": "antigenic sin in basin keys \u2194 dormant fidelity",
    "curated": false,
    "sims": {
      "256": 0.204,
      "512": 0.2626,
      "1024": 0.2672,
      "3072": 0.2455
    },
    "delta": 0.0415,
    "rank_shift": 16
  },
  {
    "pair": "basin key \u2194 negative decision loss",
    "curated": false,
    "sims": {
      "256": 0.3096,
      "512": 0.2858,
      "1024": 0.2675,
      "3072": 0.2422
    },
    "delta": -0.0674,
    "rank_shift": -12
  },
  {
    "pair": "retrieval trigger architecture \u2194 operational fidelity defense",
    "curated": false,
    "sims": {
      "256": 0.2771,
      "512": 0.3329,
      "1024": 0.307,
      "3072": 0.2403
    },
    "delta": -0.0367,
    "rank_shift": -3
  },
  {
    "pair": "antigenic sin in basin keys \u2194 wake problem",
    "curated": false,
    "sims": {
      "256": 0.2458,
      "512": 0.2633,
      "1024": 0.2517,
      "3072": 0.2403
    },
    "delta": -0.0055,
    "rank_shift": 4
  },
  {
    "pair": "antigenic sin in basin keys \u2194 curated silence",
    "curated": false,
    "sims": {
      "256": 0.2717,
      "512": 0.2573,
      "1024": 0.2586,
      "3072": 0.2386
    },
    "delta": -0.0331,
    "rank_shift": -3
  },
  {
    "pair": "curated silence \u2194 retrieval trigger architecture",
    "curated": false,
    "sims": {
      "256": 0.3945,
      "512": 0.2974,
      "1024": 0.2774,
      "3072": 0.2363
    },
    "delta": -0.1583,
    "rank_shift": -39
  },
  {
    "pair": "negative decision loss \u2194 operational fidelity defense",
    "curated": false,
    "sims": {
      "256": 0.2743,
      "512": 0.3003,
      "1024": 0.2696,
      "3072": 0.2294
    },
    "delta": -0.0449,
    "rank_shift": -6
  },
  {
    "pair": "wake problem \u2194 negative decision loss",
    "curated": false,
    "sims": {
      "256": 0.2832,
      "512": 0.2601,
      "1024": 0.2554,
      "3072": 0.2284
    },
    "delta": -0.0548,
    "rank_shift": -10
  },
  {
    "pair": "basin key \u2194 wake problem",
    "curated": false,
    "sims": {
      "256": 0.2853,
      "512": 0.2877,
      "1024": 0.2553,
      "3072": 0.2283
    },
    "delta": -0.057,
    "rank_shift": -12
  },
  {
    "pair": "genre-ification \u2194 retrieval trigger architecture",
    "curated": false,
    "sims": {
      "256": 0.3191,
      "512": 0.2736,
      "1024": 0.2612,
      "3072": 0.2261
    },
    "delta": -0.093,
    "rank_shift": -23
  },
  {
    "pair": "antigenic sin in basin keys \u2194 hollowing of terms",
    "curated": false,
    "sims": {
      "256": 0.167,
      "512": 0.2057,
      "1024": 0.2272,
      "3072": 0.2188
    },
    "delta": 0.0517,
    "rank_shift": 10
  },
  {
    "pair": "negative decision loss \u2194 hollowing of terms",
    "curated": false,
    "sims": {
      "256": 0.2177,
      "512": 0.2669,
      "1024": 0.2381,
      "3072": 0.2177
    },
    "delta": 0.0,
    "rank_shift": 3
  },
  {
    "pair": "hollowing of terms \u2194 operational fidelity defense",
    "curated": true,
    "sims": {
      "256": 0.226,
      "512": 0.2115,
      "1024": 0.2155,
      "3072": 0.2093
    },
    "delta": -0.0166,
    "rank_shift": -2
  },
  {
    "pair": "fidelity signature \u2194 negative decision loss",
    "curated": false,
    "sims": {
      "256": 0.2255,
      "512": 0.2351,
      "1024": 0.249,
      "3072": 0.2092
    },
    "delta": -0.0164,
    "rank_shift": -2
  },
  {
    "pair": "negative decision loss \u2194 retrieval trigger architecture",
    "curated": false,
    "sims": {
      "256": 0.255,
      "512": 0.2335,
      "1024": 0.2294,
      "3072": 0.2085
    },
    "delta": -0.0465,
    "rank_shift": -10
  },
  {
    "pair": "fidelity signature \u2194 hollowing of terms",
    "curated": false,
    "sims": {
      "256": 0.2228,
      "512": 0.2341,
      "1024": 0.2401,
      "3072": 0.1989
    },
    "delta": -0.0239,
    "rank_shift": -3
  },
  {
    "pair": "negative decision loss \u2194 genre-ification",
    "curated": false,
    "sims": {
      "256": 0.2193,
      "512": 0.2487,
      "1024": 0.213,
      "3072": 0.1921
    },
    "delta": -0.0273,
    "rank_shift": -3
  },
  {
    "pair": "wake problem \u2194 genre-ification",
    "curated": false,
    "sims": {
      "256": 0.1889,
      "512": 0.2181,
      "1024": 0.2195,
      "3072": 0.1915
    },
    "delta": 0.0026,
    "rank_shift": 1
  },
  {
    "pair": "wake problem \u2194 curated silence",
    "curated": false,
    "sims": {
      "256": 0.2085,
      "512": 0.1825,
      "1024": 0.206,
      "3072": 0.1868
    },
    "delta": -0.0217,
    "rank_shift": -3
  },
  {
    "pair": "basin key \u2194 curated silence",
    "curated": false,
    "sims": {
      "256": 0.1848,
      "512": 0.1993,
      "1024": 0.1926,
      "3072": 0.1855
    },
    "delta": 0.0006,
    "rank_shift": 0
  },
  {
    "pair": "basin key \u2194 hollowing of terms",
    "curated": false,
    "sims": {
      "256": 0.1629,
      "512": 0.1747,
      "1024": 0.203,
      "3072": 0.1823
    },
    "delta": 0.0194,
    "rank_shift": 1
  },
  {
    "pair": "wake problem \u2194 hollowing of terms",
    "curated": false,
    "sims": {
      "256": 0.1932,
      "512": 0.2169,
      "1024": 0.1878,
      "3072": 0.1805
    },
    "delta": -0.0127,
    "rank_shift": -4
  },
  {
    "pair": "basin key \u2194 fidelity signature",
    "curated": false,
    "sims": {
      "256": 0.1502,
      "512": 0.1379,
      "1024": 0.1689,
      "3072": 0.1652
    },
    "delta": 0.015,
    "rank_shift": 0
  },
  {
    "pair": "basin key \u2194 dormant fidelity",
    "curated": false,
    "sims": {
      "256": 0.1053,
      "512": 0.1414,
      "1024": 0.1719,
      "3072": 0.1613
    },
    "delta": 0.0561,
    "rank_shift": 2
  },
  {
    "pair": "dormant fidelity \u2194 genre-ification",
    "curated": false,
    "sims": {
      "256": 0.1055,
      "512": 0.1713,
      "1024": 0.1537,
      "3072": 0.1571
    },
    "delta": 0.0516,
    "rank_shift": 0
  },
  {
    "pair": "hollowing of terms \u2194 retrieval trigger architecture",
    "curated": false,
    "sims": {
      "256": 0.1462,
      "512": 0.109,
      "1024": 0.1431,
      "3072": 0.1435
    },
    "delta": -0.0027,
    "rank_shift": -2
  }
]
```