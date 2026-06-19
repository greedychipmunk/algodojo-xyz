# Tutorial Folder Structure & Filenames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Project Setup" layout tree and per-code-block filename headers to the 13 tutorials that currently lack folder/filename guidance.

**Architecture:** Pure content edits to MDX files in `src/content/tutorials/`. Each tutorial gets a `text`-fenced project tree (scaled to the tutorial — single-file for 12, two-file for one) plus a `# filename` comment as the first line of every runnable code block. No code/runtime/pipeline changes.

**Tech Stack:** Next.js App Router, MDX content, pnpm, Vitest.

**Spec:** `docs/superpowers/specs/2026-06-19-tutorial-folder-structure-design.md`

---

## Conventions Applied to Every Task

These rules apply to every tutorial task below. Read them once.

1. **Tree placement.** Insert the `## Project Setup` section immediately *after* the
   tutorial's existing intro/prerequisites — specifically, after the existing
   `## Prerequisites` or `## Setup` section if present, otherwise after the first
   `##` intro section and before the first `## Step`/concept section. The tree is a
   ` ```text ` fenced block.

2. **`.env` comment must match reality.** The trailing comment on the `.env` line must
   reflect the *actual* key(s) the tutorial's existing setup references (usually
   `OPENAI_API_KEY=sk-...`). Do not invent keys. If a tutorial uses no API key
   (e.g. `building-ml-pipelines`), do **not** add a `.env` entry.

3. **Filename header on every runnable block.** Every ` ```python ` (or other runnable
   language) block gets the matching filename as its first line, e.g. `# agent.py`.
   `bash`, `text`, and `yaml`-config blocks do not get a Python filename header.

4. **Append vs. replace prose.** When consecutive code blocks build ONE continuous
   script, add a short lead-in when a block extends the file (e.g. "Add to `agent.py`:")
   and when a block replaces an earlier version (e.g. "Update `agent.py`:"). When blocks
   are INDEPENDENT variations (only `autogen-agent-tools`), use "swap"/"replace the
   `...` in `tools_demo.py`" wording so a reader does not assume they stack.

5. **Do NOT touch frontmatter.** No `updatedAt` bump. No other frontmatter edits.

6. **Commit per task** with message `docs(tutorials): add folder structure to <slug>`.

7. **Tree style** matches the kept `crewai-yaml-config-structured-output.mdx`:
   box-drawing characters (`├──`, `└──`), aligned trailing `# comments`.

---

## Task 1: pydantic-ai-build-your-first-agent

**Files:**
- Modify: `src/content/tutorials/pydantic-ai-build-your-first-agent.mdx`

- [ ] **Step 1: Read the file** to confirm the current code blocks and section order.

- [ ] **Step 2: Insert `## Project Setup` after the `## Prerequisites` section**

```markdown
## Project Setup

This tutorial is a single script. Create a folder with one file:

```text
pydantic-ai-quickstart/
├── .env          # OPENAI_API_KEY=sk-...
└── agent.py      # the agent code below
```
```

- [ ] **Step 3: Add `# agent.py` as the first line of each `python` block.** The three
  Python blocks build one evolving `agent.py`; use "Update `agent.py`:" lead-ins where a
  block replaces the prior agent definition (Step 2 and Step 3 redefine the agent).

- [ ] **Step 4: Verify** — `pnpm build` succeeds; the file's every `python` fence starts with `# agent.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/pydantic-ai-build-your-first-agent.mdx
git commit -m "docs(tutorials): add folder structure to pydantic-ai-build-your-first-agent"
```

---

## Task 2: pydantic-ai-tools-and-dependencies

**Files:**
- Modify: `src/content/tutorials/pydantic-ai-tools-and-dependencies.mdx`

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Insert `## Project Setup` after the `## Setup` section**

```markdown
## Project Setup

```text
pydantic-ai-tools/
├── .env          # OPENAI_API_KEY=sk-...
└── agent.py      # the agent, tools, and dependencies below
```
```

