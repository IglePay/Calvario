/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: "https://iglepay.com",
    generateRobotsTxt: true,
    sitemapSize: 5000,
    changefreq: "monthly",
    priority: 0.7,
    exclude: ["/control/*", "/register", "/forbidden", "/api/*"],
    robotsTxtOptions: {
        additionalSitemaps: ["https://iglepay.com/sitemap.xml"],
        policies: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/control", "/register", "/api"],
            },
        ],
    },
}

export default config
