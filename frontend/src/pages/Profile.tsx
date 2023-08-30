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

export default function Profile() {
  // Initialize state to keep track of userId

  return (
    <Tabs mt="40px" p="20px" colorScheme="purple" variant="enclosed">
      <span>Profile</span>
      <TabList>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Account Info</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Friends</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>  
          {/* Updated to use dynamic userId */}
          <UpdateUser />
        </TabPanel>
        <TabPanel>
          <Friends />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