- [ ] **Step 3: Add `# agent.py` to each `python` block.** Blocks build one continuous
  `agent.py` (tools → dependency injection → run); use "Add to `agent.py`:" lead-ins.

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# agent.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/pydantic-ai-tools-and-dependencies.mdx
git commit -m "docs(tutorials): add folder structure to pydantic-ai-tools-and-dependencies"
```

---

## Task 3: pydantic-ai-validation-and-streaming

**Files:**
- Modify: `src/content/tutorials/pydantic-ai-validation-and-streaming.mdx`

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Insert `## Project Setup` after the `## Setup` section**

```markdown
## Project Setup

```text
pydantic-ai-validation/
├── .env          # OPENAI_API_KEY=sk-...
└── agent.py      # the validators, retries, and streaming below
```
```

- [ ] **Step 3: Add `# agent.py` to each `python` block.** The four "Layer" blocks build
  one `agent.py`; use "Add to `agent.py`:" / "Update `agent.py`:" lead-ins as each layer
  extends or revises the agent.

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# agent.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/pydantic-ai-validation-and-streaming.mdx
git commit -m "docs(tutorials): add folder structure to pydantic-ai-validation-and-streaming"
```

---

## Task 4: crewai-build-your-first-crew

**Files:**
- Modify: `src/content/tutorials/crewai-build-your-first-crew.mdx`

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Insert `## Project Setup` after the `## Prerequisites` section**

```markdown
## Project Setup

```text
first-crew/
├── .env          # OPENAI_API_KEY=sk-...
└── crew.py       # agents, tasks, and the crew below
```
```

- [ ] **Step 3: Add `# crew.py` to each `python` block.** The blocks (define agents →
  define tasks → assemble/run → inspect result) build one continuous `crew.py`; use
  "Add to `crew.py`:" lead-ins.

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# crew.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/crewai-build-your-first-crew.mdx
git commit -m "docs(tutorials): add folder structure to crewai-build-your-first-crew"
```

---

## Task 5: crewai-agent-tools

**Files:**
- Modify: `src/content/tutorials/crewai-agent-tools.mdx`

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Insert `## Project Setup` after the `## Setup` section**

```markdown
## Project Setup

```text
crewai-tools/
├── .env          # OPENAI_API_KEY=sk-...  SERPER_API_KEY=...
└── crew.py       # the crew, built-in tool, and custom tool below
```
```

Match the `.env` keys to the tools the tutorial actually uses (drop `SERPER_API_KEY` if
the built-in tool example does not use Serper).

- [ ] **Step 3: Add `# crew.py` to each `python` block.** Blocks build one continuous
  `crew.py`; use "Add to `crew.py`:" lead-ins.

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# crew.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/crewai-agent-tools.mdx
git commit -m "docs(tutorials): add folder structure to crewai-agent-tools"
```

---

## Task 6: autogen-agent-tools (INDEPENDENT SNIPPETS)

**Files:**
- Modify: `src/content/tutorials/autogen-agent-tools.mdx`

This tutorial's five Python blocks are **independent illustrative variations**, not a
single stacking script. Treat them per Convention 4.

- [ ] **Step 1: Read the file** to confirm which blocks are standalone variations vs. a
  shared scaffold (the agent/model-client setup is shared; the tool definitions vary).

- [ ] **Step 2: Insert `## Project Setup`** after the first concept section
  (`## Why Tools Matter`) and before `## Tools Are Just Python Functions`

```markdown
## Project Setup

The examples below share one scaffold — an agent plus a model client — and vary the
tool you register. Keep them in a single file and swap the tool definition as you go:

```text
autogen-tools/
├── .env             # OPENAI_API_KEY=sk-...
└── tools_demo.py    # the shared agent scaffold; swap the tool per example
```
```

