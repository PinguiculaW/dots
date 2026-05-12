import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());

// ---------- НАСТРОЙКИ EMAIL ----------
const EMAIL_USER = "maripul.ka0066@gmail.com"; // твой Gmail
const EMAIL_PASS = "eusj vzqj njbs pawb";   // app password, который создала
const EMAIL_TO = "maripul.ka0066@gmail.com";   // куда приходят сообщения

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// ---------- ENDPOINT FEEDBACK ----------
app.post("/feedback", async (req, res) => {
    try {
        const { message } = req.body;

        await transporter.sendMail({
            from: EMAIL_USER,
            to: EMAIL_TO,
            subject: "Новое сообщение с сайта",
            text: message,
        });

        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server started: ${PORT}`);
});