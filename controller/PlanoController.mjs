import { PlanoService } from '../service/PlanoService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';
import { formatarMoeda } from '../utils/formatters.mjs';

const svc = new PlanoService();

export function renderTabela() {
    const tabela = document.getElementById("tabelaPlanos");
    const lista = svc.listar();
    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="6" class="text-center text-muted">Nenhum plano cadastrado.</td></tr>`
        : lista.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><strong>${p.nome}</strong></td>
                <td>${p.descricao || '-'}</td>
                <td class="text-success fw-semibold">${formatarMoeda(p.preco)}</td>
                <td>${p.duracao} meses</td>
                <td>
                    <button class="btn btn-outline-primary btn-sm me-1" onclick="editarPlano('${p.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirPlano('${p.id}')">Excluir</button>
                </td>
            </tr>`).join('');
}

export function salvarPlano(form) {
    const dados = Object.fromEntries(new FormData(form));
    try {
        const id = form.dataset.editId;
        if (id) {
            svc.atualizar(id, dados);
            delete form.dataset.editId;
            document.querySelector('#formPlano button[type="submit"]').textContent = 'Cadastrar';
        } else {
            svc.salvar(dados);
        }
        form.reset();
        renderTabela();
        mostrarAlerta('Plano salvo com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function editarPlano(id) {
    const p = svc.buscarPorId(id);
    if (!p) return;
    const form = document.getElementById('formPlano');
    form.nome.value = p.nome;
    form.preco.value = p.preco;
    form.duracao.value = p.duracao;
    form.descricao.value = p.descricao || '';
    form.dataset.editId = id;
    document.querySelector('#formPlano button[type="submit"]').textContent = 'Atualizar';
    form.scrollIntoView({ behavior: 'smooth' });
}

export function excluirPlano(id) {
    if (confirm("Deseja excluir este plano?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Plano removido.', 'warning');
    }
}
