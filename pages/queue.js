import React from "react";
import axios from "axios";
import Router from "next/router";
import { API_URL, CLOUDINARY_URL } from "../utils/constants";
import moment from "moment";
import withAuth from "../utils/auth";

class Queue extends React.Component {

  constructor() {
    super();

    this.state = {
      visits: [],
      visitsFiltered: [],
      filterString: "",
    };

    this.onFilterChange = this.onFilterChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    let { data: visits } = await axios.get(`${API_URL}/visits?status=started`);

    this.setState({ visits, visitsFiltered: visits });
  }

  async handleDelete(visit_id, patient_id) {
    const { visits, visitsFiltered } = this.state;

    const confirmed = window.confirm(
      "Are you sure you want to delete this visit?"
    );
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/visits/${visit_id}`);
      // let payload = {
      //   patient: patient_id,
      //   status: "ended",
      //   visit_date: moment().format("YYYY-MM-DD"),
      // };
  
      // await axios.post(`${API_URL}/visits`, payload);
      const updatedVisits = visits.filter((visit) => visit.id !== visit_id);
      const updatedVisitsFiltered = visitsFiltered.filter(
        (visit) => visit.id !== visit_id
      );
      this.setState({
        visits: updatedVisits,
        visitsFiltered: updatedVisitsFiltered,
      });
    } catch (error) {
      console.error(error);
    }
  }

  renderTableContent() {
    let { visitsFiltered } = this.state;
    let reversedVisitsFiltered = visitsFiltered.reverse();
    let visitsRows = reversedVisitsFiltered.map((visit, idx) => {
      let Id = `${visit.patient.village_prefix}${visit.patient.id
        .toString()
        .padStart(3, "0")}`;
      let imageUrl = `${CLOUDINARY_URL}/${visit.patient.picture}`;
      let fullName = visit.patient.name;
      let progress = (
        <button
          className="button is-dark level-item"
          onClick={() => Router.push(`/record?id=${visit.patient.id}`)}
        >
          View
        </button>
      );

      let vitals = (
        <div className="field is-grouped">
          <div className="control is-expanded">
            {" "}
            <button
              className="button is-dark level-item"
              onClick={() =>
                Router.push(`/patient?id=${visit.patient.id}&form=vitals`)
              }
            >
              Create
            </button>
          </div>
        </div>
      );

      let consultation = (
        <div className="field is-grouped">
          <div className="control is-expanded">
            {" "}
            <button
              className="button is-dark level-item"
              onClick={() =>
                Router.push(`/patient?id=${visit.patient.id}&form=medical`)
              }
            >
              Create
            </button>
          </div>
        </div>
      );

      let deleteVisit = (
        <button
          className="button is-danger"
          onClick={() => this.handleDelete(visit.id, visit.patient.id)}
        >
          Delete
        </button>
      );
      return (
        <tr key={idx}>
          <td>{Id}</td>
          <td>
            <figure className="image is-96x96">
              <img
                src={imageUrl}
                alt="Placeholder image"
                style={{ height: 96, width: 96, objectFit: "cover" }}
              />
            </figure>
          </td>
          <td>{fullName}</td>

          <td>{progress}</td>
          <td>{vitals}</td>
          <td>{consultation}</td>
          <td>{deleteVisit}</td>
        </tr>
      );
    });

    return visitsRows;
  }

  onFilterChange(event) {
    let { visits } = this.state;
    let filteredVisits = visits.filter((visit) => {
      let patientId1 =
        `${visit.patient.village_prefix}${visit.patient.id}`.toLowerCase();
      let patientId2 = 
        `${visit.patient.village_prefix}`.toLowerCase()
        + `${visit.patient.id}`.padStart(3, `0`);
      let name = `${visit.patient.name}`.toLowerCase();
      let searchValue = event.target.value.toLowerCase();
      return patientId1.includes(searchValue) || patientId2.includes(searchValue)
            || name.includes(searchValue);
    });

    this.setState({ visitsFiltered: filteredVisits });
  }

  render() {
    return (
      <div
        style={{
          marginTop: 15,
          marginLeft: 25,
          marginRight: 25,
        }}
      >
        <div className="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>Queue</h1>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium"
                type="text"
                placeholder="Search Patient"
                onChange={this.onFilterChange}
              />
            </div>
          </div>
          <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Full Name</th>
                <th>Record</th>
                <th>New Vitals</th>
                <th>New Consultation</th>
                <th>Delete Visit</th>
              </tr>
            </thead>
            <tbody>{this.renderTableContent()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withAuth(Queue);
