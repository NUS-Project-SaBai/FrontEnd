// code is around 75% similar to that of queue.js
// there is definitely room for refactoring
/* Commented out Old Code
import React from "react";
import axios from "axios";
import Router from "next/router";
import { API_URL, CLOUDINARY_URL } from "../../utils/constants";
import withAuth from "../../utils/auth";
import prescription from "./prescription";
class Orders extends React.Component {
  constructor() {
    super();

    this.state = {
      visits: [],
      visitsFiltered: [],
      filterString: "",
      orders: [],
      consults: [],
      filteredVisitIdsUsingOrders: new Set(),
    };

    this.onFilterChange = this.onFilterChange.bind(this);
  }

  async componentDidMount() {
    await this.onRefresh();
  }

  async onRefresh() {
    let { data: orders } = await axios.get(
      `${API_URL}/orders?order_status=PENDING`
    );
    let { data: visits } = await axios.get(`${API_URL}/visits`);

    const filteredVisitIdsUsingOrders = new Set();
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];

      console.log(order);
      filteredVisitIdsUsingOrders.add(order.consult.visit.id);
    }

    console.log(filteredVisitIdsUsingOrders);

    this.setState({
      visits: visits,
      visitsFiltered: visits,
      filteredVisitIdsUsingOrders,
      orders,
    });
  }

  onFilterChange(event) {
    let { visits } = this.state;

    let filteredVisits = visits.filter((visit) => {
      let patientId =
        `${visit.patient.village_prefix}`.toLowerCase() +
        `${visit.patient.id}`.padStart(3, `0`) +
        ` ${visit.patient.name} ${visit.patient.local_name}`.toLowerCase();

      return patientId.includes(event.target.value.toLowerCase());
    });
    this.setState({ visitsFiltered: filteredVisits });
  }

  renderTableContent() {
    let { visitsFiltered, filteredVisitIdsUsingOrders, orders } = this.state;

    let visitsRows = visitsFiltered
      .filter((visit) => filteredVisitIdsUsingOrders.has(visit.id))
      .map((visit) => {
        let Id =
          `${visit.patient.village_prefix}` +
          `${visit.patient.id}`.padStart(3, `0`);
        let imageUrl = `${CLOUDINARY_URL}/${visit.patient.picture}`;
        let fullName = visit.patient.name;

        let correctPrescription = [];

        for (let i = 0; i < orders.length; i++) {
          const order = orders[i];
          if (order.consult.visit.id == visit.id) {
            correctPrescription.push(order);
          }
        }
        console.log(correctPrescription);
        let prescriptions = correctPrescription.map((prescription) => (
          <li>
            {prescription.medicine && "medicine_name" in prescription.medicine
              ? prescription.medicine.medicine_name
              : ""}
            : {prescription.quantity} <br />
            Notes: {prescription.notes} <br /> <br />
          </li>
        ));

        let action = (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              className="button is-dark level-item"
              onClick={async () => {
                if (
                  confirm(
                    "Have you checked whether the prescription and amounts are correct?"
                  )
                ) {
                  try {
                    const promises = [];
                    correctPrescription.forEach((prescription) => {
                      promises.push(
                        axios.patch(`${API_URL}/orders/${prescription.id}`, {
                          order_status: "approved",
                        })
                      );
                    });
                    Promise.all(promises).then(() => this.onRefresh());
                  } catch (error) {
                    console.error(error);
                  }
                }
              }}
              style={{ display: "inline-block" }}
            >
              Prescribe
            </button>

            <button
              className="button is-danger level-item"
              onClick={async () => {
                if (confirm("Are you sure you want to delete this order?")) {
                  try {
                    const promises = [];
                    correctPrescription.forEach((prescription) => {
                      promises.push(
                        axios.delete(`${API_URL}/orders/${prescription.id}`)
                      );
                      promises.push(
                        axios.patch(
                          `${API_URL}/medications/${prescription.medicine.id}`,
                          {
                            quantityChange: parseInt(prescription.quantity),
                          }
                        )
                      );
                    });
                    Promise.all(promises).then(() => this.onRefresh());
                  } catch (error) {
                    console.error(error);
                  }
                }
              }}
              style={{ display: "inline-block", marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        );

        return (
          <tr key={visit.id}>
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
            <td>
              <ul>{prescriptions}</ul>
            </td>
            <td>{action}</td>
          </tr>
        );
      });

    return visitsRows;
  }

  render() {
    return (
      <div
        style={{
          marginTop: 15,
          marginLeft: 25,
          marginRight: 25,
          // position: "relative"
        }}
      >
        <div className="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>
            Approve/Reject Orders
          </h1>
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
                <th>Prescriptions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.renderTableContent()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withAuth(Orders);
*///

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, CLOUDINARY_URL } from '../../utils/constants';
import withAuth from '../../utils/auth';

