import React from 'react';
import useInstallmentLogic from '../hooks/useInstallmentLogic';

const InstallmentTable = () => {
  const {
    installments,
    selectedIndexes,
    toggleSelection,
    handleMerge,
    handleUnmerge,
    handleSplit,
    handleRevertSplit,
  } = useInstallmentLogic();

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={handleMerge}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Merge Selected
        </button>
        <button
          onClick={handleSplit}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Split Selected
        </button>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Select</th>
            <th className="border p-2">Installment #</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Due Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {installments
            .filter((installment) => installment.show)
            .map((installment, index) => (
              <tr
                key={`${installment.insnumber}-${index}`}
                className={selectedIndexes.includes(index) ? 'bg-blue-100' : ''}
              >
                <td className="border p-2">
                  <input
                    type="checkbox"
                    checked={installment.checked}
                    onChange={() => toggleSelection(index)}
                    disabled={installment.isMerged || installment.isSplit}
                  />
                </td>
                <td className="border p-2">{installment.insnumber}</td>
                <td className="border p-2">{installment.amount}</td>
                <td className="border p-2">{installment.duedate || 'No date'}</td>
                <td className="border p-2">
                  {installment.isMerged && (
                    <button
                      onClick={() => handleUnmerge(installment)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Unmerge
                    </button>
                  )}
                  {installment.isSplit && (
                    <button
                      onClick={() => handleRevertSplit(installment.originalInsNumber)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Revert Split
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstallmentTable;