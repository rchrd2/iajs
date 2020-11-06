/**
 * General purpose CORS proxy.
 * forked from: https://github.com/chebyrash/cors
 * Can be deployed to Cloudflare workers
 */
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response(`{"usage": "${url.origin}/<url>"}`);
    }

    function addResponseHeaders(response) {
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Cookie-Cors"
      );
    }

    let response;
    if (request.method == "OPTIONS") {
      response = new Response("");
      addResponseHeaders(response);
      return response;
    }

    const modifiedHeaders = { ...request.headers };
    if (request.headers.get("X-Cookie-Cors")) {
      modifiedHeaders["Cookie"] = request.headers.get("X-Cookie-Cors");
      delete modifiedHeaders["X-Cookie-Cors"];
    }

    response = await fetch(request.url.slice(url.origin.length + 1), {
      method: request.method,
      headers: modifiedHeaders,
      redirect: "follow",
      body: request.body,
    });

    response = new Response(response.body, response);
    addResponseHeaders(response);
    return response;
  } catch (e) {
    return new Response(e.stack || e, { status: 500 });
  }
}
