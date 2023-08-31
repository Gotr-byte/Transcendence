import {
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
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
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Settings</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Friends</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Sent Friend Requests</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Recieved Friend Request</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>  
          <UpdateUser />
          <AddFriend/>
          <DeleteFriend/>
        </TabPanel>
        <TabPanel>
          <Friends />
        </TabPanel>
        <TabPanel>
          <SentFriendRequests/>
        </TabPanel>
        <TabPanel>
          <ReceivedFriendRequests/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
