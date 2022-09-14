import React, { useEffect } from 'react';
/* helpers */
import { formatDate } from '../helpers/formatDate';
import { formatPrice } from '../helpers/formatPrice';
import { numberToString } from '../helpers/numberToString';
import html2pdf from 'html2pdf.js';
/* assets */
import LogoLowOpacity from '../assets/logo-low-opacity.png';
import billImage from '../assets/FACTURA.jpg';

export const BillExport = ({
   newBill,
   setShowExportModal,
   setAlertState,
   setAlertContent
}) => {
   /* props */
   const { billPrices: prices } = newBill;
   const { ref } = newBill;
   
   /* handleExport */
   const handleExport = async () => {
      const billToExport = document.getElementById('bill');
      setAlertState(false);
      setAlertContent({});

      /* export options */
      let options = {
         margin: 0,
         filename: `FACTURA ${ newBill.costumer }`,
         image: { type: 'jpg', quality: 1 },
         html2canvas: { scale: 2.5 },
         jsPDF: {
            unit: 'cm',
            format: [ 15, 21.5 ],
            orientation: 'portrait',
            compress: true,
         },
      };

      let doc = html2pdf().set(options).from(billToExport).toPdf();
      
      try {
         doc.save();
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Creando factura',
         });
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un error, vuelve a intentarlo'
         });
      };
   };
   
   /* Effect that will close the modal when user press Escape key */
   useEffect(() => {
      window.addEventListener("keydown", ({ key }) => {
         if( key === 'Escape' ) setShowExportModal(false);
      });
      return () => {
         window.addEventListener("keydown", ({ key }) => {
            if( key === 'Escape' ) setShowExportModal(false);
         });
      }
   }, []);

   return (
      <section className="shadow-modal">
         <section className="modal export-modal overflow">
            {/* <figure className='bill-example'>
               <img src={ billImage } alt="" />
            </figure> */}
            <section className="bill-page" id='bill'>
               {/* info */}
               <table className="bill-info">
                  <tbody>
                     { newBill.billType !== 'FACTURA' ?
                        <>
                           <tr className='table-row'>
                              <td>Cliente: { newBill.costumer }</td>
                              <td>Fecha: { formatDate(newBill.created) }</td>
                           </tr>
                           <tr className='table-row'>
                              <td>Dirección: { newBill.adress }</td>
                              <td>Registro No.: { newBill.registerNumber }</td>
                           </tr>
                           <tr className='table-row'>
                              <td>Nota de Remisión:</td>
                              <td>DUI o NIT: { newBill.personalId }</td>
                           </tr>
                           <tr className='table-row'>
                              <td>Fecha de Nota de Remisión: { formatDate(newBill.created) }</td>
                              <td>Giro: { newBill.giro }</td>
                           </tr>
                           <tr className='table-row'>
                              <td colSpan={ 2 }>Condiciones de pago:</td>
                           </tr>
                        </>
                        :
                        <>
                           <tr className='table-row'>
                              <td>Cliente: { newBill.costumer }</td>
                              <td>Fecha: { formatDate(newBill.created) }</td>
                           </tr>
                           <tr className='table-row'>
                              <td colSpan={ 2 }>Dirección: { newBill.adress }</td>
                           </tr>
                           <tr className='table-row'>
                              <td>DUI O N.I.T: { newBill.personalId }</td>
                           </tr>
                        </>
                     }
                  </tbody>
               </table>
               {/* prices */}
               <article className="costumer-prices">
                  <table className='bill-prices'>
                     <thead>
                        <tr className="table-row-header">
                           <th>Cant.</th>
                           <th>Descripción</th>
                           <th>Precio Unit.</th>
                           <th>Ventas no sujetas</th>
                           <th>Ventas exentas</th>
                           <th>Ventas afectas</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr className='table-row-body bill-label'>
                           <td colSpan={ 6 }>{ ref !== 'TALLER CASA MATRIZ' && ref !== 'SM TALLER' ? 'SERVICIO AVALÚO' : 'SERVICIO DE VEHÍCULO' }</td>
                        </tr>
                        { prices.length > 0 &&
                           prices.map(({ id, amount, description, exemptSales, salesNotSubjects, unitPrice, affectedSales }) => (
                              <tr
                                 key={ id }
                                 className='table-row-body'>
                                 <td>{ amount }</td>
                                 <td>{ description }</td>
                                 <td>{ formatPrice(unitPrice) }</td>
                                 <td>{ formatPrice(salesNotSubjects) }</td>
                                 <td>{ formatPrice(exemptSales) }</td>
                                 <td>{ formatPrice(affectedSales) }</td>
                              </tr>
                           ))
                        }
                     </tbody>
                  </table>
               </article>
               {/* totals */}
               <section className='totals-wrapper'>
                  <article className="totals-signatures">
                     <article className="total-in-letters">
                        <p>SON: { numberToString(newBill.total) }</p>
                     </article>
                     <p className='in-case'>OPERACIONES SUPERIORES A $11,428.58</p>
                     <article className="signatures-wrapper">
                        <article className="signature-container">
                           <p>NOMBRE:</p>
                           <p>DUI:</p>
                           <p>FIRMA:</p>
                           <p>RECIBIDO</p>
                        </article>
                        <article className="signature-container">
                           <p>NOMBRE:</p>
                           <p>DUI:</p>
                           <p>FIRMA:</p>
                           <p>ENTREGADO</p>
                        </article>
                     </article>
                  </article>
                  <article className="totals-numbers">
                     <div className="total-item">
                        <p>SUMAS:</p>
                        <p>{ formatPrice(newBill.sumPrices) }</p>
                     </div>
                     <div className="total-item">
                        <p>13% de IVA</p>
                        <p>{ formatPrice(newBill.iva) }</p>
                     </div>
                     <div className="total-item">
                        <p>SUB-TOTAL</p>
                        <p>{ formatPrice(newBill.sumPrices + newBill.iva) }</p>
                     </div>
                     <div className="total-item">
                        <p>(-) IVA RETENIDO</p>
                     </div>
                     <div className="total-item">
                        <p>VENTAS EXENTAS</p>
                        <p>{ formatPrice(newBill.totalExemptSales) }</p>
                     </div>
                     <div className="total-item">
                        <p>VENTAS NO SUJETAS</p>
                        <p>{ formatPrice(newBill.totalSalesNotSubjects) }</p>
                     </div>
                     <div className="total-item">
                        <p>VENTA TOTAL:</p>
                        <p>{ formatPrice(newBill.total) }</p>
                     </div>
                  </article>
               </section>
            </section>
            <nav className='export-nav'>
               <button
                  className='btn btn-option'
                  onClick={ handleExport }>
                  Exportar
               </button>
               <button
                  className='btn btn-option danger'
                  onClick={ () => setShowExportModal(false) }>
                  Cerrar
               </button>
            </nav>
         </section>
      </section>
   );
};