- [ ] **Step 3: Add `# tools_demo.py` to each `python` block**, with "swap the tool
  definition in `tools_demo.py`" / "replace the tool in `tools_demo.py`" lead-ins for the
  variation blocks — NOT "add to", since they do not stack into one runnable file.

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# tools_demo.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/autogen-agent-tools.mdx
git commit -m "docs(tutorials): add folder structure to autogen-agent-tools"
```

---

## Task 7: autogen-multi-agent-teams

**Files:**
- Modify: `src/content/tutorials/autogen-multi-agent-teams.mdx`

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Insert `## Project Setup`** after the intro section
  (`## From One Agent to a Team`) and before `## RoundRobinGroupChat: Take Turns`

```markdown
## Project Setup

```text
autogen-team/
├── .env          # OPENAI_API_KEY=sk-...
└── team.py       # the agents and team configurations below
```
```

- [ ] **Step 3: Add `# team.py` to each `python` block.** Blocks build one evolving
  `team.py` (round-robin → termination → selector → human-in-the-loop); use
  "Add to `team.py`:" / "Update `team.py`:" lead-ins.

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# team.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/autogen-multi-agent-teams.mdx
git commit -m "docs(tutorials): add folder structure to autogen-multi-agent-teams"
```

---

## Task 8: langgraph-build-your-first-graph

**Files:**
- Modify: `src/content/tutorials/langgraph-build-your-first-graph.mdx`

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Insert `## Project Setup` after the `## Prerequisites` section**

```markdown
## Project Setup

```text
first-graph/
├── .env          # OPENAI_API_KEY=sk-...
└── graph.py      # state, nodes, and the graph below
```
```

- [ ] **Step 3: Add `# graph.py` to each `python` block.** Blocks build one continuous
  `graph.py` (state → nodes → wiring → LLM node); use "Add to `graph.py`:" lead-ins.

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# graph.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/langgraph-build-your-first-graph.mdx
git commit -m "docs(tutorials): add folder structure to langgraph-build-your-first-graph"
```

---

## Task 9: langgraph-memory-and-human-in-the-loop

**Files:**
- Modify: `src/content/tutorials/langgraph-memory-and-human-in-the-loop.mdx`

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Insert `## Project Setup`** after the intro section
  (`## Persistence Is the Point`) and before `## Adding Memory with a Checkpointer`

```markdown
## Project Setup

```text
langgraph-memory/
├── .env              # OPENAI_API_KEY=sk-...
└── memory_graph.py   # the checkpointer and interrupt() flow below
```
```

- [ ] **Step 3: Add `# memory_graph.py` to each `python` block.** Blocks build one
  continuous `memory_graph.py`; use "Add to `memory_graph.py`:" lead-ins. (Inline
  `# pip install ...` comments inside prose stay as-is.)

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# memory_graph.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/langgraph-memory-and-human-in-the-loop.mdx
git commit -m "docs(tutorials): add folder structure to langgraph-memory-and-human-in-the-loop"
```

---

## Task 10: intro-to-ai-agents-python

**Files:**
- Modify: `src/content/tutorials/intro-to-ai-agents-python.mdx`

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Insert `## Project Setup` after the `## Setup` section**

```markdown
## Project Setup

```text
first-agent/
├── .env          # OPENAI_API_KEY=sk-...
└── agent.py      # tools, the agent, and the run loop below
```
```

- [ ] **Step 3: Add `# agent.py` to each `python` block.** Blocks build one continuous
  `agent.py` (define tools → create agent → run → measure); use "Add to `agent.py`:" lead-ins.

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# agent.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/intro-to-ai-agents-python.mdx
git commit -m "docs(tutorials): add folder structure to intro-to-ai-agents-python"
```

---

## Task 11: automating-workflows-langchain

**Files:**
- Modify: `src/content/tutorials/automating-workflows-langchain.mdx`

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Insert `## Project Setup` after the `## Setup` section**

```markdown
## Project Setup

```text
invoice-extraction/
├── .env          # OPENAI_API_KEY=sk-...
└── extract.py    # the structured model, extraction, and workflow below
```
```

