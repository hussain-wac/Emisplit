import { useState } from 'react';

export const useEmi = () => {
  const [installments, setInstallments] = useState([]);

  const handleChange = ({values}) => {
    
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

  const handleSelectInstallment = (id) => {
    const updatedInstallments = installments.map((inst) =>
      inst.id === id ? { ...inst, selected: !inst.selected } : inst
    );
    setInstallments(updatedInstallments);
  };
  console.log(installments)
  return {
    installments,
    handleChange,
    setInstallments,
    handleSelectInstallment,
  };
};
