function handleNewNotification(
  dispatch,
  { type, icon, title, message, position }
) {
  dispatch({
    type,
    icon,
    title,
    message,
    position: position || "topR",
  });
}

export default handleNewNotification;
