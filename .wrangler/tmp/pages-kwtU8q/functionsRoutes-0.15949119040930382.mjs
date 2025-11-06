import { onRequest as __api_pages___path___js_onRequest } from "/Users/okashikami/Repos/BethanySDAWebsite/functions/api/pages/[[path]].js"
import { onRequest as __api_settings___path___js_onRequest } from "/Users/okashikami/Repos/BethanySDAWebsite/functions/api/settings/[[path]].js"
import { onRequestDelete as __api_media_js_onRequestDelete } from "/Users/okashikami/Repos/BethanySDAWebsite/functions/api/media.js"
import { onRequestGet as __api_media_js_onRequestGet } from "/Users/okashikami/Repos/BethanySDAWebsite/functions/api/media.js"
import { onRequestPost as __api_upload_js_onRequestPost } from "/Users/okashikami/Repos/BethanySDAWebsite/functions/api/upload.js"
import { onRequest as __api_reset_website_js_onRequest } from "/Users/okashikami/Repos/BethanySDAWebsite/functions/api/reset-website.js"

export const routes = [
    {
      routePath: "/api/pages/:path*",
      mountPath: "/api/pages",
      method: "",
      middlewares: [],
      modules: [__api_pages___path___js_onRequest],
    },
  {
      routePath: "/api/settings/:path*",
      mountPath: "/api/settings",
      method: "",
      middlewares: [],
      modules: [__api_settings___path___js_onRequest],
    },
  {
      routePath: "/api/media",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_media_js_onRequestDelete],
    },
  {
      routePath: "/api/media",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_media_js_onRequestGet],
    },
  {
      routePath: "/api/upload",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_upload_js_onRequestPost],
    },
  {
      routePath: "/api/reset-website",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_reset_website_js_onRequest],
    },
  ]