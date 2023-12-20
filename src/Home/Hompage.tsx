// HomePage.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllSessionInfos } from "../Database Connections/getSession";
import { SessionInfo } from "../Session/Session/SessionInterface";

const HomePage = () => {
	const [sessions, setSessions] = useState<SessionInfo[]>([]);

	useEffect(() => {
		async function loadSessions() {
			const sessionInfos = await fetchAllSessionInfos();
			setSessions(sessionInfos);
		}

		loadSessions();
	}, []);

	return (
		<div>
			<h2>Home Page</h2>
			{sessions.length ? (
				<nav>
					<ul>
						{sessions.map((session) => (
							<li key={session.id}>
								<Link to={`/session/${session.id}`}>{session.name}</Link>
							</li>
						))}
					</ul>
				</nav>
			) : (
				"Loading..."
			)}
			{/* Additional content for the home page */}
		</div>
	);
};

export default HomePage;
