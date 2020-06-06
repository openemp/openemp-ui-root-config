import { registerApplication, start } from "single-spa";

const showWhenAnyOf = (routes) => {
  return (location) => {
    return routes.some((route) => location.pathname === route);
  };
};

const showWhenPrefix = (routes) => {
  return (location) => {
    return routes.some((route) => location.pathname.startsWith(route));
  };
};

const showExcept = (routes) => {
  return (location) => {
    return routes.every((route) => location.pathname !== route);
  };
};

System.import("@openemp-mf/navbar").then((app) => {});

Promise.resolve()
  .then(() => {
    registerApplication({
      name: "@openemp-mf/navbar",
      app: () => System.import("@openemp-mf/navbar"),
      activeWhen: showExcept(["/login", "/signup"]),
    });
    registerApplication({
      name: "@openemp-mf/login",
      app: () => System.import("@openemp-mf/login"),
      activeWhen: showWhenAnyOf(["/login"]),
    });
  })
  .then(() => {
    registerApplication({
      name: "@openemp-mf/template",
      app: () => System.import("@openemp-mf/template"),
      activeWhen: showWhenPrefix(["/template"]),
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

start({
  urlRerouteOnly: true,
});
