# Hospital & Pharmacy Management System

Combined MongoDB/Express backend covering patient care and pharmacy dispensing in one database.

## Collections & Relationships

- **patients** — core patient records
- **staff** — doctors, nurses, pharmacists, admins
- **appointments** → refs `patients`, `staff`
- **medicalRecords** → refs `patients`, `staff`
- **medicines** — drug catalog (prices in GH₵)
- **inventory** → refs `medicines` (batch/expiry tracked, FEFO dispensing)
- **prescriptions** → refs `patients`, `staff`, `medicines`
- **sales** → refs `prescriptions`, `patients`, `staff`, `medicines`

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your Atlas connection string (remember: URL-encode `@` in your password as `%40`)
3. `npm run seed` — loads sample staff, patients, medicines, and inventory batches
4. `npm run dev` — starts server on port 5000 (needs `nodemon` installed, or use `npm start`)

## Key Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/prescriptions/:id/dispense` | Deducts stock (oldest batch first), creates a Sale, marks prescription Dispensed — runs as a transaction |
| `GET /api/inventory/alerts/low-stock` | Medicines whose total stock is below reorder level |
| `GET /api/inventory/alerts/expiring-soon?days=90` | Batches expiring within N days |
| `GET /api/sales/reports/daily` | Revenue grouped by day |
| `GET /api/sales/reports/top-medicines?limit=5` | Best-selling medicines by quantity |

All other resources (`patients`, `staff`, `appointments`, `medical-records`, `medicines`, `sales`) support standard `GET / GET :id / POST / PUT / DELETE`, with pagination via `?page=&limit=`.

## Postman

Import `postman/Hospital-Pharmacy.postman_collection.json`. It has a `baseUrl` variable (defaults to `http://localhost:5000/api`) and placeholder variables (`patientId`, `staffId`, `medicineId`, `prescriptionId`) you fill in from your create-responses as you test.

**Suggested test flow:** Create a Staff (doctor) → Create a Patient → Create a Medicine → Add Inventory batch for it → Create a Prescription referencing that patient/doctor/medicine → Dispense it → check `GET /api/inventory` (stock reduced) and `GET /api/sales` (sale created).

## Note on transactions

`/dispense` uses a MongoDB session/transaction, which requires a replica set — Atlas clusters (including free tier) are replica sets by default, so this works out of the box on your `cluster0.igrzdsl.mongodb.net` setup.
