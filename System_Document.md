# System Requirement Document (SRD)

# Project Redesign Website Training Jogja

Version: 1.0

Last Updated: June 2026

Owner: Training Jogja

---

# 1. Executive Summary

## Background

Website Training Jogja saat ini menggunakan WordPress monolith pada shared hosting.

Permasalahan utama:

* Kecepatan website belum optimal
* Sulit memenuhi standar Core Web Vitals
* Struktur konten belum mendukung SEO, GEO, dan AIO
* User experience belum sesuai kebutuhan B2B
* Sulit membangun topical authority K3 & Environment
* Konversi konsultasi perusahaan belum optimal

Untuk mengatasi masalah tersebut, website akan direstrukturisasi menggunakan arsitektur Headless CMS.

## Proposed Solution

* Frontend menggunakan Next.js
* Backend CMS tetap menggunakan WordPress
* WordPress berfungsi sebagai content management system
* Frontend mengambil data melalui REST API

---

# 2. Business Objectives

## Primary Objectives

* Menjadi referensi utama K3 dan Environment di Indonesia
* Meningkatkan organic lead perusahaan
* Meningkatkan brand authority
* Mempermudah pengelolaan konten oleh tim marketing

## Success Metrics

| KPI                      | Target    |
| ------------------------ | --------- |
| Organic Traffic          | +100%     |
| Consultation Leads       | +50%      |
| Average Session Duration | > 3 menit |
| Core Web Vitals          | Good      |
| Bounce Rate              | < 40%     |

---

# 3. Scope

## In Scope

* Redesign website
* Migrasi ke arsitektur headless
* Pengembangan frontend Next.js
* Integrasi WordPress CMS
* Implementasi SEO teknis
* Implementasi schema markup
* Optimasi GEO
* Optimasi AIO
* Migrasi konten lama
* Setup analytics

## Out of Scope

* Mobile application
* Learning Management System
* Sistem pembayaran online
* Sistem e-learning
* Marketplace pelatihan

---

## 3.1 Technology Stack

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
* WPGraphQL
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

## 3.2 High-Level Architecture

```text
Users
    │
    ▼
Cloudflare CDN
    │
    ▼
Next.js Frontend (Vercel)
    │
    ├── GraphQL API
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

## 3.3 Content Architecture

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

## 3.4 WordPress Content Model

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

## 3.5 SEO Architecture

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

## 3.6 GEO Strategy

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

## 3.7 AIO Strategy

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

## 3.8 Frontend Design System

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

## 3.9 Animation Guidelines

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

## 3.10 Core Web Vitals Targets

| Metric | Target  |
| ------ | ------- |
| LCP    | < 2.5s  |
| INP    | < 200ms |
| CLS    | < 0.1   |

### Optimization Strategy

* ISR
* SSG
* CDN
* Lazy loading
* Image optimization

---

## 3.11 Lead Generation Flow

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

## 3.12 Conversion Elements

* Sticky CTA
* WhatsApp button
* Consultation form
* Download company profile
* Testimonial slider
* Client logo section
* FAQ section

---

## 3.13 Security

* Cloudflare WAF
* Rate limiting
* Hide WordPress login URL
* Disable XML-RPC
* Daily backup
* 2FA administrator

---

## 3.14 Monitoring

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


# 4. Target Audience

## Primary Audience

### HR Department

Kebutuhan:

* Pelatihan karyawan
* Sertifikasi kompetensi
* Kepatuhan regulasi

### HSE Department

Kebutuhan:

* Implementasi K3
* Audit internal
* Kepatuhan regulasi

### Procurement

Kebutuhan:

* Vendor pelatihan
* Efisiensi biaya

### Management

Kebutuhan:

* Pengurangan risiko
* Kepatuhan hukum
* ESG

---

# 5. User Personas

## Persona 1

Nama: HSE Manager

Goals:

* Memenuhi regulasi K3
* Mengurangi risiko kecelakaan kerja

Pain Points:

* Sulit mencari vendor terpercaya
* Informasi regulasi tersebar

---

## Persona 2

Nama: HR Manager

Goals:

* Menyusun program pelatihan

Pain Points:

* Kesulitan memilih pelatihan yang sesuai

---

## Persona 3

Nama: Direktur Operasional

Goals:

* Menurunkan risiko bisnis

Pain Points:

* Minim waktu untuk riset vendor

---

# 6. User Journey

```text
Awareness
    │
    ▼
