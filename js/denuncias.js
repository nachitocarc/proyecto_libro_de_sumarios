const contenedor = document.getElementById('denuncias_lista');
const filtroHecho = document.getElementById('filtro_hecho');

const filtroImputado = document.getElementById("filtroImputado");
const filtroVictima = document.getElementById("filtroVictima");
const filtroFecha = document.getElementById("filtroFecha");


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
                <p><strong>Lugar:</strong> ${d.lugar_denuncia || "No sabemos"} </p>
                <p><strong>Hecho:</strong> ${d.hecho_denuncia}</p>
                <p><strong>Víctima:</strong> ${d.victima || "NN"}</p>
                <p><strong>Imputado:</strong> ${d.imputado || "NN"}</p>
                <p><strong>Fecha elevación:</strong> ${d.fecha_elevacion || "No elevada"}</p>
            </div>
            <div class="denuncia_body">
                <button class="btn_imprimir" onclick="abrirVentanaDenuncia(${d.id})">Imprimir Denuncia</button>
                <button onclick="abrirModalElevacion(${d.id})">📤 Elevar</button>
                </div>
        </div>
    `);

    contenedor.innerHTML = tarjetas.join('');
}

function aplicarFiltros() {
    const imputado = filtroImputado.value.toLowerCase().trim();
    const victima = filtroVictima.value.toLowerCase().trim();
    const fecha = filtroFecha.value.trim();

    const resultados = denuncias.filter(d => {
        const coincideImputado =
            imputado === "" || (d.imputado && d.imputado.toLowerCase().includes(imputado));

        const coincideVictima =
            victima === "" || (d.victima && d.victima.toLowerCase().includes(victima));

        const coincideFecha =
            fecha === "" || d.fecha_denuncia === fecha;

        return coincideImputado && coincideVictima && coincideFecha;
    });

    mostrarDenuncias(resultados);
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
    const fecha = document.getElementById("input_fecha").value;
    const lugar = document.getElementById("input_lugar").value.trim();
    const victima = document.getElementById("input_victima").value.trim();
    const imputado = document.getElementById("input_imputado").value.trim();
    const hechoDenuncia = document.getElementById("select_hechos").value;
    const detenido = document.getElementById("select_detenido").value;
    const fiscaliaJuzgado = document.getElementById("select_fiscalia_juzgado").value;
    const observaciones = document.getElementById("input_observaciones").value.trim();

    if (!fecha) {
        alert("Debe ingresar una fecha.");
        return;
    }

    if (!victima && !imputado) {
        alert("Debe ingresar al menos una víctima o un imputado.");
        return;
    }

    const denuncia = {
        fecha_denuncia: fecha,
        lugar_denuncia: lugar,
        victima: victima || null,
        imputado: imputado || null,
        hecho_denuncia: hechoDenuncia,
        detenido: detenido,
        fiscalia_juzgado: fiscaliaJuzgado,
        observaciones: observaciones
    };

    fetch("http://127.0.0.1:5000/api/denuncias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(denuncia)
    })
        .then(res => {
            if (!res.ok) throw new Error("Error al registrar la denuncia");
            return res.json();
        })
        .then(() => {
            alert("Denuncia registrada con éxito");
            location.reload();
        })
        .catch(err => alert(err));
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

filtroImputado.addEventListener("input", aplicarFiltros);
filtroVictima.addEventListener("input", aplicarFiltros);
filtroFecha.addEventListener("change", aplicarFiltros);

function abrirModalElevacion(id) {
    denunciaActual = id;
    document.getElementById("modal_elevacion").style.display = "block";
}

function cerrarModalElevacion() {
    document.getElementById("modal_elevacion").style.display = "none";
}

function confirmarElevacion() {
    const fecha = document.getElementById("fecha_elevacion").value;

    fetch(`http://127.0.0.1:5000/api/denuncias/${denunciaActual}/fecha-elevacion`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({fecha_elevacion: fecha})
    })
    .then(() => location.reload());
}