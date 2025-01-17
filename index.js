const express = require('express');
const cors = require('cors');
require("dotenv").config();
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const corsOptions = {
  origin: 'https://dinksolution-5syx2sh2.launchpad.cfapps.eu10.hana.ondemand.com/site?siteId=308b0854-cacd-4fe9-b146-d82b0d350a39#WalkieTalkie-display?sap-ui-app-id-hint=saas_approuter_walkietalkie', 
  methods: 'POST,GET'
};

app.use(cors(corsOptions));
app.get('/', function(req, res){
  res.send("Email is Actived!");
});
app.post('/Email',async (req, res) => {
    try {
        const { senderEmail, senderFeedback,senderName } = req.body;

        if (!senderEmail || !senderFeedback || !senderName) {
            return res.status(400).send("Sender email and feedback are required");
        }

        console.log(process.env.PASS);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: 'zaidbelim.dev@gmail.com',
                pass: process.env.PASS,
            },
        });
    
        let portfolioLink ="https://ahmedshaikhcv.netlify.app";
        const info = await transporter.sendMail({
          from: `"Zaid Belim" <zaidbelim.dev@gmail.com>`,
          to: senderEmail,
          subject: "Together, We Build Something Better – Grateful for Your Valuable Feedback!",
          text: `Dear ${senderName},\n\nThank you for taking the time to explore my portfolio and share your valuable insights. Your feedback is not just appreciated – it’s invaluable, as it inspires me to strive for even greater heights.\n\nI’m truly grateful for your support and look forward to staying connected.\n\n If you’d like to revisit my portfolio or see updates, feel free to check it out here: ${portfolioLink}\n\nBest regards,\nAhmed Shaikh`,
          html: `
              <p>Dear ${senderName},</p>
              <p>Thank you for taking the time to explore my portfolio and share your valuable insights. Your feedback is not just appreciated – it’s invaluable, as it inspires me to strive for even greater heights.</p>
              <p>I’m truly grateful for your support and look forward to staying connected.<br><br> If you’d like to revisit my portfolio or see updates, feel free to check it out here: <a href="${portfolioLink}" target="_blank">${portfolioLink}</a></p>
              <p>Best regards,<br>Zaid Belim</p>
          `,
      });
      
      const date = new Date(); 
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      const infos = await transporter.sendMail({
        from: `"Zaid Belim" <zaidblelim.dev@gmail.com>`,
        to: 'zaidbelim.dev@gmail.com',
        subject: `Feedback by ${senderName}`,
        text: `Dear Zaid ,\n Date:${date}\n Name: ${senderName}\n Email:${senderEmail}\n Message:${senderFeedback}\n\nBest regards,\nZaid Belim`
        ,   html: `
            <p>Dear Zaid ,</p>
            <p>Date :${formattedDate}</p>
            <p>Name :${senderName}</p>
            <p>Email :${senderEmail}</p>
            <p>Message :${senderFeedback}</p><br>
            <p>Best regards,<br>Zaid Belim</p>
        `,
    });
        res.status(200).json({Message:"Thank-you email successfully sent"});
    } catch (error) {
        res.status(500).send("Failed to send thank-you email",error);
    }
});

app.listen(port, () => {
    console.log('Listening on port', port);
});