import React from "react";
import InstallmentForm from "./InstallmentForm";
import InstallmentTable from "./InstallmentTable";
import { useEmi } from "../hooks/useEmi";
import { useMerge } from "../hooks/useMerge";
import { useSplit } from "../hooks/useSplit";

function EmiForm() {
  const {
    installments,
    setInstallments,
    handleFormSubmit,
    handleSelectInstallment,
  } = useEmi();
  const { handleMergeInstallments, handleUnmergeInstallment } = useMerge(
    installments,
    setInstallments
  );
  const { handleSplitInstallment, handleUnsplitInstallment } = useSplit(
    installments,
    setInstallments
  );

  const selectedInstallments = installments.filter(
    (inst) => inst.selected === true
  );

  return (
    <div className="p-4">
      <InstallmentForm setInstallments={setInstallments} /> {/* onChange triggers onSubmit here */}
      {installments.length > 0 && (
        <InstallmentTable
          installments={installments}
          setInstallments={setInstallments}
          onSelectInstallment={handleSelectInstallment}
          onUnmergeInstallment={handleUnmergeInstallment}
          handleSplitInstallment={handleSplitInstallment}
          handleUnsplitInstallment={handleUnsplitInstallment}
        />
      )}

      <div className="mt-4 text-center">
        <button
          onClick={handleMergeInstallments}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Merge Selected Installments
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            if (selectedInstallments.length !== 1) {
              alert("Please select exactly one installment to split.");
              return;
            }
            handleSplitInstallment(selectedInstallments[0].id);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Split Selected Installment
        </button>
      </div>
    </div>
  );
}

export default EmiForm;
