import React, { useEffect, useState } from "react";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../Helpers/Events";
import { EuclideanSequencerDef } from "../SequencerComponentInterfaces";
import { Loop, Transport } from "tone";

const EuclideanSequencerComponent: React.FC<EuclideanSequencerDef> = ({
	steps,
	...otherProps
}) => {
	const [subdivision, setSubdivision] = useState("16n"); // Step 1: Subdivision state

	const bjorklund = (pulses: number, steps: number): boolean[] => {
		let pattern: boolean[] = [];
		let counts: number[] = [];
		let remainders: number[] = [pulses];
		let divisor = steps - pulses;
		let level = 0;

		while (true) {
			counts.push(Math.floor(divisor / remainders[level]));
			remainders.push(divisor % remainders[level]);
			divisor = remainders[level];
			level++;
			if (remainders[level] <= 1) {
				break;
			}
		}

		counts.push(divisor);

		function build(level: number): void {
			if (level === -1) {
				pattern.push(false);
			} else if (level === -2) {
				pattern.push(true);
			} else {
				for (let i = 0; i < counts[level]; i++) {
					build(level - 1);
				}
				if (remainders[level] !== 0) {
					build(level - 2);
				}
			}
		}

		build(level);
		return pattern;
	};

	const rotatedBjorklund = (array: boolean[], rotation: number): boolean[] => {
		const length = array.length;
		rotation = rotation % length; // Ensure rotation is within array bounds

		for (let i = 0; i < rotation; i++) {
			const element = array.shift();
			if (element !== undefined) {
				array.push(element);
			}
		}

		return array;
	};

	useEffect(() => {
		console.log("Chord creator is rerendered?");
		const patterns = [bjorklund(3, steps), bjorklund(4, steps)];

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
						const notesToPlay = [];
						if (allNotesFlattened.length > 0) {
							patterns.forEach((pattern, index) => {
								if (pattern[loopIndex % pattern.length]) {
									console.log("Strike a note!");
									//const note = allNotesFlattened[index];
									const note =
										allNotesFlattened[loopIndex % allNotesFlattened.length];
									console.log("note", note);
									notesToPlay.push(note);
									const eventWithDuration = {
										...event,
										note: note,
										duration: subdivision,
										startTime: time,
										//settings: { pan: -1 + Math.random() * 2 },
									};
									globalEmitter.emit(output, eventWithDuration);
								} else {
									console.log("Dont strike a note!");
								}
							});

							loopIndex++;
						}
					}, subdivision);

					loop.start();
					Transport.start();
					loopStarted = true;
				}
			} else if (event.eventType === "noteOff") {
				// Remove event.note from currentlyPressedNotes
				currentlyPressedNotes.delete(event.note);

				if (currentlyPressedNotes.size === 0) {
					loop.stop();
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

	const handleSubdivisionChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setSubdivision(event.target.value);
	};
	return (
		<div className="module-area-wrapper">
			Euclidean sequencer{" "}
			<div>
				Set step duration:
				<select value={subdivision} onChange={handleSubdivisionChange}>
					<option value="4n">Quarter Note</option>
					<option value="8n">Eighth Note</option>
					<option value="16n">Sixteenth Note</option>
				</select>
			</div>
		</div>
	);
};

export default EuclideanSequencerComponent;
