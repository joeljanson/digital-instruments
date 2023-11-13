import React, { useEffect } from "react";
import Keyboard from "./Keyboard";
import { globalEmitter } from "../../App";
import { Loop, Time, Transport } from "tone";
import { TriggerEvent } from "./Events";

function StepSequencer() {
	useEffect(() => {
		console.log("sequence area is rerendered?");
		const keys = new Keyboard(async (event: TriggerEvent) => {
			console.log("Event is: ", event);
			const nextSubdivision =
				Transport.nextSubdivision("4n") > 0
					? Transport.nextSubdivision("4n") - Time("4n").toSeconds()
					: Transport.nextSubdivision("4n");

			const loop = new Loop((time) => {
				const eventWithDuration = {
					...event,
					duration: "16n",
					startTime: time,
					//settings: { pan: -1 + Math.random() * 2 },
				};
				globalEmitter.emit("SEQUENCER_EVENT", eventWithDuration);
			}, "16n").start();
			Transport.start();
			await event.promise;
			loop.stop();
		}, "all");

		// Cleanup function to remove the event listeners
		return () => {
			document.removeEventListener("keydown", keys.handleKeyDown);
			document.removeEventListener("keyup", keys.handleKeyUp);
		};
	}, []);

	return <div className="module-area-wrapper">Sequencer area</div>;
}

export default StepSequencer;
