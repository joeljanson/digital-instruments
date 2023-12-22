import React from "react";
import { User } from "firebase/auth";

type MomentUserContextType = {
	user: User | null;
	setUser: (user: User | null) => void;
	loading: boolean;
};

const MomentUserContext = React.createContext<MomentUserContextType>({
	user: null, // Default to no authenticated user
	setUser: () => {}, // Placeholder function
	loading: true,
});

export default MomentUserContext;
