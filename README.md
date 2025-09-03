# Choppd

Expo client app, tRPC backend with prisma and postgreSql

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

# TODOS:
- auto refresh access token when api call fails with 401
- decode and store user info from jwt in fe so i can access user id and email without extra api calls
- mfa setup
- store jwt in db, and revoke on logout
- email verification after signup
- logout of all devices slay