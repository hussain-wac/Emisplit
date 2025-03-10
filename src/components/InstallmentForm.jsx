import React from "react";
import { Form } from "informed";
import InputField from "./InputField";
import SelectField from "./SelectField";

function InstallmentForm({ onSubmit }) {
  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Installment Form</h2>
      <Form onSubmit={onSubmit}>
        <InputField
          field={{
            id: "loanAmount",
            label: "Loan Amount",
            type: "number",
            placeholder: "Enter the loan amount",
            required: true,
          }}
        />
        
        <SelectField
          field={{
            id: "tenure",
            label: "Select Tenure (Months)",
            required: true,
            options: [...Array(10)].map((_, index) => ({
              value: index + 3,
              label: index + 3,
            })),
          }}
        />
        
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}

export default InstallmentForm;
