import { registerApplication, start } from "single-spa";

Promise.resolve()
  .then(() => {
    registerApplication({
      name: "@openemp-mf/drawer",
      app: () => System.import("@openemp-mf/drawer"),
      activeWhen: "/",
    });
  })
  .then(() => {
    registerApplication({
      name: "@openemp-mf/navbar",
      app: () => System.import("@openemp-mf/navbar"),
      activeWhen: "/",
    });
    registerApplication({
      name: "@openemp-mf/template",
      app: () => System.import("@openemp-mf/template"),
      activeWhen: "/template",
    });
  });

// eslint-disable-next-line no-restricted-syntax

// window.addEventListener("popstate", (evt) => {
//   if (evt.singleSpa) {
//     console.log(
//       "This event was fired by single-spa to forcibly trigger a re-render"
//     );
//     console.log(evt.singleSpaTrigger); // pushState | replaceState
//   } else {
//     console.log("This event was fired by native browser behavior");
//   }
// });
start();
