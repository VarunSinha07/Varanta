import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** the base url of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
    session: {
        // Ensure role is included in the session
        transform: (session: { user?: { role?: string } }) => ({
          ...session,
          role: session.user?.role // Make sure your auth server includes role
        })
    }
})

export const { signIn, signUp, useSession } = createAuthClient()