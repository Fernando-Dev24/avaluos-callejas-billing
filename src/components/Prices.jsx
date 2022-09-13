import React, { useState, useCallback, useEffect } from 'react';
/* hooks */
import { useNewBill } from '../contexts/NewBillContext';
/* helpers */
import { formatPrice } from '../helpers/formatPrice';
import { calculateBillTotals, calculateCffTotals } from '../helpers/totals';
/* components */
import { PriceModal } from './PriceModal';
/* assets */
import { FiEdit2, FiTrash } from 'react-icons/fi';

export const Prices = ({ setAlertState, setAlertContent }) => {
   /* hooks */
   const {
      newBill: {
         billPrices,
         billType,
         sumPrices,
         iva,
         total,
         totalSalesNotSubjects,
         totalExemptSales,
      },
      newBill,
      setNewBill
   } = useNewBill();

   /* states */
   const [showPriceModal, setShowPriceModal] = useState(false);
   const [isEdit, setIsEdit] = useState({ state: false, content: undefined });

   /* handleEditPrice */
   const handleEditPrice = (id) => {
      // Filter the target price according to id value
      const [ targetElement ] = billPrices.filter(({ id:priceId }) => priceId === id);
      setIsEdit({ state: true, content: targetElement });
   };

   /* handleDeletePrice */
   const handleDeletePrice = (id) => {
      // Filter the other price unless the targetPrice according to id
      const restOfPrices = billPrices.filter(({ id:priceId }) => priceId !== id );
      setNewBill({ ...newBill, billPrices: restOfPrices });
   };

   /* useCallback will execute handleCalculateTotal */
   const handleCalculateTotal = useCallback(() => {
      // We are going to evaluate which type of bill user is
      if( billType === 'FACTURA' ) {
         calculateBillTotals(newBill, setNewBill);
      } else if( billType === 'CCF' ) {
         calculateCffTotals(newBill, setNewBill);
      };
   }, [billPrices, billType]);

   /* Effect that will calculate bill totals according to its prices or expenses */
   useEffect(() => {
      handleCalculateTotal();
   }, [billPrices, billType]);
   
   return (
      <>
         <section className='prices'>
            <header className="prices-header">
               <h3>Agregar costo</h3>
               <p>Para agregar un costo, presiona el botón "Agregar costo"</p>
               <button
                  className='btn btn-add'
                  onClick={ (e) => {
                     e.preventDefault();
                     setShowPriceModal(true);
                  } }>
                  Agregar costo
               </button>
            </header>
            <table className='prices-table'>
               <thead>
                  <tr className='table-row-header'>
                     <th>Cantidad</th>
                     <th>Descripción</th>
                     <th>Precio Unitario</th>
                     <th>Ventas no sujetas</th>
                     <th>Ventas exentas</th>
                     <th>Ventas afectas</th>
                     <th>Editar</th>
                     <th>Eliminar</th>
                  </tr>
               </thead>
               <tbody>
                  { billPrices.length > 0 &&
                     billPrices.map(({
                        amount,
                        description,
                        unitPrice,
                        salesNotSubjects,
                        exemptSales,
                        affectedSales,
                        id
                     }) => (
                        <tr key={ id } className="table-row-body">
                           <td>{ amount }</td>
                           <td>{ description }</td>
                           <td>{ formatPrice(unitPrice) }</td>
                           <td>{ formatPrice(salesNotSubjects) }</td>
                           <td>{ formatPrice(exemptSales) }</td>
                           <td>{ formatPrice(affectedSales) }</td>
                           <td>
                              <FiEdit2
                                 className='btn-table-option'
                                 onClick={ () => handleEditPrice(id) }
                              />
                           </td>
                           <td>
                              <FiTrash 
                                 className='btn-table-option'
                                 onClick={ () => handleDeletePrice(id) }
                              />
                           </td>
                        </tr>
                     ))
                  }
               </tbody>
            </table>
            <section className='total-prices'>
               <p>SUMAS: { formatPrice(sumPrices) }</p>
               { billType === 'CCF' &&
                  <>
                     <p>13% de IVA: { formatPrice(iva) }</p>
                     <p>SUB-TOTAL: { formatPrice(sumPrices + iva) }</p>
                  </>
               }
               <p>VENTAS NO SUJETAS: { formatPrice(totalSalesNotSubjects) }</p>
               <p>VENTAS EXENTAS: { formatPrice(totalExemptSales) }</p>
               <p>TOTAL: { formatPrice(total) }</p>
            </section>
         </section>
      
         { ( showPriceModal || isEdit.state ) &&
            <PriceModal
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
               setShowPriceModal={ setShowPriceModal }
               isEdit={ isEdit }
               setIsEdit={ setIsEdit }
            />
         }
      </>
   );
};