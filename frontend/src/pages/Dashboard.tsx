import { EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Box, SimpleGrid, Text, Card, CardHeader, CardBody, CardFooter, Flex, Heading, HStack, Button, Divider, Avatar } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";


export default function Dashboard() {
  const tasks = useLoaderData()
return (
  <SimpleGrid spacing={10} minChildWidth="300px">
    {tasks && tasks.map(task => (
      <Card key={task.id} borderTop="8px" borderColor="purple.400" bg="white">
        <CardHeader>
          <Flex gap={5}>
            <Avatar src={task.img}/>
            <Box w="50px" h="50px">
              <Text>AV</Text>
            </Box>
            <Box>
              <Heading as="h3" size="sm">{task.title}</Heading>
              <Text>by {task.author}</Text>
            </Box>
          </ Flex>
        </CardHeader>
        <CardBody color="gray.500">
          <Text>{task.description}</Text>
        </CardBody>

        <Divider color="grey.200"/>

        <CardFooter>
        <Flex gap={5}>
          <Button variant="ghost" leftIcon={<ViewIcon/>}>Watch</Button>
          <Button variant="ghost" leftIcon={<EditIcon/>}>Comment</Button>
        </Flex>
        </CardFooter>
      </Card>
    ))}
  </SimpleGrid>
)
}

export const tasksLoader = async () => {
  const res = await fetch('http://localhost:3000/tasks')

  return res.json()
}