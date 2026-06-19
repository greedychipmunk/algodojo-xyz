# Letta Tutorials — Design

**Date:** 2026-06-19
**Status:** Approved

## Goal

Add five hands-on Letta tutorials to the Algo Dojo tutorials section and surface
Letta as a fifth framework on the framework-comparison page. Two tutorials are
required by the request (Telegram integration, fully local instance); the other
three form a coherent learning path around Letta's defining feature: stateful
agents with server-persisted memory.

## Context

- Tutorials are **auto-discovered** from MDX frontmatter by `src/lib/content.ts`.
  Adding a tutorial = adding a `.mdx` file under `src/content/tutorials/`. No
  registry edit is needed for the main `/tutorials` listing.
- The `/tutorials/frameworks` page (`src/app/(tutorials)/tutorials/frameworks/page.tsx`)
  **hardcodes** a `FRAMEWORKS` array and groups tutorials by **slug prefix**,
  ordering each framework's learning path by `publishedAt` (oldest first).
- Required frontmatter fields (enforced by `parseTutorial`): `title`, `slug`,
  `description`, `tier` (`free`|`premium`), `category` (`ai`|`ml`|`automation`),
  `tags` (string[]), `difficulty` (`beginner`|`intermediate`|`advanced`),
  `estimatedReadTime` (number), `publishedAt`, `updatedAt`, `author`. A tutorial
  with any missing/invalid field is silently dropped.
- Letta is distinct from the existing four frameworks: it is `pip install letta-client`
  (the SDK) talking to a running **Letta server** (Docker `letta/letta:latest` on
  port 8283, or `pip install letta && letta server`), with memory as a
  first-class server-side construct. This server + SDK shape is the angle the
  tutorials lean into.

## The Five Tutorials

All `tier: free`, `category: ai`, author `Algo Dojo`, slug prefix `letta-`.
`publishedAt` ascends so they render 1→5 in the frameworks learning path.

| # | Slug | Title | Difficulty | est. min | publishedAt |
|---|------|-------|-----------|----------|-------------|
| 1 | `letta-build-your-first-agent` | Build Your First Letta Agent | beginner | 10 | 2026-06-15 |
| 2 | `letta-memory-blocks` | Letta Memory: Core Blocks & Archival | intermediate | 13 | 2026-06-16 |
| 3 | `letta-agent-tools` | Give Your Letta Agent Custom Tools | intermediate | 12 | 2026-06-17 |
| 4 | `letta-telegram-bot` | Talk to Letta Agents via Telegram | intermediate | 14 | 2026-06-18 |
| 5 | `letta-local-instance` | Run a Completely Local Letta Instance | advanced | 15 | 2026-06-19 |

### House style (match existing tutorials)

- Open with a `## Why …` section motivating the topic.
- Include a **folder structure** `text` code block early, per the recent
  `feat/tutorial-folder-structure` convention.
- Runnable code blocks with a filename comment on the first line
  (e.g. `# first_agent.py`).
- Cross-link the five tutorials to one another using `/tutorials/<slug>` links.
- `updatedAt` equals `publishedAt`.

### 1. Build Your First Letta Agent (`letta-build-your-first-agent`)

- What Letta is (stateful agents, formerly MemGPT) and how it differs from
  in-process libraries: a **server + SDK**.
- Start the server with Docker: `letta/letta:latest`, port 8283.
- `pip install letta-client`; connect with `Letta(base_url="http://localhost:8283")`.
- Create an agent with `human` / `persona` memory blocks; `embedding` is required
  for a self-hosted server.
- Send a message via `client.agents.messages.create(agent_id=..., messages=[{"role":"user","content":...}])`;
  iterate `response.messages`, filtering `message.message_type == "assistant_message"`.
- Demonstrate statefulness: re-message the same `agent_id` and show recall.
- Tags: `["letta", "ai-agents", "stateful-agents", "memory", "python", "beginner"]`.

### 2. Letta Memory: Core Blocks & Archival (`letta-memory-blocks`)

- Core memory blocks: self-editing, `limit`, retrieve/modify via
  `client.agents.blocks.retrieve(...)` / `client.agents.blocks.modify(...)`.
