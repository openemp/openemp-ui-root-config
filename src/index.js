import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@openemp-mf/dashboard",
  app: () => import("@openemp-mf/dashboard/index"),
  activeWhen: "/",
});

start();
