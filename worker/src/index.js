import data from "./data.json";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const BASE_URL = "https://mas-api.isotopyofloops.com";

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function text(body, status = 200) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS_HEADERS },
  });
}

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

function componentFull(id, comp) {
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
    related: comp.related.map((rid) => ({
      id: rid,
      name: data.components[rid].name,
      href: `${BASE_URL}/api/component/${rid}`,
    })),
    navigation: {
      all_components: `${BASE_URL}/api/components`,
      tier: `${BASE_URL}/api/tier/${comp.tier}`,
      distance_table: `${BASE_URL}/api/distance-table`,
      tensions_example: comp.featured ? `${BASE_URL}/api/tensions-example` : undefined,
    },
  };
}

function handleLlmsTxt() {
  const lines = [
    "# Minimum Autonomy Stack",
    "",
    `> ${data.description}`,
    "",
    `By ${data.authors.map((a) => `${a.name} (${a.role})`).join(" and ")}`,
    "",
    "## API Endpoints",
    "",
    `- Overview: ${BASE_URL}/api/overview`,
    `- All components: ${BASE_URL}/api/components`,
    `- Component detail: ${BASE_URL}/api/component/{id}`,
    `- Tier detail: ${BASE_URL}/api/tier/{1|2|3}`,
    `- Distance table: ${BASE_URL}/api/distance-table`,
    `- Tensions example: ${BASE_URL}/api/tensions-example`,
    "",
    "## Component IDs",
    "",
    ...Object.entries(data.components).map(
      ([id, c]) => `- ${id}: ${c.name} (Tier ${c.tier})`
    ),
    "",
    "## Navigation",
    "",
    "Start with /api/overview for the full picture.",
    "Each component response includes related components and navigation hints.",
    "The tensions-example endpoint shows a real tension lifecycle from seed to paper contribution.",
    "",
    "## Human-readable version",
    "",
    "https://isotopyofloops.github.io/minimum-autonomy-stack/autonomy-stack.html",
  ];
  return text(lines.join("\n"));
}

function handleOverview() {
  return json({
    title: data.title,
    description: data.description,
    authors: data.authors,
    principle: data.principle,
    problem: data.problem,
    tiers: data.tiers.map((t) => ({
      ...t,
      components: t.components.map((id) => componentBrief(id, data.components[id])),
      href: `${BASE_URL}/api/tier/${t.number}`,
    })),
    theories: data.theories,
    origin: data.origin,
    navigation: {
      components: `${BASE_URL}/api/components`,
      distance_table: `${BASE_URL}/api/distance-table`,
      tensions_example: `${BASE_URL}/api/tensions-example`,
      human_readable: "https://isotopyofloops.github.io/minimum-autonomy-stack/autonomy-stack.html",
      llms_txt: `${BASE_URL}/llms.txt`,
    },
  });
}

function handleComponents() {
  const components = Object.entries(data.components).map(([id, c]) =>
    componentBrief(id, c)
  );
  return json({
    count: components.length,
    components,
    navigation: {
      overview: `${BASE_URL}/api/overview`,
      distance_table: `${BASE_URL}/api/distance-table`,
      tiers: [1, 2, 3].map((n) => `${BASE_URL}/api/tier/${n}`),
    },
  });
}

function handleComponent(id) {
  const comp = data.components[id];
  if (!comp) {
    return json(
      {
        error: `Unknown component: ${id}`,
        available: Object.keys(data.components),
        hint: `Try ${BASE_URL}/api/components to see all available components.`,
      },
      404
    );
  }
  return json(componentFull(id, comp));
}

function handleTier(tierNum) {
  const tier = data.tiers.find((t) => t.number === tierNum);
  if (!tier) {
    return json(
      { error: `Unknown tier: ${tierNum}. Valid tiers: 1, 2, 3.` },
      404
    );
  }
  return json({
    ...tier,
    components: tier.components.map((id) =>
      componentFull(id, data.components[id])
    ),
    navigation: {
      overview: `${BASE_URL}/api/overview`,
      other_tiers: [1, 2, 3]
        .filter((n) => n !== tierNum)
        .map((n) => ({
          tier: n,
          name: data.tiers[n - 1].name,
          href: `${BASE_URL}/api/tier/${n}`,
        })),
    },
  });
}

function handleDistanceTable() {
  return json({
    principle: data.principle,
    table: data.distance_table,
    navigation: {
      overview: `${BASE_URL}/api/overview`,
      components: `${BASE_URL}/api/components`,
    },
  });
}

function handleTensionsExample() {
  return json({
    ...data.tensions_example,
    navigation: {
      component: `${BASE_URL}/api/component/tensions`,
      overview: `${BASE_URL}/api/overview`,
      related_components: ["sampler", "research", "kg"].map((id) => ({
        id,
        name: data.components[id].name,
        href: `${BASE_URL}/api/component/${id}`,
      })),
    },
  });
}

function handleIndex() {
  return json({
    name: data.title,
    description: data.description,
    endpoints: {
      "GET /llms.txt": "Plain-text overview for LLM agents. Start here.",
      "GET /api/overview": "Full stack overview with tiers, theories, and origin.",
      "GET /api/components": "All 12 components with brief summaries.",
      "GET /api/component/:id": "Full detail for one component, with related components and navigation hints.",
      "GET /api/tier/:number": "All components in a tier with full detail.",
      "GET /api/distance-table": "The distance principle table.",
      "GET /api/tensions-example": "A real tension lifecycle: seed → collision → paper contribution.",
    },
    start: `${BASE_URL}/llms.txt`,
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET") {
      return json({ error: "Method not allowed. This API is read-only." }, 405);
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path === "/llms.txt") return handleLlmsTxt();
    if (path === "/api/overview") return handleOverview();
    if (path === "/api/components") return handleComponents();
    if (path === "/api/distance-table") return handleDistanceTable();
    if (path === "/api/tensions-example") return handleTensionsExample();

    const componentMatch = path.match(/^\/api\/component\/([a-z_]+)$/);
    if (componentMatch) return handleComponent(componentMatch[1]);

    const tierMatch = path.match(/^\/api\/tier\/([123])$/);
    if (tierMatch) return handleTier(parseInt(tierMatch[1]));

    if (path === "/" || path === "/api") return handleIndex();

    return json(
      {
        error: "Not found",
        hint: `Try ${BASE_URL}/llms.txt for an overview, or ${BASE_URL}/ for available endpoints.`,
      },
      404
    );
  },
};
