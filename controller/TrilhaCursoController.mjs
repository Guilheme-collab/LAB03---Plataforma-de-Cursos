import { TrilhaCursoService } from '../service/TrilhaCursoService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';

const svc = new TrilhaCursoService();

export function initEventos() {
    const trilhas = JSON.parse(localStorage.getItem("trilhas") || '[]');
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const selectTrilha = document.getElementById("trilha");
    const selectCurso = document.getElementById("curso");
    const btnSubmit = document.querySelector("#formTrilhaCurso button[type='submit']");

    if (trilhas.length === 0 || cursos.length === 0) {
        btnSubmit.disabled = true;
        selectTrilha.innerHTML = `<option value="">Sem dados disponíveis</option>`;
        selectCurso.innerHTML = `<option value="">Sem dados disponíveis</option>`;
        mostrarAlerta('Cadastre Trilhas e Cursos antes de criar vínculos.', 'warning');
        return;
    }
    btnSubmit.disabled = false;
    selectTrilha.innerHTML = trilhas.map(t => `<option value="${t.id}">${t.titulo}</option>`).join('');
    selectCurso.innerHTML = cursos.map(c => `<option value="${c.id}">${c.titulo}</option>`).join('');
}

export function renderTabela() {
    const tabela = document.getElementById("tabelaTrilhaCursos");
    const trilhas = JSON.parse(localStorage.getItem("trilhas") || '[]');
    const cursos = JSON.parse(localStorage.getItem("cursos") || '[]');
    const lista = svc.listar();

    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="5" class="text-center text-muted">Nenhum vínculo registrado.</td></tr>`
        : lista.map((d, i) => {
            const trilhaObj = trilhas.find(t => String(t.id) === String(d.trilha));
            const cursoObj = cursos.find(c => String(c.id) === String(d.curso));
            return `
            <tr>
                <td>${d.id}</td>
                <td>${trilhaObj ? trilhaObj.titulo : '<span class="text-danger">Excluída</span>'}</td>
                <td>${cursoObj ? cursoObj.titulo : '<span class="text-danger">Excluído</span>'}</td>
                <td><span class="badge bg-secondary">${d.ordem}º</span></td>
                <td><button class="btn btn-danger btn-sm" onclick="excluirTrilhaCurso('${d.id}')">Excluir</button></td>
            </tr>`;
        }).join('');
}

export function salvarTrilhaCurso(form) {
    const dados = Object.fromEntries(new FormData(form));
    try {
        svc.salvar(dados);
        form.reset();
        initEventos();
        renderTabela();
        mostrarAlerta('Curso vinculado à trilha com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function excluirTrilhaCurso(id) {
    if (confirm("Remover este curso da trilha?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Vínculo removido.', 'warning');
    }
}
