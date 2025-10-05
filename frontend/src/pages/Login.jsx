// import {user,isAuthenticated} from '../main'
import { use, useState } from 'react';
import { useContext } from "react";
import { useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from "../login.module.css";
import { Context } from '../main'
// import { useNavigate } from 'react-router-dom';
export default function Login() {
  const { user, isAuthenticated, setUser, setIsAuthenticated ,setIsAdmin} = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const Navigate=useNavigate();

    // if(isAuthenticated){
    //     Navigate("/books");
    // }
    useEffect(() => {
        if (isAuthenticated) {
          Navigate("/chatz");
        }
      }, [isAuthenticated, Navigate]);
    const submithandle=async (e) => {
        // e.preventDefault();
        try {
            const { data } = await axios.post(
                "https://webchat-5.onrender.com/users/login",
                { email, password },
                {
                  headers: { "Content-Type": "application/json" },
                  withCredentials: true,
                }
              );
              if (data.token) {
                localStorage.setItem("token", data.token);
                // setUser(data.user);

              }
              else  { Navigate("/chatz");}
                           setIsAuthenticated(true);
                           console.log(data.message);
                          //  setIsAdmin(true);
                           toast.success(data.message);
                           setIsAuthenticated(true);
                           e.preventDefault();
                          //  Navigate("/chats");
                          //  Navigate("/books");
                     }
                     catch (error) {
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