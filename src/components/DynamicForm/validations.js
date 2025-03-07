export const validateDefaultField = ({ label, required, type ,id }) => (value) => {
  if (required) {
    if (
      (typeof value === "string" && value.trim() === "") ||
      (!value && type !== "checkbox")
    ) {
      return `${label} is required`;
    }
  }

  // Name Validation (Min 2 letters, only alphabets)
  if (id.toLowerCase() === "name" && value) {
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!nameRegex.test(value)) return "Name must be at least 2 letters and contain only alphabets";
  }

  // Email Validation
  if (type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email address";
  }

  // Phone Number Validation (10-15 digits)
  if (type === "tel" && value) {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(value)) return "Invalid phone number";
  }

  // Date of Birth Validation (Should not be a future date)
  if (type === "date" && value) {
    const selectedDate = new Date(value);
    const today = new Date();
    if (selectedDate > today) return "Date of Birth cannot be a future date";
  }

  return undefined;
};

export const validateRadio = ({ label, required }) => (value) => {
  if (required && !value) {
    return `Please select an option for ${label}`;
  }
  return undefined;
};

export const validateCheckboxGroup = ({ label, required }) => (value) => {
  if (required && (!value || value.length === 0)) {
    return `Please select at least one option for ${label}`;
  }
  return undefined;
};

export const validateFile = ({ label, required }) => (value) => {
  if (required && (!value || value.length === 0)) {
    return `${label} is required`;
  }
  return undefined;
};

export const validateSimpleCheckbox = ({ label, required }) => (value) => {
  if (required && !value) {
    return `${label} is required`;
  }
  return undefined;
};
