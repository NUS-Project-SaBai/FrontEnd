'use client';
import { useToggle } from '@/hooks/useToggle';
import Image from 'next/image';
import { Dispatch, SetStateAction, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../Button';

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: 'environment',
};

export function WebcamInput({
  imageDetails,
  setImageDetails,
}: {
  imageDetails: string;
  setImageDetails: Dispatch<SetStateAction<string | null>>;
}) {
  const [cameraIsOpen, toggleCameraOpen, setCameraIsOpen] = useToggle(false);

  const webcamRef = useRef<Webcam>(null);
  const webcamCapture = useCallback(() => {
    const imgSrc = webcamRef?.current?.getScreenshot() || null;
    setImageDetails(imgSrc);
    setCameraIsOpen(false);
  }, [setCameraIsOpen, setImageDetails]);

  return (
    <div className="flex flex-col items-center">
      <label className="block text-sm font-medium">
        Photo<span className="text-red-500">*</span>
      </label>
      {!cameraIsOpen && (
        <div className="relative flex h-64 w-64 items-center justify-center bg-gray-400">
          {imageDetails != null && (
            <Image src={imageDetails} alt="" fill={true} />
          )}
        </div>
      )}

      {cameraIsOpen && (
        <div className="flex flex-col items-center justify-center space-y-2">
          <Webcam
            audio={false}
            width={250}
            height={250}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            videoConstraints={videoConstraints}
          />
          <Button text="Capture" onClick={webcamCapture} colour="green" />
        </div>
      )}
      <div className="mt-2 flex items-center justify-center">
        {cameraIsOpen ? (
          <Button colour="red" text="Cancel" onClick={toggleCameraOpen} />
        ) : (
          <Button colour="green" text="Take Photo" onClick={toggleCameraOpen} />
        )}
      </div>
    </div>
  );
}
