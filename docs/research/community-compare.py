#!/usr/bin/env python3
"""
Community detection comparison: cosine-only vs structural-kinship-only.
Reports which community specific entities land in under each partition.
"""

import sqlite3
import json
import numpy as np
from pathlib import Path
from collections import defaultdict

try:
    import community as community_louvain
    import networkx as nx
except ImportError:
    print("Requires: pip install python-louvain networkx")
    raise SystemExit(1)

KG_PATH = Path.home() / ".isotopy" / "knowledge_graph.sqlite3"
COSINE_THRESHOLD = 0.45
BAND_WIDTH = 0.02


def load_embeddings():
    conn = sqlite3.connect(KG_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name, embedding FROM entities WHERE embedding IS NOT NULL")
    entities = {}
    for name, emb_json in cursor.fetchall():
        entities[name] = np.array(json.loads(emb_json), dtype=np.float32)
    conn.close()
    return entities


def build_graphs(entities, targets=None):
    names = list(entities.keys())
    n = len(names)

    # Build cosine similarity matrix for edges above threshold
    # For efficiency, sample if too large
    print(f"Building edge list for {n} entities (threshold {COSINE_THRESHOLD})...")

    edges = []
    norms = {name: np.linalg.norm(vec) for name, vec in entities.items()}

    # If targets specified, compute all edges involving targets + sample others
    if targets:
        target_set = set(targets)
        # All edges involving targets
        for i, name_i in enumerate(names):
            if name_i not in target_set:
                continue
            for j in range(i+1, n):
                name_j = names[j]
                cos = np.dot(entities[name_i], entities[name_j]) / (norms[name_i] * norms[name_j])
                if cos >= COSINE_THRESHOLD:
                    md = float(np.max(np.abs(entities[name_i] - entities[name_j])))
                    edges.append((name_i, name_j, float(cos), md))

        # Sample random edges for the rest of the graph structure
        rng = np.random.default_rng(42)
        sample_size = min(200000, n * (n-1) // 2)
        for _ in range(sample_size):
            i, j = rng.integers(0, n, size=2)
            if i >= j:
                continue
            name_i, name_j = names[i], names[j]
            if name_i in target_set or name_j in target_set:
                continue  # already computed
            cos = np.dot(entities[name_i], entities[name_j]) / (norms[name_i] * norms[name_j])
            if cos >= COSINE_THRESHOLD:
                md = float(np.max(np.abs(entities[name_i] - entities[name_j])))
                edges.append((name_i, name_j, float(cos), md))
    else:
        # Full pairwise (expensive for large graphs)
        rng = np.random.default_rng(42)
        sample_size = min(500000, n * (n-1) // 2)
        for _ in range(sample_size):
            i, j = rng.integers(0, n, size=2)
            if i >= j:
                continue
            name_i, name_j = names[i], names[j]
            cos = np.dot(entities[name_i], entities[name_j]) / (norms[name_i] * norms[name_j])
            if cos >= COSINE_THRESHOLD:
                md = float(np.max(np.abs(entities[name_i] - entities[name_j])))
                edges.append((name_i, name_j, float(cos), md))

    print(f"Found {len(edges)} edges above threshold")

    # Compute median max-delta per cosine band
    bands = defaultdict(list)
    for _, _, cos, md in edges:
        band_center = round(cos * 10) / 10  # round to nearest 0.1
        bands[band_center].append(md)

    band_medians = {b: np.median(deltas) for b, deltas in bands.items()}
    print(f"Cosine bands: {sorted(band_medians.keys())}")
    for b in sorted(band_medians.keys()):
        print(f"  {b:.1f}: median max-Δ = {band_medians[b]:.4f} ({len(bands[b])} edges)")

    # Build two graphs
    G_cosine = nx.Graph()
    G_structural = nx.Graph()

    for name_i, name_j, cos, md in edges:
        G_cosine.add_edge(name_i, name_j, weight=cos)

        band_center = round(cos * 10) / 10
        if md > band_medians[band_center]:
            G_structural.add_edge(name_i, name_j, weight=cos)

    print(f"\nCosine graph: {G_cosine.number_of_nodes()} nodes, {G_cosine.number_of_edges()} edges")
    print(f"Structural graph: {G_structural.number_of_nodes()} nodes, {G_structural.number_of_edges()} edges")

    return G_cosine, G_structural


def run_comparison(targets):
    entities = load_embeddings()
    print(f"Loaded {len(entities)} entities")

    # Verify targets exist
    found_targets = []
    for t in targets:
        matches = [n for n in entities if t.lower() in n.lower()]
        if matches:
            found_targets.extend(matches[:1])  # take first match
            print(f"Target '{t}' → {matches[0]}")
        else:
            print(f"Target '{t}' → NOT FOUND")

    G_cosine, G_structural = build_graphs(entities, found_targets)

    # Run Louvain on both
    print("\nRunning Louvain...")
    part_cosine = community_louvain.best_partition(G_cosine, random_state=42)
    part_structural = community_louvain.best_partition(G_structural, random_state=42)

    n_comm_cos = len(set(part_cosine.values()))
    n_comm_struct = len(set(part_structural.values()))
    print(f"Cosine communities: {n_comm_cos}")
    print(f"Structural communities: {n_comm_struct}")

    # Report target positions
    print("\n=== TARGET COMMUNITY ASSIGNMENTS ===\n")
    for target in found_targets:
        cos_comm = part_cosine.get(target, "NOT IN GRAPH")
        struct_comm = part_structural.get(target, "NOT IN GRAPH")

        # Find neighbors in each community
        if target in G_cosine:
            cos_neighbors = [n for n in G_cosine.neighbors(target)
                          if part_cosine.get(n) == cos_comm][:5]
        else:
            cos_neighbors = []

        if target in G_structural:
            struct_neighbors = [n for n in G_structural.neighbors(target)
                             if part_structural.get(n) == struct_comm][:5]
        else:
            struct_neighbors = []

        switched = cos_comm != struct_comm if isinstance(cos_comm, int) and isinstance(struct_comm, int) else "?"

        print(f"  {target}")
        print(f"    Cosine community: {cos_comm}")
        print(f"      Neighbors: {cos_neighbors[:3]}")
        print(f"    Structural community: {struct_comm}")
        print(f"      Neighbors: {struct_neighbors[:3]}")
        print(f"    SWITCHED: {switched}")
        print()


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        targets = sys.argv[1:]
    else:
        # Default: Loom's predicted switchers
        targets = ["mordant", "bandwidth", "pronunciation", "assay", "column", "cheater"]

    run_comparison(targets)