- [ ] **Step 3: Add `# extract.py` to each `python` block.** Blocks build one continuous
  `extract.py` (define output → extract → measure → orchestrate); use "Add to
  `extract.py`:" lead-ins.

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# extract.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/automating-workflows-langchain.mdx
git commit -m "docs(tutorials): add folder structure to automating-workflows-langchain"
```

---

## Task 12: workflow-automation-with-llms

**Files:**
- Modify: `src/content/tutorials/workflow-automation-with-llms.mdx`

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Insert `## Project Setup` after the `## Setup` section**

```markdown
## Project Setup

```text
ticket-triage/
├── .env          # OPENAI_API_KEY=sk-...
└── triage.py     # the output model, triage function, and gating below
```
```

- [ ] **Step 3: Add `# triage.py` to each `python` block.** Blocks build one continuous
  `triage.py` (model → triage function → measure → confidence gating → reliability);
  use "Add to `triage.py`:" / "Update `triage.py`:" lead-ins.

- [ ] **Step 4: Verify** — `pnpm build` succeeds; every `python` fence starts with `# triage.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/workflow-automation-with-llms.mdx
git commit -m "docs(tutorials): add folder structure to workflow-automation-with-llms"
```

---

## Task 13: building-ml-pipelines (TWO-FILE)

**Files:**
- Modify: `src/content/tutorials/building-ml-pipelines.mdx`

This is the one multi-file tutorial. Training/persisting lives in `train.py`; the
"Later, in your serving code" step lives in `predict.py`. No `.env` (scikit-learn, no
API key).

- [ ] **Step 1: Read the file** to confirm which block is the "serving code" (the one
  under/after `## Step 6: Persist and Reload` with the `# Later, in your serving code:`
  comment) vs. the training blocks.

- [ ] **Step 2: Insert `## Project Setup` after the `## Setup` section**

```markdown
## Project Setup

```text
ml-pipeline/
├── train.py      # load data, build + evaluate the pipeline, persist the model
└── predict.py    # load the saved model and score new data
```
```

- [ ] **Step 3: Add filename headers.** Add `# train.py` to the data-loading, baseline,
  pipeline, evaluation, cross-validation, and persist blocks (use "Add to `train.py`:"
  lead-ins). Add `# predict.py` to the "load the saved model and score" block, with a
  lead-in like "In a separate file, `predict.py`, load the model you just saved:".

- [ ] **Step 4: Verify** — `pnpm build` succeeds; the serving block starts with
  `# predict.py` and every other `python` fence starts with `# train.py`.

- [ ] **Step 5: Commit**

```bash
git add src/content/tutorials/building-ml-pipelines.mdx
git commit -m "docs(tutorials): add folder structure to building-ml-pipelines"
```

---

## Task 14: Full Verification

**Files:** none (verification only)

- [ ] **Step 1: Build** — `pnpm build`. Expected: success, all tutorial routes prerender.

- [ ] **Step 2: Test** — `pnpm test`. Expected: existing suite passes (no test changes were made).

- [ ] **Step 3: Spot-check filename coverage.** For each of the 13 edited files, confirm
  every runnable code block has a filename header and each tutorial has exactly one
  `## Project Setup` section:

```bash
cd src/content/tutorials
for f in pydantic-ai-build-your-first-agent pydantic-ai-tools-and-dependencies \
  pydantic-ai-validation-and-streaming crewai-build-your-first-crew crewai-agent-tools \
  autogen-agent-tools autogen-multi-agent-teams langgraph-build-your-first-graph \
  langgraph-memory-and-human-in-the-loop intro-to-ai-agents-python \
  automating-workflows-langchain workflow-automation-with-llms building-ml-pipelines; do
  setup=$(grep -c "^## Project Setup" "$f.mdx")
  echo "$f  setup-sections=$setup"
done
```

Expected: every file reports `setup-sections=1`.

- [ ] **Step 4: Final review** — visually confirm a couple of edited files render the tree
  and headers correctly (e.g. open in the dev server `pnpm dev` and view two tutorial pages).
