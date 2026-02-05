// PDF Generation utility - Exact copy from app.html
export function generatePDF(currentType, formData, studentList) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const commonFolio = formData.commonFolio;
  const commonFecha = formData.commonFecha;

  // Helper: Header
  const addHeader = () => {
    // Colors
    const maroon = [105, 28, 50]; // #691C32
    const gold = [188, 149, 92]; // #BC955C

    // Logos placeholders (Left)
    doc.setFillColor(230, 230, 230);
    // doc.rect(15, 10, 40, 15, 'F'); // Placeholder for SEP LOGO
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("GOBIERNO DE MÉXICO", 15, 15);
    doc.text("SEP", 15, 20);

    // Title Text (Right aligned roughly)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100); // Dark Gray

    let yPos = 15;
    const rightX = 120;

    doc.text(
      "Subsecretaría de Educación Media Superior y Superior",
      rightX,
      yPos
    );
    yPos += 4;
    doc.text(
      "Dirección General de Formación y Superación Docente",
      rightX,
      yPos
    );
    yPos += 4;
    doc.text("Dirección de Educación Normal", rightX, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setTextColor(...maroon);
    doc.text("Escuela Normal Rural \"Luis Villarreal\"", rightX, yPos);
    yPos += 4;

    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text("C.C.T. 13DNL0007B", rightX, yPos);
  };

  const addFooter = () => {
    const maroon = [105, 28, 50];
    doc.setFontSize(7);
    doc.setTextColor(100);

    let y = 260;
    // Address from JUSTIF~2.pdf
    doc.text("Carretera Tepatepec-San Juan Tepa Km 2.", 15, y);
    y += 4;
    doc.text("Col. Lázaro Cárdenas (El Mexe)", 15, y);
    y += 4;
    doc.text("Francisco I. Madero Hgo. C.P. 42670", 15, y);
    y += 6;

    doc.text("mexe.luisv@gmail.com", 15, y);
    y += 4;
    doc.text("Teléfono 772-165-2780", 15, y);

    // Bottom decorative bar
    doc.setFillColor(...maroon);
    doc.rect(0, 285, 210, 12, "F");
    doc.setFillColor(188, 149, 92); // Gold
    doc.rect(0, 282, 210, 3, "F");
  };

  const addSignature = (yPos) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("ATENTAMENTE", 105, yPos, { align: "center" });
    yPos += 25;
    doc.text("MTRA. ADELINA MENDOZA AGUILAR", 105, yPos, {
      align: "center",
    });
    yPos += 5;
    doc.setFontSize(9);
    doc.text("COORDINACIÓN DOCENTE", 105, yPos, { align: "center" });
  };

  // --- DOCUMENT SPECIFIC CONTENT ---

  if (currentType === "individual") {
    const nombre = (formData.nombre || "").toUpperCase();
    const matricula = formData.matricula || "";
    const semestre = formData.semestre || "";
    const grupo = formData.grupo || "";
    const fechas = formData.fechas || "";
    const motivo = formData.motivo || "";

    // Function to draw one instance (for original and copy)
    const drawInstance = (offsetY) => {
      // Header simulation for the sub-section
      doc.setFontSize(8);
      doc.setTextColor(0);
      // Minimal header for the copy part if on same page
      if (offsetY > 10) {
        doc.line(10, offsetY, 200, offsetY); // Separator
        offsetY += 10;
      }

      // Content
      doc.setFontSize(10);
      doc.text("EDUCACIÓN", 15, offsetY + 10);
      doc.setFontSize(8);
      doc.text("SECRETARIA DE EDUCACIÓN PÚBLICA", 15, offsetY + 15);

      doc.setFontSize(10);
      doc.text(commonFecha, 200, offsetY + 10, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.text(`FOLIO: ${commonFolio}`, 200, offsetY + 15, {
        align: "right",
      });
      doc.text(`ENRLV/CD/J/${commonFolio}/2025`, 200, offsetY + 20, {
        align: "right",
      });
      doc.text("Asunto: Justificante", 200, offsetY + 25, {
        align: "right",
      });

      doc.text("DOCENTE TITULAR", 15, offsetY + 35);
      doc.text("PRESENTE", 15, offsetY + 40);

      doc.setFont("helvetica", "normal");
      const bodyText = `Por medio del presente se hace de su conocimiento que la estudiante ${nombre} con matrícula ${matricula} de ${semestre} semestre grupo ${grupo} ${motivo} los días ${fechas}.`;

      const splitText = doc.splitTextToSize(bodyText, 180);
      doc.text(splitText, 15, offsetY + 50);

      doc.text(
        "Agradezco su atención, quedo atenta ante cualquier duda.",
        15,
        offsetY + 50 + splitText.length * 5 + 5
      );

      // Signature
      doc.setFont("helvetica", "bold");
      doc.text("ATENTAMENTE", 105, offsetY + 85, { align: "center" });
      doc.text("MTRA. ADELINA MENDOZA AGUILAR", 105, offsetY + 110, {
        align: "center",
      });
      doc.setFontSize(9);
      doc.text("COORDINACIÓN DOCENTE", 105, offsetY + 115, {
        align: "center",
      });
    };

    addHeader();
    addFooter();
    // Draw Original
    drawInstance(40);

    // Draw Copy (Half page)
    // drawInstance(160); // Optional: If they want 2 per page like JUSTIFICANTE_0159.pdf
  } else if (currentType === "grupal") {
    addHeader();
    addFooter();

    const fechaJust = formData.fechaJust || "";
    const horario = formData.horario || "";
    const motivo = formData.motivo || "";

    let y = 50;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(commonFecha, 200, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`FOLIO: ${commonFolio} / 2025`, 200, y, { align: "right" });

    y += 15;
    doc.text("DOCENTE TITULAR", 15, y);
    y += 5;
    doc.text("PRESENTE", 15, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    const intro = `Por medio del presente se hace de su conocimiento la lista de estudiantes. Para la justificación del día ${fechaJust} en un horario de ${horario}, ${motivo}.`;
    const splitIntro = doc.splitTextToSize(intro, 180);
    doc.text(splitIntro, 15, y);
    y += splitIntro.length * 5 + 5;

    // AutoTable
    const headers = [["#", "MATRÍCULA", "NOMBRE", "SEMESTRE", "GRUPO"]];
    const data = studentList.map((s, i) => [
      i + 1,
      s.matricula,
      s.nombre,
      s.semestre,
      s.grupo,
    ]);

    doc.autoTable({
      startY: y,
      head: headers,
      body: data,
      theme: "grid",
      headStyles: {
        fillColor: [105, 28, 50],
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 8 },
      margin: { left: 15, right: 15 },
    });

    addSignature(doc.lastAutoTable.finalY + 20);
  } else if (currentType === "masivo") {
    addHeader();
    addFooter();

    const dirigido = formData.dirigido || "";
    const cuerpo = formData.cuerpo || "";
    const fechaMas = formData.fechaMas || "";
    const folioMas = formData.folioMas || "";

    let y = 50;
    doc.setFontSize(10);
    doc.text(fechaMas, 200, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text(folioMas, 200, y, { align: "right" });
    doc.text("Asunto: El que se indica.", 200, y + 5, { align: "right" });

    y += 20;
    doc.text(dirigido, 15, y);
    y += 5;
    doc.text("PRESENTE", 15, y);

    y += 15;
    doc.setFont("helvetica", "normal");
    const splitBody = doc.splitTextToSize(cuerpo, 180);
    doc.text(splitBody, 15, y, { align: "justify", maxWidth: 180 });

    y += splitBody.length * 6 + 10;
    doc.text("Agradeciendo su atención queda de usted.", 15, y);

    addSignature(y + 30);

    // CCPs
    doc.setFontSize(7);
    doc.text("C.c.p Coordinación Administrativa.", 15, 240);
    doc.text("C.c.p. Servicios escolares", 15, 244);
    doc.text("C.c.p. Archivo", 15, 248);
  } else if (currentType === "practica") {
    addHeader();
    addFooter();

    const director = formData.director || "";
    const escuela = formData.escuela || "";
    const atn = formData.atn || "";
    const alumno = formData.alumno || "";
    const mat = formData.pracMatricula || "";
    const sem = formData.pracSemestre || "";
    const fechaIna = formData.fechaIna || "";

    let y = 50;
    doc.setFontSize(10);
    doc.text(commonFecha, 200, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`No. Oficio: ENRLV/CD/${commonFolio}/2025`, 200, y, {
      align: "right",
    });

    y += 20;
    doc.text(director, 15, y);
    y += 5;
    doc.text(`DIRECTOR DE LA ${escuela}`, 15, y);
    y += 5;
    doc.text("PRESENTE.", 15, y);

    y += 10;
    doc.text(`AT'N. ${atn}`, 15, y);
    doc.text("DOCENTE TITULAR.", 15, y + 5);

    y += 20;
    doc.setFont("helvetica", "normal");
    const text = `La que suscribe Mtra. Adelina Mendoza Aguilar, coordinadora docente de la Escuela Normal Rural Luis Villarreal, le envío un cordial saludo por este medio, al mismo tiempo me permito comunicar a usted que la estudiante ${alumno}, con matrícula ${mat} de ${sem.toLowerCase()} semestre quien se encuentra en la institución que atinadamente dirige, como docente en formación (practicante), presentó una situación de salud lo que no permitió asistir a práctica como se tenía programada el día ${fechaIna} del año en curso, de antemano agradezco la atención al presente para justificar la inasistencia del estudiante.`;

    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 15, y, { align: "justify", maxWidth: 180 });

    y += splitText.length * 6 + 10;
    doc.text(
      "Sin otro particular quedo a sus ordenes para cualquier duda y/o aclaración.",
      15,
      y
    );

    addSignature(y + 30);
  }

  // Forzar nombre de archivo con método alternativo
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${currentType}_generated.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
