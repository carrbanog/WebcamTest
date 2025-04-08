const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_NUM;
// const phoneNum = process.env.PHONE_NUM;
const client = new twilio(accountSid, authToken);

const sendSMS = async (req, res) => {
  const { to, message } = req.body;
  console.log(req.body);

  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });
    console.log(response);
    res.json({ success: true, sid: response.sid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = sendSMS;
