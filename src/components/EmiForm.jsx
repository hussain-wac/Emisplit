import React from "react";
import InstallmentForm from "./InstallmentForm";
import InstallmentTable from "./InstallmentTable";
import { useEmi } from "../hooks/useEmi";  // Import the useEmi hook
import { useMerge } from "../hooks/useMerge";  // Import the useMerge hook
import { useSplit } from "../hooks/useSplit";  // Import the useSplit hook

function EmiForm() {
  const { installments, setInstallments, handleFormSubmit, handleSelectInstallment } = useEmi();  // Use the useEmi hook
  const { handleMergeInstallments, handleUnmergeInstallment } = useMerge(installments, setInstallments);  // Use the useMerge hook
  const { handleSplitInstallment, handleUnsplitInstallment } = useSplit(installments, setInstallments);  // Use the useSplit hook

  // Only include installments that are marked as selected
  const selectedInstallments = installments.filter((inst) => inst.selected === true);

  return (
    <div className="p-4">
      <InstallmentForm onSubmit={handleFormSubmit} />
      {installments.length > 0 && (
        <InstallmentTable
          installments={installments}
          setInstallments={setInstallments}
          onSelectInstallment={handleSelectInstallment}
          onUnmergeInstallment={handleUnmergeInstallment}
          handleSplitInstallment={handleSplitInstallment}  // Pass the split handler here
          handleUnsplitInstallment={handleUnsplitInstallment}  // Pass the unsplit handler here
        />
      )}

      {/* Always show the Merge Button */}
      <div className="mt-4 text-center">
        <button
          onClick={handleMergeInstallments}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Merge Selected Installments
        </button>
      </div>

      {/* Always show the Split Button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => handleSplitInstallment(selectedInstallments.length === 1 ? selectedInstallments[0].id : null)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Split Selected Installment
        </button>
      </div>
    </div>
  );
}

export default EmiForm;
