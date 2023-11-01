import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

interface Competitor {
	// id: number;
	// homePlayerId: number;
	// awayPlayerId: number;
	// winnerId: number;
	position: number;
	username: string;
	wins: number,
	losses: number,
	points: number
}

function Leaderboard() {
	const [competitors, setCompetitors] = useState<Competitor[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/leaderboard`, {
			credentials: "include",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok " + response.statusText);
				}
				return response.json();
			})
			.then((data: Competitor[]) => setCompetitors(data))
			.catch((error: Error) => setError(error.message));
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<Table variant="simple">
			<Thead>
				<Tr>
					<Th>Position</Th>
					<Th>Username</Th>
					<Th>Wins</Th>
					<Th>Loses</Th>
					<Th>Points</Th>
				</Tr>
			</Thead>
			<Tbody>
				{competitors.map((competitor) => (
					<Tr key={competitor.position}>
						<Td>{competitor.position}</Td>
						<Td>{competitor.username}</Td>
						<Td>{competitor.wins}</Td>
						<Td>{competitor.loses}</Td>
						<Td>{competitor.points}</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
}

export default Leaderboard;
