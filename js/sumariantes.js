document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:5000/api/sumariantes')
            .then(response => response.json())
            .then(data => {
                const contenedor = document.getElementById('lista_sumariantes_div');
                if (!Array.isArray(data) || data.length === 0) {
                    contenedor.innerHTML = '<p>No hay sumariantes.</p>';
                    return;
                }
                const filas = data.map(s => `${s.nombre} ${s.edad} <input type="button" value="Eliminar sumariante">`);
                contenedor.innerHTML = filas.join('<br>');
                
                
            })
            .catch(error => {
                console.error('Ocurrió un error:', error);
                document.getElementById('lista_sumariantes_div').textContent = 'Error al cargar los datos.';
            });
});