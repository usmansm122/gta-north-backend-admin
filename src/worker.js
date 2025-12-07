const ADMIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>GTA North – Backend Admin v1</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      --red-main: #e30613;
      --bg-light: #f9f9f9;
      --card-bg: #ffffff;
      --text-main: #222222;
    }
    * {
      box-sizing: border-box;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      background: var(--bg-light);
      color: var(--text-main);
    }
    header {
      background: var(--red-main);
      color: #fff;
      padding: 16px 20px;
      text-align: center;
    }
    header h1 {
      margin: 0;
      font-size: 1.4rem;
      letter-spacing: 0.03em;
    }
    header p {
      margin: 4px 0 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    main {
      max-width: 960px;
      margin: 16px auto 32px;
      padding: 0 12px;
    }
    .card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
    }
    .card h2 {
      margin: 0 0 8px;
      font-size: 1.1rem;
    }
    .card p {
      margin: 0 0 8px;
      font-size: 0.9rem;
    }
    label {
      font-size: 0.9rem;
      font-weight: 600;
      display: block;
      margin-bottom: 4px;
    }
    input[type="file"] {
      display: block;
      width: 100%;
      padding: 6px 0;
      font-size: 0.9rem;
    }
    button {
      border: none;
      border-radius: 999px;
      padding: 8px 18px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      background: var(--red-main);
      color: #fff;
      margin-top: 8px;
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .tagline {
      font-size: 0.78rem;
      opacity: 0.85;
    }
    footer {
      text-align: center;
      font-size: 0.75rem;
      color: #666;
      margin: 16px 0 24px;
    }
  </style>
</head>
<body>
  <header>
    <h1>GTA North – Central Catalog Admin</h1>
    <p>Backend v1 – foundation for SKUs, cost, GP & store tools</p>
  </header>
  <main>
    <section class="card">
      <h2>Health check</h2>
      <p class="tagline">
        Quick way to see if the backend is alive from any store phone / iPad.
      </p>
      <button id="ping-btn">Ping /api/health</button>
      <p id="ping-result" style="margin-top:8px;font-size:0.85rem;"></p>
    </section>

    <section class="card">
      <h2>Bulk SKU Upload (coming soon)</h2>
      <p class="tagline">
        This is where you’ll upload CSVs with SKUs, cost, GP and other fields for the whole region.
      </p>
      <label for="csv-file">CSV file</label>
      <input id="csv-file" type="file" accept=".csv" disabled />
      <button disabled>Upload to D1 (disabled in v1)</button>
      <p style="font-size:0.8rem;margin-top:6px;">
        In the next step, we’ll wire this into a Cloudflare D1 database and turn it on.
      </p>
    </section>
  </main>
  <footer>
    Made by Moe Shahid – GTA North
  </footer>

  <script>
    const btn = document.getElementById("ping-btn");
    const txt = document.getElementById("ping-result");

    btn.addEventListener("click", async () => {
      txt.textContent = "Pinging…";
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        txt.textContent = "Status: " + data.status + " | Time: " + data.time;
      } catch (err) {
        txt.textContent = "Error: " + err.message;
      }
    });
  </script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Simple JSON health endpoint
    if (pathname === "/api/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          time: new Date().toISOString(),
          service: "gta-north-backend-admin",
        }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    }

    // Test that D1 binding works
    if (pathname === "/api/test-db") {
      try {
        const row = await env.DB.prepare("SELECT datetime('now') as now;").first();
        return new Response(JSON.stringify({ ok: true, row }), {
          headers: { "content-type": "application/json" },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ ok: false, error: String(err) }),
          {
            status: 500,
            headers: { "content-type": "application/json" },
          }
        );
      }
    }

    // Admin panel UI
    if (pathname === "/admin") {
      return new Response(ADMIN_HTML, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    // Default root response
    return new Response(
      "GTA North Backend + Admin – Worker online (try /admin, /api/health or /api/test-db)",
      {
        headers: { "content-type": "text/plain" },
      }
    );
  },
};
