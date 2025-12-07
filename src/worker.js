export default {
  async fetch(request, env, ctx) {
    return new Response("GTA North Backend + Admin – backend stub is running ✅", {
      headers: { "content-type": "text/plain" },
    });
  },
};
