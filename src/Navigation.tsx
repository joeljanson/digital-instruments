import React, { useContext, useState } from "react";
import { Transport } from "tone";
import SessionContext from "./Session/SessionContext";

interface NavigationProps {
	toneStarted: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ toneStarted }) => {
	const { bpm, setBpm } = useContext(SessionContext);

	const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newBpm = parseInt(event.target.value);
		Transport.bpm.rampTo(newBpm, 0.1);
		//This probably needs to be added to a react context
		setBpm(newBpm);
	};

	return (
		<div className="top-bar">
			{toneStarted ? <p>Tone started</p> : null}
			<input
				type="range"
				min="30"
				max="160"
				value={bpm}
				onChange={handleSliderChange}
			/>
			<p>{bpm} BPM</p>
		</div>
	);
};

export default Navigation;
