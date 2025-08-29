import { createTRPCClient, httpBatchLink } from '@trpc/client';
import Constants from 'expo-constants';
import type { AppRouter } from '../../server/src/main';
const configuredServerUrl = Constants.expoConfig?.extra!.apiUrl;
const expoServerIp = Constants.expoConfig?.hostUri?.split(":")[0]
const expoServerUrl = expoServerIp !== undefined ? `http://${expoServerIp}:3000` : undefined;
const localhostServerUrl = `http://localhost:3000`;
const serverUrl = configuredServerUrl ?? expoServerUrl ?? localhostServerUrl;
console.log(serverUrl);
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: serverUrl,
    }),
  ],
});

export default trpc;
export { serverUrl };

