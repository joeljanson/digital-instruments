// SessionContext.tsx
import React from "react";

type SessionContextType = {
	bpm: number;
	setBpm: (bpm: number) => void;
};

const SessionContext = React.createContext<SessionContextType>({
	bpm: 120, // Default bpm value
	setBpm: () => {}, // Placeholder function to update the bpm
});

export default SessionContext;
