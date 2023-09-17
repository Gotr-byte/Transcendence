import { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";

interface UserProfileProps {
  username: string;
}

interface UserProfileData {
  id: number;
  username: string;
  isOnline: boolean;
  avatar: string;
  inGame: boolean;
  is2FaActive: boolean;
  achievements: string[];
}

const UserProfile: React.FC<UserProfileProps> = ({ username }) => {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/users/${username}`,{
      method: 'GET',
      credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as UserProfileData;
      setProfileData(data);
      onOpen();
    } catch (error) {
      console.error("There was a problem fetching the user profile:", error);
    }
  };

  return (
    <>
      <Button onClick={fetchUserProfile} size='xs'>P</Button>

      {profileData && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>User Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div>Username: {profileData.username}</div>
              <div>Online: {profileData.isOnline ? "Yes" : "No"}</div>
              <div>
                Avatar: <img src={profileData.avatar} alt="User avatar" width={100} />
              </div>
              <div>In Game: {profileData.inGame ? "Yes" : "No"}</div>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default UserProfile;
