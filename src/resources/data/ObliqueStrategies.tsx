import React, { useEffect, useState } from "react";
import strategies from "./oblique-strategies.json";

function ObliqueStrategy() {
	const [strategy, setStrategy] = useState<string | undefined>();
	useEffect(() => {
		setStrategy(randomItemInArray(strategies.obliqueStrategies));
	}, []);

	function randomItemInArray(array: any[]) {
		if (!Array.isArray(array)) {
			throw new Error("Input is not an array.");
		}

		if (array.length === 0) {
			throw new Error("Array is empty.");
		}

		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	}

	return (
		<div className="oblique-strategy">
			<p>{strategy}</p>
		</div>
	);
}

export default ObliqueStrategy;
