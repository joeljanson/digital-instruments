// SessionContextProvider.tsx
import React, { useState, ReactNode } from "react";
import SessionContext from "./SessionContext";

type SessionContextProviderProps = {
	children: ReactNode;
};

const SessionContextProvider: React.FC<SessionContextProviderProps> = ({
	children,
}) => {
	const [bpm, setBpm] = useState<number>(120); // Starting value for bpm

	return (
		<SessionContext.Provider value={{ bpm, setBpm }}>
			{children}
		</SessionContext.Provider>
	);
};

export default SessionContextProvider;
