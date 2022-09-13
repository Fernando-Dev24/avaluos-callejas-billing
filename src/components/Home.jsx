import React, { useState } from 'react';
/* hooks */
import { useYear } from '../contexts/YearContext';
/* helpers */
import { addYear } from '../helpers/firebaseHelpers';
/* components */
import { Header } from './Header';
import { YearCard } from './YearCard';

export const Home = ({
   setAlertState,
   setAlertContent,
   setShowMonthModal,
   targetDate,
   setTargetDate
}) => {
   /* hooks */
   const { years } = useYear();

   /* states */
   const [showAddYear, setShowAddYear] = useState(false);
   const [yearValue, setYearValue] = useState(new Date().getFullYear());

   /* handleAddYear */
   const handleAddYear = async () => {
      setAlertState(false);
      setAlertContent({});

      // Validation
      if( isNaN(yearValue) || yearValue === undefined || yearValue === '' ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Asegurate de escribir un año',
         });
         return;
      };

      if( yearValue <= 0 || yearValue > new Date().getFullYear() ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: `El año no puede ser menor a cero, o mayor a ${ new Date().getFullYear() }`, 
         });
         return;
      };

      try {
         await addYear(yearValue);
         setShowAddYear(false);
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Año creado con éxito',
         });
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Ha ocurrido un error, vuelve a intentarlo',
         });
      };
   };
   
   return (
      <>
         <Header />
         <section className="year-feed container">
            <header className='year-feed-header'>
               <h2>Selecciona un año para: crear, editar, o ver sus registros</h2>
               <button
                  className={ showAddYear ? 'btn btn-new cancel' : 'btn btn-new' }
                  onClick={ () => setShowAddYear(!showAddYear) }>
                  { showAddYear ? 'Cancelar' : 'Agregar año' }
               </button>
            </header>
            { showAddYear &&
               <article className="input-field">
                  <label htmlFor="newYear">Agregar nuevo año al registro</label>
                  <input
                     type="number"
                     min="0"
                     max={ new Date().getFullYear() }
                     name='newYear'
                     id='newYear'
                     placeholder='Ingresa el año'
                     value={ yearValue }
                     onChange={ ({ target }) => setYearValue(target.value) }
                     onKeyDown={ ({ key }) => key === 'Enter' && handleAddYear() }
                  />
               </article>
            }
            { years.length !== 0 ?
               <section className='year-feed-grid'>
                  { years.map((year) => (
                     <YearCard
                        key={ year.id }
                        year={ year }
                        targetDate={ targetDate }
                        setTargetDate={ setTargetDate }
                        setShowMonthModal={ setShowMonthModal }
                     />
                  )) }
               </section>
               :
               <article className="year-empty">
                  <h2>No hay registros de años en la base de datos</h2>
               </article>
            }
            </section>
      </>
   )
};