import React, { useEffect } from "react";
import Keyboard from "./Keyboard";
import { globalEmitter } from "../../App";
import { TriggerEvent } from "./Events";
import { Chord, Scale, note } from "tonal";
import ChordHelper from "./Helpers/ChordHelper";

function ChordCreator() {
	useEffect(() => {
		console.log("sequence area is rerendered?");
		const keys = new Keyboard(async (event: TriggerEvent) => {
			console.log("Event is: ", event);
			const chordHelper = new ChordHelper("C");
			const notes = chordHelper.mapChromaticToChords(event.note);
			const eventWithNotes = {
				...event,
				notes: notes,
				startTimes: notes.map((note, index) => {
					return Math.random() * (index * 0.2);
				}),
			};
			globalEmitter.emit("SEQUENCER_EVENT", eventWithNotes);
		}, "qwerty");

		// Cleanup function to remove the event listeners
		return () => {
			document.removeEventListener("keydown", keys.handleKeyDown);
			document.removeEventListener("keyup", keys.handleKeyUp);
		};
	}, []);

	return <div className="module-area-wrapper">Chord creator</div>;
}

export default ChordCreator;
