import React, { useEffect, useRef } from "react";
import AudioVideoDropzone from "../Common/AudioVideoDropzone";
import {
	Channel,
	FeedbackDelay,
	Filter,
	Player,
	Reverb,
	ToneAudioBuffer,
	Vibrato,
	Volume,
	gainToDb,
	now,
} from "tone";
import { globalEmitter } from "../../App";
import Keyboard from "../Common/Keyboard";

const Divisions: React.FC = () => {
	const bufferRef = useRef<ToneAudioBuffer | null>(null);
	const reversedBufferRef = useRef<ToneAudioBuffer | null>(null);

	const handleFileDrop = (file: File, fileUrl: string) => {
		console.log("Received file in parent component:", file);
		console.log("Received file URL in parent component:", fileUrl);

		bufferRef.current?.dispose();
		reversedBufferRef.current?.dispose();
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

	useEffect(() => {
		const keyboard = new Keyboard((event) => {
			/* console.log("event:", event); */
		}, "all");

		globalEmitter.on("SEQUENCER_EVENT", (event) => {
			if (event.eventType === "noteon") {
				/* console.log(event);
				console.log(bufferRef.current);
				console.log(loadedSettings[event.note]); */
				if (bufferRef.current) {
					const currentLoadedSettings = loadedSettings[event.note];

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
						fadeIn: 0.01,
						fadeOut: 0.01,
						onstop: () => {
							setTimeout(() => {
								player.dispose();
								delay.dispose();
								reverb.dispose();
								filter.dispose();
								console.log("Things disposed!");
							}, 10000);
						},
					}).chain(reverb, delay, filter, vibrolo, volume);

					const duration = player.buffer.duration;
					const pieces = duration / 34;

					let startOffset = pieces * event.note;
					/* console.log("Startoffset is: ", startOffset);
					console.log("Duration is: ", duration);
					console.log("Plater duration is: ", pieces / playbackRate); */
					//player.fadeIn = 0.1;
					//player.fadeOut = 0.1;
					player.start(now(), startOffset, 1.5);
				}
			}
		});
		const loadedSettings = generateSettings(50);
		preloadAudio();
		console.log(loadedSettings);
		const vibrolo = new Vibrato(0.4, 0.75);
		const channel = new Channel(0);
		channel.send("effectsRackIn");
		const volume = new Volume(gainToDb(1)).connect(channel);
		/* const keys = new Keyboard((event) => {}, "all");
		console.log("Number of notes: ", keys.numberOfNotes()); */
	}, []);

	return (
		<div className="module-area-wrapper">
			<AudioVideoDropzone onFileDrop={handleFileDrop} />
		</div>
	);
};

export default Divisions;
