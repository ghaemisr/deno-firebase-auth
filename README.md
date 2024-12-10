# Deno Firebase Auth
This is a sample repo to showcase the Deno deploy issue we're facing with Firebase Auth. This code works perfectly fine on local but deployed to deno deploy, it throws an error. You can find more information below with screenshots of the issue. 

# Local dev
To run the code, we need a valid Firebase service account key. You can use the `.env.template` file as a reference for the env variables required. 

Run `deno task dev` to start the code. This starts a Hono server with a simple `GET /parse-token` endpoint which takes in a Firebase session cookie and validates and decodes it to find the user email. To learn more about Firebase session cookies checkout [this document](https://firebase.google.com/docs/auth/admin/manage-cookies).

Here is a sample curl command and the response:
```bash
curl 'http://localhost:3000/parse-token' \
--header 'Authorization: Bearer your-session-token'
```
Sample resultL
```bash
{"email":"sara@fuelix.ai"}
```

# Deno deploy
I have this repo connected to a Deno deploy project in my personal account. I'm using the same service account key set in the environment variables and I'm also using the exact same session cookie for both tests.
Here is a sample curl reuqest:
```bash
curl 'https://saraghaemi-deno-fireba-72.deno.dev/parse-token' \
--header 'Authorization: Bearer your-session-cookie'
```
The response is 
```bash
{"error":"Invalid token"}%                                                                                
```
Full error message in the server logs:
```bash
Error verifying token: Error: Firebase session cookie has invalid signature. See https://firebase.google.com/docs/auth/admin/manage-cookies for details on how to retrieve a session cookie.
    at FirebaseTokenVerifier.mapJwtErrorToAuthError (file:///node_modules/.deno/firebase-admin@13.0.1/node_modules/firebase-admin/lib/auth/token-verifier.js:275:20)
    at file:///node_modules/.deno/firebase-admin@13.0.1/node_modules/firebase-admin/lib/auth/token-verifier.js:255:24
    at Object.runMicrotasks (ext:core/01_core.js:691:26)
    at processTicksAndRejections (ext:deno_node/_next_tick.ts:57:10)
    at runNextTicks (ext:deno_node/_next_tick.ts:75:3)
    at eventLoopTick (ext:core/01_core.js:182:21)
    at async Array.<anonymous> (file:///src/main.ts:41:27)
    at async ext:deno_http/00_serve.ts:369:18 {
  errorInfo: {
    code: "auth/argument-error",
    message: "Firebase session cookie has invalid signature. See https://firebase.google.com/docs/auth/admin/manage-cookies for details on how to retrieve a session cookie."
  },
  ['__proto__']: [Error],
  codePrefix: "auth"
}
```