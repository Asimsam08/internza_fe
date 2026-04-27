"use client"

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { persistQueryClient } from "@tanstack/react-query-persist-client"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"

// Create a client instance that will be shared across the app
let browserQueryClient: QueryClient | undefined = undefined

function makeQueryClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Retry failed requests up to 3 times
        retry: 3,
        // Retry with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't refetch on window focus to reduce unnecessary requests
        refetchOnWindowFocus: false,
        // Garbage collect data after 10 minutes
        gcTime: 10 * 60 * 1000,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
        // Retry with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  })

  return client
}

function makeQueryClientWithPersistence() {
  const client = makeQueryClient()

  // Persist the query cache to localStorage (only on client)
  if (typeof window !== "undefined") {
    const persister = createSyncStoragePersister({
      storage: window.localStorage,
      key: "internza-query-cache",
    })
    persistQueryClient({
      queryClient: client,
      persister,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  }

  return client
}

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a new client without persistence
    return makeQueryClient()
  } else {
    // Browser: use existing client or create new one with persistence
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClientWithPersistence()
      // Store on window for access from authStore
      ;(window as any).__REACT_QUERY_CLIENT__ = browserQueryClient
    }
    return browserQueryClient
  }
}

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
        />
      )}
    </TanStackQueryClientProvider>
  )
}
