import React, { useContext, useState } from "react";
import { Context } from "../../main";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Box,
  Spinner,
  FormControl,
  FormLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const GroupChatModal = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [members, setMembers] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { user } = useContext(Context);
  const [error, setError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    withCredentials: true,
  };

  // Fetch all users when modal opens
  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get("https://webchat-5.onrender.com/users/users/", config);
      setAllUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  // Open modal and fetch users
  const openModal = () => {
    onOpen();
    fetchAllUsers();
  };

  const handleCreate = async () => {
    if (!name.trim() || !members.trim()) {
      setError("Please enter group name and members (comma separated emails or usernames).");
      return;
    }
    setError("");
    // Split and trim members
    const memberList = members.split(",").map(m => m.trim()).filter(Boolean);
    // Check if all members exist
    const notFound = memberList.filter(
      m => !allUsers.some(
        u => u.email === m || u.name === m
      )
    );
    if (notFound.length > 0) {
      setError(`These users do not exist: ${notFound.join(", ")}`);
      return;
    }
    // Proceed to create group
    const memberIds = memberList.map(m => {
      const found = allUsers.find(u => u.email === m || u.name === m);
      return found ? found._id : null;
    });
    if (memberIds.includes(null)) {
      setError("One or more members could not be resolved to a user.");
      return;
    }

    try {
      const { data: response } = await axios.post(
        'http://localhost:3000/chats/group',
        { name, users: JSON.stringify(memberIds) },
        { withCredentials: true }
      );
      onClose();
      setName("");
      setMembers("");
      setError("");
      if (onCreate) onCreate(response);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast("Please enter a name to search");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/users/users/?search=${search}`,
        { withCredentials: true }
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Button
        colorScheme="teal"
        onClick={openModal}
        fontWeight="bold"
        ml={2}
        borderRadius="md"
      >
        + New Group Chat
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Group Name</FormLabel>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter group name"
                borderRadius="md"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Search Users</FormLabel>
              <Box display="flex" gap="8px">
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  borderRadius="md"
                />
                <Button colorScheme="teal" onClick={handleSearch}>
                  Search
                </Button>
              </Box>
              <Box mt={2} maxH="120px" overflowY="auto">
                {loading && (
                  <Box textAlign="center" py={2}>
                    <Spinner size="md" />
                  </Box>
                )}
                {!loading && searchResult && searchResult.length > 0 && (
                  <Box>
                    {searchResult.map(user => (
                      <Box
                        key={user._id}
                        py={1}
                        px={2}
                        borderBottom="1px solid #eee"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text fontSize="sm">{user.name} ({user.email})</Text>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </FormControl>
            <FormControl mb={2}>
              <FormLabel fontWeight="bold">Members</FormLabel>
              <Input
                value={members}
                onChange={e => setMembers(e.target.value)}
                placeholder="Enter emails/usernames, comma separated"
                borderRadius="md"
              />
            </FormControl>
            {error && (
              <Text color="red.500" mb={2} fontSize="sm">{error}</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3} borderRadius="md">
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleCreate}
              fontWeight="bold"
              borderRadius="md"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
