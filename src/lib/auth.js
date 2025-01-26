export const handleDocuSignAuthCode = async (authCode, codeVerifier) => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code: authCode,
    code_verifier: codeVerifier,
    client_id: import.meta.env.VITE_DOCUSIGN_CLIENT_ID,
  });

  const response = await fetch("https://account-d.docusign.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange auth code for token");
  }

  return await response.json();
};

export const requestAuthCode = async (codeChallenge) => {
  const params = new URLSearchParams({
    response_type: "code",
    scope: getDocuSignScopes(),
    client_id: import.meta.env.VITE_DOCUSIGN_CLIENT_ID,
    state: crypto.randomUUID(), // Generate a random state for security
    redirect_uri: import.meta.env.VITE_DOCUSIGN_REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  const authUrl = `https://account-d.docusign.com/oauth/auth?${params.toString()}`;
  window.location.href = authUrl;
};

const getDocuSignScopes = () => {
  const scopes = ["signature"];
  return scopes.join(" ");
};

export const generateCodeVerifier = () => {
  // Generate random bytes
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  // Convert to base64URL format
  return arrayBufferToBase64URL(array);
};

export const generateCodeChallenge = async (verifier) => {
  try {
    if (!verifier) {
      throw new Error("Code verifier is required");
    }

    // Convert verifier to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);

    // Hash the verifier using SHA-256
    const hash = await crypto.subtle.digest("SHA-256", data);

    // Convert hash to base64URL format
    return arrayBufferToBase64URL(hash);
  } catch (error) {
    console.error("Error generating code challenge:", error);
    throw error;
  }
};

const arrayBufferToBase64URL = (buffer) => {
  // Convert ArrayBuffer to base64
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

  // Convert base64 to base64URL
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

export const isValidCodeVerifier = (verifier) => {
  return Boolean(
    verifier &&
      typeof verifier === "string" &&
      verifier.length >= 43 &&
      verifier.length <= 128 &&
      /^[A-Za-z0-9\-._~]+$/.test(verifier)
  );
};
