import { useEffect, useState } from "react";
import AddFriendButton from "./AddFriendButton";
import UserProfile from "./UserProfile";
import SendDirectMessage from "./SendDirectMessage";
import MatchThisUser from "./MatchThisUser";


type UserRole = "ADMIN" | "USER";

interface User {
	id: number;
	username: string;
	avatar: string;
	isOnline: boolean;
	role: UserRole;
}

interface UsersData {
	usersNo: number;
	users: User[];
}

interface ChatUsersProps {
	currentRoomId: number | null;
}

const ChatUsers: React.FC<ChatUsersProps> = ({ currentRoomId }) => {
	// New prop
	const [chatUsers, setChatUsers] = useState<UsersData>({
		usersNo: 0,
		users: [],
	});

	useEffect(() => {
		const fetchChatUsers = async () => {
			if (!currentRoomId) {
				// New check
				return;
			}

			try {
				console.log(currentRoomId);
				const response = await fetch(
					`${
						import.meta.env.VITE_API_URL
					}/chat/channel/id/${currentRoomId}/users`,
					{
						// Dynamic URL
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch users");
				}

				const data: UsersData = await response.json();
				setChatUsers(data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchChatUsers();
	}, [currentRoomId]); // Dependency updated

	return (
		<div>
			<h1>Chat Room Users in Room: {currentRoomId || "None selected"}</h1>
			{chatUsers.usersNo > 0 ? (
				<ul>
					{chatUsers.users.map((user) => (
						<li key={user.id}>
							{user.username} is online: {user.isOnline ? "Yes" : "No"}
							<img
								style={{ width: "50px", height: "50px", borderRadius: "50%" }}
								src={user.avatar}
								alt={`${user.username}'s avatar`}
							/>
							<AddFriendButton username={user.username} />
							<UserProfile username={user.username} />
							<SendDirectMessage username={user.username} id={user.id} />
							<MatchThisUser username={user.username} />
						</li>
					))}
				</ul>
			) : (
				<p>No users found :</p>
			)}
		</div>
	);
};

export default ChatUsers;
