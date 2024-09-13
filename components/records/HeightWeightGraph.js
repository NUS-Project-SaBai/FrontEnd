import React, { useRef, useEffect } from 'react';

export function HeightWeightGraph({ age, weight, height, gender }) {
  if (age < 2 || age > 18) {
    return <div></div>;
  }
  if (!weight || !height || (gender !== 'Female' && gender !== 'Male')) {
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

    let xPixel, weightPixel, heightPixel;

    if (gender === 'Female') {
      image.src = '/girlhwgraph.png'; // Fixed image URL
      xPixel = 115 + (age - 2) * 22.67;
      weightPixel = 742 - (weight - 10) * 4.25;
      heightPixel = 593 - (height - 80) * 4.25;
    }
    if (gender === 'Male') {
      image.src = '/boyhwgraph.png'; // Fixed image URL
      xPixel = 95 + (age - 2) * 23.5;
      weightPixel = 765 - (weight - 10) * 4.52;
      heightPixel = 607 - (height - 80) * 4.52;
    }

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
