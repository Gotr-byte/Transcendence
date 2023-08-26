import React, { FC } from "react";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";

const Header: FC = () => {
  return (
    <Flex w="100%">
      <Avatar size="lg" src="/img/mario.png">
        <AvatarBadge boxSize="1.25em" bg="green.500" />
      </Avatar>
      <Flex flexDirection="column" mx="5" justify="center">
        <Text fontSize="lg" fontWeight="bold">
          Mario
        </Text>
        <Text color="green.500">Online</Text>
      </Flex>
    </Flex>
  );
};

export default Header;