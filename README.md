# High Level

The website for **High Level**, a full-service digital studio based in North Macedonia.

**Live:** [highlevel.mk](https://www.highlevel.mk)

![High Level](./public/logo.png)

## About

A single-page marketing site built around a monochrome editorial aesthetic — heavy type, generous whitespace, and scroll-driven motion. The layout is deliberately restrained; the movement carries the personality.

## Stack

| | |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | CSS / Tailwind |
| Animation | GSAP + ScrollTrigger |
| Hosting | Vercel |
| DNS | zemi.mk |

## Features

- Scroll-driven hero with layered parallax objects
- GSAP ScrollTrigger timelines for section reveals and pinned sequences
- Responsive from 320px up, with motion tuned separately for touch devices
- Work grid linking to live client projects
- Contact form
- Optimised images through `next/image`

## Running locally

```bash
git clone https://github.com/rronnnnn/highlevel.git
cd highlevel
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
```

## Project structure

```
app/          routes and layout
components/   section and UI components
public/       logo, hero objects, work thumbnails
styles/       global styles and tokens
```

## Selected work featured on the site

- [Studio Melisa](https://studiomelisa.com) — salon booking platform
- [InnTrack](https://inntrackpage.vercel.app) — property management SaaS
- [Popoff](https://popoff.mk) — e-commerce
- [Motion](https://motionfitness.vercel.app) — WebGL fitness landing page

## Contact

mkhighlevel@gmail.com · [@highlevel.mk](https://instagram.com/highlevel.mk)
