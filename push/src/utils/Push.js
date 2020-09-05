const publicVapidKey =
  "BIMSlZfuSZUGgVjOY-ruHAVDxJMjeNiXS4SuNMAKtPoe1-ETRAG1VzwGqGRtBbpilDGFSBrMlZ1wMvon_8SNXjs";

// if('serviceWorker' in navigator) {
//   send("Myways Notifs", "This is a required notifications").catch(err => console.error(err))
// }

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function send(title = "Push Sent", message = "Hello push") {
  console.log("Registering serviceWorker");
  const register = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });

  console.log("Service worker registered", register);
  //   navigator.serviceWorker.ready.then(async function () {
  //       const subscription = await register.pushManager.subscribe({
  //         userVisibleOnly: true,
  //         applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  //         });
  //       console.log('Registered push', subscription);
  //       await fetch('http://localhost:3001/subscribe', {
  //             method: 'POST',
  //             body: JSON.stringify({subscription, title, message}),
  //             headers: {
  //             'content-type': 'application/json'
  //             }
  //         });
  //   })
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(function (registration) {
        if (!registration.pushManager) {
          console.log("Push manager unavailable.");
          return;
        }

        registration.pushManager
          .getSubscription()
          .then(function (existedSubscription) {
            if (existedSubscription === null) {
              console.log("No subscription detected, make a request.");
              registration.pushManager
                .subscribe({
                  applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                  userVisibleOnly: true,
                })
                .then(function (newSubscription) {
                  console.log("New subscription added.");
                  sendSubscription(newSubscription, title, message);
                })
                .catch(function (e) {
                  if (Notification.permission !== "granted") {
                    console.log("Permission was not granted.");
                  } else {
                    console.error(
                      "An error ocurred during the subscription process.",
                      e
                    );
                  }
                });
            } else {
              console.log("Existed subscription detected.");
              sendSubscription(existedSubscription, title, message);
            }
          });
      })
      .catch(function (e) {
        console.error(
          "An error ocurred during Service Worker registration.",
          e
        );
      });
  }
  //   const subscription = register.pushManager.subscribe({
  //     userVisibleOnly: true,
  //     applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  //     }).then(() => console.log("successfully subscribed")).catch(err => console.log('errore', err))
  // console.log(JSON.stringify({subscription, title: "hello"}));
  console.log("Sending push");
  // await fetch('http://localhost:3001/subscribe', {
  //     method: 'POST',
  //     body: JSON.stringify({subscription, title, message}),
  //     headers: {
  //     'content-type': 'application/json'
  //     }
  // });
  // const geting = await fetch('http://localhost:3001/')
  // console.log('geting', geting)
  console.log("Sent push");
}

function sendSubscription(subscription, title, message) {
  return fetch("http://localhost:3001/subscribe", {
    method: "POST",
    body: JSON.stringify({ subscription, title, message }),
    headers: {
      "content-type": "application/json",
    },
  });
}
