import "server-only";

import type { RepoRecord } from "./leaflet";

/**
 * Thin, cached access to the AT Protocol XRPC endpoints that serve our blog.
 *
 * Every call here is a public, unauthenticated `GET` executed server-side (RSC
 * / route handlers). No secrets, and never called from the browser. Reads use
 * Next's `fetch` cache with revalidation so posts refresh without a redeploy.
 */

/** Repo DID for the `algodojo.xyz` handle. Overridable for testing/forks. */
export const DID =
  process.env.NEXT_PUBLIC_BLOG_DID ?? "did:plc:bvjokteh6hd2e3blqavus3qj";

export const COLLECTION = "site.standard.document";

/** Shared ISR window (seconds) for list/record reads. */
export const BLOG_REVALIDATE = 900;

let pdsCache: string | undefined;

/**
 * Resolve the DID's `#atproto_pds` service endpoint from the PLC directory.
 * The PDS host can move, so we never hardcode it — we resolve and cache it
 * (in-process + a 24h fetch cache). `BLOG_PDS_OVERRIDE` short-circuits this in
 * local dev.
 */
export async function resolvePds(): Promise<string> {
  if (pdsCache) return pdsCache;

  const override = process.env.BLOG_PDS_OVERRIDE;
  if (override) return (pdsCache = override.replace(/\/$/, ""));

  const doc = await fetch(`https://plc.directory/${DID}`, {
    next: { revalidate: 86400 },
  }).then((res) => res.json());

  const service = (doc.service ?? []).find(
    (svc: { id?: string }) => svc.id === "#atproto_pds",
  );
  if (!service?.serviceEndpoint) {
    throw new Error(`No atproto PDS service endpoint for ${DID}`);
  }
  return (pdsCache = String(service.serviceEndpoint).replace(/\/$/, ""));
}

/**
 * List every `site.standard.document` record in the repo, following the
 * cursor until exhausted. A handful of records today; pagination is
 * future-proofing.
 */
export async function listRecords(): Promise<RepoRecord[]> {
  const pds = await resolvePds();
  const out: RepoRecord[] = [];
  let cursor: string | undefined;

  do {
    const url = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`);
    url.searchParams.set("repo", DID);
    url.searchParams.set("collection", COLLECTION);
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url, { next: { revalidate: BLOG_REVALIDATE } });
    if (!res.ok) break;

    const page = (await res.json()) as { records?: RepoRecord[]; cursor?: string };
    const records = page.records ?? [];
    out.push(...records);
    cursor = page.cursor && records.length ? page.cursor : undefined;
  } while (cursor);

  return out;
}

/** Fetch a single record by rkey. Returns `null` on a 4xx (missing record). */
export async function getRecord(rkey: string): Promise<RepoRecord | null> {
  const pds = await resolvePds();
  const url = new URL(`${pds}/xrpc/com.atproto.repo.getRecord`);
  url.searchParams.set("repo", DID);
  url.searchParams.set("collection", COLLECTION);
  url.searchParams.set("rkey", rkey);

  const res = await fetch(url, { next: { revalidate: BLOG_REVALIDATE } });
  return res.ok ? ((await res.json()) as RepoRecord) : null;
}

/** Public URL for a blob (e.g. a `coverImage`) stored in the repo. */
export function blobUrl(pds: string, cid: string): string {
  return `${pds}/xrpc/com.atproto.sync.getBlob?did=${DID}&cid=${cid}`;
}
