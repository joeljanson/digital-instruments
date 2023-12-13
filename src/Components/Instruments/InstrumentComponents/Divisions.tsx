import React, { useEffect, useRef } from "react";
import { Channel, Player, ToneAudioBuffer, Volume, now } from "tone";
import { globalEmitter } from "../../../App";
import { TriggerEvent } from "../../Sequencers/Helpers/Events";
import BufferSources from "../../Common/BufferSources";
import "../InstrumentArea.scss";
import { EffectsPool } from "../Helpers/EffectsPool";
import { withBaseInstrumenttInterface } from "./BaseInstrument/BaseInstrumentInterface";
import { BaseInstrumentProps } from "./BaseInstrument/BaseInstrument";

const Divisions: React.FC<BaseInstrumentProps> = ({ outputChannel }) => {
	const bufferRef = useRef<ToneAudioBuffer | null>(null);
	const reversedBufferRef = useRef<ToneAudioBuffer | null>(null);
	const effectsPool = useRef<EffectsPool>(new EffectsPool(16));

	/* const availableDelays = useRef<Array<FeedbackDelay>>([]);
	const unavailableDelays = useRef<Array<FeedbackDelay>>([]); */

	const bufferSourceUpdated = (bufferUrl: string | ToneAudioBuffer) => {
		console.log("Received file URL in parent component:", bufferUrl);

		bufferRef.current?.dispose();
		reversedBufferRef.current?.dispose();
		const loadedBuffer = new ToneAudioBuffer({
			url: bufferUrl,
			onload: () => {
				console.log("buffer is loaded", loadedBuffer);
				bufferRef.current = loadedBuffer;
			},
		});

		const reversedBuffer = new ToneAudioBuffer({
			url: bufferUrl,
			onload: () => {
				console.log("buffer is loaded", reversedBuffer);
				reversedBufferRef.current = reversedBuffer;
			},
		});

		// Do something with the file and URL
	};

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

	const preloadAudio = () => {
		const fileUrl = process.env.PUBLIC_URL + "/audio/test-audio.mp3";
		const loadedBuffer = new ToneAudioBuffer({
			url: fileUrl,
			onload: () => {
				console.log("buffer is loaded", loadedBuffer);
				bufferRef.current = loadedBuffer;
			},
		});

		const reversedBuffer = new ToneAudioBuffer({
			url: fileUrl,
			onload: () => {
				console.log("buffer is loaded", reversedBuffer);
				reversedBufferRef.current = reversedBuffer;
			},
		});
	};

	/* const setupDelays = () => {
		for (let i = 0; i < 10; i++) {
			const feedbackDelay = new FeedbackDelay(1, 0.5);
			availableDelays.current?.push(feedbackDelay);
		}
	}; */
	const playerMap = useRef<Map<number, Player>>(new Map());

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
						chain.panner.pan.value = event.settings?.pan ?? 0;
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
							chain.reverb,
							//chain.delay,
							chain.filter,
							//chain.panner,
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
			preloadAudio();
			console.log(loadedSettings);
			outputChannel.send("effectsRackIn");
			const volume = new Volume(0).connect(outputChannel);
			// Don't forget to clean up the event listener
			return () => {
				globalEmitter.off("SEQUENCER_EVENT", triggerEventHandler);
				playerMap.current.forEach((player) => player.dispose());
				playerMap.current.clear();
			};
		}
	}, [outputChannel]);

	const divStyle = {
		backgroundImage: `url(${"https://i.pinimg.com/474x/9b/4b/e6/9b4be63c10733f63a23b78f732906bd5.jpg"})`,
		height: "100%", // Adjust the height as needed
		backgroundSize: "cover", // This ensures the image covers the whole div
		backgroundRepeat: "no-repeat", // This prevents the image from repeating
	};

	return (
		<div className="module-area-wrapper instrument">
			<div style={divStyle} className="submodule-area-wrapper">
				<div className="instrument-main-area">
					<h1>Main area</h1>
				</div>
			</div>
			<BufferSources bufferSourceUpdated={bufferSourceUpdated}></BufferSources>
		</div>
	);
};

export default withBaseInstrumenttInterface(Divisions);
