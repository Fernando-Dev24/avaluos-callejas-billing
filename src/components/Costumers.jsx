import React, { useState, useEffect } from 'react';
/* hooks */
import { useCostumers } from '../contexts/CostumersContext';
import { Link } from 'react-router-dom';
/* helpers */
import { addCostumer } from '../helpers/costumerTriggers';
/* components */
import { CostumersModal } from './CostumersModal';
/* assets */
import { FiArrowLeft, FiPlusCircle, FiX, FiMoreVertical } from 'react-icons/fi';

export const Costumers = ({ setAlertState, setAlertContent }) => {
   /* hooks */
   const { costumers, setCostumers } = useCostumers();

   /* states */
   const [showInputRow, setShowInputRow] = useState({ state: false, index: undefined });
   const [showModal, setShowModal] = useState(false);
   const [costumerOptions, setCostumerOptions] = useState({});
   const [formValues, setFormValues] = useState({
      name: '',
      registerNumber: '',
      personalId: '',
      adress: '',
      giro: '',
   });

   /* Destructuring state for easy access */
   const { name, registerNumber, personalId, adress, giro } = formValues;
   const [searchValue, setSearchValue] = useState('');
   const [searchResults, setSearchResults] = useState([]);

   /* handleCancel */
   const handleCancel = () => {
      setShowInputRow({ state: false, index: undefined });
   };

   /* handleSearch */
   const handleSearch = (e) => {
      e.preventDefault();
      
      // Validation
      if( searchValue === '' || searchValue === undefined ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Escribe el número de registro para buscarlo',
         });
         return;
      };

      try {
         // DONE: Filter search value to validate if there is am costumer
         const results = costumers.filter(({ registerNumber }) => registerNumber === searchValue.trim());
         setSearchResults(results);
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un problema, vuelve a intentarlo',
         });
      };
   };

   /* handleCostumerOptions */
   const handleCostumerOptions = (id) => {
      // Filter the target and rest of costumers to pass them as state
      const [ targetCostumer ] = costumers.filter(({ id: costumerId }) => costumerId === id);
      const restOfCostumers = costumers.filter(({ id: costumerId }) => costumerId !== id);
   
      // Setting new states
      setCostumerOptions({
         editContent: targetCostumer,
         deleteContent: restOfCostumers,
      });

      setShowModal(true);
   };

   /* handleInputState */
   const handleInputState = ({ target: { name, value } }) => {
      setFormValues({
         ...formValues,
         [name]: value,
      });
   };

   /* toogleAddCostumer */
   const toogleAddCostumer = (index = 0) => {
      setShowInputRow({ state: true, index: index });
   };

   /* handleAddCostumer */
   const handleAddCostumer = async (e) => {
      e.preventDefault();

      // Validations
      if( name === '' || registerNumber === '' || personalId === '' || adress === '' || giro === '' ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Asegurate de rellenar todos los campos antes de crear el registro',
         });
         return;
      };

      // Creating the new costumer register
      try {
         await addCostumer(formValues, showInputRow.index, costumers, setCostumers);
         /* Set state to its initial state */
         setFormValues({
            name: '',
            registerNumber: '',
            personalId: '',
            giro: '',
            adress: '',
         });
         setShowInputRow({ state: false, index: undefined });
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Registro creado con éxito',
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

   useEffect(() => {
      if( searchValue === '' ) {
         setSearchResults([]);
      };
   }, [searchValue]);
   
   return (
      <>
         <header className="costumers-header">
            <section className="header-content container">
               <Link to="/" className='btn btn-back'>
                  <FiArrowLeft className='btn-icon' />
                  Volver
               </Link>
               <h3>Crea, busca o edita algún registro</h3>
            </section>
         </header>

         <section className="costumers-wrapper container">
            <header className="costumers-wrapper-header">
               <article className="wrapper-title">
                  <h3>Registros de clientes</h3>
                  <form className='costumers-form' onSubmit={ handleSearch }>
                     <input
                        type="text"
                        placeholder='Número de registro'
                        value={ searchValue }
                        onChange={ ({ target: { value } }) => setSearchValue(value) }
                     />
                  </form>
               </article>
               <hr />
            </header>
            <table className='costumers-table'>
               <thead>
                  <tr className="table-row-header">
                     <th>Razón Social</th>
                     <th>N° de registro</th>
                     <th>N.I.T o DUI</th>
                     <th>Dirección</th>
                     <th>Giro</th>
                     <th colSpan={2}>Opciones</th>
                  </tr>
               </thead>
               <tbody>
                  <>
                     { showInputRow.state &&
                        <tr className='table-row-body input-row'>
                           <td>
                              <input
                                 type="text"
                                 autoComplete='off'
                                 className='input-field'
                                 name='name'
                                 placeholder='Razón social (nombre del cliente)'
                                 value={ name }
                                 onChange={ handleInputState }
                                 onKeyDown={ (e) => {
                                    if(e.key === 'Enter') handleAddCostumer(e);
                                 } }
                              />
                           </td>
                           <td>
                              <input
                                 type="text"
                                 autoComplete='off'
                                 className='input-field'
                                 name='registerNumber'
                                 placeholder='Número de registro'
                                 value={ registerNumber }
                                 onChange={ handleInputState }
                                 onKeyDown={ (e) => {
                                    if(e.key === 'Enter') handleAddCostumer(e);
                                 } }
                              />
                           </td>
                           <td>
                              <input
                                 type="text"
                                 autoComplete='off'
                                 className='input-field'
                                 name='personalId'
                                 placeholder='NIT o DUI'
                                 value={ personalId }
                                 onChange={ handleInputState }
                                 onKeyDown={ (e) => {
                                    if(e.key === 'Enter') handleAddCostumer(e);
                                 } }
                              />
                           </td>
                           <td>
                              <input
                                 type="text"
                                 autoComplete='off'
                                 className='input-field'
                                 name='adress'
                                 placeholder='Dirección'
                                 value={ adress }
                                 onChange={ handleInputState }
                                 onKeyDown={ (e) => {
                                    if(e.key === 'Enter') handleAddCostumer(e);
                                 } }
                              />
                           </td>
                           <td colSpan={2}>
                              <input
                                 type="text"
                                 autoComplete='off'
                                 className='input-field'
                                 name='giro'
                                 placeholder='Giro'
                                 value={ giro }
                                 onChange={ handleInputState }
                                 onKeyDown={ (e) => {
                                    if(e.key === 'Enter') handleAddCostumer(e);
                                 } }
                              />
                           </td>
                           <td className='floated-button'>
                              <button
                                 className='btn btn-option visible'
                                 onClick={ handleCancel }>
                                 <FiX className='btn-icon' />
                              </button>
                           </td>
                        </tr>
                     }
                     { searchResults.length > 0 ?
                        <>
                           { searchResults.map(({
                              name,
                              registerNumber,
                              personalId,
                              adress,
                              giro,
                              id,
                           }) => (
                              <tr key={ id } className='table-row-body'>
                                 <td>{ name }</td>
                                 <td>{ registerNumber }</td>
                                 <td>{ personalId }</td>
                                 <td>{ adress }</td>
                                 <td>{ giro }</td>
                                 <td className='options-cell'>
                                    <button
                                       className='btn btn-option'
                                       onClick={ () => handleCostumerOptions(id) }>
                                       <FiMoreVertical className='btn-icon' />
                                    </button>
                                 </td>
                              </tr>
                           )) }
                        </>
                        :
                        <>
                           { costumers.length > 0 ?
                              costumers.map(({
                                 name,
                                 registerNumber,
                                 personalId,
                                 adress,
                                 giro,
                                 id,
                              }, index) => (
                                 <tr key={ id } className='table-row-body'>
                                    <td>{ name }</td>
                                    <td>{ registerNumber }</td>
                                    <td>{ personalId }</td>
                                    <td>{ adress }</td>
                                    <td>{ giro }</td>
                                    <td className='floated-button'>
                                       <button
                                          className='btn btn-option'
                                          onClick={ () => toogleAddCostumer(index) }>
                                          <FiPlusCircle className='btn-icon' />
                                       </button>
                                    </td>
                                    <td className='options-cell'>
                                       <button
                                          className='btn btn-option'
                                          onClick={ () => handleCostumerOptions(id) }>
                                          <FiMoreVertical className='btn-icon' />
                                       </button>
                                    </td>
                                 </tr>
                              ))
                              :
                              <tr className="table-row-body">
                                 <td colSpan={ 6 } className='empty-cell'>
                                    No hay registros en la base de datos
                                 </td>
                                 <td className='floated-button'>
                                    <button
                                       className='btn btn-option'
                                       onClick={ () => toogleAddCostumer() }>
                                       <FiPlusCircle className='btn-icon' />
                                    </button>
                                 </td>
                              </tr>
                           }
                        </>
                     }
                  </>
               </tbody>
            </table>
         </section>

         { showModal &&
            <CostumersModal
               showModal={ showModal }
               costumerOptions={ costumerOptions }
               costumers={ costumers }
               setCostumerOptions={ setCostumerOptions }
               setShowModal={ setShowModal }
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
            />
         }
      </>
   );
};