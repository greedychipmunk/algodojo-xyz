# Letta Tutorials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five hands-on Letta tutorials and surface Letta as a fifth framework on the framework-comparison page.

**Architecture:** Tutorials are MDX files under `src/content/tutorials/`, auto-discovered by `src/lib/content.ts` via frontmatter. The `/tutorials/frameworks` page hardcodes a `FRAMEWORKS` array and groups tutorials by slug prefix (`letta-`), ordering each path by ascending `publishedAt`. A vitest test validates frontmatter by reading the MDX files directly with `gray-matter` (importing `content.ts` is impossible in tests — it pulls in `server-only`, which throws outside React Server Components).

**Tech Stack:** Next.js (App Router) MDX, `gray-matter`, vitest (node env), TypeScript, Tailwind. Tutorial code targets `letta-client` (Python SDK) against a self-hosted Letta server.

---

## File Structure

- Create: `src/content/tutorials/letta-build-your-first-agent.mdx`
- Create: `src/content/tutorials/letta-memory-blocks.mdx`
- Create: `src/content/tutorials/letta-agent-tools.mdx`
- Create: `src/content/tutorials/letta-telegram-bot.mdx`
- Create: `src/content/tutorials/letta-local-instance.mdx`
- Create: `src/content/tutorials/letta-tutorials.test.ts` — frontmatter + ordering validation
- Modify: `src/app/(tutorials)/tutorials/frameworks/page.tsx` — add Letta framework, grids, copy

Each tutorial file owns one topic. The test file owns structural validation of all five. The frameworks page owns discovery/comparison UI.

### Shared frontmatter contract (enforced by `parseTutorial` and the test)

Every tutorial MUST have all of: `title`, `slug`, `description`, `tier`, `category`, `tags`, `difficulty`, `estimatedReadTime`, `publishedAt`, `updatedAt`, `author`. A file missing any field is **silently dropped** from the site — the test is the guardrail against that.

| slug | title | difficulty | estimatedReadTime | publishedAt |
|------|-------|-----------|-------------------|-------------|
| `letta-build-your-first-agent` | Build Your First Letta Agent | beginner | 10 | 2026-06-15 |
| `letta-memory-blocks` | Letta Memory: Core Blocks & Archival | intermediate | 13 | 2026-06-16 |
| `letta-agent-tools` | Give Your Letta Agent Custom Tools | intermediate | 12 | 2026-06-17 |
| `letta-telegram-bot` | Talk to Letta Agents via Telegram | intermediate | 14 | 2026-06-18 |
| `letta-local-instance` | Run a Completely Local Letta Instance | advanced | 15 | 2026-06-19 |

All five: `tier: "free"`, `category: "ai"`, `author: "Algo Dojo"`, `updatedAt` equals `publishedAt`.

---

## Task 1: Frontmatter validation test

**Files:**
- Test: `src/content/tutorials/letta-tutorials.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/content/tutorials/letta-tutorials.test.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

const DIR = path.join(process.cwd(), "src/content/tutorials");

// The five Letta tutorials in intended learning-path order (ascending publishedAt).
const EXPECTED = [
  { slug: "letta-build-your-first-agent", difficulty: "beginner", publishedAt: "2026-06-15" },
  { slug: "letta-memory-blocks", difficulty: "intermediate", publishedAt: "2026-06-16" },
  { slug: "letta-agent-tools", difficulty: "intermediate", publishedAt: "2026-06-17" },
  { slug: "letta-telegram-bot", difficulty: "intermediate", publishedAt: "2026-06-18" },
  { slug: "letta-local-instance", difficulty: "advanced", publishedAt: "2026-06-19" },
];

const REQUIRED_FIELDS = [
  "title", "slug", "description", "tier", "category",
  "tags", "difficulty", "estimatedReadTime", "publishedAt", "updatedAt", "author",
];

function read(slug: string) {
  return matter(fs.readFileSync(path.join(DIR, `${slug}.mdx`), "utf8")).data as Record<string, unknown>;
}

describe("Letta tutorials", () => {
  it("has exactly the five expected files", () => {
    const lettaFiles = fs
      .readdirSync(DIR)
      .filter((f) => f.startsWith("letta-") && f.endsWith(".mdx"))
      .sort();
    expect(lettaFiles).toEqual(EXPECTED.map((e) => `${e.slug}.mdx`).sort());
  });

  it.each(EXPECTED)("$slug has complete, valid frontmatter", (entry) => {
    const fm = read(entry.slug);
    for (const field of REQUIRED_FIELDS) {
      expect(fm[field], `missing ${field}`).toBeDefined();
    }
    expect(fm.slug).toBe(entry.slug);
    expect(fm.tier).toBe("free");
    expect(fm.category).toBe("ai");
    expect(fm.author).toBe("Algo Dojo");
    expect(fm.difficulty).toBe(entry.difficulty);
    expect(fm.publishedAt).toBe(entry.publishedAt);
    expect(fm.updatedAt).toBe(entry.publishedAt);
    expect(Array.isArray(fm.tags)).toBe(true);
    expect((fm.tags as string[])).toContain("letta");
    expect(typeof fm.estimatedReadTime).toBe("number");
  });

  it("orders by ascending publishedAt matching the learning path", () => {
    const dates = EXPECTED.map((e) => read(e.slug).publishedAt as string);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- letta-tutorials`
