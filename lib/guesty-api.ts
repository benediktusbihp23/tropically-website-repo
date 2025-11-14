import type {
  GuestyListing,
  GuestyAvailability,
  GuestyQuoteRequest,
  GuestyQuoteResponse,
  GuestyReservation,
} from "./types"

// Fetch bearer token from webhook
async function getBearerToken(): Promise<string> {
  try {
    const response = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch bearer token from webhook")
    }

    const data = await response.json()
    return data.bearerToken
  } catch (error) {
    console.error("[Guesty API] Token fetch error:", error)
    throw error
  }
}

const GUESTY_BASE_URL = "https://booking.guesty.com/api"

export async function getAllListings(): Promise<GuestyListing[]> {
  const token = await getBearerToken()

  const response = await fetch(`${GUESTY_BASE_URL}/listings`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  })

  if (!response.ok) {
    throw new Error("Failed to fetch listings")
  }

  return response.json()
}

export async function getListingById(listingId: string): Promise<GuestyListing> {
  const token = await getBearerToken()

  const response = await fetch(`${GUESTY_BASE_URL}/listings/${listingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch listing")
  }

  return response.json()
}

export async function getListingAvailability(
  listingId: string,
  from: string,
  to: string,
): Promise<GuestyAvailability[]> {
  const token = await getBearerToken()

  const response = await fetch(`${GUESTY_BASE_URL}/listings/${listingId}/calendar?from=${from}&to=${to}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: 60 }, // Cache for 1 minute
  })

  if (!response.ok) {
    throw new Error("Failed to fetch availability")
  }

  return response.json()
}

export async function getQuote(request: GuestyQuoteRequest): Promise<GuestyQuoteResponse> {
  const token = await getBearerToken()

  const response = await fetch(`${GUESTY_BASE_URL}/reservations/quotes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error?.error?.message || "Failed to get quote")
  }

  return response.json()
}

export async function searchReservation(confirmationCode: string): Promise<GuestyReservation> {
  const token = await getBearerToken()

  const response = await fetch(`${GUESTY_BASE_URL}/reservations?confirmationCode=${confirmationCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Reservation not found")
  }

  const data = await response.json()
  return data.results?.[0]
}
