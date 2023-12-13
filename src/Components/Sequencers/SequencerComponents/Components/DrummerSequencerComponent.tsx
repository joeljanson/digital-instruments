import React, { useEffect, useState } from "react";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../Helpers/Events";
import { DrummerSequencerDef } from "../SequencerComponentInterfaces";
import { Part, Time, Transport } from "tone";

const DrummerSequencerComponent: React.FC<DrummerSequencerDef> = ({
	length,
	patterns,
	...otherProps
}) => {
	const [subdivision, setSubdivision] = useState("16n"); // Step 1: Subdivision state

	useEffect(() => {
		const input = `INPUT_${otherProps.index ? otherProps.index - 1 : 0}`;
		let output = `INPUT_${otherProps.index ? otherProps.index : 0}`;

		const currentlyPressedNotes = new Map<
			number,
			{ id: number; notes?: number[]; addedOrder: number }
		>();
		let loopStarted = false;
		let stopId: number = 0;

		let part: Part = new Part();
		part.loop = true;

		let loopIndex = 0;
		const updatePart = () => {
			const event = currentlyPressedNotes.get(getHighestId());
			const realPattern = patterns.filter(
				(pattern) => pattern.note === event?.id.toString()
			);

			part.clear();
			part.loopEnd = length;
			if (realPattern.length !== 0) {
				realPattern[0].pattern.forEach((pattern) => {
					part.add(pattern);
				});
			} else {
				console.log("No pattern found for note: ", event?.id);
			}
		};

		const getHighestId = () => {
			let maxId = -1; // Start with the smallest possible number

			currentlyPressedNotes.forEach((value, key) => {
				if (value.id > maxId) {
					maxId = value.id;
				}
			});

			if (maxId >= 0) {
				console.log(
					`Highest ID entry: Key = ${currentlyPressedNotes.get(
						maxId
					)}, Value =`,
					currentlyPressedNotes.get(maxId)?.notes
				);
			} else {
				console.log("Map is empty or no valid entries found.");
			}
			return maxId;
		};

		const triggerEventHandler = async (event: TriggerEvent) => {
			console.log("Triggers event in Drummer!");
			if (event.eventType === "noteOn") {
				Transport.clear(stopId);
				currentlyPressedNotes.set(event.note, {
					id: event.note,
					notes: event.notes ? event.notes : [event.note],
					addedOrder: currentlyPressedNotes.size,
				});

				updatePart();

				if (loopStarted === false) {
					part.callback = (time, object) => {
						console.log("object", object);
						const eventWithDuration = {
							...event,
							notes: object.notes,
							duration: "4n",
							startTime: time,
						};
						globalEmitter.emit(output, eventWithDuration);
					};
					part.start();
					Transport.start();
					loopStarted = true;
				}
			} else if (event.eventType === "noteOff") {
				// Remove event.note from currentlyPressedNotes
				currentlyPressedNotes.delete(event.note);
				updatePart();

				if (currentlyPressedNotes.size === 0) {
					const nextLoopRestart =
						-0.1 + (1 - part.progress) * Time(length).toSeconds();
					/* const nextLoopRestart = Transport.nextSubdivision("1m"); */
					stopId = Transport.scheduleOnce((time) => {
						console.log("Stopping part");
						part.stop();
						Transport.stop();
						loopStarted = false;
					}, "+" + nextLoopRestart);
					globalEmitter.emit(output, event);
				}
			}
		};

		globalEmitter.on(input, triggerEventHandler);
		return () => {
			globalEmitter.off(input, triggerEventHandler);
		};
	}, [length, patterns, otherProps]);

	const handleSubdivisionChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setSubdivision(event.target.value);
	};
	return (
		<div className="module-area-wrapper">
			Drummer sequencer{" "}
			{/* <div>
				Set step duration:
				<select value={subdivision} onChange={handleSubdivisionChange}>
					<option value="4n">Quarter Note</option>
					<option value="8n">Eighth Note</option>
					<option value="16n">Sixteenth Note</option>
				</select>
			</div> */}
		</div>
	);
};

export default DrummerSequencerComponent;
