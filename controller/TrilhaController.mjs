import { TrilhaService } from '../service/TrilhaService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';

const svc = new TrilhaService();

export function initEventos() {
    const categorias = JSON.parse(localStorage.getItem("categorias") || '[]');
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const selectCategoria = document.getElementById("categoria");
    const selectCurso = document.getElementById("curso");
    const btnSubmit = document.querySelector("#formTrilha button[type='submit']");

    if (categorias.length === 0 || cursos.length === 0) {
        btnSubmit.disabled = true;
        selectCategoria.innerHTML = `<option value="">Faltam dados</option>`;
        selectCurso.innerHTML = `<option value="">Faltam dados</option>`;
        mostrarAlerta('Cadastre Categorias e Cursos antes de criar Trilhas.', 'warning');
        return;
    }
    btnSubmit.disabled = false;
    const catVal = selectCategoria.value, curVal = selectCurso.value;
    selectCategoria.innerHTML = categorias.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
    selectCurso.innerHTML = cursos.map(c => `<option value="${c.id}">${c.titulo}</option>`).join('');
    if (catVal) selectCategoria.value = catVal;
    if (curVal) selectCurso.value = curVal;
}

export function renderTabela() {
    const tabela = document.getElementById("tabelaTrilhas");
    const categorias = JSON.parse(localStorage.getItem("categorias") || '[]');
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const lista = svc.listar();

    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="6" class="text-center text-muted">Nenhuma trilha cadastrada.</td></tr>`
        : lista.map(t => {
            const catObj = categorias.find(c => String(c.id) === String(t.categoria));
            const curObj = cursos.find(c => String(c.id) === String(t.curso));
            return `
            <tr>
                <td>${t.id}</td>
                <td><strong>${t.titulo}</strong></td>
                <td>${t.descricao || '-'}</td>
                <td>${catObj ? catObj.nome : t.categoria}</td>
                <td>${curObj ? curObj.titulo : t.curso}</td>
                <td>
                    <button class="btn btn-outline-primary btn-sm me-1" onclick="editarTrilha('${t.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirTrilha('${t.id}')">Excluir</button>
                </td>
            </tr>`;
        }).join('');
}

export function salvarTrilha(form) {
    const dados = Object.fromEntries(new FormData(form));
    try {
        const id = form.dataset.editId;
        if (id) {
            svc.atualizar(id, dados);
            delete form.dataset.editId;
            document.querySelector('#formTrilha button[type="submit"]').textContent = 'Cadastrar';
        } else {
            svc.salvar(dados);
        }
        form.reset();
        initEventos();
        renderTabela();
        mostrarAlerta('Trilha salva com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function editarTrilha(id) {
    const t = svc.buscarPorId(id);
    if (!t) return;
    const form = document.getElementById('formTrilha');
    initEventos();
    form.titulo.value = t.titulo;
    form.descricao.value = t.descricao || '';
    form.categoria.value = t.categoria;
    form.curso.value = t.curso;
    form.dataset.editId = id;
    document.querySelector('#formTrilha button[type="submit"]').textContent = 'Atualizar';
    form.scrollIntoView({ behavior: 'smooth' });
}

export function excluirTrilha(id) {
    if (confirm("Remover esta trilha?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Trilha removida.', 'warning');
    }
}
