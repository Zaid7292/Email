const express = require('express');
const cors = require('cors');
require("dotenv").config();
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    "origin":"*"
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
                user: 'zaidbelim@daffodilsinfo.com',
                pass: process.env.PASS,
                
            },
        });

        const info = await transporter.sendMail({
          from: `"Zaid Belim" <zaidbelim@daffodilsinfo.com>`,
          to: senderEmail,
          subject: "Thank You for Reporting the Issue on Fit4Life – We’re Working on It!",
          html: `
              <p>Dear ${senderName},</p>
              <p>Thank you for bringing the issue on Fit4Life to our attention. We apologize for any inconvenience this may have caused.</p>
              <p> We're currently working on fixing it and will have it resolved as soon as possible.</p>
              <p>If you have any more details or information to share, feel free to send them as same this way. We’ll keep you updated once it’s fixed.</p>
              <p>Best regards,<br>Displ Fiori Team</p>
          `,
      });
      
      
      const date = new Date(); 
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      const infos = await transporter.sendMail({
        from: `"Zaid Belim" <zaidblelim.dev@gmail.com>`,
        to: 'zaidbelim@daffodilsinfo.com',
        subject: `Feedback by ${senderName}`,
        text: `Dear Zaid ,\n Date:${date}\n Name: ${senderName}\n Email:${senderEmail}\n Message:${senderFeedback}\n\nBest regards,\nZaid Belim`
        ,   html: `
            <p>Dear Zaid ,</p>
            <p>Date :${formattedDate}</p>
            <p>Name :${senderName}</p>
            <p>Email :${senderEmail}</p>
            <p>Message :${senderFeedback}</p><br>
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