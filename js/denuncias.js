const contenedor = document.getElementById('denuncias_lista');
const filtroHecho = document.getElementById('filtro_hecho');

let denuncias = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarDenuncias();
    cargarHechos();

    const modal = document.getElementById("modal");
    document.getElementById("abrir_modal").onclick = () => modal.style.display = 'block';
    document.getElementById("cerrar_modal").onclick = () => modal.style.display = 'none';
    window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
});

function cargarDenuncias() {
    fetch('http://127.0.0.1:5000/api/denuncias')
        .then(res => res.json())
        .then(data => {
            denuncias = Array.isArray(data) ? data : [];
            mostrarDenuncias(denuncias);
            actualizarFiltroHechos();
        })
        .catch(err => {
            console.error(err);
            contenedor.textContent = 'Error al cargar las denuncias.';
        });
}

function mostrarDenuncias(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
        contenedor.innerHTML = '<p>No hay denuncias registradas.</p>';
        return;
    }

    const tarjetas = lista.map(d => `
        <div class="denuncia_card">
            <div class="denuncia_header">
                <h5>Denuncia N°: ${d.id}</h5>
                <h4>📅 ${d.fecha_denuncia || "Sin fecha"}</h4>
                <span class="etiqueta">${d.detenido === "Si" ? "🚨 Detenido" : "🕊️ Sin detenido"}</span>
            </div>
            <div class="denuncia_body">
                <p><strong>Lugar:</strong> ${d.lugar_denuncia}</p>
                <p><strong>Hecho:</strong> ${d.hecho_denuncia}</p>
                <p><strong>Víctima:</strong> ${d.victima}</p>
                <p><strong>Imputado:</strong> ${d.imputado}</p>
            </div>
            <div class="denuncia_body">
                <button class="btn_imprimir" onclick="abrirVentanaDenuncia(${d.id})">Imprimir Denuncia</button>
            </div>
        </div>
    `);

    contenedor.innerHTML = tarjetas.join('');
}


function actualizarFiltroHechos() {
    const hechosUnicos = [...new Set(denuncias.map(d => d.hecho_denuncia))];
    filtroHecho.innerHTML = '<option value="todos">Todos</option>';
    hechosUnicos.forEach(h => {
        const opcion = document.createElement('option');
        opcion.value = h;
        opcion.textContent = h;
        filtroHecho.appendChild(opcion);
    });

    filtroHecho.addEventListener('change', () => {
        const valor = filtroHecho.value;
        if (valor === 'todos') mostrarDenuncias(denuncias);
        else mostrarDenuncias(denuncias.filter(d => d.hecho_denuncia === valor));
    });
}

function registrarDenuncia() {
    const denuncia = {
        id: document.getElementById("input_numero").value,
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
        .then(res => res.json())
        .then(data => {
            alert(`Denuncia registrada correctamente.`);
            location.reload();
        })
        .catch(err => {
            console.error(err);
            alert("No se pudo registrar la denuncia.");
        });
}

function cargarHechos() {
    const hechos_lista = document.getElementById('select_hechos');
    fetch('http://127.0.0.1:5000/api/hechos')
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) return;
            hechos_lista.innerHTML = data.map(h => `<option value="${h.nombre}">${h.nombre}</option>`).join('');
        })
        .catch(err => console.error(err));
}

function abrirVentanaDenuncia(id) {
    window.open(`muestraDenuncia.html?paramId=${id}`, 'denuncia', 'width=800,height=600');
}
