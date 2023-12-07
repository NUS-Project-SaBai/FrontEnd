import Webcam from "react-webcam";
import CameraIcon from "../components/icons/CameraIcon";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

const AppWebcam = ({ webcamSetRef, webcamCapture }) => (
  <div
    style={{
      height: 300,
      width: 250,
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div>
      <Webcam
        audio={false}
        height={250}
        width={250}
        ref={webcamSetRef}
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        videoConstraints={videoConstraints}
      />
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 0,
        textAlign: "center",
      }}
    >
      <button className="button is-dark is-medium" onClick={webcamCapture}>
        <span style={{ marginRight: 15 }}>Capture</span>
        <CameraIcon />
      </button>
    </div>
  </div>
);

export default AppWebcam;
