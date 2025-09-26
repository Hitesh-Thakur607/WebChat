import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../main';
import { getSenderFull } from "../config/ChatLogics";
import Profilemodal from "./ui/Profilemodal.jsx";
import UpdatedGroupChatModal from './ui/UpdatedGroupChatModal';
import { Spinner, FormControl, Input, Button } from '@chakra-ui/react';
import axios from "axios";

const Singlechat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = useContext(Context);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [newMessage, setNewMessage] = useState(""); 
  const [chat,setChat]=useState(null);
  const [messages, setMessages] = useState([]); // Initialize as empty array instead of null

  if (!selectedChat) return <div>No chat selected</div>;

  // Send message to backend
  const getChat = async () => {
    if (!selectedChat) return;
    const { data } = await axios.get(
      `http://localhost:3000/messages/${selectedChat._id}`,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    setChat({ messages: data });
  }
  useEffect(() => {
    getChat();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/messages/",
        {
          chatId: selectedChat._id,
          content: newMessage,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setNewMessage("");
      setFetchAgain && setFetchAgain((prev) => !prev);
    } catch (error) {
      // You can show a toast here if you want
      console.error("Send message error:", error);
    }
    setLoading(false);
  };

  // Update message input value
  const typingHandler = (event) => {
    setNewMessage(event.target.value);
  };

  let chatTitle, chatAvatar, otherUser;
  if (selectedChat.isGroupChat) {
    chatTitle = selectedChat.chatName;
    chatAvatar = null;
    otherUser = null;
  } else {
    otherUser = getSenderFull(user, selectedChat.users);
    chatTitle = otherUser? otherUser.name : "Unknown User";
    chatAvatar = otherUser ? otherUser.pic : null;
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          padding: "18px 24px 12px 24px",
          fontWeight: "bold",
          fontSize: "1.5rem",
          fontFamily: "Work Sans, sans-serif",
          color: "#222",
          background: "#fff",
          borderBottom: "1px solid #eee",
          zIndex: 2,
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {chatAvatar && (
          <img
            src={chatAvatar}
            alt={chatTitle}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "12px",
            }}
          />
        )}
        <span>{chatTitle}</span>
        {/* Profile button for non-group chats */}
        {otherUser && !selectedChat.isGroupChat ? (
          <>
            <button
              style={{
                marginLeft: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
              title="View Profile"
              onClick={() => setShowProfile(true)}
            >
              <span role="img" aria-label="profile">👤</span>
            </button>
            {showProfile && (
              <Profilemodal user={otherUser} onClose={() => setShowProfile(false)} />
            )}
          </>
        ) : (
          <UpdatedGroupChatModal onClose={() => {}} />
        )}
      </div>
      {/* Chat messages area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        background: "#f5f5f5",
      }}>
        {chat && chat.messages && chat.messages.length > 0 ? (
          chat.messages
            .filter(msg => msg && msg._id) // Keep messages even if sender is null
            .map((msg) => (
            <div
              key={msg._id}
              style={{
                marginBottom: "12px",
                display: "flex",
                flexDirection: msg.sender && user._id === msg.sender._id ? "row-reverse" : "row",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  background: msg.sender && user._id === msg.sender._id ? "#38B2AC" : "#e2e2e2",
                  color: msg.sender && user._id === msg.sender._id ? "#fff" : "#222",
                  borderRadius: "18px",
                  padding: "10px 16px",
                  maxWidth: "60%",
                  wordBreak: "break-word"
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "0.95em" }}>
                  {msg.sender ? msg.sender.name : "Deleted User"}
                </div>
                <div>{msg.content || ""}</div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", color: "#888" }}>
            No messages yet.
          </div>
        )}
      </div>
      {/* Message input at the bottom */}
      <form
        onSubmit={sendMessage}
        style={{
          width: "100%",
          padding: "16px",
          borderTop: "1px solid #eee",
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          marginTop: "auto"
        }}
      >
        <FormControl isRequired style={{ flex: 1, display: "flex", gap: "8px" }}>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={typingHandler}
            disabled={loading}
          />
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={loading}
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </FormControl>
      </form>
    </div>
  );
};

export default Singlechat;
