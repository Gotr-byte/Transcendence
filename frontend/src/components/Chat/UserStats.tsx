import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

interface Stats {
    position: number;
    matchesPlayed: number;
    matchesWon: number;
    totalPoints: number;
}

interface UserStatsProps {
    username: string;
}

function UserStats({ username }: UserStatsProps) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;  // Don't fetch achievements if username isn't available

        fetch(`${import.meta.env.VITE_API_URL}/users/${username}/matches/stats`, {
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then((data: Stats) => setStats(data))
            .catch((error: Error) => setError(error.message));
    }, [username]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!stats) {
        return <div>Loading...</div>;  // Show a loading indicator or a message
    }

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>User Stats for {username}</Th>
                    <Th></Th>
                    <Th></Th>
                </Tr>
                <Tr>
                    <Th>Position</Th>
                    <Th>Matches Played</Th>
                    <Th>Matches Won</Th>
                    <Th>Total Points</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>{stats.position}</Td>
                    <Td>{stats.matchesPlayed}</Td>
                    <Td>{stats.matchesWon}</Td>
                    <Td>{stats.totalPoints}</Td>
                </Tr>
            </Tbody>
        </Table>
    );
}

export default UserStats;
