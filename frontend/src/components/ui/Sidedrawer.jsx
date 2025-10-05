import React, { useContext, useState } from "react";
import Profilemodal from "./Profilemodal";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import Chatloading from "../Chatloading";
import UserListItem from "../Useravatar/UserListItem";
// import { accessChat } from "../../../../backend/components/chats";
// import { useContext } from "react";
export function Sidedrawer({  notification = []}) {
  const {user,setSelectedChat,chats,setChats} = useContext(Context);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const onClose = () => setDrawerOpen(false);
  const Navigate = useNavigate();
  const logout =()=>{
    const response=axios.post("https://webchat-5.onrender.com/users/logout", 
      {},{
      headers: { "Content-Type": "application/json" },
                  withCredentials: true,}
    )
.then(response => {
  toast.success(response.data.message); // <-- Only show the message string
  Navigate("/");
})
    .catch(error => {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    });
  }
  // Dummy search handler

const handleSearch = async() => {
  if (!search) {
    toast("Please enter a name to search"); // <-- Only pass a string
    return;
  }
  try{
    setLoading(true);
    const config={
      withCredentials: true,
    };
    const {data} =await axios.get(`https://webchat-5.onrender.com/users/users/?search=${search}`, config);
    setLoading(false);
    
    // Flatten all users from all chats into a single array

      setLoading(false);
      setSearchResult(data);
  }catch(error){
    // setLoading(false);
    toast.error(error.message);
    console.log(error.message);
  }
};
const accessChat = async (userId) => {
  try {
    setLoading(true);
    const config = { withCredentials: true };
    const { data } = await axios.post("https://webchat-5.onrender.com/chats/", { userId }, config);
    const chatData = data.chat || data;
    if (!chats.find((c) => c._id === chatData._id)) setChats([chatData, ...chats]);
    setSelectedChat(chatData);
    setLoading(false);
    setDrawerOpen(false);
  } catch (error) {
    toast.error(error.message);
    setLoading(false);
  }
};
  // Close profile menu when clicking outside
  React.useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {  
      document.addEventListener("mousedown", closeMenu);
    }
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [profileOpen]);

  // Add this effect for closing the search drawer when clicking outside
React.useEffect(() => {
  if (!drawerOpen) return;
  const closeDrawer = (e) => {
    // Only close if click is outside the drawer
    if (!e.target.closest(".search-drawer")) {
      setDrawerOpen(false);
    }
  };
  document.addEventListener("mousedown", closeDrawer);
  return () => document.removeEventListener("mousedown", closeDrawer);
}, [drawerOpen]);

  return (
    <>
      {/* Navbar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          padding: "10px 20px",
          borderBottom: "1px solid #eee",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Left: Search User Button */}
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            fontSize: "1rem",
          }}
          title="Search Users to chat"
          onClick={() => setDrawerOpen(true)}
        >
          <span role="img" aria-label="search" style={{ marginRight: "8px" }}>
            🔍
          </span>
          <span style={{ paddingLeft: "4px" }}>Search User</span>
        </button>

        {/* Center: Brand */}
        <span style={{ fontSize: "2rem", fontFamily: "Work sans", fontWeight: "bold" }}>
          YapNet
        </span>

        {/* Right: Notification Bell and Profile/Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Notification Bell */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              fontSize: "1.5rem",
              padding: "8px",
            }}
            title="Notifications"
          >
            {/* <span role="img" aria-label="bell">🛎️</span> */}
            {notification.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  background: "red",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: "0.8rem",
                  padding: "2px 6px",
                }}
              >
                {notification.length}
              </span>
            )}
          </button>

          {/* Profile/Menu */}
          <div className="profile-menu" style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: "1.2rem",
                padding: "0",
              }}
              title="Profile"
              onClick={() => setProfileOpen((open) => !open)}
            >
              <img
                src={user?.pic}
                alt={user?.name}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
              <span style={{ fontSize: "1.2rem" }}>▼</span>
            </button>
            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  minWidth: "120px",
                  zIndex: 10,
                }}
              >
                <div
                  style={{ padding: "8px", cursor: "pointer" }}
                  onClick={() => setShowProfileModal(true)}
                >
                  My Profile
                </div>
                <hr />
                <div
                  style={{ padding: "8px", cursor: "pointer" }}
                  onClick={logout} // <-- FIXED: pass function, not function call
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

{/* // ...existing code... */}
{showProfileModal && (
  <Profilemodal user={user} onClose={() => setShowProfileModal(false)} />
)}
      {/* Drawer */}
      {drawerOpen && (
        <div
          className="search-drawer" // <-- Add this class for click detection
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "300px",
            height: "100vh",
            background: "#fff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            marginTop: "60px", // so it doesn't go under navbar
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #eee",
              marginBottom: "16px",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Search Users
            <button
              style={{
                float: "right",
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
             onClick={onClose}
            >
            </button>
          </div>
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginRight: "8px",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "none",
                background: "#eee",
                cursor: "pointer",
              }}
            >
              Go
            </button>
          </div>
          {loading ? <Chatloading></Chatloading> : <h1><span>results</span></h1>}
<div style={{ flex: 1, overflowY: "auto" }}>
  {loading ? (
    <div style={{ textAlign: "center", padding: "16px" }}>
      <span role="img" aria-label="loading">
        ⏳
      </span>
    </div>
  ) : (
    (Array.isArray(searchResult) ? searchResult : []).map(user => (
      <UserListItem
        key={user._id}
        user={user}
        handleFunction={() => accessChat(user._id)}
      />
    ))
  )}
</div>
        </div>
      )}
      {/* Add margin-top to your main content so it doesn't go under navbar */}
    </>
  );
}