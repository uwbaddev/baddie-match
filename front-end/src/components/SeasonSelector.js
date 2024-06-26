import React, { useState } from 'react';


const SeasonSelector = ({ setStart, setEnd }) => {
  const [selectedSeason, setSelectedSeason] = useState('');
  const options = [
    { label: '2023-2024', value: '2023-09-01, 2024-08-31'  },
    { label: '2022-2023', value: '2022-09-01, 2023-08-31'  },
    { label: '2021-2022', value: '2021-09-01, 2022-08-31'  },
    { label: 'ALL', value:  '2000-09-01, 3000-09-01'  },
  ];

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value)
    let start = event.target.value.substring(0, 10);
    let end = event.target.value.substring(12, 22);
    setStart(start)
    setEnd(end)
  };


  return (
    <div>
      <select onChange={handleSeasonChange} value={selectedSeason}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeasonSelector;