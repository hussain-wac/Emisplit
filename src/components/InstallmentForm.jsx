import React from "react";
import { Form, useFormState } from "informed";
import InputField from "./InputField";
import SelectField from "./SelectField";

function InstallmentForm({ setInstallments }) {
  const formState = useFormState();

  const handleChange = ({values}) => {
    
    console.log(values)
    if (values.loanAmount && values.tenure) {
      const { loanAmount, tenure } = values;
      const installmentAmount = (loanAmount / tenure).toFixed(2);

      const newInstallments = Array.from({ length: tenure }, (_, index) => ({
        id: index + 1,
        installmentNumber: (index + 1).toString(),
        amount: parseFloat(installmentAmount),
        dueDate: "",
        selected: false,
        show: true,
      }));

      setInstallments(newInstallments);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Installment Form</h2>
      <Form onChange={handleChange}>
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
      </Form>
    </div>
  );
}

export default InstallmentForm;
