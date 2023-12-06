import React, { useContext, useState } from "react";
import { Transport } from "tone";
import SessionContext from "./Session/SessionContext";
import ObliqueStrategy from "./resources/data/ObliqueStrategies";

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
			<div className="left-content">
				{toneStarted ? <p>Tone started</p> : "Tone note started"}
			</div>
			<div className="middle-content">
				<input
					type="range"
					min="30"
					max="160"
					value={bpm}
					onChange={handleSliderChange}
				/>
				<p>{bpm} BPM</p>
			</div>
			<div className="right-content">
				<ObliqueStrategy />
			</div>
		</div>
	);
};

export default Navigation;
