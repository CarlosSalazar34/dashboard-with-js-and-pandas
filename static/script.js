const table = document.querySelector('table');

document.getElementById('archivo').addEventListener('change', (event) => {
  const archivo = event.currentTarget.files[0];

  if (archivo) {
    const formData = new FormData();
    formData.append('file', archivo);

    fetch('http://127.0.0.1:3000/send-file', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        const dataFrame = data.data;
        const columnas = Object.keys(dataFrame);
        const filas = dataFrame[columnas[0]].length;

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

      })
      .catch(err => console.error(err));
  }

});


