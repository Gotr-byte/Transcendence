import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

type Achievement = string;

interface AchievementsProps {
    username: string;
}

function ChatAchievements({ username }: AchievementsProps) {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;  // Don't fetch achievements if username isn't available

        // Using the username prop to fetch achievements
        fetch(`${import.meta.env.VITE_API_URL}/users/${username}/achievements`, {
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then((data: Achievement[]) => setAchievements(data))
            .catch((error: Error) => setError(error.message));
    }, [username]);  // Depend on the username prop so it re-runs when username changes

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>Your Achievements</Th>
                </Tr>
            </Thead>
            <Tbody>
                {achievements.map((achievement, index) => (
                    <Tr key={index}>
                        <Td>{achievement}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}

export default ChatAchievements;