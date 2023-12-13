import React, { useEffect, useState } from "react";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../Helpers/Events";
import { DrummerSequencerDef } from "../SequencerComponentInterfaces";
import { Part, Time, Transport, now } from "tone";

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
		let stopId: any;

		let part: Part = new Part();

		let loopIndex = 0;
		const updatePart = () => {
			const event = currentlyPressedNotes.get(getHighestId());
			const realPattern = patterns.filter(
				(pattern) => pattern.note === event?.id.toString()
			);

			part.clear();
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
				clearTimeout(stopId);
				currentlyPressedNotes.set(event.note, {
					id: event.note,
					notes: event.notes ? event.notes : [event.note],
					addedOrder: currentlyPressedNotes.size,
				});
				if (!part) {
					part = new Part();
				}

				updatePart();
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
				part.loop = true;

				if (loopStarted === false) {
					//part.loopStart = now();
					console.log("Transport state: ", Transport.state);
					if (Transport.state === "started") {
						Transport.position = "0:0:1";
						console.log("Transport position", Transport.position);
					} else {
						Transport.start(now(), "0:0:0");
						console.log("Transport position", Transport.position);
					}
					part.start(0);
					part.loopEnd = "1:0:0"; //Time(length).toBarsBeatsSixteenths();
					part.loop = 1000;
					loopStarted = true;
				}
			} else if (event.eventType === "noteOff") {
				// Remove event.note from currentlyPressedNotes
				currentlyPressedNotes.delete(event.note);

				if (currentlyPressedNotes.size !== 0) {
					updatePart();
				}
				if (currentlyPressedNotes.size === 0) {
					const nextLoopRestart =
						-0.1 + (1 - part.progress) * Time(length).toSeconds();
					/* const nextLoopRestart = Transport.nextSubdivision("1m"); */
					stopId = setTimeout(() => {
						console.log("Stopping part");
						//part.loop = false;
						part.stop();
						part.dispose();
						Transport.stop();
						loopStarted = false;
						stopId = "";
					}, nextLoopRestart * 1000);
					/* stopId = Transport.scheduleOnce((time) => {
						
					}, "+" + nextLoopRestart); */
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
