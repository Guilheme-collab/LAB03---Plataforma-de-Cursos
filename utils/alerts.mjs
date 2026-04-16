export function mostrarAlerta(msg, tipo = 'success') {
    let div = document.getElementById('alerta-global');
    if (!div) {
        div = document.createElement('div');
        div.id = 'alerta-global';
        div.style.position = 'fixed';
        div.style.top = '20px';
        div.style.left = '50%';
        div.style.transform = 'translateX(-50%)';
        div.style.zIndex = '9999';
        document.body.appendChild(div);
    }
    div.className = `alert alert-${tipo}`;
    div.textContent = msg;
    div.style.display = 'block';
    setTimeout(() => {
        div.style.display = 'none';
    }, 3000);
}
