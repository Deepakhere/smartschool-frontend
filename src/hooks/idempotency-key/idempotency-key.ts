import { useRef } from "react";

// One key per attempt at a money action. Sending the same details again (a double click, a retry after the network
// dropped) reuses the key, so the server answers with the first result instead of acting twice; changed details get
// a new key, so a corrected retry is not answered with the old failure. After a success the next action starts fresh.
const useIdempotencyKey = () => {
  const current = useRef<{ signature: string; key: string } | null>(null);

  const keyFor = (payload: unknown) => {
    const signature = JSON.stringify(payload);
    if (current.current?.signature !== signature) current.current = { signature, key: crypto.randomUUID() };
    return current.current.key;
  };
  const reset = () => {
    current.current = null;
  };

  return { keyFor, reset };
};

export default useIdempotencyKey;
