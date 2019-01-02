//require("prismjs/themes/prism-solarizedlight.css")
//require("prismjs/themes/prism-tomorrow.css")
//require("prismjs/themes/prism-dark.css")
//require("prismjs/themes/prism-okaidia.css")

// function routeUpdateListener(){
//   const listeners = []
//   return {
//     listen: (f)=> listeners.push(f),
//     fire: (pathname) => listeners.forEach(l=>l(pathname))
//     }
// }
// const l = routeUpdateListener();

//exports.onRouteUpdate = ({location}) => {
// exports.onPreRouteUpdate  = ({location}) => {
//   console.log('new pathname', location.pathname)
//   l.fire(location.pathname);
// }
// exports.onRouteUpdate  = ({location}) => {
//   console.log('Route Update', location.pathname)
// }
//exports.routeUpdateListener = l;

exports.onServiceWorkerUpdateFound = () => {
  const answer = window.confirm(
    `This application has been updated. ` +
      `Reload to display the latest version?`
  )

  if (answer === true) {
    window.location.reload()
  }
  //window.location.reload()
}