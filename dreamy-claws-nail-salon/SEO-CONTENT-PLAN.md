# Dreamy Claws Nail Studio — SEO / AEO Content Plan

Companion reference for `index.html` / `blog/index.html`. All business details (name, address, phone, prices, socials) are placeholders — replace them with real data before publishing, and update the JSON-LD blocks in both HTML `<head>` sections to match.

## 1. Information Architecture / Sitemap
```
/ (Home)
  #about, #services, #pricing, #gallery, #reviews, #faq, #contact, #book
/blog/            (50 article ideas, 6 topic clusters)
```
Single-page site by design (simple to host/maintain); each service is a `<details>` accordion with its own anchor (`#svc-manicures`, `#svc-gelx`, etc.) so it can be deep-linked and indexed as a distinct on-page entity. Promote high-traffic services (Gel-X, BIAB, Bridal) to standalone pages once organic traffic justifies it.

## 2. Internal Linking Plan
- Each service card links to 2 related services ("Related:" row).
- Hero and CTA band point to `#book`; nav and footer repeat all primary sections.
- Blog index links back to homepage sections relevant to each cluster (bridal cluster → `#svc-bridal`, product education → relevant service anchors) — wire these up once individual posts exist.

## 3. Schema (JSON-LD) Implemented
- `BeautySalon` (LocalBusiness subtype) with NAP, geo, hours, `sameAs`, `aggregateRating` — homepage `<head>`.
- `WebSite` — homepage `<head>`.
- `FAQPage` — homepage `<head>`, mirrors the visible FAQ section exactly.
- `BreadcrumbList` — blog index `<head>`.

**Still to add as content grows:** `Service` markup per offering, `Review` items nested under `aggregateRating`, `BlogPosting` on each published article, `Organization` if the brand expands beyond one location.

## 4. Target Keywords (starter list)
Primary: nail salon Austin TX, Gel-X Austin, BIAB nails Austin, Russian manicure Austin, bridal nails Austin.
Secondary/long-tail: how long do Gel-X nails last, BIAB vs acrylic, gel manicure cost Austin, nail salon South Congress, walk-in nail salon Austin.
Use exact-match phrasing in H1/H2s, meta descriptions, and FAQ questions (already reflected in current copy).

## 5. Local SEO Checklist
- [ ] Claim/verify Google Business Profile; match NAP exactly to site footer and JSON-LD.
- [ ] Embed real Google Maps iframe in the `.map-frame` placeholder.
- [ ] Add the salon to Apple Maps, Bing Places, Yelp, and relevant local directories with identical NAP.
- [ ] Collect and periodically refresh real reviews; update `aggregateRating` counts truthfully.
- [ ] Add city/neighborhood mentions naturally in service copy (already seeded: Zilker, South Congress, Travis Heights).

## 6. Technical SEO Checklist
- [ ] Replace all placeholder URLs/domains (`dreamyclawsnails.com`) with the live domain.
- [ ] Add real Open Graph image (`assets/og-cover.jpg`) sized 1200×630.
- [ ] Compress and lazy-load real gallery/service photography once added (replace CSS gradient placeholders).
- [ ] Add a favicon set (`/favicon.ico`, `apple-touch-icon.png`).
- [ ] Verify Core Web Vitals after adding real images/fonts; self-host fonts if render-blocking becomes an issue.
- [ ] Add HTTPS + www/non-www redirect at hosting layer; confirm canonical tags match final host.
- [ ] Extend `sitemap.xml` as new pages/posts are published; submit to Google Search Console.

## 7. Accessibility Checklist (WCAG 2.2 AA)
- [x] Skip-to-content link, semantic landmarks (`header`, `main`, `footer`, `nav`).
- [x] Accordions built with native `<details>/<summary>` (keyboard + screen-reader operable).
- [x] Visible focus states on all interactive elements; 3px focus outline.
- [x] Color contrast: body text on cream background and white cards meets AA; verify final palette if colors change.
- [ ] Add real, descriptive `alt` text once photography replaces the CSS gradient placeholders (currently using `role="img"` + `aria-label` on placeholders).
- [ ] Run an automated audit (axe, Lighthouse) plus manual keyboard-only pass before launch.

## 8. Launch Checklist
- [ ] Swap every placeholder business variable (name, address, phone, email, hours, socials, prices).
- [ ] Connect the booking form (`#bookForm`) to a real provider (Vagaro, Fresha, Square Appointments, Boulevard) or replace with their embed/widget.
- [ ] Replace gallery/hero/about gradient placeholders with real, optimized photography.
- [ ] Update all JSON-LD blocks to match final live data exactly (schema must mirror visible content).
- [ ] Proofread pricing against actual price list.
- [ ] Test on mobile, tablet, and desktop breakpoints; test the hamburger nav and all accordions.

## 9. Blog Content Calendar
Full 50-idea list, grouped into Nail Care, Nail Trends, Bridal Nails, Seasonal Designs, Product Education, and Maintenance Tips, lives at `blog/index.html`. Publish roughly one article per week, prioritizing the Product Education and Nail Care clusters first (highest AEO/voice-search value: "what is," "how long does," "difference between" queries).

## 10. Ongoing SEO/AEO Recommendations
- Turn each FAQ answer into its own short-form video/reel script — strong AEO overlap with voice search phrasing already used on-site.
- Publish real before/after photography monthly; user-generated content from tagged Instagram posts strengthens local trust signals.
- Request Google reviews immediately after checkout via a QR code at the front desk; respond to every review to reinforce E-E-A-T signals.
- Once 5+ blog posts are live, build a `Service` + `BlogPosting` internal linking mesh (each service page links to its 1–2 most relevant articles and vice versa).
- Track "near me" and voice-search queries in Search Console's Queries report quarterly; adjust FAQ wording to match actual phrasing customers use.
