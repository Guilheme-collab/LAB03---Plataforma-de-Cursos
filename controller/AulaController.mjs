import { AulaService } from '../service/AulaService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';

const svc = new AulaService();

export function initEventos() {
    const modulos = JSON.parse(localStorage.getItem("modulos") || '[]');
    const selectModulo = document.getElementById("modulo");
    const btnSubmit = document.querySelector("#formAula button[type='submit']");

    if (modulos.length === 0) {
        btnSubmit.disabled = true;
        selectModulo.innerHTML = `<option value="">Sem módulos cadastrados</option>`;
        mostrarAlerta('Cadastre pelo menos um Módulo antes de adicionar Aulas.', 'warning');
        return;
    }
    btnSubmit.disabled = false;
    const currentVal = selectModulo.value;
    selectModulo.innerHTML = modulos.map(m => `<option value="${m.id}">${m.titulo}</option>`).join('');
    if (currentVal) selectModulo.value = currentVal;
}

export function renderTabela() {
    const tabela = document.getElementById("tabelaAulas");
    const modulos = JSON.parse(localStorage.getItem("modulos") || '[]');
    const lista = svc.listar();

    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="7" class="text-center text-muted">Nenhuma aula cadastrada.</td></tr>`
        : lista.map(a => {
            const moduloObj = modulos.find(m => String(m.id) === String(a.modulo));
            return `
            <tr>
                <td>${a.id}</td>
                <td>${moduloObj ? moduloObj.titulo : '<span class="text-danger">Módulo Excluído</span>'}</td>
                <td><strong>${a.titulo}</strong></td>
                <td><span class="badge bg-info text-dark">${a.tipo}</span></td>
                <td>${a.duracao} min</td>
                <td><span class="badge bg-secondary">${a.ordem}º</span></td>
                <td>
                    <button class="btn btn-outline-primary btn-sm me-1" onclick="editarAula('${a.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirAula('${a.id}')">Excluir</button>
                </td>
            </tr>`;
        }).join('');
}

export function salvarAula(form) {
    const dados = Object.fromEntries(new FormData(form));
    try {
        const id = form.dataset.editId;
        if (id) {
            svc.atualizar(id, dados);
            delete form.dataset.editId;
            document.querySelector('#formAula button[type="submit"]').textContent = 'Cadastrar';
        } else {
            svc.salvar(dados);
        }
        form.reset();
        initEventos();
        renderTabela();
        mostrarAlerta('Aula salva com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function editarAula(id) {
    const a = svc.buscarPorId(id);
    if (!a) return;
    const form = document.getElementById('formAula');
    initEventos();
    form.modulo.value = a.modulo;
    form.titulo.value = a.titulo;
    form.tipo.value = a.tipo || 'Vídeo';
    form.url.value = a.url || '';
    form.duracao.value = a.duracao;
    form.ordem.value = a.ordem;
    form.dataset.editId = id;
    document.querySelector('#formAula button[type="submit"]').textContent = 'Atualizar';
    form.scrollIntoView({ behavior: 'smooth' });
}

export function excluirAula(id) {
    if (confirm("Deseja excluir esta aula?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Aula removida.', 'warning');
    }
}
