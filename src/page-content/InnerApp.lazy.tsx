import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { useAuthentication } from "../hooks/useAuthentication";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { authState: { isAuthenticated: false } },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function InnerApp() {
  const { state } = useAuthentication();
  return <RouterProvider router={router} context={{ authState: state }} />;
}
