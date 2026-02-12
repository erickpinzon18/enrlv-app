import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FormIndividual from './components/forms/FormIndividual';
import FormGrupal from './components/forms/FormGrupal';
import FormMasivo from './components/forms/FormMasivo';
import FormPractica from './components/forms/FormPractica';
import { DownloadIcon } from './components/Icons';
import { generatePDF } from './utils/pdfGenerator';
import { useFolios } from './hooks/useFolios';

function App() {
  const [currentTab, setCurrentTab] = useState('individual');
  const { folios, incrementFolio, getFolioDisplay } = useFolios();
  
  // Lists state
  const [studentLists, setStudentLists] = useState({
    individual: [],
    grupal: []
  });
  
  // Data States
  const [individualData, setIndividualData] = useState({
    nombre: '', matricula: '', semestre: 'PRIMERO', grupo: 'A', fechas: '', motivo: '', rawDates: []
  });

  const [grupalData, setGrupalData] = useState({
    fechaJust: '', horario: '', motivo: 'Por citado a miembro de la base estudiantil por guardia', rawDate: ''
  });

  const [masivoData, setMasivoData] = useState({
    dirigido: 'CUERPO ACADÉMICO - ESCUELA NORMAL RURAL LUIS VILLARREAL',
    cuerpo: 'Por medio del presente envío un afectuoso saludo a todos y todas...',
    fechaMas: 'Francisco I. Madero, Hidalgo, a 21 de Octubre de 2026',
    folioMas: 'ENRLV/CD/0223/2026',
    // Masivo dates usually in body text, difficult to automate without regex. 
    // User didn't request specific date picker for masivo body yet.
  });

  const [practicaData, setPracticaData] = useState({
    director: '', escuela: '', atn: '', alumno: '', pracMatricula: '', pracSemestre: '', fechaIna: '', rawDate: ''
  });

  const [commonFolio, setCommonFolio] = useState('');
  const [commonFecha, setCommonFecha] = useState('');

  // Initialize common date
  useEffect(() => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCommonFecha(`Francisco I. Madero, Hgo., a ${today.toLocaleDateString('es-ES', options)}`);
  }, []);

  // Handlers for Lists
  const handleAddStudent = (student) => {
    setStudentLists(prev => ({
      ...prev,
      [currentTab]: [...(prev[currentTab] || []), student]
    }));
  };

  const handleRemoveStudent = (index) => {
    setStudentLists(prev => ({
      ...prev,
      [currentTab]: (prev[currentTab] || []).filter((_, i) => i !== index)
    }));
  };

  const validateSecurity = () => {
    // 1. Determine which dates to check
    let datesToCheck = [];

    if (currentTab === 'individual') {
        if (!individualData.rawDates || individualData.rawDates.length === 0) {
            alert('Debe seleccionar al menos una fecha para justificar.');
            return false;
        }
        datesToCheck = individualData.rawDates;
    } else if (currentTab === 'grupal') {
        if (!grupalData.rawDate) {
            alert('Debe seleccionar la fecha de justificación.');
            return false;
        }
        datesToCheck = [grupalData.rawDate];
    } else if (currentTab === 'practica') {
        if (!practicaData.rawDate) {
            alert('Debe seleccionar la fecha de inasistencia.');
            return false;
        }
        datesToCheck = [practicaData.rawDate];
    } else {
        // Masivo / Other - Skip check or use current date?
        // Assuming no check for Masivo requested specifically, or difficult to extract.
        return true; 
    }

    // 2. Check each date against 3-day rule
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let needsPassword = false;

    for (const d of datesToCheck) {
        // d is "YYYY-MM-DD"
        const eventDate = new Date(d + 'T00:00:00');
        const diffTime = today.getTime() - eventDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (Math.abs(diffDays) > 3) {
            needsPassword = true;
            break;
        }
    }

    if (needsPassword) {
      const pwd = window.prompt("⚠️ ALERTA DE SEGURIDAD\nUna o más fechas seleccionadas tienen más de 3 días de diferencia con hoy.\nIngrese la contraseña de administrador para autorizar la excepción:");
      if (pwd !== "admin123") {
        alert("Contraseña incorrecta. Operación cancelada.");
        return false;
      }
    }
    return true;
  };

  const handleGeneratePDF = () => {
    if (!validateSecurity()) return;

    let formData = { 
        commonFolio: getFolioDisplay(currentTab),
        validationDate: new Date().toISOString().split('T')[0] // Fallback for QR validation date logic if needed
    };
    
    // Pass raw dates to generator if needed for QR extra info
    if (currentTab === 'individual') formData.rawDates = individualData.rawDates;

    let activeList = [];

    if (currentTab === 'individual') {
      formData = { ...formData, ...individualData };
      activeList = studentLists.individual;
      if (activeList.length === 0) {
          alert('Agregue al menos un estudiante a la lista.');
          return;
      }
    } else if (currentTab === 'grupal') {
      formData = { ...formData, ...grupalData };
      activeList = studentLists.grupal;
       if (activeList.length === 0) {
          alert('La lista grupal está vacía.');
          return;
      }
    } else if (currentTab === 'masivo') {
      formData = { ...formData, ...masivoData };
    } else if (currentTab === 'practica') {
      formData = { ...formData, ...practicaData };
      if (!practicaData.alumno) {
          alert('Seleccione un estudiante válido.');
          return;
      }
    }

    generatePDF(currentTab, formData, activeList);
    incrementFolio(currentTab);
  };

  const renderForm = () => {
    switch (currentTab) {
      case 'individual':
        return (
          <FormIndividual
            data={individualData}
            onChange={(key, value) => setIndividualData({ ...individualData, [key]: value })}
            studentList={studentLists.individual}
            onAddStudent={handleAddStudent}
            onRemoveStudent={handleRemoveStudent}
          />
        );
      case 'grupal':
        return (
          <FormGrupal
            data={grupalData}
            onChange={(key, value) => setGrupalData({ ...grupalData, [key]: value })}
            studentList={studentLists.grupal}
            onAddStudent={handleAddStudent}
            onRemoveStudent={handleRemoveStudent}
          />
        );
      case 'masivo':
        return (
          <FormMasivo
            data={masivoData}
            onChange={(key, value) => setMasivoData({ ...masivoData, [key]: value })}
          />
        );
      case 'practica':
        return (
          <FormPractica
            data={practicaData}
            onChange={(key, value) => setPracticaData({ ...practicaData, [key]: value })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex overflow-hidden font-sans">
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentTab={currentTab} folio={getFolioDisplay(currentTab)} />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-h-[600px]">
            <div className="p-6 md:p-10">
              {renderForm()}

              {/* Generate Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                 <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
                  {/* Info about security (implicit) */}
                  <div className="text-xs text-gray-400 italic">
                      * La fecha de emisión es automática. Las fechas de inasistencia se validan por seguridad.
                  </div>

                   <button
                        onClick={handleGeneratePDF}
                        className="w-full md:w-auto bg-gob-maroon text-white font-bold py-4 px-8 rounded shadow-lg hover:bg-red-900 transition flex items-center justify-center gap-2 text-lg"
                    >
                        <DownloadIcon className="w-6 h-6" />
                        Generar y Descargar PDF Oficial
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
