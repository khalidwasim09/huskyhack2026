import { useEffect, useState } from "react";

export function useCV() {
  const [pan, setPan] = useState(0.5);
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8765");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPan(data.pan);
      setChoice(data.choice);
    };
    ws.onerror = () => console.warn("CV server not connected");
    return () => ws.close();
  }, []);

  return { pan, choice };
}