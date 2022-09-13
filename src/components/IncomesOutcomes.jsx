import React, { useState, useEffect, useCallback } from 'react';
/* helpers */
import { enterpriseTotals } from '../helpers/enterpriseTotals';
import { formatPrice } from '../helpers/formatPrice';

export const IncomesOutcomes = ({ data = [], date = {} }) => {
   /* states */
   const [monthTotals, setMonthTotals] = useState({});

   /* functions */
   const calculateIncomesAndOutcomes = useCallback(() => {
      enterpriseTotals(data,date)
         .then(({ billsCounter, categoryTotals, monthOutcomes }) => {
         setMonthTotals({
            billsCounter,
            categoryTotals,
            monthOutcomes,
         });
      });
   }, []);

   /* Desestructuring for easy to use access */
   const {
      billsCounter = {},
      categoryTotals = {},
      monthOutcomes = {},
   } = monthTotals;

   /* Effect that will calculate all totals on selected month */
   useEffect(() => {
      calculateIncomesAndOutcomes();
   }, []);

   return (
      <section className="incomes-outcomes">
         <section className="bills-counter">
            <article className='counter-item'>
               <p>VALUOS CASA M.</p>
               <p className='counter-gadget'>{ billsCounter?.valuosMatriz }</p>
            </article>
            <article className='counter-item'>
               <p>VALUOS SAN M.</p>
               <p className='counter-gadget'>{ billsCounter?.valuosSm }</p>
            </article>
            <article className='counter-item'>
               <p>RECUPERADOS</p>
               <p className='counter-gadget'>{ billsCounter?.recuperados }</p>
            </article>
            <article className='counter-item'>
               <p>DIAGNOSTICOS</p>
               <p className='counter-gadget'>{ billsCounter?.diagnosticos }</p>
            </article>
            <article className='counter-item'>
               <p>TALLER CASA M.</p>
               <p className='counter-gadget'>{ billsCounter?.tallerMatriz }</p>
            </article>
            <article className='counter-item'>
               <p>TALLER SAN M.</p>
               <p className='counter-gadget'>{ billsCounter?.tallerSm }</p>
            </article>
         </section>

         <section className='incomes-outcomes-wrapper'>
            <section className="data-info">
               <article className="data-item">
                  <p>CONTADO - CASA MATRIZ</p>
                  <p>{ formatPrice(categoryTotals?.contadoMatriz) }</p>
               </article>
               <article className="data-item">
                  <p>CONTADO - SAN MIGUEL</p>
                  <p>{ formatPrice(categoryTotals?.contadoSm) }</p>
               </article>
               <article className="data-item">
                  <p>CHEQUES - CASA MATRIZ</p>
                  <p>{ formatPrice(categoryTotals?.chequesMatriz) }</p>
               </article>
               <article className="data-item">
                  <p>CHEQUES - SAN MIGUEL</p>
                  <p>{ formatPrice(categoryTotals?.chequesSm) }</p>
               </article>
               <article className="data-item">
                  <p>TRANSFERENCIAS - CASA MATRIZ</p>
                  <p>{ formatPrice(categoryTotals?.transfMatriz) }</p>
               </article>
               <article className="data-item">
                  <p>TRANSFERENCIAS - SAN MIGUEL</p>
                  <p>{ formatPrice(categoryTotals?.transfSm) }</p>
               </article>
               <article className="data-item">
                  <p>INGRESOS TARJETA</p>
                  <p>{ formatPrice(categoryTotals?.tarjeta) }</p>
               </article>
               <article className="data-item">
                  <p>CREDITO PENDIENTE - CASA MATRIZ</p>
                  <p>{ formatPrice(categoryTotals?.pendienteMatriz) }</p>
               </article>
               <article className="data-item">
                  <p>CREDITO PENDIENTE - SAN MIGUEL</p>
                  <p>{ formatPrice(categoryTotals?.pendienteSm) }</p>
               </article>
               <article className='data-item total'>
                  <p>INGRESOS DEL MES</p>
                  <p>{ formatPrice(categoryTotals?.monthIncomes) }</p>
               </article>
            </section>
            <section className="data-info">
               <article className="data-item">
                  <p>TOTAL EGRESOS EFECTIVO</p>
                  <p>{ formatPrice(monthOutcomes?.totalEgresos) }</p>
               </article>
               <article className="data-item">
                  <p>TOTAL EGRESOS BANCO EFECTIVO</p>
                  <p>{ formatPrice(monthOutcomes?.egresosBancoEfectivo) }</p>
               </article>
               <article className="data-item">
                  <p>TOTAL EGRESOS BANCO CHEQUES</p>
                  <p>{ formatPrice(monthOutcomes?.egresosBancoCheques) }</p>
               </article>
               <article className="data-item">
                  <p>TOTAL EFECTIVO</p>
                  <p>{ formatPrice(monthOutcomes?.efectivo) }</p>
               </article>
               <article className='data-item'>
                  <p>TOTAL CHEQUES</p>
                  <p>{ formatPrice(monthOutcomes?.cheques) }</p>
               </article>
               <article className='data-item no-visible'>
                  <p>TOTAL CHEQUES</p>
                  <p>$0.00</p>
               </article>
               <article className='data-item no-visible'>
                  <p>TOTAL CHEQUES</p>
                  <p>$0.00</p>
               </article>
               <article className='data-item no-visible'>
                  <p>TOTAL CHEQUES</p>
                  <p>$0.00</p>
               </article>
               <article className='data-item no-visible'>
                  <p>TOTAL CHEQUES</p>
                  <p>$0.00</p>
               </article>
               <article className="data-item total">
                  <p>TOTAL</p>
                  <p>{ formatPrice(monthOutcomes?.total) }</p>
               </article>
            </section>
         </section>

         <section className='outcomes-table'>
            <table className="table-wrapper">
               <thead>
                  <tr className='table-row-header'>
                     <th>TIPO DE SALIDA</th>
                     <th>METODO DE PAGO</th>
                     <th>DESCRIPCION</th>
                     <th>VALOR</th>
                  </tr>
               </thead>
               <tbody>
                  { monthOutcomes?.outcomesArr?.length > 0 ?
                     monthOutcomes.outcomesArr.map((outcome) => (
                        <tr
                           key={ outcome.id }
                           className='table-row-body'>
                           <td>{ outcome.type }</td>
                           <td>{ outcome.payMethod }</td>
                           <td>{ outcome.description === '' ? '-' : outcome.description }</td>
                           <td>{ formatPrice(outcome.price) }</td>
                        </tr>
                     ))
                     :
                     <tr className='table-row-body'>
                        <td colSpan={ 4 }>No hay egresos en este mes</td>
                     </tr>
                  }
               </tbody>
            </table>
         </section>
      </section>
   );
};