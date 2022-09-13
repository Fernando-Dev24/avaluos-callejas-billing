import React, { useState } from 'react';
/* hooks */
import { useForm } from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';
/* helpers */
import { signIn } from '../helpers/firebaseHelpers';
/* assets */
import { FiEye, FiEyeOff } from 'react-icons/fi';
import version from '../../package.json';

export const Login = ({ setAlertState, setAlertContent }) => {
   /* hooks */
   const [{ email, password }, handleSetValues] = useForm({ email: '', password: '' });
   const navigate = useNavigate();

   console.log(version);

   /* states */
   const [showPassword, setShowPassword] = useState(false);

   /* handleSubmit */
   const handleSubmit = async (e) => {
      e.preventDefault();
      setAlertState(false);
      setAlertContent({});

      // Validations
      if( email === '' || email === undefined ) {
         setAlertState(true);
         setAlertContent({ type: 'error', message: 'Escribe un correo' });
         return;
      };

      if( password === '' || password === undefined ) {
         setAlertState(true);
         setAlertContent({ type: 'error', message: 'Escribe una contraseña' });
         return;
      };

      try {
         await signIn(email, password);
         navigate('/');
      } catch(error) {
         console.log(error);
         setAlertState(true);
         let message;
         switch( error.code ){
            case 'auth/wrong-password':
               message = 'Contraseña incorrecta';
            break;
            case 'auth/user-not-found':
               message = 'Ningún correo coincide con el correo ingresado';
            break;
            default:
               message = 'Hubo un problema al iniciar sesión, intentelo de nuevo';
            break;
         };
         setAlertContent({
            type: 'error',
            message: message,
         });
      };
   };

   return (
      <section className='container full-height-container'>
         <article className="login-wrapper">
            <h2>Iniciar sesión</h2>
            <form className='login-form' onSubmit={ handleSubmit }>
               <article className="input-field">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                     type="text"
                     name='email'
                     id='email'
                     placeholder='Correo electrónico'
                     value={ email }
                     onChange={ (e) => handleSetValues(e) }
                  />
               </article>
               <article className="input-field">
                  <label htmlFor="password">Contraseña</label>
                  <div className="password-wrapper">
                     <input
                        type={ showPassword ? 'text' : 'password' }
                        name='password'
                        id='password'
                        placeholder='Contraseña'
                        value={ password }
                        onChange={ (e) => handleSetValues(e) }
                     />
                     { !showPassword ?
                        <FiEye
                           className="password-icon"
                           onClick={ () => setShowPassword(true) }
                        />
                        :
                        <FiEyeOff
                           className="password-icon"
                           onClick={ () => setShowPassword(false) }
                        />
                     }
                  </div>
               </article>
               <button className='btn btn-submit'>Iniciar sesión</button>
            </form>
         </article>
      </section>
   )
};