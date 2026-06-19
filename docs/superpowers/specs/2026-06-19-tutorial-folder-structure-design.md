# Tutorial Folder Structure & Filenames — Design

**Date:** 2026-06-19
**Status:** Approved (design); pending implementation plan

## Goal

Every tutorial should give step-by-step instructions **including suggested folder
structures and filenames**, so a reader knows what file each code block belongs in
and how to lay out the project — not just what code to type.

## Scope

The 13 tutorials in `src/content/tutorials/` that currently have **no** filename or
folder guidance:

1. `pydantic-ai-build-your-first-agent.mdx`
2. `pydantic-ai-tools-and-dependencies.mdx`
3. `pydantic-ai-validation-and-streaming.mdx`
4. `crewai-build-your-first-crew.mdx`
5. `crewai-agent-tools.mdx`
6. `autogen-agent-tools.mdx`
7. `autogen-multi-agent-teams.mdx`
8. `langgraph-build-your-first-graph.mdx`
9. `langgraph-memory-and-human-in-the-loop.mdx`
10. `intro-to-ai-agents-python.mdx`
11. `automating-workflows-langchain.mdx`
12. `workflow-automation-with-llms.mdx`
13. `building-ml-pipelines.mdx`

**Out of scope** (already have structure, left untouched): `crewai-yaml-config-structured-output.mdx`
(the gold-standard reference), `autogen-build-your-first-agent.mdx`, `intro-to-ai-agents.mdx`,
`langgraph-tool-calling-agents.mdx`.

## The Standard

Each in-scope tutorial gets:

1. **A "Project Setup" section** (placed near the existing Prerequisites/Setup
   section) containing a `text`-fenced layout tree, scaled to the tutorial. Each
   file in the tree carries a trailing `# comment` describing its purpose — matching
   the style of `crewai-yaml-config-structured-output.mdx`.
2. **A filename comment as the first line of every runnable code block**, e.g.
   `# triage.py`, matching a file in the tree.
3. No artificial trees: single-file tutorials get a minimal layout (`.env` + one
   script), not a multi-folder skeleton.

### Reference style (from the kept `crewai-yaml` tutorial)

```text
research_project/
├── src/research_project/
│   └── main.py                    # the Flow entry point
├── .env                           # API keys
└── pyproject.toml
```

…and code blocks led by `# src/research_project/main.py`.

## Per-Tutorial Layout Plan

| Tutorial | Shape | Layout |
|---|---|---|
| pydantic-ai-build-your-first-agent | single-file | `.env` + `agent.py` |
| pydantic-ai-tools-and-dependencies | single-file | `.env` + `agent.py` |
| pydantic-ai-validation-and-streaming | single-file | `.env` + `agent.py` |
| crewai-build-your-first-crew | single-file | `.env` + `crew.py` |
| crewai-agent-tools | single-file | `.env` + `crew.py` |
| autogen-agent-tools | single-file (illustrative snippets) | `.env` + `tools_demo.py` |
| autogen-multi-agent-teams | single-file | `.env` + `team.py` |
| langgraph-build-your-first-graph | single-file | `.env` + `graph.py` |
| langgraph-memory-and-human-in-the-loop | single-file | `.env` + `memory_graph.py` |
| intro-to-ai-agents-python | single-file | `.env` + `agent.py` |
| automating-workflows-langchain | single-file | `.env` + `extract.py` |
| workflow-automation-with-llms | single-file | `.env` + `triage.py` |
| building-ml-pipelines | **two-file** | `train.py` + `predict.py` |

12 single-file, 1 multi-file (`building-ml-pipelines` has an explicit "Later, in your
serving code" step → `train.py` for training/persisting, `predict.py` for loading/serving).

## Edge Cases

- **Evolving vs. independent snippets.** Where the steps build one continuous script
  (most tutorials), all blocks share the single filename, and prose makes clear when a
  block *appends* to the file ("add to `agent.py`") vs. *replaces* an earlier section.
  Where blocks are **independent variations** (e.g. `autogen-agent-tools`' five separate
  example snippets), prose says "swap the tool definition in `tools_demo.py`" rather than
  implying the blocks stack — a reader copying top-to-bottom must not end up with a broken
  file.
- **`requirements.txt`.** Added to the tree only when a tutorial installs more than one
  package. Otherwise the existing `pip install ...` line plus `.env` is sufficient; no
  `requirements.txt` ceremony.
- **`.env` vs. `export`.** Tutorials currently using `export OPENAI_API_KEY=...` keep that
  instruction; the `.env` entry in the tree documents the same key so the layout is
  self-describing. No behavioral change to the setup commands.

## Non-Goals

- **No `updatedAt` bump** in frontmatter (explicit user decision).
- No changes to the 4 out-of-scope tutorials.
- No restructuring of the tutorial rendering pipeline, MDX components, or routing.
- No new code examples or content rewrites beyond what's needed to introduce filenames
  and the layout block.

## Verification

- `pnpm build` — MDX compiles; catches broken fences/frontmatter.
- `pnpm test` — existing suite stays green.
- Manual spot-check: every runnable code fence in each edited file begins with a
  filename comment that matches a file named in that tutorial's layout tree.
