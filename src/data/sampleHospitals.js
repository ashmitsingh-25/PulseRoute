/**
 * Sample Hospital Network with Real-Time Inventory & Specialty Availability
 * Directly reflects the case study in the PulseRoute design pitch (Metro Heart Centre vs City General)
 */

export const SAMPLE_HOSPITALS = [
  {
    id: "HOSP-01",
    name: "Metro Heart Centre",
    type: "Cardiovascular & Super-Specialty ER",
    address: "Outer Ring Rd, Tech Corridor, Zone 3",
    etaMinutes: 14,
    distanceKm: 8.4,
    coordinates: { lat: 28.5355, lng: 77.2510 },
    capabilities: {
      cathLab: { available: true, status: "READY_STANDBY", activePhysician: "Dr. A. Sharma (Interventional)" },
      traumaLevel: "LEVEL_2",
      strokeFastTrack: false,
      pediatricICU: false,
    },
    beds: {
      icuTotal: 12,
      icuFree: 3,
      ccuTotal: 8,
      ccuFree: 2, // Free CCU beds
      ventilatorsFree: 6,
    },
    erLoadPercent: 42, // Moderate load
    diversionStatus: "OPEN", // 'OPEN' | 'DIVERSION_ICU' | 'TOTAL_DIVERSION'
    specialistOnDuty: true,
    phone: "+91 11 4092 8800",
    ambulanceBay: "Bay 4 (Dedicated Cardiac Intake)",
  },
  {
    id: "HOSP-02",
    name: "City General Hospital",
    type: "Municipal Tertiary Care & Trauma",
    address: "Civil Lines, Central Square",
    etaMinutes: 7, // NEAREST geographically!
    distanceKm: 3.1,
    coordinates: { lat: 28.5520, lng: 77.2180 },
    capabilities: {
      cathLab: { available: false, status: "OFFLINE_MAINTENANCE", activePhysician: "Off-Duty (Paging)" },
      traumaLevel: "LEVEL_1",
      strokeFastTrack: true,
      pediatricICU: true,
    },
    beds: {
      icuTotal: 24,
      icuFree: 0, // CRITICAL: ICU FULL!
      ccuTotal: 6,
      ccuFree: 0, // CCU FULL!
      ventilatorsFree: 1,
    },
    erLoadPercent: 96, // Severe Overcrowding / Near Diversion
    diversionStatus: "DIVERSION_ICU",
    specialistOnDuty: false,
    phone: "+91 11 2386 1122",
    ambulanceBay: "Bay 1-2 (Queue: 3 Ambulances waiting)",
  },
  {
    id: "HOSP-03",
    name: "District Apex Trauma & Neuro",
    type: "Level-1 Trauma & Comprehensive Stroke",
    address: "National Highway Hub, West Wing",
    etaMinutes: 19,
    distanceKm: 11.2,
    coordinates: { lat: 28.5110, lng: 77.1950 },
    capabilities: {
      cathLab: { available: true, status: "OCCUPIED_EXP_FREE_45M", activePhysician: "Dr. K. Verma" },
      traumaLevel: "LEVEL_1",
      strokeFastTrack: true,
      pediatricICU: true,
    },
    beds: {
      icuTotal: 20,
      icuFree: 4,
      ccuTotal: 6,
      ccuFree: 1,
      ventilatorsFree: 8,
    },
    erLoadPercent: 58,
    diversionStatus: "OPEN",
    specialistOnDuty: true,
    phone: "+91 11 2658 9900",
    ambulanceBay: "Trauma Ramp A",
  },
  {
    id: "HOSP-04",
    name: "St. Jude Community Hospital",
    type: "Secondary Care Community Center",
    address: "Sector 14, Market Road",
    etaMinutes: 11,
    distanceKm: 5.8,
    capabilities: {
      cathLab: { available: false, status: "NO_FACILITY", activePhysician: "None" },
      traumaLevel: "LEVEL_3",
      strokeFastTrack: false,
      pediatricICU: false,
    },
    beds: {
      icuTotal: 4,
      icuFree: 1,
      ccuTotal: 0,
      ccuFree: 0,
      ventilatorsFree: 2,
    },
    erLoadPercent: 35,
    diversionStatus: "OPEN",
    specialistOnDuty: false,
    phone: "+91 11 2921 5544",
    ambulanceBay: "ER Front Gate",
  }
];
