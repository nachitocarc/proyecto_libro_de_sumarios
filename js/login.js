function login() {
    const ni = document.getElementById('numero_identificatorio').value;

    if (!ni) {
        alert("Ingrese su NI");
        return;
    }

    fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ni: ni })
    })
        .then(response => {
            if (!response.ok) throw new Error("NI incorrecto");
            return response.json();
        })
        .then(data => {
            if (data.rol === "administrador") {
                localStorage.setItem("rol", "administrador");
                location.href = "assets/menu.html";
            } else if (data.rol === "sumariante") {
                localStorage.setItem("rol", "sumariante");
                localStorage.setItem("sumariante", JSON.stringify(data.sumariante));
                location.href = "assets/menu.html";
            }
        })
        .catch(() => {
            alert("Número identificatorio inválido");
        });
}
