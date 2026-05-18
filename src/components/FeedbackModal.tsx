import { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function FeedbackModal({ open, onClose }: Props) {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const sendMessage = async () => {
        setStatus("Отправка...");

        try {
            const response = await fetch("http://localhost:3001/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus("Сообщение отправлено ✅");
                setMessage("");
            } else {
                setStatus("Ошибка ❌");
            }
        } catch (error) {
            setStatus("Сервер недоступен ❌");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute" as const,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    maxWidth: 400,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">Обратная связь</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        mt: 1,
                        color: "#494949",
                    }}
                >
                    Можете написать здесь про замеченные ошибки, что исправить, а также про желаемый дополнительный функционал (новые инструменты и т.п.).
                    Это действительно важно, я стремлюсь сделать инструмент полезным и постараюсь оперативно исправлять замеченные Вами ошибки.
                    Спасибо!
                </Typography>

                <TextField
                    label="Ваше сообщение"
                    multiline
                    rows={4}
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ mt: 2 }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={sendMessage}
                >
                    Отправить
                </Button>

                {status && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {status}
                    </Typography>
                )}
            </Box>
        </Modal>
    );
}