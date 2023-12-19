import React, { useEffect, useRef } from "react";
import { BaseInstrumentProps } from "./BaseInstrument";
import { withBaseInstrumenttInterface } from "./BaseInstrumentInterface";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../../Sequencers/Helpers/Events";
import { Player, now } from "tone";
import { buffer } from "stream/consumers";

const TestInstrument: React.FC<BaseInstrumentProps> = ({
	buffer,
	outputChannel,
	bufferLoaded,
}) => {
	const playerMap = useRef<Map<number, Player>>(new Map());

	useEffect(() => {
		if (bufferLoaded) {
			const triggerEventHandler = async (event: TriggerEvent) => {
				if (event.eventType === "noteOn") {
					noteOn(event);
				} else if (event.eventType === "noteOff") {
					noteOff(event);
				}
			};

			globalEmitter.on("SEQUENCER_EVENT", triggerEventHandler);
			return () => {
				globalEmitter.off("SEQUENCER_EVENT", triggerEventHandler);
				playerMap.current.forEach((player) => player.dispose());
				playerMap.current.clear();
			};
		}
	}, [bufferLoaded]);

	const noteOn = (event: TriggerEvent) => {
		const player = new Player({
			fadeIn: 0,
			fadeOut: 0,
			onstop: () => {
				setTimeout(() => {
					player.dispose();
					//console.log("Things disposed!");
				}, 1000);
			},
		});
		console.log(bufferLoaded);
		playerMap.current.set(event.note, player);

		const startTime = event.startTime ?? now();

		if (buffer) {
			const internalBuffer = buffer!;

			player.buffer = internalBuffer;
			player.playbackRate = 1; //currentLoadedSettings.playbackRate;
			//player.chain(outputChannel!);
			player.toDestination();
			console.log("Should sound!");

			const duration = player.buffer.duration;
			const pieces = duration / 34;

			let startOffset = pieces * event.note;

			if (event.duration) {
				console.log("Duration is defined");
				player.start(startTime, startOffset, event.duration);
			} else {
				console.log("Duration is not defined");
				const stop =
					startOffset + 1.3 > internalBuffer.duration
						? internalBuffer.duration
						: startOffset + 1.3;
				player.start(startTime, startOffset, 1);
				player.loop = false;
				player.loopStart = startOffset;
				player.loopEnd = stop;
			}
		}
		console.log("Note on!");
	};

	const noteOff = (event: TriggerEvent) => {
		const player = playerMap.current.get(event.note);
		if (player) {
			player.stop();
			player.loop = false;
			player.dispose();
			playerMap.current.delete(event.note); // Remove from map after stopping
		}
		console.log("Note off!");
	};

	return <div>TEST INSTRUMENT!</div>;
};

export default withBaseInstrumenttInterface(TestInstrument);
