import { SunIcon, MoonIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { List, ListItem, ListIcon, Box, Spacer } from "@chakra-ui/react"
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
	<Box
	bgSize="cover"
	bgPosition="center"
	bgRepeat="no-repeat"
  >
	<List color="lavender" fontSize="2.3em" spacing={4} style={{ fontFamily: "'IM Fell English SC', serif" }}>
	  <ListItem>
		<NavLink to="/profile">
		<ListIcon as={SunIcon} color="#FFCDB2" style={{ fontFamily: "'IM Fell English SC', serif" }}/>
		  Account
		</NavLink>
	  </ListItem>
	  <ListItem>
		<NavLink to="/chat">
		<ListIcon as={MoonIcon} color="lightblue" style={{ fontFamily: "'IM Fell English SC', serif" }}/>
		  Chat
		</NavLink>
	  </ListItem>
	  <ListItem>
		<NavLink to="/game">
		<ListIcon as={TriangleUpIcon} color="palegreen" style={{ fontFamily: "'IM Fell English SC', serif" }}/>
		  Game
		</NavLink>
	  </ListItem>
	</List>
	</Box>
  )
}
