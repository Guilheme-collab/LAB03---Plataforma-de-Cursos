import { CertificadoService } from '../service/CertificadoService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';
import { formatarData } from '../utils/formatters.mjs';

const svc = new CertificadoService();

function gerarCodigo() {
    return 'CERT-' + crypto.randomUUID().substring(0, 8).toUpperCase();
}

export function initEventos() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const trilhas = JSON.parse(localStorage.getItem("trilhas") || '[]');
    const selectUsuario = document.getElementById("usuario");
    const selectCurso = document.getElementById("curso");
    const selectTrilha = document.getElementById("trilha");
    const btnSubmit = document.querySelector("#formCertificado button[type='submit']");

    if (usuarios.length === 0 || cursos.length === 0) {
        btnSubmit.disabled = true;
        selectUsuario.innerHTML = `<option value="">Sem dados</option>`;
        selectCurso.innerHTML = `<option value="">Sem dados</option>`;
        mostrarAlerta('Cadastre Usuários e Cursos antes de emitir Certificados.', 'warning');
        return;
    }
    btnSubmit.disabled = false;
    selectUsuario.innerHTML = usuarios.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
    selectCurso.innerHTML = cursos.map(c => `<option value="${c.id}">${c.titulo}</option>`).join('');
    selectTrilha.innerHTML = `<option value=''>Nenhuma (Certificado de Curso)</option>` + trilhas.map(t => `<option value="${t.id}">${t.titulo}</option>`).join('');

    if (!document.getElementById("data").value) {
        document.getElementById("data").value = new Date().toISOString().split('T')[0];
    }
    if (!document.getElementById("codigo").value) {
        document.getElementById("codigo").value = gerarCodigo();
    }
}

export function renderTabela() {
    const tabela = document.getElementById("tabelaCertificados");
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const trilhas = JSON.parse(localStorage.getItem("trilhas") || '[]');
    const lista = svc.listar();

    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="7" class="text-center text-muted">Nenhum certificado emitido.</td></tr>`
        : lista.map(c => {
            const user = usuarios.find(u => String(u.id) === String(c.usuario));
            const cursoObj = cursos.find(cs => String(cs.id) === String(c.curso));
            const trilhaObj = trilhas.find(t => String(t.id) === String(c.trilha));
            return `
            <tr>
                <td>${c.id}</td>
                <td>${user ? user.nome : '<span class="text-danger">Excluído</span>'}</td>
                <td>${cursoObj ? cursoObj.titulo : '<span class="text-danger">Excluído</span>'}</td>
                <td>${trilhaObj ? trilhaObj.titulo : '-'}</td>
                <td><code class="text-success">${c.codigo}</code></td>
                <td>${formatarData(c.data)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="excluirCertificado('${c.id}')">Revogar</button></td>
            </tr>`;
        }).join('');
}

export function salvarCertificado(form) {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.data) dados.data = new Date().toISOString().split('T')[0];
    if (!dados.codigo) dados.codigo = gerarCodigo();
    try {
        svc.salvar(dados);
        form.reset();
        document.getElementById("data").value = new Date().toISOString().split('T')[0];
        document.getElementById("codigo").value = gerarCodigo();
        initEventos();
        renderTabela();
        mostrarAlerta('Certificado emitido com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function excluirCertificado(id) {
    if (confirm("Revogar este certificado?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Certificado revogado.', 'warning');
    }
}
