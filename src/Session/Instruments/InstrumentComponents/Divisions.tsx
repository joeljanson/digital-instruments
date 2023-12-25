import React, { useEffect, useRef } from "react";
import { Player, ToneAudioBuffer, Volume, now } from "tone";
import { globalEmitter } from "../../Session/Session";
import { TriggerEvent } from "../../Sequencers/Helpers/Events";
import "../../../CSS/InstrumentArea.scss";
import { EffectsPool } from "../Helpers/EffectsPool";
import { withBaseInstrumenttInterface } from "./BaseInstrument/BaseInstrumentInterface";
import { BaseInstrumentProps } from "./BaseInstrument/BaseInstrument";

const Divisions: React.FC<BaseInstrumentProps> = ({
	buffer,
	outputChannel,
	imageUrl,
}) => {
	const bufferRef = useRef<ToneAudioBuffer | null>(null);
	const reversedBufferRef = useRef<ToneAudioBuffer | null>(null);
	const effectsPool = useRef<EffectsPool>(new EffectsPool(16));

	const generateSettings = (n: number): any[] => {
		const settingsArray = [];

		for (let i = 0; i < n; i++) {
			const playbackRateOptions = [1, 0.5];
			const delayTimeOptions = ["8n", "16n", "8t", "4t", "4n"];
			const filterTypeOptions = ["lowpass", "highpass"];

			const randomPlaybackRate =
				playbackRateOptions[
					Math.floor(Math.random() * playbackRateOptions.length)
				];
			const randomReversed = Math.random() < 0.5;
			const randomFilterType =
				filterTypeOptions[Math.floor(Math.random() * filterTypeOptions.length)];
			const randomFilterFrequency = Math.random() * (5500 - 500) + 500;
			const randomDelayTime =
				delayTimeOptions[Math.floor(Math.random() * delayTimeOptions.length)];
			const randomDelayMix = Math.random() * 0.5;
			const randomDelayFeedback = 0.5 + Math.random() * 0.25;
			const randomReverbSize = Math.random() * (5 - 1) + 1;
			const randomReverbMix = Math.random();

			const setting = {
				playbackRate: randomPlaybackRate,
				reversed: randomReversed,
				filter: { type: randomFilterType, frequency: randomFilterFrequency },
				delay: {
					time: randomDelayTime,
					mix: randomDelayMix,
					feedback: randomDelayFeedback,
				},
				reverb: { size: randomReverbSize, mix: randomReverbMix },
			};

			settingsArray.push(setting);
		}

		return settingsArray;
	};

	const playerMap = useRef<Map<number, Player>>(new Map());

	useEffect(() => {
		console.log("Buffer updated:", buffer);
		console.log("Image url is:", imageUrl);
		if (buffer) {
			bufferRef.current?.dispose();
			bufferRef.current = buffer;
			reversedBufferRef.current = buffer;
		}
	}, [buffer]);

	useEffect(() => {
		console.log("Use effect is run in division");
		if (outputChannel) {
			const triggerEventHandler = async (event: TriggerEvent) => {
				// Your event handling logic here

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
				if (event.eventType === "noteOn") {
					//console.log("Division receives note on");
					playerMap.current.set(event.note, player);

					const startTime = event.startTime ?? now();

					if (bufferRef.current && reversedBufferRef.current) {
						const currentLoadedSettings = loadedSettings[event.note];

						const chain = effectsPool.current.getEffectChainForNote(event.note);

						//Update the panning
						chain.panner.pan.value = event.panning ? event.panning[0] : 0;
						//chain.panner.pan.rampTo(0, 0.3);

						//Update the delay
						/* chain.delay.delayTime.rampTo(currentLoadedSettings.delay.time, 0);
					chain.delay.wet.rampTo(currentLoadedSettings.delay.mix, 0);
					//chain.delay.wet.rampTo(0, 0.3);
					chain.delay.feedback.rampTo(currentLoadedSettings.delay.feedback, 0);

					//Update the reverb
					chain.reverb.wet.rampTo(currentLoadedSettings.reverb.mix, 0);

					//Update the filter
					chain.filter.frequency.rampTo(
						currentLoadedSettings.filter.frequency,
						0
					); */

						const buffer = currentLoadedSettings.reversed
							? bufferRef.current!
							: reversedBufferRef.current!;

						player.buffer = buffer;
						player.playbackRate = 1; //currentLoadedSettings.playbackRate;
						player.chain(
							//chain.reverb,
							//chain.delay,
							chain.filter,
							chain.panner,
							volume
						);

						const duration = player.buffer.duration;
						const pieces = duration / 34;

						let startOffset = pieces * event.note;

						//console.log(startTime);
						if (event.duration) {
							console.log("Duration is defined");
							player.start(startTime, startOffset, event.duration);
						} else {
							console.log("Duration is not defined");
							const stop =
								startOffset + 1.3 > buffer.duration
									? buffer.duration
									: startOffset + 1.3;
							player.start(startTime, startOffset, 1);
							player.loop = false;
							player.loopStart = startOffset;
							player.loopEnd = stop;
						}
					}
				} else if (event.eventType === "noteOff") {
					console.log("Note off in division");
					const player = playerMap.current.get(event.note);
					if (player) {
						player.stop();
						player.loop = false;
						player.dispose();
						playerMap.current.delete(event.note); // Remove from map after stopping
					}

					effectsPool.current.releaseEffectChain(event.note);
				}
			};

			globalEmitter.on("SEQUENCER_EVENT", triggerEventHandler);

			const loadedSettings = generateSettings(50);
			console.log(loadedSettings);
			outputChannel.send("effectsRackIn");
			const volume = new Volume(0).connect(outputChannel);
			// Don't forget to clean up the event listener
			return () => {
				globalEmitter.off("SEQUENCER_EVENT", triggerEventHandler);
				playerMap.current.forEach((player) => player.dispose());
				playerMap.current.clear();
				volume.dispose();
				effectsPool.current.dispose();
				outputChannel.dispose();
			};
		}
	}, [outputChannel]);

	const divStyle = {
		backgroundImage: `url(${imageUrl})`,
		height: "100%", // Adjust the height as needed
		width: "100%",
		backgroundSize: "cover", // This ensures the image covers the whole div
		backgroundRepeat: "no-repeat", // This prevents the image from repeating
		backgroundPosition: "center",
	};

	return (
		<div style={divStyle} className="submodule-area-wrapper">
			<h1>Main area</h1>
		</div>
	);
};

export default withBaseInstrumenttInterface(Divisions);