Artikel / Regulasi
    │
    ▼
Halaman Solusi
    │
    ▼
Studi Kasus
    │
    ▼
Konsultasi
    │
    ▼
Proposal
    │
    ▼
Closing
```

---

# 7. Functional Requirements

## Content Management

Admin harus dapat:

* Membuat artikel
* Mengedit artikel
* Menghapus artikel
* Mengelola media
* Menjadwalkan publikasi

---

## Lead Management

Pengguna harus dapat:

* Mengisi formulir konsultasi
* Menghubungi WhatsApp
* Mengunduh company profile

---

## Search

Pengguna harus dapat:

* Mencari artikel
* Mencari program
* Mencari regulasi

---

## Filtering

Pengguna harus dapat memfilter:

* Industri
* Kategori pelatihan
* Sertifikasi
* Regulasi

---

# 8. Non-Functional Requirements

## Performance

* LCP < 2.5 detik
* INP < 200 ms
* CLS < 0.1

---

## Availability

* Uptime minimum 99.5%

---

## Security

* HTTPS
* WAF
* Backup harian
* Two-factor authentication

---

## Scalability

Sistem harus mampu menangani:

* 100.000 pageviews per bulan
* 500 halaman konten
* 50 pengguna admin

---

# 9. Information Architecture

## Main Navigation

```text
Beranda
├── Solusi
├── Program
├── Industri
├── Resource Center
├── Tentang Kami
└── Konsultasi
```

---

## Resource Center

```text
Resource Center
├── Artikel
├── Regulasi
├── Studi Kasus
├── FAQ
├── Glossary
└── Checklist
```

---

# 10. Content Strategy

## Topic Cluster

Pillar:

* SMK3
* ISO 14001
* ISO 45001
* Limbah B3
* ESG

Cluster:

* Regulasi
* Checklist
* Implementasi
* Studi kasus
* FAQ

---

# 11. SEO Requirements

* Sitemap XML
* robots.txt
* Canonical URL
* Breadcrumb
* Internal linking
* Redirect 301
* Structured data
* Open Graph

---

# 12. GEO Requirements

Setiap halaman harus memiliki:

* Entity yang jelas
* Author profile
* FAQ
* Referensi regulasi
* Structured content

---

# 13. AIO Requirements

Konten harus:

* Mudah diringkas AI
* Menggunakan heading yang jelas
* Menggunakan bullet points
* Menjawab pertanyaan pengguna

---

# 14. Analytics Requirements

Tools:

* Google Analytics 4
* Google Search Console
* Microsoft Clarity
* Vercel Analytics

Dashboard harus menampilkan:

* Traffic
* Leads
* Conversion rate
* Top pages
* Top queries

---

# 15. Integrations

## Existing Systems

* WordPress CMS
* WhatsApp Business
* CRM

## Future Integrations

* Odoo CRM
* Marketing automation
* Email marketing

---

# 16. User Roles

## Administrator

Hak akses penuh.

## Editor

* Mengelola konten
* Mengelola media

## Author

* Membuat artikel
* Mengedit artikel sendiri

---

# 17. Migration Requirements

* Audit URL lama
* Mapping URL baru
* Implementasi redirect 301
* Migrasi metadata SEO
* Validasi broken link

---

# 18. Risks

| Risk                  | Impact | Mitigation     |
| --------------------- | ------ | -------------- |
| Traffic turun         | Tinggi | Redirect 301   |
| API gagal             | Sedang | Caching        |
| Shared hosting lambat | Tinggi | Cloudflare CDN |
| Konten duplikat       | Tinggi | Canonical URL  |

---

# 19. Assumptions

* WordPress tetap digunakan
* Shared hosting tetap dipertahankan
* Tim marketing mengelola konten
* Frontend dihosting di Vercel

---

# 20. Project Deliverables

* Information Architecture
* UI Kit
* Design System
* Frontend Next.js
* WordPress Headless CMS
* Dokumentasi API
* SEO Migration Plan
* Redirect Mapping
* Analytics Dashboard

---

# 21. Acceptance Criteria

Proyek dinyatakan selesai apabila:

* Seluruh halaman dapat diakses
* Seluruh konten termigrasi
* Core Web Vitals memenuhi target
* Tidak ada broken links
* Redirect berjalan normal
* Form konsultasi berfungsi
* Sitemap tervalidasi
* Structured data valid
* Tim marketing dapat mengelola konten tanpa bantuan developer

```
```
