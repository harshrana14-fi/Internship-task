# Internship Assignment — Genospark Internship

A Learning Management System (LMS) built with **Next.js** (frontend) and **Express.js** (backend), using **MySQL** via Docker. This assignment covers two phases: connecting the frontend with the backend, and migrating raw SQL to **Prisma ORM**.

---

## Project Structure

```
Internship/
├── client/          # Next.js frontend (runs on port 3000)
│   ├── app/
│   │   ├── certifications/
│   │   │   └── page.tsx     # Certifications page
│   │   ├── layout.tsx
│   │   └── page.tsx         # Home page
│   └── .env
│
└── server/          # Express.js backend (runs on port 4000)
    ├── prisma/
    │   └── schema.prisma    # Prisma schema (40 models introspected)
    ├── index.js             # Main server file
    └── .env
```

---

## Phase 1 — Connect Frontend with Backend

### What was done
- The frontend (`client/app/certifications/page.tsx`) was already set up to call the backend API at `http://localhost:4000/api/certifications`
- Set up **MySQL database using Docker** and imported the provided `emsdb_backup.sql`
- Ran both frontend and backend servers and verified the connection end-to-end
- The certifications page successfully fetches and displays **20 certifications** from the database

## Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/dd188a8c-ce21-42e7-8555-8abd0e6381b4" alt="Backend Terminal" width="32%" />
  <img src="https://github.com/user-attachments/assets/1a9afb22-5e05-4cdd-84ed-90a1917a0b7e" alt="API Response" width="32%" />
  <img src="https://github.com/user-attachments/assets/e47d6614-de56-40bc-b935-15ccd1d84368" alt="Certifications Page" width="32%" />
</p>

<p align="center">
  <b>Backend running & connected to database</b> |
  <b>API response</b> |
  <b>Frontend displaying 20 certifications</b>
</p>

---

## Phase 2 — Convert SQL to Prisma ORM

### What was done
- Installed **Prisma** in the server project
- Ran `prisma db pull` to introspect the existing MySQL database — auto-generated **40 models** in `schema.prisma`
- Fixed enum conflicts in the generated schema (duplicate enum values, empty enums)
- Ran `prisma generate` to generate the Prisma Client
- Replaced all raw SQL queries in `index.js` with **Prisma ORM queries**
- Verified the API still returns the same data as before

### Key changes in `server/index.js`

**Before (raw SQL):**
```js
const [rows] = await promisePool.query('SELECT * FROM certification');
res.json({ success: true, count: rows.length, data: rows });
```

**After (Prisma ORM):**
```js
const certifications = await prisma.certification.findMany();
res.json({ success: true, count: certifications.length, data: certifications });
```

### File Structure Difference

| Feature | Without Prisma | With Prisma |
|---|---|---|
| DB connection | `mysql2` pool manually created | `PrismaClient` instance |
| Queries | Raw SQL strings | Type-safe Prisma methods |
| Schema | Only in DB | Defined in `prisma/schema.prisma` |
| Models | No type safety | Auto-generated TypeScript types |
| Migrations | Manual SQL | `prisma migrate dev` |
| Introspection | Not available | `prisma db pull` |

## Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/d5b4bc02-730d-4752-b180-41d7d361f231" alt="index.js with Prisma" width="32%" />
  <img src="https://github.com/user-attachments/assets/373ef90b-39b4-460f-8192-0cc9d2b23f9a" alt="schema.prisma" width="32%" />
  <img src="https://github.com/user-attachments/assets/51611930-9dad-4811-a7a3-f97703152d93" alt="Prisma Terminal" width="32%" />
</p>

<p align="center">
  <b>server/index.js — Prisma implementation</b> |
  <b>server/prisma/schema.prisma — Auto-generated models</b> |
  <b>Backend connected via Prisma</b>
</p>
