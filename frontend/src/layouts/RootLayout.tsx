import { Grid, GridItem, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import "../../styles.css";

export default function RootLayout() {
  return (
    <Grid templateColumns="repeat(6, 1fr)" overflow="hidden">
      <GridItem
        as="aside"
        colSpan={{ base: 6, lg: 2, xl: 1 }}
        // bg="brand.50"
        minHeight={{ lg: "100vh" }}
        p={{ base: "20px", lg: "30px" }}
        bgImage='url("../../public/bookCover.jpg")'
        bgSize="100% 100%" 
        bgRepeat="no-repeat" 
      >
        <Sidebar />
      </GridItem>
      <GridItem
    as="main"
    colSpan={{ base: 6, lg: 4, xl: 5 }}
    p="40px"
    position="relative"
  >
    <Box
      position="absolute"
      top="0"
      left="0"
      w="100%"
      h="100%"
      bgImage="../../public/galaxy.jpg"
      bgSize="cover"
      bgPosition="center"
      animation="floaty 30s infinite linear"
      zIndex="-1"
    />
    <Navbar />
    <Outlet />
  </GridItem>
    </Grid>
  );
}
