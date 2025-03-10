import React from "react";
import { useField } from "informed";

const SelectField = ({ field }) => {
  const { id, label, required, options } = field;
  const {
    fieldState: { value, error },
    fieldApi: { setValue },
    ref,
  } = useField({
    name: id,
    validateOn: "change",
  });

  return (
    <div className="space-y-3 mt-4">
      <label className="block text-sm font-semibold text-gray-700" htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={id}
        ref={ref}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        className="block w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
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
