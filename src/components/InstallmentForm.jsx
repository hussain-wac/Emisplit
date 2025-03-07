import React from 'react';
import { DollarSign, Calculator } from 'lucide-react';

const InstallmentForm = ({
  recommendedAmount,
  setRecommendedAmount,
  installmentCount,
  setInstallmentCount
}) => (
  <div className="bg-white p-6 rounded-lg shadow mb-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Recommended Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={recommendedAmount}
            onChange={(e) => setRecommendedAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Installment Count
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calculator className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={installmentCount}
            onChange={(e) => setInstallmentCount(e.target.value)}
            required
          >
            <option value="">Select number of installments</option>
            {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default InstallmentForm;