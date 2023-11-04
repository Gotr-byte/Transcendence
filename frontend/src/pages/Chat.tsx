import { Tab, TabList, TabPanels, TabPanel, Tabs } from "@chakra-ui/react";
import ChatUI from "../components/ChatUI";

export default function Chat() {
  return (
    <Tabs
      mt="40px"
      p="20px"
      colorScheme="purple"
      variant="enclosed"
      bgImage='url("/1920paper.jpg")'
      bgSize="100% 100%"
      bgRepeat="no-repeat"
    >
      <TabList>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Chat</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ChatUI />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
