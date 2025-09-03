import { useSession } from "@/hooks/user-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const stack = createNativeStackNavigator();

export default function Index() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        router.replace("/HomeScreen");
      } else {
        router.replace("/AuthScreen");
      }
    }
  }, [session, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    )
  }

  return null;
}
// function RootNavigator() {
//   const { session, isLoading } = useSession();

//   if (isLoading) {
//     return null;
//   }

//   return (
//     <stack.Navigator>
//       {session ? (
//         <>
//           <stack.Screen name="Home" component={HomeScreen} />
//         </>
//         ) : (
//           <stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }}/>
//         )}
//     </stack.Navigator>
//   )
// }

// export default function App() {
//   return (
//     <SessionProvider>
//       <Slot />
//     </SessionProvider>);
// }