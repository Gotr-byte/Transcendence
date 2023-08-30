import React, { useState } from "react";
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
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
} from "@chakra-ui/react";
import Friends from "../components/Friends";
import UpdateUser from "../components/UpdateUser";
import DeleteFriend from "../components/DeleteFriend";
import AddFriend from "../components/AddFriend"
import SentFriendRequests from "../components/SentFriendRequests";
import ReceivedFriendRequests from "../components/RecievedFriendRequests";

export default function Profile() {
  // Initialize state to keep track of userId

  return (
    <Tabs mt="40px" p="20px" colorScheme="purple" variant="enclosed">
      <span>Profile</span>
      <TabList>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Account Info</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Friends</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Sent Friend Requests</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Recieved Friend Request</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>  
          {/* Updated to use dynamic userId */}
          <UpdateUser />
        </TabPanel>
        <TabPanel>
          <Friends />
          <DeleteFriend/>
          <AddFriend/>
        </TabPanel>
        <TabPanel>
          <SentFriendRequests/>
          <AddFriend/>
        </TabPanel>
        <TabPanel>
          <ReceivedFriendRequests/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
