import { createAuthClient } from "better-auth/react"

// Get the base URL dynamically
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use current path
    return window.location.origin;
  }
  // SSR should use vercel url
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback to localhost
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  /** the base url of the server */
  baseURL: getBaseUrl()
})

export const signIn = authClient.signIn
export const signUp = authClient.signUp
export const useSession = authClient.useSession