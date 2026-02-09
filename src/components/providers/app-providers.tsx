"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

// function LazyCardanoProvider({ children }: { children: React.ReactNode }) {
//   const [Provider, setProvider] = useState<React.ComponentType<{
//     children: React.ReactNode;
//   }> | null>(null);

//   useEffect(() => {
//     import("@meshsdk/react").then((mod) => {
//       setProvider(() => mod.MeshProvider);
//     });
//   }, []);

//   if (!Provider) return <>{children}</>;
//   return <Provider>{children}</Provider>;
// }

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {/* <LazyCardanoProvider> */}
          {children}

          <Toaster
            position="top-right"
            expand
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast: "font-sans",
                title: "font-medium",
                description: "text-sm",
              },
            }}
          />
        {/* </LazyCardanoProvider> */}
      </ThemeProvider>
    </QueryClientProvider>
  );
}