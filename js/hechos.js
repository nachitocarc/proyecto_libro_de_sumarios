document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:5000/api/hechos')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('hechos_div');
            if (!Array.isArray(data) || data.length === 0) {
                contenedor.innerHTML = '<p>No hay hechos.</p>';
                return;
            }
            contenedor.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Ocurrió un error:', error);
            document.getElementById('hechos_div').textContent = 'Error al cargar los datos.';
        });
});