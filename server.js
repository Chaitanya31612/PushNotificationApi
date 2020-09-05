const express = require("express");
const app = express();
const port = 3001;
const webpush = require("web-push");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
//*********************** Push notification Route *************************//
const publicVapidKey =
  "BIMSlZfuSZUGgVjOY-ruHAVDxJMjeNiXS4SuNMAKtPoe1-ETRAG1VzwGqGRtBbpilDGFSBrMlZ1wMvon_8SNXjs";
const privateVapidKey = "2o0s9NiHWEi-6JiMtE_bgwVcdCILSM1u4XzFBSY_I9g";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

app.post("/subscribe", (req, res) => {
  console.log("hello", req.body);
  const { subscription, title, message } = req.body;
  console.log(req.body);

  const payload = JSON.stringify({ title, message });

  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.error("err", err));
  res.status(200).json({ success: true });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello express" });
});

app.listen(port, () => {
  console.log("Server is up and running on port", port);
});
