import { Avatar, Flex, Box, Text, Button, Heading, Spacer, HStack, useToast, AvatarBadge } from '@chakra-ui/react'
import { UnlockIcon } from '@chakra-ui/icons'

export const Navbar = () => {
  const toast = useToast()

  const showToast = () => {
	toast({
		title: 'Logged out',
		description: 'Successfully logged out',
		duration: 5000,
		isClosable: true,
		status: 'success',
		position: 'top',
		icon: <UnlockIcon />,
	})
  }
  return (
	<Flex as="nav" p="10x" mb="40px" alignItems="center" gap="10px">
		<Heading as="h1" color="black">Transcendence</Heading>
		<Spacer />

		<HStack spacing="10px">
		  <Avatar name="mario" src="/img/mario.png" background="purple">
			<AvatarBadge width="1.3em" bg="teal.500">
				<Text fontSize="xs" color="white">10</Text>
			</AvatarBadge>
		  </Avatar>
		  <Text>piotr@email.com</Text>
		  <Button colorScheme='purple' onClick={showToast} >Logout</Button>	
		</HStack>
	</Flex>
  )
}
