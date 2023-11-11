import React, { useEffect, useRef } from "react";
import AudioVideoDropzone from "../Common/AudioVideoDropzone";
import {
	Channel,
	FeedbackDelay,
	Filter,
	PanVol,
	Panner,
	Player,
	Reverb,
	Time,
	ToneAudioBuffer,
	Vibrato,
	Volume,
	gainToDb,
	now,
} from "tone";
import { globalEmitter } from "../../App";
import Keyboard from "../Sequencers/Keyboard";
import { TriggerEvent } from "../Sequencers/Events";
import BufferSources from "../Common/BufferSources";
import "./Instrument.scss";

const Divisions: React.FC = () => {
	const bufferRef = useRef<ToneAudioBuffer | null>(null);
	const reversedBufferRef = useRef<ToneAudioBuffer | null>(null);

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
		globalEmitter.on("SEQUENCER_EVENT", async (event: TriggerEvent) => {
			if (event.eventType === "noteOn") {
				const startTime = event.startTime ?? now();

				if (bufferRef.current) {
					const currentLoadedSettings = loadedSettings[event.note];

					const panner = new Panner(event.settings?.pan ?? 0);

					const delay = new FeedbackDelay(currentLoadedSettings.delay.time);
					delay.wet.value = currentLoadedSettings.delay.mix;
					delay.feedback.value = currentLoadedSettings.delay.feedback;

					const reverb = new Reverb(currentLoadedSettings.reverb.size);
					reverb.wet.value = currentLoadedSettings.reverb.mix;

					const filter = new Filter(
						currentLoadedSettings.filter.frequency,
						"lowpass"
					);

					const buffer = currentLoadedSettings.reversed
						? bufferRef.current!
						: reversedBufferRef.current!;

					const player = new Player({
						url: buffer,
						playbackRate: currentLoadedSettings.playbackRate,
						//playbackRate: 1,
						fadeIn: 0.01,
						fadeOut: 0.01,
						onstop: () => {
							setTimeout(() => {
								player.dispose();
								reverb.dispose();
								filter.dispose();
								panner.dispose();
								console.log("Things disposed!");
							}, 10000);
						},
					}).chain(reverb, delay, filter, panner, volume);

					const duration = player.buffer.duration;
					const pieces = duration / 34;

					let startOffset = pieces * event.note;

					console.log(startTime);
					if (event.duration) {
						player.start(startTime, startOffset, event.duration);
					} else {
						player.start(startTime, startOffset);
						player.loop = true;
						player.loopStart = startOffset;
						player.loopEnd =
							startOffset + 1.3 > buffer.duration
								? buffer.duration
								: startOffset + 1.3;
						await event.promise;
						player.stop(now());
					}
				}
			}
		});
		const loadedSettings = generateSettings(50);
		preloadAudio();
		console.log(loadedSettings);
		const channel = new Channel({ volume: 0, channelCount: 2 });
		channel.send("effectsRackIn");
		const volume = new Volume(0).connect(channel);
	}, []);

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
