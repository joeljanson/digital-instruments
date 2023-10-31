import React, { useEffect } from "react";
import Keyboard from "../Common/Keyboard";
import { globalEmitter } from "../../App";
import { Loop } from "tone";

function SequencerArea() {
	useEffect(() => {
		const keys = new Keyboard((event) => {
			globalEmitter.emit("SEQUENCER_EVENT", event);
		}, "all");
	});

	return <div className="module-area-wrapper">Sequencer area</div>;
}

export default SequencerArea;
