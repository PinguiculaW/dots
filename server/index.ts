import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.post("/feedback", (req, res) => {
    console.log("Новое сообщение:");

    console.log(req.body);

    res.json({
        success: true,
    });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server started: ${PORT}`);
});