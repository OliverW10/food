# Food

expo w/ rsc (react server components)
prisma (the ORM)

# Setup

<https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=expo-go>
Add the {android sdk dir}/emulator & /platform-tools to the Path, and ANDROID_HOME
?? Install previous version of sdk 15 (got some error about bad file version 68)
looks like the gradle version that its using (8.13) isn't supported by java 24 (min 8.14), installing jdk 21

todo:

- get local android emulator dev cycle working
- get test deploy to ios working
- setup rsc
- setup prisma and docker + compose
- setup CI w/ ios builds
