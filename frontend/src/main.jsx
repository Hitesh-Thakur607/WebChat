import React, { createContext, useContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- Import BrowserRouter
import App from "./App";
import { useNavigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";// import isauthenticated from "../../backend/middleware/authentication";
// Create a single context for the whole app
export const Context = createContext({ isAuthenticated: false });

const AppProvider = ({ children }) => {
  // 🔹 Authentication-related states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState();
  // const [selectedChat, setSelectedChat] = useState();
  // 🔹 Chat-related states
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  // const [chatState,setChatState]=useState();
  const navigate = useNavigate();

  // Load user info on mount
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (userInfo) {
      setIsAuthenticated(true);
      if (userInfo.isAdmin) setIsAdmin(true);
    } else {
      navigate("/"); // Redirect if not logged in
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Context.Provider
      value={{
        // Auth state
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        selectedChat,
        setSelectedChat
      }}
    >
      {children}
    </Context.Provider>
  );
};


// 🔹 Hook for consuming context
// export const Context = () => useContext(AppContext);

// 🔹 React 18 Root Render
const rootElement = document.getElementById("root");
if (!window.__APP_ROOT__) {
  window.__APP_ROOT__ = createRoot(rootElement);
}

window.__APP_ROOT__.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

export default AppProvider;
