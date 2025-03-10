// InstallmentTable.js
import React from "react";

function InstallmentTable({
  installments,
  setInstallments,
  onSelectInstallment,
  onUnmergeInstallment,
  handleUnsplitInstallment,
}) {
  const handleDateChange = (index, event) => {
    const updatedInstallments = [...installments];
    updatedInstallments[index].dueDate = event.target.value;
    setInstallments(updatedInstallments);
  };

  // Sort installments by their installment number or ID
  const sortedInstallments = [...installments].sort((a, b) => {
    const numA = a.installmentNumber.includes(".")
      ? parseFloat(a.installmentNumber)
      : parseInt(a.installmentNumber);
    const numB = b.installmentNumber.includes(".")
      ? parseFloat(b.installmentNumber)
      : parseInt(b.installmentNumber);
    return numA - numB;
  });

  return (
    <div className="mt-6 p-4 border rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Installment Breakdown</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Select</th>
            <th className="border border-gray-300 p-2">Installment #</th>
            <th className="border border-gray-300 p-2">Amount</th>
            <th className="border border-gray-300 p-2">Due Date</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedInstallments
            .filter((installment) => installment.show)
            .map((installment, index) => (
              <tr key={installment.id} className="text-center">
                <td className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={installment.selected || false}
                    onChange={() => onSelectInstallment(installment.id)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  {installment.installmentNumber}
                </td>
                <td className="border border-gray-300 p-2">
                  ₹{installment.amount.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="date"
                    value={installment.dueDate}
                    onChange={(event) => handleDateChange(index, event)}
                    className="border rounded p-1"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  {/* If the installment is a merged installment (assumed to have '+' in number) */}
                  {installment.installmentNumber.includes("+") && (
                    <button
                      onClick={() => onUnmergeInstallment(installment.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Unmerge
                    </button>
                  )}

                  {/* If the installment is a split installment (has a dot) */}
                  {installment.installmentNumber.includes(".") && (
                    <button
                      onClick={() => handleUnsplitInstallment(installment.id)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2"
                    >
                      Unsplit
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default InstallmentTable;