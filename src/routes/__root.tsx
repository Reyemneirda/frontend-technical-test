import { createRootRouteWithContext } from "@tanstack/react-router";
import { AuthenticationState } from "../contexts/authentication";
import RootComponent from "./rootComponent";

type RouterContext = {
  authState: AuthenticationState;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});
