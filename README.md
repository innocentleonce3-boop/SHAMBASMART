# 🌱 ShambaSmart — Smart Farm Management Platform

**Empowering farmers with digital tools for smarter, more productive, and data-driven agriculture.**

ShambaSmart is a web-based farm management platform designed to help farmers and agricultural businesses organize farm operations, monitor crop growth, manage agricultural activities, record harvests, track income and expenses, and make informed farming decisions.

Built with modern web technologies, ShambaSmart aims to simplify agricultural management and improve access to reliable farm records and useful insights, with an initial focus on Tanzania.

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Vision and Mission](#-vision-and-mission)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Supabase Integration](#-supabase-integration)
- [Database Security](#-database-security)
- [Development Commands](#-development-commands)
- [GitHub Workflow](#-github-workflow)
- [Deployment](#-deployment)
- [Localization](#-localization)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Security](#-security)
- [License](#-license)

---

## 🌍 About the Project

Agriculture is an important part of Tanzania's economy and the livelihoods of many communities. Managing farms using scattered notes, spreadsheets, and manual records can make it difficult to monitor activities, track expenses, measure production, and evaluate farm performance.

ShambaSmart aims to address these challenges through a centralized digital platform where farmers can organize their farm information and access it whenever needed.

The platform is being developed to support individual farmers, farm managers, and agricultural businesses with practical tools for planning, monitoring, recording, and analyzing farming operations.

**Project status:** Under active development.

The features described in this README represent the project's intended capabilities. Actual availability depends on what has been implemented and tested in the current source code.

## 🎯 Vision and Mission

### Vision

To become a trusted digital farm management platform that supports smarter, more efficient, and more sustainable agriculture.

### Mission

To make farm management easier by providing accessible digital tools for agricultural planning, record-keeping, financial tracking, crop monitoring, and data-driven decision-making.

### Objectives

- Improve farm record-keeping and organization.
- Help farmers monitor agricultural activities and crop development.
- Support accurate harvest, sales, and expense records.
- Make useful farm information easier to access.
- Support English and Swahili for farmers in Tanzania.
- Build a secure, scalable foundation for future agricultural services.

## ✨ Key Features

ShambaSmart is being developed around the following capabilities.

### 🚜 Farm and Field Management

- Create and manage farm profiles.
- Organize individual fields and growing areas.
- Maintain important farm information.
- Support farm-specific records and ownership.

### 🌱 Crop Planning and Management

- Organize crop information and crop seasons.
- Track planting dates and relevant crop details.
- Record crop growth observations.
- Maintain agricultural records throughout the growing season.

### 📅 Agricultural Activity Tracking

- Record farming activities and tasks.
- Track activity dates and progress.
- Organize farm operations and historical records.
- Support better planning of agricultural work.

### 🌾 Harvest and Production Management

- Record harvest dates and quantities.
- Maintain production records.
- Track harvest history by farm, field, or crop where supported.
- Provide a foundation for analyzing farm productivity.

### 💰 Financial Management

- Record sales and farm income.
- Track expenses and operating costs.
- Organize financial records.
- Support future profitability and performance reporting.

### 📊 Analytics and Insights

- Summarize recorded farm activities.
- Support production and financial reporting.
- Help users identify trends from their farm records.
- Provide a foundation for data-driven agricultural decisions.

### 🔐 User Accounts and Data Protection

- Support secure user authentication.
- Associate private farm records with the appropriate users.
- Use database access policies to protect user information.
- Support secure access across devices when authentication and backend integration are configured.

### 🌐 Localization and Accessibility

- English language support.
- Swahili language support.
- Tanzanian Shilling (TZS) currency context.
- Responsive design for desktop, tablet, and mobile screens.

Features should only be considered complete when they are implemented and verified in the application.

## 🧰 Technology Stack

ShambaSmart uses, or is being developed to use, the following technologies. Check the project's current dependencies for the exact installed versions.

| Technology | Purpose |
|---|---|
| Next.js | Web application framework |
| React | User interface development |
| TypeScript | Type-safe application code |
| Tailwind CSS | Responsive interface styling |
| Supabase | Backend services and authentication |
| PostgreSQL | Relational database |
| Git | Version control |
| GitHub | Source code hosting and collaboration |
| Vercel | Potential application deployment platform |

## 🏗️ Project Architecture

ShambaSmart follows the architecture of its existing Next.js application.

The main architectural responsibilities include:

- **Presentation layer:** Pages, layouts, forms, and reusable interface components.
- **Application layer:** Farm workflows, crop management, activity tracking, and business logic.
- **Backend integration:** Supabase client helpers, authentication, and data access.
- **Database layer:** PostgreSQL tables, relationships, migrations, and Row Level Security policies.
- **Deployment layer:** Environment configuration, GitHub source control, and hosting.

### Project Structure

The exact directory structure depends on the current repository. A typical Next.js project may contain:

```text
ShambaSmart/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   └── types/
├── supabase/
│   └── migrations/
├── docs/
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

This is a reference layout, not a requirement to restructure an existing working application. Follow the actual files and conventions in the repository.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Install:

- [Node.js](https://nodejs.org/)
- npm or the package manager used by the project
- [Git](https://git-scm.com/)
- A [GitHub account](https://github.com/)
- A [Supabase account](https://supabase.com/) for backend services

Use a Node.js version compatible with the project's installed Next.js version.

### 1. Clone the Repository

Replace `YOUR_GITHUB_USERNAME` with the actual GitHub account that owns the repository.

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/ShambaSmart.git
cd ShambaSmart
```

Use the exact repository URL displayed on GitHub if the repository name or capitalization differs.

### 2. Install Dependencies

If the project uses npm and contains `package-lock.json`, run:

```bash
npm ci
```

If a lockfile does not exist yet, run:

```bash
npm install
```

Do not mix package managers unnecessarily or delete an existing lockfile without a reason.

### 3. Configure Environment Variables

Create a local environment file from the example template.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**macOS or Linux:**

```bash
cp .env.example .env.local
```

Open `.env.local` and enter the configuration values for your own Supabase project.

### 4. Start the Development Server

```bash
npm run dev
```

Open the application at:

http://localhost:3000

If the development command differs in `package.json`, follow the existing project configuration.

## ⚙️ Environment Configuration

The application may require environment variables similar to the following, depending on the actual implementation:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Use the exact variable names referenced by the source code.

### Environment File Rules

- `.env.local` contains local configuration and must not be committed.
- `.env.example` contains placeholder values only.
- Never include database passwords or secret keys in public client-side variables.
- Never commit service-role keys or Supabase secret keys.
- Configure production environment variables separately in the hosting platform.

## 🔌 Supabase Integration

Supabase provides backend services for the ShambaSmart application.

Depending on the implemented features, it can provide:

- User authentication and session management.
- PostgreSQL database storage.
- Secure access to farm and crop records.
- File storage for farm-related images.
- Database access policies.
- Backend functionality for future agricultural features.

### Initial Supabase Setup

1. Sign in to the Supabase Dashboard.
2. Create or select the Supabase project for ShambaSmart.
3. Retrieve the project URL and publishable key from the project's connection settings.
4. Configure the values in your local `.env.local` file.
5. Install the required Supabase packages if they are not already installed.
6. Configure browser and server Supabase clients following the official Next.js integration pattern.
7. Configure authentication session refresh using the appropriate Next.js middleware or proxy approach for the installed version.
8. Review the SQL migrations in the repository.
9. Apply approved migrations to the intended Supabase database.
10. Test authentication, database access, and access policies before using real farm data.

Official resources:

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Database Migrations

Database schema changes should be stored as version-controlled SQL migrations.

Before applying migrations to a shared or production database:

- Review the SQL changes.
- Confirm the target Supabase project.
- Check whether any existing data could be affected.
- Back up important data when appropriate.
- Avoid destructive operations without explicit approval.
- Verify the resulting schema and policies after applying changes.

Creating a Supabase project alone does not create every table or policy required by the application.

## 🔒 Database Security

Protecting farm data is a core requirement.

The application should implement appropriate security controls, including:

- Row Level Security (RLS) for private user data.
- Policies that restrict access to records a user is authorized to access.
- Proper authentication and server-side authorization checks.
- Safe handling of cookies and sessions.
- Appropriate access policies for uploaded files.
- Server-only handling of privileged credentials.
- Input validation and error handling.

A publishable Supabase key is not a replacement for database authorization. Never rely only on frontend filtering or hidden interface elements to protect records.

Before pilot testing with real farmers, verify that one user cannot read, change, or delete another user's private records unless explicitly authorized.

## 🧪 Development Commands

Use the scripts available in the project's `package.json`.

Common commands may include:

```bash
npm run dev
npm run lint
npm run build
```

If the project defines a TypeScript check or test script, run those as well. For example:

```bash
npm run typecheck
npm test
```

The last two commands are examples and may not exist in every project. Check the available scripts before running them.

Resolve errors and test important workflows before releasing changes.

## 🔄 GitHub Workflow

Use GitHub to maintain the source code and track development changes.

A typical workflow is:

1. Make changes in a dedicated branch where appropriate.
2. Review modified files.
3. Check that no private credentials or generated files are staged.
4. Run available checks.
5. Commit the changes with a clear message.
6. Push to the intended GitHub repository.
7. Review changes before merging them into the main branch.

Example commands:

```bash
git status
git add .
git status
git commit -m "feat: improve farm management"
git push
```

Review the staged changes before committing. Do not blindly stage secrets, local environment files, or unrelated files.

## 🚀 Deployment

ShambaSmart may be deployed to Vercel when the application is ready for testing or release.

### Deployment Checklist

1. Ensure the required source files are committed to GitHub.
2. Import the correct repository into Vercel.
3. Confirm the project root and build settings.
4. Configure the required environment variables in Vercel.
5. Ensure Supabase migrations have been reviewed and applied to the intended database.
6. Configure authentication redirect URLs for the deployed domain.
7. Verify database RLS and Storage policies.
8. Build and test the production application.
9. Test login, logout, protected routes, and user-specific records.
10. Monitor errors and resolve issues before wider release.

Resources:

- [Vercel](https://vercel.com/)
- [Vercel Documentation](https://vercel.com/docs)

A successful deployment does not automatically mean that the database, authentication, and authorization are correctly configured.

## 🌍 Localization

ShambaSmart is intended to serve farmers in Tanzania and other relevant agricultural communities.

Localization goals include:

- English interface.
- Swahili interface.
- Tanzanian Shilling (TZS) formatting.
- Appropriate date and number formatting.
- Clear agricultural terminology.
- Responsive and accessible user experience.

Localization should be tested across the entire application before being described as complete.

## 🗺️ Roadmap

The following roadmap describes development goals. Update it as work is completed and verified.

- [ ] Audit and document the existing source code.
- [ ] Prepare a secure GitHub repository.
- [ ] Configure Supabase client helpers.
- [ ] Implement and test user authentication.
- [ ] Design and verify database schema and RLS policies.
- [ ] Implement farm and field management.
- [ ] Implement crop planning and season tracking.
- [ ] Implement agricultural activity records.
- [ ] Implement crop growth observations.
- [ ] Implement harvest and production tracking.
- [ ] Implement sales and expense management.
- [ ] Add farm analytics and reporting.
- [ ] Complete English and Swahili localization.
- [ ] Add automated tests and production checks.
- [ ] Prepare a secure pilot deployment.
- [ ] Collect feedback and improve the platform.

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome as the project develops.

Before contributing:

1. Review the existing code and documentation.
2. Discuss major changes with the project maintainer.
3. Keep changes focused and easy to review.
4. Add or update tests where appropriate.
5. Document relevant configuration changes.
6. Never include credentials or private farm data in commits or issues.

Follow the repository's `CONTRIBUTING.md` if one is available.

## 🛡️ Security

Do not publish credentials, private farm records, or sensitive vulnerability details in public issues.

If you discover a security concern, contact the project maintainer privately and provide enough information for the issue to be investigated safely.

If a credential is exposed, revoke or rotate it and assess whether it remains in Git history. Removing it from the latest commit alone may not remove earlier copies.

## 📄 License

The project license must be selected by the repository owner.

Until a license is added, do not assume that the source code is licensed for unrestricted reuse, redistribution, or modification.

---

## 📌 Project Status

**ShambaSmart is under active development.**

The project aims to provide a secure and practical digital platform for farm management, crop monitoring, agricultural record-keeping, and farm performance insights.

Implementation status should be verified against the current source code, database configuration, and test results.

**ShambaSmart — Supporting smarter farm management through technology.**
