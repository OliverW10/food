# Choppd

Stack:

- expo w/ rsc (react server components)
- prisma orm + postgres

## Setup (Windows with Android enumlator/web)

Follow: <https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=expo-go>

tldr:
Install android studio, add ANDROID_HOME env var, and add /emulator & /platform-tools to the Path

It looks like the gradle version that it's using (8.13) isn't supported by java 24 (min 8.14), installing jdk 21 (and fixing JAVA_HOME) seems to have fixed it.
I also installed the previous version of sdk (15) when trying to fix "bad file version 68" error, but i think it was just fixed by using jdk 21

Run the android emulator. It appears that it does not work while connected to the work VPN, i suspect because it creates a local network that conflicts.

Run `npx expo run:android` then press a

For some reason I get `TypeError: The "readableStream" argument must be an instance of ReadableStream. Received an instance of ReadableStream` when putting 'use server'; at the top of the file instead of in each server function/component

## Setup (IOS Dev build on phone)

It looks like its possible to setup a github action to create an ios build (`xcodebuild` on gh macos runner) and then run it with testflight. Will need to work out having multiple deployed versions, will probably get k8's running on my vps

### Todo

- ~~get local android emulator dev cycle working~~
- ~~setup rsc~~
- ~~setup prisma~~ and docker + compose (<https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-postgresql>)
- auth
    There is documented functionality to add middleware <https://docs.expo.dev/router/reference/middleware/> however it was only added literally a [couple days ago](https://github.com/expo/expo/pull/38330), so I think we should implement it as just a function we call in every server action, then swap to middleware when it gets released
- get test deploy to ios working
