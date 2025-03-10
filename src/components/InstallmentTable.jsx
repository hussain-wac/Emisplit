import React from "react";
import { useInstallmentTableLogic } from "../hooks/useInstallmentTableLogic";
import { Calendar, Scissors, Layers, Check, ArrowUpDown } from "lucide-react";

function InstallmentTable({
  installments,
  setInstallments,
  onSelectInstallment,
  onUnmergeInstallment,
  handleUnsplitInstallment,
}) {
  const { sortedInstallments, handleDateChange, getMinMaxDate, dateError } =
    useInstallmentTableLogic(installments, setInstallments);

  return (
    <div className="mt-6 p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Layers className="mr-2 text-indigo-600" size={20} />
          Installment Breakdown
        </h2>
        <div className="text-sm text-gray-500">
          {sortedInstallments.filter((i) => i.show).length} installments
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Check size={16} className="mr-1 text-gray-400" />
                  Select
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <ArrowUpDown size={16} className="mr-1 text-gray-400" />
                  Installment #
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1 text-gray-400" />
                  Due Date
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedInstallments
              .filter((installment) => installment.show)
              .map((installment, index) => {
                const { minDate, maxDate } = getMinMaxDate(index);
                return (
                  <tr
                    key={installment.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      installment.selected ? "bg-indigo-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={installment.selected || false}
                          onChange={() => onSelectInstallment(installment.id)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-sm font-medium bg-gray-100 rounded-full">
                        {installment.installmentNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{installment.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          value={installment.dueDate}
                          onChange={(event) => handleDateChange(index, event)}
                          min={minDate} // Set min date
                          max={maxDate} // Set max date
                          className="pl-10 border border-gray-300 bg-white rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {dateError[index] && (
                          <div className="text-xs text-red-500 mt-1">
                            {dateError[index]}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {installment.installmentNumber.includes("+") && (
                          <button
                            onClick={() => onUnmergeInstallment(installment.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-rose-500 text-white text-xs rounded-md hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                          >
                            <Scissors size={14} className="mr-1" />
                            Unmerge
                          </button>
                        )}
                        {installment.installmentNumber.includes(".") && (
                          <button
                            onClick={() =>
                              handleUnsplitInstallment(installment.id)
                            }
                            className="inline-flex items-center px-3 py-1.5 bg-amber-500 text-white text-xs rounded-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                          >
                            <Layers size={14} className="mr-1" />
                            Unsplit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {sortedInstallments.filter((i) => i.show).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No installments available
        </div>
      )}
    </div>
  );
}

export default InstallmentTable;
