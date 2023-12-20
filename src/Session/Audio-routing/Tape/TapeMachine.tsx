import React, { useEffect, useRef, useState } from "react";
import {
	Channel,
	Chebyshev,
	CrossFade,
	Distortion,
	Filter,
	Player,
	Vibrato,
	Volume,
} from "tone";
import "./TapeMachine.scss";
import TapeRecorder from "./TapeRecorder";

const tapehiss = require("../../../audio/noise and ambience/tapehiss.mp3");

// Define the settings type
type EffectSettings = {
	crossFade: number;
	vibratoDepth: number;
	distortionWetness: number;
	noiseVolume: number; // Added noiseVolume
};

const TapeMachine: React.FC<{ receive: string; send: string }> = ({
	receive,
	send,
}) => {
	const crossFadeRef = useRef<CrossFade | null>(null);
	const vibratoRef = useRef<Vibrato[]>([]);
	const distortionRef = useRef<Distortion[]>([]);
	const noisePlayerRef = useRef<Player | null>(null);
	const [effectSettings, setEffectSettings] = useState<EffectSettings>({
		crossFade: 0,
		vibratoDepth: 0,
		distortionWetness: 0,
		noiseVolume: 0,
	});

	useEffect(() => {
		const tapeMachineReceive = new Channel({
			volume: 0,
			channelCount: 2,
		}).receive(receive);

		const tapeMachineSend = new Channel({
			volume: 0,
			channelCount: 2,
		});
		tapeMachineSend.send(send);
		const crossFade = new CrossFade().toDestination();
		crossFadeRef.current = crossFade;
		crossFade.connect(tapeMachineSend);

		const bypassChannel = new Channel({ volume: 0, channelCount: 2 }).connect(
			crossFade.a
		);
		bypassChannel.receive(receive);

		const depth = 0.2;
		const wow = 0.8;
		const flutter = 1 - wow;

		const vibratoWow = new Vibrato({
			frequency: 0.4,
			depth: depth * wow,
			maxDelay: 0.025,
		});
		vibratoRef.current.push(vibratoWow);

		const vibratoFlutter = new Vibrato({
			frequency: 8,
			depth: depth * flutter,
			maxDelay: 0.0075,
		});
		vibratoRef.current.push(vibratoFlutter);

		const distortionLowPass = new Distortion(1.0);
		distortionLowPass.wet.value = 0.5;

		const distortion = new Distortion(0.8);
		distortion.wet.value = 0.005;
		distortionRef.current.push(distortion);

		const lowPassFilter = new Filter(200, "lowpass");
		const highPassFilter = new Filter(80, "highpass");
		const distVolume = new Volume(-12);

		const cheby = new Chebyshev(50);
		cheby.wet.value = 0.005;

		const noisePlayer = new Player({
			url: tapehiss,
			loop: true,
			fadeIn: 0,
			fadeOut: 0,
			onload: () => {
				console.log("Tape hiss loaded");
				noisePlayer.volume.value = -35;
				noisePlayer.loopEnd = 9.2;
				noisePlayer.loopStart = 0.1;
				noisePlayer.start();
			},
		}).connect(crossFade.b);
		noisePlayerRef.current = noisePlayer;

		tapeMachineReceive.chain(
			distortionLowPass,
			lowPassFilter,
			highPassFilter,
			distVolume,
			crossFade.b
		);
		tapeMachineReceive.chain(
			vibratoWow,
			vibratoFlutter,
			cheby,
			distortion,
			crossFade.b
		);
		crossFade.fade.value = effectSettings.crossFade;

		// Capture the current state of the refs
		const currentVibratoNodes = vibratoRef.current;
		const currentDistortionNodes = distortionRef.current;

		// Cleanup function to dispose of audio nodes when the component unmounts
		return () => {
			tapeMachineReceive.dispose();
			noisePlayerRef.current?.dispose();
			crossFade.dispose();
			bypassChannel.dispose();
			currentVibratoNodes.forEach((vibrato) => vibrato.dispose());
			currentDistortionNodes.forEach((distortion) => distortion.dispose());
			lowPassFilter.dispose();
			highPassFilter.dispose();
			distVolume.dispose();
			cheby.dispose();
			noisePlayer.dispose();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const adjustEffects = (settings: EffectSettings) => {
		crossFadeRef.current?.fade.rampTo(settings.crossFade, 0.3);

		const depth = settings.vibratoDepth;
		const wow = 0.8;
		const flutter = 1 - wow;

		vibratoRef.current[0]?.depth.rampTo(depth * wow, 0.3);
		vibratoRef.current[1]?.depth.rampTo((depth + 0.1) * flutter, 0.3);
		distortionRef.current.forEach((distortion) => {
			distortion.wet.rampTo(settings.distortionWetness, 0.3);
		});
		noisePlayerRef.current?.volume.linearRampTo(settings.noiseVolume, 1.0);
	};

	const handleButtonClick = (settings: EffectSettings) => {
		adjustEffects(settings);
		setEffectSettings(settings);
	};

	const getButtonClass = (settings: EffectSettings) =>
		effectSettings.vibratoDepth === settings.vibratoDepth
			? "selected"
			: "unselected";

	// Predefined settings for each button
	const modernSettings: EffectSettings = {
		crossFade: 0,
		vibratoDepth: 0,
		distortionWetness: 0,
		noiseVolume: -Infinity,
	};
	const oldSettings: EffectSettings = {
		crossFade: 1,
		vibratoDepth: 0.1,
		distortionWetness: 0,
		noiseVolume: -45,
	};
	const olderSettings: EffectSettings = {
		crossFade: 1,
		vibratoDepth: 0.2,
		distortionWetness: 0.005,
		noiseVolume: -25,
	};

	return (
		<div className="submodule-area-wrapper tape-machine">
			<h1>Casette deck</h1>
			<button
				className={getButtonClass(modernSettings)}
				onClick={() => handleButtonClick(modernSettings)}
			>
				modern
			</button>
			<button
				className={getButtonClass(oldSettings)}
				onClick={() => handleButtonClick(oldSettings)}
			>
				old
			</button>
			<button
				className={getButtonClass(olderSettings)}
				onClick={() => handleButtonClick(olderSettings)}
			>
				older
			</button>
			{/* ... add more UI elements as needed ... */}
			<TapeRecorder
				bufferSourceUpdated={() => {
					console.log("Buffer updated in the tape machine.");
				}}
			></TapeRecorder>
		</div>
	);
};

export default TapeMachine;
