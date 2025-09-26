const getSender = (loggedUser, users) => {
  if (!loggedUser || !users || !Array.isArray(users) || users.length === 0) {
    return "Unknown User";
  }
  const otherUser = users.find(user => user && user._id !== loggedUser._id);
  return otherUser && otherUser.name ? otherUser.name : "Unknown User";
};

const getSenderFull = (loggedUser, users) => {
  return users.find((u) => u._id !== loggedUser._id);
};

export { getSender, getSenderFull };