document.addEventListener('DOMContentLoaded', function () {
    const contenedor = document.getElementById('hechos_div');
    const boton = document.getElementById('hecho_boton');
    const input = document.getElementById('hecho_input');

    function cargarHechos() {
        fetch('http://127.0.0.1:5000/api/hechos')
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    contenedor.innerHTML = '<p>No hay hechos.</p>';
                    return;
                }

                contenedor.innerHTML = '<ul>' + data.map(h => `<li>${h.nombre}</li>`).join('') + '</ul>';
            })
            .catch(error => {
                console.error('Ocurrió un error:', error);
                contenedor.textContent = 'Error al cargar los datos.';
            });
    }

    cargarHechos();});


