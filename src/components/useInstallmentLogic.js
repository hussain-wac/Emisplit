import { useState, useEffect } from 'react';
import { SplitIcon, ListIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

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
    calculateInstallments();
  }, [recommendedAmount, installmentCount]);

  const calculateInstallments = () => {
    const amount = parseFloat(recommendedAmount);
    const count = parseInt(installmentCount, 10);
    
    if (!isNaN(amount) && !isNaN(count) && count > 0) {
      const installmentAmount = amount / count;
      setInstallments([...Array(count)].map((_, index) => ({
        id: uuidv4(),
        installmentNo: index + 1,
        amount: installmentAmount.toFixed(2),
        isMerged: false,
        isSplit: false,
        originalKey: null
      })).map((installment, index) => ({
        ...installment,
        dueDate: dueDates[index] ? dueDates[index].toISOString().split('T')[0] : 'eg: 01 Jan 20'
      })));
      setDueDates([...Array(count)].fill(null)); // Initialize with null
    }
  };

  const mergeInstallments = () => {
    if (selectedInstallments.length < 2) {
      toast.error('Please select at least two installments to merge.');
      return;
    }

    const sortedIndexes = selectedInstallments.sort((a, b) => a - b);
    const areConsecutive = sortedIndexes.every((value, index, array) => {
      return index === 0 || value === array[index - 1] + 1;
    });

    if (!areConsecutive) {
      toast.error('You can only merge consecutive installments.');
      return;
    }

    const mergedAmount = selectedInstallments.reduce((sum, index) => {
      return sum + parseFloat(installments[index].amount);
    }, 0).toFixed(2);

    const mergedKey = uuidv4();

    setMergedRows(prev => ({
      ...prev,
      [mergedKey]: {
        indexes: sortedIndexes,
        originalInstallments: sortedIndexes.map(index => installments[index]),
        originalDueDates: sortedIndexes.map(index => dueDates[index])
      }
    }));

    const newInstallments = installments.filter((_, index) => !selectedInstallments.includes(index));
    newInstallments.splice(sortedIndexes[0], 0, {
      id: uuidv4(),
      installmentNo: sortedIndexes.map(index => installments[index].installmentNo).join(' + '),
      amount: mergedAmount,
      dueDate: dueDates[sortedIndexes[0]] ? dueDates[sortedIndexes[0]].toISOString().split('T')[0] : 'eg: 01 Jan 20',
      isMerged: true,
      isSplit: false,
      originalKey: null,
      mergedKey: mergedKey
    });

    const newDueDates = dueDates.filter((_, index) => !selectedInstallments.includes(index));
    newDueDates.splice(sortedIndexes[0], 0, dueDates[sortedIndexes[0]]);

    setInstallments(newInstallments);
    setDueDates(newDueDates);
    setSelectedInstallments([]);
  };

  const unmergeInstallments = (mergedKey) => {
    const { indexes, originalInstallments, originalDueDates } = mergedRows[mergedKey];
    const newInstallments = [...installments];
    const newDueDates = [...dueDates];

    const mergedIndex = indexes[0];
    newInstallments.splice(mergedIndex, 1, ...originalInstallments);
    newDueDates.splice(mergedIndex, 1, ...originalDueDates);

    setInstallments(newInstallments);
    setDueDates(newDueDates);
    setMergedRows(prev => {
      const newMergedRows = { ...prev };
      delete newMergedRows[mergedKey];
      return newMergedRows;
    });
  };

  const splitInstallments = () => {
    if (selectedInstallments.length !== 1) {
      toast.error('Please select exactly one installment to split.');
      return;
    }

    selectedInstallments.forEach(index => {
      const installment = installments[index];
      const splitCount = 2;
      const splitAmount = parseFloat(installment.amount) / splitCount;

      const newInstallments = [...installments];
      newInstallments.splice(index, 1, ...Array(splitCount).fill({
        ...installment,
        id: uuidv4(),
        amount: splitAmount.toFixed(2),
        installmentNo: `${installment.installmentNo}.${1}`,
        isSplit: true,
        originalKey: installment.id
      }));

      setInstallments(newInstallments);
      setSplitRows(prev => ({
        ...prev,
        [installment.id]: {
          original: installment,
          splits: newInstallments.slice(index, index + splitCount)
        }
      }));
    });

    setSelectedInstallments([]);
  };

  const revertSplit = (originalKey) => {
    const { original } = splitRows[originalKey];
    const newInstallments = [...installments];
    const splitIndexes = installments.findIndex(installment => installment.originalKey === originalKey);

    newInstallments.splice(splitIndexes, 2, original);
    setInstallments(newInstallments);
    setSplitRows(prev => {
      const newSplitRows = { ...prev };
      delete newSplitRows[originalKey];
      return newSplitRows;
    });
  };

  const handleDateChange = (index, date) => {
    const newDueDates = [...dueDates];
    newDueDates[index] = date;

    if (dueDates[index] === null) {
      const selectedDate = new Date(date);
      for (let i = index + 1; i < newDueDates.length; i++) {
        selectedDate.setMonth(selectedDate.getMonth() + 1);
        newDueDates[i] = new Date(selectedDate);
      }
    }

    setDueDates(newDueDates);

    const updatedSelectedDates = [...selectedDates];
    if (!selectedDates.includes(date.toDateString())) {
      updatedSelectedDates.push(date.toDateString());
      setSelectedDates(updatedSelectedDates);
    }
  };

  const validateDate = (date, index) => {
    const today = new Date();
    const selectedDate = new Date(date);

    if (selectedDate < today) {
      return false;
    }

    if (selectedDates.includes(selectedDate.toDateString())) {
      return false;
    }

    if (index > 0) {
      const previousDate = new Date(dueDates[index - 1]);
      if (selectedDate < previousDate) {
        return false;
      }
    }

    return true;
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
    calculateInstallments,
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