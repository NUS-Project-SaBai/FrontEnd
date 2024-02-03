export function VitalsView({ content }) {
  console.log("Content:", content);
  return (
    <div className="column is-12">
      <h1 style={{ color: "black", fontSize: "1.5em" }}>Vital Signs</h1>

      <br></br>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Height</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.height}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Weight</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.weight}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Systolic</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.systolic}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Diastolic</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.diastolic}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Temperature</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.temperature}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Heart Rate</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.heart_rate}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Left Eye</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.left_eye_degree}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Right Eye</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.right_eye_degree}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Left Eye Pinhole</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.left_eye_pinhole}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Right Eye Pinhole</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.right_eye_pinhole}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Diabetes Mellitus?</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.diabetes_mellitus}</div>
            </article>
          </div>
        </div>
      </div>

      <hr />

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Urine Dip Test</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.urine_test}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Hemocue Hb Count</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.hemocue_count}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Blood Glucose</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.blood_glucose}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Others</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.others}</div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
