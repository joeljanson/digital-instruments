import { useEffect, useRef, useState } from "react";

interface CanvasComponentProps {
	onValuesChange: (values: number[]) => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
	onValuesChange,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const resizeCanvas = () => {
		if (canvasRef.current) {
			const { width, height } = canvasRef.current.getBoundingClientRect();
			setCanvasSize({ width, height });
			canvasRef.current.width = width;
			canvasRef.current.height = height;
			if (canvasRef.current.getContext) {
				const ctx = canvasRef.current.getContext("2d");
				if (ctx) {
					draw(ctx, mousePosition); // Redraw with the last known mouse position
				}
			}
		}
	};

	useEffect(() => {
		window.addEventListener("resize", resizeCanvas);
		resizeCanvas(); // Initial resize
		return () => window.removeEventListener("resize", resizeCanvas);
	}, []);

	const calculateNormalizedValue = (angle: number) => {
		// Normalize the angle to be between 0 and 360 degrees (0 and 2 * Math.PI radians)
		let normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);

		// Map the angle to the value range [0, 1]
		// 0 degrees (0 radians) and 180 degrees (Math.PI radians) map to 1 and 0 respectively
		// 90 degrees (Math.PI / 2 radians) and 270 degrees (3 * Math.PI / 2 radians) map to 0.5
		if (normalizedAngle <= Math.PI / 2) {
			return 0.5 + (normalizedAngle / (Math.PI / 2)) * 0.5;
		} else if (normalizedAngle <= Math.PI) {
			return 1 - ((normalizedAngle - Math.PI / 2) / (Math.PI / 2)) * 0.5;
		} else if (normalizedAngle <= (3 * Math.PI) / 2) {
			return 0.5 - ((normalizedAngle - Math.PI) / (Math.PI / 2)) * 0.5;
		} else {
			return ((normalizedAngle - (3 * Math.PI) / 2) / (Math.PI / 2)) * 0.5;
		}
	};

	const draw = (
		ctx: CanvasRenderingContext2D,
		mousePosition: { x: number; y: number }
	) => {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		const elementsPerRow = 5; // Assuming a 5x5 grid
		const elementWidthPercent = 10; // Width of each element as a percentage of total width

		// Calculate spacing based on the smaller dimension of the canvas
		const minDimension = Math.min(ctx.canvas.width, ctx.canvas.height);
		const spacing = minDimension / elementsPerRow;
		const elementSize = (minDimension * elementWidthPercent) / 100;

		const valuesArray = []; // Array to store the normalized values

		for (let i = 0; i < 25; i++) {
			const row = Math.floor(i / elementsPerRow);
			const col = i % elementsPerRow;

			const xPosition = col * spacing + spacing / 2; // Center in each grid cell
			const yPosition = row * spacing + spacing / 2;

			// Calculate rotation angle
			const angle = Math.atan2(
				mousePosition.y - yPosition,
				mousePosition.x - xPosition
			);
			const rotation = angle; // Rotation in radians

			// Drawing a rotating rectangle
			ctx.save();
			ctx.translate(xPosition, yPosition);
			ctx.rotate(rotation);
			ctx.fillStyle = "blue";
			ctx.fillRect(
				-elementSize / 2,
				-elementSize / 2,
				elementSize,
				elementSize
			); // Centered at the element's position
			ctx.restore();

			// Calculate normalized value and store in array
			const normalizedValue = calculateNormalizedValue(rotation);
			valuesArray.push(normalizedValue);
		}
		onValuesChange(valuesArray); // Call the passed callback with the new values
	};

	const onMouseMove = (event: MouseEvent) => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			const newPosition = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
			};
			setMousePosition(newPosition); // Update mouse position state
			const ctx = canvasRef.current.getContext("2d");
			if (ctx) {
				draw(ctx, newPosition);
			}
		}
	};

	useEffect(() => {
		window.addEventListener("mousemove", onMouseMove);
		return () => window.removeEventListener("mousemove", onMouseMove);
	}, []);

	return <canvas ref={canvasRef} />;
};

export default CanvasComponent;
