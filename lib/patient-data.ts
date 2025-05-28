export const patients = {
    "1": {
      id: "1",
      name: "Harini",
      age: 23,
      gender: "Female",
      history: "Gravida 2, Para 1, 28 weeks gestation",
      symptoms: "Mild vaginal bleeding, lower abdominal pain",
      additionalInfo: "Uterine tenderness on palpation; fetal heart tones absent",
      correctTest: "Bedside ultrasound and physical exam",
      correctDiagnosis: "Abruptio placentae",
      contraIndicatedTests: ["digital vaginal exam", "ct scan", "mri"]
    },
    "2": {
      id: "2",
      name: "Dave",
      age: 55,
      gender: "Male",
      history: "Hypertension, smoker (30 pack-years)",
      symptoms: "Central chest pain radiating to left arm, diaphoresis",
      additionalInfo: "BP 150/95, HR 102 bpm; S4 gallop present",
      correctTest: "12-lead ECG + serial troponin I",
      correctDiagnosis: "Acute myocardial infarction",
      contraIndicatedTests: ["exercise stress test", "echo", "treadmill"]
    },
    "3": {
      id: "3",
      name: "Aanaya",
      age: 28,
      gender: "Female",
      history: "G1P0, 8 weeks gestation",
      symptoms: "Severe unilateral lower abdominal pain, scant vaginal spotting",
      additionalInfo: "Adnexal tenderness, cervical motion tenderness, β-hCG above expected for LMP",
      correctTest: "Transvaginal ultrasound",
      correctDiagnosis: "Ectopic pregnancy",
      contraIndicatedTests: ["barium enema", "ct abdomen", "mri pelvis"]
    },
    "4": {
      id: "4",
      name: "Gotham",
      age: 68,
      gender: "Male",
      history: "COPD on home oxygen",
      symptoms: "Increased dyspnea, productive cough with green sputum",
      additionalInfo: "Wheezes and coarse crackles bilaterally; RR 24, SpO₂ 88% on 2 L",
      correctTest: "Arterial blood gas + chest X-ray",
      correctDiagnosis: "COPD exacerbation (likely bacterial)",
      contraIndicatedTests: ["spirometry", "methacholine challenge", "bronchoscopy"]
    },
    "5": {
      id: "5",
      name: "Akansha",
      age: 8,
      gender: "Female",
      history: "Recent exposure to measles in daycare",
      symptoms: "High fever, cough, coryza, conjunctivitis",
      additionalInfo: "Day 3 rash (koplik spots on buccal mucosa; maculopapular rash from face → trunk)",
      correctTest: "Clinical diagnosis + measles IgM serology",
      correctDiagnosis: "Measles",
      contraIndicatedTests: ["lumbar puncture", "chest x-ray", "skin biopsy"]
    },
    "6": {
      id: "6",
      name: "Vidyut",
      age: 45,
      gender: "Male",
      history: "Obesity, family history of diabetes",
      symptoms: "Polyuria, polydipsia, unintentional weight loss over 2 months",
      additionalInfo: "Fasting glucose 160 mg/dL, BMI 32",
      correctTest: "Fasting plasma glucose + HbA1c",
      correctDiagnosis: "Type 2 diabetes mellitus",
      contraIndicatedTests: ["ct scan", "insulin tolerance test", "oral glucose tolerance with 100g load"]
    }
  };
  

export const getNextPatientId = (currentId: string): string | null => {
    const ids = Object.keys(patients).sort((a, b) => Number(a) - Number(b));
    const index = ids.indexOf(currentId);
    return index >= 0 && index < ids.length - 1 ? ids[index + 1] : null;
  };
  