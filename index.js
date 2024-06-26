const version = "0.0.1"

let allowedDomains = process?.env?.ALLOWED_REMOTE_DOMAINS?.split(",") || ["*"];
let allowedWidths = process?.env?.ALLOWED_WIDTHS?.split(",") || ["*"];
let allowedHeights = process?.env?.ALLOWED_HEIGHTS?.split(",") || ["*"];
let allowedQualities = process?.env?.ALLOWED_QUALITIES?.split(",") || ["*"];
let imgproxyUrl = process?.env?.IMGPROXY_URL || "http://imgproxy:8080";
if (process.env.NODE_ENV === "development") {
    imgproxyUrl = "http://localhost:8888"
}
allowedDomains = allowedDomains.map(d => d.trim());

Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/") {
            return new Response(`<h3>Next Image Transformation Enhanced v${version}</h3>More info <a href="https://github.com/ArchangelGCA/next-image-transformation-enhanced">https://github.com/ArchangelGCA/next-image-transformation-enhanced</a>.`, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }
        if (url.pathname === "/health") return new Response("OK");
        if (url.pathname.startsWith("/image/")) return await resize(url);
        return Response.redirect("https://github.com/ArchangelGCA/next-image-transformation-enhanced", 302);
    }
});

async function resize(url) {
    const preset = "pr:sharp"
    const src = url.pathname.split("/").slice(2).join("/");
    const origin = new URL(src).hostname;
    const allowed = allowedDomains.filter(domain => {
        if (domain === "*") return true;
        if (domain === origin) return true;
        return domain.startsWith("*.") && origin.endsWith(domain.split("*.").pop());
    })
    if (allowed.length === 0) return new Response(`Domain (${origin}) not allowed. More details here: https://github.com/ArchangelGCA/next-image-transformation-enhanced`, { status: 403 });
    const width = url.searchParams.get("width") || 0;
    const allowedWidth = allowedWidths.filter(w => {
        if (w === "*") return true;
        if (width === 0) return true;
        return w === width;
    })
    if (allowedWidth.length === 0) return new Response(`Width (${width}) not allowed. More details here: https://github.com/ArchangelGCA/next-image-transformation-enhanced`, { status: 403 });
    const height = url.searchParams.get("height") || 0;
    const allowedHeight = allowedHeights.filter(h => {
        if (h === "*") return true;
        if (height === 0) return true;
        return h === height;
    })
    if (allowedHeight.length === 0) return new Response(`Height (${height}) not allowed. More details here: https://github.com/ArchangelGCA/next-image-transformation-enhanced`, { status: 403 });
    const quality = url.searchParams.get("quality") || 75;
    const allowedQuality = allowedQualities.filter(q => {
        if (q === "*") return true;
        if (quality === 75) return true;
        return q === quality;
    })
    if (allowedQuality.length === 0) return new Response(`Quality (${quality}) not allowed. More details here: https://github.com/ArchangelGCA/next-image-transformation-enhanced`, { status: 403 });
    try {
        const url = `${imgproxyUrl}/${preset}/resize:fill:${width}:${height}/q:${quality}/plain/${src}`
        const image = await fetch(url, {
            headers: {
                "Accept": "image/avif,image/webp,image/apng,*/*",
            }
        })
        const headers = new Headers(image.headers);
        headers.set("Server", "NextImageTransformation");
        return new Response(image.body, {
            headers
        })
    } catch (e) {
        console.log(e)
        return new Response("Error resizing image")
    }
}