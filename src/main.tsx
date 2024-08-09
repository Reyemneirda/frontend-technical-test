import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./config/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticationProvider } from "./contexts/authentication";
import { InnerApp } from "./page-content/InnerApp.lazy";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <AuthenticationProvider>
            <InnerApp />
          </AuthenticationProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
