export const addIncome = (incomes, type, price) => {
   let newIncomes = {};
   
   switch(type) {
      case 'OTROS INGRESOS':
         newIncomes = { ...incomes, otherIncomes: Number(price) };
      break;
      case 'DURAZNOS EFECTIVO':
         newIncomes = { ...incomes, totalDuraznosContado: Number(price) };
      break;
      case 'DURAZNOS CHEQUES':
         newIncomes = { ...incomes, totalDuraznosCheques: Number(price) };
      break;
      case 'SALDO ANTERIOR EFECTIVO':
         newIncomes = { ...incomes, anteriorEfectivo: Number(price) };
      break;
      case 'SALDO ANTERIOR CHEQUES':
         newIncomes = { ...incomes, anteriorCheques: Number(price) };
      break;
      default:
         break;
   };

   return newIncomes;
};