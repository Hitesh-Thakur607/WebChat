import React, { useContext } from 'react';
import { Context } from "../main";
import { Box } from '@chakra-ui/react';
import Singlechat from './Singlechat';


export const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(Context);

  console.log("selectedChat in Chatbox:", selectedChat);

  return (
    <Box
      className="chatbox-container"
      style={{
        marginTop: "70px",
        display: selectedChat ? "flex" : "none", // <-- Only show if selected
        alignItems: "center",
        flexDirection: "column",
        padding: "1rem",
        background: "white",
        width: "100%",
        borderRadius: "1rem",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "black",
      }}
    >
      {selectedChat ? (
        <Singlechat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} dsdasf />
      ) : (
        <div>Select a chat to start messaging</div>
      )}
    </Box>
  );
};

export default Chatbox;
