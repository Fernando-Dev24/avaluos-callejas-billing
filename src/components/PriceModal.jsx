import React, { useEffect } from 'react';
/* hooks */
import { useForm } from '../hooks/useForm';
import { useNewBill } from '../contexts/NewBillContext';
/* helpers */
import { addPrice } from '../helpers/addPrice';
import { editPrice } from '../helpers/editPrice';
/* assets */
import { FiX } from 'react-icons/fi';

export const PriceModal = ({
   setShowPriceModal,
   setAlertState,
   setAlertContent,
   isEdit,
   setIsEdit,
}) => {
   /* hooks */
   const { newBill, setNewBill } = useNewBill();

   /* props */
   const { state, content } = isEdit;

   /* states */
   const [{ amount, description, unitPrice, salesNotSubjects, exemptSales }, handleSetValues, resetValues] = useForm({ amount: 1, description: '', unitPrice: 0, salesNotSubjects: 0, exemptSales: 0, });

   /* handleCloseModal */
   const handleCloseModal = () => {
      state ? setIsEdit({ state: false, content: undefined }) : setShowPriceModal(false);
   };

   /* handleEditState */
   const handleEditState = ({ target }) => {
      setIsEdit({ ...isEdit, content: {
         ...isEdit.content,
         [target.name]: target.value,
      }});
   };
   
   /* handleAddPrice */
   const handleAddPrice = (e) => {
      e.preventDefault();
      setAlertState(false);
      setAlertContent({});
      
      // Validations
      if( isNaN(amount) || amount === undefined || amount === '') {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Escribe la cantidad del precio',
         });
         return;
      };

      if( description === '' || description === undefined ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Escribe la descripción del precio',
         });
         return;
      }

      if ( (isNaN(unitPrice) || unitPrice === undefined || unitPrice === '') ||
          (isNaN(salesNotSubjects) || salesNotSubjects === undefined || salesNotSubjects === '') ||
          (isNaN(exemptSales) || exemptSales === undefined || exemptSales === '')
         ) {
            setAlertState(true);
            setAlertContent({
               type: 'error',
               message: 'Asegurate de escribir un valor en: Precio Unitario, Ventas no sujetas, o Ventas exentas',
            });
            return;
      };

      /* Adding price to billContext */
      try {
         addPrice(amount, description, unitPrice, salesNotSubjects, exemptSales, newBill, setNewBill);
         resetValues({
            amount: 1,
            description: '',
            unitPrice: 0,
            salesNotSubjects: 0,
            exemptSales: 0,
         });
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Costo agregado con éxito',
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

   /* handleEditPrice */
   const handleEditPrice = (e) => {
      e.preventDefault();
      setAlertState(false);
      setAlertContent({});

      // Destructuring to easy to use acces on isEdit.content state
      const { amount, description, unitPrice, salesNotSubjects, exemptSales } = content;
      

      // Validations
      // Validations
      if( isNaN(amount) || amount === undefined || amount === '') {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Escribe la cantidad del precio',
         });
         return;
      };

      if( description === '' || description === undefined ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Escribe la descripción del precio',
         });
         return;
      }

      if ( (isNaN(unitPrice) || unitPrice === undefined || unitPrice === '') ||
          (isNaN(salesNotSubjects) || salesNotSubjects === undefined || salesNotSubjects === '') ||
          (isNaN(exemptSales) || exemptSales === undefined || exemptSales === '')
         ) {
            setAlertState(true);
            setAlertContent({
               type: 'error',
               message: 'Asegurate de escribir un valor en: Precio Unitario, Ventas no sujetas, o Ventas exentas',
            });
            return;
      };

      try {
         editPrice(isEdit.content, newBill, setNewBill);
         setIsEdit({ state: false, content: undefined });
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Costo editado con éxito',
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

   /* Effect that will close modal component when user pressed Escape key */
   useEffect(() => {
      window.addEventListener('keydown', ({ key }) => key === 'Escape' && handleCloseModal());
      return () => window.addEventListener('keydown', ({ key }) => key === 'Escape' && handleCloseModal());
   }, []);

   return (
      <section className="shadow-modal">
         <article className="modal modal-prices overflow">
            <h3>Agregar costo</h3>
            <article className="input-field">
               <label htmlFor="amount">Cantidad</label>
               <input
                  type="number"
                  min="0"
                  name='amount'
                  id='amount'
                  placeholder='Cantidad'
                  value={ !state ? amount : content.amount }
                  onChange={ (e) => !state ? handleSetValues(e) : handleEditState(e) }
                  onKeyDown={ (e) => {
                     if( e.key === 'Enter' ) {
                        if( !state ) {
                           handleAddPrice(e);
                        } else {
                           handleEditPrice(e);
                        };
                     };
                  } }
               />
            </article>
            <article className="input-field">
               <label htmlFor="description">Descripción</label>
               <input
                  type="text"
                  name='description'
                  id='description'
                  placeholder='Descripción del costo'
                  value={ !state ? description : content.description }
                  onChange={ (e) => !state ? handleSetValues(e) : handleEditState(e) }
                  onKeyDown={ (e) => {
                     if( e.key === 'Enter' ) {
                        if( !state ) {
                           handleAddPrice(e);
                        } else {
                           handleEditPrice(e);
                        };
                     };
                  } }
               />
            </article>
            <article className="input-field">
               <label htmlFor="unitPrice">Precio unitario</label>
               <input
                  type="number"
                  min="0"
                  name='unitPrice'
                  id='unitPrice'
                  placeholder='Precio unitario'
                  value={ !state ? unitPrice : content.unitPrice }
                  onChange={ (e) => !state ? handleSetValues(e) : handleEditState(e) }
                  onKeyDown={ (e) => {
                     if( e.key === 'Enter' ) {
                        if( !state ) {
                           handleAddPrice(e);
                        } else {
                           handleEditPrice(e);
                        };
                     };
                  } }
               />
            </article>
            <article className="input-field">
               <label htmlFor="salesNotSubjects">Ventas no sujetas</label>
               <input
                  type="number"
                  min="0"
                  name='salesNotSubjects'
                  id='salesNotSubjects'
                  placeholder='Ventas no sujetas'
                  value={ !state ? salesNotSubjects : content.salesNotSubjects }
                  onChange={ (e) => !state ? handleSetValues(e) : handleEditState(e) }
                  onKeyDown={ (e) => {
                     if( e.key === 'Enter' ) {
                        if( !state ) {
                           handleAddPrice(e);
                        } else {
                           handleEditPrice(e);
                        };
                     };
                  } }
               />
            </article>
            <article className="input-field">
               <label htmlFor="exemptSales">Ventas exentas</label>
               <input
                  type="number"
                  min="0"
                  name='exemptSales'
                  id='exemptSales'
                  placeholder='Ventas exentas'
                  value={ !state ? exemptSales : content.exemptSales }
                  onChange={ (e) => !state ? handleSetValues(e) : handleEditState(e) }
                  onKeyDown={ (e) => {
                     if( e.key === 'Enter' ) {
                        if( !state ) {
                           handleAddPrice(e);
                        } else {
                           handleEditPrice(e);
                        };
                     };
                  } }
               />
            </article>
            <button
               className='btn btn-add-price'
               onClick={ !state ? handleAddPrice : handleEditPrice }>
               Agregar costo
            </button>
            <FiX
               className='btn-close-modal icon'
               onClick={ handleCloseModal }
            />
         </article>
      </section>
   );
};