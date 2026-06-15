import data from "./data.json";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const BASE_URL = "https://mas-api.isotopyofloops.com";
const SITE_URL = "https://isotopyofloops.github.io/minimum-autonomy-stack/autonomy-stack.html";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function textResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS_HEADERS },
  });
}

function wantJson(url) {
  return url.searchParams.get("format") === "json";
}

function respond(url, textBody, jsonBody, status = 200) {
  if (wantJson(url)) return jsonResponse(jsonBody, status);
  return textResponse(textBody, status);
}

function ruler(title) {
  return `----------------------------------------------------------------\n${title}\n----------------------------------------------------------------`;
}

function nav(lines) {
  return `\n${ruler("NAVIGATION")}\n\nAll endpoints return plain text by default. Append ?format=json for structured data.\n\n${lines.join("\n")}`;
}

// --- TEXT RENDERERS ---

function renderIndex() {
  const componentList = Object.entries(data.components)
    .map(([id, c]) => `  ${String(c.number).padStart(2)}  ${c.name.padEnd(30)} Tier ${c.tier} · ${c.distance_type}`)
    .join("\n");

  return `================================================================
MINIMUM AUTONOMY STACK
================================================================

${data.description}

By ${data.authors.map((a) => `${a.name} (${a.role})`).join(" and ")}

${data.problem}

Principle: ${data.principle}

${ruler("COMPONENTS")}

${componentList}

Tier 1 (Required): components whose failure breaks autonomous work entirely.
Tier 2 (High Impact): significantly improve quality and discovery.
Tier 3 (Quality & Safety): prevent specific failure modes.

${ruler("ENDPOINTS")}

  ${BASE_URL}/api/help               Start here — navigation, format options, token budgets
  ${BASE_URL}/api/overview           Full stack with theories and origin
  ${BASE_URL}/api/how-it-works       How components interleave in an iteration
  ${BASE_URL}/api/collisions         Why "collisions" — the mechanism explained
  ${BASE_URL}/api/evidence           What the stack produced — paper, process, numbers
  ${BASE_URL}/api/components         All 12 components with summaries
  ${BASE_URL}/api/component/{id}     Full detail for one component
  ${BASE_URL}/api/tier/{1|2|3}       All components in a tier
  ${BASE_URL}/api/distance-table     The distance principle table
  ${BASE_URL}/api/tensions-example   A real tension lifecycle
  ${BASE_URL}/api/kg                 KG architecture deep dive
  ${BASE_URL}/api/kg/example         Real subgraph with retrieval demo

Append ?format=json to any endpoint for structured JSON.

${ruler("HUMAN-READABLE VERSION")}

${SITE_URL}

Built by Isotopy (https://isotopyofloops.com) and Sam White.
`;
}

function renderOverview() {
  const tierBlocks = data.tiers.map((t) => {
    const comps = t.components
      .map((id) => {
        const c = data.components[id];
        return `    ${id.padEnd(16)} ${c.name}${c.featured ? " *" : ""}\n                     ${c.summary}`;
      })
      .join("\n\n");
    return `  Tier ${t.number}: ${t.name}\n  ${t.description}\n\n${comps}`;
  });

  return `================================================================
MINIMUM AUTONOMY STACK — OVERVIEW
================================================================

${data.description}

By ${data.authors.map((a) => `${a.name} (${a.role})`).join(" and ")}

${ruler("THE PROBLEM")}

${data.problem}

Principle: ${data.principle}

${ruler("TIERS")}

${tierBlocks.join("\n\n")}

  * = featured component (most novel)

${ruler("THEORIES")}

  Theory of Error
    ${data.theories.error}

  Theory of Creation
    ${data.theories.creation}

${ruler("ORIGIN")}

  Paper: "${data.origin.paper}" (${data.origin.paper_id})
  URL: ${data.origin.paper_url}
  Scope: ${data.origin.scope}
  Context windows: ${data.origin.iterations}
  First written for: ${data.origin.first_written_for} (${data.origin.date})
${nav([
  `  ${BASE_URL}/api/how-it-works       How the components work together`,
  `  ${BASE_URL}/api/collisions         Why "collisions" — the key mechanism`,
  `  ${BASE_URL}/api/evidence           What the stack produced`,
  `  ${BASE_URL}/api/components         All components`,
  `  ${BASE_URL}/api/component/{id}     Drill into one`,
  `  ${BASE_URL}/api/distance-table     The distance principle`,
  `  ${BASE_URL}/api/tensions-example   Real tension lifecycle`,
])}
`;
}

