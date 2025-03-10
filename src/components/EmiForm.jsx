import React, { useState } from "react";
import InstallmentForm from "./InstallmentForm";
import InstallmentTable from "./InstallmentTable";

function EmiForm() {
  const [installments, setInstallments] = useState([]);
  const [selectedInstallments, setSelectedInstallments] = useState([]);

  const handleFormSubmit = ({ values }) => {
    const { loanAmount, tenure } = values;
    const installmentAmount = (loanAmount / tenure).toFixed(2);
    
    const newInstallments = Array.from({ length: tenure }, (_, index) => ({
      id: index + 1, // Unique real ID
      installmentNumber: (index + 1).toString(),
      amount: parseFloat(installmentAmount),
      dueDate: "",
      selected: false,
      show: true, // Controls visibility
    }));

    setInstallments(newInstallments);
    setSelectedInstallments([]);
  };

  const handleSelectInstallment = (id) => {
    const updatedInstallments = installments.map((inst) =>
      inst.id === id ? { ...inst, selected: !inst.selected } : inst
    );
    setInstallments(updatedInstallments);

    const selected = updatedInstallments.filter((inst) => inst.selected);
    setSelectedInstallments(selected);
  };

  const handleMergeInstallments = () => {
    if (selectedInstallments.length < 2) {
      alert("Select at least two installments to merge.");
      return;
    }

    const mergedAmount = selectedInstallments.reduce(
      (total, inst) => total + inst.amount,
      0
    );

    const mergedInstallmentNumber = selectedInstallments
      .map((inst) => inst.installmentNumber)
      .join("+");

    // Store the positions of the original installments
    const mergedPosition = installments.findIndex((inst) => inst.id === selectedInstallments[0].id);

    const maxId = Math.max(...installments.map((inst) => inst.id), 0) + 1;

    const newMergedInstallment = {
      id: maxId,
      installmentNumber: mergedInstallmentNumber,
      amount: mergedAmount,
      dueDate: "",
      selected: false,
      show: true,
      originalData: selectedInstallments.map((inst) => ({
        id: inst.id,
        installmentNumber: inst.installmentNumber,
        amount: inst.amount,
        dueDate: inst.dueDate,
      })),
      mergedPosition, // Store the index position
    };

    const updatedInstallments = installments.map((inst) =>
      selectedInstallments.some((sel) => sel.id === inst.id)
        ? { ...inst, show: false } // Hide merged installments
        : inst
    );

    // Insert the merged installment at the original position of the first installment
    updatedInstallments.splice(mergedPosition, 0, newMergedInstallment);

    setInstallments(updatedInstallments);
    setSelectedInstallments([]);
  };

  const handleUnmergeInstallment = (mergedId) => {
    const mergedInstallment = installments.find((inst) => inst.id === mergedId);
    if (!mergedInstallment || !mergedInstallment.originalData) return;

    // Restore original installments at the same index
    const updatedInstallments = [
      ...installments.slice(0, mergedInstallment.mergedPosition), // Before merged
      ...mergedInstallment.originalData.map((data) => ({
        id: data.id,
        installmentNumber: data.installmentNumber,
        amount: data.amount,
        dueDate: data.dueDate,
        selected: false,
        show: true,
      })),
      ...installments.slice(mergedInstallment.mergedPosition + 1), // After merged
    ];

    setInstallments(updatedInstallments);
  };

  return (
    <div className="p-4">
      <InstallmentForm onSubmit={handleFormSubmit} />
      {installments.length > 0 && (
        <InstallmentTable
          installments={installments}
          setInstallments={setInstallments}
          onSelectInstallment={handleSelectInstallment}
          onUnmergeInstallment={handleUnmergeInstallment}
        />
      )}
      {selectedInstallments.length > 1 && (
        <button
          onClick={handleMergeInstallments}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Merge Selected Installments
        </button>
      )}
    </div>
  );
}

export default EmiForm;
