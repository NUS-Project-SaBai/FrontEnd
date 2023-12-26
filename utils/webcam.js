import Webcam from "react-webcam";
import CameraIcon from "../components/icons/CameraIcon";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

const AppWebcam = ({ webcamSetRef, webcamCapture }) => (
  <>
    <div
      style={{
        height: 250,
        width: 250,
        margin: "0 auto",
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
    </div>
    <div
      style={{
        textAlign: "center",
        marginTop: 15,
      }}
    >
      <button className="button is-dark is-medium" onClick={webcamCapture}>
        <span style={{ marginRight: 15 }}>Capture</span>
        <CameraIcon />
      </button>
    </div>
  </>
);

export default AppWebcam;