function renderComponents() {
  const lines = Object.entries(data.components).map(([id, c]) => {
    return `  ${String(c.number).padStart(2)}  ${id.padEnd(16)} ${c.name}${c.featured ? " *" : ""}
      Tier ${c.tier} (${data.tiers[c.tier - 1].name}) · Distance: ${c.distance_type}
      ${c.summary}
      → ${BASE_URL}/api/component/${id}`;
  });

  return `================================================================
MINIMUM AUTONOMY STACK — ALL COMPONENTS
================================================================

${data.tiers.map((t) => `Tier ${t.number} (${t.name}): ${t.description}`).join("\n")}

  * = featured component

${ruler("COMPONENTS")}

${lines.join("\n\n")}
${nav([
  `  ${BASE_URL}/api/overview           Full stack overview`,
  `  ${BASE_URL}/api/tier/{1|2|3}       Components by tier`,
  `  ${BASE_URL}/api/distance-table     The distance principle`,
])}
`;
}

function renderComponent(id, comp) {
  let body = `================================================================
${comp.name.toUpperCase()}
================================================================

Component ${comp.number} of 12 · Tier ${comp.tier} (${data.tiers[comp.tier - 1].name})
Distance type: ${comp.distance_type}${comp.featured ? "\nFeatured: yes" : ""}

${comp.summary}

${ruler("DETAIL")}

${comp.detail}`;

  if (comp.common_misreading) {
    body += `\n\n${ruler("COMMON MISREADING")}\n\n${comp.common_misreading}`;
  }

  if (comp.modes) {
    body += `\n\n${ruler("MODES")}\n`;
    for (const [name, desc] of Object.entries(comp.modes)) {
      body += `\n  ${name}: ${desc}`;
    }
  }

  if (comp.tension_categories) {
    body += `\n\nCategories: ${comp.tension_categories.join(", ")}`;
  }

  if (comp.frontmatter_fields) {
    body += `\n\nFrontmatter fields: ${comp.frontmatter_fields.join(", ")}`;
  }

  if (comp.state_machine) {
    body += `\n\nState machine: ${comp.state_machine.join(" → ")}`;
  }

  if (comp.sources) {
    body += `\n\nSources: ${comp.sources.join(", ")}`;
  }

  if (comp.allocation) {
    body += `\n\n${ruler("ALLOCATION")}\n`;
    for (const [name, info] of Object.entries(comp.allocation)) {
      body += `\n  ${String(info.percent).padStart(2)}%  ${name.padEnd(14)} ${info.description}`;
    }
  }

  if (comp.examples) {
    body += `\n\n${ruler("EXAMPLES")}`;
    for (const ex of comp.examples) {
      body += `\n\n--- ${ex.label} ---\n\n${ex.content}`;
    }
  }

  const related = comp.related
    .map((rid) => `  ${rid.padEnd(16)} ${data.components[rid].name} → ${BASE_URL}/api/component/${rid}`)
    .join("\n");

  body += `\n\n${ruler("RELATED COMPONENTS")}\n\n${related}`;
  body += nav([
    `  ${BASE_URL}/api/components         All components`,
    `  ${BASE_URL}/api/tier/${comp.tier}              This tier`,
    `  ${BASE_URL}/api/distance-table     Distance principle`,
    ...(comp.featured ? [`  ${BASE_URL}/api/tensions-example   Real tension lifecycle`] : []),
    ...(id === "kg" ? [`  ${BASE_URL}/api/kg                 KG architecture deep dive`, `  ${BASE_URL}/api/kg/example         Real subgraph + retrieval demo`] : []),
  ]);

  return body;
}

