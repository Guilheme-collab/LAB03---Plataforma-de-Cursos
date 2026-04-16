import { CategoriaService } from '../service/CategoriaService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';

const svc = new CategoriaService();

export function renderTabela() {
    const tabela = document.getElementById("tabelaCategorias");
    const lista = svc.listar();
    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="4" class="text-center text-muted">Nenhuma categoria cadastrada.</td></tr>`
        : lista.map(c => `
            <tr>
                <td>${c.id}</td>
                <td><strong>${c.nome}</strong></td>
                <td>${c.descricao || '-'}</td>
                <td>
                    <button class="btn btn-outline-primary btn-sm me-1" onclick="editarCategoria('${c.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirCategoria('${c.id}')">Excluir</button>
                </td>
            </tr>`).join('');
}

export function salvarCategoria(form) {
    const dados = Object.fromEntries(new FormData(form));
    try {
        const id = form.dataset.editId;
        if (id) {
            svc.atualizar(id, dados);
            delete form.dataset.editId;
            document.querySelector('#formCategoria button[type="submit"]').textContent = 'Cadastrar';
        } else {
            svc.salvar(dados);
        }
        form.reset();
        renderTabela();
        mostrarAlerta('Categoria salva com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function editarCategoria(id) {
    const c = svc.buscarPorId(id);
    if (!c) return;
    const form = document.getElementById('formCategoria');
    form.nome.value = c.nome;
    form.descricao.value = c.descricao || '';
    form.dataset.editId = id;
    document.querySelector('#formCategoria button[type="submit"]').textContent = 'Atualizar';
    form.scrollIntoView({ behavior: 'smooth' });
}

export function excluirCategoria(id) {
    if (confirm("Deseja excluir esta categoria?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Categoria removida.', 'warning');
    }
}
