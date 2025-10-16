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

                const filas = data.map(h => `
                    <div class="hecho_fila" data-nombre="${h.nombre}">
                        ${h.nombre}
                        <button onclick="eliminar_hecho(this)">Eliminar</button>
                    </div>
                `);

                contenedor.innerHTML = filas.join('<br>');
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
    if (valor_hecho.trim() === "") {
        alert("El campo no puede estar vacío");
        return;
    }

    const nuevo_hecho = { nombre: valor_hecho };

    fetch('http://127.0.0.1:5000/api/hechos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo_hecho)
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al agregar hecho");
            return response.json();
        })
        .then(data => {
            alert("Hecho agregado correctamente.");
            location.reload();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudo agregar el hecho.");
        });
}

function eliminar_hecho(boton) {
    const fila = boton.closest('.hecho_fila');
    const nombreHecho = fila.dataset.nombre;

    if (!nombreHecho) {
        alert("No se encontró el hecho.");
        return;
    }

    if (!confirm(`¿Seguro que querés eliminar el hecho "${nombreHecho}"?`)) return;

    fetch('http://127.0.0.1:5000/api/hechos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreHecho })
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al eliminar hecho");
            return response.json();
        })
        .then(data => {
            alert(data.message || "Hecho eliminado correctamente.");
            fila.remove();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudo eliminar el hecho.");
        });

    setTimeout(() => { location.reload(); }, 500);
}
