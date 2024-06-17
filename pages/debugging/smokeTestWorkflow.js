import axios from "axios";

const baseUrl = "http://127.0.0.1:8000";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Helper to wait for async operations

const smokeTestWorkflow = async () => {
  try {
    // 1. Post Patient
    let res = await axios.post(`${baseUrl}/patients`, {
      village_prefix: "Test",
      name: "John Doe",
      identification_number: "123456",
      contact_no: "123-456-7890",
      gender: "Male",
      date_of_birth: "1990-01-01",
      drug_allergy: "None",
      face_encodings: "",
      picture: "",
    });
    const patientId = res.data.id;
    console.log("Patient Created:", res.data);

    // 2. Patch Patient
    res = await axios.patch(`${baseUrl}/patients/${patientId}`, {
      village_prefix: "Updated Test",
      name: "John Doe Updated",
    });
    console.log("Patient Updated:", res.data);

    // 3. Get Patient
    res = await axios.get(`${baseUrl}/patients/${patientId}`);
    console.log("Patient Retrieved:", res.data);

    // 4. Post Visit
    res = await axios.post(`${baseUrl}/visits`, {
      patient: patientId,
      date: new Date().toISOString(),
      status: "Initial Visit",
    });
    const visitId = res.data.id;
    console.log("Visit Created:", res.data);

    // 5. Patch Visit
    res = await axios.patch(`${baseUrl}/visits/${visitId}`, {
      patient: patientId,
      date: new Date().toISOString(),
      status: "Follow-up Visit",
    });
    console.log("Visit Updated:", res.data);

    // 6. Get Visit
    res = await axios.get(`${baseUrl}/visits/${visitId}`);
    console.log("Visit Retrieved:", res.data);

    // 7. Post Consult
    res = await axios.post(`${baseUrl}/consults`, {
      visit: visitId,
      date: new Date().toISOString(),
      doctor: 1000,
      past_medical_history: "None",
      consultation: "General Checkup",
      plan: "Regular follow-up",
      referred_for: "None",
      referral_notes: "",
      remarks: "Consultation Created",
    });
    const consultId = res.data.id;
    console.log("Consult Created:", res.data);

    // 8. Patch Consult
    res = await axios.patch(`${baseUrl}/consults/${consultId}`, {
      visit: visitId,
      date: new Date().toISOString(),
      doctor: 1000,
      past_medical_history: "Updated History",
      consultation: "Updated Checkup",
      plan: "Updated follow-up",
      referred_for: "Specialist",
      referral_notes: "Updated Notes",
      remarks: "Consultation Updated",
    });
    console.log("Consult Updated:", res.data);

    // 9. Get Consult
    res = await axios.get(`${baseUrl}/consults/${consultId}`);
    console.log("Consult Retrieved:", res.data);

    // 10. Delete Consult
    await axios.delete(`${baseUrl}/consults/${consultId}`);
    console.log("Consult Deleted");

    // 11. Delete Visit
    await axios.delete(`${baseUrl}/visits/${visitId}`);
    console.log("Visit Deleted");

    // 12. Delete Patient
    await axios.delete(`${baseUrl}/patients/${patientId}`);
    console.log("Patient Deleted");

    // 13. Post Medicine
    res = await axios.post(`${baseUrl}/medications`, {
      medicine_name: "Aspirin",
      quantity: 10,
      notes: "Take once daily",
      remarks: "Medicine Created",
    });
    const medicineId = res.data.id;
    console.log("Medicine Created:", res.data);

    // 14. Patch Medicine
    res = await axios.patch(`${baseUrl}/medications/${medicineId}`, {
      medicine_name: "Aspirin Updated",
      quantity: 20,
      notes: "Take twice daily",
      remarks: "Medicine Updated",
      quantityChange: 10,
    });
    console.log("Medicine Updated:", res.data);

    // 15. Get Medicine
    res = await axios.get(`${baseUrl}/medications/${medicineId}`);
    console.log("Medicine Retrieved:", res.data);

    // 16. Post Order
    res = await axios.post(`${baseUrl}/orders`, {
      medicine: medicineId,
      quantity: 5,
      consult: 1000,
      notes: "Order Notes",
      remarks: "Order Created",
      order_status: "Pending",
    });
    const orderId = res.data.id;
    console.log("Order Created:", res.data);

    // 17. Patch Order
    res = await axios.patch(`${baseUrl}/orders/${orderId}`, {
      medicine: medicineId,
      quantity: 10,
      consult: 1000,
      notes: "Order Notes Updated",
      remarks: "Order Updated",
      order_status: "Completed",
    });
    console.log("Order Updated:", res.data);

    // 18. Get Order
    res = await axios.get(`${baseUrl}/orders/${orderId}`);
    console.log("Order Retrieved:", res.data);

    // 19. Delete Order
    await axios.delete(`${baseUrl}/orders/${orderId}`);
    console.log("Order Deleted");

    // 20. Delete Medicine
    await axios.delete(`${baseUrl}/medications/${medicineId}`);
    console.log("Medicine Deleted");
  } catch (err) {
    console.error(
      "Error during smoke testing:",
      err.response ? err.response.data : err.message,
    );
  }
};

export default smokeTestWorkflow;
