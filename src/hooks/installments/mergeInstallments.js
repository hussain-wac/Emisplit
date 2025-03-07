// mergeInstallments.js
import { toast } from 'react-toastify';

export const mergeInstallments = (selectedInstallments, installments, dueDates) => {
  if (selectedInstallments.length < 2) {
    toast.error('Please select at least two installments to merge.');
    return { error: 'not enough installments' };
  }

  const sortedIndexes = selectedInstallments.sort((a, b) => a - b);
  const areConsecutive = sortedIndexes.every((value, index, array) =>
    index === 0 ? true : value === array[index - 1] + 1
  );

  if (!areConsecutive) {
    toast.error('You can only merge consecutive installments.');
    return { error: 'installments are not consecutive' };
  }

  const mergedAmount = selectedInstallments.reduce((sum, index) => {
    return sum + parseFloat(installments[index].amount);
  }, 0).toFixed(2);

  const mergedKey = sortedIndexes.join('-');

  const mergedInstallment = {
    installmentNo: sortedIndexes
      .map(index => installments[index].installmentNo)
      .join(' + '),
    amount: mergedAmount,
    dueDate: dueDates[sortedIndexes[0]]
      ? dueDates[sortedIndexes[0]].toISOString().split('T')[0]
      : 'eg: 01 Jan 20',
    isMerged: true,
    isSplit: false,
    originalKey: null,
    mergedKey: mergedKey
  };

  // Remove the merged installments from the arrays
  const newInstallments = installments.filter(
    (_, index) => !selectedInstallments.includes(index)
  );
  newInstallments.splice(sortedIndexes[0], 0, mergedInstallment);

  const newDueDates = dueDates.filter(
    (_, index) => !selectedInstallments.includes(index)
  );
  newDueDates.splice(sortedIndexes[0], 0, dueDates[sortedIndexes[0]]);

  const mergedData = {
    mergedKey,
    indexes: sortedIndexes,
    originalInstallments: sortedIndexes.map(index => installments[index]),
    originalDueDates: sortedIndexes.map(index => dueDates[index])
  };

  return { newInstallments, newDueDates, mergedData };
};

export const unmergeInstallments = (mergedKey, mergedRows, installments, dueDates) => {
  const { indexes, originalInstallments, originalDueDates } = mergedRows[mergedKey];
  const newInstallments = [...installments];
  const newDueDates = [...dueDates];

  const mergedIndex = indexes[0];
  newInstallments.splice(mergedIndex, 1, ...originalInstallments);
  newDueDates.splice(mergedIndex, 1, ...originalDueDates);

  return { newInstallments, newDueDates };
};
