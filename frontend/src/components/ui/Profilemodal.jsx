import React from "react";

const Profilemodal = ({ user, children, onClose }) => {
  
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "350px",
          maxWidth: "90vw",
          padding: "24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          position: "relative",
          textAlign: "center",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2
          style={{
            fontSize: "2rem",
            fontFamily: "Work sans",
            marginBottom: "16px",
          }}
        >
          {user?.name}
        </h2>
        <img
          src={user?.picture}
          // alt={user?.name}
          style={{
            borderRadius: "50%",
            width: "150px",
            height: "150px",
            objectFit: "cover",
            marginBottom: "16px",
          }}
        />
        <div
          style={{
            fontSize: "1.2rem",
            fontFamily: "Work sans",
            marginBottom: "24px",
          }}
        >
          Name: {user?.name} <br />
          Email: {user?.email}
        </div>
        <button
          style={{
            padding: "8px 24px",
            borderRadius: "6px",
            border: "none",
            background: "#e94560",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Profilemodal;