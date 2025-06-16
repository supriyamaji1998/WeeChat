export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("hi-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
