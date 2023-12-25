import React, { useEffect, useRef } from "react";
import {
	BufferSource,
	Player,
	ToneAudioBuffer,
	ToneAudioBuffers,
	Volume,
	now,
} from "tone";
import { globalEmitter } from "../../Session/Session";
import { TriggerEvent } from "../../Sequencers/Helpers/Events";
import BufferSources from "../../Common/BufferSources";
import "../../../CSS/InstrumentArea.scss";
import { EffectsPool } from "../Helpers/EffectsPool";
import { withBaseInstrumenttInterface } from "./BaseInstrument/BaseInstrumentInterface";
import { BaseInstrumentProps } from "./BaseInstrument/BaseInstrument";

const bd = require("../../../audio/drums/jazz-kit/bd.mp3");
const sd = require("../../../audio/drums/jazz-kit/sn.mp3");
const hh1 = require("../../../audio/drums/jazz-kit/hh1.mp3");
const hh2 = require("../../../audio/drums/jazz-kit/hh2.mp3");
const hh3 = require("../../../audio/drums/jazz-kit/hh3.mp3");

type DrumMap = Record<number, string>;

const Drummer: React.FC<BaseInstrumentProps> = ({ outputChannel }) => {
	const buffersRef = useRef<ToneAudioBuffers | null>(null);

	const playerMap = useRef<Map<number, Player>>(new Map());

	const midiDrumMap: DrumMap = {
		0: "bd", // Acoustic Bass Drum
		2: "sd", // Acoustic Snare
		6: "hh1", // Closed Hi-Hat
		8: "hh2", // Semi-Closed Hi-Hat
		10: "hh3", // Fully Open Hi-Hat
	};

	const preloadAudio = () => {
		const drumsamples = new ToneAudioBuffers(
			{
				bd: bd,
				sd: sd,
				hh1: hh1,
				hh2: hh2,
				hh3: hh3,
			},
			() => {
				console.log("Drum samples loaded");
				buffersRef.current = drumsamples;
				//player.start();
			}
		);
	};

	useEffect(() => {
		console.log("Use effect is run in division");
		if (outputChannel) {
			const triggerEventHandler = async (event: TriggerEvent) => {
				// Your event handling logic here

				if (event.eventType === "noteOn") {
					const startTime = event.startTime ?? now();

					if (buffersRef.current) {
						event.notes?.forEach((note) => {
							console.log("Note: ", note);
							const url = buffersRef.current?.get(midiDrumMap[note] ?? "bd");
							const oneShot = new BufferSource(url).connect(volume);
							oneShot.start(startTime);
						});
					}
				} else if (event.eventType === "noteOff") {
					console.log("Note off in Drummer");
				}
			};

			globalEmitter.on("SEQUENCER_EVENT", triggerEventHandler);
			outputChannel.send("effectsRackIn");
			const volume = new Volume(0).connect(outputChannel);
			preloadAudio();
			// Don't forget to clean up the event listener
			return () => {
				globalEmitter.off("SEQUENCER_EVENT", triggerEventHandler);
			};
		}
	}, [outputChannel]);

	const divStyle = {
		backgroundImage: `url(${"https://i.pinimg.com/474x/ca/0b/8f/ca0b8fbc9ab21e4a3c13d36571b4969b.jpg"})`,
		height: "100%", // Adjust the height as needed
		backgroundSize: "cover", // This ensures the image covers the whole div
		backgroundRepeat: "no-repeat", // This prevents the image from repeating
	};

	return (
		<div className="module-area-wrapper instrument">
			<div style={divStyle} className="submodule-area-wrapper">
				<div className="instrument-main-area">
					<h1>Drummer</h1>
				</div>
			</div>
			{/* <BufferSources bufferSourceUpdated={() => {console.log("Needs to implement bufferSourcesUpdated")}}></BufferSources> */}
		</div>
	);
};

export default withBaseInstrumenttInterface(Drummer);
