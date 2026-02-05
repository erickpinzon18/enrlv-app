import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FormIndividual from './components/forms/FormIndividual';
import FormGrupal from './components/forms/FormGrupal';
import FormMasivo from './components/forms/FormMasivo';
import FormPractica from './components/forms/FormPractica';
import { DownloadIcon } from './components/Icons';
import { generatePDF } from './utils/pdfGenerator';

function App() {
  const [currentTab, setCurrentTab] = useState('individual');
  const [studentList, setStudentList] = useState([]);
  
  // Form data for individual
  const [individualData, setIndividualData] = useState({
    nombre: '',
    matricula: '',
    semestre: 'PRIMERO',
    grupo: 'A',
    fechas: '',
    motivo: '',
  });

  // Form data for grupal
  const [grupalData, setGrupalData] = useState({
    fechaJust: '',
    horario: '',
    motivo: 'Por citado a miembro de la base estudiantil por guardia',
  });

  // Form data for masivo
  const [masivoData, setMasivoData] = useState({
    dirigido: 'CUERPO ACADÉMICO - ESCUELA NORMAL RURAL LUIS VILLARREAL',
    cuerpo: 'Por medio del presente envío un afectuoso saludo a todos y todas, al mismo tiempo me permito solicitar de su colaboración para justificar la inasistencia de todos los y las estudiantes de la academia de primer semestre el día viernes 17 de mes y año en curso en un horario de 10:10 a 15:10 Hrs. Por su participación en actividades de siembra, organizada por la cartera de Acción Campesina, como parte de las acciones de formación y trabajo comunitario.',
    fechaMas: 'Francisco I. Madero, Hidalgo, a 21 de Octubre de 2025',
    folioMas: 'ENRLV/CD/0223/2025',
  });

  // Form data for practica
  const [practicaData, setPracticaData] = useState({
    director: '',
    escuela: '',
    atn: '',
    alumno: '',
    pracMatricula: '',
    pracSemestre: '',
    fechaIna: '',
  });

  // Common fields
  const [commonFolio, setCommonFolio] = useState('0001');
  const [commonFecha, setCommonFecha] = useState('');

  // Initialize date
  useEffect(() => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = `Francisco I. Madero, Hgo., a ${today.toLocaleDateString('es-ES', options)}`;
    setCommonFecha(dateStr);
  }, []);

  // Handler for adding students
  const handleAddStudent = (student) => {
    setStudentList([...studentList, student]);
  };

  // Handler for removing students
  const handleRemoveStudent = (index) => {
    setStudentList(studentList.filter((_, i) => i !== index));
  };

  // Handler for generating PDF
  const handleGeneratePDF = () => {
    let formData = { commonFolio, commonFecha };

    if (currentTab === 'individual') {
      formData = { ...formData, ...individualData };
    } else if (currentTab === 'grupal') {
      formData = { ...formData, ...grupalData };
    } else if (currentTab === 'masivo') {
      formData = { ...formData, ...masivoData };
    } else if (currentTab === 'practica') {
      formData = { ...formData, ...practicaData };
    }

    generatePDF(currentTab, formData, studentList);
  };

  // Render current form
  const renderForm = () => {
    switch (currentTab) {
      case 'individual':
        return (
          <FormIndividual
            data={individualData}
            onChange={(key, value) => setIndividualData({ ...individualData, [key]: value })}
          />
        );
      case 'grupal':
        return (
          <FormGrupal
            data={grupalData}
            onChange={(key, value) => setGrupalData({ ...grupalData, [key]: value })}
            studentList={studentList}
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
      {/* Sidebar */}
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header currentTab={currentTab} />

        {/* Content Scrollable */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-h-[600px]">
            {/* Form Container */}
            <div className="p-6 md:p-10">
              {renderForm()}

              {/* Common Fields (Folio/Date) */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
                  <div className="flex gap-4 w-full md:w-auto">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                        Folio (Opcional)
                      </label>
                      <input
                        type="text"
                        value={commonFolio}
                        onChange={(e) => setCommonFolio(e.target.value)}
                        className="form-input text-sm w-32"
                      />
                    </div>
                    <div className="flex-1 md:w-64">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                        Fecha de Emisión
                      </label>
                      <input
                        type="text"
                        value={commonFecha}
                        onChange={(e) => setCommonFecha(e.target.value)}
                        className="form-input text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleGeneratePDF}
                    className="w-full md:w-auto bg-gob-maroon text-white font-bold py-3 px-8 rounded shadow hover:bg-red-900 transition flex items-center justify-center gap-2"
                  >
                    <DownloadIcon className="w-5 h-5" />
                    Descargar PDF
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
