import { useState } from "react";

import AppInner from "./AppInner";
import FeedbackModal from "./components/FeedbackModal";

export default function App() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <AppInner
                onOpenFeedback={() => setOpen(true)}
            />

            <FeedbackModal
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}