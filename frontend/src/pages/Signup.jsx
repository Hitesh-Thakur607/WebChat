import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from "../login.module.css";
import { Context } from '../main';

export default function Signup() {
  const Navigate = useNavigate();
  const { isAuthenticated } = useContext(Context);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [pic, setPic] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      Navigate("/chats");
    }
  }, [isAuthenticated, Navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (!pics) {
      toast.error("Please select an image!");
      setLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "YapNet");
      fetch("https://api.cloudinary.com/v1_1/YapNet/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          toast.error("Image upload failed");
          setLoading(false);
        });
    } else {
      toast.error("Please select a JPEG or PNG image!");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (pic) data.append("picture", pic);

      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/users/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          picture: pic, // Cloudinary URL
        },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      // navigate("/verifyemail");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h2 className={styles.title}>Sign Up</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="file"
            accept="image/*"
            onChange={e => postDetails(e.target.files[0])}
          />
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className={styles.toggleText}>
          Already have an account? <Link className={styles.toggleButton} to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}