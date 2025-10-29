// import {user,isAuthenticated} from '../main'
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from "../login.module.css";
import { Context } from '../main';
import API_URL from '../config/api';

export default function Login() {
  const { user, isAuthenticated, setUser, setIsAuthenticated, setIsAdmin } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const Navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      Navigate("/chatz");
    }
  }, [isAuthenticated, Navigate]);

  const submithandle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_URL}/users/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );
            setUser(data.user);
      setIsAuthenticated(true);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      console.log("Login successful:", data.message);
      toast.success(data.message);
      setTimeout(async () => {
        try {
          const meResponse = await axios.get(`${API_URL}/users/me`, { withCredentials: true });
          console.log("Immediate /me check:", meResponse.data);
        } catch (err) {
          console.log("Immediate /me check failed:", err.response?.data);
        }
      }, 100);
      
      Navigate("/chatz");
      
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(error?.response?.data?.message || "An unexpected error occurred.");
      setIsAuthenticated(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form} onSubmit={submithandle}>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Email"
          />
          <input
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Password"
          />
          <button className={styles.button} type="submit">Login</button>
        </form>
        <p className={styles.toggleText}>
          Or <Link className={styles.toggleButton} to="/signupz">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}