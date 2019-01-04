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
  
  // console.log("Adding listeners",o)
  

  // self.addEventListener('fetch', function(evt) {
  //   console.log("EVT",evt.request);
  //   return evt.request;
    
  // });
  const answer = window.confirm(
    `This application has been updated. ` +
      `Reload to display the latest version?`
  )

  if (answer === true) {
    window.location.reload()

    
  }
  
  //window.location.reload()
}