Expected: FAIL — `ENOENT` reading `letta-build-your-first-agent.mdx` (no tutorial files yet).

- [ ] **Step 3: Commit the test**

```bash
git add src/content/tutorials/letta-tutorials.test.ts
git commit -m "test(tutorials): add Letta frontmatter + ordering validation"
```

---

## Task 2: Build Your First Letta Agent

**Files:**
- Create: `src/content/tutorials/letta-build-your-first-agent.mdx`

- [ ] **Step 1: Write the tutorial**

Frontmatter (exact):

```mdx
---
title: "Build Your First Letta Agent"
slug: "letta-build-your-first-agent"
description: "Letta (formerly MemGPT) builds stateful agents that remember. Start a Letta server, connect the Python SDK, create an agent with memory blocks, and watch it recall facts across messages."
tier: "free"
category: "ai"
tags: ["letta", "ai-agents", "stateful-agents", "memory", "python", "beginner"]
difficulty: "beginner"
estimatedReadTime: 10
publishedAt: "2026-06-15"
updatedAt: "2026-06-15"
author: "Algo Dojo"
---
```

Section outline (prose written in house style — `## Why…` opener, conversational, second person):

1. `## Why Stateful Agents?` — Most agent frameworks are stateless: the agent forgets everything between runs unless you re-stuff the prompt. Letta (formerly MemGPT) makes memory a first-class, server-persisted construct. Distinguish Letta's shape: a **server + SDK**, not an in-process library like CrewAI/AutoGen/LangGraph/Pydantic AI.
2. `## Start the Letta Server` — Run the server in Docker. Note port 8283 and the ADE.
3. `## Project Setup` — folder structure block + install the SDK.
4. `## Create Your First Agent` — memory blocks + embedding requirement.
5. `## Send a Message` — messages.create + iterating typed messages.
6. `## Proving It Remembers` — re-message the same `agent_id`.
7. `## Where to Go Next` — link to [Letta Memory](/tutorials/letta-memory-blocks) and [Custom Tools](/tutorials/letta-agent-tools).

Required code blocks (use exactly this API — verified against current `letta-client`):

Folder structure:

````mdx
```text
letta-quickstart/
├── .env             # optional: OPENAI_API_KEY=sk-... (or use a local model later)
└── first_agent.py   # create an agent and talk to it
```
````

Start the server:

````mdx
```bash
docker run \
  -v ~/.letta/.persist/pgdata:/var/lib/postgresql/data \
  -p 8283:8283 \
  -e OPENAI_API_KEY="your-openai-key" \
  letta/letta:latest
```
````

Install:

````mdx
```bash
pip install letta-client
```
````

Create + message the agent:

