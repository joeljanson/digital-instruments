import React, { useEffect } from "react";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../Helpers/Events";
import { ChordCreatorDef } from "../SequencerComponentInterfaces";

const ChordCreatorComponent: React.FC<ChordCreatorDef> = ({
	chords,
	...otherProps
}) => {
	useEffect(() => {
		console.log("Chord creator is rerendered?");

		const input = `INPUT_${otherProps.index ? otherProps.index - 1 : 0}`;
		let output = `INPUT_${otherProps.index ? otherProps.index : 0}`;

		const triggerEventHandler = async (event: TriggerEvent) => {
			/* console.log("Triggers event!");
			console.log("Chords are:", chords); */

			const chord = chords.find((chord) => chord.note === event.note);
			const notes = chord
				? chord.voicing.map((note) => event.note + note)
				: undefined;

			if (notes) {
				const eventWithNotes = {
					...event,
					notes: notes,
					startTimes: notes.map((note: number, index: number) => {
						return Math.random() * (index * 0.5);
					}),
				};
				globalEmitter.emit(output, eventWithNotes);
			} else {
				globalEmitter.emit(output, event);
			}
		};

		/* console.log(input); */
		globalEmitter.on(input, triggerEventHandler);
		return () => {
			globalEmitter.off(input, triggerEventHandler);
		};
	}, [chords, otherProps]);

	return <div className="module-area-wrapper">Chord creator</div>;
};

export default ChordCreatorComponent;
