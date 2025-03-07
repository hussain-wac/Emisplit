import React from 'react';
import InstallmentForm from './InstallmentForm';
import InstallmentTable from './InstallmentTable';
import useInstallmentLogic from '../hooks/useInstallmentLogic';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Merge, Split, Send, FileText } from 'lucide-react';

const EmiForm = () => {
  const {
    recommendedAmount,
    setRecommendedAmount,
    installmentCount,
    setInstallmentCount,
    selectedInstallments,
    setSelectedInstallments,
    installments,
    dueDates,
    handleMergeInstallments,
    handleUnmergeInstallments,
    handleDateChange,
    handleSplitInstallment,
    handleRevertSplit,
    validateDate,
    selectedDates,
  } = useInstallmentLogic();

  // Handle form submission
  const handleSubmit = () => {
    const submissionData = {
      recommendedAmount,
      installmentCount,
      installments: installments.map((installment, index) => ({
        installmentNo: installment.installmentNo,
        amount: installment.amount,
        dueDate: dueDates[index] ? dueDates[index].toISOString().split('T')[0] : null,
        isMerged: installment.isMerged || false,
        isSplit: installment.isSplit || false,
      })),
    };
    console.log('Submitted Data:', submissionData);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <ToastContainer position="top-right" autoClose={5000} />
      <header className="flex items-center mb-8">
        <FileText className="w-8 h-8 mr-3 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Installment Payment Planner</h1>
      </header>

      <InstallmentForm
        recommendedAmount={recommendedAmount}
        setRecommendedAmount={setRecommendedAmount}
        installmentCount={installmentCount}
        setInstallmentCount={setInstallmentCount}
      />

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Installment Details</h2>
      </section>

      <InstallmentTable
        installments={installments}
        dueDates={dueDates}
        selectedInstallments={selectedInstallments}
        setSelectedInstallments={setSelectedInstallments}
        handleUnmergeInstallments={handleUnmergeInstallments}
        handleDateChange={handleDateChange}
        handleSplitInstallment={handleSplitInstallment}
        handleRevertSplit={handleRevertSplit}
        validateDate={validateDate}
        selectedDates={selectedDates}
      />

      <footer className="mt-8 flex justify-end space-x-4">
        <button
          className={`flex items-center px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${
            selectedInstallments.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleMergeInstallments}
          disabled={selectedInstallments.length < 2}
        >
          <Merge className="w-4 h-4 mr-2" />
          Merge Selected
        </button>
        <button
          className={`flex items-center px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors ${
            selectedInstallments.length !== 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSplitInstallment}
          disabled={selectedInstallments.length !== 1}
        >
          <Split className="w-4 h-4 mr-2" />
          Split Selected
        </button>
        <button
          className="flex items-center px-4 py-3 text-sm font-medium text-white bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
          onClick={handleSubmit}
        >
          <Send className="w-4 h-4 mr-2" />
          Submit
        </button>
      </footer>
    </div>
  );
};

export default EmiForm;