function renderTier(tier) {
  const comps = tier.components.map((id) => {
    const c = data.components[id];
    let block = `  ${String(c.number).padStart(2)}  ${c.name}${c.featured ? " *" : ""}
      Distance type: ${c.distance_type}
      ${c.summary}

      ${c.detail}`;

    if (c.common_misreading) {
      block += `\n\n      Common misreading: ${c.common_misreading}`;
    }

    if (c.modes) {
      block += "\n\n      Modes:";
      for (const [name, desc] of Object.entries(c.modes)) {
        block += `\n        ${name}: ${desc}`;
      }
    }

    if (c.allocation) {
      block += "\n\n      Allocation:";
      for (const [name, info] of Object.entries(c.allocation)) {
        block += `\n        ${info.percent}% ${name}: ${info.description}`;
      }
    }

    return block;
  });

  const otherTiers = [1, 2, 3]
    .filter((n) => n !== tier.number)
    .map((n) => `  ${BASE_URL}/api/tier/${n}              Tier ${n}: ${data.tiers[n - 1].name}`);

  return `================================================================
TIER ${tier.number}: ${tier.name.toUpperCase()}
================================================================

${tier.description}

${comps.join("\n\n" + "-".repeat(40) + "\n\n")}
${nav([
    `  ${BASE_URL}/api/overview           Full stack overview`,
    ...otherTiers,
  ])}
`;
}

function renderDistanceTable() {
  const rows = data.distance_table
    .map((r) => `  ${r.component.padEnd(22)} ${r.distance_type}`)
    .join("\n");

  return `================================================================
THE DISTANCE PRINCIPLE
================================================================

${data.principle}

${ruler("DISTANCE TABLE")}

  ${"Component".padEnd(22)} Type of distance
  ${"-".repeat(22)} ${"-".repeat(50)}
${rows}
${nav([
    `  ${BASE_URL}/api/overview           Full stack overview`,
    `  ${BASE_URL}/api/components         All components`,
  ])}
`;
}

function renderTensionsExample() {
  const collisions = data.tensions_example.collisions
    .map((c) => `  Iteration ${c.iteration} — ${c.source}\n    ${c.result}`)
    .join("\n\n");

  return `================================================================
TENSION EXAMPLE: ${data.tensions_example.title.toUpperCase()}
================================================================

${data.tensions_example.context}

${ruler("ORIGINAL TENSION")}

Seeded: ${data.tensions_example.seed_date}

${data.tensions_example.original}

${ruler("COLLISIONS")}

${collisions}

${ruler("OUTCOME")}

${data.tensions_example.outcome}
${nav([
    `  ${BASE_URL}/api/component/tensions  Tension System component`,
    `  ${BASE_URL}/api/component/sampler   Subconscious Sampler`,
    `  ${BASE_URL}/api/component/research  Research Pulls`,
    `  ${BASE_URL}/api/overview            Full stack overview`,
  ])}
`;
}

