# NESTRO

NESTRO is a full-stack furniture e-commerce application. It includes a customer storefront, account and address management, an admin dashboard, product and category management, image uploads, and order handling.

## Live demo

- **Frontend:** [nestro-khaki.vercel.app](https://nestro-khaki.vercel.app)
- **Backend API:** [nestro-yjbm.onrender.com](https://nestro-yjbm.onrender.com)

## Tech stack

- **Frontend:** Next.js, React, Redux Toolkit, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB with Mongoose
- **Authentication:** JWT stored in HTTP-only cookies
- **Media storage:** Cloudinary
- **Email:** Brevo SMTP via Nodemailer
- **Deployment:** Vercel (frontend) and Render (backend)

## Features

- Browse products by category and room type
- Customer registration, email OTP verification, login, profile, and addresses
- Admin login and protected admin dashboard
- Admin CRUD operations for categories, room types, products, users, and orders
- Product image uploads through Cloudinary
- Customer orders and order-confirmation emails

## Project structure

```text
.
├── backend/       # Express API
│   ├── scripts/   # Asset upload and migration scripts
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routers/
│       └── app.js
└── fronted/       # Next.js client application
    └── src/
```

## Run locally

### Prerequisites

- Node.js 22 or later
- A MongoDB Atlas database
- Cloudinary and Brevo SMTP accounts

### 1. Clone and install dependencies

```bash
git clone https://github.com/mrpramit/NESTRO.git
cd NESTRO

cd backend
npm install

cd ../fronted
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URL=your_mongodb_connection_string
API_SECRET=your_application_secret

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key

SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_smtp_user
SMTP_PASS=your_brevo_smtp_password
EMAIL_FROM=your_verified_sender_email
```

Create `fronted/.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api/
```

> Never commit `.env` or `.env.local` files. Use your hosting provider's environment-variable settings for production values.

### 3. Start the applications

In one terminal:

```bash
cd backend
npm run dev
```

In another terminal:

```bash
cd fronted
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API overview

All API routes use the `/api` prefix.

| Resource | Base route |
| --- | --- |
| Categories | `/api/category` |
| Room types | `/api/room-type` |
| Products | `/api/product` |
| Users and authentication | `/api/user` |
| Orders | `/api/order` |

Administrative create, update, delete, and order-management endpoints require an authenticated `admin` or `superAdmin` account.

## Deploy

### Backend: Render

Create a **Web Service** with:

```text
Root Directory: backend
Build Command: npm ci
Start Command: npm start
```

Add every variable from `backend/.env` in Render's **Environment** page, except `PORT`. Render assigns `PORT` automatically. Set `NODE_ENV=production`.

In MongoDB Atlas, allow the deployed backend to connect through **Network Access**. For learning deployments, `0.0.0.0/0` allows all IPv4 addresses; restrict this rule for production when possible.

### Frontend: Vercel

Import the repository and use:

```text
Root Directory: fronted
Framework Preset: Next.js
```

Set this Vercel environment variable before deploying:

```env
NEXT_PUBLIC_BASE_URL=https://your-render-service.onrender.com/api/
```

Finally, add the Vercel domain to the backend CORS allowlist in `backend/src/app.js`. This is required for browser requests and HTTP-only authentication cookies to work in production.

## Security notes

- Keep credentials out of Git and rotate any secret that is accidentally exposed.
- Use a strong, unique `API_SECRET` in every environment. The current backend uses this variable for JWT signing and the Cloudinary configuration; consider separating these into dedicated variables before a public production release.
- The app uses secure, cross-site cookies in production so the Vercel frontend can authenticate with the Render API.

## License

This project is licensed under the ISC License.
