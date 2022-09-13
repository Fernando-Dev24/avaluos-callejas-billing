import React, { useState, useEffect } from 'react';
/* helpers */
import { addOtherIncome } from '../helpers/otherIncomesTriggers';
/* assets */
import { FiX } from 'react-icons/fi';

export const OtherIncomesModal = ({
   registerData,
   setRegisterData,
   setShowOtherIncomesModal,
   setAlertState,
   setAlertContent,
   date,
   editOtherIncome,
   setEditOtherIncome,
}) => {
   /* States */
   const [formValues, setFormValues] = useState({ description: '', incomeValue: 0 });
   const { description, incomeValue } = formValues;

   // Functions
   const handleCloseModal = () => {
      if( editOtherIncome.state ) {
         setEditOtherIncome({ state: false, content: undefined });
      } else {
         setShowOtherIncomesModal(false);
      };
   };

   /* handleInputState */
   const handleInputState = ({ target }) => {
      setFormValues({
         ...formValues,
         [target.name]: target.value,
      });
   };

   /* handleSubmit */
   const handleSubmit = async (e) => {
      e.preventDefault();
      setAlertState(false);
      setAlertContent({});
      
      // Validate
      if( description === '' || description === undefined ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Asegurate de escribir la descripción del ingreso',
         });
         return;
      };

      try {
         await addOtherIncome(
            registerData,
            setRegisterData,
            formValues,
            date,
            editOtherIncome,
         );
         // Return formValues to its initial state
         if( editOtherIncome.state ) {
            setFormValues({ description: '', incomeValue: 0 });
            handleCloseModal();
         } else {
            setFormValues({ description: '', incomeValue: 0 });
         };
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Ingreso agregado con éxito',
         });
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un error, vuelve a intenrarlo',
         });
      };
   };

   /* Effect that will validate if there is something on editOtherIncome to replace its value on modal */
   useEffect(() => {
      if( editOtherIncome.state ) {
         setFormValues({ ...editOtherIncome.content });
      };
   }, []);

   /* Effect that will close the modal when user press Escape key on keyboard */
   useEffect(() => {
      window.addEventListener('keydown', ({ key }) => key === 'Escape' && handleCloseModal());
      return () => {
         window.addEventListener('keydown', ({ key }) => key === 'Escape' && handleCloseModal());
      };
   }, []);

   return (
      <section className='shadow-modal'>
         <article className="modal income-modal">
            <h3>OTROS INGRESOS | AGREGAR</h3>
            <form className='form-modal' onSubmit={ handleSubmit }>
               <article className="input-field">
                  <label htmlFor="description">Descripción de la entrada</label>
                  <input
                     type="text"
                     name='description'
                     id='description'
                     placeholder='Descripción del ingreso'
                     value={ description }
                     onChange={ handleInputState }
                  />
               </article>
               <article className="input-field">
                  <label htmlFor="incomeValue">Valor de la entrada</label>
                  <input
                     type="number"
                     step={ 0.1 }
                     name='incomeValue'
                     id='incomeValue'
                     placeholder='Valor del nuevo ingreso'
                     value={ incomeValue }
                     onChange={ handleInputState }
                     onKeyDown={ (e) => e.key === 'Enter' && handleSubmit(e) }
                  />
               </article>
               <button className='btn btn-submit'>
                  { editOtherIncome.state ? 'Editar ingreso' : 'Agregar ingreso' }
               </button>
               <FiX
                  className='btn btn-close-modal icon'
                  onClick={ handleCloseModal }
               />
            </form>
         </article>
      </section>
   );
};