import React, { useRef, useEffect } from 'react';

export function HeightWeightGraph({ age, weight, height }) {
  if (age < 4 || age > 18) {
    return <div></div>;
  }
  if (!weight || !height) {
    return <div></div>;
  }
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not found');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.log('Context not found');
      return;
    }

    const image = new Image();
    image.crossOrigin = 'Anonymous'; // Set CORS attribute
    image.src = '/growth.png'; // Fixed image URL

    const xPixel = 115 + (age - 2) * 22.67;
    const weightPixel = 742 - (weight - 10) * 4.25;
    const heightPixel = 593 - (height - 80) * 4.25;
    const crossHeight = 3;

    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      context.drawImage(image, 0, 0); // Draw the image on canvas
      context.strokeStyle = 'red'; // Set cross color
      context.lineWidth = 2; // Set line width
      context.beginPath();
      context.moveTo(xPixel - crossHeight, weightPixel - crossHeight); // Starting point
      context.lineTo(xPixel + crossHeight, weightPixel + crossHeight); // Ending point
      context.stroke(); // Draw the line
      context.moveTo(xPixel + crossHeight, weightPixel - crossHeight); // Starting point
      context.lineTo(xPixel - crossHeight, weightPixel + crossHeight); // Ending point
      context.stroke(); // Draw the line

      context.strokeStyle = 'blue'; // Set cross color
      context.lineWidth = 2; // Set line width
      context.beginPath();
      context.moveTo(xPixel - crossHeight, heightPixel - crossHeight); // Starting point
      context.lineTo(xPixel + crossHeight, heightPixel + crossHeight); // Ending point
      context.stroke(); // Draw the line
      context.moveTo(xPixel + crossHeight, heightPixel - crossHeight); // Starting point
      context.lineTo(xPixel - crossHeight, heightPixel + crossHeight); // Ending point
      context.stroke(); // Draw the line
    };
  }, [age, weight, height]);

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={800} />
    </div>
  );
}
