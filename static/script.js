
class Table {
  constructor(args) {
    this.args = args;
  }

  update(inicio, final) {

    const columnas = Object.keys(this.args);
    const filas = this.args[columnas[0]].length;

    let html = '<tr class="titles">';
    for (let col of columnas) {
      html += `<th>${col}</th>`;
    }
    html += '</tr>';

    // Crear filas
    // for (let i = inicio; i < filas; i++) {
    for (let i = inicio; i < final; i++) {
      html += '<tr>';
      for (let col of columnas) {
        html += `<td>${this.args[col][i]}</td>`;
      }
      html += '</tr>';
    }

    return html;

  }
}


const table = document.querySelector('table');
const buttonCharge = document.querySelector(".boton");
const CHARGER = document.querySelector(".charger");
const RESULT_SECTION = document.querySelector(".results");
const dataFrameName = document.querySelector(".dataframe-name");
let descriptionToShow = null;
let dataFrameToShow = null;
let dimentionsToshow = null;

// === DRAG & DROP FUNCTIONALITY ===
const dropArea = document.querySelector('section.principal article');

// Evita que el navegador abra el archivo
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Estilos visuales opcionales al arrastrar
dropArea.addEventListener('dragover', () => {
  dropArea.classList.add('highlight');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('highlight');
});

dropArea.addEventListener('drop', e => {
  dropArea.classList.remove('highlight');
  const files = e.dataTransfer.files;
  if (files.length) {
    // Simulamos que el usuario subió el archivo normalmente
    const inputFile = document.getElementById('archivo');
    inputFile.files = files;

    // Dispara manualmente el evento 'change' del input
    const event = new Event('change', { bubbles: true });
    inputFile.dispatchEvent(event);
  }
});



document.getElementById('archivo').addEventListener('change', (event) => {
  const archivo = event.currentTarget.files[0];

  if (archivo) {
    const formData = new FormData();
    formData.append('file', archivo);
    buttonCharge.style.backgroundColor = "grey";
    buttonCharge.textContent = "cargando...";
    CHARGER.style.visibility = "visible";
    //event.currentTarget.disabled = true;
    fetch('http://127.0.0.1:5000/send-file', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        const dataFrame = data.data;
        const columnas = Object.keys(dataFrame);
        const dimentions = data.dimentions;
        const description = data.description;

        console.log(dimentions);
        console.log(description);
        descriptionToShow = description;
        dataFrameToShow = dataFrame;
        dimentionsToshow = dimentions;

        // const filas = dataFrame[columnas[0]].length;

        const filas = 5;

        dataFrameName.textContent = data.name;

        // Crear encabezado
        let html = '<tr class="titles">';
        for (let col of columnas) {
          html += `<th>${col}</th>`;
        }
        html += '</tr>';

        // Crear filas
        for (let i = 0; i < filas; i++) {
          html += '<tr>';
          for (let col of columnas) {
            html += `<td>${dataFrame[col][i]}</td>`;
          }
          html += '</tr>';
        }

        // Insertar en la tabla
        table.innerHTML += html;
        buttonCharge.style.backgroundColor = "#2563EB";
        buttonCharge.textContent = "Subir archivo";
        CHARGER.style.visibility = "hidden";
        RESULT_SECTION.style.display = "flex";
        //event.currentTarget.disabled = false;

      })
      .catch(err => console.error(err));
  }

});


document.getElementById('options').addEventListener('change', (event) => {
  const option = event.target.value;
  const resultContainer = document.querySelector('.result');
  let tailTable = new Table(dataFrameToShow);
  let headTable = new Table(dataFrameToShow);
  const columnas = Object.keys(dataFrameToShow);
  const htmlHead = headTable.update(0, 5);



  switch (option) {
    case 'describir':
      resultContainer.innerHTML = ''; // limpia resultados anteriores

      for (let col in descriptionToShow) {
        const stats = descriptionToShow[col];
        resultContainer.innerHTML += `
      <div class="col-description">
        <h4>${col.trim()}</h4>
        <div class="statistics">
          <p><b>count:</b> ${stats.count}</p>
          <p><b>mean:</b> ${stats.mean}</p>
          <p><b>std:</b> ${stats.std}</p>
          <p><b>min:</b> ${stats.min}</p>
          <p><b>25%:</b> ${stats['25%']}</p>
          <p><b>50%:</b> ${stats['50%']}</p>
          <p><b>75%:</b> ${stats['75%']}</p>
          <p><b>max:</b> ${stats.max}</p>
        </div>
      </div>
    `;
      }
      table.innerHTML = '';
      break;

    case "mostrar_cabecera":
      resultContainer.innerHTML = "";
      // const htmlHead = headTable.update(0, 5);
      table.innerHTML = '';
      table.innerHTML += htmlHead;
      break

    case "mostrar_final":
      // const columnas = Object.keys(dataFrameToShow);
      const totalFilas = dataFrameToShow[columnas[0]].length;
      const inicio = Math.max(0, totalFilas - 5);
      const htmlTail = tailTable.update(inicio, totalFilas);
      table.innerHTML = "";
      resultContainer.innerHTML = "";
      table.innerHTML += htmlTail;
      break;

    case "ver_forma":
      resultContainer.innerHTML = "";
      resultContainer.innerHTML += `
      <div class="dimension-card" style="
          all: revert;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;

          width: 100%;
          padding: 20px;
          border-radius: 12px;
          background-color: #f8f9fa;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
          ">
          <div class="card-item">
              <span class="value">${dimentionsToshow[0]}</span>
              <span class="label">Filas (Registros)</span>
          </div>
          <div class="card-item">
              <span class="value">${dimentionsToshow[1]}</span>
              <span class="label">Columnas (Características)</span>
          </div>
      </div>

      `;
      // resultContainer.innerHTML = "";
      table.innerHTML = '';
      table.innerHTML += htmlHead;
    //console.log(descriptionToShow)

    // default:
    //   console.error('error');

  }

});



