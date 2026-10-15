/**
 * FHIR Service - Transforms PulseRoute Triage into HL7 FHIR R4 standard resources
 * Generates FHIR Bundle containing Encounter, Patient, Observation (Vitals), and ServiceRequest.
 */

export class FHIRService {
  static generateFHIRBundle(patientCard, hospital, lockedBed, ambulanceId) {
    const timestamp = new Date().toISOString();
    const patientRef = `urn:uuid:patient-${patientCard.patientId}`;
    const encounterRef = `urn:uuid:encounter-${patientCard.patientId}`;

    return {
      resourceType: "Bundle",
      id: `pulseroute-bundle-${patientCard.patientId}`,
      meta: {
        lastUpdated: timestamp,
        profile: [
          "https://nrces.in/ndhm/fhir/r4/StructureDefinition/EmergencyEncounterBundle",
          "http://hl7.org/fhir/StructureDefinition/Bundle"
        ]
      },
      type: "transaction",
      entry: [
        // 1. Patient Resource
        {
          fullUrl: patientRef,
          resource: {
            resourceType: "Patient",
            id: patientCard.patientId,
            gender: patientCard.sex === "M" ? "male" : "female",
            birthDate: `${new Date().getFullYear() - patientCard.age}-01-01`,
            managingOrganization: {
              display: hospital.name,
              identifier: { system: "https://abdm.gov.in/facilities", value: hospital.id }
            }
          }
        },
        // 2. Emergency Encounter Resource
        {
          fullUrl: encounterRef,
          resource: {
            resourceType: "Encounter",
            status: "in-progress",
            class: {
              system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
              code: "EMER",
              display: "Emergency Pre-Arrival En-Route"
            },
            priority: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
                  code: patientCard.esi === 1 ? "CR" : patientCard.esi === 2 ? "EL" : "UR",
                  display: `ESI Level ${patientCard.esi}`
                }
              ]
            },
            subject: { reference: patientRef },
            serviceProvider: { display: hospital.name },
            location: [
              {
                location: {
                  display: lockedBed ? `${lockedBed.number} (${lockedBed.type})` : "ER Intake",
                  identifier: { value: lockedBed?.id || "PENDING" }
                },
                status: "reserved"
              }
            ]
          }
        },
        // 3. Vitals Observation: Blood Pressure
        {
          resource: {
            resourceType: "Observation",
            status: "final",
            category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs" }] }],
            code: { coding: [{ system: "http://loinc.org", code: "85354-9", display: "Blood pressure panel" }] },
            subject: { reference: patientRef },
            effectiveDateTime: timestamp,
            component: [
              {
                code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure" }] },
                valueQuantity: { value: patientCard.vitals.bpSystolic, unit: "mmHg", system: "http://unitsofmeasure.org", code: "mm[Hg]" }
              },
              {
                code: { coding: [{ system: "http://loinc.org", code: "8462-4", display: "Diastolic blood pressure" }] },
                valueQuantity: { value: patientCard.vitals.bpDiastolic, unit: "mmHg", system: "http://unitsofmeasure.org", code: "mm[Hg]" }
              }
            ]
          }
        },
        // 4. Vitals Observation: Oxygen Saturation (SpO2)
        {
          resource: {
            resourceType: "Observation",
            status: "final",
            code: { coding: [{ system: "http://loinc.org", code: "2708-6", display: "Oxygen saturation in Arterial blood" }] },
            subject: { reference: patientRef },
            effectiveDateTime: timestamp,
            valueQuantity: { value: patientCard.vitals.spO2, unit: "%", system: "http://unitsofmeasure.org", code: "%" }
          }
        },
        // 5. Pre-Arrival Service Request / Cath Lab Alert
        {
          resource: {
            resourceType: "ServiceRequest",
            status: "active",
            intent: "order",
            priority: "stat",
            code: {
              coding: [{
                system: "http://snomed.info/sct",
                code: patientCard.requiresCathLab ? "415070008" : "7074004",
                display: patientCard.requiresCathLab ? "Percutaneous coronary intervention standby" : "Emergency trauma resuscitation"
              }]
            },
            subject: { reference: patientRef },
            note: patientCard.checklist.map((c) => ({ text: c }))
          }
        }
      ]
    };
  }
}
