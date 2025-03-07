import { useState, useEffect } from 'react';
import { calculateInstallments as calcInstallments } from './installments/calculateInstallments';
import { mergeInstallments as merge, unmergeInstallments as unmerge } from './installments/mergeInstallments';
import { splitInstallment, revertSplit as revertSplitHelper } from './installments/splitInstallments';
import { handleDateChange as handleDateChangeHandler, validateDate as validateDateHandler } from './installments/dateHandlers';

const useInstallmentLogic = () => {
  const [installmentData, setInstallmentData] = useState({
    recommendedAmount: '',
    installmentCount: '',
    selectedInstallments: [],
    installments: [],
    dueDates: [],
    mergedRows: {},
    splitRows: {},
    selectedDates: [],
  });

  const {
    recommendedAmount,
    installmentCount,
    selectedInstallments,
    installments,
    dueDates,
    mergedRows,
    splitRows,
    selectedDates,
  } = installmentData;

  useEffect(() => {
    if (recommendedAmount && installmentCount) {
      const { installments: newInstallments, newDueDates } = calcInstallments(
        recommendedAmount,
        installmentCount,
        dueDates
      );
      setInstallmentData(prevData => ({
        ...prevData,
        installments: newInstallments,
        dueDates: newDueDates,
        selectedDates: newDueDates.map(() => null),
        selectedInstallments: [],
   
      }));

  
    }
  }, [recommendedAmount, installmentCount]);

  const mergeInstallments = () => {
    const result = merge(selectedInstallments, installments, dueDates);
    if (result.error) return;
    setInstallmentData(prevData => ({
      ...prevData,
      mergedRows: {
        ...prevData.mergedRows,
        [result.mergedData.mergedKey]: {
          indexes: result.mergedData.indexes,
          originalInstallments: result.mergedData.originalInstallments,
          originalDueDates: result.mergedData.originalDueDates,
        },
      },
      installments: result.newInstallments,
      dueDates: result.newDueDates,
      selectedInstallments: [],
    }));
  };

  const unmergeInstallments = (mergedKey) => {
    const result = unmerge(mergedKey, mergedRows, installments, dueDates);
    setInstallmentData(prevData => ({
      ...prevData,
      installments: result.newInstallments,
      dueDates: result.newDueDates,
      mergedRows: {
        ...prevData.mergedRows,
        [mergedKey]: undefined,
      },
    }));
  };

  const splitInstallments = () => {
    const result = splitInstallment(selectedInstallments, installments, dueDates);
    if (result.error) return;
    setInstallmentData(prevData => ({
      ...prevData,
      installments: result.newInstallments,
      dueDates: result.newDueDates,
      splitRows: {
        ...prevData.splitRows,
        [result.splitData.original.installmentNo]: result.splitData,
      },
      selectedInstallments: [],
    }));
  };

  const revertSplit = (originalKey) => {
    const result = revertSplitHelper(originalKey, splitRows, installments, dueDates);
    if (result.error) return;
    setInstallmentData(prevData => ({
      ...prevData,
      installments: result.newInstallments,
      dueDates: result.newDueDates,
      splitRows: {
        ...prevData.splitRows,
        [originalKey]: undefined,
      },
    }));
  };

  const handleDateChange = (index, date) => {
    const { newDueDates, updatedSelectedDates } = handleDateChangeHandler(
      index,
      date,
      dueDates,
      selectedDates
    );
    setInstallmentData(prevData => ({
      ...prevData,
      dueDates: newDueDates,
      selectedDates: updatedSelectedDates,
    }));
  };

  const validateDate = (date, index) => {
    return validateDateHandler(date, index, dueDates, selectedDates);
  };

  return {
    recommendedAmount,
    setRecommendedAmount: (value) => setInstallmentData(prevData => ({ ...prevData, recommendedAmount: value })),
    installmentCount,
    setInstallmentCount: (value) => setInstallmentData(prevData => ({ ...prevData, installmentCount: value })),
    selectedInstallments,
    setSelectedInstallments: (value) => setInstallmentData(prevData => ({ ...prevData, selectedInstallments: value })),
    installments,
    dueDates,
    mergedRows,
    splitRows,
    mergeInstallments,
    unmergeInstallments,
    handleDateChange,
    splitInstallments,
    revertSplit,
    validateDate,
    selectedDates,
  };
};

export default useInstallmentLogic;
