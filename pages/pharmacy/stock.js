import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import moment from "moment";
import axios from "axios";
import _ from "lodash";
import { MedicationForm } from "../../components/forms/stock";
import { API_URL } from "../../utils/constants";
import withAuth from "../../utils/auth";
import toast from "react-hot-toast";


Modal.setAppElement("#__next");

function Stock() {
  // medications is the list of current medications in stock
   const [medications, setMedications] = useState([]);
   // Filtered medications after filtering using the search bar
   const [medicationsFiltered, setMedicationsFiltered] = useState([]);
   const [medicationDetails, setMedicationDetails] = useState({
     medicine_name: "",
     // reserve_quantity and remarks note used?
     reserve_quantity: 0,
     quantity: 0,
     quantityChange: 0,
     notes: "",
     remarks: ""
   });
   const [modalIsOpen, setModalIsOpen] = useState(false);
   // unused?
   const [filterString, setFilterString] = useState("");
   
   useEffect(() => {
     onRefresh();
   }, []);
 
   async function onRefresh() {
     const { data: medicationData } = await axios.get(`${API_URL}/medications`);
     setMedications(medicationData);
     setMedicationsFiltered(medicationData);
   }
 
   async function onSubmitForm() {
    // !!! there will be an error is no medication name is inputted
     const quantityChange = medicationDetails.quantityChange;
     // Capitalizes first letter in the name input when adding medications (!!doesn't work if there is space at the start)
     const nameEnriched =
       medicationDetails.medicine_name.charAt(0).toUpperCase() +
       medicationDetails.medicine_name.slice(1);
    setMedicationDetails(prevMedicationDetails => ({
      ...prevMedicationDetails,
      medicine_name: nameEnriched
    }));
     if (medicationDetails.pk) {
       const key = medicationDetails.pk;
       const quantity =
         parseInt(medicationDetails.quantity) + parseInt(quantityChange);
       if (quantity >= 0) { // edit case
         // medicationDetails.quantity = quantity;
 
         // medicationDetails.changeQuantity = 0;
         // delete medicationDetails["pk"];
 
         await axios
           .patch(`${API_URL}/medications/${key}`, { quantityChange: parseInt(quantityChange) })
           .then(() => toast.success("Medication updated!"))
           .catch(() => {
             toast.error("Encountered an error!");
             toggleModal();
             onRefresh();
           });
       } else {
         toast.error("Insufficient medication!");
       }
     } else if (quantityChange >= 0) { //new medication case
       setMedicationDetails(prevMedicationDetails => ({
        ...prevMedicationDetails,
        quantity: quantityChange
      }));
       await axios.post(`${API_URL}/medications`, medicationDetails);
       toast.success("New Medication created!");
     } else {
       toast.error("Invalid number!");
     }
 
     toggleModal();
     onRefresh();
   }
 
   async function handleDelete(pk) {
     const confirmed = window.confirm(
       "Are you sure you want to delete this medication?"
     );
     if (!confirmed) {
       return;
     }
 
     try {
       await axios.delete(`${API_URL}/medications/${pk}`);
       const updatedMedications = medications.filter(
         (medication) => medication.pk !== pk
       );
       const updatedMedicationsFiltered = medicationsFiltered.filter(
         (medication) => medication.pk !== pk
       );
       
       setMedications(updatedMedications);
       setMedicationsFiltered(updatedMedicationsFiltered);
       toast.success("Medication successfully deleted!");
     } catch (error) {
       console.error('Error when deleting medication:', error);
     }
   }
 
   function onFilterChange(event) {
 
     const filteredList = medications.filter((medication) => {
       const medicineName = medication.fields.medicine_name.toLowerCase();
 
       return medicineName.includes(event.target.value.toLowerCase());
     });
 
     setMedicationsFiltered(filteredList);
   }
 
   /**
    * open the modal
    * load the appropriate medication
    */
   function toggleModal(medication = {}) {
     setModalIsOpen(prevModalIsOpen => !prevModalIsOpen);  
     setMedicationDetails(medication);
   }
   
   function handleMedicationChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    setMedicationDetails((prevMedicationDetails) => ({
      ...prevMedicationDetails,
      [name]: value,
    }));
   }

   function renderModal() {
 
     return (
       <Modal
         isOpen={modalIsOpen}
         onRequestClose={toggleModal}
         style={prescriptionModalStyles}
       >
         <MedicationForm
           formDetails={medicationDetails}
           handleInputChange={handleMedicationChange}
           onSubmit={onSubmitForm}
         />
       </Modal>
     );
   }
 
   
 
   function renderRows() {
     let medications = medicationsFiltered;
     let tableRows = medications.map((medication) => {
       let mDetails = {
         ...medication.fields,
         pk: medication.pk,
         quantityChange: 0,
       };
       let name = medicationDetails.medicine_name;
       let quantity = medicationDetails.quantity;
 
       return (
         <tr>
           <td>{name}</td>
           <td>{quantity}</td>
           <td>
             <div className="levels">
               <div className="level-left">
                 <button
                   className="button is-dark level-item"
                   onClick={() => toggleModal(medicationDetails)}
                 >
                   Edit
                 </button>
 
                 <button
                   className="button is-danger level-item"
                   onClick={() => handleDelete(medicationDetails.pk)}
                 >
                   Delete
                 </button>
               </div>
             </div>
           </td>
         </tr>
       );
     });
     return tableRows;
   }
 
   return (
     <div
       style={{
         marginTop: 15,
         marginLeft: 25,
         marginRight: 25,
         // position: "relative"
       }}
     >
       {renderModal()}
       <div className="column is-12">
         <h1 style={{ color: "black", fontSize: "1.5em" }}>Medicine Stock</h1>
         <div className="control">
           <input
             className="input is-medium"
             type="text"
             placeholder="Search Medications"
             onChange={onFilterChange}
           />
         </div>
         <div className="levels" style={{ marginBottom: 10, marginTop: 10 }}>
           <div className="level-left">
             <button
               className="button is-dark level-item"
               style={{ display: "inline-block", verticalAlign: "top" }}
               onClick={toggleModal}
             >
               New Medicine
             </button>
           </div>
         </div>
 
         <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
           <thead>
             <tr>
               <th>Name</th>
               <th>Quantity</th>
               <th>Actions</th>
             </tr>
           </thead>
           <tbody>{renderRows()}</tbody>
         </table>
       </div>
     </div>
   );
 }
 
 
 const prescriptionModalStyles = {
   content: {
     left: "35%",
     right: "17.5%",
     top: "25%",
     bottom: "25%",
   },
 };
 
 export default withAuth(Stock);
