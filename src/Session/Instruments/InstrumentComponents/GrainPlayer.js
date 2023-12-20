import { GrainPlayer, ToneBufferSource, intervalToFrequencyRatio } from "tone";

export class DroneGrainPlayer extends GrainPlayer {
	constructor(options) {
		super(options);
		this.frequency = options.frequency;
	}

	_tick(time) {
		// check if it should stop looping
		//console.log(this._clock.frequency.value);
		const ticks = this._clock.getTicksAtTime(time);
		const offset = ticks * this._grainSize;
		this.log("offset", offset);

		if (!this.loop && offset > this.buffer.duration) {
			this.stop(time);
			return;
		}

		// at the beginning of the file, the fade in should be 0
		const fadeIn = offset < this._overlap ? 0 : this._overlap;

		// create a buffer source
		const source = new ToneBufferSource({
			context: this.context,
			url: this.buffer,
			//reverse: this.reverse,
			fadeIn: fadeIn,
			fadeOut: this._overlap,
			loop: false,
			playbackRate: intervalToFrequencyRatio(this.detune / 100),
		}).connect(this.output);
		let end = this._loopEnd > 0 ? this._loopEnd : this.buffer.duration;
		let random = this._loopStart + Math.random() * (end - this._loopStart);
		this.currTime = random;

		source.start(time, random, undefined, 0.0005);
		source.stop(time + this._grainSize / this.playbackRate);

		// add it to the active sources
		this._activeSources.push(source);
		// remove it when it's done
		source.onended = () => {
			const index = this._activeSources.indexOf(source);
			if (index !== -1) {
				this._activeSources.splice(index, 1);
			}
		};
	}

	/**
	 * The size of each chunk of audio that the
	 * buffer is chopped into and played back at.
	 */
	get grainSize() {
		return this._grainSize;
	}
	set grainSize(size) {
		this._grainSize = this.toSeconds(size);
	}
	get currTime() {
		return this._currTime;
	}

	set currTime(v) {
		this._currTime = v;
	}

	get frequency() {
		return this._frequency;
	}

	set frequency(freq) {
		this._frequency = freq;
		this._clock.frequency.setValueAtTime(1 / freq, this.now());
	}
}
