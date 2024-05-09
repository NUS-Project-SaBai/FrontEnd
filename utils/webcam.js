import Webcam from "react-webcam";

import { Button } from "@/components/TextComponents/Button";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

const AppWebcam = ({ webcamSetRef, webcamCapture }) => (
  <>
    <div className="flex flex-col items-center justify-center space-y-2">
      <Webcam
        audio={false}
        height={250}
        width={250}
        ref={webcamSetRef}
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        videoConstraints={videoConstraints}
      />
      <Button text="Capture" onClick={webcamCapture} colour="green" />
    </div>
  </>
);

export default AppWebcam;
