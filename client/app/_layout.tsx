import { Stack } from "expo-router";

import { Fab, FabIcon } from "@/components/ui/fab";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AddIcon } from "@/components/ui/icon";
import "@/global.css";

export default function RootLayout() {
  return <GluestackUIProvider mode="light">
      <Fab
        size="lg"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
      >
        <FabIcon as={AddIcon} />
      </Fab>
    <Stack />
  </GluestackUIProvider>;
}
