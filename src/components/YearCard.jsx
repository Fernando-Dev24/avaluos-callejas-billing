import React, { useState } from 'react';
/* components */
import { YearTotal } from './YearTotal';
/* assets */
import { FiInfo, FiArrowRight } from 'react-icons/fi';

export const YearCard = ({
   year,
   setShowMonthModal,
   targetDate,
   setTargetDate,
}) => {
   /* states */
   const [showYearTotal, setShowYearTotal] = useState(false);

   /* functions */
   const handleViewTotals = () => {
      setShowYearTotal(true);
   };

   const handleSelectMonth = (id) => {
      setTargetDate({ ...targetDate, year: id });
      setShowMonthModal(true);
   };

   return (
      <>
         <article
            className='year-card'>
            <span>Registro de año</span>
            <h2>{ year.id }</h2>
            <button
               className='btn-go'
               onClick={ () => handleSelectMonth(year.id) }>
               <FiArrowRight className='btn-icon' />
            </button>
            <button
               className='btn-year'
               onClick={ handleViewTotals }>
               <FiInfo className='btn-icon' />
            </button>
         </article>

         { showYearTotal &&
            <YearTotal
               totals={ year?.yearData }
               year={ year?.id }
               setShowYearTotal={ setShowYearTotal }
            />
         }
      </>
   );
};