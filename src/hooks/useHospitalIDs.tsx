import { useState, useEffect } from 'react';

export const useHospitalIDs = () => {
  const [hospitalID, setHospitalID] = useState<string>("");

  useEffect(() => {
    const storedHospitals = localStorage.getItem("activeHospitals");
    if (storedHospitals) {
      try {
        const hospitalsArray = JSON.parse(storedHospitals);
        // Get only the first hospital ID
        const firstHospitalId = hospitalsArray[0]?._id || "";
        setHospitalID(firstHospitalId);
      } catch (error) {
        console.error("Error parsing local storage data:", error);
      }
    }
  }, []);

  return hospitalID;
};