````mdx
```python
# first_agent.py
from letta_client import Letta

# Connect to the self-hosted server you started with Docker.
client = Letta(base_url="http://localhost:8283")

# Create a stateful agent with two self-editing memory blocks.
agent = client.agents.create(
    model="openai/gpt-4o-mini",
    embedding="openai/text-embedding-3-small",  # required for a self-hosted server
    memory_blocks=[
        {"label": "human", "value": "The human's name is unknown so far.", "limit": 5000},
        {"label": "persona", "value": "My name is Sam, a friendly assistant.", "limit": 5000},
    ],
)
print("Agent ID:", agent.id)

response = client.agents.messages.create(
    agent_id=agent.id,
    messages=[{"role": "user", "content": "Hi! My name is Brad."}],
)

# Letta returns typed messages: reasoning, tool calls, and the final reply.
for message in response.messages:
    if message.message_type == "assistant_message":
        print("Agent:", message.content)
```
````

Prove statefulness (reuse the same `agent.id`):

````mdx
```python
# Run this later, in a fresh process, with the agent_id printed above.
from letta_client import Letta

client = Letta(base_url="http://localhost:8283")
agent_id = "agent-..."  # paste the ID from before

response = client.agents.messages.create(
    agent_id=agent_id,
    messages=[{"role": "user", "content": "What's my name?"}],
)
for message in response.messages:
    if message.message_type == "assistant_message":
        print("Agent:", message.content)  # -> recalls "Brad"
```
````

- [ ] **Step 2: Run the validation test**

Run: `pnpm test -- letta-tutorials`
Expected: `letta-build-your-first-agent has complete, valid frontmatter` PASSES; the "exactly five files" and ordering tests still FAIL (only one file exists). This is expected until Task 6.

- [ ] **Step 3: Commit**

```bash
git add src/content/tutorials/letta-build-your-first-agent.mdx
git commit -m "docs(tutorials): add Build Your First Letta Agent"
```

---

## Task 3: Letta Memory: Core Blocks & Archival

**Files:**
- Create: `src/content/tutorials/letta-memory-blocks.mdx`

- [ ] **Step 1: Write the tutorial**

Frontmatter (exact):

```mdx
---
title: "Letta Memory: Core Blocks & Archival"
slug: "letta-memory-blocks"
description: "Memory is what makes Letta different. Learn how self-editing core memory blocks keep key facts in context, and how archival memory gives your agent unbounded, searchable long-term recall."
tier: "free"
category: "ai"
tags: ["letta", "ai-agents", "memory", "archival-memory", "python", "intermediate"]
difficulty: "intermediate"
estimatedReadTime: 13
publishedAt: "2026-06-16"
updatedAt: "2026-06-16"
author: "Algo Dojo"
---
```

Section outline:

1. `## Why Memory Is the Whole Point` — builds on [Build Your First Letta Agent](/tutorials/letta-build-your-first-agent). Two tiers: core memory (always in context) vs. archival memory (retrieved on demand).
2. `## Project Setup` — folder structure + reuse the SDK/server.
3. `## Core Memory Blocks` — read/modify blocks; let the agent self-edit.
4. `## Watching the Agent Rewrite Its Own Memory` — share a fact, then read the block back.
5. `## Archival Memory for Unbounded Recall` — insert + list passages.
6. `## Core vs. Archival: When to Use Which` — short decision table.
7. `## Where to Go Next` — link to [Custom Tools](/tutorials/letta-agent-tools).

Required code blocks:

Folder structure:

````mdx
```text
letta-memory/
├── memory_demo.py   # inspect and edit core memory, then add archival passages
```
````

Read and modify a core memory block:

````mdx
```python
# memory_demo.py
from letta_client import Letta

client = Letta(base_url="http://localhost:8283")
agent_id = "agent-..."  # an agent you created earlier

# Read a core memory block by its label.
human_block = client.agents.blocks.retrieve(agent_id=agent_id, block_label="human")
print("Before:", human_block.value)

# You can also edit a block directly from your code.
client.agents.blocks.modify(
    agent_id=agent_id,
    block_label="human",
    value="The human's name is Brad. They live in Berlin.",
)
```
````

Let the agent self-edit, then read it back:

````mdx
```python
# Tell the agent something new and let IT update its own memory.
response = client.agents.messages.create(
    agent_id=agent_id,
    messages=[{"role": "user", "content": "By the way, I just adopted a dog named Biscuit."}],
)

human_block = client.agents.blocks.retrieve(agent_id=agent_id, block_label="human")
print("After:", human_block.value)  # now mentions Biscuit
```
````

