import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 1, // 1 hour in milliseconds
    },
  },
});

export default queryClient;
/*
The lines below are for persisting the queryClient to localStorage.
Check if the window object is defined before accessing localStorage
to avoid errors when running in non-browser environments.
*/

// const sessionStoragePersister = createSyncStoragePersister({ storage: window.sessionStorage })
