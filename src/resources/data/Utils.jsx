export function removeItemFromArray(arr, item) {
	const index = arr.indexOf(item);
	if (index !== -1) {
		arr.splice(index, 1);
	}
	return arr;
}

export function findIndexInArray(array, item) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] === item) {
			return i;
		}
	}
	return -1;
}

export function findItemWithObjectKeyInArray(array, objectKey, objectValue) {
	for (let i = 0; i < array.length; i++) {
		if (array[i][objectKey] === objectValue) {
			return array[i];
		}
	}
	return null; // If no object with matching note value is found, return null
}

export function randomItemInArray(array) {
	if (!Array.isArray(array)) {
		throw new Error("Input is not an array.");
	}

	if (array.length === 0) {
		throw new Error("Array is empty.");
	}

	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

export function map(n, start1, stop1, start2, stop2, withinBounds) {
	const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
	if (!withinBounds) {
		return newval;
	}
	if (start2 < stop2) {
		return constrain(newval, start2, stop2);
	} else {
		return constrain(newval, stop2, start2);
	}
}

export function constrain(n, low, high) {
	return Math.max(Math.min(n, high), low);
}
