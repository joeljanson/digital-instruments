import React, { useEffect, useRef, useState } from "react";
import {
	AmplitudeEnvelope,
	Channel,
	Time,
	ToneAudioBuffer,
	Volume,
	now,
} from "tone";
import { globalEmitter } from "../../Session/Session";
import { TriggerEvent } from "../../Sequencers/Helpers/Events";
import "../../CSS/InstrumentArea.scss";
import { DroneGrainPlayer } from "./GrainPlayer";
import { withBaseInstrumenttInterface } from "./BaseInstrument/BaseInstrumentInterface";
import { BaseInstrumentProps } from "./BaseInstrument/BaseInstrument";

const GranDame: React.FC<BaseInstrumentProps> = ({
	outputChannel,
	buffer,
	bufferUpdates,
}) => {
	const [position, setPosition] = useState<number>(0.3);
	const positionRef = useRef(position);

	const [detune, setDetune] = useState<number>(0);
	const detunRef = useRef(detune);

	const [detuneSemi, setDetuneSemi] = useState<number>(0);
	const detunSemiRef = useRef(detuneSemi);

	const bufferRef = useRef<ToneAudioBuffer | null>(null);
	const players = useRef<Array<{ player: DroneGrainPlayer; note: number }>>([]);

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
		console.log("Buffer updated:", buffer);
		if (buffer) {
			bufferRef.current?.dispose();
			bufferRef.current = buffer;
		}
	}, [buffer]);

	useEffect(() => {
		console.log("Use effect is run in division");
		if (outputChannel) {
			globalEmitter.on("SEQUENCER_EVENT", async (event: TriggerEvent) => {
				console.log("Received event in gran dame: ", event);
				if (event.eventType === "noteOn") {
					if (bufferRef.current) {
						const grainSize = 0.5;
						//Grainsize sets the size of the grain. 0.5 means it will play 0.5 seconds from the audio/video.

						let frequency = 0.1;
						//Frequency sets the frequency of the grains, that is, when it's 0.1 a .1ain will be played every 0.1 seconds.

						const spread = 0.05;
						const notes = event.notes ? event.notes : [event.note];
						const startTimes = event.startTimes ? event.startTimes : [0];
						console.log("Starttimes = ", startTimes);

						console.log("notes to play: ", notes);
						notes.forEach(async (note: number, index) => {
							console.log("note to play: ", note);
							const startTime = now() + startTimes[index % startTimes.length];
							const envelope = new AmplitudeEnvelope({
								attack: 0.1,
								decay: 0.2,
								sustain: 1.0,
								release: 1.0,
								attackCurve: "linear",
							}).connect(volume);

							const detuneCalculated =
								(detunSemiRef.current + detunRef.current + note) * 100;
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
								positionRef.current * bufferRef.current!.duration - spread < 0
									? 0
									: positionRef.current * bufferRef.current!.duration - spread;
							console.log("Calculated position:", calculatedPosition);
							player.loopStart = calculatedPosition;
							player.loopEnd = calculatedPosition + spread;
							player.start(startTime);
							envelope.triggerAttack();
							players.current.push({ player: player, note: note });

							if (event.duration) {
								envelope.triggerRelease("+" + event.duration);
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
							} else {
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
						});
					}
				}
			});
			outputChannel?.send("effectsRackIn");
			const volume = new Volume(35);
			console.log("outputChannel inside of the gran dame: ", outputChannel);

			volume.connect(outputChannel);
			return () => {
				volume.dispose();
				outputChannel.dispose();
			};
		}
	}, [outputChannel]);

	const handlPositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newPosition = parseFloat(event.target.value);
		setPosition(newPosition);
		console.log(newPosition);
		if (bufferRef.current) {
			const calculatedPosition =
				newPosition * bufferRef.current.duration - 0.05 < 0
					? 0
					: newPosition * bufferRef.current.duration - 0.05;
			console.log("calculatedPosition: ", calculatedPosition);
			console.log("bufferRef.current.duration: ", bufferRef.current.duration);
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

	const divStyle = {
		backgroundImage: `url(${"https://i.pinimg.com/564x/76/34/c5/7634c5c39b81748de0229da9a218db09.jpg"})`,
		height: "100%", // Adjust the height as needed
		width: "100%",
		backgroundSize: "cover", // This ensures the image covers the whole div
		backgroundRepeat: "no-repeat", // This prevents the image from repeating
	};

	return (
		<div style={divStyle} className="submodule-area-wrapper">
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
					max="24"
					step="1"
					value={detuneSemi}
					onChange={handleDetuneSemiChange}
				/>
			</div>
		</div>
	);
};

export default withBaseInstrumenttInterface(GranDame);
