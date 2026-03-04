# SANDJA — The Fabric of the Future

> **Restoring meaning and value to African fabric through technology**

SANDJA is a cultural and technological platform that preserves, promotes and commercializes African textile heritage — particularly the pagne — by combining a multimedia knowledge base, decentralized marketplace, Cardano NFTs, gamification and 3D visualization.

---

## Table of Contents

- [SANDJA — The Fabric of the Future](#sandja--the-fabric-of-the-future)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
  - [Project Architecture](#project-architecture)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database](#database)
  - [Cardano Blockchain](#cardano-blockchain)
    - [Configuration](#configuration)
    - [Supported Wallets](#supported-wallets)
    - [SNDJ Token (SandjaCoin)](#sndj-token-sandjacoin)
    - [Network](#network)
    - [Purchase Flow](#purchase-flow)
  - [Available Scripts](#available-scripts)
  - [Route Structure](#route-structure)
    - [Public Routes](#public-routes)
    - [Authentication Routes](#authentication-routes)
    - [Protected Routes (authentication required)](#protected-routes-authentication-required)
    - [API Routes](#api-routes)
  - [Internationalization](#internationalization)
  - [Authentication \& Roles](#authentication--roles)
    - [Roles](#roles)
  - [Gamification](#gamification)
    - [Levels (10 levels)](#levels-10-levels)
    - [Rewards](#rewards)
  - [Deployment](#deployment)
    - [Vercel (recommended)](#vercel-recommended)
    - [Docker (optional)](#docker-optional)
    - [Production Checklist](#production-checklist)
  - [License](#license)

---

## Overview

SANDJA is developed by **KWAN Techs Hub**. The platform connects artisans, African culture enthusiasts and collectors around the pagne — a fabric carrying history, symbols and identity.

The platform enables users to:
- **Explore** an enriched database of African symbols with multimedia content (images, audio, video, 3D models)
- **Buy and sell** physical pagnes, digital designs and NFTs in ADA (Cardano)
- **Mint NFTs** representing artisan creations on the Cardano blockchain
- **Earn rewards** through a gamification system (XP, levels, achievements, SandjaCoin)
- **Scan** pagnes via AR to identify symbols and their meaning

---

## Key Features

| Feature | Description |
|---|---|
| **Knowledge Base** | African symbols and pagnes with images, audio, video, multilingual descriptions |
| **Marketplace** | Buy/sell physical pagnes, digital designs, NFTs and print licenses in ADA |
| **Cardano Blockchain** | NFTs, native token SNDJ (SandjaCoin), on-chain transactions |
| **Gamification** | 10 levels, XP, achievements (COMMON→LEGENDARY), streaks, quizzes |
| **Cardano Wallet** | CIP-30 integration (Eternl, Lace), on-chain asset management |
| **3D Visualization** | Interactive Three.js models of pagnes and symbols |
| **AR Scanner** | Pagne identification via image scan |
| **NFT Ticketing** | Cultural event tickets as NFTs |
| **Multi-level Roles** | User, Artisan, Administrator |
| **Multilingual** | French and English (extensible) |

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16.1.1](https://nextjs.org) (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4, Radix UI, shadcn/ui |
| **Animations** | Framer Motion 11 |
| **3D** | Three.js 0.182, React Three Fiber, Drei |
| **Database** | PostgreSQL + Prisma ORM 7 |
| **Authentication** | Better Auth 1.4.9 |
| **Blockchain** | Cardano — Lucid 0.10.11, Blockfrost JS 6 |
| **Global State** | Zustand 5 |
| **Async Data** | TanStack React Query 5 |
| **Forms** | React Hook Form 7 + Zod 3 |
| **i18n** | next-intl 4 (FR / EN) |
| **Email** | Resend + React Email |
| **File Storage** | Vercel Blob |
| **Package Manager** | pnpm |

---

## Project Architecture

```
sandja/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (auth, purchase, wallet, NFT)
│   ├── [locale]/                 # Localized routes (fr, en)
│   │   ├── (public)/             # Public pages (landing)
│   │   ├── (auth)/               # Auth pages (login, register, reset)
│   │   └── (app)/                # Protected pages (home, explore, marketplace, wallet)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── src/
│   ├── components/               # React components
│   │   ├── 3d/                   # Three.js components
│   │   ├── auth/                 # Authentication forms
│   │   ├── explore/              # Symbol & pagne exploration
│   │   ├── landing/              # Landing page sections
│   │   ├── marketplace/          # Marketplace
│   │   ├── wallet/               # Cardano wallet management
│   │   ├── layout/               # Header, Footer, Navigation
│   │   ├── providers/            # App providers (Theme, Query, Toast)
│   │   └── ui/                   # UI primitives (Radix)
│   ├── config/                   # Configurations
│   │   ├── blockchain.ts         # Cardano network config
│   │   ├── gamification.ts       # XP levels, rewards
│   │   ├── patterns.ts           # African patterns
│   │   ├── site.ts               # Metadata, constants
│   │   └── theme.ts              # Colors & theme
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCardanoWallet.ts
│   │   └── usePurchase.ts
│   ├── i18n/                     # Internationalization
│   │   ├── routing.ts            # Locales: [fr, en], default: fr
│   │   ├── request.ts
│   │   └── navigation.ts
│   ├── lib/                      # Utility libraries
│   │   ├── auth.ts               # Better Auth config
│   │   ├── auth-client.ts
│   │   ├── prisma.ts             # Prisma client
│   │   ├── bech32.ts             # Cardano address conversion
│   │   └── utils.ts              # Helpers (cn, formatPrice...)
│   ├── services/                 # Business services
│   │   ├── blockfrost.ts         # Blockfrost API client
│   │   ├── cardano-wallet.ts     # CIP-30 wallet integration
│   │   └── transaction-builder.ts # Transaction construction
│   ├── stores/                   # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── wallet-store.ts
│   │   ├── cart-store.ts
│   │   └── filter-store.ts
│   ├── types/                    # TypeScript types
│   └── validators/               # Zod schemas
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Initial data
├── messages/
│   ├── fr.json                   # French translations
│   └── en.json                   # English translations
├── public/                       # Static assets
├── proxy.ts                      # Middleware (auth + i18n)
├── next.config.ts                # Next.js configuration
└── package.json
```

---

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9
- **PostgreSQL** >= 15
- A **Blockfrost** account (Cardano API) — [blockfrost.io](https://blockfrost.io)
- A **Resend** account for emails — [resend.com](https://resend.com)
- A **Vercel Blob** account for file storage (optional in dev)

---

## Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd sandja-app/sandja

# 2. Install dependencies
pnpm install

# 3. Copy and configure environment variables
cp .env.example .env.local

# 4. Generate the Prisma client
pnpm db:generate

# 5. Push the schema to the database
pnpm db:push

# 6. Seed the database with initial data
pnpm db:seed

# 7. Start the development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# ─── Application ───────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ─── Database ──────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/sandja"

# ─── Authentication (Better Auth) ──────────────────────────
BETTER_AUTH_SECRET=<random-string-32-characters-minimum>
BETTER_AUTH_URL=http://localhost:3000

# ─── Google OAuth ──────────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ─── Email (Resend) ────────────────────────────────────────
RESEND_API_KEY=
EMAIL_FROM=noreply@sandja.app

# ─── Cardano Blockchain ────────────────────────────────────
NEXT_PUBLIC_CARDANO_NETWORK=preview        # or mainnet
BLOCKFROST_API_KEY=previewXXXXXXXXXXXXX
SELLER_WALLET_ADDRESS=addr_test1q...       # Seller address for transactions

# ─── NFT & Smart Contracts ─────────────────────────────────
NEXT_PUBLIC_SANDJA_POLICY_ID=             # SNDJ token policy ID
NEXT_PUBLIC_NFT_POLICY_ID=               # Pagne NFT policy ID

# ─── IPFS / NFT Storage ────────────────────────────────────
PINATA_API_KEY=
PINATA_API_SECRET=
NFT_STORAGE_API_KEY=

# ─── File Storage (Vercel Blob) ────────────────────────────
BLOB_READ_WRITE_TOKEN=

# ─── Analytics (optional) ──────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ─── Error Tracking (optional) ─────────────────────────────
SENTRY_DSN=
```

---

## Database

SANDJA uses **PostgreSQL** with **Prisma ORM**. The main models are:

| Model | Description |
|---|---|
| `User` | User with role, XP, level, SandjaCoin, Cardano wallet |
| `Symbol` | African symbols (category, theme, region, multimedia) |
| `Pagne` | Pagnes with 3D model, ceremonies, associated symbols |
| `Design` | Artisan submissions awaiting validation |
| `Product` | Items for sale (PHYSICAL, DIGITAL, NFT, LICENSE) |
| `Order` / `OrderItem` | Orders with Cardano transaction tracking |
| `NFT` | Minted NFTs with policy ID and transaction hash |
| `Event` / `Ticket` | Cultural events and NFT tickets |
| `Achievement` | Achievements with rarities (COMMON→LEGENDARY) |
| `Quiz` / `QuizResult` | Quizzes with XP and SandjaCoin rewards |
| `Region` | Geographic regions with coordinates |

**Prisma commands:**

```bash
pnpm db:generate    # Generate the Prisma client
pnpm db:push        # Push schema (dev, without migration)
pnpm db:migrate     # Create a SQL migration
pnpm db:seed        # Seed the database
pnpm db:studio      # Open Prisma Studio (visual interface)
pnpm db:reset       # Full reset + reseed
```

---

## Cardano Blockchain

### Configuration

SANDJA integrates with the **Cardano** blockchain via:
- **Lucid** (`lucid-cardano`) — Transaction construction and signing
- **Blockfrost** (`@blockfrost/blockfrost-js`) — Blockchain API (UTXO, assets, tx submission)
- **CIP-30** — Wallet integration standard (Eternl, Lace, etc.)

### Supported Wallets

- [Eternl](https://eternl.io)
- [Lace](https://lacewallet.io)
- Any CIP-30 compatible wallet

### SNDJ Token (SandjaCoin)

SandjaCoin is the platform's native token. It can be obtained via:
- The faucet `/api/claim-sndj` (testnet)
- Gamification rewards (quizzes, achievements)
- Marketplace purchases

### Network

Configured by default on Cardano's **Preview testnet**. To switch to mainnet, change `NEXT_PUBLIC_CARDANO_NETWORK=mainnet` and provide the corresponding mainnet Blockfrost keys.

### Purchase Flow

```
1. User connects their wallet (CIP-30)
2. POST /api/purchase/build-tx → transaction construction (CBOR)
3. Wallet signs the transaction
4. POST /api/purchase → on-chain submission via Blockfrost
5. Tracking on preview.cardanoscan.io
```

---

## Available Scripts

```bash
pnpm dev           # Development server (http://localhost:3000)
pnpm build         # Production build
pnpm start         # Start in production
pnpm lint          # ESLint linter

pnpm db:generate   # Generate the Prisma client
pnpm db:push       # Push schema without migration
pnpm db:migrate    # Prisma migration
pnpm db:seed       # Seed the database
pnpm db:studio     # Prisma Studio interface
pnpm db:reset      # Full reset + reseed
```

---

## Route Structure

### Public Routes
| Route | Description |
|---|---|
| `/[locale]/` | Landing page |

### Authentication Routes
| Route | Description |
|---|---|
| `/[locale]/login` | Sign in |
| `/[locale]/register` | Sign up |
| `/[locale]/forgot-password` | Password reset |

### Protected Routes (authentication required)
| Route | Description |
|---|---|
| `/[locale]/home` | Dashboard |
| `/[locale]/explore` | Symbol & pagne exploration |
| `/[locale]/explore/[slug]` | Symbol detail |
| `/[locale]/marketplace` | Marketplace |
| `/[locale]/marketplace/[slug]` | Product detail |
| `/[locale]/wallet` | Cardano wallet management |

### API Routes
| Route | Description |
|---|---|
| `/api/auth/[...all]` | Better Auth endpoints |
| `/api/purchase` | Purchase submission |
| `/api/purchase/build-tx` | Transaction construction |
| `/api/claim-sndj` | SandjaCoin faucet |
| `/api/wallet-assets` | Wallet assets |

---

## Internationalization

SANDJA supports **French** (default) and **English** via `next-intl`.

URLs are prefixed by locale:
- `/fr/explore` — French
- `/en/explore` — English

Translations are located in `messages/fr.json` and `messages/en.json`.

To add a language, add the locale in `src/i18n/routing.ts` and create the corresponding translation file.

---

## Authentication & Roles

**Better Auth** handles authentication with:
- Email / password
- Google OAuth
- 7-day sessions

### Roles
| Role | Access |
|---|---|
| `USER` | Exploration, marketplace, wallet, quizzes |
| `ARTISAN` | + Design submission, shop management |
| `ADMIN` | + Full administration, content validation |

The middleware (`proxy.ts`) protects routes based on role and redirects to `/login` if not authenticated.

---

## Gamification

SANDJA includes a complete progression system:

### Levels (10 levels)
| Level | Title | XP Required |
|---|---|---|
| 1 | Ndop Apprentice | 0 |
| 2 | Budding Weaver | 100 |
| ... | ... | ... |
| 10 | Living Legend | — |

### Rewards
- **XP** — Symbol exploration, quizzes, purchases, daily logins
- **SandjaCoin (SNDJ)** — Native token, earnable and spendable on the marketplace
- **Achievements** — Badges with COMMON, RARE, EPIC, LEGENDARY rarities
- **Streaks** — Daily login bonuses

---

## Deployment

### Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configure all environment variables in the Vercel dashboard.

### Docker (optional)

A `Dockerfile` can be added. The standard Next.js build command is:
```bash
pnpm build
pnpm start
```

### Production Checklist

- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` pointing to a production PostgreSQL database
- [ ] `BETTER_AUTH_SECRET` with a strong value (32+ characters)
- [ ] `NEXT_PUBLIC_CARDANO_NETWORK=mainnet` if deploying to mainnet
- [ ] Mainnet Blockfrost keys configured
- [ ] Mainnet seller wallet configured
- [ ] Domain configured in `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL`

---

## License

**SANDJA Proprietary Source-Available License v1.0**

This project is the property of **KWAN Techs Hub**. The source code is viewable for evaluation purposes (hackathon). Any commercial use, redistribution or creation of derivative works is prohibited without explicit written authorization.

See the [LICENSE](./LICENSE) file for full details.

---

<div align="center">
  <strong>SANDJA — KWAN Techs Hub &copy; 2024-2025</strong><br>
  <em>Restoring meaning and value to African fabric through technology</em>
</div>