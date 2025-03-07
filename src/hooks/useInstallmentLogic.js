// useInstallmentLogic.js
import { useState, useEffect } from 'react';
import { calculateInstallments as calcInstallments } from './installments/calculateInstallments';
import { mergeInstallments as merge, unmergeInstallments as unmerge } from './installments/mergeInstallments';
import { splitInstallment, revertSplit as revertSplitHelper } from './installments/splitInstallments';
import { handleDateChange as handleDateChangeHandler, validateDate as validateDateHandler } from './installments/dateHandlers';

const useInstallmentLogic = () => {
  const [recommendedAmount, setRecommendedAmount] = useState('');
  const [installmentCount, setInstallmentCount] = useState('');
  const [selectedInstallments, setSelectedInstallments] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [dueDates, setDueDates] = useState([]);
  const [mergedRows, setMergedRows] = useState({});
  const [splitRows, setSplitRows] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    const { installments: newInstallments, newDueDates } = calcInstallments(
      recommendedAmount,
      installmentCount,
      dueDates
    );
    setInstallments(newInstallments);
    setDueDates(newDueDates);
  }, [recommendedAmount, installmentCount]);

  const mergeInstallments = () => {
    const result = merge(selectedInstallments, installments, dueDates);
    if (result.error) return;
    setMergedRows(prev => ({
      ...prev,
      [result.mergedData.mergedKey]: {
        indexes: result.mergedData.indexes,
        originalInstallments: result.mergedData.originalInstallments,
        originalDueDates: result.mergedData.originalDueDates
      }
    }));
    setInstallments(result.newInstallments);
    setDueDates(result.newDueDates);
    setSelectedInstallments([]);
  };

  const unmergeInstallments = (mergedKey) => {
    const result = unmerge(mergedKey, mergedRows, installments, dueDates);
    setInstallments(result.newInstallments);
    setDueDates(result.newDueDates);
    setMergedRows(prev => {
      const newMerged = { ...prev };
      delete newMerged[mergedKey];
      return newMerged;
    });
  };

  const splitInstallments = () => {
    const result = splitInstallment(selectedInstallments, installments);
    if (result.error) return;
    setInstallments(result.newInstallments);
    setSplitRows(prev => ({
      ...prev,
      [result.splitData.original.installmentNo]: result.splitData
    }));
    setSelectedInstallments([]);
  };

  const revertSplit = (originalKey) => {
    const result = revertSplitHelper(originalKey, splitRows, installments);
    if (result.error) return;
    setInstallments(result.newInstallments);
    setSplitRows(prev => {
      const newSplit = { ...prev };
      delete newSplit[originalKey];
      return newSplit;
    });
  };

  const handleDateChange = (index, date) => {
    const { newDueDates, updatedSelectedDates } = handleDateChangeHandler(index, date, dueDates, selectedDates);
    setDueDates(newDueDates);
    setSelectedDates(updatedSelectedDates);
  };

  const validateDate = (date, index) => {
    return validateDateHandler(date, index, dueDates, selectedDates);
  };

  return {
    recommendedAmount,
    setRecommendedAmount,
    installmentCount,
    setInstallmentCount,
    selectedInstallments,
    setSelectedInstallments,
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
    selectedDates
  };
};

export default useInstallmentLogic;
