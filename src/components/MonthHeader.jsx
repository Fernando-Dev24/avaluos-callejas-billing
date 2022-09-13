import React, { useState, useEffect, useCallback } from 'react';
/* helpers */
import { getSpanishMonth } from '../helpers/getSpanishMonth';
import { formatPrice } from '../helpers/formatPrice';
import { useNavigate } from 'react-router-dom';
/* assets */
import { FiArrowLeft } from 'react-icons/fi';

export const MonthHeader = ({ date: { year, month }, data }) => {
   /* hooks */
   const navigate = useNavigate();

   /* states */
   const [monthTotal, setMonthTotal] = useState(0);
   
   /* functions */
   const handleBack = () => {
      navigate("/", { replace: true, });
   };

   const calculateTotal = useCallback(() => {
      // DONE: We need to loop on every item, that is day actually, to access its incomes and sum the entry: totalSales
      let sum = 0;
      data.forEach((day) => {
         // Desestructuring for easy access
         const { outcomes: { totalEgresos } } = day;
         sum += Number(totalEgresos);
      });

      // Set the new total in month
      setMonthTotal(sum);
   }, []);

   useEffect(() => {
      calculateTotal();
   }, []);

   return (
      <header className='header-wrapper'>
         <nav className='header-nav container'>
            <button onClick={ handleBack } className='btn btn-back'>
               <FiArrowLeft className='btn-icon' />
               Volver
            </button>
            <h2>Total Capital en { getSpanishMonth(month) }: { formatPrice(monthTotal) }</h2>
            <p>Registros de { getSpanishMonth(month) }, { year }</p>
         </nav>
      </header>
   );
};