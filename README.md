# BUSAhero — Fare Metrics & Fare CRUD (Next.js mockup)

A working Next.js/React mockup that pairs with your existing Firebase
Realtime Database bus-tracking setup. It adds:

- **Dashboard** — live bus positions/status pulled from `/buses/{region}/{busId}`
  (the same structure as your `bustrackingsystem-24baf` export), plus a fare
  metrics panel (active buses, routes priced, avg. fare, estimated revenue).
- **Fares page** — full CRUD (create, read, update, delete) for a `/fares`
  node: route name, regular fare, discounted (student/senior) fare.

## Running it

```bash
npm install
cp .env.local.example .env.local   # then fill in your Firebase web config
npm run dev
```

Open http://localhost:3000.

**If you don't fill in `.env.local`**, the app still runs — it falls back to
a simulated bus feed and in-memory fare list (seeded with 3 sample routes) so
you can click through the whole flow without any backend. Once you add your
real Firebase config, it automatically switches to live data (you'll see the
top-right pill change from "DEMO DATA" to "LIVE · FIREBASE").

## Where to get the Firebase values

Firebase console → Project settings → General → "Your apps" → the web app's
SDK config object. `NEXT_PUBLIC_FIREBASE_DATABASE_URL` should be your RTDB
URL, e.g. `https://bustrackingsystem-24baf-default-rtdb.firebaseio.com`.

## Data model

```
buses/
  north/
    bus1/ { latitude, longitude, satellites, speed, status, updatedAt }
  south/
    bus2/ { latitude, longitude, satellites, speed, status, updatedAt }

fares/
  <auto-id>/ { route, regular, discounted, updatedAt }
```

The dashboard only *reads* `/buses` (your GPS device/app should keep writing
to it as before). The Fares page reads and writes `/fares`.

## Suggested Firebase Realtime Database rules (starting point)

Buses stay read-only from the client, fares are only editable by
authenticated operators. Tighten as needed once you add Firebase Auth:

```json
{
  "rules": {
    "buses": {
      ".read": true,
      ".write": false
    },
    "fares": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

## Notes on the "fare metrics" numbers

There's no ticketing/passenger-count data in your current Firebase schema,
so **estimated daily revenue** on the dashboard is a projection
(`active buses × assumed trips/day × assumed riders/trip × avg. regular
fare`) clearly labeled as an estimate — swap in real trip/ticket counts from
your ticketing system when you have them (see `ASSUMED_TRIPS_PER_BUS_PER_DAY`
and `ASSUMED_PASSENGERS_PER_TRIP` in `app/page.js`).

## Structure

```
app/
  layout.js        Root layout (fonts, shell)
  page.js          Dashboard: live buses + fare metrics
  fares/page.js    Fare CRUD page
components/
  Sidebar.js, Topbar.js, StatCard.js, Toast.js
  BusStatusList.js Realtime bus list
  FareTable.js, FareModal.js
lib/
  firebase.js          Firebase app/db init
  useRealtimeBuses.js  Hook: subscribes to /buses (or simulates if no config)
  useFares.js          Hook: CRUD on /fares (or local state if no config)
```
