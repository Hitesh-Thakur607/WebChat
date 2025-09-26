import React from "react";

const UserListItem = ({ user, handleFunction }) => {
    // console.log(user);
  return (
    <div
      onClick={handleFunction}
      style={{
        cursor: "pointer",
        background: "#E8E8E8",
        width: "100%",
        display: "flex",
        alignItems: "center",
        color: "black",
        padding: "12px",
        marginBottom: "8px",
        borderRadius: "12px",
        transition: "background 0.2s, color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#38B2AC";
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#E8E8E8";
        e.currentTarget.style.color = "black";
      }}
    >
      <img
        src={user?.pic}
        alt={user?.name}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          marginRight: "12px",
          objectFit: "cover",
        }}
      />
      <div>
        <div style={{ fontWeight: "bold" }}>{user?.name}</div>
        <div style={{ fontSize: "0.85rem" }}>
          <b>Email:</b> {user?.email}
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