Archival memory:

````mdx
```python
# Archival memory is unbounded, searchable long-term storage.
client.agents.passages.create(
    agent_id=agent_id,
    text="Brad's favorite programming language is Rust, but he writes Python at work.",
)

# List what's stored in archival memory.
passages = client.agents.passages.list(agent_id=agent_id)
for passage in passages:
    print(passage.text)
```
````

- [ ] **Step 2: Run the validation test**

Run: `pnpm test -- letta-tutorials`
Expected: `letta-memory-blocks has complete, valid frontmatter` PASSES. Count/ordering still FAIL until Task 6.

- [ ] **Step 3: Commit**

```bash
git add src/content/tutorials/letta-memory-blocks.mdx
git commit -m "docs(tutorials): add Letta Memory: Core Blocks & Archival"
```

---

## Task 4: Give Your Letta Agent Custom Tools

**Files:**
- Create: `src/content/tutorials/letta-agent-tools.mdx`

- [ ] **Step 1: Write the tutorial**

Frontmatter (exact):

```mdx
---
title: "Give Your Letta Agent Custom Tools"
slug: "letta-agent-tools"
description: "Turn a Letta agent into a doer. Register your own Python functions as tools, declare their pip dependencies, pass secrets securely, and control whether the agent keeps Letta's built-in tools."
tier: "free"
category: "ai"
tags: ["letta", "ai-agents", "tools", "function-calling", "python", "intermediate"]
difficulty: "intermediate"
estimatedReadTime: 12
publishedAt: "2026-06-17"
updatedAt: "2026-06-17"
author: "Algo Dojo"
---
```

Section outline:

1. `## Why Tools?` — builds on the first two tutorials; the agent can only reason from what it knows until you give it tools.
2. `## Project Setup` — folder structure (a `tools.py` for the function + a `create_agent.py`).
3. `## Tools Are Just Python Functions` — type hints + docstring drive the schema.
4. `## Registering the Tool with Letta` — `create_from_function` + `pip_requirements`.
5. `## Attaching the Tool to an Agent` — `tools=[...]`, `include_base_tools`, `secrets`.
6. `## Calling It` — send a message that triggers the tool; inspect `tool_call_message`.
7. `## Where to Go Next` — link to [Telegram](/tutorials/letta-telegram-bot).

Required code blocks:

Folder structure:

````mdx
```text
letta-tools/
├── tools.py          # the custom tool function
└── create_agent.py   # register the tool and attach it to an agent
```
````

The tool function:

````mdx
```python
# tools.py
def get_exchange_rate(base: str, quote: str) -> str:
    """Get the current exchange rate between two currency codes, e.g. USD and EUR.

    Args:
        base: The base currency code, like "USD".
        quote: The quote currency code, like "EUR".
    """
    import requests

    url = f"https://open.er-api.com/v6/latest/{base.upper()}"
    rate = requests.get(url, timeout=10).json()["rates"][quote.upper()]
    return f"1 {base.upper()} = {rate} {quote.upper()}"
```
````

Register and attach:

````mdx
```python
# create_agent.py
from letta_client import Letta
from tools import get_exchange_rate

client = Letta(base_url="http://localhost:8283")

# Register the function as a tool. Declare any pip packages it imports.
rate_tool = client.tools.create_from_function(
    func=get_exchange_rate,
    pip_requirements=[{"name": "requests"}],
)
print("Created tool:", rate_tool.name)

agent = client.agents.create(
    model="openai/gpt-4o-mini",
    embedding="openai/text-embedding-3-small",
    memory_blocks=[{"label": "persona", "value": "You are a concise finance assistant."}],
    tools=[rate_tool.name],
    include_base_tools=True,  # keep Letta's built-in memory tools too
)

response = client.agents.messages.create(
    agent_id=agent.id,
    messages=[{"role": "user", "content": "How many euros is one US dollar right now?"}],
)
for message in response.messages:
    if message.message_type == "tool_call_message":
        print("Tool call:", message.tool_call)
    if message.message_type == "assistant_message":
        print("Agent:", message.content)
```
````

Mention (one sentence + tiny snippet) that secrets are passed at agent creation:

