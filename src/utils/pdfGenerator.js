import QRious from 'qrious';

export function generatePDF(currentType, formData, studentList) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const { commonFolio, validationDate } = formData;
  
  // Format dates
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const todayStr = today.toLocaleDateString('es-ES', options);
  const fechaEmision = `Francisco I. Madero, Hgo., a ${todayStr}`;

  // Helper Functions
  const generateQR = (studentName, customFolio) => {
    const qrData = `ENRLV-VALIDADO\nTipo: ${currentType.toUpperCase()}\nFolio: ${customFolio}\nFecha Emisión: ${todayStr}\nFecha Inasistencia: ${validationDate}\nAlumno: ${studentName}\nAprobado por: Coord. Docente`;
    const qr = new QRious({ value: qrData, size: 150 });
    return qr.toDataURL();
  };

  const drawHeader = (yOffset = 0) => {
    const maroon = [105, 28, 50];
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("GOBIERNO DE MÉXICO", 15, 15 + yOffset);
    doc.text("SEP", 15, 20 + yOffset);

    // Title Block (Right Aligned)
    const x = 120;
    let y = 15 + yOffset;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100); // Dark Gray

    doc.text("Subsecretaría de Educación Media Superior y Superior", x, y);
    y += 4;
    doc.text("Dirección General de Formación y Superación Docente", x, y);
    y += 4;
    doc.text("Dirección de Educación Normal", x, y);
    y += 6;

    doc.setFontSize(10);
    doc.setTextColor(...maroon);
    doc.text('Escuela Normal Rural "Luis Villarreal"', x, y);
    y += 4;

    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text("C.C.T. 13DNL0007B", x, y);
  };

  const drawFooter = (yOffset = 0, isCopia = false) => {
    let y = 260 + yOffset;
    if (yOffset > 0) y = 135 + yOffset; // Adjust for half-page layout (lower half)

    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    
    // Address
    doc.text("Carretera Tepatepec-San Juan Tepa Km 2.", 15, y);
    y += 4;
    doc.text("Col. Lázaro Cárdenas (El Mexe)", 15, y);
    y += 4;
    doc.text("Francisco I. Madero Hgo. C.P. 42670", 15, y);
    y += 4;
    doc.text("mexe.luisv@gmail.com | Tel: 772-165-2780", 15, y);

    // Label Original/Copia
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(isCopia ? 150 : [105, 28, 50]);
    doc.text(isCopia ? "ARCHIVO - COPIA" : "ALUMNO - ORIGINAL", 195, y, { align: "right" });

    // Decorative Bar
    y += 6;
    doc.setFillColor(...[105, 28, 50]); // Maroon
    doc.rect(0, y + 3, 210, 8, "F");
    doc.setFillColor(188, 149, 92); // Gold
    doc.rect(0, y, 210, 3, "F");
  };

  const drawSignature = (yPos) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("ATENTAMENTE", 105, yPos, { align: "center" });
    doc.text("MTRA. ADELINA MENDOZA AGUILAR", 105, yPos + 20, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("COORDINACIÓN DOCENTE", 105, yPos + 25, { align: "center" });
  };

  // --- LOGIC PER TYPE ---

  if (currentType === 'individual' || currentType === 'practica') {
    // SHORT FORMAT: 1 Page PER Student involved (Original Top, Copy Bottom)
    
    // Convert to list for iteration (Practica has 1 "student" in formData, Individual has list)
    let targets = [];
    if (currentType === 'individual') {
        targets = studentList;
    } else {
        // Practica
        targets = [{
            nombre: formData.alumno,
            matricula: formData.pracMatricula,
            semestre: formData.pracSemestre,
            // For practica, other fields are in formData
        }];
    }

    targets.forEach((student, index) => {
        if (index > 0) doc.addPage(); // New page for each student

        // --- DRAW HALF PAGE CONTENT (Reusable) ---
        const drawHalfPage = (offsetY, isCopia) => {
            // Cut line for copy
            if (isCopia) {
                doc.setDrawColor(200);
                doc.setLineWidth(0.5);
                doc.setLineDash([3, 3], 0);
                doc.line(10, offsetY - 5, 200, offsetY - 5);
                doc.setLineDash([]); // Reset
            }

            drawHeader(offsetY);

            // Folio & Date
            doc.setFontSize(9);
            doc.setTextColor(0);
            doc.setFont("helvetica", "normal");
            doc.text(fechaEmision, 200, offsetY + 35, { align: "right" });

            doc.setFont("helvetica", "bold");
            const folioText = `FOLIO: ${commonFolio} / 2026`;
            doc.text(folioText, 200, offsetY + 40, { align: "right" });
            
            const oficioRef = `ENRLV/CD/${currentType === 'practica' ? '' : 'J/'}${commonFolio}/2026`;
            doc.text(oficioRef, 200, offsetY + 45, { align: "right" });

            let y = offsetY + 55;

            // Content Body
            if (currentType === 'individual') {
                doc.text("DOCENTE TITULAR", 15, y);
                doc.text("PRESENTE", 15, y + 5);
                y += 15;

                doc.setFont("helvetica", "normal");
                // Text for THIS specific student
                const txt = `Por medio del presente se hace de su conocimiento que el/la estudiante ${student.nombre} con matrícula ${student.matricula} de ${student.semestre} semestre grupo ${student.grupo || ''}, ${formData.motivo} para los días ${formData.fechas}.`;

                const splitTxt = doc.splitTextToSize(txt, 180);
                doc.text(splitTxt, 15, y, { align: "justify", maxWidth: 180 });
                y += splitTxt.length * 5 + 5;

                doc.text("Agradezco su atención, quedo atenta ante cualquier duda.", 15, y);
                drawSignature(offsetY + 110);
            
            } else if (currentType === 'practica') {
                const { director, escuela, atn, fechaIna } = formData;
                
                doc.text(director, 15, y);
                y += 4;
                doc.text(`DIRECTOR(A) DE LA ${escuela}`, 15, y);
                y += 4;
                doc.text("PRESENTE.", 15, y);
                y += 8;
                doc.text(`AT'N. ${atn} - DOCENTE TITULAR.`, 15, y);
                y += 12;

                doc.setFont("helvetica", "normal");
                const txt = `La que suscribe Mtra. Adelina Mendoza Aguilar, le envío un cordial saludo, al mismo tiempo me permito comunicar a usted que el/la estudiante ${student.nombre}, con matrícula ${student.matricula} de ${student.semestre} Semestre, quien se encuentra en la institución que atinadamente dirige como practicante, presentó una situación que no le permitió asistir a práctica el día ${fechaIna}. De antemano agradezco la atención al presente para justificar su inasistencia.`;
                
                const splitTxt = doc.splitTextToSize(txt, 180);
                doc.text(splitTxt, 15, y, { align: "justify", maxWidth: 180 });
                drawSignature(offsetY + 115);
            }

            // QR Code
            const qrImg = generateQR(student.nombre, `${commonFolio}-${index+1}`);
            doc.addImage(qrImg, "PNG", 15, offsetY + 115, 22, 22);
            doc.setFontSize(6);
            doc.setTextColor(150);
            doc.text("QR SEGURIDAD", 15, offsetY + 139);

            drawFooter(offsetY - 125, isCopia); // Logic for footer Y adjusted inside
        };

        // Draw Top (Original)
        drawHalfPage(0, false);
        // Draw Bottom (Copia)
        drawHalfPage(148, true);
    });

  } else {
    // LONG FORMAT (Grupal / Masivo): Page 1 Original, Page 2 Copia
    // These are single documents or lists, not per student.

    const drawFullPage = (isCopia) => {
        if (isCopia) doc.addPage();
        
        drawHeader();

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        let y = 45;
        doc.text(fechaEmision, 200, y, { align: "right" });
        y += 6;
        doc.setFont("helvetica", "bold");
        doc.text(`FOLIO: ${commonFolio} / 2026`, 200, y, { align: "right" });
        doc.text(`ENRLV/CD/${currentType === 'masivo' ? '' : 'J/'}${commonFolio}/2026`, 200, y + 5, { align: "right" });

        y += 20;

        if (currentType === 'grupal') {
             doc.text("DOCENTE TITULAR", 15, y);
             doc.text("PRESENTE", 15, y + 5);
             y += 15;

             doc.setFont("helvetica", "normal");
             const { fechaJust, horario, motivo } = formData;
             const txt = `Por medio del presente se hace de su conocimiento la lista de estudiantes adjunta. Para la justificación del día ${fechaJust} en un horario de ${horario}, ${motivo}.`;
             const split = doc.splitTextToSize(txt, 180);
             doc.text(split, 15, y);
             y += split.length * 5 + 5;

             // Table
             const headers = [["#", "MATRÍCULA", "NOMBRE", "SEM", "GPO"]];
             const data = studentList.map((s, i) => [
                 i + 1, s.matricula, s.nombre, s.semestre, s.grupo
             ]);

             doc.autoTable({
                 startY: y,
                 head: headers,
                 body: data,
                 theme: 'grid',
                 headStyles: { fillColor: [105, 28, 50], fontSize: 8 },
                 bodyStyles: { fontSize: 8 },
                 margin: { left: 15, right: 15, bottom: 40 },
             });

             drawSignature(doc.lastAutoTable.finalY + 20);

             // QR logic for list? Just generate one general QR
             const qrImg = generateQR("LISTA GRUPAL", commonFolio);
             doc.addImage(qrImg, "PNG", 15, doc.lastAutoTable.finalY + 20, 22, 22);

        } else if (currentType === 'masivo') {
             const { dirigido, cuerpo } = formData;
             doc.text(dirigido, 15, y);
             doc.text("PRESENTE", 15, y + 5);
             y += 15;
             doc.setFont("helvetica", "normal");

             const split = doc.splitTextToSize(cuerpo, 180);
             doc.text(split, 15, y, { align: "justify", maxWidth: 180 });
             y += split.length * 6 + 15;
             doc.text("Agradeciendo su atención, quedo de usted.", 15, y);

             drawSignature(y + 30);
             
             const qrImg = generateQR("MASIVO", commonFolio);
             doc.addImage(qrImg, "PNG", 15, y + 30, 22, 22);

             // CCPs
            doc.setFontSize(7);
            doc.text("C.c.p Coordinación Administrativa.", 15, 240);
            doc.text("C.c.p. Servicios escolares", 15, 244);
            doc.text("C.c.p. Archivo", 15, 248);
        }

        drawFooter(0, isCopia);
    };

    drawFullPage(false); // Original
    drawFullPage(true);  // Copia
  }

  // Force Download via Blob (Chrome Fix)
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ENRLV_${currentType.toUpperCase()}_FOLIO_${commonFolio}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
