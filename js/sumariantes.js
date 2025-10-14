document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:5000/api/sumariantes')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('lista_sumariantes_div');

            if (!Array.isArray(data) || data.length === 0) {
                contenedor.innerHTML = '<p>No hay sumariantes.</p>';
                return;
            }

            const filas = data.map(s => `
                <div class="sumariante_fila">
                    ${s.nombre} ${s.edad}
                    <button onclick="eliminarSumariante(this)">Eliminar sumariante</button>
                </div>
            `);

            contenedor.innerHTML = filas.join('<br>');
        })
        .catch(error => {
            console.error('Ocurrió un error:', error);
            document.getElementById('lista_sumariantes_div').textContent = 'Error al cargar los datos.';
        });
});

function agregarSumariantePopUp() {
    const nombre = prompt("Ingrese el nombre del sumariante:");
    const edad = prompt("Ingrese la edad del sumariante:");
    const ni_sumariante = prompt("Ingrese el número de identificación del sumariante:");

    if (nombre && edad && ni_sumariante) {
        const nuevoSumariante = {   
            nombre: nombre, 
            edad: parseInt(edad),
            ni_sumariante: ni_sumariante
        };

        fetch('http://127.0.0.1:5000/api/sumariantes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoSumariante)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al agregar sumariante");
            return response.json();
        })
        .then(data => {  
            alert("Sumariante agregado exitosamente.");
            location.reload();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudo agregar el sumariante.");
        });

    } else {
        alert("Todos los campos son obligatorios.");
    }
}

function eliminarSumariante(boton) {
    const fila = boton.closest('.sumariante_fila');
    if (fila) {
        fila.remove();
    }

    fetch('http://127.0.0.1:5000/api/sumariantes', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: fila.textContent.trim().split(' ')[0] })
        })
        .then(response => { if (!response.ok) throw new Error("Error al eliminar sumariante"); return response.json(); })
        .then(data => { alert("Sumariante eliminado exitosamente.");  })
        .catch(error => { console.error("Error:", error); alert("No se pudo eliminar el sumariante.");
        })
}
