document.addEventListener('DOMContentLoaded', function() {
    fetch('http://127.0.0.1:5000/api/sumariantes')
        .then(response => response.json()) 
        .then(data => {
            document.getElementById('sumariantes_p').textContent = data.sumariantes_p;

        })
        .catch(error => {
            console.error('Ocurrió un error:', error);
            document.getElementById('sumariantes_div').textContent = 'Error al cargar los datos.';
        });
});