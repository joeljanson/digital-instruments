import React, { useEffect } from "react";
import Keyboard from "../../Helpers/Keyboard";
import { globalEmitter } from "../../../Session/Session";
import { TriggerEvent } from "../../Helpers/Events";
import { OutputComponentDef } from "../SequencerComponentInterfaces";
/* import MidiHandler from "../../Helpers/MidiHandler";
 */ import { Time, Transport } from "tone";

const OutputComponent: React.FC<OutputComponentDef> = ({
	output,
	...otherProps
}) => {
	useEffect(() => {
		/* const midiHandler = new MidiHandler();
		midiHandler.enableMidi(); */

		const input = `INPUT_${otherProps.index ? otherProps.index - 1 : 0}`;

		const triggerEventHandler = async (event: TriggerEvent) => {
			console.log("Triggers event!", event);
			globalEmitter.emit(output, event);
			if (event.eventType === "noteOn") {
				const eventDuration = event.duration
					? Time(event.duration).toSeconds()
					: 0;
				/* const lookAhead =
					0.1 + (Time(event.startTime).toSeconds() - Transport.now());
				midiHandler.playNotes({
					notes: event.notes ?? [event.note],
					duration: eventDuration,
					time: lookAhead,
					velocity: 0.5,
				}); */
			} else if (event.eventType === "noteOff") {
				/* midiHandler.stopNotes({
					notes: event.notes ?? [event.note],
					time: Transport.now(),
					duration: 0,
					velocity: 0.5,
				}); */
			}
		};

		console.log(input);
		globalEmitter.on(input, triggerEventHandler);
		return () => {
			globalEmitter.off(input, triggerEventHandler);
		};
	}, [output, otherProps]);

	return <div className="module-area-wrapper">Sequencer Output</div>;
};

export default OutputComponent;
