import https from "https";
import Booking from "../models/booking.model.js";

const ACCESS_TOKEN = "TSlBcFpQN23RUcwx0Top-0erXUy41VnL";
const SENDER = "9743ba2c97a450bf";
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

/**
 * Function to send SMS 10 minutes before booking
 */
export const checkAndSendReminders = async () => {
  const now = new Date();
  const tenMinutesFromNow = new Date(now.getTime() + 60 * 60 * 1000); // 60 minutes ahead

  try {
    // Fetch all bookings with booking_time within the next 10 minutes
    const upcomingBookings = await Booking.find({
      booking_time: {
        $gte: now.toISOString(), // Booking time greater than now
        $lte: tenMinutesFromNow.toISOString(), // Booking time less than or equal to 10 minutes from now
      },
      is_sended: false,
    });

    // Gather phone numbers and generate the message
    const phones = upcomingBookings.map(
      (booking) => `+84${booking.phone.slice(1)}`
    );

    if (phones.length > 0) {
      const content = `Reminder: Your appointment is in 10 minutes. If you want to reschedule, please go to: https://google.com.vn/`;

      // Send SMS to all users at once
      sendSMS(phones, content, SMS_TYPE, SENDER);

      // Mark SMS as sent for each booking
      await Booking.updateMany(
        { _id: { $in: upcomingBookings.map((b) => b._id) } },
        { $set: { is_sended: true } }
      );
    } else {
      console.log("No upcoming bookings found for reminder.");
    }
  } catch (err) {
    console.error("Error fetching bookings:", err);
  }
};
