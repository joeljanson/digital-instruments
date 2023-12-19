import React, { useState, useEffect, useRef } from "react";

interface SVGComponentProps {
	mousePosition: { x: number; y: number };
}

const SVGComponent: React.FC<SVGComponentProps> = ({ mousePosition }) => {
	const [rotation, setRotation] = useState(0);
	const svgRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (svgRef.current) {
			const svgRect = svgRef.current.getBoundingClientRect();
			const svgX = svgRect.left + svgRect.width / 2;
			const svgY = svgRect.top + svgRect.height / 2;
			const angle = Math.atan2(mousePosition.y - svgY, mousePosition.x - svgX);
			setRotation((angle * 180) / Math.PI);
		}
	}, [mousePosition]);

	return (
		<div ref={svgRef} style={{ transform: `rotate(${rotation}deg)` }}>
			{/* Your SVG goes here */}
			hej
		</div>
	);
};

export default SVGComponent;
