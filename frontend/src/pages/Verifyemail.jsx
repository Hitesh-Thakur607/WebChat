import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from "../login.module.css";
import { Context } from '../main';

export default function Verifyemail() {
  const { setIsAuthenticated } = useContext(Context);
  const [formData, setFormData] = useState({
    email: "",
    verificationToken: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleverify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://librarymanagementbackend-p352.onrender.com/verifyemail",
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/login");  // ✅ lowercase route
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h2 className={styles.title}>Verify Email</h2>
        <form className={styles.form} onSubmit={handleverify}>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="text"
            name="verificationToken"  // ✅ FIXED
            placeholder="Verification Code"
            value={formData.verificationToken}
            onChange={handleChange}
            required
          />
          <button className={styles.button} type="submit">VERIFY</button>
        </form>
        <p className={styles.toggleText}>
          Already have an account? <Link className={styles.toggleButton} to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}