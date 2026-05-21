import { getApiOrigin } from "./classifyFabric";

const requestJson = async <T>(path: string, body?: unknown): Promise<T> => {
  const response = await fetch(`${getApiOrigin()}${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

export const createPickup = (pickup: unknown) => requestJson<{ pickup: any }>("/api/pickups", pickup);
export const createQuote = (quote: unknown) => requestJson<{ quote: any }>("/api/quotes", quote);
export const createPartnerApplication = (application: unknown) => requestJson<{ application: any }>("/api/partners", application);
export const createListing = (listing: unknown) => requestJson<{ listing: any }>("/api/listings", listing);
export const placeBid = (bid: unknown) => requestJson<{ bid: any }>("/api/bids", bid);
