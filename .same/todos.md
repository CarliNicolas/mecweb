# MECSA Clone - Project Todos

## Completed
- [x] Initialize project with Next.js + shadcn
- [x] Create layout with fonts and global styles
- [x] Build navigation header component
- [x] Build hero carousel section
- [x] Build company intro section
- [x] Build "Somos Fabricantes" section
- [x] Build products/services grid
- [x] Build sectors grid (Rubros Gestionados)
- [x] Build "Climatización Evaporativa" section
- [x] Build photo gallery with lightbox
- [x] Build footer
- [x] Download and configure local images
- [x] Add carousel animations
- [x] Add WhatsApp floating button
- [x] Add Framer Motion scroll animations
- [x] Create Contact page with form
- [x] Create individual product detail pages (5 products)
- [x] Deploy to production
- [x] Add multi-language support (Spanish/English)
- [x] Integrate Resend email service for contact form
- [x] Create admin dashboard with authentication
- [x] Fix non-functional buttons
- [x] Make sector cards clickable
- [x] Create News Section
- [x] Add News Management to Admin Dashboard
- [x] **Connect CMS Admin to Site Components**
  - [x] Created SiteContentContext for dynamic data
  - [x] Public API endpoint to read site content
  - [x] Updated HeroCarousel to use dynamic slides
  - [x] Updated CompanyIntro to use dynamic content
  - [x] Updated Fabricantes to use dynamic content
  - [x] Updated ProductsGrid to use dynamic products
  - [x] Updated SectorsGrid to use dynamic sectors
  - [x] Updated ClimatizacionInfo to use dynamic content
  - [x] Updated PhotoGallery to use dynamic images
  - [x] Updated Footer to use dynamic social links
  - [x] Updated WhatsAppButton to use dynamic number
  - [x] Completed all admin sections (intro, fabricantes, climatización, galería, contacto)
  - [x] Added image preview functionality in admin
  - [x] Added ability to add/remove gallery images

## How It Works
1. Admin edits content at `/admin` (login: admin/admin)
2. Content is saved to `/src/data/site-content.json`
3. Frontend components read from this JSON via SiteContentContext
4. Changes reflect immediately on page refresh

## Configuration Notes
- **Admin Login**: `/admin/login` - User: `admin`, Password: `admin`
- **Language Switch**: Click globe icon in header to switch ES/EN
- **Email Service**: Add `RESEND_API_KEY` environment variable in production
- **Contact Email**: Set `CONTACT_EMAIL` env var for form submissions
- **CMS**: All site content editable from admin panel

## Potential Future Enhancements
- [ ] Newsletter subscription integration
- [ ] SEO metadata for news articles
- [ ] RSS feed for news
- [ ] Image upload functionality (instead of URL)
- [ ] Preview changes before saving
- [ ] Content versioning/history
