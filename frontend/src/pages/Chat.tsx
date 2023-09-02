import {Tab, TabList, TabPanels, TabPanel, Tabs, Spacer} from "@chakra-ui/react";
import CreateChannel from "../components/CreateChannel";
import EditChannel from "../components/EditChannel";
import DeleteChannel from "../components/DeleteChannel";
import ChatUsers from "../components/ChatUsers";

export default function Chat() {
  return (
    <Tabs mt="40px" p="20px" colorScheme="purple" variant='enclosed'>Chat
      <TabList>
        <Tab _selected={{color: 'white', bg: 'purple.400' }}>Control Panel</Tab>
        <Tab _selected={{color: 'white', bg: 'purple.400' }}>Private Messages</Tab>
        <Tab _selected={{color: 'white', bg: 'purple.400' }}>Public Chat</Tab>
        <Tab _selected={{color: 'white', bg: 'purple.400' }}>Protected Chat</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <CreateChannel/>
          <Spacer/>
          <EditChannel/>
          <Spacer/>
          <DeleteChannel/>
        </TabPanel>
        <TabPanel>
          <ChatUsers/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

