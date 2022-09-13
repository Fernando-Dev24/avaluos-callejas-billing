import React, { useState, useEffect } from 'react';
/* hooks */
import { useParams } from 'react-router-dom';
import { useNewBill } from '../contexts/NewBillContext';
import { useNavigate } from 'react-router-dom';
import { useCostumers } from '../contexts/CostumersContext';
/* helpers */
import { deleteBill, uploadNewBill } from '../helpers/firebaseHelpers';
/* components */
import { Prices } from './Prices';
import { CancelModal } from './CancelModal';
import { BillExport } from './BillExport';
import { CostumersListModal } from './CostumersListModal';
/* assets */
import { FiArrowLeft, FiTrash, FiUsers } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa';

export const NewBill = ({
   setAlertState,
   setAlertContent,
   registerData,
   setRegisterData,
   editBill,
   setEditBill,
   setNoticeAlertState,
}) => {
   /* hooks */
   const { year, month, day } = useParams();
   const { costumers } = useCostumers();
   const navigate = useNavigate();
   const { newBill: {
      billType,
      costumer,
      adress,
      personalId,
      giro,
      registerNumber,
      ref,
      state,
      billNumber,
      ccfNumber,
      telephone,
      total
   }, newBill, setNewBill, resetBill } = useNewBill();

   /* states */
   const [showExportModal, setShowExportModal] = useState(false);
   const [showModal, setShowModal] = useState(false);
   
   /* props */
   const { bills } = registerData;

   /* states */
   const [showCancelModal, setShowCancelModal] = useState(false);

   /* handleDelete */
   const handleDelete = async (id) => {
      // Filter the target id on registerBills
      const restOfBills = bills.filter(({ id: billId }) => billId !== id);
      // Update the firebase database
      try {
         await deleteBill(registerData, setRegisterData, restOfBills, year, month, day);
         // Setting everything to initial state and redirect to month, year, day according to props
         setEditBill(false);
         navigate(`/register/${ year }/${ month }/${ day }`);
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Factura eliminada',
         });
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un error, vuelve a intentarlo',
         });
      };
   };

   /* handleExport */
   const handleExport = () => {
      setShowExportModal(true);
   };
   
   /* handleBillContext */
   const handleBillContext = ({ target }) => { 
      setNewBill({
         ...newBill,
         [target.name]: target.value,
      });
   };

   /* handleUploadBill */
   const handleUploadBill = async (e) => {
      e.preventDefault();
      setAlertState(false);
      setAlertContent({});

      // Validate
      if( costumer === '' || costumer === undefined ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Asegurate de escribir el nombre del cliente',
         });
         return;
      };

      if( billType === 'CCF' && registerNumber === '' ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Escribí el número de registro del credito fiscal',
         });
         return;
      };

      try {
         await uploadNewBill(
            newBill,
            registerData,
            year,
            month,
            day,
            editBill,
            costumers,
            setNoticeAlertState   
         );
         resetBill();
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Factura creada con éxito',
         });
         setEditBill(false);
         navigate(`/register/${ year }/${ month }/${ day }/`, { replace: true });
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un error, vuelve a intentarlo',
         });
      };
   };

   /* Effect that will set total value to the corresponding pay method */
   useEffect(() => {
      switch( newBill.state ) {
         case 'PENDIENTE':
            setNewBill({
               ...newBill,
               contado: 0,
               cheque: 0,
               pos: 0,
               linea: 0,
               creditoPendiente: Number(total),
            });
         break;
         case 'EFECTIVO':
            setNewBill({
               ...newBill,
               contado: Number(total),
               cheque: 0,
               pos: 0,
               linea: 0,
               creditoPendiente: 0,
            });
         break;
         case 'CHEQUE':
            setNewBill({
               ...newBill,
               contado: 0,
               cheque: Number(total),
               pos: 0,
               linea: 0,
               creditoPendiente: 0,
            });
         break;
         case 'TARJETA':
            setNewBill({
               ...newBill,
               contado: 0,
               cheque: 0,
               pos: Number(total),
               linea: 0,
               creditoPendiente: 0,
            });
         break;
         case 'LINEA':
            setNewBill({
               ...newBill,
               contado: 0,
               cheque: 0,
               pos: 0,
               linea: Number(total),
               creditoPendiente: 0,
            });
         break;
         case 'CREDITO':
            setNewBill({
               ...newBill,
               contado: 0,
               cheque: 0,
               pos: 0,
               linea: 0,
               creditoPendiente: Number(total),
            });
         break;
         default:
            setNewBill({
               ...newBill,
               contado: 0,
               cheque: 0,
               pos: 0,
               linea: 0,
               creditoPendiente: Number(total)
            });
         break;
      };
   }, [total, newBill.state]);
   return (
      <>
         <header className="new-bill-header">
            <section className="header-content container">
               <nav className='header-nav'>
                  <button
                     className="btn btn-back"
                     onClick={ () => setShowCancelModal(true) }>
                     <FiArrowLeft className='btn-icon' />
                     Volver
                  </button>
                  <button
                     className='btn btn-option'
                     onClick={ handleExport }>
                     <FaFilePdf className="btn-icon" />
                     Exportar factura
                  </button>
                  <button
                     className='btn btn-option'
                     onClick={ () => setShowModal(true) }>
                     <FiUsers className='btn-icon' />
                     Ver registros de clientes
                  </button>
                  { editBill &&
                     <button
                        className='btn btn-option danger'
                        onClick={ () => handleDelete(newBill.id) }>
                        <FiTrash className="btn-icon" />
                        Eliminar factura
                     </button>
                  }
               </nav>
               <h3>{ editBill ? 'Editar factura' : 'Crear factura' }</h3>
            </section>
         </header>

         <form className='new-bill-form container'>
            <article className="input-field">
               <label htmlFor="billType">Tipo de factura</label>
               <select
                  name="billType"
                  id="billType"
                  value={ billType }
                  onChange={ handleBillContext }>
                  <option value="FACTURA">CONSUMIDOR FINAL</option>
                  <option value="CCF">CCF</option>
               </select>
            </article>

            <article className="input-field">
               <label htmlFor="costumer">Nombre del cliente</label>
               <input
                  type="text"
                  name='costumer'
                  id='costumer'
                  placeholder='Nombre del cliente'
                  value={ costumer }
                  onChange={ handleBillContext }
               />
            </article>
            
            <article className="input-field">
               <label htmlFor="ref">REF</label>
               <select
                  name="ref"
                  id="ref"
                  value={ ref }
                  onChange={ handleBillContext }>
                  <option value="VALÚO">VALÚO</option>
                  <option value="RECUPERADO">RECUPERADO</option>
                  <option value="CONSIGNA">CONSIGNA</option>
                  <option value="DIAGNÓSTICO MECÁNICO">DIAGNÓSTICO MECÁNICO</option>
                  <option value="BANDESAL">BANDESAL</option>
                  <option value="DOMICILIO">DOMICILIO</option>
                  <option value="DOMICILIO RECUPERADO">DOMICILIO RECUPERADO</option>
                  <option value="TALLER CASA MATRIZ">TALLER CASA MATRIZ</option>
                  <option value="SM VALUOS">SM VALUOS</option>
                  <option value="SM TALLER">SM TALLER</option>
               </select>
            </article>

            <article className='input-field'>
               <label htmlFor="state">Estado de pago</label>
               <select
                  name="state"
                  id="state"
                  value={ state }
                  onChange={ handleBillContext }>
                  { ( newBill.ref !== 'SM VALUOS' ) || ( newBill.ref !== 'SM TALLER' ) ?
                     <>
                        <option value="EFECTIVO">EFECTIVO</option>
                        <option value="CHEQUE">CHEQUE</option>
                        <option value="TARJETA">TARJETA</option>
                        <option value="LINEA">TRANSFERENCIA</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                     </>
                     :
                     <>
                        <option value="EFECTIVO">EFECTIVO</option>
                        <option value="CHEQUE">CHEQUE</option>
                        <option value="LINEA">TRANSF</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                     </>
                  }
               </select>
            </article>

            <article className="input-field">
               <label htmlFor="billNumber">Número de factura</label>
               <input
                  type="text"
                  name='billNumber'
                  id='billNumber'
                  placeholder='N° XXXX'
                  value={ billNumber }
                  onChange={ handleBillContext }
               />
            </article>

            <article className='input-field'>
               <label htmlFor="ccfNumber">Número de Comprobante de Credito Fiscal</label>
               <input
                  type="text"
                  name='ccfNumber'
                  id='ccfNumber'
                  placeholder='N° XXXX'
                  value={ ccfNumber }
                  onChange={ handleBillContext }
               />
            </article>
            
            <article className="input-field">
               <label htmlFor="adress">Dirección</label>
               <input
                  type="text"
                  name='adress'
                  id='adress'
                  placeholder='Dirección'
                  value={ adress }
                  onChange={ handleBillContext }
               />
            </article>

            <article className="input-field">
               <label htmlFor="telephone">Teléfono</label>
               <input
                  type="text"
                  name='telephone'
                  id='telephone'
                  placeholder='7034 7570'
                  value={ telephone }
                  onChange={ handleBillContext }
               />
            </article>
            
            <article className="input-field">
               <label htmlFor="personalId">DUI o NIT</label>
               <input
                  type="text"
                  name='personalId'
                  id='personalId'
                  placeholder='XXXX-XXXXXX-XXX-X'
                  value={ personalId }
                  onChange={ handleBillContext }
               />
            </article>
            
            <article className="input-field">
               <label htmlFor="registerNumber">Registro No.</label>
               <input
                  type="text"
                  name='registerNumber'
                  id='registerNumber'
                  placeholder='Registro No.'
                  value={ registerNumber }
                  onChange={ handleBillContext }
               />
            </article>
            
            <article className="input-field">
               <label htmlFor="giro">Giro</label>
               <input
                  type="text"
                  name='giro'
                  id='giro'
                  placeholder='Giro'
                  value={ giro }
                  onChange={ handleBillContext }
               />
            </article>

            <Prices
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
            />

            <button
               className='btn btn-submit'
               onClick={ handleUploadBill }>
               { !editBill ? 'Guardar factura' : 'Editar factura' }
            </button>
         </form>

         { showCancelModal &&
            <CancelModal
               setShowCancelModal={ setShowCancelModal }
               date={{ year: year, month: month, day: day }}
               resetBill={ resetBill }
               editBill={ editBill }
               setEditBill={ setEditBill }
               registerData={ registerData }
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
            />
         }

         { showExportModal &&
            <BillExport
               newBill={ newBill }
               setShowExportModal={ setShowExportModal }
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
            />
         }

         { showModal &&
            <CostumersListModal
               setShowModal={ setShowModal }
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
            />
         }
      </>
   );
};