const table = document.querySelector('table');
const buttonCharge = document.querySelector(".boton");
const CHARGER = document.querySelector(".charger");
const RESULT_SECTION = document.querySelector(".results");
const dataFrameName = document.querySelector(".dataframe-name");
let descriptionToShow = null;


document.getElementById('archivo').addEventListener('change', (event) => {
  const archivo = event.currentTarget.files[0];

  if (archivo) {
    const formData = new FormData();
    formData.append('file', archivo);
    buttonCharge.style.backgroundColor = "grey";
    buttonCharge.textContent = "cargando...";
    CHARGER.style.visibility = "visible";
    //event.currentTarget.disabled = true;
    fetch('http://127.0.0.1:8000/send-file', {
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
        table.innerHTML = html;
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

  switch (option) {
    case 'describir':
      const resultContainer = document.querySelector('.result');
      resultContainer.innerHTML = ''; // limpia resultados anteriores

      for (let col in descriptionToShow) {
        const stats = descriptionToShow[col];
        resultContainer.innerHTML += `
      <div class="col-description">
        <h4>${col}</h4>
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
      break;
    // default:
    //   console.error('error');

  }

});


