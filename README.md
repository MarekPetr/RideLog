# RideLog

Track your bike rides, monitor your progress, and visualize your daily riding trends.

## Features

- 🚴 **Log Rides**: Record distance, duration, and notes for each ride
- 📊 **View All Rides**: Browse, edit, and manage your complete ride history
- 📈 **Track Progress**: Visualize your daily riding trends with interactive charts
- 🔐 **User Authentication**: Secure login and registration system
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Recharts** for data visualization
- **next-intl** for internationalization (English & Czech)
- **axios** for API calls

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **MongoDB** with Mongoose
- **JWT** authentication
- **bcryptjs** for password hashing

## Project Structure

```
RideLog/
├── client/          # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities, API clients, contexts
│   │   └── ...
│   └── package.json
└── server/          # Express backend
    ├── src/
    │   ├── models/         # Mongoose models
    │   ├── routes/         # API routes
    │   ├── controllers/    # Route controllers
    │   ├── middleware/     # Auth middleware
    │   └── config/         # Database config
    └── package.json
```

## Local Development Setup

### Prerequisites
- **Node.js** 18+ and **pnpm** installed
- **MongoDB** running locally or MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd RideLog
```

### 2. Backend Setup

```bash
cd server
pnpm install

# Create .env file
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ridelog
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ridelog
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:3000
```

Start the backend:
```bash
pnpm run dev
```

The API will be running at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
pnpm install

# Create .env file
cp .env.local.example .env.local
```

Edit `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
# Set to 'true' to use Next.js proxy (recommended to avoid CORS in development)
# Set to 'false' to make direct API calls
NEXT_PUBLIC_USE_PROXY=true
```

Start the frontend:
```bash
pnpm run dev
```

The app will be running at `http://localhost:3000`

## Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Set environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://your-api.onrender.com/api`)
5. Deploy

### Backend Deployment (Render/Railway)

#### Using Render.com

1. Go to [Render](https://render.com) and create a new Web Service
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd server && pnpm install && pnpm run build`
   - **Start Command**: `cd server && pnpm start`
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `CLIENT_URL`: Your deployed frontend URL (e.g., `https://your-app.vercel.app`)
   - `PORT`: 5000 (or leave default)
5. Deploy

#### Using Railway.app

1. Go to [Railway](https://railway.app)
2. Create a new project from GitHub repo
3. Add environment variables (same as above)
4. Deploy

### Database (MongoDB Atlas - Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist IP addresses (or use 0.0.0.0/0 for all)
5. Get your connection string and add it to your backend environment variables

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Rides (Protected)
- `GET /api/rides` - Get all user rides
- `POST /api/rides` - Create new ride
- `PUT /api/rides/:id` - Update ride
- `DELETE /api/rides/:id` - Delete ride
- `GET /api/rides/stats` - Get ride statistics

## Development Scripts

### Frontend
```bash
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm run start    # Start production server
pnpm run lint     # Run ESLint
```

### Backend
```bash
pnpm run dev      # Start with nodemon (hot reload)
pnpm run build    # Compile TypeScript
pnpm run start    # Start compiled version
```

## Future Enhancements

- [x] Internationalization (Czech + English translations with next-intl)
- [ ] Dark mode toggle
- [ ] Export rides to CSV
- [ ] Ride categories (commute, exercise, leisure)
- [ ] Weather data integration
- [ ] Route mapping with GPS data
- [ ] Social features (share rides)
- [ ] Mobile app (React Native)

## License

MIT License - see LICENSE file for details

## Author

Petr Marek - 2025
