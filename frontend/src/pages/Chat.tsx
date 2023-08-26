import {Tab, TabList, TabPanels, TabPanel, Tabs, List, ListItem} from "@chakra-ui/react";
import ChatBox from "../components/ChatBox/ChatBox";
export default function Chat() {
  return (
    <Tabs mt="40px" p="20px" colorScheme="purple" variant='enclosed'>Chat
      <TabList>
        <Tab _selected={{color: 'white', bg: 'purple.400' }}>Lobby</Tab>
        <Tab _selected={{color: 'white', bg: 'purple.400' }}>Cats</Tab>
        <Tab _selected={{color: 'white', bg: 'purple.400' }}>Dogs</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <ChatBox/>
        </TabPanel>
        <TabPanel>
        <List spacing={4}>
            <ListItem>
              User2: Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
            <ListItem>
              You: Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
            <ListItem>
              You: Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
            <ListItem>
              You: Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
            <ListItem>
              You: Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
          </List>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

