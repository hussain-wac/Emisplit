import React from "react";
import InstallmentForm from "./InstallmentForm";
import InstallmentTable from "./InstallmentTable";
import { useEmi } from "../hooks/useEmi";
import { useMerge } from "../hooks/useMerge";
import { useSplit } from "../hooks/useSplit";
import { Layers, Scissors, AlertTriangle } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';

function EmiForm() {
  const {
    installments,
    setInstallments,
    handleChange,
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

  const handleSplitClick = () => {
    if (selectedInstallments.length !== 1) {
      const alertDiv = document.createElement("div");
      alertDiv.className =
        "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";
      alertDiv.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
          <div class="flex items-center text-amber-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="font-semibold text-lg">Please Note</h3>
          </div>
          <p class="text-gray-700 mb-4">Please select exactly one installment to split.</p>
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full">Okay</button>
        </div>
      `;
      document.body.appendChild(alertDiv);
      alertDiv.querySelector("button").addEventListener("click", () => {
        document.body.removeChild(alertDiv);
      });
      return;
    }
    handleSplitInstallment(selectedInstallments[0].id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        EMI Calculator & Manager
      </h1>
      <ToastContainer />

      <InstallmentForm handleChange={handleChange} />

      {installments.length > 0 && (
        <>
          <InstallmentTable
            installments={installments}
            setInstallments={setInstallments}
            onSelectInstallment={handleSelectInstallment}
            onUnmergeInstallment={handleUnmergeInstallment}
            handleSplitInstallment={handleSplitInstallment}
            handleUnsplitInstallment={handleUnsplitInstallment}
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleMergeInstallments}
              disabled={selectedInstallments.length < 2}
              className={`flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium transition-colors shadow-sm
                ${
                  selectedInstallments.length < 2
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                }`}
            >
              <Layers size={18} className="mr-2" />
              Merge Selected Installments
              {selectedInstallments.length > 1 && (
                <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                  {selectedInstallments.length}
                </span>
              )}
            </button>

            <button
              onClick={handleSplitClick}
              disabled={selectedInstallments.length !== 1}
              className={`flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium transition-colors shadow-sm
                ${
                  selectedInstallments.length !== 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
            >
              <Scissors size={18} className="mr-2" />
              Split Selected Installment
            </button>
          </div>

          {selectedInstallments.length === 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center text-amber-700 text-sm">
              <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
              <span>Select one or more installments to perform actions</span>
            </div>
          )}
        </>
      )}

      {installments.length === 0 && (
        <div className="mt-8 p-8 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          <Layers size={36} className="mx-auto mb-2 text-gray-400" />
          <p>Enter details above to calculate EMI installments</p>
        </div>
      )}
    </div>
  );
}

export default EmiForm;
