# 🛡️ Malonda Admin Panel

Secure, responsive admin dashboard for the Malonda marketplace — fraud prevention, user management, seller verification, dispute resolution.

## Quick Start

```bash
npm install
npm start        # dev server on http://localhost:3001
npm run build    # production build → /build
```

## Demo Login
| Field    | Value                  |
|----------|------------------------|
| Phone    | +265888000001          |
| Password | Admin@Malonda2024      |

## Pages
| Route           | Page                  |
|-----------------|-----------------------|
| `/`             | Dashboard Overview    |
| `/users`        | User Management       |
| `/verify`       | Seller Verification   |
| `/products`     | Product Monitoring    |
| `/fraud`        | Fraud & Reports       |
| `/transactions` | Transactions          |
| `/disputes`     | Dispute Resolution    |

## Structure
```
src/
  components/
    layout/    → Sidebar, Topbar, AdminLayout
    common/    → DataTable
    ui/        → StatusBadge, AlertBanner, ConfirmModal, MetricCard, etc.
  context/     → AdminContext (global state)
  data/        → mockData.js
  hooks/       → useConfirm.js
  pages/       → one file per route
  styles/      → global.css
```

## Deploy to Vercel
```bash
vercel
# Set Node.js version to 20.x in Vercel dashboard → Settings → General
```
