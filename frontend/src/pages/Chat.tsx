import { Tab, TabList, TabPanels, TabPanel, Tabs, Spacer } from "@chakra-ui/react";
import ChatUI from "../components/ChatUI";
import AddFriend from "../components/ControlPanel/AddFriend";
import DeleteFriend from "../components/ControlPanel/DeleteFriend";
import EditChannel from "../components/ControlPanel/EditChannel";
import DeleteChannel from "../components/ControlPanel/DeleteChannel";
import CreateChannel from "../components/ControlPanel/CreateChannel";
import PrivateChannelInvitation from "../components/ControlPanel/PrivateChannelInvitation";
import BlockUser from "../components/ControlPanel/BlockUser";
import UnblockUser from "../components/ControlPanel/UnblockUser";
import DesignateAdmin from "../components/ControlPanel/DesignateAdmin";
import BanUserTemp from "../components/ControlPanel/BanUserTemp";
import LiftRestrictions from "../components/ControlPanel/LiftRestrictions";
import KickUser from "../components/ControlPanel/KickUser";

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
          <AddFriend />
          <DeleteFriend />
          <CreateChannel />
          <Spacer />
          <EditChannel />
          <Spacer />
          <DeleteChannel />
          <PrivateChannelInvitation />
          <BlockUser />
          <UnblockUser />
          <DesignateAdmin />
          <BanUserTemp />
          <LiftRestrictions />
          <KickUser />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
