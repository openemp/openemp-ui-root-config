import { registerApplication, start, setMountMaxTime } from "single-spa";
import { createNanoEvents } from "nanoevents";

// Global object to emit UI events between microfrontends
window.emitter = createNanoEvents();
window.appMount = new Promise((resolve, reject) => {
  window.appMountSuccess = resolve;
  window.appMountFail = reject;
});

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

// Pass Json config from Webpack
const serviceConfig = __ServiceConfig__;

setMountMaxTime(1000, true, 10000);

registerApplication({
  name: "@openemp-mf/core",
  app: () => System.import("@openemp-mf/core"),
  activeWhen: showExcept(["/login", "/signup"]),
});
registerApplication({
  name: "@openemp-mf/login",
  app: () => System.import("@openemp-mf/login"),
  activeWhen: showWhenAnyOf(["/login"]),
});
serviceConfig.map((service) => {
  registerApplication({
    name: service.name,
    app: () => System.import(service.app),
    activeWhen: showWhenPrefix(service.routes),
  });
});
/* 
  In case we want to do some work related to life cycle of single-spa application
  we use events that provided by single-spa please refer to:
  https://single-spa.js.org/docs/api#events
*/

// window.addEventListener("popstate", (evt) => {
//   if (evt.singleSpa) {hamine
//     console.log(
//       "This event was fired by single-spa to forcibly trigger a re-render"
//     );
//     console.log(evt.singleSpaTrigger); // pushState | replaceState
//   } else {
//     console.log("This event was fired by native browser behavior");
//   }
// });

start();
