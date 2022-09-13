/* firebase */
import { db } from '../firebase/firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';

const enterpriseTotals = async ( data, date ) => {
   let allDaysBills = [];
   const { year, month } = date;

   // Get bills and combine them into allDaysBills array
   data.forEach(({ bills }) => {
      allDaysBills = allDaysBills.concat(bills);
   });

   // Loop on every bill inside allDaysBills to get how many valuos are and taller jobs.
   let valuosMatriz = 0;
   let recuperados = 0;
   let diagnosticos = 0;
   let valuosSm = 0;
   let tallerMatriz = 0;
   let tallerSm = 0;

   allDaysBills.forEach(({ ref }) => {
      switch( ref ) {
         case 'RECUPERADO':
            recuperados += 1;
         break;
         case 'CONSIGNA':
            recuperados += 1;
         break;
         case 'DOMICILIO RECUPERADO':
            recuperados += 1;
         break;
         case 'DIAGNÓSTICO MECÁNICO':
            diagnosticos += 1;
         break;
         case 'SM VALUOS':
            valuosSm += 1;
         break;
         case 'TALLER CASA MATRIZ':
            tallerMatriz += 1;
         break;
         case 'SM TALLER':
            tallerSm += 1;
         break;
         default:
            valuosMatriz += 1;
         break;
      };
   });

   // Now, we need to calculate the category totals
   let contadoMatriz = 0;
   let contadoSm = 0;
   let chequesMatriz = 0;
   let chequesSm = 0;
   let transfMatriz = 0;
   let transfSm = 0;
   let tarjeta = 0;
   let pendienteSm = 0;
   let pendienteMatriz = 0;
   let monthIncomes = 0;

   allDaysBills.forEach((bill) => {
      switch( bill.ref ) {
         case 'SM VALUOS':
            contadoSm += bill.contado;
            chequesSm += bill.cheque;
            transfSm += bill.linea;
            pendienteSm += bill.creditoPendiente;
         break;
         case 'SM TALLER':
            contadoSm += bill.contado;
            chequesSm += bill.cheque;
            transfSm += bill.linea;
            pendienteSm += bill.creditoPendiente;
         break;
         default:
            contadoMatriz += bill.contado;
            chequesMatriz += bill.cheque;
            transfMatriz += bill.linea;
            tarjeta += bill.pos;
            pendienteMatriz += bill.creditoPendiente;
         break;
      };
   });

   // Calculate the monthIncomes
   monthIncomes = contadoMatriz + contadoSm + chequesMatriz + chequesSm + transfMatriz + transfSm + tarjeta;

   // We need to calculate the outcomes from every month's day
   let totalEgresos = 0;
   let egresosBancoEfectivo = 0;
   let egresosBancoCheques = 0;
   let efectivo = 0;
   let cheques = 0;
   let total = 0;
   let outcomesArr = [];

   data.forEach(( day ) => {
      const outcomes = day.outcomes;
      totalEgresos += outcomes.totalEgresosEfectivo;
      egresosBancoEfectivo += outcomes.totalEgresosBancoEfectivo;
      egresosBancoCheques += outcomes.totalEgresosBancoCheques;
      efectivo += outcomes.totalEfectivo;
      cheques += outcomes.totalCheques;
      total = efectivo + cheques;

      // Loop on every item from outcomesList and push them to outcomesArr.
      outcomes.outcomesList.forEach((outcome) => {
         outcomesArr.push(outcome);
      });
   });

   // Add a entry on 2022 collection/doc with the totals on month
   const collectionRef = doc(db, 'billing', year);
   await updateDoc(collectionRef, {
      [`total_${month}`]: {
         totalEfectivo: efectivo,
         totalCheques: cheques,
         totalIncomes: monthIncomes,
         totalOutcomes: totalEgresos,
         total: total,
      },
   });

   return {
      billsCounter: {
         valuosMatriz,
         recuperados,
         diagnosticos,
         valuosSm,
         tallerMatriz,
         tallerSm,
      },
      categoryTotals: {
         contadoMatriz,
         contadoSm,
         chequesMatriz,
         chequesSm,
         transfMatriz,
         transfSm,
         tarjeta,
         pendienteSm,
         pendienteMatriz,
         monthIncomes,
      },
      monthOutcomes: {
         totalEgresos,
         egresosBancoEfectivo,
         egresosBancoCheques,
         efectivo,
         cheques,
         total,
         outcomesArr,
      },
   };
};

export { enterpriseTotals };