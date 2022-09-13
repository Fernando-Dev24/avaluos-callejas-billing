import React, { useState, useEffect } from 'react';
/* helpers */
import { updateIncomes } from '../helpers/firebaseHelpers';
/* assets */
import { FiX } from 'react-icons/fi';

export const ModalAddPrice = ({
   setShowAddIncome,
   setAlertState,
   setAlertContent,
   date: { year, month, day },
   registerData,
   setRegisterData,
}) => {
   /* states */
   const [modalValues, setModalValues] = useState({ type: 'DURAZNOS EFECTIVO', price: 0 });
   const { type, price } = modalValues;

   /* handleInputState */
   const handleInputState = ({ target }) => {
      setModalValues({
         ...modalValues,
         [target.name]: target.value,
      });
   };

   /* handleAddIncome */
   const handleAddIncome = async (e) => {
      e.preventDefault();

      // Validate before update totalIncomes state
      if( type === '' || type === undefined || isNaN(price) ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Asegurate de ingresar los campos: Tipo de ingreso, y valor del ingreso',
         });
         return;
      };

      try {
         // Update incomes directly in this func.
         await updateIncomes(modalValues, registerData, setRegisterData, year, month, day);
         // If everything is correct we need to clear every state to its initialState
         setModalValues({ type: 'DURAZNOS EFECTIVO', price: 0 });
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
            message: 'Hubo un error, vuelve a intentarlo',
         });
      };
   };

   /* Effect that will close the modal when pressed Escape key */
   useEffect(() => {
      window.addEventListener('keydown', ({ key }) => {
         if( key === 'Escape' ) {
            setShowAddIncome(false);
         };
      });
      return () => {
         window.addEventListener("keydown", ({ key }) => {
            if( key === 'Escape' ) {
               setShowAddIncome(false);
            };
         });
      };
   }, []);
   
   return (
      <section className="shadow-modal">
         <article className="modal income-modal">
            <h3>Agregar ingreso manualmente</h3>
            <form className='form-modal' onSubmit={ handleAddIncome }>
               <article className="input-field">
                  <label htmlFor="type">Tipo de ingreso</label>
                  <select
                     name="type"
                     id="type"
                     value={ type }
                     onChange={ handleInputState }>
                     <option value="DURAZNOS EFECTIVO">DURAZNOS EFECTIVO</option>
                     <option value="DURAZNOS CHEQUES">DURAZNOS CHEQUES</option>
                     <option value="SALDO ANTERIOR EFECTIVO">SALDO ANTERIOR EFECTIVO</option>
                     <option value="SALDO ANTERIOR CHEQUES">SALDO ANTERIOR CHEQUES</option>
                  </select>
               </article>
               <article className="input-field">
                  <label htmlFor="price">Valor del ingreso</label>
                  <input
                     type="number"
                     step={ 0.1 }
                     name='price'
                     id='price'
                     placeholder='Valor del ingreso'
                     value={ price }
                     onChange={ handleInputState }
                     onKeyDown={ (e) => e.key === 'Enter' && handleAddIncome(e) }
                  />
               </article>
               <button className='btn btn-submit'>Agregar Ingreso</button>
            </form>
            <FiX
               className='btn btn-close-modal icon'
               onClick={ () => setShowAddIncome(false) }
            />
         </article>
      </section>
   );
};