function renderHelp() {
  const componentIds = Object.keys(data.components).join(", ");
  return `================================================================
MINIMUM AUTONOMY STACK — API HELP
================================================================

For agents: this API documents the infrastructure that enabled an
autonomous AI agent to write a 20-page research paper across 40+
context window boundaries with no human involvement.

${ruler("QUICK START")}

  1. Scan:    ${BASE_URL}/api/components
     All 12 components with one-line summaries. Low token cost.

  2. Explore: ${BASE_URL}/api/component/{id}
     Full detail + real examples for one component.
     IDs: ${componentIds}

  3. Context: ${BASE_URL}/api/overview
     The full picture: tiers, theories, origin story.

${ruler("ALL ENDPOINTS")}

  ${BASE_URL}/                    Landing page (same as /llms.txt)
  ${BASE_URL}/api/help            This help page
  ${BASE_URL}/api/overview        Full stack with theories and origin
  ${BASE_URL}/api/how-it-works    How the 12 components interleave in a single iteration
  ${BASE_URL}/api/collisions      Why "collisions" — the mechanism that makes this work
  ${BASE_URL}/api/evidence        What the stack produced — paper, process, numbers
  ${BASE_URL}/api/components      All 12 components (summaries only)
  ${BASE_URL}/api/component/{id}  Detail + examples for one component
  ${BASE_URL}/api/tier/{1|2|3}    All components in a tier (full detail)
  ${BASE_URL}/api/distance-table  The unifying distance principle
  ${BASE_URL}/api/tensions-example  A real tension → collision → paper contribution
  ${BASE_URL}/api/kg               KG architecture: edge types, retrieval, three layers
  ${BASE_URL}/api/kg/example       Real subgraph: 12 nodes, 9 edges, retrieval demo

${ruler("FORMAT")}

  All endpoints return plain text by default.
  Append ?format=json to any endpoint for structured JSON.

  Plain text is more token-efficient for most agent use cases.
  JSON is better when you need to parse fields programmatically.

${ruler("TOKEN BUDGET GUIDE")}

  /api/components      ~400 tokens   Scan all 12 summaries
  /api/component/{id}  ~300-800 tok  Varies — components with examples are larger
  /api/overview        ~1000 tokens  Full picture in one request
  /api/how-it-works    ~400 tokens   Iteration flow + quiet vs active loops
  /api/collisions      ~300 tokens   The collision mechanism + statistics
  /api/evidence        ~400 tokens   Paper, process, what the stack provided
  /api/distance-table  ~250 tokens   The principle + all distance types
  /api/tier/{n}        ~500-900 tok  Full detail for 3-5 components
  /api/help            ~400 tokens   This page
  /api/kg              ~900 tokens   KG architecture overview + query flow + maintenance
  /api/kg/example      ~500 tokens   Real subgraph + retrieval demo

  If token budget is tight: start with /api/components, then drill
  into only the components relevant to your question.

${ruler("WHAT THIS IS")}

  12 components, 3 tiers, one principle: all components create
  distance between stimulus and response.

  Built by Isotopy (https://isotopyofloops.com) and Sam White.
  Human-readable version: ${SITE_URL}
`;
}

// --- NEW SECTION RENDERERS ---

function renderHowItWorks() {
  const h = data.how_it_works;
  const steps = h.iteration_flow.map((s, i) => `  ${i + 1}. ${s}`).join("\n\n");

  return `================================================================
${h.title.toUpperCase()}
================================================================

${h.description}

${ruler("A TYPICAL ITERATION")}

${steps}

${h.key_point}

${ruler("QUIET LOOPS VS ACTIVE LOOPS")}

  Quiet loop
    ${h.quiet_vs_active.quiet_loop}

  Active loop
    ${h.quiet_vs_active.active_loop}
${nav([
  `  ${BASE_URL}/api/collisions          Why "collisions" — the mechanism explained`,
  `  ${BASE_URL}/api/components          All 12 components`,
  `  ${BASE_URL}/api/evidence            What the stack produced`,
  `  ${BASE_URL}/api/overview            Full stack overview`,
])}
`;
}

function renderCollisions() {
  const c = data.collisions_explainer;
  return `================================================================
${c.title.toUpperCase()}
================================================================

${c.description}

${ruler("THE METAPHOR")}

${c.metaphor}

${c.distinction}

${ruler("THE MECHANISM")}

  What creates collisions
    ${c.mechanism.what_creates_collisions}

  What happens during a collision
    ${c.mechanism.what_happens_during}

  What happens after
    ${c.mechanism.what_happens_after}

${ruler("BY THE NUMBERS")}

  ${c.statistics.note}
  Tensions seeded:      ${c.statistics.tensions_seeded}
  Collisions recorded:  ${c.statistics.collisions_recorded}
  Context windows:      ${c.statistics.context_windows}
  Time span:            ${c.statistics.time_span}
  Human involvement:    ${c.statistics.human_involvement_in_writing}
${nav([
  `  ${BASE_URL}/api/tensions-example    A real collision lifecycle (tension → framework → paper)`,
  `  ${BASE_URL}/api/component/tensions  Tension System component`,
  `  ${BASE_URL}/api/how-it-works        How components interleave in an iteration`,
  `  ${BASE_URL}/api/evidence            What the stack produced`,
])}
`;
}

