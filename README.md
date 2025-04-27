# Kratos Workout Tracker

A simple workout tracker built with Next.js that allows users to sign up, sign in, and track their lifting workouts. The goal is to help users track their progress and set personalized fitness goals.

## Features
- **User Authentication:** Sign up and sign in functionality.
- **Workout Tracking:** Track your lifting workouts and set goals (future features).

## Installation
1. Clone the repository:
```bash
git clone kratos
cd kratos
```
2. Install dependencies:
```bash
npm install
```
3. Run the application locally:
```bash
npm run dev
```
4. Open the application:
Visit `http://localhost:3000` in your browser

## Project Setup
### Environment Variables
This project uses environment variables for connecting to MongoDB. Create a `.env.local` file in the root directory and add the following:
```bash
NEXT_PUBLIC_MONGO_URI=<your-mongo-uri>
AUTH_SECRET=<your-secret-key>
```

## Live Application Deployed on Vercel
[Kratos.com](https://kratos-tan.vercel.app/)
