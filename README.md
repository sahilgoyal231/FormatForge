# Cloudinary SaaS Platform

A modern, full-stack SaaS application built with Next.js that leverages Cloudinary for intelligent media management and transformations. This platform enables users to upload, manage, and optimize both images and videos seamlessly.

## 🚀 Features

- **Video Upload & Optimization**: Seamlessly upload videos and automatically generate compressed versions using Cloudinary, tracking original and compressed sizes to monitor bandwidth savings.
- **Social Media Image Generation**: Instantly transform and crop images into perfectly sized formats for various social media platforms (Instagram, Twitter, Facebook, etc.).
- **Media Dashboard**: View and manage all your uploaded videos and processed images in a clean, modern interface.
- **Secure Authentication**: Robust user authentication and session management powered by Clerk.
- **Responsive UI**: Beautiful, fully responsive user interface built with Tailwind CSS and DaisyUI.

## 💻 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL (hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Media Processing**: [Cloudinary](https://cloudinary.com/) & `next-cloudinary`
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine. You will also need accounts for [Clerk](https://clerk.com/), [Cloudinary](https://cloudinary.com/), and a PostgreSQL database (like [Neon](https://neon.tech/)).

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cloudinary-saas.git
cd cloudinary-saas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` and `.env.local` file in the root directory. You can use the provided `.env.example` (if available) as a template.

**`.env`:**
```env
DATABASE_URL="your-postgresql-connection-string"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

**`.env.local`:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 4. Database Setup

Run Prisma to push the schema to your database and generate the Prisma Client:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com). Make sure to set all your environment variables in the Vercel project settings before deploying. Ensure that your build command is configured as `prisma generate && next build` to properly generate the Prisma client during deployment.