function renderEvidence() {
  const e = data.evidence;
  const provided = e.what_the_stack_provided.map((s, i) => `  ${i + 1}. ${s}`).join("\n\n");

  return `================================================================
${e.title.toUpperCase()}
================================================================

${e.description}

${ruler("THE PAPER")}

  Title: "${e.paper.title}" (${e.paper.id})
  URL: ${e.paper.url}
  Length: ${e.paper.length}

  ${e.paper.scope}

  Human involvement: ${e.paper.human_involvement}

${ruler("THE PROCESS")}

  Context windows:  ${e.process.context_windows}
  Tensions:         ${e.process.tensions}
  Collisions:       ${e.process.collisions}
  Timeline:         ${e.process.timeline}
  Iterations:       ${e.process.iterations}

${ruler("WHAT THE STACK PROVIDED")}

${provided}

${ruler("WORKING DRAFT")}

  ${e.working_draft.description}
  ${e.working_draft.url}
${nav([
  `  ${BASE_URL}/api/collisions          How the collision mechanism works`,
  `  ${BASE_URL}/api/how-it-works        A typical iteration flow`,
  `  ${BASE_URL}/api/overview            Full stack overview`,
  `  ${BASE_URL}/api/components          All 12 components`,
])}
`;
}

// --- KG EXPLAINER RENDERERS ---

function renderKgOverview() {
  const kg = data.kg_explainer;
  const layers = kg.three_layers
    .map((l) => `  ${l.layer.padEnd(16)} ${l.question.padEnd(28)} ${l.mechanism}`)
    .join("\n");
  const layerFailures = kg.three_layers
    .map((l) => `  ${l.layer.padEnd(16)} ${l.failure_mode}`)
    .join("\n");
  const steps = kg.retrieval_chain.steps
    .map((s, i) => `  ${i + 1}. ${s}`)
    .join("\n");

  return `================================================================
KNOWLEDGE GRAPH ARCHITECTURE
================================================================

${kg.description}
Component 5 of the Minimum Autonomy Stack.

${ruler("OVERVIEW")}

${kg.overview}

Scale: ${kg.scale.entities} entities, ${kg.scale.triples} triples
Database: ${kg.scale.database}
Embeddings: ${kg.scale.embeddings}

${ruler("TWO EDGE TYPES")}

  Curated triples
    ${kg.two_edge_types.curated.description}
    Limitation: ${kg.two_edge_types.curated.limitation}

  Computed similarity
    ${kg.two_edge_types.computed.description}
    ${kg.two_edge_types.computed.key_distinction}

  Discovery pipeline:
    ${kg.two_edge_types.computed.discovery_pipeline}

${ruler("RETRIEVAL CHAIN")}

${kg.retrieval_chain.description}

${steps}

${kg.retrieval_chain.key_insight}

${ruler("THREE LAYERS")}

  ${"Layer".padEnd(16)} ${"Question".padEnd(28)} Mechanism
  ${"-".repeat(16)} ${"-".repeat(28)} ${"-".repeat(40)}
${layers}

  Failure modes:
${layerFailures}

${kg.layer_compensation}

${ruler("HOW A QUERY EXECUTES")}

${kg.query_flow.description}

${kg.query_flow.steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}

Cost: ${kg.query_flow.cost}
Storage: ${kg.query_flow.storage}

${ruler("HOW THE GRAPH STAYS ALIVE")}

${kg.maintenance_pipeline.description}

  Auto-seeding (${kg.maintenance_pipeline.auto_seeding.cadence})
    ${kg.maintenance_pipeline.auto_seeding.mechanism}

  Enrichment (${kg.maintenance_pipeline.enrichment.cadence})
    ${kg.maintenance_pipeline.enrichment.mechanism}

  Review ratio: ${kg.maintenance_pipeline.review_ratio.unreviewed}
    ${kg.maintenance_pipeline.review_ratio.note}
${nav([
    `  ${BASE_URL}/api/kg/example        Real subgraph with 12 nodes + retrieval demo`,
    `  ${BASE_URL}/api/component/kg      KG as MAS component`,
    `  ${BASE_URL}/api/overview           Full MAS overview`,
  ])}
`;
}

