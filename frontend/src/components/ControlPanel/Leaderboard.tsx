import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

interface Match {
	id: number;
	homePlayerId: number;
	awayPlayerId: number;
	winnerId: number;
}

function Leaderboard() {
	const [matches, setMatches] = useState<Match[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/matches/all/user`, {
			credentials: "include",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok " + response.statusText);
				}
				return response.json();
			})
			.then((data: Match[]) => setMatches(data))
			.catch((error: Error) => setError(error.message));
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<Table variant="simple">
			<Thead>
				<Tr>
					<Th>ID</Th>
					<Th>Home Player ID</Th>
					<Th>Away Player ID</Th>
					<Th>Winner ID</Th>
				</Tr>
			</Thead>
			<Tbody>
				{matches.map((match) => (
					<Tr key={match.id}>
						<Td>{match.id}</Td>
						<Td>{match.homePlayerId}</Td>
						<Td>{match.awayPlayerId}</Td>
						<Td>{match.winnerId}</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
}

export default Leaderboard;
