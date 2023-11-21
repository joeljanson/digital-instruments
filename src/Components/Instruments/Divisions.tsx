import React, { useEffect, useRef } from "react";
import { Channel, Player, ToneAudioBuffer, Volume, now } from "tone";
import { globalEmitter } from "../../App";
import { TriggerEvent } from "../Sequencers/Events";
import BufferSources from "../Common/BufferSources";
import "./Instrument.scss";
import { EffectsPool } from "./InstrumentEffects/EffectsPool";

interface InstrumentProps {
	triggerEventName: string;
}

const Divisions: React.FC<InstrumentProps> = ({ triggerEventName }) => {
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

	useEffect(() => {
		console.log("Use effect is run in division");
		const triggerEventHandler = async (event: TriggerEvent) => {
			// Your event handling logic here
			if (event.eventType === "noteOn") {
				const startTime = event.startTime ?? now();

				if (bufferRef.current) {
					const currentLoadedSettings = loadedSettings[event.note];

					//const panner = new Panner(event.settings?.pan ?? 0);

					/* const delay = new FeedbackDelay(currentLoadedSettings.delay.time);
					delay.wet.value = currentLoadedSettings.delay.mix;
					delay.feedback.value = currentLoadedSettings.delay.feedback; */

					/* const reverb = new Reverb(currentLoadedSettings.reverb.size);
					reverb.wet.value = currentLoadedSettings.reverb.mix; */

					/* const filter = new Filter(
						currentLoadedSettings.filter.frequency,
						"lowpass"
					); */

					const chain = effectsPool.current.getEffectChainForNote(event.note);

					//Update the panning
					chain.panner.pan.rampTo(event.settings?.pan ?? 0, 0.3);
					//chain.panner.pan.rampTo(0, 0.3);

					//Update the delay
					chain.delay.delayTime.rampTo(currentLoadedSettings.delay.time, 0);
					chain.delay.wet.rampTo(currentLoadedSettings.delay.mix, 0);
					//chain.delay.wet.rampTo(0, 0.3);
					chain.delay.feedback.rampTo(currentLoadedSettings.delay.feedback, 0);

					//Update the reverb
					chain.reverb.wet.rampTo(currentLoadedSettings.reverb.mix, 0);

					//Update the filter
					chain.filter.frequency.rampTo(
						currentLoadedSettings.filter.frequency,
						0
					);

					const buffer = currentLoadedSettings.reversed
						? bufferRef.current!
						: reversedBufferRef.current!;

					const player = new Player({
						url: buffer,
						playbackRate: currentLoadedSettings.playbackRate,
						//playbackRate: 1,
						fadeIn: 0,
						fadeOut: 0,
						onstop: () => {
							setTimeout(() => {
								player.dispose();
								console.log("Things disposed!");
							}, 1000);
						},
					}).chain(
						chain.reverb,
						chain.delay,
						chain.filter,
						chain.panner,
						volume
					);

					const duration = player.buffer.duration;
					const pieces = duration / 34;

					let startOffset = pieces * event.note;

					console.log(startTime);
					if (event.duration) {
						player.start(startTime, startOffset, event.duration);
						await event.promise;
						console.log("shoud release effect chain");
						effectsPool.current.releaseEffectChain(event.note);
						player.stop(now());
					} else {
						player.start(startTime, startOffset);
						player.loop = true;
						player.loopStart = startOffset;
						player.loopEnd =
							startOffset + 1.3 > buffer.duration
								? buffer.duration
								: startOffset + 1.3;
						await event.promise;
						console.log("shoud release effect chain");
						effectsPool.current.releaseEffectChain(event.note);
						player.stop(now());
					}
				}
			}
		};

		globalEmitter.on(triggerEventName, triggerEventHandler);

		const loadedSettings = generateSettings(50);
		preloadAudio();
		console.log(loadedSettings);
		const channel = new Channel({ volume: 0, channelCount: 2 });
		channel.send("effectsRackIn");
		const volume = new Volume(0).connect(channel);
		// Don't forget to clean up the event listener
		return () => {
			globalEmitter.off(triggerEventName, triggerEventHandler);
		};
	}, [triggerEventName]);

	return (
		<div className="module-area-wrapper instrument">
			<div className="submodule-area-wrapper instrument-main-area">
				Main area
			</div>
			<BufferSources bufferSourceUpdated={bufferSourceUpdated}></BufferSources>
		</div>
	);
};

export default Divisions;
