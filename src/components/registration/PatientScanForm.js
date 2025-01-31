import { Button } from '@/components/TextComponents';
import AppWebcam from '@/components/WebCamera';
import React, { useState } from 'react';

export function PatientScanForm({ imageDetails, setImageDetails }) {
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [webcam, setWebcam] = useState(null);

  const webcamSetRef = webcam => {
    setWebcam(webcam);
  };

  const toggleCameraOpen = () => {
    setCameraIsOpen(!cameraIsOpen);
  };

  const webcamCapture = () => {
    const imageSrc = webcam.getScreenshot();
    setImageDetails(imageSrc);
    setCameraIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      {!cameraIsOpen && (
        <div className="h-64 w-64 bg-gray-400 flex items-center justify-center">
          {imageDetails != null && <img src={imageDetails} />}
        </div>
      )}

      {cameraIsOpen && (
        <div>
          <AppWebcam
            webcamSetRef={webcamSetRef}
            webcamCapture={webcamCapture}
          />
        </div>
      )}
      <div className="flex items-center justify-center mt-2">
        {cameraIsOpen ? (
          <Button colour="red" text="Cancel" onClick={toggleCameraOpen} />
        ) : (
          <Button colour="green" text="Take Photo" onClick={toggleCameraOpen} />
        )}
      </div>
    </div>
  );
}
