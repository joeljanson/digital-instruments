import { ToneAudioBuffer } from "tone";

export class InstrumentHelper {
	private name: string;
	private type: string;
	private buffers: Map<string, ToneAudioBuffer>;

	constructor(name: string, type: string) {
		this.name = name;
		this.type = type;
		this.buffers = new Map<string, ToneAudioBuffer>();
	}

	private preloadAudio = () => {
		const fileUrl = process.env.PUBLIC_URL + "/audio/test-audio.mp3";

		const loadedBuffer = new ToneAudioBuffer({
			url: fileUrl,
			onload: () => {
				console.log("buffer is loaded in the base instrument", loadedBuffer);
				this.buffers.set("buffer", loadedBuffer);
				const reversedBuffer = new ToneAudioBuffer({
					url: fileUrl,
					onload: () => {
						console.log(
							"buffer is loaded in the base instrument",
							reversedBuffer
						);
						this.buffers.set("reversedBuffer", reversedBuffer);
					},
				});
			},
		});
	};
}