const Orders = () => {
  const [visits, setVisits] = useState([]);
  const [visitsFiltered, setVisitsFiltered] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredVisitIdsUsingOrders, setFilteredVisitIdsUsingOrders] = useState(new Set());

  useEffect(() => {
    fetchOrdersAndVisits();
  }, []);

  const fetchOrdersAndVisits = async () => {
    try {
      const { data: orders } = await axios.get(`${API_URL}/orders?order_status=PENDING`);
      const { data: visits } = await axios.get(`${API_URL}/visits`);
      
      const newFilteredVisitIds = new Set(orders.map(order => order.consult.visit.id));
      setFilteredVisitIdsUsingOrders(newFilteredVisitIds);
      setVisits(visits);
      setVisitsFiltered(visits);
      setOrders(orders);
    } catch (error) {
      console.error('Error fetching orders and visits:', error);
    }
  };

  const onFilterChange = (event) => {
    const filteredVisits = visits.filter(visit => {
      const patientId = `${visit.patient.village_prefix}${visit.patient.id}`.padStart(3, '0').toLowerCase() +
                        ` ${visit.patient.name} ${visit.patient.local_name}`.toLowerCase();
      return patientId.includes(event.target.value.toLowerCase());
    });
    setVisitsFiltered(filteredVisits);
  };

  const handlePrescriptionAction = async (prescriptions, actionType) => {
    if (window.confirm(`Are you sure you want to ${actionType} this order?`)) {
      try {
        const promises = prescriptions.map(prescription => {
          return axios.patch(`${API_URL}/orders/${prescription.id}`, {
            order_status: actionType === 'approve' ? 'approved' : 'cancelled'
          });
        });
        await Promise.all(promises);
        fetchOrdersAndVisits();
      } catch (error) {
        console.error('Error updating orders:', error);
      }
    }
  };

  const renderTableContent = () => {
    return visitsFiltered
      .filter(visit => filteredVisitIdsUsingOrders.has(visit.id))
      .map(visit => {
        const Id = `${visit.patient.village_prefix}${visit.patient.id}`.padStart(3, '0');
        const imageUrl = `${CLOUDINARY_URL}/${visit.patient.picture}`;
        const fullName = visit.patient.name;

        const correctPrescription = orders.filter(order => order.consult.visit.id === visit.id);
        const prescriptions = correctPrescription.map(prescription => (
          <li key={prescription.id}>
            {prescription.medicine?.medicine_name || ''}: {prescription.quantity}<br />
            Notes: {prescription.notes}<br /><br />
          </li>
        ));

        return (
          <tr key={visit.id}>
            <td>{Id}</td>
            <td>
              <figure className="image is-96x96">
                <img src={imageUrl} alt="Patient" style={{ height: 96, width: 96, objectFit: 'cover' }} />
              </figure>
            </td>
            <td>{fullName}</td>
            <td><ul>{prescriptions}</ul></td>
            <td>
              <button className="button is-dark" onClick={() => handlePrescriptionAction(correctPrescription, 'approve')}>
                Prescribe
              </button>
              <button className="button is-danger" style={{ marginLeft: '10px' }} onClick={() => handlePrescriptionAction(correctPrescription, 'cancel')}>
                Cancel
              </button>
            </td>
          </tr>
        );
      });
  };

  return (
    <div style={{ marginTop: 15, marginLeft: 25, marginRight: 25 }}>
      <div className="column is-12">
        <h1 style={{ color: 'black', fontSize: '1.5em' }}>Approve/Reject Orders</h1>
        <div className="field">
          <div className="control">
            <input
              className="input is-medium"
              type="text"
              placeholder="Search Patient"
              onChange={onFilterChange}
            />
          </div>
        </div>
          <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Full Name</th>
              <th>Prescriptions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(Orders);
