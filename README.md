# Motion Woods Website — Deploy & Maintain

## Structure (20 URLs)
```
/                                   Home
/about                              Story, vision, leadership (Person schema)
/services                           Services hub
/wooden-door-manufacturer-pune      Service: doors (kept existing slug)
/furniture-manufacturer-pune        Service: furniture
/interior-furnishing-contractor-pune Service: interiors (kept existing slug)
/carpentry-contractor-pune          Service: carpentry
/wood-polishing-finishing-pune      Service: finishing
/builder-door-supplier-pune         Service: builder/township contracts
/projects                           Portfolio (legacy-credited)
/clients                            Client roster + testimonials
/faq                                AEO hub (FAQPage schema, 16 Q&As)
/contact                            NAP + WhatsApp enquiry form
/blog                               Blog index
/blog/<6 posts>                     Articles with Article + FAQPage schema
sitemap.xml · robots.txt · llms.txt · vercel.json
```

## Deploy
1. Copy everything in this `website/` folder into your GitHub repo root (replace old files).
2. Commit + push. Vercel auto-deploys. `vercel.json` enables clean URLs and redirects the old blog URL.

## Before/after launch — do these
- [x] **Email**: admin@motionwoods.com is live on all pages, schema and llms.txt (updated 2026-07-10).
- [ ] **Images**: drop real project photos into /assets/img/ and add them to projects/home. Real site photos outperform stock for trust AND SEO. Add a logo.png (referenced by schema).
- [ ] **Google Business Profile**: create it for the FACTORY at Jambe, near Punawale (a real premises customers/builders can visit photographs well) — biggest local-SEO lever. Category: Door manufacturer / Furniture manufacturer.
- [ ] **Google Search Console**: verify domain, submit sitemap.xml.
- [ ] **Exact addresses**: schema uses Hadapsar 411028 (registered office) + Jambe near Punawale (factory, no street address yet). Add the factory's full plot address, pincode and lat/long when ready — needed for Google Business Profile too.
- [ ] **Blog cadence**: 1 post/month minimum. Next topics: teak vs engineered wood cost guide, acoustic doors for offices, school furniture buying guide.

## SEO/AEO/GEO already built in
- Unique title/meta/canonical/OG on all 20 pages; Organization + LocalBusiness + Service + FAQPage + Article + Person + Breadcrumb JSON-LD.
- FAQ blocks with schema on every service page + 16-question FAQ hub (what AI Overviews/ChatGPT cite).
- llms.txt + AI-crawler-friendly robots.txt (GPTBot, ClaudeBot, PerplexityBot explicitly allowed).
- Legacy framing throughout: experience attributed to Diwakar Furniture → verifiable, no false company-age claims.
