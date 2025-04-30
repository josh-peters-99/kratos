# Kratos Workout Tracker

A full-stack web application for tracking workouts, personal bests, workout plans, and user metrics.

Built with:
- **Frontend:** Next.js (App Router, JavaScript)
- **Backend:** API routes inside Next.js
- **Database:** MongoDB Atlas
- **Authentication:** NextAuth (Credentials provider)

## 🚀 Features
- User authentication (Sign up / Sign in with username and password)
- Create and track workouts
- Save reusable exercises
- Track personal history for each exercise
- Dynamic workout form (supports cardio, weightlifting, bodyweight, and timed exercises)
- Responsive and mobile-friendly design

## 🧰 Technologies Used
- Next.js (App Router)
- MongoDB Atlas (Cloud Database)
- NextAuth.js (Authentication)
- TailwindCSS (Styling)
- Jest (Testing)
- ShadCN UI (Components)

## 🗺️ API Routes
| Method | Endpoint | Description
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create a new user account                |
| `GET`  | `/api/workouts`    | Fetch all workout for the signed-in user |
| `POST` | `/api/workouts`    | Create a new workout                     |
| `GET`  | `/api/exercises`   | Fetch an exercise                        |
| `POST` | `/api/exercises`   | Create a new exercise                    |
| `GET`  | `/api/exercises/search-names` | Searches exercises during search |
| `PUT`  | `/api/user/[id]`   | Edit the user profile data               |
| `GET`  | `/api/userMetrics` | Fetch a user's metrics                   |


## 🔒 Authentication
- Passwords are securely hashed using bcrypt before being stored.
- Sessions are managed using **NextAuth JWT tokens.**
- Protected API routes require authentication to access user data.

## 📦 Setup Instructions
1. Clone the repository
```bash
git clone https://github.com/josh-peters-99/kratos.git
cd kratos
```
2. Install dependencies
```bash
npm install
```
3. Set up environment variables
  - Create a `.env.local` file in the root directory with the following:
```bash
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```
4. Run the app locally
```bash
npm run dev
```
5. Visit [http://localhost:3000](http://localhost:3000) to view the app.

## 🧪 Testing
Run unit tests:
```bash
npm run test
```

## 📚 Future Improvements
- Advanced workout analytics and graphs
- Save reusable workout templates
- Plan structured weekly workouts
- Track total workouts (weekly, mongthly, yearly, all-time)
- Social fetaures
- Workout history calendar view
- Notifications/reminders for planned workouts

## ☁️ Live Application Deployed on Vercel
[Kratos.com](https://kratos-tan.vercel.app/)

## 📄 License
This project is licensed under the MIT license.
