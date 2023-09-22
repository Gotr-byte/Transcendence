import { Grid, GridItem, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import GalaxySlideShow from "../components/GalaxySlideShow"
import "../../styles.css";
import { useState } from "react";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state variable
  return (
    <Grid templateColumns="repeat(6, 1fr)" overflow="hidden">
      {isLoggedIn && (   // Conditional rendering based on showSidebar state
        <GridItem
          as="aside"
          colSpan={{ base: 6, lg: 2, xl: 1 }}
          minHeight={{ lg: "100vh" }}
          p={{ base: "20px", lg: "30px" }}
          bgImage='url("../../public/bookCover.jpg")'
          bgSize="100% 100%" 
          bgRepeat="no-repeat" 
        >
          <Sidebar />
        </GridItem>
      )}
      <GridItem
    as="main"
    colSpan={{ base: 6, lg: 4, xl: 5 }}
    p="40px"
    position="relative"
  >
    <GalaxySlideShow></GalaxySlideShow>
    <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    <Outlet />
  </GridItem>
    </Grid>
  );
}
