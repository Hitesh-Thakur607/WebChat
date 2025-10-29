import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import Chatloading from "./Chatloading";
import { Context } from "../main";
import  GroupChatModel  from "./ui/GroupChatModal.jsx";
// import Mychats from '../components/Mychats'
import API_URL from '../config/api';
export const Mychats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const { selectedChat, setSelectedChat, user, chats, setChats } = useContext(Context);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        withCredentials: true,
      };
      const { data } = await axios.get(`${API_URL}/chats/`, config);
      // console.log("Fetched chats:", data); 
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats");
    }
  };

  useEffect(() => {// import { ChatState } from '../main';
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setLoggedUser(parsedUser);
      // console.log("🔑 Logged user set:", parsedUser);
    } else if (user) {
      setLoggedUser(user);
      // console.log("🔑 Logged user set from context:", user); 
    } else {
      console.log("⚠️ No user info found in localStorage or context");
    }
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      style={{
        marginTop: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        background: "#fff",
        width: "40%",
        maxWidth: "1020px", // 🔥 added your requested width
        borderRadius: "12px",
        border: "1px solid #eee",
        minHeight: "480px",
        boxSizing: "border-box",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)", // 🔥 added better shadow
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingBottom: "16px",
          paddingLeft: "16px",
          paddingRight: "16px",
          fontSize: "28px",
          fontFamily: "Work sans, sans-serif",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <GroupChatModel>
          <span>My Chats</span>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "17px",
            background: "#38B2AC",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 1px 4px rgba(56,178,172,0.12)",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#319795")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#38B2AC")}
        >
          <span style={{ marginRight: "8px", fontSize: "22px" }}>+</span>
          New Group Chat
        </button>
        </GroupChatModel>

      </div>

      {/* Chats List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "18px",
          background: "#F8F8F8",
          width: "100%",
          height: "100%",
          borderRadius: "12px",
          overflowY: "auto",
          minHeight: "340px",
          maxHeight: "380px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}
      >
        {chats ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {chats.map((chat, index) => {
              const otherUser = getSender(loggedUser, chat.users);

              return (
                <div
                  onClick={() => setSelectedChat(chat)}
                  style={{
                    cursor: "pointer",
                    background:
                      selectedChat?._id === chat._id ? "#38B2AC" : "#E8E8E8",
                    color: selectedChat?._id === chat._id ? "white" : "#222",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    marginBottom: "2px",
                    fontSize: "17px",
                    fontWeight:
                      selectedChat?._id === chat._id ? "bold" : "normal",
                    boxShadow:
                      selectedChat?._id === chat._id
                        ? "0 2px 8px rgba(56,178,172,0.08)"
                        : "none",
                    transition:
                      "background 0.2s, color 0.2s, box-shadow 0.2s",
                  }}
                  key={chat._id || index}
                  onMouseOver={(e) => {
                    if (selectedChat?._id !== chat._id) {
                      e.currentTarget.style.background = "#e2e8f0";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedChat?._id !== chat._id) {
                      e.currentTarget.style.background = "#E8E8E8";
                    }
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {!chat.isGroupChat ? otherUser : chat.chatName}
                  </div>
                  {chat.latestMessage && (
                    <div
                      style={{
                        fontSize: "0.95rem",
                        marginTop: "4px",
                        opacity: 0.8,
                      }}
                    >
                      <b>{chat.latestMessage.sender?.name || "Unknown"  } : </b>
                      {chat.latestMessage.content &&
                      chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <Chatloading />
        )}
      </div>
    </div>
  );
};

export default Mychats;
