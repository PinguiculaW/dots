import { useState } from "react";

export default function FeedbackForm() {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const sendMessage = async () => {
        setStatus("Отправка...");

        try {
            const response = await fetch(
                "http://localhost:3001/feedback",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setStatus("Сообщение отправлено");
                setMessage("");
            } else {
                setStatus("Ошибка");
            }
        } catch (error) {
            setStatus("Сервер недоступен");
        }
    };

    return (
        <div>
      <textarea
          value={message}
          onChange={(e) =>
              setMessage(e.target.value)
          }
          placeholder="Введите сообщение"
      />

            <br />

            <button onClick={sendMessage}>
                Отправить
            </button>

            <p>{status}</p>
        </div>
    );
}