import { createTRPCClient, httpBatchLink } from '@trpc/client';
import Constants from 'expo-constants';
import type { AppRouter } from '../../server/src/index';
const serverUrl = Constants.expoConfig?.extra!.apiUrl ?? `http://${Constants.expoConfig?.hostUri?.split(":")[0]}:3000`;
console.log(serverUrl);
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: serverUrl,
    }),
  ],
});
export default trpc;