- Show the agent rewriting the `human` block after the user shares a fact.
- Archival memory for unbounded recall: `client.agents.passages.create(agent_id, text=...)`
  and `client.agents.passages.list(agent_id)`.
- Mental model: core memory (always in context) vs. archival memory (retrieved on demand).
- Tags: `["letta", "ai-agents", "memory", "archival-memory", "python", "intermediate"]`.

### 3. Give Your Letta Agent Custom Tools (`letta-agent-tools`)

- `client.tools.create_from_function(func=..., pip_requirements=[{"name": "..."}])`.
- Attach tools by name on `agents.create(tools=[...])`; `include_base_tools` flag.
- Pass credentials via `secrets={...}`.
- One end-to-end runnable custom tool example.
- Tags: `["letta", "ai-agents", "tools", "function-calling", "python", "intermediate"]`.

### 4. Talk to Letta Agents via Telegram (`letta-telegram-bot`)

- `python-telegram-bot` bridge.
- Map each Telegram `chat_id` to a persistent Letta `agent_id`, so each user gets
  their own remembering agent (create-on-first-message, then reuse).
- Forward inbound text to the agent; reply with the `assistant_message` content.
- Cover bot-token setup (BotFather) and the persistence payoff.
- Tags: `["letta", "ai-agents", "telegram", "chatbot", "python", "intermediate"]`.

### 5. Run a Completely Local Letta Instance (`letta-local-instance`)

- Fully offline: Ollama for both LLM and embeddings.
- Letta in Docker with `OLLAMA_BASE_URL`: `http://host.docker.internal:11434/v1`
  on macOS/Windows; `--network host` + `http://localhost:11434/v1` on Linux.
- `model="ollama/<model>"`, `embedding="ollama/mxbai-embed-large"`,
  `context_window_limit=...`.
- Pull models with `ollama pull`; no API keys anywhere; caveats with smaller
  local models.
- Tags: `["letta", "ai-agents", "local-llm", "ollama", "self-hosted", "advanced"]`.

## Frameworks Page Change

File: `src/app/(tutorials)/tutorials/frameworks/page.tsx`

- Add a fifth entry to `FRAMEWORKS` with honest comparison cells:
  - `key: "letta"`, `slugPrefix: "letta-"`, `name: "Letta"`.
  - `tagline`: "Stateful agents with long-term memory, run as a server."
  - `mentalModel`: "Stateful agents + memory blocks".
  - `bestFor`: "Agents that must remember across sessions and run as a service."
  - `control`: "Convenience-first SDK over a managed server.".
  - `multiAgent`: "Shared memory blocks across agents.".
  - `stateMemory`: "First-class: server-persisted core + archival memory.".
  - `learningCurve`: "Gentle SDK; you do run a server.".
  - `watchOut`: "It's a server + SDK, not an in-process library — you run a Letta server.".
  - `chooseWhen`: "Your agent must remember users across sessions."
- Grid adjustments:
  - Card grid: `sm:grid-cols-2 xl:grid-cols-4` → `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`.
  - Decision-guide grid: `sm:grid-cols-2 lg:grid-cols-4` → `sm:grid-cols-2 lg:grid-cols-5`.
  - Comparison table already scrolls horizontally (`min-w-[920px]` + scroll hint); keep.
- Copy / metadata updates:
  - `metadata` title/description: add Letta to the named list; "four" → "five".
  - Header intro paragraph: add Letta to "CrewAI, AutoGen, LangGraph, and Pydantic AI…".
  - "Each framework has a three-part learning path" → "Each framework has a
    hands-on learning path" (Letta's path is five steps, not three).

## Out of Scope

- No changes to `src/lib/content.ts`, `src/lib/types.ts`, or the main
  `/tutorials` listing (auto-discovery handles those).
- No unrelated refactors.

## Verification

- `pnpm build` (or dev) succeeds; all five tutorials resolve at
  `/tutorials/<slug>` and appear under a Letta card on `/tutorials/frameworks`
  in the intended 1→5 order.
- Frontmatter on each file is complete and valid (otherwise the tutorial is
  silently dropped by `parseTutorial`).
