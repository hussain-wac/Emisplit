import { useState } from 'react';

export const useEmi = () => {
  const [installments, setInstallments] = useState([]);

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
    handleSelectInstallment,
  };
};
