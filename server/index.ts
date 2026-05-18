import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());

// ---------- НАСТРОЙКИ EMAIL ----------
const EMAIL_USER = "42braille.dots@gmail.com"; // твой Gmail
const EMAIL_PASS = "bpud ermr shea tnun";   // app password, который создала
const EMAIL_TO = "42braille.dots@gmail.com";   // куда приходят сообщения

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