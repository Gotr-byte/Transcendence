import {
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Spacer,
} from "@chakra-ui/react";
import ChatUI from "../components/ChatUI";

export default function Chat() {
  return (
    <Tabs mt="40px" p="20px" colorScheme="purple" variant="enclosed">
      <TabList>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>
          Chat
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ChatUI />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