````mdx
```python
agent = client.agents.create(
    # ...other args...
    tools=[rate_tool.name],
    secrets={"SOME_API_KEY": "..."},  # available to tools at runtime, not stored in prompts
)
```
````

- [ ] **Step 2: Run the validation test**

Run: `pnpm test -- letta-tutorials`
Expected: `letta-agent-tools has complete, valid frontmatter` PASSES. Count/ordering still FAIL until Task 6.

- [ ] **Step 3: Commit**

```bash
git add src/content/tutorials/letta-agent-tools.mdx
git commit -m "docs(tutorials): add Give Your Letta Agent Custom Tools"
```

---

## Task 5: Talk to Letta Agents via Telegram

**Files:**
- Create: `src/content/tutorials/letta-telegram-bot.mdx`

- [ ] **Step 1: Write the tutorial**

Frontmatter (exact):

```mdx
---
title: "Talk to Letta Agents via Telegram"
slug: "letta-telegram-bot"
description: "Put a remembering Letta agent in your pocket. Build a Telegram bot that maps each chat to its own persistent agent, so every user gets an assistant that remembers them across conversations."
tier: "free"
category: "ai"
tags: ["letta", "ai-agents", "telegram", "chatbot", "python", "intermediate"]
difficulty: "intermediate"
estimatedReadTime: 14
publishedAt: "2026-06-18"
updatedAt: "2026-06-18"
author: "Algo Dojo"
---
```

Section outline:

1. `## Why Telegram + Letta?` — the persistence payoff: one agent per chat means per-user long-term memory, for free.
2. `## Get a Bot Token` — BotFather, set `TELEGRAM_BOT_TOKEN`.
3. `## Project Setup` — folder structure + installs.
4. `## The Bridge: One Agent per Chat` — map `chat_id` → `agent_id`, create-on-first-message.
5. `## Wiring Up the Handlers` — forward text, reply with `assistant_message`.
6. `## Run It` — talk to the bot; confirm it remembers across messages.
7. `## Where to Go Next` — link to [Run a Completely Local Letta Instance](/tutorials/letta-local-instance) (run the whole stack offline).

Required code blocks:

Folder structure:

````mdx
```text
letta-telegram/
├── .env          # TELEGRAM_BOT_TOKEN=...  (LETTA server runs separately on :8283)
└── bot.py        # the Telegram <-> Letta bridge
```
````

Install:

````mdx
```bash
pip install letta-client python-telegram-bot
```
````

The bridge (note: a real deployment should persist the chat→agent map; an in-memory dict keeps the tutorial focused):

````mdx
```python
# bot.py
import os

from letta_client import Letta
from telegram import Update
from telegram.ext import Application, ContextTypes, MessageHandler, filters

letta = Letta(base_url="http://localhost:8283")

# Map each Telegram chat to its own persistent Letta agent.
# For production, store this mapping in a database instead of memory.
chat_to_agent: dict[int, str] = {}


def get_agent_id(chat_id: int) -> str:
    if chat_id not in chat_to_agent:
        agent = letta.agents.create(
            model="openai/gpt-4o-mini",
            embedding="openai/text-embedding-3-small",
            memory_blocks=[
                {"label": "human", "value": "I don't know anything about this user yet."},
                {"label": "persona", "value": "You are a helpful assistant on Telegram. Be concise."},
            ],
        )
        chat_to_agent[chat_id] = agent.id
    return chat_to_agent[chat_id]


async def on_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    agent_id = get_agent_id(update.effective_chat.id)
    response = letta.agents.messages.create(
        agent_id=agent_id,
        messages=[{"role": "user", "content": update.message.text}],
    )
    reply = next(
        (m.content for m in response.messages if m.message_type == "assistant_message"),
        "(no reply)",
    )
    await update.message.reply_text(reply)


def main() -> None:
    app = Application.builder().token(os.environ["TELEGRAM_BOT_TOKEN"]).build()
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, on_message))
    app.run_polling()


if __name__ == "__main__":
    main()
```
````

Run:

````mdx
```bash
python bot.py
```
````

- [ ] **Step 2: Run the validation test**

Run: `pnpm test -- letta-tutorials`
Expected: `letta-telegram-bot has complete, valid frontmatter` PASSES. Count/ordering still FAIL until Task 6.

