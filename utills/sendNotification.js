const FCM = require("fcm-node");

const serverKey = require("../trade-2-trade-firebase-adminsdk-xqvre-b845165503.json");

const fcm = new FCM(serverKey);
const sendNotification = (message) => {
  fcm.send(message, function (err, response) {
    if (err) {
      // console.log("Something has gone wrong!", err);
    } else {
      // console.log("Successfully sent with response: ", response);
    }
  });
};

module.exports = sendNotification;