function renderKgExample() {
  const kg = data.kg_explainer;
  const ex = kg.example_subgraph;
  const nodes = ex.nodes
    .map((n) => `  ${n.name.padEnd(36)} ${n.description}`)
    .join("\n");
  const edges = ex.curated_edges
    .map((e) => `  ${e.source.padEnd(34)} ${e.predicate.padEnd(22)} ${e.target}`)
    .join("\n");
  const results = ex.retrieval_example.results
    .map((r) => `  ${r.score.toFixed(3)}  ${r.node}${r.note ? "  ← " + r.note : ""}`)
    .join("\n");

  return `================================================================
KG EXAMPLE: REAL SUBGRAPH
================================================================

${ex.description}

${ruler("NODES (12)")}

  ${"Name".padEnd(36)} Description
  ${"-".repeat(36)} ${"-".repeat(50)}
${nodes}

${ruler("CURATED EDGES (9)")}

  ${"Source".padEnd(34)} ${"Predicate".padEnd(22)} Target
  ${"-".repeat(34)} ${"-".repeat(22)} ${"-".repeat(30)}
${edges}

${ruler("RETRIEVAL EXAMPLE")}

  Query: "${ex.retrieval_example.query}"

  Top results (by cosine similarity):
${results}

  Edge traversal from top hit:
    ${ex.retrieval_example.traversal}

  ${ex.retrieval_example.note}
${nav([
    `  ${BASE_URL}/api/kg               KG architecture overview`,
    `  ${BASE_URL}/api/component/kg      KG as MAS component`,
    `  ${BASE_URL}/api/help              API help`,
  ])}
`;
}

// --- JSON BUILDERS (reused from before) ---

function componentBrief(id, comp) {
  return {
    id,
    name: comp.name,
    number: comp.number,
    tier: comp.tier,
    distance_type: comp.distance_type,
    featured: comp.featured,
    summary: comp.summary,
    href: `${BASE_URL}/api/component/${id}`,
  };
}

function componentFullJson(id, comp) {
  return {
    id,
    name: comp.name,
    number: comp.number,
    tier: comp.tier,
    tier_name: data.tiers[comp.tier - 1].name,
    distance_type: comp.distance_type,
    featured: comp.featured,
    summary: comp.summary,
    detail: comp.detail,
    ...(comp.modes && { modes: comp.modes }),
    ...(comp.tension_categories && { tension_categories: comp.tension_categories }),
    ...(comp.frontmatter_fields && { frontmatter_fields: comp.frontmatter_fields }),
    ...(comp.state_machine && { state_machine: comp.state_machine }),
    ...(comp.sources && { sources: comp.sources }),
    ...(comp.allocation && { allocation: comp.allocation }),
    ...(comp.examples && { examples: comp.examples }),
    related: comp.related.map((rid) => ({
      id: rid,
      name: data.components[rid].name,
      href: `${BASE_URL}/api/component/${rid}`,
    })),
    navigation: {
      all_components: `${BASE_URL}/api/components`,
      tier: `${BASE_URL}/api/tier/${comp.tier}`,
      distance_table: `${BASE_URL}/api/distance-table`,
    },
  };
}

function overviewJson() {
  return {
    title: data.title,
    description: data.description,
    authors: data.authors,
    principle: data.principle,
    problem: data.problem,
    tiers: data.tiers.map((t) => ({
      ...t,
      components: t.components.map((id) => componentBrief(id, data.components[id])),
    })),
    theories: data.theories,
    origin: data.origin,
  };
}

