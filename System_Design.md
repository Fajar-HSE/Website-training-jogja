# Training Jogja - Website System Design

Version: 1.0

Last Updated: June 2026

Owner: Training Jogja

---

## 1. Project Overview

### Objective

Membangun ulang website Training Jogja menjadi platform digital B2B yang berfungsi sebagai:

* Lead generation engine
* Knowledge hub K3 & Environment
* Media edukasi regulasi
* Platform konsultasi perusahaan
* Aset SEO, GEO, dan AIO jangka panjang

---

## 2. Business Goals

### Primary Goals

* Meningkatkan organic traffic berkualitas
* Meningkatkan jumlah consultation request
* Memperkuat topical authority bidang K3 & Environment
* Meningkatkan visibilitas pada AI Search Engine
* Meningkatkan conversion rate pengunjung B2B

### Key Metrics

| Metric                   | Target               |
| ------------------------ | -------------------- |
| Organic Traffic          | +100% dalam 12 bulan |
| Consultation Leads       | +50%                 |
| Bounce Rate              | < 40%                |
| Average Session Duration | > 3 menit            |
| Core Web Vitals          | Good                 |
| Indexed Pages            | > 500 halaman        |

---

## 3. Technology Stack

### Frontend

* Next.js 15+
* React 19
* TypeScript
* Tailwind CSS
* Shadcn UI
* Framer Motion

### Backend CMS

* WordPress (Headless CMS)
* Advanced Custom Fields Pro
* Custom Post Type UI
* WordPress REST API
* Yoast SEO / Rank Math

### Infrastructure

| Layer              | Technology         |
| ------------------ | ------------------ |
| Frontend Hosting   | Vercel             |
| CMS Hosting        | Shared Hosting     |
| CDN                | Cloudflare         |
| DNS                | Cloudflare         |
| Image Optimization | Next Image         |
| Analytics          | Google Analytics 4 |
| Heatmap            | Microsoft Clarity  |

---

## 4. High-Level Architecture

```text
Users
  │
  ▼
Cloudflare CDN
  │
  ▼
Next.js Frontend (Vercel)
  │
  ├── REST API
  │
  ▼
WordPress Headless CMS
  │
  ├── Articles
  ├── Training Programs
  ├── Solutions
  ├── Industries
  ├── Regulations
  ├── FAQ
  └── Case Studies
```

---

## 5. Content Architecture

### Core Pages

```text
/
├── tentang-kami
├── solusi
├── program
├── industri
├── resource-center
├── studi-kasus
├── kontak
└── konsultasi
```

---

### Solution Pages

```text
/solusi/smk3
/solusi/iso-14001
/solusi/iso-45001
/solusi/pengelolaan-limbah-b3
/solusi/esg
```

---

### Program Pages

```text
/pelatihan/ahli-k3-umum
/pelatihan/operator-forklift
/pelatihan/petugas-k3-kimia
/pelatihan/iso-14001
```

---

### Industry Pages

```text
/industri/manufaktur
/industri/konstruksi
/industri/pertambangan
/industri/rumah-sakit
/industri/perhotelan
```

---

### Resource Center

```text
/artikel
/regulasi
/studi-kasus
/glossary
/checklist
/faq
```

---

## 6. WordPress Content Model

### Custom Post Types

| CPT         | Purpose           |
| ----------- | ----------------- |
| article     | Artikel SEO       |
| training    | Program pelatihan |
| solution    | Solusi bisnis     |
| industry    | Halaman industri  |
| regulation  | Regulasi          |
| glossary    | Istilah K3        |
| faq         | Pertanyaan umum   |
| case-study  | Studi kasus       |
| testimonial | Testimoni         |
| trainer     | Profil trainer    |

---

### Taxonomies

| Taxonomy        | Applied To        |
| --------------- | ----------------- |
| category        | article           |
| tag             | article           |
| sector          | training, article |
| regulation-type | regulation        |
| certification   | training          |
| industry        | solution, article |

---

## 7. SEO Architecture

### URL Structure

```text
/pelatihan/[slug]
/solusi/[slug]
/industri/[slug]
/artikel/[slug]
/regulasi/[slug]
/glossary/[slug]
/studi-kasus/[slug]
```

### Technical SEO

* XML Sitemap otomatis
* robots.txt dinamis
* Canonical URL
* Breadcrumb
* Open Graph
* Twitter Card
* Dynamic metadata
* Pagination SEO
* Internal linking automation

---

## 8. GEO Strategy

### Entity Optimization

#### Organization Entity

