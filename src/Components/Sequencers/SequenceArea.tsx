import React, { useEffect } from "react";
import Keyboard from "../Common/Keyboard";
import { globalEmitter } from "../../App";
import { Loop } from "tone";
import { TriggerEvent } from "./Events";

function SequencerArea() {
	useEffect(() => {
		console.log("sequence area is rerendered?");
		/* const keys = new Keyboard((event: TriggerEvent) => {
			if (event.eventType === "noteOn") {
				globalEmitter.emit("SEQUENCER_EVENT", event);
			} else if (event.eventType === "noteOff") {
				//Emit stop
			}
		}, "all"); */

		const keys = new Keyboard(async (event: TriggerEvent) => {
			console.log("Event is: ", event);
			globalEmitter.emit("SEQUENCER_EVENT", event);
		}, "all");

		// Cleanup function to remove the event listeners
		return () => {
			document.removeEventListener("keydown", keys.handleKeyDown);
			document.removeEventListener("keyup", keys.handleKeyUp);
		};
	}, []);

	return <div className="module-area-wrapper">Sequencer area</div>;
}

export default SequencerArea;
