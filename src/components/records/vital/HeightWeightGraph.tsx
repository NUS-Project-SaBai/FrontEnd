'use client';
import { GenderType } from '@/types/Gender';
import { useEffect, useRef } from 'react';
import { ALL_CHILD_AGES } from './ChildVitalsFields';

export function HeightWeightGraph({
  age,
  weight,
  height,
  gender,
}: {
  age: number;
  weight: number;
  height: number;
  gender: GenderType;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    let xPixel: number, weightPixel: number, heightPixel: number;

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

      // Function to draw rounded rectangle as blurred background
      const drawRoundedRect = (
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
      ) => {
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height
        );
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        context.fill();
      };
      // Set rounded rectangle properties
      const rectWidth = 75;
      const rectHeight = 25;
      const radius = 5;
      // Draw background for weight text
      context.fillStyle = 'rgba(255, 255, 255, 0.75)'; // White with 70% opacity
      drawRoundedRect(
        xPixel + crossHeight,
        weightPixel - crossHeight - rectHeight / 2,
        rectWidth,
        rectHeight,
        radius
      );
      // Display the weight text next to the weight cross
      context.fillStyle = 'red';
      context.font = '14px Arial';
      context.fillText(
        `${weight} kg`,
        xPixel + crossHeight + 5,
        weightPixel - crossHeight
      );
      // Draw background for height text
      context.fillStyle = 'rgba(255, 255, 255, 0.75)';
      drawRoundedRect(
        xPixel + crossHeight,
        heightPixel - crossHeight - rectHeight / 2,
        rectWidth,
        rectHeight,
        radius
      );
      // Display the height text next to the height cross
      context.fillStyle = 'blue';
      context.font = '14px Arial';
      context.fillText(
        `${height} cm`,
        xPixel + crossHeight + 5,
        heightPixel - crossHeight
      );
    };
  }, [age, weight, height, gender]);

  if (!ALL_CHILD_AGES.includes(age)) {
    return <div className='ml-4'>Age not betweeen 2 and 18</div>;
  }
  if (!weight || !height || (gender !== 'Female' && gender !== 'Male')) {
    return <div className='ml-4'>Invalid height, weight or gender</div>;
  }
  return (
    <div>
      <canvas ref={canvasRef} width={600} height={800} className="w-full h-auto max-w-full"/>
    </div>
  );
}
