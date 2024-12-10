import {
  cert,
  initializeApp,
} from "@firebase-admin/app";
import { getAuth } from "@firebase-admin/auth";
import { Context, Hono } from "@hono";

const base64ServiceAccount = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_KEY");
if (!base64ServiceAccount) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set",
  );
}

const serviceAccount = JSON.parse(atob(base64ServiceAccount));

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

//simple hono app
const app = new Hono();

// Define a get endpoint to parse the token
app.get("/parse-token", async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        { error: "Authorization header missing or malformed" },
        401,
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the token and decode it
    const decodedClaims = await getAuth().verifySessionCookie(token, true);

    if (!decodedClaims.email) {
      return c.json({ error: "Email not found in the token" }, 400);
    }

    // Return the email found in the token
    return c.json({ email: decodedClaims.email });
  } catch (error) {
    console.error("Error verifying token:", error);
    return c.json({ error: "Invalid token" }, 401);
  }
});

// Start the Hono app
const port = 3000;
Deno.serve({ port }, app.fetch);