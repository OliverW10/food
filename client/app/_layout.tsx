import { Fab, FabIcon } from "@/components/ui/fab";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AddIcon } from "@/components/ui/icon";
import "@/global.css";
import { router, Stack } from "expo-router";
import { createContext } from "react";

export const UserContext = createContext(null);
  
export default function RootLayout() {
  return <GluestackUIProvider mode="light">
    <Stack />
    <Fab
      size="lg"
      placement="bottom right"
      isHovered={false}
      isDisabled={false}
      isPressed={false}
      onPress={() => {
        router.push("/post");
      }}
    >
      <FabIcon as={AddIcon} />
    </Fab>
  </GluestackUIProvider>;
}
