import https from "https";

const ACCESS_TOKEN = process.env.SMS_ACCESS_TOKEN;
const SENDER = process.env.SMS_SENDER;
const SMS_TYPE = 1;

/**
 * Function to send SMS
 * @param phones string[]. List of phones need to send SMS
 * @param content string. Content of the SMS
 * @param type number. Type of message (For detail: https://speedsms.vn/sms-api/)
 * @param sender string. Brand name or DeviceID of android app.
 * @returns
 */
export const sendSMS = (phones, content, type = SMS_TYPE, sender = SENDER) => {
  console.log(phones, content, type, sender);
  
  const params = JSON.stringify({
    to: phones,
    content: content,
    sms_type: type,
    sender: sender,
  });

  const auth = "Basic " + Buffer.from(ACCESS_TOKEN + ":x").toString("base64");

  const options = {
    hostname: "api.speedsms.vn",
    port: 443,
    path: "/index.php/sms/send",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          if (json.status === "success") {
            console.log("send sms success");
            resolve(json);
          } else {
            console.log("send sms failed: " + body);
            reject(new Error("send sms failed: " + body));
          }
        } catch (err) {
          reject(new Error("Error parsing JSON response: " + err.message));
        }
      });
    });

    req.on("error", (e) => {
      reject(new Error("send sms failed: " + e.message));
    });

    req.write(params);
    req.end();
  });
};