import React, { useState, useEffect } from 'react';
/* hooks */
import { useParams, useNavigate } from 'react-router-dom';
/* helpers */
import { formatPrice } from '../helpers/formatPrice';
/* assets */
import { FiExternalLink } from 'react-icons/fi';

export const RegisterTable = ({ register }) => {
   /* hooks */
   const { year, month } = useParams();
   const navigate = useNavigate();

   /* props */
   const { bills, incomes, outcomes, day } = register;

   /* states */
   const [totalsOnDay, setTotalsOnDay] = useState({});

   /* handleGo */
   const handleGo = (date) => {
      // DONE: We need three data to go to the day selected, for this we need to convert its day to a understandable language to React router dom and its hooks 
      const day = date.slice(0,1).trim();
      
      // Now just navigate to the selected day and render its values
      navigate(`/register/${ year }/${ month }/${ day }`, { replace: true });
   };

   /* Effect that will calculate how many work had been through day */
   useEffect(() => {
      let refCounted = {
         totalValuos: 0,
         totalRecuperados: 0,
         totalDiagnostico: 0,
      };

      // DONE: Loop on every item to count base on its ref entry
      if( bills.length > 0 ) {
         let valuos = 0;
         let recuperados = 0;
         let diagnostico = 0;

         bills.forEach(({ ref }) => {
            switch( ref ) {
               case 'VALÚO':
                  valuos += 1;
               break;
               case 'RECUPERADO':
                  recuperados += 1;
               break;
               case 'DIAGNÓSTICO MECÁNICO':
                  diagnostico += 1;
               break;
               default:
                  return;
            };
         });

         // Now we need to update refCounted and update totalsOnDay
         refCounted = {
            totalValuos: valuos,
            totalRecuperados: recuperados,
            totalDiagnostico: diagnostico,
         };

         setTotalsOnDay({ ...refCounted });
      } else setTotalsOnDay({ ...refCounted });
   }, []);

   return (
      <>
         <tr className='table-row-body date-row'>
            <td colSpan={9}>
               <div className="date-flex">
                  <div className="date-wrapper">
                     <p>FECHA: <strong>{ day }</strong></p>
                     <button
                        className='btn btn-option'
                        onClick={ () => handleGo(day) }>
                        <FiExternalLink className='btn-icon' />
                     </button>
                  </div>
                  <div className="day-totals">
                     <p>VENTAS DEL DÍA: <strong>
                        { formatPrice(incomes.totalSales) }
                     </strong></p>
                     <p>TOTAL EFECTIVO: <strong>
                        { formatPrice(outcomes.totalEfectivo) }
                     </strong></p>
                     <p>TOTAL CHEQUES: <strong>
                        { formatPrice(outcomes.totalCheques) }
                     </strong></p>
                     <p>TOTAL: <strong>
                        { formatPrice(outcomes.totalEgresos) }
                     </strong></p>
                  </div>
               </div>
            </td>
         </tr>
         { bills.length > 0 &&
            bills.map(({
               id,
               costumer,
               ref,
               state,
               contado,
               cheque,
               pos,
               linea,
               creditoPendiente,
            }, index) => (
               <tr key={ id } className="table-row-body">
                  <td>{ index + 1 }</td>
                  <td>{ costumer }</td>
                  <td>{ ref }</td>
                  <td>{ state }</td>
                  <td>{ formatPrice(contado) }</td>
                  <td>{ formatPrice(cheque) }</td>
                  <td>{ formatPrice(pos) }</td>
                  <td>{ formatPrice(linea) }</td>
                  <td>{ formatPrice(creditoPendiente) }</td>
               </tr>
            ))
         }
         <tr className='table-row-body totals-row'>
            <td colSpan={9}>
               <div className="totals-info">
                  <p>CONTADO: { formatPrice(incomes.totalContado) }</p>
                  <p>CHEQUES: { formatPrice(incomes.totalCheques) }</p>
                  <p>TARJETA: { formatPrice(incomes.totalPos) }</p>
                  <p>LINEA: { formatPrice(incomes.totalLinea) }</p>
                  <p>VALÚOS: { totalsOnDay.totalValuos }</p>
                  <p>RECUPERADOS: { totalsOnDay.totalRecuperados }</p>
                  <p>DIAGNÓSTICO: { totalsOnDay.totalDiagnostico }</p>
               </div>
            </td>
         </tr>
      </>
   );
};