# Choppd

Stack:

- expo w/ rsc (react server components)
- prisma orm + postgres

## General setup

Use docker compose to run the database, you cant install docker desktop on work laptops so I use podman instead. I have also used docker through wsl before but had some issue with network access.

With podman compose installed I do `podman compose -f docker-compose up -d`, if you are using docker engine instead of podman (i.e. personal computer or wsl) then it would be the same command but with `docker` instead of `podman`

Then run `npx prisma migrate dev` to apply the schema to the database

## Setup (Windows with Android enumlator/web)

Follow: <https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=expo-go>

tldr:
Install android studio, add a virtual phone (i used pixel 9a), add ANDROID_HOME env var, and add /emulator & /platform-tools to the Path

It looks like the gradle version that it's using (8.13) isn't supported by java 24 (min 8.14), installing jdk 21 (and fixing JAVA_HOME) seems to have fixed it.
I also installed the previous version of sdk (15) when trying to fix "bad file version 68" error, but i think it was just fixed by using jdk 21

Run the android emulator. It appears that it does not work while connected to the work VPN, i suspect because it creates a local network that conflicts.

Run `npx expo start`

## Setup (IOS Dev build on phone)

It looks like its possible to setup a github action to create an ios build (`xcodebuild` on gh macos runner) and then run it with testflight. Will need to work out having multiple deployed versions, will probably get k8's running on my vps

<https://docs.expo.dev/guides/local-app-development/#local-app-compilation>

# Notes

I am getting the message `ERROR  Warning: A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.` when using any server component like `<Component />` but not when its like `{Component()}`, I am pretty sure its not in a client component but I am not sure what the difference between a server component and server action that returns jsx is. Despite the it saying error it appears to just a warning and seems to work fine but I will use `{Component()}` anyway

### Todo

- ~~get local android emulator dev cycle working~~
- ~~setup rsc~~
- ~~setup prisma~~ and docker + compose (<https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-postgresql>)
- auth
    There is documented functionality to add middleware <https://docs.expo.dev/router/reference/middleware/> however it was only added literally a [couple days ago](https://github.com/expo/expo/pull/38330), so I think we should implement it as just a function we call in every server action, then swap to middleware when it gets released
- get test deploy to ios working
