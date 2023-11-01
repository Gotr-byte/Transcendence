import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

interface User {
	id: string;
	username: string;
	isOnline: boolean;
	avatar: string;
	is2FaActive: boolean;
	is2FaValid?: boolean;
}

type Achievement = string;

function Achievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetching the user first
        fetch(`${import.meta.env.VITE_API_URL}/profile`, {
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then((user: User) => {
                setUsername(user.username);
            })
            .catch((error: Error) => setError(error.message));
    }, []);

    useEffect(() => {
        if (!username) return;  // Don't fetch achievements if username isn't available

        // Using the fetched username to fetch achievements
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
    }, [username]);  // Depend on the username so it re-runs when username is available

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

export default Achievements;
