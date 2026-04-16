import { UsuarioService } from '../service/UsuarioService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';
import { formatarData } from '../utils/formatters.mjs';

const svc = new UsuarioService();

export function renderTabela() {
    const tbody = document.getElementById('tabelaUsuarios');
    const lista = svc.listar();

    tbody.innerHTML = lista.length === 0
        ? `<tr><td colspan="5" class="text-center text-muted">Nenhum usuário cadastrado.</td></tr>`
        : lista.map(u => `
            <tr>
                <td>${u.id}</td>
                <td><strong>${u.nome}</strong></td>
                <td>${u.email}</td>
                <td>${formatarData(u.dataCadastro)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarUsuario('${u.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="excluirUsuario('${u.id}')">Excluir</button>
                </td>
            </tr>`).join('');
}

export function salvarUsuario(form) {
    const dados = Object.fromEntries(new FormData(form));
    try {
        const id = form.dataset.editId;
        if (id) {
            svc.atualizar(id, dados);
            delete form.dataset.editId;
            document.querySelector('#formUsuario button[type="submit"]').textContent = 'Salvar';
        } else {
            svc.salvar(dados);
        }
        form.reset();
        document.getElementById("dataCadastro").value = new Date().toISOString().split('T')[0];
        renderTabela();
        mostrarAlerta('Usuário salvo com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function editarUsuario(id) {
    const u = svc.buscarPorId(String(id));
    if (!u) return;
    const form = document.getElementById('formUsuario');
    form.nome.value = u.nome;
    form.email.value = u.email;
    // form.senha.value = u.senha; // Removido: A senha fica vazia até o usuário digitar
    form.senha.value = ''; 
    if (u.dataCadastro) {
        form.dataCadastro.value = u.dataCadastro.split('T')[0];
    }
    form.dataset.editId = u.id;
    document.querySelector('#formUsuario button[type="submit"]').textContent = 'Atualizar';
    form.scrollIntoView({ behavior: 'smooth' });
}

export function excluirUsuario(id) {
    if (!confirm('Confirma a exclusão deste usuário?')) return;
    svc.excluir(id);
    renderTabela();
    mostrarAlerta('Usuário removido.', 'warning');
}
