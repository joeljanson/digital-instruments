import React, { useEffect } from "react";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../Helpers/Events";
import { ChordCreatorDef, StrummerDef } from "../SequencerComponentInterfaces";

const StrummerComponent: React.FC<StrummerDef> = ({
	range,
	direction,
	...otherProps
}) => {
	useEffect(() => {
		console.log("Chord creator is rerendered?");

		const input = `INPUT_${otherProps.index ? otherProps.index - 1 : 0}`;
		const output = `INPUT_${otherProps.index ? otherProps.index : 0}`;

		const triggerEventHandler = async (event: TriggerEvent) => {
			/* console.log("Triggers event!");
			console.log("Chords are:", chords); */

			const notes = event.notes ? event.notes : undefined;

			if (notes) {
				console.log("Strummer notes are:", notes);
				let startTimes = notes.map((note: number, index: number) => {
					if (direction === "up") return Math.random() * (index * range);
					if (direction === "down") {
						return Math.random() * ((notes.length - index) * range);
					}
					if (direction === "random") return Math.random() * range;
					else return Math.random() * (index * range);
				});
				if (direction === "down") {
					startTimes.sort((a, b) => b - a);
				}
				if (direction === "up") {
					startTimes.sort((a, b) => a - b);
				}

				const eventWithNotes = {
					...event,
					startTimes: startTimes,
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
	}, [range, direction, otherProps]);

	return <div className="module-area-wrapper">Strummer</div>;
};

export default StrummerComponent;