- [ ] **Step 3: Commit**

```bash
git add src/content/tutorials/letta-telegram-bot.mdx
git commit -m "docs(tutorials): add Talk to Letta Agents via Telegram"
```

---

## Task 6: Run a Completely Local Letta Instance

**Files:**
- Create: `src/content/tutorials/letta-local-instance.mdx`

- [ ] **Step 1: Write the tutorial**

Frontmatter (exact):

```mdx
---
title: "Run a Completely Local Letta Instance"
slug: "letta-local-instance"
description: "No API keys, no cloud. Run Letta entirely offline with Ollama serving both the LLM and the embedding model, wired into a self-hosted Letta server in Docker."
tier: "free"
category: "ai"
tags: ["letta", "ai-agents", "local-llm", "ollama", "self-hosted", "advanced"]
difficulty: "advanced"
estimatedReadTime: 15
publishedAt: "2026-06-19"
updatedAt: "2026-06-19"
author: "Algo Dojo"
---
```

Section outline:

1. `## Why Run Letta Locally?` — privacy, cost, offline. Everything from the earlier tutorials, with zero API keys.
2. `## Install and Run Ollama` — pull an LLM and an embedding model.
3. `## Start Letta Wired to Ollama` — Docker with `OLLAMA_BASE_URL`; the macOS/Windows vs. Linux networking difference.
4. `## Project Setup` — folder structure + SDK.
5. `## Create a Fully Local Agent` — `ollama/` model handles + `context_window_limit`.
6. `## Caveats with Small Local Models` — weaker tool-calling/memory-editing; pick instruct-tuned models, watch the context window.
7. `## Where to Go Next` — link back to [Build Your First Letta Agent](/tutorials/letta-build-your-first-agent) and [Custom Tools](/tutorials/letta-agent-tools).

Required code blocks:

Pull models:

````mdx
```bash
# Install Ollama from https://ollama.com, then pull a chat model and an embedding model.
ollama pull llama3.1:8b
ollama pull mxbai-embed-large
```
````

Start Letta wired to Ollama — show both platforms:

````mdx
```bash
# macOS / Windows: reach the host's Ollama via host.docker.internal
docker run \
  -v ~/.letta/.persist/pgdata:/var/lib/postgresql/data \
  -p 8283:8283 \
  -e OLLAMA_BASE_URL="http://host.docker.internal:11434/v1" \
  letta/letta:latest
```
````

````mdx
```bash
# Linux: share the host network and reach Ollama on localhost
docker run \
  -v ~/.letta/.persist/pgdata:/var/lib/postgresql/data \
  --network host \
  -e OLLAMA_BASE_URL="http://localhost:11434/v1" \
  letta/letta:latest
```
````

Folder structure + create a local agent:

````mdx
```text
letta-local/
└── local_agent.py   # an agent backed entirely by Ollama
```
````

````mdx
```python
# local_agent.py
from letta_client import Letta

client = Letta(base_url="http://localhost:8283")

agent = client.agents.create(
    # Ollama model handles are prefixed with "ollama/".
    model="ollama/llama3.1:8b",
    embedding="ollama/mxbai-embed-large",  # an embedding model is required for self-hosted
    context_window_limit=16000,
    memory_blocks=[
        {"label": "human", "value": "The human prefers fully local, private tools."},
        {"label": "persona", "value": "You are a privacy-first local assistant."},
    ],
)

response = client.agents.messages.create(
    agent_id=agent.id,
    messages=[{"role": "user", "content": "Confirm you're running locally and say hello."}],
)
for message in response.messages:
    if message.message_type == "assistant_message":
        print("Agent:", message.content)
```
````

Optionally show listing models so readers can confirm Ollama models registered:

````mdx
```python
for model in client.models.list():
    print(model.handle if hasattr(model, "handle") else model)
```
````

- [ ] **Step 2: Run the validation test (now full green)**

Run: `pnpm test -- letta-tutorials`
Expected: ALL tests PASS — five files present, every file's frontmatter valid, dates ascending.

- [ ] **Step 3: Commit**

