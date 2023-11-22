import React, { useEffect } from "react";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../Helpers/Events";
import { StepSequencerDef } from "../SequencerComponentInterfaces";
import { Loop, Transport } from "tone";
import { note } from "tonal";

const StepSequencerComponent: React.FC<StepSequencerDef> = ({
	steps,
	isLastInChain,
	...otherProps
}) => {
	useEffect(() => {
		console.log("Chord creator is rerendered?");

		const input = `INPUT_${otherProps.index ? otherProps.index - 1 : 0}`;
		let output = `INPUT_${otherProps.index ? otherProps.index : 0}`;
		if (isLastInChain) {
			output = "SEQUENCER_EVENT";
		}

		const currentlyPressedNotes = new Set<number>();
		let loopStarted = false;

		let loop: Loop;
		let loopIndex = 0;

		const triggerEventHandler = async (event: TriggerEvent) => {
			console.log("Triggers event in step sequencer!");
			if (event.eventType === "noteOn") {
				currentlyPressedNotes.add(event.note); // Use a Set for unique values
				console.log("currentlyPressedNotes", currentlyPressedNotes);
				if (!loopStarted) {
					loop = new Loop((time) => {
						if (currentlyPressedNotes.size > 0) {
							const notesArray = Array.from(currentlyPressedNotes);
							const note = notesArray[loopIndex % notesArray.length];
							console.log("note", note);
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
					}, "8n");

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

	return <div className="module-area-wrapper">Step sequencer</div>;
};

export default StepSequencerComponent;
