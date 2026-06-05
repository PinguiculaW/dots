import {useState} from "react";

import AppInner from "./AppInner";
import FeedbackModal from "./components/FeedbackModal";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppInner/>
      <FeedbackModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}