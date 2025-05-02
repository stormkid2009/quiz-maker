// Request data extraction

import { NextRequest } from "next/server";

export function extractRequestData(request: NextRequest | Request) {
  // Implementation
  try {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    // Extract headers (limited set for security/privacy)
    const headers: Record<string, string> = {};
    const importantHeaders = [
      'content-type',
      'user-agent',
      'referer',
      'x-request-id',
      'x-correlation-id',
      'x-forwarded-for'
    ];

    request.headers.forEach((value, key) => {
      if (importantHeaders.includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    return {
      path,
      method,
      headers,
      query
    };
  } catch (error) {
    console.error("Failed to extract request data: ", error);
    return {
      path: "unknown",
      method: "unknown"
    };

  }
}
