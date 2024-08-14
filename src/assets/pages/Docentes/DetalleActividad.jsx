import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import  Components from '../../components/Components'
const {TitlePage, ContentTitle, Paragraphs, TitleSection, LoadingButton, SelectInput} = Components;
import {Card} from 'flowbite-react';
import { useAuth } from '../../server/authUser'; // Importar el hook de autenticación
import * as XLSX from 'xlsx';
import { useForm } from 'react-hook-form';

const DetalleActividad = () => {
  const { vchClvMateria, chrGrupo, intPeriodo, intNumeroActi } = useParams();
  const [actividad, setActividad] = useState([]);
  const { isAuthenticated, userData } = useAuth(); 
  const [practicas, setPracticas] = useState([]);
  const [file, setFile] = useState(null);
  const [practicasToInsert, setPracticasToInsert] = useState([]);
  const [practicasServer, setPracticasServer] = useState([]);
  const {register, handleSubmit, trigger, formState: { errors }} = useForm();


  const fetchActividad = async () => 
    {
      const requestData = 
      {
        clvMateria: vchClvMateria,
        grupo: chrGrupo,
        periodo: intPeriodo,
        numeroActividad: intNumeroActi
      };

      try 
      {
        const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', 
        {
          method: 'POST',
          headers: 
          {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        const data = await response.json();
        console.log("Respuesta", data);

        if (data.done) 
        {
          setActividad(data.message.detalleActividad);
          setPracticas(data.message.practicasActividad);
        }
        else{

            console.log(data);
        }
      } catch (error) {
        console.error('Error: Error al cargar los datos de la actividad');
        // Manejar el error, mostrar mensaje al usuario, etc.
      }
    };
    
  useEffect(() => {
    fetchActividad();
  }, [vchClvMateria, chrGrupo, intPeriodo, intNumeroActi, ]);



  const craerJsonRubricaSelect = (count) => {
    const datosPracticas = Array.from({ length: count }, (_, index) => ({
      fkActividadGlobal: intNumeroActi,
      vchNombre: `Práctica ${index + 1}` // Puedes personalizar el nombre según tus necesidades
    }));
    setPracticasServer(datosPracticas)
    console.log("Datos de prácticas:", datosPracticas);
  
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    processFile(uploadedFile);
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Leer prácticas y rúbrica
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const practicasData = jsonData[17].slice(12, 21); // M18 a U18
          const rubros = jsonData.slice(18, 24).map(row => row[4]); // E19 a E24
          const valores = jsonData.slice(18, 24).map(row => row[11]); // L19 a L24
          const datosPracticas = practicasData.map((nombre, index) => ({
            numero: index + 1,
            nombre: nombre
          }));


          setPracticasToInsert(datosPracticas);
          const rubrica = rubros.map((rubro, index) => ({
            vchClaveCriterio: `C${index + 1}`,
            vchCriterio: `Criterio ${index + 1}`,
            vchDescripcion: rubro,
            intValor: valores[index]
          }));
          console.log("datos del excel", datosPracticas)

          resolve({ practicasServer, detalles: rubrica });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const sendDataToServer = async (data) => {
    try {
      const response = await fetch('https://robe.host8b.me/WebServices/InsertarActividades.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      console.log(data);

      const result = await response.json();
      console.log(result);

      if (result.done) {
        fetchActividad()
        alert("Datos agregados correctamente.");
      } else {
        alert("Error al agregar los datos.");
      }
    } catch (error) {
      console.error('Error al enviar los datos', error);
    }
  };

  const handleAddData = async () => {
    if (!file) {
      alert("Por favor, sube un archivo primero.");
      return;
    }

    try {
      const data = await processFile(file);
      await sendDataToServer(data);
    } catch (error) {
      console.error('Error al procesar el archivo', error);
      alert('Error al procesar el archivo.');
    }
  };

  return (
    <div>
      {isAuthenticated && userData.roles !=null? 
      (
  <section className='w-full flex flex-col'>
  <div className="m-3 flex flex-col">
    <TitlePage label={actividad.Nombre_Actividad} />
    <Paragraphs label={actividad.Descripcion_Actividad} />
  </div>
  <div className="flex flex-col md:flex-row">
    <div className='md:w-1/2 md:mr-4 flex flex-col gap-y-4 mb-3'>
      <section className="h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
        <TitleSection label="Subir Rúbricas" />
        <div className="w-full flex flex-col items-start">
          <input 
            type="file" 
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400" 
            onChange={handleFileUpload}
          />
          <div className="flex flex-col md:flex-row items-center gap-4 m-2">
            <div className="flex flex-1 items-center">
              <SelectInput
                id="numero"
                labelSelect="Seleccionar hasta qué práctica insertar"
                label="Número de Prácticas recuperados del excel"
                name="nombre"
                options={practicasToInsert}
                errorMessage="No cumples con el patrón de contraseña"
                errors={errors}
                register={register}
                trigger={trigger}
                onChange={(e) => craerJsonRubricaSelect(Number(e.target.value))}
                pattern=""
                className="flex-1"
              />
            </div>
            <div className="flex-shrink-0">
              <LoadingButton
                className="max-w-xs h-11" // Clase de Tailwind CSS para definir un ancho máximo
                loadingLabel="Cargando..."
                normalLabel="Agregar"
                onClick={handleAddData}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
    <div className='md:w-1/2 flex flex-col gap-y-4'>
      <section className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
        <TitleSection label="Detalles de la Actividad" />
        <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400 mt-3">
          <div>
            <ContentTitle label="Fecha de Solicitud: " />
            <Paragraphs label={actividad.Fecha_Solicitud} />
          </div>
          <div>
            <ContentTitle label="Fecha de Entrega: " />
            <Paragraphs label={actividad.Fecha_Entrega} />
          </div>
          <div>
            <ContentTitle label="Valor de la Actividad: " />
            <Paragraphs label={actividad.Valor_Actividad} />
          </div>
          <div>
            <ContentTitle label="Clave de Instrumento:" />
            <Paragraphs label={actividad.Clave_Instrumento} />
          </div>
          <div>
            <ContentTitle label="Modalidad:" />
            <Paragraphs label={actividad.Modalidad} />
          </div>
        </address>
      </section>
    </div>
  </div>
  <div className="container mt-8">
    <TitlePage label="Practicas" />
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {practicas!= null ? (
        practicas.map((practica) => (
            <Card
            key={practica.idPractica}
            href={`/Admin/Detalle/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${practica.idPractica}`}
            className="rounded-lg overflow-hidden shadow-lg p-0"
            theme={{
              root: {
                children: "p-0",
              }
            }}
          >
            <div className="relative h-36 ">
              <div className="pt-5 pb-6 px-4">
                <h3 className="text-xl font-bold text-gray-900 text-center">{practica.vchNombre}</h3>
                <p className="text-sm text-gray-500 text-center">{practica.vchDescripcion}</p>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-1 md:col-span-3 text-center text-gray-500 dark:text-gray-400">
          No hay actividades o prácticas disponibles.
        </div>
      )}
    </section>
  </div>
</section>
)
:
(<div>
<section className='w-full flex flex-col'>
  <div className="m-3 flex flex-col">
    <TitlePage label={actividad.Nombre_Actividad} />
    <Paragraphs label={actividad.Descripcion_Actividad} />
  </div>
  <div className="flex flex-col md:flex-row">
    <div className="container mx-auto mb-4 md:mb-0">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            href={"/Admin/Materias/gruposMaterias/"}
            className="rounded-lg overflow-hidden shadow-lg p-0"
            theme={{
              root: {
                children: "p-0",
              }
            }}
          >
            <div className="relative h-36 ">
              <div className="pt-5 pb-6 px-4">
                <h3 className="text-xl font-bold text-gray-900 text-center">Práctica {index + 1}</h3>
                <p className="text-sm text-gray-500 text-center">Descripción</p>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
    <div className='md:w-1/3 md:ml-4 flex flex-col gap-y-4'>
      <section className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
        <TitleSection label="Detalles de la Actividad" />
        <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400 mt-3">
          <div>
            <ContentTitle label="Fecha de Solicitud: " />
            <Paragraphs label={actividad.Fecha_Solicitud} />
          </div>
          <div>
            <ContentTitle label="Fecha de Entrega: " />
            <Paragraphs label={actividad.Fecha_Entrega} />
          </div>
          <div>
            <ContentTitle label="Valor de la Actividad: " />
            <Paragraphs label={actividad.Valor_Actividad} />
          </div>
          <div>
            <ContentTitle label="Clave de Instrumento:" />
            <Paragraphs label={actividad.Clave_Instrumento} />
          </div>
          <div>
            <ContentTitle label="Modalidad:" />
            <Paragraphs label={actividad.Modalidad} />
          </div>
        </address>
      </section>
    </div>
  </div>
</section>
</div>
)}

    </div>
  );
};

export default DetalleActividad;
