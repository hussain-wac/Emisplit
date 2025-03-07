import React from "react";
import { useField } from "informed";

const SelectField = ({ field, validate }) => {
  const { id, label, options, required } = field;
  const {
    fieldState: { value, error },
    fieldApi: { setValue },
    ref,
  } = useField({
    name: id,
    validate,
    validateOn: "change",
  });

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={id}
        ref={ref}
        value={value || ""}
        onChange={handleChange}
        className="block w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      >
        <option value="">Select...</option>
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default SelectField;
