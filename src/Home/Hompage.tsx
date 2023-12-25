// HomePage.tsx

import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllSessionInfos } from "../Database Connections/getSession";
import { SessionInfo } from "../Session/Session/SessionInterface";
import MomentUserContext from "../Contexts/MomentUserContext";
import { User } from "firebase/auth";
import {
	loginAnonymously,
	signInWithGoogle,
} from "../Database Connections/users/loginAndSignup";

import "../CSS/Homepage.scss";

const HomePage = () => {
	const [sessions, setSessions] = useState<SessionInfo[]>([]);
	const { user, setUser, loading } = useContext(MomentUserContext);
	const [internalUser, setInternalUser] = useState<User | null>(null);

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
			setInternalUser(user);
		}
	}, [user, internalUser]); // Add loading as a dependency

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
		const updatedUser = await signInWithGoogle();
		console.log(updatedUser);
		setInternalUser(updatedUser);
		setUser(updatedUser);
	};
	if (loading) {
		return <div></div>;
	}

	return (
		<div>
			<h2>Home Page</h2>¨
			{user ? "" : <button onClick={loginClick}>Login with google!</button>}
			{sessions.length ? (
				<div className="session-container">
					{sessions.map((session) => (
						<div className="session-item" key={session.id}>
							<Link to={`/session/${session.id}`} className="session-link">
								<img
									src={session.imageUrl}
									alt={session.name}
									className="session-image"
								/>
								<span className="session-name">{session.name}</span>
							</Link>
						</div>
					))}
				</div>
			) : (
				"Loading..."
			)}
			{user ? (
				<p>Welcome, {internalUser?.displayName}</p>
			) : (
				<p>No user is signed in.</p>
			)}
		</div>
	);
};

export default HomePage;
