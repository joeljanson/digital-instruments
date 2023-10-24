type KeyboardAction = {
	eventType: "noteon" | "noteoff";
	note: number;
};

type HandleKeyboardAction = (action: KeyboardAction) => void;

class Keyboard {
	private midiKeys: number[];
	/* 	private octaveKeys: { [key: number]: number };
	 */ private pressedKeys: number[];
	private octave: number;
	private handleKeyboardAction: HandleKeyboardAction;

	constructor(
		handleKeyboardAction: HandleKeyboardAction,
		type: "all" | "qwerty"
	) {
		const qwertyKeys = [
			65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74, 75, 79, 76, 80, 186,
		];

		const patatapKeys = [
			81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 65, 83, 68, 70, 71, 72,
			74, 75, 76, 186, 222, 222, 188, 90, 88, 67, 86, 66, 78, 77, 188, 190,
		];

		if (type === "all") {
			this.midiKeys = patatapKeys;
		} else {
			this.midiKeys = qwertyKeys;
		}

		/* this.octaveKeys = { 90: -12, 88: 12 }; */

		this.pressedKeys = [];

		this.octave = 0;

		document.addEventListener("keydown", this.handleKeyDown);
		document.addEventListener("keyup", this.handleKeyUp);
		this.handleKeyboardAction = handleKeyboardAction;
	}

	private handleKeyDown = (event: KeyboardEvent): void => {
		if (event.repeat) {
			return;
		}
		const key = this.midiKeys.indexOf(event.keyCode);
		if (key !== -1) {
			const pressedNote = key + this.octave;
			this.pressedKeys.push(pressedNote);
			this.handleKeyboardAction({ eventType: "noteon", note: pressedNote });
		}

		/* const octaveKey = event.keyCode;
		if (this.octaveKeys.hasOwnProperty(octaveKey)) {
			const octaveShift = this.octaveKeys[octaveKey];
			this.setOctave(this.octave + octaveShift);
		} */
	};

	private handleKeyUp = (event: KeyboardEvent): void => {
		const key = this.midiKeys.indexOf(event.keyCode);
		if (key !== -1) {
			const pressedNote = key + this.octave;
			this.pressedKeys = this.pressedKeys.filter(
				(note) => note !== pressedNote
			);
			this.handleKeyboardAction({ eventType: "noteoff", note: pressedNote });
		}
	};

	private setOctave(octave: number): void {
		this.octave = octave;
	}

	public numberOfNotes(): number {
		return this.midiKeys.length;
	}
}

export default Keyboard;
