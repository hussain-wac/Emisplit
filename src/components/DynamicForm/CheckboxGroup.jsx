import React from "react";
import { useField, useFormState } from "informed";
const CheckboxGroup = ({ field, validate }) => {
  const { id, label, options, required } = field;
  const {
    fieldState: { value, error, dirty },
    fieldApi: { setValue },
    ref,
  } = useField({
    name: id,
    validate,
    validateOn: "change",
  });

  const { submitted } = useFormState();
  const valuesArray = Array.isArray(value) ? value : [];

  const handleChange = (optionValue) => {
    const newValue = valuesArray.includes(optionValue)
      ? valuesArray.filter((v) => v !== optionValue)
      : [...valuesArray, optionValue];
    setValue(newValue);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3">
            <input
              name={id}
              type="checkbox"
              ref={ref}
              checked={valuesArray.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (dirty || submitted) && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
    </div>
  );
};

export default CheckboxGroup;
