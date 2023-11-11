import React, { useEffect, useRef, useState } from "react";
import {
	AmplitudeEnvelope,
	Channel,
	Time,
	ToneAudioBuffer,
	Volume,
} from "tone";
import { globalEmitter } from "../../App";
import { TriggerEvent } from "../Sequencers/Events";
import BufferSources from "../Common/BufferSources";
import "./Instrument.scss";
import { DroneGrainPlayer } from "./GrainPlayer";

const GranDame: React.FC = () => {
	const [position, setPosition] = useState<number>(0);
	const positionRef = useRef(position);

	const [detune, setDetune] = useState<number>(0);
	const detunRef = useRef(detune);

	const [detuneSemi, setDetuneSemi] = useState<number>(0);
	const detunSemiRef = useRef(detuneSemi);

	const bufferRef = useRef<ToneAudioBuffer | null>(null);
	const players = useRef<Array<{ player: DroneGrainPlayer; note: number }>>([]);

	const bufferSourceUpdated = (bufferUrl: string | ToneAudioBuffer) => {
		console.log("Received file URL in parent component:", bufferUrl);
		bufferRef.current?.dispose();
		const loadedBuffer = new ToneAudioBuffer({
			url: bufferUrl,
			onload: () => {
				console.log("buffer is loaded", loadedBuffer);
				bufferRef.current = loadedBuffer;
			},
		});
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
	};

	// Update the ref whenever the position changes
	useEffect(() => {
		positionRef.current = position;
	}, [position]);

	useEffect(() => {
		detunRef.current = detune;
	}, [detune]);

	useEffect(() => {
		detunSemiRef.current = detuneSemi;
	}, [detuneSemi]);

	useEffect(() => {
		console.log("Use effect is run in division");
		globalEmitter.on("SEQUENCER_EVENT", async (event: TriggerEvent) => {
			if (event.eventType === "noteOn") {
				if (bufferRef.current) {
					const grainSize = 0.5;
					//Grainsize sets the size of the grain. 0.5 means it will play 0.5 seconds from the audio/video.

					let frequency = 0.1;
					//Frequency sets the frequency of the grains, that is, when it's 0.1 a .1ain will be played every 0.1 seconds.

					const spread = 0.05;

					const envelope = new AmplitudeEnvelope({
						attack: 0.4,
						decay: 0.2,
						sustain: 1.0,
						release: 4.0,
						attackCurve: "linear",
					}).connect(volume);

					const detuneCalculated =
						(detunSemiRef.current + detunRef.current + event.note) * 100;
					//Spread sets the length of the area which the grains will be picked from. 0.05 = from the position that the mouse pointer is at and 0.05 seconds ahead.
					const player = new DroneGrainPlayer({
						url: bufferRef.current,
						frequency: frequency,
						grainSize: grainSize,
						overlap: 0.1,
						loop: true,
						detune: detuneCalculated,
					});
					player.connect(envelope);
					const calculatedPosition =
						positionRef.current * bufferRef.current.duration;
					console.log("Calculated position:", calculatedPosition);
					player.loopStart = calculatedPosition;
					player.loopEnd = calculatedPosition + spread;
					player.start();
					envelope.triggerAttack();
					players.current.push({ player: player, note: event.note });
					await event.promise;
					// Trigger the envelope release
					envelope.triggerRelease();

					// Schedule the stop and dispose after the release time
					setTimeout(() => {
						const playerIndex = players.current.findIndex(
							(playerRef) => playerRef.player === player
						);
						if (playerIndex > -1) {
							const internalPlayer = players.current[playerIndex].player;
							internalPlayer.stop();
							internalPlayer.dispose();
							players.current.splice(playerIndex, 1);
						} else {
							console.error("Player not found");
						}
					}, Time(envelope.release).toMilliseconds()); // Convert seconds to milliseconds
				}
			}
		});
		preloadAudio();
		const channel = new Channel({ volume: 0, channelCount: 2 });
		channel.send("effectsRackIn");
		const volume = new Volume(0).connect(channel);
	}, []);

	const handlPositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newPosition = parseFloat(event.target.value);
		setPosition(newPosition);
		console.log(newPosition);
		if (bufferRef.current) {
			const calculatedPosition = newPosition * bufferRef.current.duration;
			players.current.forEach((player) => {
				player.player.loopStart = calculatedPosition;
				player.player.loopEnd = calculatedPosition + 0.05;
			});
		}
	};

	const handleDetuneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newDetune = parseFloat(event.target.value);
		setDetune(newDetune);
		if (bufferRef.current) {
			players.current.forEach((player, index) => {
				console.log(player.note);
				//player.player.detune = (player.note + newDetune * index) * 100;
				player.player.detune =
					(detunSemiRef.current + player.note + newDetune) * 100;
			});
		}
	};

	const handleDetuneSemiChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newDetune = parseFloat(event.target.value);
		setDetuneSemi(newDetune);
		if (bufferRef.current) {
			players.current.forEach((player, index) => {
				console.log(player.note);
				//player.player.detune = (player.note + newDetune * index) * 100;
				player.player.detune =
					(detunRef.current + player.note + newDetune) * 100;
			});
		}
	};

	return (
		<div className="module-area-wrapper instrument">
			<div className="submodule-area-wrapper instrument-main-area">
				Gran dame!
				<div>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={position}
						onChange={handlPositionChange}
					/>
				</div>
				<div>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={detune}
						onChange={handleDetuneChange}
					/>
				</div>
				<div>
					<input
						type="range"
						min="-12"
						max="0"
						step="1"
						value={detuneSemi}
						onChange={handleDetuneSemiChange}
					/>
				</div>
				<img
					src="https://i.pinimg.com/564x/15/7b/30/157b3075a118e42f0ce58d79b21457de.jpg"
					alt="inspiration"
				/>
			</div>
			<BufferSources bufferSourceUpdated={bufferSourceUpdated}></BufferSources>
		</div>
	);
};

export default GranDame;
