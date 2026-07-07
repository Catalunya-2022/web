# Web de Catalunya 2022

[![CI](https://github.com/catalunya-2022/web/actions/workflows/ci.yml/badge.svg)](https://github.com/catalunya-2022/web/actions/workflows/ci.yml)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19500831.svg)](https://doi.org/10.5281/zenodo.19500831)

Lloc web del document **«Catalunya 2022 - RESET: Crida per reactivar el país»**, el pla estratègic elaborat l'any 2021 per un grup de treball de 30 experts de la societat civil catalana. Fa explorables els 3 àmbits, els 12 objectius i les 91 accions del document en català, anglès i castellà, amb cerca de text complet, perfils dels experts i descàrregues en PDF, EPUB i Markdown. En producció a **[2022.cat](https://2022.cat)**.

- Servidor MCP del document: [2022.cat/mcp](https://2022.cat/mcp) · [repositori](https://github.com/catalunya-2022/mcp)
- Arxiu permanent del document: DOI [10.5281/zenodo.19500831](https://doi.org/10.5281/zenodo.19500831)

## Stack tecnològic

- [Next.js 16](https://nextjs.org): App Router, React 19, generació estàtica (447 pàgines)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [next-intl v4](https://next-intl.dev): enrutament per locale amb slugs d'URL en llengua nativa
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote): renderitzat del contingut MDX
- [flexsearch](https://github.com/nextapps-de/flexsearch): cerca de text complet al client (⌘K)

## Desenvolupament

Requisits: Node.js 22 (`.nvmrc`) i npm.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producció (executa abans tota la cadena de generadors)
```

### Comprovacions de qualitat

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript estricte
npm run test        # Vitest: tests unitaris
npm run test:e2e    # Playwright: e2e + regressió visual
```

La CI executa lint, typecheck, test, build i e2e a cada push. Abans del primer `npm run test:e2e` cal instal·lar el navegador amb `npx playwright install chromium`. Les línies de base de regressió visual són específiques de cada plataforma i no es versionen: executa `npm run test:e2e:update` un cop abans del primer `npm run test:e2e` (la CI les omet amb `ignoreSnapshots`).

### Scripts de generació

| Script | Funció |
|---|---|
| `generate:llms` | `llms.txt` / `llms-full.txt` per a rastrejadors d'IA, per locale |
| `generate:search` | Corpus JSON de cerca per locale |
| `generate:og` | 441 imatges Open Graph (Satori + resvg) |
| `generate:manifests` | Manifests PWA per locale |
| `generate:dates` | Dates `lastmod` del sitemap a partir de l'historial git |
| `generate:icons` | Favicons i icones PWA des de `src/app/icon.svg` (manual; sortida versionada) |
| `indexnow` | Notifica totes les URLs a Bing/Yandex després d'un desplegament (opcional) |

### Estructura del projecte

```text
content/{ca,en,es}/      MDX trilingüe: un arbre mirall per locale
src/app/[locale]/        Pàgines (App Router; el català és sense prefix d'URL)
src/components/          content/ (pàgines) · layout/ (crom) · ui/ (shadcn)
src/i18n/routing.ts      Locales, tipus Trilingual<T>, pathnames de next-intl
src/lib/route-catalog.ts Font única de veritat dels slugs d'URL traduïts
src/lib/                 Pipeline de contingut, cerca, SEO/metadata, JSON-LD
scripts/                 Generadors executats pel prebuild
```

### Notes de publicació

- Els slugs canònics interns són sempre en anglès; la traducció a les URLs de cada locale (`/ambit-1`, `/en/sphere-1`, `/es/ambito-1`) es fa en temps de render a partir de `route-catalog.ts`.
- La llengua per defecte és el català (`ca`, sense prefix d'URL).
- Qualsevol canvi de contingut o de dades ha de cobrir els tres locales (`ca`, `en`, `es`) en el mateix canvi.
- Els fitxers generats (imatges OG, corpus de cerca, família `llms.txt`, manifests PWA, dates del sitemap) no es versionen: `npm run dev` i `npm run build` els regeneren.
- El fitxer `.txt` de 64 caràcters hexadecimals dins `public/` és la clau de verificació d'[IndexNow](https://www.indexnow.org): és pública per disseny, no és cap secret filtrat.
- Si canvies dependències, regenera el lockfile amb el mateix npm que fa servir la CI (l'inclòs amb Node 22): `npx npm@10 install --package-lock-only`.

## SEO i descobriment per IA

Cada pàgina publica metadata completa, alternatives hreflang, JSON-LD i una imatge OG generada en temps de build. El repositori també serveix `llms.txt`, `robots.txt` amb directives Content-Signal, un catàleg d'API RFC 9727 i una targeta de servidor MCP sota `.well-known/`.

## Desplegament

El lloc de producció s'allotja darrere de Cloudflare. Els detalls de desplegament són interns; qualsevol allotjament compatible amb Next.js pot executar aquest repositori sense canvis.

---

## English

The website behind **[2022.cat](https://2022.cat)**: an explorable, trilingual edition of *"Catalunya 2022 - RESET: Call to reactivate Catalonia"*, the strategic plan written in 2021 by a 30-expert Catalan civil-society task force. It makes the document's 3 spheres, 12 goals, and 91 actions browsable and searchable in Catalan, English, and Spanish, with expert profiles and downloads.

Built with Next.js 16 (App Router, React 19, 447 static pages), Tailwind CSS v4, shadcn/ui, next-intl v4 (native-language URL slugs per locale), next-mdx-remote, and flexsearch. Requires Node 22: `npm install && npm run dev`. The 64-hex `.txt` file in `public/` is the public [IndexNow](https://www.indexnow.org) ownership key, not a leaked secret.

Development commands are language-neutral; see [Desenvolupament](#desenvolupament) above. Related repository: [MCP server](https://github.com/catalunya-2022/mcp).

## Llicències / Licenses

- **Codi / Code**: [MIT](LICENSE)
- **Contingut del document / Document content** (`content/`, `public/documents/`): [CC BY 4.0](LICENSE-content) - Grup de Treball Catalunya 2022. *Catalunya 2022 - RESET: Crida per reactivar el país.* DOI: [10.5281/zenodo.19500831](https://doi.org/10.5281/zenodo.19500831)
