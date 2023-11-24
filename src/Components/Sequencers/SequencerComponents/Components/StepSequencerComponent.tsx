import React, { useEffect } from "react";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../Helpers/Events";
import { StepSequencerDef } from "../SequencerComponentInterfaces";
import { Loop, Transport } from "tone";
import { note } from "tonal";

const StepSequencerComponent: React.FC<StepSequencerDef> = ({
	steps,
	...otherProps
}) => {
	useEffect(() => {
		console.log("Chord creator is rerendered?");

		const input = `INPUT_${otherProps.index ? otherProps.index - 1 : 0}`;
		let output = `INPUT_${otherProps.index ? otherProps.index : 0}`;

		const currentlyPressedNotes = new Map<
			number,
			{ id: number; notes?: number[] }
		>();
		let loopStarted = false;

		let loop: Loop;
		let loopIndex = 0;

		const triggerEventHandler = async (event: TriggerEvent) => {
			console.log("Triggers event in step sequencer!");
			if (event.eventType === "noteOn") {
				currentlyPressedNotes.set(event.note, {
					id: event.note,
					notes: event.notes ? event.notes : [event.note],
				});
				console.log(
					"currentlyPressedNotes",
					Array.from(currentlyPressedNotes.values())
				);

				if (!loopStarted) {
					loop = new Loop((time) => {
						const allNotesFlattened = Array.from(currentlyPressedNotes.values())
							.map((obj) => obj.notes)
							.flat();
						if (allNotesFlattened.length > 0) {
							const note =
								allNotesFlattened[loopIndex % allNotesFlattened.length];
							const eventWithDuration = {
								...event,
								note: note,
								duration: "16n",
								startTime: time,
								//settings: { pan: -1 + Math.random() * 2 },
							};
							loopIndex++;

							globalEmitter.emit(output, eventWithDuration);
						}
					}, "16n");

					loop.start();
					Transport.start();
					loopStarted = true;
				}
			} else if (event.eventType === "noteOff") {
				// Remove event.note from currentlyPressedNotes
				currentlyPressedNotes.delete(event.note);

				if (currentlyPressedNotes.size === 0) {
					loop.stop();
					Transport.stop();
					loopStarted = false;
					loopIndex = 0;
				}
				globalEmitter.emit(output, event);
				console.log("currentlyPressedNotes", currentlyPressedNotes);
				console.log("event.note", event.note);
			}
		};

		globalEmitter.on(input, triggerEventHandler);
		return () => {
			globalEmitter.off(input, triggerEventHandler);
		};
	}, [steps, otherProps]);

	return (
		<div className="module-area-wrapper">
			Step sequencer<div>Set step duration</div>
		</div>
	);
};

export default StepSequencerComponent;
