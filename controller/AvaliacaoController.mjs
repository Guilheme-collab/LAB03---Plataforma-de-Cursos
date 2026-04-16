import { AvaliacaoService } from '../service/AvaliacaoService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';
import { formatarData } from '../utils/formatters.mjs';

const svc = new AvaliacaoService();

export function initEventos() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const selectUsuario = document.getElementById("usuario");
    const selectCurso = document.getElementById("curso");
    const btnSubmit = document.querySelector("#formAvaliacao button[type='submit']");

    if (usuarios.length === 0 || cursos.length === 0) {
        btnSubmit.disabled = true;
        selectUsuario.innerHTML = `<option value="">Faltam dados</option>`;
        selectCurso.innerHTML = `<option value="">Faltam dados</option>`;
        mostrarAlerta('Cadastre Usuários e Cursos antes de registrar Avaliações.', 'warning');
        return;
    }
    btnSubmit.disabled = false;
    const uVal = selectUsuario.value, cVal = selectCurso.value;
    selectUsuario.innerHTML = usuarios.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
    selectCurso.innerHTML = cursos.map(c => `<option value="${c.id}">${c.titulo}</option>`).join('');
    if (uVal) selectUsuario.value = uVal;
    if (cVal) selectCurso.value = cVal;

    if (!document.getElementById("data").value) {
        document.getElementById("data").value = new Date().toISOString().split('T')[0];
    }
}

export function renderTabela() {
    const tabela = document.getElementById("tabelaAvaliacoes");
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const lista = svc.listar();

    const estrelas = n => '⭐'.repeat(Number(n));

    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="7" class="text-center text-muted">Nenhuma avaliação registrada.</td></tr>`
        : lista.map(a => {
            const usuarioObj = usuarios.find(u => String(u.id) === String(a.usuario));
            const cursoObj = cursos.find(c => String(c.id) === String(a.curso));
            return `
            <tr>
                <td>${a.id}</td>
                <td>${usuarioObj ? usuarioObj.nome : '<span class="text-danger">Excluído</span>'}</td>
                <td>${cursoObj ? cursoObj.titulo : '<span class="text-danger">Excluído</span>'}</td>
                <td><span title="${a.nota}/5">${estrelas(a.nota)}</span></td>
                <td>${a.comentario || '-'}</td>
                <td>${formatarData(a.data)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="excluirAvaliacao('${a.id}')">Excluir</button></td>
            </tr>`;
        }).join('');
}

export function salvarAvaliacao(form) {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.data) dados.data = new Date().toISOString().split('T')[0];
    try {
        svc.salvar(dados);
        form.reset();
        document.getElementById("data").value = new Date().toISOString().split('T')[0];
        initEventos();
        renderTabela();
        mostrarAlerta('Avaliação salva com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function excluirAvaliacao(id) {
    if (confirm("Remover avaliação?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Avaliação removida.', 'warning');
    }
}
