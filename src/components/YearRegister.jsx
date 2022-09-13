import React, { useState, useEffect } from 'react';
/* hooks */
import { useNavigate } from 'react-router-dom';
/* helpers */
import { getDaysInMonth } from '../helpers/getDaysInMonth';
import { getSpanishMonth } from '../helpers/getSpanishMonth';
/* assets */
import { months } from '../data';
import { FiX } from 'react-icons/fi';

export const YearRegister = ({
   setShowMonthModal,
   targetDate,
   setTargetDate,
}) => {
   /* hooks */
   const navigate = useNavigate();

   /* states */
   const [showDays, setShowDays] = useState(false);
   const [days, setDays] = useState([]);

   /* handleClose */
   const handleClose = () => {
      setTargetDate('');
      setShowDays(false);
      setShowMonthModal(false);
   };

   /* handleGo */
   const handleMonth = (id, month) => {
      setTargetDate({ ...targetDate, month: month, monthNumber: id });
      setShowDays(true);
   };

   /* handleGo */
   const handleGo = (day) => {
      /* Desestructuring targetDay */
      const { year, month } = targetDate;
      navigate(`/register/${ year }/${ month }/${ day }`, { replace: true, });
      setShowMonthModal(false);
      setDays([]);
      setShowDays(false);
      setTargetDate('');
   };

   /* Effect that will calculate the number of days has the selected month */
   useEffect(() => {
      if( showDays ) {
         setDays(getDaysInMonth(targetDate));
      };
   }, [showDays]);

   useEffect(() => {
      const { year, monthNumber } = targetDate;
      if( year !== '' && monthNumber !== undefined ) {
         setShowDays(true);
      };
   }, []);

   /* Effect that will close the modal when user press Escape key */
   useEffect(() => {
      window.addEventListener('keydown', ({ key }) => key === 'Escape' && handleClose());
      return () => window.addEventListener('keydown', ({ key }) => key === 'Escape' && handleClose());
   }, []);

   return (
      <section className="shadow-modal">
         <section className={ !showDays ? 'modal month-modal' : 'modal month-modal overflow' }>
            <h2>{ !showDays ? 'Selecciona un mes' : `Selecciona un día de ${ getSpanishMonth(targetDate.month) }` }</h2>
            <section className={ !showDays ? 'month-grid' : 'month-grid four-column' }>
               { !showDays ?
                  months.map(({ id, value, title }) => (
                     <article
                        key={ id }
                        value={ value }
                        className="month-card"
                        onClick={ () => handleMonth(id, value) }>
                        <h2>{ title }</h2>
                     </article>
                  ))
                  :
                  days.map((day) => (
                     <article
                        key={ day }
                        className="month-card"
                        onClick={ () => handleGo(day) }>
                        <h2>{ day }</h2>
                     </article>
                  ))
               }
            </section>
            <FiX
               className='btn btn-close-modal icon'
               onClick={ handleClose }
            />
         </section>
      </section>
   );
};