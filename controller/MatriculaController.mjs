import { MatriculaService } from '../service/MatriculaService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';
import { formatarData } from '../utils/formatters.mjs';

const svc = new MatriculaService();

export function initEventos() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const selectUsuario = document.getElementById("usuario");
    const selectCurso = document.getElementById("curso");
    const btnSubmit = document.querySelector("#formMatricula button[type='submit']");

    if (usuarios.length === 0 || cursos.length === 0) {
        btnSubmit.disabled = true;
        selectUsuario.innerHTML = `<option value="">Sem dados suficientes</option>`;
        selectCurso.innerHTML = `<option value="">Sem dados suficientes</option>`;
        mostrarAlerta('Cadastre Usuários e Cursos antes de criar Matrículas.', 'warning');
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
    const tabela = document.getElementById("tabelaMatriculas");
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const lista = svc.listar();

    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="6" class="text-center text-muted">Nenhuma matrícula registrada.</td></tr>`
        : lista.map(m => {
            const usuarioObj = usuarios.find(u => String(u.id) === String(m.usuario));
            const cursoObj = cursos.find(c => String(c.id) === String(m.curso));
            return `
            <tr>
                <td>${m.id}</td>
                <td>${usuarioObj ? usuarioObj.nome : '<span class="text-danger">Excluído</span>'}</td>
                <td>${cursoObj ? cursoObj.titulo : '<span class="text-danger">Excluído</span>'}</td>
                <td>${formatarData(m.data)}</td>
                <td>${m.conclusao ? formatarData(m.conclusao) : '<span class="badge bg-warning text-dark">Em andamento</span>'}</td>
                <td>
                    <button class="btn btn-outline-primary btn-sm me-1" onclick="editarMatricula('${m.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirMatricula('${m.id}')">Excluir</button>
                </td>
            </tr>`;
        }).join('');
}

export function salvarMatricula(form) {
    const dados = Object.fromEntries(new FormData(form));
    try {
        const id = form.dataset.editId;
        if (id) {
            svc.atualizar(id, dados);
            delete form.dataset.editId;
            document.querySelector('#formMatricula button[type="submit"]').textContent = 'Matricular';
        } else {
            svc.salvar(dados);
        }
        form.reset();
        document.getElementById("data").value = new Date().toISOString().split('T')[0];
        initEventos();
        renderTabela();
        mostrarAlerta('Matrícula salva com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function editarMatricula(id) {
    const m = svc.buscarPorId(id);
    if (!m) return;
    const form = document.getElementById('formMatricula');
    initEventos();
    form.usuario.value = m.usuario;
    form.curso.value = m.curso;
    form.data.value = m.data || new Date().toISOString().split('T')[0];
    if (form.conclusao) form.conclusao.value = m.conclusao || '';
    form.dataset.editId = id;
    document.querySelector('#formMatricula button[type="submit"]').textContent = 'Atualizar';
    form.scrollIntoView({ behavior: 'smooth' });
}

export function excluirMatricula(id) {
    if (confirm("Cancelar esta matrícula?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Matrícula cancelada.', 'warning');
    }
}
