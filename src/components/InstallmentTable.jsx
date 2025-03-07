import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SplitIcon, ListIcon } from 'lucide-react';

const InstallmentTable = ({
  installments,
  dueDates,
  selectedInstallments,
  setSelectedInstallments,
  unmergeInstallments,
  handleDateChange,
  splitInstallments,
  revertSplit,
  validateDate,
  selectedDates
}) => (
  <table className="w-full text-sm text-left text-gray-900">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th className="p-3">#</th>
        <th className="p-3">Installment Number</th>
        <th className="p-3">Amount</th>
        <th className="p-3">Due Date</th>
        <th className="p-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {installments.map((installment, index) => (
        <tr key={`${installment.id}-${index}`} className="bg-white border-b hover:bg-gray-50">
          <td className="p-3">
            <input
              type="checkbox"
              checked={selectedInstallments.includes(index)}
              onChange={(e) => {
                let newSelected = [...selectedInstallments];
                if (e.target.checked) {
                  newSelected.push(index);
                } else {
                  newSelected = newSelected.filter(i => i !== index);
                }
                setSelectedInstallments(newSelected);
              }}
              disabled={installment.isMerged || installment.isSplit || !dueDates[index]}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
          </td>
          <td className="p-3">{installment.installmentNo}</td>
          <td className="p-3">₹{installment.amount}</td>
          <td className="p-3">
            <DatePicker
              selected={dueDates[index] || null}
              onChange={(date) => handleDateChange(index, date)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              minDate={new Date()}
              shouldCloseOnSelect={false}
              filterDate={(date) => validateDate(date, index)}
              excludeDates={selectedDates
                .filter(dateStr => dateStr)
                .map(dateStr => new Date(dateStr))
              }
            />
          </td>
          <td className="p-3">
            {installment.isMerged && (
              <button 
                className="flex items-center p-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                onClick={() => unmergeInstallments(installment.mergedKey)}
              >
                <SplitIcon className="w-4 h-4 mr-2" />
                Unmerge
              </button>
            )}
            {installment.isSplit && (
              <button
                className="flex items-center p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                onClick={() => revertSplit(installment.originalKey)}
              >
                <ListIcon className="w-4 h-4 mr-2" />
                Revert Split
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default InstallmentTable;
