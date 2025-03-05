import React from 'react';

const InstallmentForm = ({
  recommendedAmount,
  setRecommendedAmount,
  installmentCount,
  setInstallmentCount
}) => (
  <div className="space-y-4">
    <div className="w-full max-w-md">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Recommended Amount
      </label>
      <input
        type="number"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        value={recommendedAmount}
        onChange={(e) => setRecommendedAmount(e.target.value)}
        placeholder="Enter amount"
        required
      />
    </div>
    <div className="w-full max-w-md">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Installment Count
      </label>
      <select
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        value={installmentCount}
        onChange={(e) => setInstallmentCount(e.target.value)}
        required
      >
        <option value="">Select a count</option>
        {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default InstallmentForm;