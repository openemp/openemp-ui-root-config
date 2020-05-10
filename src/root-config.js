import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@openemp-mf/dashboard",
  app: () => System.import("@openemp-mf/dashboard"),
  activeWhen: "/",
});

start();
