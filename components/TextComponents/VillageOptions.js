import { villageCodes, villageColours } from "@/utils/constants";

export const villageOptions = Object.keys(villageCodes).map((key) => ({
    value: key,
    label: villageCodes[key],
    style: { color: villageColours[key] },
  }));
  

export function getColour (patientVillagePrefix) {
    return villageOptions.filter(obj => 
        {return obj.value == patientVillagePrefix})[0].style;
}
