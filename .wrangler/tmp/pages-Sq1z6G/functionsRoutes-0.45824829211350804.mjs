import { onRequestGet as __api_public_pages__slug__ts_onRequestGet } from "C:\\Users\\HomePC\\Desktop\\chuech studio\\website\\my-project\\functions\\api\\public\\pages\\[slug].ts"
import { onRequestGet as __api_public_collections_index_ts_onRequestGet } from "C:\\Users\\HomePC\\Desktop\\chuech studio\\website\\my-project\\functions\\api\\public\\collections\\index.ts"
import { onRequestGet as __api_public_home_ts_onRequestGet } from "C:\\Users\\HomePC\\Desktop\\chuech studio\\website\\my-project\\functions\\api\\public\\home.ts"
import { onRequestGet as __api_public_services_page_ts_onRequestGet } from "C:\\Users\\HomePC\\Desktop\\chuech studio\\website\\my-project\\functions\\api\\public\\services-page.ts"
import { onRequestGet as __api_public_site_ts_onRequestGet } from "C:\\Users\\HomePC\\Desktop\\chuech studio\\website\\my-project\\functions\\api\\public\\site.ts"
import { onRequestGet as __api_public_sitemap_xml_ts_onRequestGet } from "C:\\Users\\HomePC\\Desktop\\chuech studio\\website\\my-project\\functions\\api\\public\\sitemap.xml.ts"
import { onRequestGet as __api_public_work_page_ts_onRequestGet } from "C:\\Users\\HomePC\\Desktop\\chuech studio\\website\\my-project\\functions\\api\\public\\work-page.ts"
import { onRequest as __api_forms__source__ts_onRequest } from "C:\\Users\\HomePC\\Desktop\\chuech studio\\website\\my-project\\functions\\api\\forms\\[source].ts"
import { onRequestGet as __media___path___ts_onRequestGet } from "C:\\Users\\HomePC\\Desktop\\chuech studio\\website\\my-project\\functions\\media\\[[path]].ts"
import { onRequestGet as __robots_txt_ts_onRequestGet } from "C:\\Users\\HomePC\\Desktop\\chuech studio\\website\\my-project\\functions\\robots.txt.ts"

export const routes = [
    {
      routePath: "/api/public/pages/:slug",
      mountPath: "/api/public/pages",
      method: "GET",
      middlewares: [],
      modules: [__api_public_pages__slug__ts_onRequestGet],
    },
  {
      routePath: "/api/public/collections",
      mountPath: "/api/public/collections",
      method: "GET",
      middlewares: [],
      modules: [__api_public_collections_index_ts_onRequestGet],
    },
  {
      routePath: "/api/public/home",
      mountPath: "/api/public",
      method: "GET",
      middlewares: [],
      modules: [__api_public_home_ts_onRequestGet],
    },
  {
      routePath: "/api/public/services-page",
      mountPath: "/api/public",
      method: "GET",
      middlewares: [],
      modules: [__api_public_services_page_ts_onRequestGet],
    },
  {
      routePath: "/api/public/site",
      mountPath: "/api/public",
      method: "GET",
      middlewares: [],
      modules: [__api_public_site_ts_onRequestGet],
    },
  {
      routePath: "/api/public/sitemap.xml",
      mountPath: "/api/public",
      method: "GET",
      middlewares: [],
      modules: [__api_public_sitemap_xml_ts_onRequestGet],
    },
  {
      routePath: "/api/public/work-page",
      mountPath: "/api/public",
      method: "GET",
      middlewares: [],
      modules: [__api_public_work_page_ts_onRequestGet],
    },
  {
      routePath: "/api/forms/:source",
      mountPath: "/api/forms",
      method: "",
      middlewares: [],
      modules: [__api_forms__source__ts_onRequest],
    },
  {
      routePath: "/media/:path*",
      mountPath: "/media",
      method: "GET",
      middlewares: [],
      modules: [__media___path___ts_onRequestGet],
    },
  {
      routePath: "/robots.txt",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__robots_txt_ts_onRequestGet],
    },
  ]