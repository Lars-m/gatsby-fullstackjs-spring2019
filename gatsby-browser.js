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

exports.onServiceWorkerUpdateFound = (o) => {
  console.log("SW",JSON.parse(JSON.stringify(o)))
  console.log("SW2",o)
  // const answer = window.confirm(
  //   `This application has been updated. ` +
  //     `Reload to display the latest version?`
  // )
  const answer = true;
  if (answer === true) {
    window.location.reload(true)  
  }
}
exports.onServiceWorkerUpdateFound = (o) => {
  console.log("OnServiceWorkerUpdateFound",0);
  window.location.reload(true)  ;
  var notification = new Notification("App was updated", {body: "Refresh your browser to get new content"});
  //setTimeout(function() {notification.close()}, 1000);
}