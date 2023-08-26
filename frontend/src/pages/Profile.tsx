import { ChatIcon, CheckCircleIcon, EmailIcon, StarIcon, WarningIcon } from "@chakra-ui/icons";
import { Tab, TabList, TabPanels, TabPanel, Tabs, List, ListItem, ListIcon } from "@chakra-ui/react";

export default function Profile() {
  return (
    <Tabs mt="40px" p="20px" colorScheme="purple" variant='enclosed'>Profile
      <TabList>
        <Tab _selected={{color: 'white', bg: 'purple.400' }}>Account Info</Tab>
        <Tab _selected={{color: 'white', bg: 'purple.400' }}>Task History</Tab>
        <Tab _selected={{color: 'white', bg: 'purple.400' }}>Friends</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <List spacing={4}>
            <ListItem>
              <ListIcon as={EmailIcon}/>
              Email: piotr@email.com
            </ListItem>
            <ListItem>
              <ListIcon as={ChatIcon}/>
              Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
            <ListItem>
              <ListIcon as={StarIcon}/>
              Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
          </List>

        </TabPanel>
        <TabPanel>
        <List spacing={4}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="teal.400"/>
              Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="teal.400"/>
              Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
            <ListItem>
              <ListIcon as={WarningIcon} color="red.400" />
              Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="teal.400"/>
              Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="teal.400"/>
              Lorem impsum dolor sit amet consecteur adipisicing elit.
            </ListItem>
          </List>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
