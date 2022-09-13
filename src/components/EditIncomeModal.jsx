import React, { useState, useEffect } from 'react';
/* helpers */
import { updateIncome } from '../helpers/editIncome';
/* assets */
import { FiX } from 'react-icons/fi';

export const EditIncomeModal = ({
   editIncome,
   date,
   setEditIncome,
   registerData,
   setRegisterData,
   setAlertState,
   setAlertContent
}) => {
   /* states */
   const [newIncomeValue, setNewIncomeValue] = useState(0);

   /* handleSubmit */
   const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate
      if( isNaN(Number(newIncomeValue)) || newIncomeValue === undefined || newIncomeValue === '' ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Asegurate de escribir un valor',
         });
         return;
      };

      // Assign the new value to the correspondig incomes entry
      try {
         await updateIncome(newIncomeValue, editIncome, registerData, setRegisterData, date);
         // Now we need to return states to its initial state
         setNewIncomeValue(0);
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: `${ editIncome.content } fue editado con éxito`,
         });
         setEditIncome({ state: false, content: undefined });
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un error, vuelve a intentarlo',
         });
      };
   }

   /* Effect that will validate the close the modal */
   useEffect(() => {
      window.addEventListener("keydown", ({ key }) => {
         if( key === 'Escape' ) {
            setEditIncome({
               state: false,
               content: undefined,
            });
         };

         return () => {
            window.addEventListener('keydown', ({ key }) => {
               if( key === 'Escape' ) {
                  setEditIncome({
                     state: false,
                     content: undefined,
                  });
               };
            });
         };
      });
   }, []);

   return (
      <section className='shadow-modal'>
         <article className="modal edit-income-modal">
            <h2>Editar | { editIncome.content }</h2>
            <form className='modal-form' onSubmit={ handleSubmit }>
               <article className="input-field">
                  <label htmlFor="incomeValue">Nuevo valor</label>
                  <input
                     type="text"
                     name='incomeValue'
                     id='incomeValue'
                     placeholder={`NUEVO VALOR DE ${ editIncome.content }`}
                     value={ newIncomeValue }
                     onChange={
                        ({ target }) => setNewIncomeValue(target.value)
                     }
                  />
               </article>
               <button className='btn btn-submit'>Editar valor</button>
            </form>
            <FiX
               className='btn btn-close-modal icon'
               onClick={ () => setEditIncome({ state: false, content: undefined }) }
            />
         </article>
      </section>
   );
};