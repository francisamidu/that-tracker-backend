# Parcel Tracker Backend API

This is the backend API for the Parcel Tracker application. It provides endpoints to track parcel shipments using third-party APIs and supports webhook integrations. Built with Node.js, Express, and TypeScript.

## Features
- Track parcels by tracking number via `/api/track` endpoint
- Integrates with Ship24 and RapidAPI for tracking data
- Webhook endpoint for receiving shipment updates
- CORS configured for frontend integration
- Secure environment variable management

## Tech Stack
- **Node.js**
- **Express.js**
- **TypeScript**
- **Axios** (for HTTP requests)
- **dotenv** (for environment variables)
- **CORS**

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation
```bash
# Install dependencies
pnpm install
# or
npm install
```

### Running the Server
```bash
# Development mode (with hot reload)
pnpm run dev
# or
npm run dev

# Production build
pnpm run build
pnpm start
```

The server will run on the port specified in your `.env` file, defaulting to **3001** if not set.

## Environment Variables
Create a `.env` file in the project root with the following variables:

```
PORT=3001
RAPID_API_KEY=your_rapidapi_key
RAPID_API_HOST=your_rapidapi_host
RAPID_API_AUTH=your_rapidapi_auth
SHIP_API_KEY=your_ship24_api_key
SHIP_WEBHOOK_SECRET=your_webhook_secret
```

## API Endpoints

### Track Parcel
- **GET** `/api/track?tracking_number=TRACKING_NUMBER`
- **Description:** Fetch tracking information for a parcel.
- **Query Params:**
  - `tracking_number` (required): The parcel's tracking number.
- **Headers:**
  - `Authorization: Bearer <SHIP_API_KEY>` (set automatically from env)
- **Response:** JSON with tracking details or error message.

#### Example Request
```http
GET /api/track?tracking_number=1234567890
```

### Webhook Endpoint
- **POST** `/api/webhook`
- **Description:** Endpoint to receive webhook notifications (e.g., from Ship24).
- **Body:** JSON payload as sent by the webhook provider.
- **Response:** 200 OK on receipt.

## CORS
The backend is configured to allow requests from:
- `http://localhost:3000` (local frontend)
- Your deployed Netlify frontend domain

## Development Scripts
- `pnpm run dev` — Start in development mode with hot reload
- `pnpm run build` — Compile TypeScript
- `pnpm start` — Run compiled server

## License
This project is licensed under the ISC License.

## Contributing
Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

---

For questions or support, please contact the maintainer.
