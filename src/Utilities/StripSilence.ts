import { ToneAudioBuffer, context } from "tone";

export class StripSilence {
	private threshold: number;
	private preAttackTime: number; // in seconds
	private sampleRate: number;

	constructor(threshold: number = 0.1, preAttackTime: number = 0.0) {
		this.threshold = threshold;
		this.preAttackTime = preAttackTime;
		this.sampleRate = context.sampleRate;
	}

	public async findSampleOnsets(
		audioBuffer: ToneAudioBuffer
	): Promise<number[]> {
		const channelData = audioBuffer.getChannelData(1); // Assuming mono audio
		let isBelowThreshold = true;
		const onsets: number[] = [];

		for (let i = 0; i < channelData.length; i++) {
			if (isBelowThreshold && Math.abs(channelData[i]) > this.threshold) {
				isBelowThreshold = false;
				let onsetTime = i / this.sampleRate - this.preAttackTime;
				onsetTime = Math.max(onsetTime, 0); // Ensure the onset time is not negative
				onsets.push(onsetTime);
			} else if (Math.abs(channelData[i]) <= this.threshold) {
				isBelowThreshold = true;
			}
		}

		return onsets;
	}
}
