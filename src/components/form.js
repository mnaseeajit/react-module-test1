
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Circles } from 'react-loader-spinner'

const PincodeLookupApp = () => {
  const [pincode, setPincode] = useState('');
  const [filteredPostOffices, setFilteredPostOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
  };

  const handleLookupClick = async () => {
    try {
      if (pincode.length !== 6) {
        setError('Postal code must be 6 digits');
        return;
      }
        
      
      setLoading(true);
      setError('');

      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data[0].PostOffice;

      if (data.length === 0) {
        setError('Couldn’t find the postal data you’re looking for...');
      } else {
        setFilteredPostOffices(data);
      }
    } catch (error) {
      setError('Error fetching postal data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const filterValue = event.target.value.toLowerCase();
    const filteredData = filteredPostOffices.filter((office) =>
      office.Name.toLowerCase().includes(filterValue)
    );
    setFilteredPostOffices(filteredData);
  };

  return (
    <div>
      <h1>Pincode Lookup App</h1>
      <div>
        <label htmlFor="pincodeInput">Enter 6-digit Pincode:</label>
        <input
          type="text"
          id="pincodeInput"
          value={pincode}
          onChange={handlePincodeChange}
          maxLength={6}
        />
        <button onClick={handleLookupClick}>Lookup</button>
      </div>
     
      {/* {loading && (
        <Loader type="ThreeDots" color="#00BFFF" height={40} width={40} timeout={3000} />
      )} */}

{loading && (
    <Circles
  height="80"
  width="80"
  color="#4fa94d"
  ariaLabel="circles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {filteredPostOffices.length > 0 && (
        <div>
          <h2>Postal Details:</h2>
          <label htmlFor="filterInput">Filter by Post Office Name:</label>
          <input type="text" id="filterInput" onChange={handleFilterChange} />

          <ul>
            {filteredPostOffices.map((office) => (
              <li key={office.Name}>
                <p>Post Office Name: {office.Name}</p>
                <p>Branch Type: {office.BranchType}</p>
                <p>District: {office.District}</p>
                <p>State: {office.State}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PincodeLookupApp;
