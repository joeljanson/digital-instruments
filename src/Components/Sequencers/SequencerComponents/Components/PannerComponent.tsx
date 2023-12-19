import React, { useEffect } from "react";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../Helpers/Events";
import { PannerDef } from "../SequencerComponentInterfaces";

const PannerComponent: React.FC<PannerDef> = ({ range, ...otherProps }) => {
	useEffect(() => {
		console.log("Chord creator is rerendered?");

		const input = `INPUT_${otherProps.index ? otherProps.index - 1 : 0}`;
		const output = `INPUT_${otherProps.index ? otherProps.index : 0}`;

		const triggerEventHandler = async (event: TriggerEvent) => {
			/* console.log("Triggers event!");
			console.log("Chords are:", chords); */

			const notes = event.notes ? event.notes : [event.note];

			if (notes) {
				console.log("Strummer notes are:", notes);
				let panning = notes.map((note: number, index: number) => {
					return (-1 + Math.random() * 2) * (range ? range : 1);
				});

				const eventWithPanning = {
					...event,
					panning: panning,
				};
				globalEmitter.emit(output, eventWithPanning);
			} else {
				globalEmitter.emit(output, event);
			}
		};

		/* console.log(input); */
		globalEmitter.on(input, triggerEventHandler);
		return () => {
			globalEmitter.off(input, triggerEventHandler);
		};
	}, [range, otherProps]);

	return <div className="module-area-wrapper">Panner</div>;
};

export default PannerComponent;
