import {Tab, TabList, TabPanels, TabPanel, Tabs, List, ListItem} from "@chakra-ui/react";
import CreateChannel from "../components/CreateChannel";

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
        </TabPanel>
        <TabPanel>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

