import { VILLAGES, VILLAGES_AND_ALL } from '@/constants';
import { VillagePrefix } from '@/types/VillagePrefixEnum';

export function VillageOptionDropdown({
  village,
  handleVillageChange,
  label = 'Village:',
  required = false,
  excludeALLOption = false,
  dropdownClassName = '',
}: {
  village: VillagePrefix;
  handleVillageChange: (villagePrefix: VillagePrefix) => void;
  label?: string;
  required?: boolean;
  excludeALLOption?: boolean;
  dropdownClassName?: string;
}) {
  const options = excludeALLOption ? VILLAGES : VILLAGES_AND_ALL;
  return (
    <div className="text-sm font-semibold">
      <label htmlFor="village_prefix" className="block">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name="village_prefix"
        id="village_prefix"
        value={village}
        onChange={e => handleVillageChange(e.target.value as VillagePrefix)}
        className={
          'w-full rounded border-2 p-1 ' +
          (village == VillagePrefix.ALL
            ? 'text-gray-800'
            : VILLAGES_AND_ALL[village].color) +
          ' ' +
          dropdownClassName
        }
      >
        {/* <option value="ALL" className="text-gray-800">
          ALL
        </option> */}
        {Object.values(options).map(({ key, label, color }) => (
          <option key={key} value={key} className={'font-semibold ' + color}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
