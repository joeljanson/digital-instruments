import { Panner, FeedbackDelay, Reverb, Filter } from "tone";

// Define a specific type for your effects chain
type EffectChain = {
	panner: Panner;
	delay: FeedbackDelay;
	reverb: Reverb;
	filter: Filter;
};

export class EffectsPool {
	private activeEffects: EffectChain[] = [];
	private inactiveEffects: EffectChain[] = [];
	private noteEffectMap: Map<string, EffectChain> = new Map(); // Map to store note to effect chain mapping

	constructor(private poolSize: number = 5) {
		this.initializePool();
	}

	private initializePool() {
		for (let i = 0; i < this.poolSize; i++) {
			const panner = new Panner(0);
			const delay = new FeedbackDelay(0.25);
			const reverb = new Reverb(1);
			const filter = new Filter(20000, "lowpass");

			this.inactiveEffects.push({ panner, delay, reverb, filter });
		}
	}

	getEffectChainForNote(note: number): EffectChain {
		// Check if this note already has an effect chain assigned
		if (this.noteEffectMap.has(note.toString())) {
			return this.noteEffectMap.get(note.toString())!;
		}

		if (this.inactiveEffects.length > 0) {
			// Take the first inactive effect chain (FIFO)
			const effects = this.inactiveEffects.shift();
			if (effects) {
				this.activeEffects.push(effects);
				this.noteEffectMap.set(note.toString(), effects); // Bind the effect chain to the note
				return effects;
			}
		}

		// Handle the case when all effects are active
		throw new Error("All effect chains are currently active");
	}

	releaseEffectChain(note: number) {
		const effects = this.noteEffectMap.get(note.toString());
		if (effects) {
			const index = this.activeEffects.indexOf(effects);
			if (index > -1) {
				this.activeEffects.splice(index, 1);
				this.inactiveEffects.push(effects); // Add to the end of the queue
				this.noteEffectMap.delete(note.toString()); // Remove the binding
			}
		}
	}

	dispose() {
		this.activeEffects.forEach((chain) => {
			chain.delay.dispose();
			chain.panner.dispose();
			chain.reverb.dispose();
			chain.filter.dispose();
		});
	}
}
