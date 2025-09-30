import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/Verifyemail';
import Chats from './pages/Chats';
import { Context } from './main';
import { useContext, useEffect } from "react"; 
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
function App() {
    const { setUser, setIsAuthenticated, setIsAdmin } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
      const response=axios
        .get("http://localhost:3000/users/me", { withCredentials: true })
        .then(res => {
          setUser(res.data.user);
          setIsAuthenticated(true);
        })
        .catch(err => {
          toast.error("Please Login or create account");
          setUser({});
          setIsAuthenticated(false);
          navigate("/login");
        });
    }, []);

    return (
      <>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyEmail />} />
        </Routes>
        <Toaster />
      </>
    );
}

export default App;