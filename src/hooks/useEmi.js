import { useState } from 'react';

export const useEmi = () => {
  const [installments, setInstallments] = useState([]);

  const handleFormSubmit = ({ values }) => {
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
    console.log(newInstallments);
  };

  const handleSelectInstallment = (id) => {
    const updatedInstallments = installments.map((inst) =>
      inst.id === id ? { ...inst, selected: !inst.selected } : inst
    );
    setInstallments(updatedInstallments);
    console.log(updatedInstallments)
  };

  return {
    installments,
    setInstallments,
    handleFormSubmit,
    handleSelectInstallment,
  };
};
