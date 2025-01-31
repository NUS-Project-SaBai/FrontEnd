import { useContext } from 'react';
import { VenueOptionsDropdown } from '../registration/PatientRegistrationForm';
import { VillageContext } from '@/context/VillageContext';

export default function SideMenuVillageDropdown() {
  const { village, setVillage } = useContext(VillageContext);
  return (
    <VenueOptionsDropdown
      value={village}
      key={'sideMenu'}
      smaller
      handleInputChange={e => setVillage(e.target.value)}
      showAllOption
    />
  );
}
