import QRious from 'qrious';

export function generatePDF(currentType, formData, studentList, onError) {
  const { jsPDF } = window.jspdf;

  try {
    const { commonFolio, validationDate } = formData;

    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const todayStr = today.toLocaleDateString('es-ES', options);
    const fechaEmision = `Francisco I. Madero, Hgo., a ${todayStr}`;

    // ── Reusable drawing helpers (receive doc as parameter) ──

    const drawHeader = (d) => {
      d.setFontSize(8);
      d.setTextColor(100);
      d.setFont("helvetica", "normal");
      d.text("GOBIERNO DE MÉXICO", 15, 15);
      d.text("SEP", 15, 20);
      const x = 120;
      let y = 15;
      d.setFont("helvetica", "bold");
      d.setFontSize(9);
      d.setTextColor(100);
      d.text("Subsecretaría de Educación Media Superior y Superior", x, y);
      y += 4;
      d.text("Dirección General de Formación y Superación Docente", x, y);
      y += 4;
      d.text("Dirección de Educación Normal", x, y);
      y += 6;
      d.setFontSize(10);
      d.setTextColor(105, 28, 50);
      d.text('Escuela Normal Rural "Luis Villarreal"', x, y);
      y += 4;
      d.setFontSize(8);
      d.setTextColor(0);
      d.text("C.C.T. 13DNL0007B", x, y);
    };

    // drawFooter: always at the bottom of the page
    const drawFooter = (d, isCopia, label) => {
      const pageHeight = d.internal.pageSize.getHeight();
      let y = pageHeight - 37; // always anchored to bottom

      d.setFontSize(7);
      d.setTextColor(100);
      d.setFont("helvetica", "normal");
      d.text("Carretera Tepatepec-San Juan Tepa Km 2.", 15, y);
      y += 4;
      d.text("Col. Lázaro Cárdenas (El Mexe)", 15, y);
      y += 4;
      d.text("Francisco I. Madero Hgo. C.P. 42670", 15, y);
      y += 4;
      d.text("mexe.luisv@gmail.com | Tel: 772-165-2780", 15, y);
      d.setFont("helvetica", "bold");
      d.setFontSize(10);
      if (isCopia) {
        d.setTextColor(150);
        d.text("ARCHIVO - COPIA", 195, y, { align: "right" });
      } else {
        d.setTextColor(105, 28, 50);
        d.text(label || "ALUMNO - ORIGINAL", 195, y, { align: "right" });
      }
      y += 6;
      d.setFillColor(105, 28, 50);
      d.rect(0, y + 3, 210, 8, "F");
      d.setFillColor(188, 149, 92);
      d.rect(0, y, 210, 3, "F");
    };

    const drawSignature = (d, yPos) => {
      d.setFont("helvetica", "bold");
      d.setFontSize(10);
      d.setTextColor(0);
      d.text("ATENTAMENTE", 105, yPos, { align: "center" });
      d.text("MTRA. ADELINA MENDOZA AGUILAR", 105, yPos + 20, { align: "center" });
      d.setFontSize(9);
      d.setFont("helvetica", "normal");
      d.text("COORDINACIÓN DOCENTE", 105, yPos + 25, { align: "center" });
    };

    const generateQR = (studentName, customFolio) => {
      const qrData = `ENRLV-VALIDADO\nTipo: ${currentType.toUpperCase()}\nFolio: ${customFolio}\nFecha Emisión: ${todayStr}\nFecha Inasistencia: ${validationDate}\nAlumno: ${studentName}\nAprobado por: Coord. Docente`;
      const qr = new QRious({ value: qrData, size: 150 });
      return qr.toDataURL();
    };

    // Helper: ensures there is enough space on the page for closing block
    // (signature ~30mm + QR ~25mm + footer ~25mm = ~80mm)
    const ensureClosingSpace = (d, currentY, neededHeight) => {
      const pageHeight = d.internal.pageSize.getHeight();
      if (currentY + neededHeight > pageHeight - 10) {
        d.addPage();
        drawHeader(d);
        return 50;
      }
      return currentY;
    };

    // ── INDIVIDUAL / PRACTICA: One PDF per student ──

    if (currentType === 'individual' || currentType === 'practica') {
      let targets = [];
      if (currentType === 'individual') {
        targets = studentList;
      } else {
        targets = [{
          nombre: formData.alumno,
          matricula: formData.pracMatricula,
          semestre: formData.pracSemestre,
          grupo: formData.grupo || '',
        }];
      }

      if (!targets || targets.length === 0) {
        throw new Error("No hay estudiantes en la lista para generar el PDF.");
      }

      targets.forEach((student, index) => {
        const d = new jsPDF();

        const baseFolio = parseInt(commonFolio, 10) || 0;
        const studentFolio = String(baseFolio + index).padStart(4, '0');

        const drawPage = (isCopia) => {
          if (isCopia) d.addPage();

          drawHeader(d);

          d.setFontSize(9);
          d.setTextColor(0);
          d.setFont("helvetica", "normal");
          d.text(fechaEmision, 200, 40, { align: "right" });

          d.setFont("helvetica", "bold");
          d.text(`FOLIO: ${studentFolio} / 2026`, 200, 45, { align: "right" });
          d.text(`ENRLV/CD/${currentType === 'practica' ? '' : 'J/'}${studentFolio}/2026`, 200, 50, { align: "right" });

          let y = 60;

          if (currentType === 'individual') {
            d.text("DOCENTE TITULAR", 15, y);
            d.text("PRESENTE", 15, y + 5);
            y += 15;

            d.setFont("helvetica", "normal");
            const txt = `Por medio del presente se hace de su conocimiento que el/la estudiante ${student.nombre} con matrícula ${student.matricula} de ${student.semestre} semestre grupo ${student.grupo || ''}, ${formData.motivo} para los días ${formData.fechas}.`;
            const splitTxt = d.splitTextToSize(txt, 180);
            d.text(splitTxt, 15, y, { align: "justify", maxWidth: 180 });
            y += splitTxt.length * 5 + 5;

            d.text("Agradezco su atención, quedo atenta ante cualquier duda.", 15, y);
            y += 10;
            drawSignature(d, y + 20);

          } else if (currentType === 'practica') {
            const { director, escuela, atn, fechaIna } = formData;
            d.text(director || "DIRECTOR(A)", 15, y);
            y += 4;
            d.text(`DIRECTOR(A) DE LA ${escuela || 'ESCUELA'}`, 15, y);
            y += 4;
            d.text("PRESENTE.", 15, y);
            y += 8;
            d.text(`AT'N. ${atn || 'DOCENTE TITULAR'} - DOCENTE TITULAR.`, 15, y);
            y += 12;

            d.setFont("helvetica", "normal");
            const txt = `La que suscribe Mtra. Adelina Mendoza Aguilar, le envío un cordial saludo, al mismo tiempo me permito comunicar a usted que el/la estudiante ${student.nombre}, con matrícula ${student.matricula} de ${student.semestre} Semestre, quien se encuentra en la institución que atinadamente dirige como practicante, presentó una situación que no le permitió asistir a práctica el día ${fechaIna}. De antemano agradezco la atención al presente para justificar su inasistencia.`;
            const splitTxt = d.splitTextToSize(txt, 180);
            d.text(splitTxt, 15, y, { align: "justify", maxWidth: 180 });
            y += splitTxt.length * 5 + 5;
            drawSignature(d, y + 20);
          }

          // QR Code
          try {
            const qrImg = generateQR(student.nombre, studentFolio);
            if (qrImg) d.addImage(qrImg, "PNG", 15, 210, 22, 22);
          } catch (e) {
            console.error("QR Error:", e);
          }
          d.setFontSize(6);
          d.setTextColor(150);
          d.text("QR SEGURIDAD", 15, 234);

          drawFooter(d, isCopia);
        };

        drawPage(false);
        drawPage(true);

        const cleanName = (student.nombre || 'ALUMNO').replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').trim().replace(/\s+/g, '_');
        const pdfName = `ENRLV_${currentType.toUpperCase()}_${cleanName}_FOLIO_${studentFolio}.pdf`;

        setTimeout(() => {
          d.save(pdfName);
        }, index * 500);
      });

    } else {
      // ── GRUPAL / MASIVO: Single PDF ──
      const doc = new jsPDF();

      const drawFullPage = (isCopia) => {
        if (isCopia) doc.addPage();

        drawHeader(doc);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        let y = 45;
        doc.text(fechaEmision, 200, y, { align: "right" });
        y += 6;
        doc.setFont("helvetica", "bold");
        const folVal = commonFolio || '0000';
        doc.text(`FOLIO: ${folVal} / 2026`, 200, y, { align: "right" });
        doc.text(`ENRLV/CD/${currentType === 'masivo' ? '' : 'J/'}${folVal}/2026`, 200, y + 5, { align: "right" });

        y += 20;

        if (currentType === 'grupal') {
          doc.text("DOCENTE TITULAR", 15, y);
          doc.text("PRESENTE", 15, y + 5);
          y += 15;

          doc.setFont("helvetica", "normal");
          const { fechaJust = "FECHA PENDIENTE", horario = "", motivo = "" } = formData;
          const txt = `Por medio del presente se hace de su conocimiento la lista de estudiantes adjunta. Para la justificación del día ${fechaJust} en un horario de ${horario}, ${motivo}.`;

          const split = doc.splitTextToSize(txt || "", 180);
          doc.text(split, 15, y);
          y += (split.length * 5) + 5;

          const headers = [["#", "MATRÍCULA", "NOMBRE", "SEM", "GPO"]];
          const validList = Array.isArray(studentList) ? studentList : [];
          const data = validList.map((s, i) => [
            i + 1, s.matricula || '', s.nombre || '', s.semestre || '', s.grupo || ''
          ]);

          if (data.length > 0) {
            doc.autoTable({
              startY: y,
              head: headers,
              body: data,
              theme: 'grid',
              headStyles: { fillColor: [105, 28, 50], fontSize: 8 },
              bodyStyles: { fontSize: 8 },
              margin: { left: 15, right: 15, bottom: 80 },
            });
            y = doc.lastAutoTable.finalY + 10;
          } else {
            y += 20;
          }

          if (isNaN(y)) y = 200;

          // Ensure space for signature + QR + footer (~80mm needed)
          y = ensureClosingSpace(doc, y, 80);

          drawSignature(doc, y);

          try {
            const qrImg = generateQR("LISTA GRUPAL", folVal);
            if (qrImg) doc.addImage(qrImg, "PNG", 15, y, 22, 22);
          } catch (e) {
            console.error("QR Error", e);
          }

          // Footer always at page bottom
          drawFooter(doc, isCopia);

        } else if (currentType === 'masivo') {
          const { dirigido = "A QUIEN CORRESPONDA", cuerpo = "" } = formData;
          doc.text(dirigido || "A QUIEN CORRESPONDA", 15, y);
          doc.text("PRESENTE", 15, y + 5);
          y += 15;
          doc.setFont("helvetica", "normal");

          const split = doc.splitTextToSize(cuerpo || "", 180);
          doc.text(split, 15, y, { align: "justify", maxWidth: 180 });
          y += split.length * 6 + 15;
          doc.text("Agradeciendo su atención, quedo de usted.", 15, y);

          y = ensureClosingSpace(doc, y, 80);

          drawSignature(doc, y + 30);

          try {
            const qrImg = generateQR("MASIVO", folVal);
            if (qrImg) doc.addImage(qrImg, "PNG", 15, y + 30, 22, 22);
          } catch (e) { console.error(e); }

          doc.setFontSize(7);
          doc.text("C.c.p Coordinación Administrativa.", 15, y + 60);
          doc.text("C.c.p. Servicios escolares", 15, y + 64);
          doc.text("C.c.p. Archivo", 15, y + 68);

          // Footer always at page bottom, label: just "ORIGINAL" for masivo
          drawFooter(doc, isCopia, "ORIGINAL");
        }
      };

      drawFullPage(false);
      drawFullPage(true);

      const folVal = commonFolio || '0000';
      doc.save(`ENRLV_${currentType.toUpperCase()}_FOLIO_${folVal}.pdf`);
    }

  } catch (err) {
    console.error("PDF GENERATION ERROR:", err);
    if (onError) {
      onError("Error al generar el PDF: " + err.message, { variant: 'error' });
    } else {
      alert("Error al generar el PDF: " + err.message);
    }
  }
}
