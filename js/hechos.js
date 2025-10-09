const contenedor = document.getElementById('hechos_div');

document.addEventListener('DOMContentLoaded', function () {
    
    function cargarHechos() {
    fetch('http://127.0.0.1:5000/api/hechos')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                contenedor.innerHTML = '<p>No hay hechos.</p>';
                return;
            }
            for (let i = 0; i < data.length; i++) {
                contenedor.innerHTML += `<p>${data[i].nombre}</p>`;
            }
            
         /*   contenedor.innerHTML = '<ul>' + data.map(h => `<li>${h.nombre}</li>`).join('') + '</ul>';*/
        })
        .catch(error => {
            console.error('Ocurrió un error:', error);
            contenedor.textContent = 'Error al cargar los datos.';
        });
}
    cargarHechos();
});




function agregar_hecho() {
    const valor_hecho = document.getElementById('hecho_input').value;
    fetch('http://127.0.0.1:5000/api/hechos')
        .then(response => response.json())
        .then(data => {
            const nuevo_hecho = { nombre: valor_hecho };
            if(valor_hecho === "") {
                alert("El campo no puede estar vacío");
                return;
            }
            return fetch('http://127.0.0.1:5000/api/hechos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevo_hecho)
            });
        })
        .catch(error => {
            console.error('Ocurrió un error:', error);
            contenedor.textContent = 'Error al cargar los datos.';
        });
    setTimeout(() => { location.reload(); }, 500);
    }



