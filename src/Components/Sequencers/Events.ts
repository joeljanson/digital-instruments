export interface TriggerEvent {
	eventType: "noteOn" | "noteOff";
	note: number;
	velocity?: number;
	promise?: Promise<void>;
	settings?: {
		pan?: number;
		attack?: number;
		decay?: number;
		playbackRate?: number;
	};
}
