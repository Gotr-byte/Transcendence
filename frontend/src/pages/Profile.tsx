import { Tab, TabList, TabPanels, TabPanel, Tabs } from "@chakra-ui/react";
import Friends from "../components/ControlPanel/Friends";
import UpdateUser from "../components/ControlPanel/UpdateUser";
import DeleteFriend from "../components/ControlPanel/DeleteFriend";
import AddFriend from "../components/ControlPanel/AddFriend";
import SentFriendRequests from "../components/ControlPanel/SentFriendRequests";
import ReceivedFriendRequests from "../components/ControlPanel/RecievedFriendRequests";
import UpdateAvatar from "../components/ControlPanel/UpdateAvatar";
import CreateChannel from "../components/ControlPanel/CreateChannel";
import { Spacer } from "@chakra-ui/react";
import EditChannel from "../components/ControlPanel/EditChannel";
import DeleteChannel from "../components/ControlPanel/DeleteChannel";
import BlockUser from "../components/ControlPanel/BlockUser";
import PrivateChannelInvitation from "../components/ControlPanel/PrivateChannelInvitation";
import DesignateAdmin from "../components/ControlPanel/DesignateAdmin";
import FileUpload from "../components/ControlPanel/FileUpload";
import MatchesComponent from "../components/ControlPanel/DisplayMatchHistory";
import BanUser from "../components/ControlPanel/BanUser";
import BanUserTemp from "../components/ControlPanel/BanUserTemp";
import TwoFactorAuthSetup from "../components/ControlPanel/TwoFactorAuthSetup";
import LiftRestrictions from "../components/ControlPanel/LiftRestrictions";
import UnblockUser from "../components/ControlPanel/UnblockUser";
import KickUser from "../components/ControlPanel/KickUser";
import Achievements from "../components/ControlPanel/Achievements ";
import Leaderboard from "../components/ControlPanel/Leaderboard";


export default function Profile() {
  return (
    <Tabs mt="40px" p="20px" colorScheme="purple" variant="enclosed" bgImage='url("/1920paper.jpg")'
    bgSize="100% 100%"
    bgRepeat="no-repeat"
    >
      <span>Account</span>
      <TabList>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Settings</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Friends</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>
          Sent Friend Requests
        </Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>
          Recieved Friend Request
        </Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>MatchHistory</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Achievements</Tab>
        <Tab _selected={{ color: "white", bg: "purple.400" }}>Leaderboard</Tab>
      </TabList>
      <TabPanels style={{ minHeight: "calc(100vh - 400px)", minWidth: "400px"}}>
        <TabPanel>
          <UpdateUser />
          <FileUpload/>
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
          <DesignateAdmin/>
          <BanUserTemp/> 
          <LiftRestrictions/>
          <KickUser />
          <TwoFactorAuthSetup/>
        </TabPanel>
        <TabPanel>
          <Friends />
        </TabPanel>
        <TabPanel>
          <SentFriendRequests />
        </TabPanel>
        <TabPanel>
          <ReceivedFriendRequests />
        </TabPanel>
        <TabPanel>
          <MatchesComponent/>
        </TabPanel>
        <TabPanel>
          <Achievements/>
        </TabPanel>
        <TabPanel>
          <Leaderboard/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