* Nama perusahaan
* NIB
* Alamat
* Nomor telepon
* Akreditasi
* Sertifikasi

#### Trainer Entity

* Nama lengkap
* Jabatan
* Sertifikasi
* Pengalaman

#### Regulation Entity

* Nomor regulasi
* Instansi penerbit
* Tanggal berlaku

---

### Structured Data

Implementasikan:

* Organization
* LocalBusiness
* Course
* Article
* FAQPage
* BreadcrumbList
* Person
* Event
* Review

---

## 9. AIO Strategy

Setiap halaman wajib menjawab:

* Apa?
* Mengapa?
* Siapa?
* Kapan?
* Di mana?
* Bagaimana?
* Berapa biaya?
* Apa risikonya?

### Content Format

* Ringkasan
* Bullet points
* Tabel
* FAQ
* Checklist
* Studi kasus

---

## 10. Frontend Design System

### Design Principles

```text
Trust → Clarity → Conversion
```

---

### Color Palette

#### Primary

```text
#123458
```

#### Secondary

```text
#2F6B3B
```

#### Accent

```text
#F59E0B
```

#### Background

```text
#F8FAFC
```

#### Text

```text
#1E293B
```

---

### Typography

#### Heading

Plus Jakarta Sans

#### Body

Inter

---

### Layout

* Grid: 12 columns
* Max width: 1280px
* Content width: 720px
* Section spacing: 96px

---

### Visual Guidelines

Gunakan:

* Foto trainer asli
* Dokumentasi pelatihan
* Dokumentasi audit
* Foto lapangan

Hindari:

* Ilustrasi AI
* Foto stok generik
* Gradien berlebihan

---

## 11. Animation Guidelines

### Allowed

* Fade in
* Slide up
* Hover transition
* Counter animation

### Duration

```text
200ms - 350ms
```

### Avoid

* Scroll hijacking
* Parallax berlebihan
* Auto carousel
* Efek glassmorphism

---

## 12. Core Web Vitals Targets

| Metric | Target  |
| ------ | ------- |
| LCP    | < 2.5s  |
| INP    | < 200ms |
| CLS    | < 0.1   |

### Optimization Strategy

* ISR (Incremental Static Regeneration) untuk konten semi-dinamis
* SSG (Static Site Generation) untuk konten evergreen
* On-Demand Revalidation via WordPress webhook saat publish/update
* CDN (Cloudflare) untuk static assets dan edge caching
* Lazy loading untuk gambar dan komponen non-critical
* Image optimization via Next Image
* Parameter `_fields` untuk membatasi data yang diambil per halaman
* Edge caching untuk mengurangi beban server WordPress

### Content Rendering Matrix

| Tipe Konten              | Strategi | Revalidasi        |
| ------------------------ | -------- | ----------------- |
| Halaman Solusi           | SSG      | On-Demand         |
| Halaman Industri         | SSG      | On-Demand         |
| Glossary / FAQ           | SSG      | On-Demand         |
| Artikel                  | ISR      | 6 jam             |
| Regulasi                 | ISR      | 6 jam             |
| Studi Kasus              | ISR      | 12 jam            |
| Beranda                  | ISR      | 1 jam             |
| Search / Form Konsultasi | CSR      | Realtime          |

---

## 13. Lead Generation Flow

```text
Visitor
  │
  ▼
Educational Content
  │
  ▼
Solution Page
  │
  ▼
Case Study
  │
  ▼
Consultation Form
  │
  ▼
CRM
```

---

## 14. Conversion Elements

* Sticky CTA
* WhatsApp button
* Consultation form
* Download company profile
* Testimonial slider
* Client logo section
* FAQ section

---

## 15. Security

* Cloudflare WAF
* Rate limiting
* Hide WordPress login URL
* Disable XML-RPC
* Daily backup
* 2FA administrator

---

## 16. Monitoring

### SEO

* Google Search Console
* Bing Webmaster Tools

### Analytics

* GA4
* Microsoft Clarity

### Performance

* Vercel Analytics
* Lighthouse CI

### Error Tracking

* Sentry

---

## 17. Development Roadmap

### Phase 1

* Content audit
* SEO audit
* Information architecture

### Phase 2

* Design system
* Wireframe
* UI design

### Phase 3

* WordPress setup
* CPT development
* REST API endpoints configuration

### Phase 4

* Next.js development
* API integration
* Schema implementation

### Phase 5

* Content migration
* Redirect mapping
* Testing

### Phase 6

* Go live
* Monitoring
* Continuous optimization

```
```
