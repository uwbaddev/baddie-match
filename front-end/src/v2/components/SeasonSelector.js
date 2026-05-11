import { useState } from 'react';
import { SeasonSelect } from './RedesignUI';
import { SEASON_OPTIONS, parseSeasonValue } from '../utils/playerViewModels';


const SeasonSelector = ({ setStart, setEnd }) => {
  const [selectedSeason, setSelectedSeason] = useState(SEASON_OPTIONS[0].value);

  const handleSeasonChange = (value) => {
    setSelectedSeason(value);
    const { start, end } = parseSeasonValue(value);
    setStart(start);
    setEnd(end);
  };


  return (
    <SeasonSelect value={selectedSeason} onChange={handleSeasonChange} />
  );
};

export default SeasonSelector;