```bash
git add src/content/tutorials/letta-local-instance.mdx
git commit -m "docs(tutorials): add Run a Completely Local Letta Instance"
```

---

## Task 7: Add Letta to the frameworks page

**Files:**
- Modify: `src/app/(tutorials)/tutorials/frameworks/page.tsx`

- [ ] **Step 1: Add the Letta entry to the `FRAMEWORKS` array**

Append this object as the last element of the `FRAMEWORKS` array (after the `pydantic-ai` entry, before the closing `]`):

```typescript
  {
    key: "letta",
    name: "Letta",
    slugPrefix: "letta-",
    tagline: "Stateful agents with long-term memory, run as a server.",
    mentalModel: "Stateful agents + memory blocks",
    bestFor: "Agents that must remember users across sessions and run as a service.",
    control: "Convenience-first SDK over a managed server.",
    multiAgent: "Shared memory blocks across agents.",
    stateMemory: "First-class: server-persisted core + archival memory.",
    learningCurve: "Gentle SDK — though you do run a Letta server.",
    watchOut: "It's a server + SDK, not an in-process library — you run a Letta server.",
    chooseWhen: "Your agent must remember users across sessions.",
  },
```

- [ ] **Step 2: Update the metadata block**

Replace the `metadata` description string:

```typescript
  description:
    "CrewAI vs. AutoGen vs. LangGraph vs. Pydantic AI vs. Letta — how five leading agent frameworks differ, when to reach for each, and the hands-on tutorials to get started with all of them.",
```

- [ ] **Step 3: Update the header intro paragraph**

Find the intro paragraph beginning `CrewAI, AutoGen, LangGraph, and Pydantic AI all build agentic` and replace its text with:

```tsx
            CrewAI, AutoGen, LangGraph, Pydantic AI, and Letta all build
            agentic systems — but they sit at different levels of abstraction.
            Here&apos;s how they compare, when to reach for each, and where to
            start with hands-on tutorials.
```

- [ ] **Step 4: Generalize the "three-part learning path" copy**

Find:

```tsx
            Each framework has a three-part learning path, from your first agent
            to production patterns.
```

Replace with:

```tsx
            Each framework has a hands-on learning path, from your first agent
            to production patterns.
```

- [ ] **Step 5: Widen the framework-cards grid to fit five**

Find:

```tsx
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
```

Replace with:

```tsx
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
```

- [ ] **Step 6: Widen the decision-guide grid to fit five**

Find:

```tsx
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
```

Replace with:

```tsx
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
```

- [ ] **Step 7: Verify the build compiles and the page renders all five**

Run: `pnpm build`
Expected: build succeeds with no TypeScript/ESLint errors.

- [ ] **Step 8: Commit**

```bash
git add "src/app/(tutorials)/tutorials/frameworks/page.tsx"
git commit -m "feat(tutorials): add Letta as a fifth framework"
```

---

## Task 8: Final verification

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: all tests pass, including the Letta suite.

- [ ] **Step 2: Lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: success. The five `/tutorials/letta-*` routes and `/tutorials/frameworks` all build.

- [ ] **Step 4: Manual smoke check (optional but recommended)**

Run: `pnpm dev`, then visit `/tutorials/frameworks` and confirm a Letta card appears with its five tutorials in order 1→5, and that each `/tutorials/letta-*` page renders.

---

## Self-Review Notes

- **Spec coverage:** All five tutorials (incl. the two required: Telegram, local), the `letta-` slug-prefix grouping, ascending `publishedAt` ordering, the frameworks-page entry + grid + copy changes, and the "out of scope" boundary (no `content.ts`/types changes) are each covered by a task.
- **Placeholders:** Frontmatter and all technical code blocks are given verbatim. Prose sections are intentionally specified as outlines (this is a writing task); the load-bearing parts (frontmatter validity, correct SDK API) are concrete and test-guarded.
- **Type/name consistency:** SDK calls are consistent across tasks — `Letta(base_url=...)`, `client.agents.create(...)`, `client.agents.messages.create(...)`, `message.message_type` values (`assistant_message`, `tool_call_message`), `client.agents.blocks.retrieve/modify`, `client.agents.passages.create/list`, `client.tools.create_from_function`. Frameworks `Framework` fields match the existing type exactly.
