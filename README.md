# Choppd

## Instructions to run:

To run this app (basic, web mode), you'll need Node.js (22+ recommended), Docker/Podman for PostgreSQL, and npm.

- First, install dependencies with `npm i` in the project roots (frontend and backend)
- Start the database with `podman compose -f docker-compose.yaml up -d` (or use Docker)
- Run `npx prisma migrate dev` in `server/src/prisma/` to set up the database schema
- Run `npm run dev` in both the `server` and `client` directories to start the backend and frontend
- For AI use, place an open AI API key in the .env file in the server

## What is Choppd?

Choppd is a social media platform for people to connect over what they make and eat.

Choppd is a full-stack food social media where users can share their food experiences, follow other users, and discover new recipes and restaurants. It is built with Expo/React Native for the mobile client and a tRPC backend with Prisma and Postgres.

## Features

### Food Sharing

- Share your food experiences with posts
- Upload food photos with automatic processing
- Write descriptions about your cooking or dining experiences

### Social Features

- View profiles with post counts, followers, and following statistics
- Follow people and build your network
- For your feed, you can switch between "Following" (posts from users you follow) and "Explore" (discover new content)
- Search and discover new users by name or email
- View your social connections (followers/following)

### Engagement

- Like and unlike posts with counter updates
- Comment on posts and start discussions
- Infinite scroll feed

### AI Assistant Chatbot Josh

- Built-in AI chatbot powered by OpenAI
- Get food advice and cooking tips and recommendations

### Authentication/Security Features

- Secure registration and login
- Authenticated endpoints with proper authorization
- Persistent login sessions with refresh tokens
- Bcrypt password hashing and validation

## Technology Stack

### Frontend (Client)

- Expo
- Typescript
- tRPC
- Expo Router

### Backend (Server)

- Node + Express
- tRPC
- Prisma ORM
- Postgres

### Database Schema

- see prisma.client

## General setup

1. If you don't already have nodejs installed (tested with 22 & 24), install it ([nvm](https://github.com/coreybutler/nvm-windows) is very good), then do `npm i` in the project root to install the packages for both the backend and frontend.

1. Setup database.
   - Use the docker-compose.yml to run the database, you cant install docker desktop on work laptops so I use podman instead. You can also used docker through WSL, but had some issue with network access with that.
   - Install podman desktop and podman compose. PgAdmin is also helpful to have
   - Run `podman compose -f docker-compose.yaml up -d`
1. Run `npx prisma migrate dev` in `server/src/prisma/` to apply the schema to the database and generate prisma client files

You should then be able to run `npm run dev` in both the server and client directories and use the website version of the app. To use an emulator follow the below instuctions.

## Setup (Windows with Android enumlator/web)

Follow: <https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=expo-go>

tldr:
Install android studio, add a virtual phone (i used pixel 9a), add ANDROID_HOME env var, and add /emulator & /platform-tools to the Path

It looks like the gradle version that it's using (8.13) isn't supported by java 24 (min 8.14), installing jdk 21 (and fixing JAVA_HOME) seems to have fixed it.
I also installed the previous version of sdk (15) when trying to fix "bad file version 68" error, but i think it was just fixed by using jdk 21

Run the android emulator. It appears that it does not work while connected to the work VPN, i suspect because it creates a local network that conflicts.

## Setup (IOS Dev build on phone)

It looks like its possible to setup a github action to create an ios build (`xcodebuild` on gh macos runner) and then run it with testflight. Will need to work out having multiple deployed versions, will probably get k8's running on my vps

<https://docs.expo.dev/guides/local-app-development/#local-app-compilation>

# Convenient Prisma Scripts:

- when the db is not up to date with the schema and you want to keep the data: `npx prisma migrate dev --name your_migration_name`
- when the db is not up to date with the schema and you don't care about the data: `npx prisma db push --force-reset` or `npx prisma migrate reset`
- for viewing db in web: `npx prisma studio`

## App Structure

### Client (`/client`)

- Authentication, home feed, create post, profile, search, settings
- Tests: Component testing with Jest and React Native

### Server (`/server`)

- API endpoints (auth, posts, profiles, search, comments, chat)
- Prisma schema with migrations and seeding

# TODOS:

- authorized routes reject when not signed in, send to auth page
- auto refresh access token when api call fails with 401
- decode and store user info from jwt in fe so i can access user id and email without extra api calls
- mfa setup
- store jwt in db, and revoke on logout
- email verification after signup
- logout of all devices slay
- profile pictures/avatars
- push notifications for likes and comments
- advanced search and filtering
- food categories and tagging system
- restaurant/location tagging
- recipe sharing with ingredients and instructions
- meal planning features
- dietary restriction filters

# Group Member Feature Breakdown

Rianna -> Comments (validate empty), Feed

- [`client/components/CommentsSheet.tsx`](client/components/CommentsSheet.tsx)
- [`server/src/controllers/comments-api.ts`](server/src/controllers/comments-api.ts)
- [`client/app/home.tsx`](client/app/home.tsx)

Josh -> Profile Page, Followers/Following

- [`client/app/profile/[userId].tsx`](client/app/profile/[userId].tsx)
- [`client/components/profile/`](client/components/profile/)
- [`client/app/followers.tsx`](client/app/followers.tsx)
- [`client/app/following.tsx`](client/app/following.tsx)

Olivia -> Posting page, Post view page (validate post contents)

- [`client/app/create-post.tsx`](client/app/create-post.tsx)
- [`client/app/post/[postId].tsx`](client/app/post/[postId].tsx)
- [`client/components/FoodPost.tsx`](client/components/FoodPost.tsx)

Mukund :D -> Signup, Login, Likes (validate password creation), Chatbot

- [`client/app/auth.tsx`](client/app/auth.tsx)
- [`server/src/controllers/auth-api.ts`](server/src/controllers/auth-api.ts)
- [`server/src/controllers/post-api.ts`](server/src/controllers/post-api.ts) (likeToggle)
- [`client/components/ChatBot.tsx`](client/components/ChatBot.tsx)
- [`server/src/controllers/chat-api.ts`](server/src/controllers/chat-api.ts)

Oliver -> Search, Settings page (validate new name) (oliver also set up the repo which was a huge help to our team, even though it is not recognized here)

- [`client/app/search.tsx`](client/app/search.tsx)
- [`server/src/controllers/search-api.ts`](server/src/controllers/search-api.ts)
- [`client/app/settings.tsx`](client/app/settings.tsx)
