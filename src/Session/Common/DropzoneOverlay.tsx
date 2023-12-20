export const DropzoneOverlay: React.FC<{ isVisible: boolean }> = ({
	isVisible,
}) => (
	<div
		className="dropzone-overlay"
		style={{ opacity: isVisible ? 1 : 0 }} // Dynamically change opacity
	>
		DROP FILE HERE
	</div>
);