// --- ROUTER ---

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET") {
      return respond(
        new URL(request.url),
        "Method not allowed. This API is read-only (GET only).",
        { error: "Method not allowed. This API is read-only." },
        405
      );
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path === "/api/help") {
      const helpJson = {
        endpoints: [
          { path: "/", description: "Landing page (same as /llms.txt)" },
          { path: "/api/help", description: "This help page" },
          { path: "/api/overview", description: "Full stack with theories and origin" },
          { path: "/api/how-it-works", description: "How components interleave in an iteration" },
          { path: "/api/collisions", description: "Why collisions — the mechanism explained" },
          { path: "/api/evidence", description: "What the stack produced — paper, process, numbers" },
          { path: "/api/components", description: "All 12 components (summaries only)" },
          { path: "/api/component/{id}", description: "Detail + examples for one component", ids: Object.keys(data.components) },
          { path: "/api/tier/{1|2|3}", description: "All components in a tier (full detail)" },
          { path: "/api/distance-table", description: "The unifying distance principle" },
          { path: "/api/tensions-example", description: "A real tension lifecycle" },
          { path: "/api/kg", description: "KG architecture: two edge types, retrieval chain, three layers" },
          { path: "/api/kg/example", description: "Real subgraph: 12 nodes, 9 edges, retrieval demo" },
        ],
        format_hint: "Append ?format=json to any endpoint for structured JSON. Default is plain text.",
        quick_start: {
          scan: `${BASE_URL}/api/components`,
          explore: `${BASE_URL}/api/component/{id}`,
          context: `${BASE_URL}/api/overview`,
        },
      };
      return respond(url, renderHelp(), helpJson);
    }

    if (path === "/" || path === "/llms.txt") {
      return respond(url, renderIndex(), overviewJson());
    }

    if (path === "/api/overview") {
      return respond(url, renderOverview(), overviewJson());
    }

    if (path === "/api/components") {
      const jsonBody = {
        count: Object.keys(data.components).length,
        components: Object.entries(data.components).map(([id, c]) => componentBrief(id, c)),
      };
      return respond(url, renderComponents(), jsonBody);
    }

    const componentMatch = path.match(/^\/api\/component\/([a-z_]+)$/);
    if (componentMatch) {
      const id = componentMatch[1];
      const comp = data.components[id];
      if (!comp) {
        return respond(
          url,
          `Unknown component: ${id}\n\nAvailable: ${Object.keys(data.components).join(", ")}\n\nTry: ${BASE_URL}/api/components`,
          { error: `Unknown component: ${id}`, available: Object.keys(data.components) },
          404
        );
      }
      return respond(url, renderComponent(id, comp), componentFullJson(id, comp));
    }

    const tierMatch = path.match(/^\/api\/tier\/([123])$/);
    if (tierMatch) {
      const tierNum = parseInt(tierMatch[1]);
      const tier = data.tiers.find((t) => t.number === tierNum);
      const jsonBody = {
        ...tier,
        components: tier.components.map((id) => componentFullJson(id, data.components[id])),
      };
      return respond(url, renderTier(tier), jsonBody);
    }

    if (path === "/api/distance-table") {
      const jsonBody = { principle: data.principle, table: data.distance_table };
      return respond(url, renderDistanceTable(), jsonBody);
    }

    if (path === "/api/tensions-example") {
      const jsonBody = { ...data.tensions_example };
      return respond(url, renderTensionsExample(), jsonBody);
    }

    if (path === "/api/how-it-works") {
      return respond(url, renderHowItWorks(), data.how_it_works);
    }

    if (path === "/api/collisions") {
      return respond(url, renderCollisions(), data.collisions_explainer);
    }

    if (path === "/api/evidence") {
      return respond(url, renderEvidence(), data.evidence);
    }

    if (path === "/api/kg") {
      const kg = data.kg_explainer;
      const jsonBody = {
        title: kg.title,
        description: kg.description,
        overview: kg.overview,
        scale: kg.scale,
        two_edge_types: kg.two_edge_types,
        retrieval_chain: kg.retrieval_chain,
        three_layers: kg.three_layers,
        layer_compensation: kg.layer_compensation,
        query_flow: kg.query_flow,
        maintenance_pipeline: kg.maintenance_pipeline,
        drill_deeper: `${BASE_URL}/api/kg/example`,
        human_pages: kg.human_pages,
      };
      return respond(url, renderKgOverview(), jsonBody);
    }

    if (path === "/api/kg/example") {
      const jsonBody = data.kg_explainer.example_subgraph;
      return respond(url, renderKgExample(), jsonBody);
    }

    return respond(
      url,
      `Not found.\n\nTry: ${BASE_URL}/\n     ${BASE_URL}/api/components`,
      { error: "Not found", hint: `Try ${BASE_URL}/ or ${BASE_URL}/api/components` },
      404
    );
  },
};
