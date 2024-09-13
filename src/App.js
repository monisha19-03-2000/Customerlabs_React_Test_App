import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import './App.css'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

const App = () => {
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState(schemaOptions);
  const [dropdowns, setDropdowns] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Add new schema dropdown
  const handleSchemaAdd = () => {
    if (availableSchemas.length > 0) {
      const newSchema = availableSchemas[0]; // Add the first available schema as default
      setDropdowns([...dropdowns, newSchema]);
      setAvailableSchemas(availableSchemas.filter((s) => s.value !== newSchema.value));
    }
  };

  // Update the schema dropdown values
  const handleSchemaChange = (index, newValue) => {
    const newSchema = schemaOptions.find((s) => s.value === newValue);
    const updatedDropdowns = dropdowns.map((dropdown, i) =>
      i === index ? newSchema : dropdown
    );
    setDropdowns(updatedDropdowns);
    setAvailableSchemas(schemaOptions.filter((s) => !updatedDropdowns.includes(s)));
  };

  // Handle the saving process
  const handleSave = async () => {
    const payload = {
      segment_name: segmentName,
      schema: dropdowns.map((d) => ({ [d.value]: d.label })),
    };

    try {
      const response = await fetch("https://webhook.site/c99570f4-6929-4818-892d-321a9e11536b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "no-cors",
      });

      // Trigger toast on success
      if (response.ok || response.type === 'opaque') { 
      } else {
        toast.error("Failed to save the segment.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving the segment.");
    }
  };

  // Close popup
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="app">
      <button className="custom-button" onClick={() => setIsPopupVisible(true)}>Save Segment</button>

      {isPopupVisible && <div className="overlay" onClick={closePopup}></div>}
   
      {isPopupVisible && (
  <div className="popup show">
    
    <div className="popup-header">
    <i className="fas fa-chevron-left" onClick={closePopup}></i>              Save Segment
            </div>

    <div className="popup-content">
      <input
        type="text"
        placeholder="Name of the segment"
        value={segmentName}
        onChange={(e) => setSegmentName(e.target.value)}
      />
      <div className="schema-box">
        {dropdowns.map((dropdown, index) => (
          <select
            key={index}
            value={dropdown.value}
            onChange={(e) => handleSchemaChange(index, e.target.value)}
          >
            {availableSchemas.concat(dropdown).map((schema) => (
              <option key={schema.value} value={schema.value}>
                {schema.label}
              </option>
            ))}
          </select>
        ))}
      </div>
      <button onClick={handleSchemaAdd}>+Add new schema</button>
      <button onClick={handleSave}>Save the Segment</button>
    </div>
  </div>
)}

    </div>
  );
};

export default App;
