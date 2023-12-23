// HomePage.tsx

import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllSessionInfos } from "../Database Connections/getSession";
import { SessionInfo } from "../Session/Session/SessionInterface";
import MomentUserContext from "../Contexts/MomentUserContext";
import {
	loginAnonymously,
	loginWithGoogle,
} from "../Database Connections/users/loginAndSignup";

const HomePage = () => {
	const [sessions, setSessions] = useState<SessionInfo[]>([]);
	const { user, loading } = useContext(MomentUserContext);

	useEffect(() => {
		async function loadSessions() {
			const sessionInfos = await fetchAllSessionInfos();
			setSessions(sessionInfos);
		}
		loadSessions();
	}, []);

	useEffect(() => {
		if (user) {
			console.log("User has loaded", user);
		}
	}, [user]); // Add loading as a dependency

	useEffect(() => {
		if (!loading && !user) {
			console.log("User does not exist, logging in anonymously");
			// If loading is done and no user is logged in, login anonymously
			loginAnonymously();
		} else if (user) {
			console.log("User has loaded", user);
		}
	}, [user, loading]); // Add loading as a dependency

	const loginClick = async () => {
		loginWithGoogle();
	};

	return (
		<div>
			<h2>Home Page</h2>¨
			<button onClick={loginClick}>Login with google!</button>
			{sessions.length ? (
				<nav>
					<ul>
						{sessions.map((session) => (
							<li key={session.id}>
								<Link to={`/session/${session.id}`}>{session.name}</Link>
								<img src={session.imageUrl} alt="imag"></img>
							</li>
						))}
					</ul>
				</nav>
			) : (
				"Loading..."
			)}
			{user ? <p>Welcome, {user.displayName}</p> : <p>No user is signed in.</p>}
		</div>
	);
};

export default HomePage;
