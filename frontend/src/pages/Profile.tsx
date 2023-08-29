import { useState } from "react";
import {
  ChatIcon,
  CheckCircleIcon,
  EmailIcon,
  StarIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import Friends from "../components/Friends";

export default function Profile() {

  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");

  const handleCurrentUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentUsername(event.target.value);
  };

  const handleNewUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewUsername(event.target.value);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:4000/users/${currentUsername}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUsername,
          avatar: avatar,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update username");
      }

      // Handle response, e.g., update UI or notify the user
    } catch (error) {
      console.error("Error:", error);
      // Handle the error, e.g., show a notification or message to the user
    }
  };

  return (
    <Tabs mt="40px" p="20px" colorScheme="purple" variant="enclosed">
      Profile
      <TabList>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Account Info</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Friends</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <List spacing={4}>
            <ListItem>
              <Form onSubmit={handleFormSubmit}>
                <FormControl isRequired mb="20px">
                  <FormLabel>Current Username</FormLabel>
                  <Input
                    type="text"
                    value={currentUsername}
                    onChange={handleCurrentUsernameChange}
                  />
                </FormControl>

                <FormControl isRequired mb="20px">
                  <FormLabel>New Username</FormLabel>
                  <Input
                    type="text"
                    value={newUsername}
                    onChange={handleNewUsernameChange}
                  />
                </FormControl>

                <FormControl isRequired mb="20px">
                  <FormLabel>Avatar URL</FormLabel>
                  <Input
                    type="text"
                    value={avatar}
                    onChange={handleAvatarChange}
                  />
                </FormControl>
                <Button type="submit">Submit</Button>
              </Form>
            </ListItem>
            <ListItem>
              <ListIcon as={EmailIcon} />
              Email: piotr@email.com
            </ListItem>
            <ListItem>
              <ListIcon as={ChatIcon} />
              Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
            <ListItem>
              <ListIcon as={StarIcon} />
              Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
          </List>
        </TabPanel>
        <TabPanel>
          <Friends/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
