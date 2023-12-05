import Webcam from "react-webcam";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

const AppWebcam = ({ webcamSetRef, webcamCapture }) => (
  <div
    style={{
      height: 250,
      width: 250,
      margin: "0 auto",
    }}
  >
    <Webcam
      audio={false}
      height={250}
      width={250}
      ref={webcamSetRef}
      screenshotFormat="image/jpeg"
      screenshotQuality={1}
      videoConstraints={videoConstraints}
    />

    <div
      style={{
        textAlign: "center",
      }}
    >
      <button className="button is-dark is-medium" onClick={webcamCapture}>
        Capture
      </button>
    </div>
  </div>
);

export default AppWebcam;
