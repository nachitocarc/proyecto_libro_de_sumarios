        const modal = document.getElementById("modal");
        const btnAbrir = document.getElementById("abrir_modal");
        const btnCerrar = document.getElementById("cerrar_modal");

        btnAbrir.onclick = () => modal.style.display = 'block';
        btnCerrar.onclick = () => modal.style.display = 'none';

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }