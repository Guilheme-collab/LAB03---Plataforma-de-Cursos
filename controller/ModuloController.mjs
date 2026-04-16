import { ModuloService } from '../service/ModuloService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';

const svc = new ModuloService();

export function initEventos() {
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const select = document.getElementById("curso");
    const btnSubmit = document.querySelector("#formModulo button[type='submit']");

    if (cursos.length === 0) {
        btnSubmit.disabled = true;
        select.innerHTML = `<option value="">Nenhum curso cadastrado</option>`;
        mostrarAlerta('Cadastre pelo menos um Curso antes de criar Módulos.', 'warning');
        return;
    }
    btnSubmit.disabled = false;
    const currentVal = select.value;
    select.innerHTML = cursos.map(c => `<option value="${c.id}">${c.titulo}</option>`).join('');
    if (currentVal) select.value = currentVal;
}

export function renderTabela() {
    const tabela = document.getElementById("tabelaModulos");
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const lista = svc.listar();

    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="5" class="text-center text-muted">Nenhum módulo cadastrado.</td></tr>`
        : lista.map(m => {
            const cursoObj = cursos.find(c => String(c.id) === String(m.curso));
            return `
            <tr>
                <td>${m.id}</td>
                <td>${cursoObj ? cursoObj.titulo : '<span class="text-danger">Curso Excluído</span>'}</td>
                <td><strong>${m.titulo}</strong></td>
                <td><span class="badge bg-secondary">${m.ordem}º</span></td>
                <td>
                    <button class="btn btn-outline-primary btn-sm me-1" onclick="editarModulo('${m.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirModulo('${m.id}')">Excluir</button>
                </td>
            </tr>`;
        }).join('');
}

export function salvarModulo(form) {
    const dados = Object.fromEntries(new FormData(form));
    try {
        const id = form.dataset.editId;
        if (id) {
            svc.atualizar(id, dados);
            delete form.dataset.editId;
            document.querySelector('#formModulo button[type="submit"]').textContent = 'Cadastrar';
        } else {
            svc.salvar(dados);
        }
        form.reset();
        initEventos();
        renderTabela();
        mostrarAlerta('Módulo salvo com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function editarModulo(id) {
    const m = svc.buscarPorId(id);
    if (!m) return;
    const form = document.getElementById('formModulo');
    initEventos();
    form.curso.value = m.curso;
    form.titulo.value = m.titulo;
    form.ordem.value = m.ordem;
    form.dataset.editId = id;
    document.querySelector('#formModulo button[type="submit"]').textContent = 'Atualizar';
    form.scrollIntoView({ behavior: 'smooth' });
}

export function excluirModulo(id) {
    if (confirm("Deseja remover este módulo?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Módulo removido.', 'warning');
    }
}
