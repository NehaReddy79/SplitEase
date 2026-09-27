# SplitEase 

A full-stack expense-splitting app that calculates simplified group settlements using a greedy debt-minimization algorithm, with real-time updates and two-sided payment verification.

**Live Demo:** [split-ease-ten.vercel.app](https://split-ease-ten.vercel.app)

---


## What makes this different

- **Two-sided settlement verification** — a payment only updates balances after the *recipient* confirms it, with support for partial payments validated against live balances
- **Real-time sync** — expense and settlement changes push instantly to everyone viewing a group via Socket.io
- **Debt simplification algorithm** — a greedy approach that collapses a group's tangled IOUs into the minimum number of transactions needed to settle up (at most *n − 1* for *n* people)
- **Authorization** — every group action checks membership/ownership, not just a valid login

## Features

Auth (JWT + rate limiting) · Groups (create, add members, leave) · Expenses (equal/exact/percentage splits, categories, edit/delete, search & filter) · Balances & settlements · Analytics (charts by category/person) · CSV export

## Tech Stack

**Frontend:** React (Vite), React Router, Axios, Socket.io-client, Recharts <br>
**Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, bcrypt <br>
**Deployed on:** Vercel · Render · MongoDB Atlas <br>



## Running Locally

**Backend**
```bash
cd backend
npm install
# .env: MONGO_URI, JWT_SECRET, PORT
npm start
```

**Frontend**
```bash
cd frontend
npm install
# .env: VITE_API_URL=http://localhost:5000
npm run dev
```

---


