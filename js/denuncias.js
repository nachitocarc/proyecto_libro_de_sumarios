contenedor = document.getElementById('denuncias_lista');

document.addEventListener('DOMContentLoaded', function () {

function cargarDenuncias() {
    fetch('http://127.0.0.1:5000/api/denuncias')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                contenedor.innerHTML = '<p class="sin-denuncias">No hay denuncias registradas.</p>';
                return;
            }

            const tarjetas = data.map(d => `
                <div class="denuncia_card">
                    <div class="denuncia_header">
                        <h4>📅 ${d.fecha_denuncia || "Sin fecha"}</h4>
                        <span class="etiqueta">${d.detenido === "Si" ? "🚨 Detenido" : "🕊️ Sin detenido"}</span>
                    </div>
                    <div class="denuncia_body">
                        <p><strong>Lugar:</strong> ${d.lugar_denuncia}</p>
                        <p><strong>Hecho:</strong> ${d.hecho_denuncia}</p>
                        <p><strong>Víctima:</strong> ${d.victima}</p>
                        <p><strong>Imputado:</strong> ${d.imputado}</p>
                        <p><strong>Fiscalía/Juzgado:</strong> ${d.fiscalia_juzgado}</p>
                        ${d.observaciones ? `<p><strong>Observaciones:</strong> ${d.observaciones}</p>` : ""}
                    </div>
                </div>
            `);

            contenedor.innerHTML = tarjetas.join("");
        })
        .catch(error => {
            console.error('Ocurrió un error:', error);
            contenedor.textContent = 'Error al cargar los datos.';
        });

    }
    cargarDenuncias();
});


function registrarDenuncia() {
    const denuncia = {
        fecha_denuncia: document.getElementById("input_fecha").value,
        lugar_denuncia: document.getElementById("input_lugar").value,
        hecho_denuncia: document.getElementById("select_hechos").value,
        observaciones: document.getElementById("input_observaciones").value,
        victima: document.getElementById("input_victima").value,
        imputado: document.getElementById("input_imputado").value,
        fiscalia_juzgado: document.getElementById("select_fiscalia_juzgado").value,
        detenido: document.getElementById("select_detenido").value

    };

    fetch('http://127.0.0.1:5000/api/denuncias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(denuncia)
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al registrar denuncia");
            return response.json();
        })
        .then(data => {
            alert("Denuncia registrada correctamente.");
            location.reload();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudo registrar la denuncia.");
        });
}

document.addEventListener('DOMContentLoaded', function () {

    function cargarHechos() {
hechos_lista = document.getElementById('select_hechos');

        fetch('http://127.0.0.1:5000/api/hechos')
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    contenedor.innerHTML = '<p>No hay hechos.</p>';
                    return;
                }
                const opciones = data.map(h => `
                    <option value="${h.nombre}">${h.nombre}</option>
                `);
                hechos_lista.innerHTML = opciones.join('');
            })
            .catch(error => {
                console.error('Ocurrió un error:', error);
                contenedor.textContent = 'Error al cargar los datos.';
            });
    }

    cargarHechos();
});



const modal = document.getElementById("modal");
const abrir_modal = document.getElementById("abrir_modal");
const cerrar_modal = document.getElementById("cerrar_modal");

abrir_modal.onclick = () => modal.style.display = 'block';
cerrar_modal.onclick = () => modal.style.display = 'none';

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}