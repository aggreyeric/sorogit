import { useState, useEffect } from 'react';

const FormDataDisplay = () => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/form-data');
      const data = await response.json();
      setFormData(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Form Data</h2>
      <ul>
        {Object.keys(formData).map((key) => (
          <li key={key}>
            <strong>{key}</strong>: {formData[key]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormDataDisplay;