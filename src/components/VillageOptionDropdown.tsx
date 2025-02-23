import { VILLAGES } from '@/constants';
import { VillagePrefix } from '@/types/VillagePrefixEnum';

export default function VillageOptionDropdown({
  village,
  handleVillageChange,
  label = 'Village:',
}: {
  village: VillagePrefix;
  handleVillageChange: (villagePrefix: VillagePrefix) => void;
  label?: string;
}) {
  return (
    <div className="font-semibold">
      <label htmlFor="village_prefix" className="block">
        {label}
      </label>
      <select
        name="village_prefix"
        id="village_prefix"
        value={village}
        onChange={e => handleVillageChange(e.target.value as VillagePrefix)}
        className={
          'mt-2 w-full rounded border-2 shadow-sm ' +
          (VILLAGES.find(value => value.key == village)?.color ||
            'text-gray-800')
        }
      >
        <option value="ALL" className="text-gray-800">
          ALL
        </option>
        {VILLAGES.map(({ key, label, color }) => (
          <option key={key} value={key} className={'font-semibold ' + color}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
