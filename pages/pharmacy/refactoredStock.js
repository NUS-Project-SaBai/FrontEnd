import React from 'react'
import withAuth from "../../utils/auth";

const prescriptionModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "25%",
    bottom: "25%",
  },
};

const refactoredStock = () => {
    const [medications, setMedications] = useState([]);
    const [medicationsFiltered, setMedicationsFiltered] = useState([]);
    const [medicationDetails, setMedicationDetails] = useState({
        medicine_name: "",
        reserve_quantity: 0,
        quantity: 0,
        quantityChange: 0,
        notes: "",
        remarks: "",
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [filterString, setFilterString] = useState("");

    useEffect(() => {
      onRefresh();
    }, []);
  
    const onRefresh = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/medications`);
        setMedications(data);
        setMedicationsFiltered(data);
      } catch (error) {
        console.error("Failed to fetch medications:", error);
      }
    };

    const onSubmitForm = async () => {
      const quantityChange = medicationDetails.quantityChange;
      const nameEnriched =
        medicationDetails.medicine_name.charAt(0).toUpperCase() +
        medicationDetails.medicine_name.slice(1);
      
      let updatedDetails = { ...medicationDetails, medicine_name: nameEnriched };
  
      if (updatedDetails.pk) {
        let key = updatedDetails.pk;
        let quantity =
          parseInt(updatedDetails.quantity) + parseInt(quantityChange);
        if (quantity >= 0) {
          try {
            await axios.patch(`${API_URL}/medications/${key}`, { quantityChange: parseInt(quantityChange) });
            toast.success("Medication updated!");
          } catch (error) {
            toast.error("Encountered an error!");
          }
        } else {
          toast.error("Insufficient medication!");
        }
      } else if (quantityChange >= 0) {
        updatedDetails.quantity = quantityChange;
        try {
          await axios.post(`${API_URL}/medications`, updatedDetails);
          toast.success("New Medication created!");
        } catch (error) {
          toast.error("Failed to create medication!");
        }
      } else {
        toast.error("Invalid number!");
      }
  
      toggleModal();
      onRefresh();
    };

  return (
  )
}

export default withAuth(refactoredStock)