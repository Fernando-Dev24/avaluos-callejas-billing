import React, { useState, useEffect, useCallback } from 'react';
/* helpers */
import { calculateYearTotals } from '../helpers/calculateYearTotals';
import { formatPrice } from '../helpers/formatPrice';

export const YearTotal = ({
   totals = {},
   year = new Date().getFullYear(),
   setShowYearTotal = true,
}) => {
   /* states */
   const [totalsYear, setTotalsYear] = useState({});

   /* callBack to avoid useless re-render calculate */
   const handleCalculateYearTotals = useCallback(() => {
      const {
         totalInYear,
         totalEfectivoInYear,
         totalChequesInYear,
         totalIncomesInYear,
         totalOutcomesInYear,
      } = calculateYearTotals(totals);

      // Set this totals on totalsYear state
      setTotalsYear({
         totalInYear,
         totalEfectivoInYear,
         totalChequesInYear,
         totalIncomesInYear,
         totalOutcomesInYear,
      });
   }, []);

   /* Effect that will sum every month total to get a general totals */
   useEffect(() => {
      handleCalculateYearTotals();
   }, []);

   useEffect(() => {
      window.addEventListener('keydown', ({ key }) => {
         key === 'Escape' && setShowYearTotal(false);
      });
      
      return () => {
         window.addEventListener('keydown', ({ key }) => {
            key === 'Escape' && setShowYearTotal(false);
         });
      }
   }, []);

   return (
      <section className='year-total-shadow'>
         <section className="year-total-wrapper">
            <article className="double-column">
               <div className='item'>
                  <p>Efectivo del año { year }</p>
                  <h6>{ formatPrice(totalsYear?.totalEfectivoInYear) }</h6>
               </div>
               <div className='item'>
                  <p>Cheques del año { year }</p>
                  <h6>{ formatPrice(totalsYear?.totalChequesInYear) }</h6>
               </div>
               <div className='item'>
                  <p>Ingresos del año { year }</p>
                  <h6>{ formatPrice(totalsYear?.totalIncomesInYear) }</h6>
               </div>
               <div className='item'>
                  <p>Egresos del año { year }</p>
                  <h6>{ formatPrice(totalsYear?.totalOutcomesInYear) }</h6>
               </div>
               <div className="item two-columns">
                  <p>Total del año { year }</p>
                  <h6>{ formatPrice(totalsYear?.totalInYear) }</h6>
               </div>
            </article>
         </section>
      </section>
   );
};