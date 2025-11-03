export const generateReferenceId = (): string => {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `RX-${year}-${randomNumber}`;
};

export const validateWithAI = (dosage: number, frequency: number, age: number, medicine: string): string => {
  // Check for incomplete data first
  if (!dosage || !frequency || !age || !medicine.trim()) {
      return '⚠️ Incomplete data. Please fill patient age, medicine, dosage, and frequency before validating.';
  }

  // 1. Frequency Validation
  if (frequency < 1) {
    return '⚠️ Invalid frequency. Must be at least once per day.';
  }
  if (frequency > 4) {
    return '⚠️ The entered frequency is too high. Recommended maximum is 4 times per day.';
  }

  const medicineLower = medicine.toLowerCase().trim();

  // 2. Medicine-Specific Guidelines
  switch (medicineLower) {
    case 'paracetamol':
      if (age >= 13) { // Adults
        if (dosage < 500) return `⚠️ The entered dosage (${dosage} mg) is too low for an adult. Recommended: 500–1000 mg every 6 hours.`;
        if (dosage > 1000) return `⚠️ Unsafe dosage detected. The dosage (${dosage} mg) exceeds safe limit for adults. Recommended: 500–1000 mg.`;
      } else if (age >= 6 && age <= 12) { // Children
        if (dosage < 250) return `⚠️ The entered dosage (${dosage} mg) is too low for a child aged ${age}. Recommended: 250–500 mg every 6 hours.`;
        if (dosage > 500) return `⚠️ Unsafe dosage detected. The dosage (${dosage} mg) exceeds safe limit for a child aged ${age}. Recommended: 250–500 mg.`;
      } else if (age < 6) { // Infants
        if (dosage < 120) return `⚠️ The entered dosage (${dosage} mg) is too low for an infant aged ${age}. Recommended: 120–250 mg every 6 hours.`;
        if (dosage > 250) return `⚠️ Unsafe dosage detected. The dosage (${dosage} mg) exceeds safe limit for an infant aged ${age}. Recommended: 120–250 mg.`;
      }
      break;

    case 'amoxicillin':
      if (age >= 13) { // Adults
        if (dosage !== 500) return `⚠️ The entered dosage (${dosage} mg) for Amoxicillin is incorrect for an adult. Recommended: 500 mg every 8 hours.`;
        if (frequency !== 3) return `⚠️ The frequency for Amoxicillin is typically 3 times/day. Please confirm if ${frequency} times/day is intended.`;
      } else { // Children < 13
        if (dosage !== 250) return `⚠️ The entered dosage (${dosage} mg) for Amoxicillin is incorrect for a child. Recommended: 250 mg every 8 hours.`;
        if (frequency !== 3) return `⚠️ The frequency for Amoxicillin is typically 3 times/day. Please confirm if ${frequency} times/day is intended.`;
      }
      break;

    case 'azithromycin':
      if (age >= 13) { // Adults
        if (dosage !== 500) return `⚠️ The entered dosage (${dosage} mg) for Azithromycin is incorrect for an adult. Recommended: 500 mg once daily.`;
        if (frequency !== 1) return `⚠️ The frequency for Azithromycin is incorrect. Recommended: once daily.`;
      } else { // Children < 13
        return `⚠️ Cannot validate Azithromycin dosage for children without patient weight. Standard is 10 mg/kg once daily. Please verify manually.`;
      }
      break;

    default:
      // For unknown medicines
      return '⚠️ No standard dosage information found for this medicine. Please verify manually.';
  }

  // If all checks pass for the known medicines
  return '✅ Prescription validated successfully!';
};