import React, { useState, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
  Spinner,
  IconButton,
  FormControl,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";

const UpdatedGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { selectedChat, setSelectedChat, user } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        "http://localhost:3000/chats/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        { withCredentials: true }
      );
      setSelectedChat(data);
    //   setFetchAgain && setFetchAgain((prev) => !prev);
      setRenameLoading(false);
      setGroupChatName("");
      toast.success("Group name updated!");
    } catch (error) {
      toast.error(error.messagge);
      setRenameLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/users/users/?search=${query}`,
        { withCredentials: true }
      );
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load search results");
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User already in group!");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put(
        "http://localhost:3000/chats/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        { withCredentials: true }
      );
      setSelectedChat(data);
    //   setFetchAgain && setFetchAgain((prev) => !prev);
      setLoading(false);
      toast.success("User added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Add user failed");
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put(
        "http://localhost:3000/chats/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        { withCredentials: true }
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
    //   setFetchAgain && setFetchAgain((prev) => !prev);
      fetchMessages && fetchMessages();
      setLoading(false);
      toast.success("User removed!");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  if (!selectedChat || !selectedChat.isGroupChat) return null;

  return (
    <>
      <IconButton icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="2xl"
            fontFamily="Work sans"
            textAlign="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <Box
                  key={u._id}
                  display="inline-block"
                  px={2}
                  py={1}
                  m={1}
                  borderRadius="md"
                  bg={
                    u._id === selectedChat.groupAdmin._id
                      ? "teal.200"
                      : "gray.200"
                  }
                  fontWeight="bold"
                >
                  {u.name}
                  <Button
                    size="xs"
                    ml={2}
                    colorScheme="red"
                    onClick={() => handleRemove(u)}
                  >
                    x
                  </Button>
                </Box>
              ))}
            </Box>
            <FormControl display="flex" mb={2}>
              <Input
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                mr={2}
              />
              <Button
                colorScheme="teal"
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            {/* --- Search User Section --- */}
            <FormControl>
              <Box display="flex" gap="8px" mb={2}>
                <Input
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  colorScheme="teal"
                  onClick={() => handleSearch(search)}
                  fontWeight="bold"
                >
                  Search
                </Button>
              </Box>
              <Box mt={2} maxH="120px" overflowY="auto">
                {loading && <Spinner size="md" />}
                {!loading && searchResult && searchResult.length > 0 && (
                  <Box>
                    {searchResult.map((user) => (
                      <Box
                        key={user._id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        p={2}
                        m={1}
                        borderRadius="md"
                        bg="gray.100"
                      >
                        <span>
                          {user.name} ({user.email})
                        </span>
                        <Button
                          size="xs"
                          colorScheme="teal"
                          onClick={() => handleAddUser(user)}
                        >
                          Add
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatedGroupChatModal;
