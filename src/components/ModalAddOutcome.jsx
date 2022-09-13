import { useState, useEffect } from "react";
/* helpers */
import { uploadOutcome } from "../helpers/firebaseHelpers";
import { editOutcomeFunc } from "../helpers/outcomesActions";
/* assets */
import { FiX } from 'react-icons/fi';

export const ModalAddOutcome = ({
   setShowAddOutcome,
   setAlertState,
   setAlertContent,
   date,
   registerData,
   setRegisterData,
   editOutcome,
   setEditOutcome,
}) => {
   /* states */
   const [inputValues, setInputValues] = useState({
      type: 'OTRO TIPO DE SALIDA',
      payMethod: 'EFECTIVO',
      description: '',
      price: 0,
   });
   const { type, payMethod, description, price } = inputValues;

   /* functions */
   const handleForm = ({ target }) => {
      setInputValues({
         ...inputValues,
         [target.name]: target.value,
      });
   };

   const handleCloseModal = () => {
      if( editOutcome.state === true ) {
         setEditOutcome({ state: false, content: undefined });
         return;
      };

      setShowAddOutcome(false);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setAlertState(false);
      setAlertContent({});

      // Validations
      if( type === '' && type === undefined ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Selecciona un tipo de salida',
         });
         return;
      };

      if( price === undefined || isNaN(price) ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Escribe el valor de la salida',
         });
         return;
      };

      // Add a new outcome, calculate and upload to firebase
      try {
         if( editOutcome.state ) {
            await editOutcomeFunc(inputValues, registerData, setRegisterData, date, editOutcome);
            // Now everything is upload to firebase, we need to restart all states to initial state
            setInputValues({
               type: 'SALIDA NORMAL',
               description: '',
               price: 0,
            });
            setAlertState(true);
            setAlertContent({
               type: 'success',
               message: 'Salida editada con éxito',
            });
            handleCloseModal();
         } else {
            await uploadOutcome(registerData, setRegisterData, inputValues, date);
            // Now everything is upload to firebase, we need to restart all states to initial state
            setInputValues({
               type: 'SALIDA NORMAL',
               description: '',
               price: 0,
            });
            setAlertState(true);
            setAlertContent({
               type: 'success',
               message: 'Salida agregada con éxito',
            });
         };
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un error, vuelve a intentalo',
         });
      };
   };

   /* Effect that will validate if there is something on editOutcome state, if it returns true, then modalValues will be replaced by content to be edited */
   useEffect(() => {
      if( editOutcome.state ) {
         setInputValues({ ...editOutcome.content });
      };
   }, []);

   /* Effect that will close the modal when user press Escape */
   useEffect(() => {
      window.addEventListener('keydown', ({ key }) => {
         if( key === 'Escape' ) {
            handleCloseModal()
         };
      });

      return () => {
         window.addEventListener('keydown', ({ key }) => {
            if( key === 'Escape' ) {
               handleCloseModal();
            };
         });
      };
   }, []);

   return (
      <section className="shadow-modal">
         <article className="modal income-modal">
            <h3>Agregar Salida</h3>
            <form className="form-modal">
               <article className="input-field">
                  <label htmlFor="type">Tipo de Salida</label>
                  <select
                     name="type"
                     id="type"
                     value={ type }
                     onChange={ handleForm }>
                     <option value="OTRO TIPO DE SALIDA">OTRO TIPO DE SALIDA</option>
                     <option value="AGUA - CASA MATRIZ">AGUA - CASA MATRIZ</option>
                     <option value="AGUA - SAN MIGUEL">AGUA - SAN MIGUEL</option>
                     <option value="LUZ - CASA MATRIZ">LUZ - CASA MATRIZ</option>
                     <option value="LUZ - SAN MIGUEL">LUZ - SAN MIGUEL</option>
                     <option value="TELEFONO - CASA MATRIZ">TELEFONO - CASA MATRIZ</option>
                     <option value="TELEFONO - SAN MIGUEL">TELEFONO - SAN MIGUEL</option>
                     <option value="GASOLINA - CASA MATRIZ">GASOLINA - CASA MATRIZ</option>
                     <option value="GASOLINA - SAN MIGUEL">GASOLINA - SAN MIGUEL</option>
                     <option value="PLANILLA">PLANILLA</option>
                     <option value="ISSS">ISSS</option>
                     <option value="AFP">AFP</option>
                     <option value="PAPELERIA Y UTILES">PAPELERIA Y UTILES</option>
                     <option value="REPUESTOS Y HERRAMIENTAS">REPUESTOS Y HERRAMIENTAS</option>
                     <option value="IMPUESTOS">IMPUESTOS</option>
                     <option value="ALQUILER">ALQUILER</option>
                     <option value="BANCO EFECTIVO">BANCO EFECTIVO</option>
                     <option value="BANCO CHEQUE">BANCO CHEQUE</option>
                     <option value="GASTOS JEFE">GASTOS JEFE</option>
                  </select>
               </article>
               <article className="input-field">
                  <label htmlFor="payMethod">Metodo de pago</label>
                  <select
                     name="payMethod"
                     id="payMethod"
                     value={ payMethod }
                     onChange={ handleForm }>
                     <option value="EFECTIVO">EFECTIVO</option>
                     <option value="BANCO EFECTIVO">BANCO EFECTIVO</option>
                     <option value="BANCO CHEQUE">BANCO CHEQUE</option>
                     <option value="CHEQUE">CHEQUE</option>
                     <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                     <option value="TARJETA">TARJETA</option>
                  </select>
               </article>
               <article className="input-field">
                  <label htmlFor="description">Descripción</label>
                  <input
                     type="text"
                     name="description"
                     id="description"
                     placeholder="Descripción de la Salida"
                     value={ description }
                     onChange={ handleForm }
                     onKeyDown={ (e) => e.key === 'Enter' && handleSubmit(e) }
                  />
               </article>
               <article className="input-field">
                  <label htmlFor="price">Valor de la Salida</label>
                  <input
                     type="number"
                     step={ 0.1 }
                     name="price"
                     id="price"
                     placeholder="Valor de la Salida"
                     value={ price }
                     onChange={ handleForm }
                     onKeyDown={ (e) => e.key === 'Enter' && handleSubmit(e) }
                  />
               </article>
               <button
                  className="btn btn-submit"
                  onClick={ handleSubmit }>
                  { editOutcome.state ? 'Editar salida' : 'Agregar salida' }
               </button>
            </form>
            <FiX
               className="btn btn-close-modal icon"
               onClick={ handleCloseModal }
            />
         </article>
      </section>
   );
};