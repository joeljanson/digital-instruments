import { Chord, Note, Scale, note } from "tonal";

export default class ChordHelper {
	key: string;
	chromaticDegrees: number[];

	constructor(key: string = "C") {
		this.key = key;
		this.chromaticDegrees = [0, 2, 4, 5, 7, 9, 11];
	}

	mapChromaticToChords(degree: number): number[] {
		switch (degree) {
			case 0:
				return [-24, -12, 0, 4, 7, 11];
			case 2:
				return [-22, -10, 2, 5, 9, 0];
			case 4:
				return [-20, -8, 4, 7, 11, 14];
			case 5:
				return [-19, -7, 5, 9, -0, 2, 4];
			case 7:
				return [-17, -5, -1, 2, 4, 7, 9];
			case 9:
				return [-15, -3, 0, 4, 7, 9, -15];
			case 11:
				return [-13, -5, -1, 2, 5, 7, 9];
			default:
				return [4, 7, 11, 14];
		}
	}

	getChords(): Array<number[]> {
		return this.chromaticDegrees.map((degree) =>
			this.mapChromaticToChords(degree)
		);
	}
}
