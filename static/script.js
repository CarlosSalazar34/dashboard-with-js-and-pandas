const table = document.querySelector('table');
const buttonCharge = document.querySelector(".boton");
const CHARGER = document.querySelector(".charger");
const RESULT_SECTION = document.querySelector(".results");
const dataFrameName = document.querySelector(".dataframe-name");

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


