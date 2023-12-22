import React, { useState, useEffect, ReactNode } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import MomentUserContext from "./MomentUserContext";
import { auth } from "../Database Connections/firebaseService";

type MomentUserContextProviderProps = {
	children: ReactNode;
};

const MomentUserContextProvider: React.FC<MomentUserContextProviderProps> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true); // Loading state

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser);
			setLoading(false); // Set loading to false once the check is complete
		});
		return () => unsubscribe();
	}, [auth]);

	return (
		<MomentUserContext.Provider value={{ user, setUser, loading }}>
			{children}
		</MomentUserContext.Provider>
	);
};

export default MomentUserContextProvider;
