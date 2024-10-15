import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Alert,Checkbox, Label, Button } from 'flowbite-react';

import { HiInformationCircle } from 'react-icons/hi';
import  Components from '../components/Components'
import { useAuth } from '../server/authUser'; 
import imagePanel from '../images/uthhPanel.png';

const { LoadingButton, CustomInput, CustomInputPassword } = Components;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // funcion parar guardar la sesion en JWT

  const primaryColor = '#009944';
  const secondaryColor = '#00253c';
  const [showPassword, setShowPassword] = useState(false);
  
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(1);
  const [bloquearBoton, setBloquearBoton] = useState(false);
  
    const {
      register,
      handleSubmit,
      trigger,
      formState: { errors },
    } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };



  const onSubmit = async (data, event) => {
    event.preventDefault();
    console.log('Formulario enviado:', {data});
    
    try {
      setIsLoading(true);
      console.log('Datos enviados:', JSON.stringify(data));

      const response = await fetch('https://robe.host8b.me/WebServices/loginUser.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              ...data,
              matriculaAlum: data.matriculaAlum.toString(),
          }),
      });

      const result = await response.json();
      console.log(result);
      if (result.done) {
          console.log('Login exitoso:', result,  result.userData.JWTUser);
          login(result.userData.JWTUser, result.userData); // Almacena el token JWT en el almacenamiento local
          navigate('/');
        } 
        else 
        {     
          console.error('Error en el registro:', result.message);

          if (result.debug_info) {
              console.error('Información de depuración:', result.debug_info);
          }
          if (result.errors) {
              result.errors.forEach(error => {
                  console.error('Error específico:', error);
              });
          }
          setServerErrorMessage(result.message || 'Error en el servidor.');
      }
      
  } catch (error) {
      console.error('Error 500', error);
      
  } finally {
      setIsLoading(false);
  }
  };
  return (
    <div>
      <section className="min-h-screen flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-gradient-to-r from-gray-900 to-black flex items-center justify-center">
          <img
            className="w-full h-auto lg:h-full object-cover object-center"
            src={imagePanel}
            alt="illustration"
          />
        </div>
        <div className="lg:w-1/2 bg-white p-8 flex-col flex items-center justify-center">
         
          <img
            className="w-20 mb-4"
            src="data:image/jpeg;base64,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"
            alt="logo"
          />
          <h1 className="text-2xl font-bold text-blue-500 mb-2" style={{ color: primaryColor }}>
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Inicie su sitio web en segundos. ¿No tienes una cuenta?{' '}
            <a href="/registro" style={{ color: primaryColor }}>
              Inscribirse
            </a>
          </p>
          <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
        
            <CustomInput
              label="Matrícula"
              name="matriculaAlum"
              pattern={/^\d+$/}
              errorMessage="Solo números y sin espacios"
              errors={errors}
              register={register}
              trigger={trigger}
            />
            <div className="mb-6 relative">
              <CustomInputPassword
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                name="password"
                
                errorMessage="No cumples con el patron de contraseña"
                errors={errors}
                register={register}
                trigger={trigger}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-4 flex items-center"            
              >
                {showPassword ? 
                (
                  <FaEyeSlash className="text-gray-500" />
                ) 
                : 
                (
                  <FaEye className="text-gray-500" />
                )
                }
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="agree" />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Acuérdate de mí
                </label>
              </div>
              <a href="/recuperar-contrasena" style={{ color: primaryColor }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <LoadingButton
              isLoading={isLoading}
              loadingLabel="Cargando..."
              normalLabel="Iniciar Sesión"
              disabled={bloquearBoton}
            />
         
            <div className="flex items-center gap-2">
              <Checkbox id="agree" />
              <Label htmlFor="agree" className="flex">
                Estoy de acuerdo con el&nbsp;
                <a
                  href="/login"
                  className="dark:text-cyan-500 hover:text-cyan-700 hover:underline"
                >
                  Términos y condiciones
                </a>
              </Label>
            </div>
          </form>
        </div>
      </section>
    </div>

  );
};

export default LoginPage;
