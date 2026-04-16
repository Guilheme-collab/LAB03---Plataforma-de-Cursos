import { CursoService } from '../service/CursoService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';
import { formatarData } from '../utils/formatters.mjs';

const svc = new CursoService();

export function initEventos() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const categorias = JSON.parse(localStorage.getItem("categorias") || '[]');
    const selectInstrutor = document.getElementById("instrutor");
    const selectCategoria = document.getElementById("categoria");
    const btnSubmit = document.querySelector("#formCurso button[type='submit']");

    if (usuarios.length === 0 || categorias.length === 0) {
        btnSubmit.disabled = true;
        selectInstrutor.innerHTML = `<option value="">Sem instrutores disponíveis</option>`;
        selectCategoria.innerHTML = `<option value="">Sem categorias disponíveis</option>`;
        mostrarAlerta('Cadastre Usuários e Categorias antes de criar um Curso.', 'warning');
        return;
    }
    btnSubmit.disabled = false;
    selectInstrutor.innerHTML = usuarios.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
    selectCategoria.innerHTML = categorias.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
    
    if (!document.getElementById("data").value) {
        document.getElementById("data").value = new Date().toISOString().split('T')[0];
    }
}

export function renderTabela() {
    const tabela = document.getElementById("tabelaCursos");
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const categorias = JSON.parse(localStorage.getItem("categorias") || '[]');
    const lista = svc.listar();

    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="7" class="text-center text-muted">Nenhum curso cadastrado.</td></tr>`
        : lista.map(c => {
            const instrutorObj = usuarios.find(u => String(u.id) === String(c.instrutor));
            const categoriaObj = categorias.find(cat => String(cat.id) === String(c.categoria));
            return `
            <tr>
                <td>${c.id}</td>
                <td><strong>${c.titulo}</strong><br><small class="text-muted">${c.nivel}</small></td>
                <td>${instrutorObj ? instrutorObj.nome : '<span class="text-danger">Excluído</span>'}</td>
                <td>${categoriaObj ? categoriaObj.nome : '<span class="text-danger">Excluído</span>'}</td>
                <td>${c.aulas || 0} aulas / ${c.horas || 0}h</td>
                <td>${formatarData(c.data)}</td>
                <td>
                    <button class="btn btn-outline-primary btn-sm me-1" onclick="editarCurso('${c.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirCurso('${c.id}')">Excluir</button>
                </td>
            </tr>`;
        }).join('');
}

export function salvarCurso(form) {
    const dados = Object.fromEntries(new FormData(form));
    try {
        const id = form.dataset.editId;
        if (id) {
            svc.atualizar(id, dados);
            delete form.dataset.editId;
            document.querySelector('#formCurso button[type="submit"]').textContent = 'Cadastrar';
        } else {
            svc.salvar(dados);
        }
        form.reset();
        document.getElementById("data").value = new Date().toISOString().split('T')[0];
        initEventos();
        renderTabela();
        mostrarAlerta('Curso salvo com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function editarCurso(id) {
    const c = svc.buscarPorId(id);
    if (!c) return;
    const form = document.getElementById('formCurso');
    form.titulo.value = c.titulo;
    form.descricao.value = c.descricao || '';
    form.nivel.value = c.nivel || 'Iniciante';
    form.data.value = c.data || new Date().toISOString().split('T')[0];
    form.aulas.value = c.aulas || 0;
    form.horas.value = c.horas || 0;

    // Recarregar selects e setar valores
    initEventos();
    if (c.instrutor) form.instrutor.value = c.instrutor;
    if (c.categoria) form.categoria.value = c.categoria;

    form.dataset.editId = id;
    document.querySelector('#formCurso button[type="submit"]').textContent = 'Atualizar';
    form.scrollIntoView({ behavior: 'smooth' });
}

export function excluirCurso(id) {
    if (confirm("Excluir este curso?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Curso removido.', 'warning');
    }
}
