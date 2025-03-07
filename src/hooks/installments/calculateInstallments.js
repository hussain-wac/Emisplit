// calculateInstallments.js
export const calculateInstallments = (recommendedAmount, installmentCount, dueDates) => {
    const amount = parseFloat(recommendedAmount);
    const count = parseInt(installmentCount, 10);
  
    if (!isNaN(amount) && !isNaN(count) && count > 0) {
      const installmentAmount = amount / count;
      const installments = [...Array(count)].map((_, index) => ({
        installmentNo: index + 1,
        amount: installmentAmount.toFixed(2),
        isMerged: false,
        isSplit: false,
        originalKey: null,
        dueDate: dueDates[index]
        
      }));
      const newDueDates = [...Array(count)].fill(null);
      return { installments, newDueDates };
    }
    return { installments: [], newDueDates: [] };
  };
  