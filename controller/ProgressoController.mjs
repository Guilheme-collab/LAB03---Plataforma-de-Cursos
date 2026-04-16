import { ProgressoService } from '../service/ProgressoService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';
import { formatarData } from '../utils/formatters.mjs';

const svc = new ProgressoService();

export function initEventos() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const aulas = JSON.parse(localStorage.getItem("aulas") || '[]');
    const selectUsuario = document.getElementById("usuario");
    const selectAula = document.getElementById("aula");
    const btnSubmit = document.querySelector("#formProgresso button[type='submit']");

    if (usuarios.length === 0 || aulas.length === 0) {
        btnSubmit.disabled = true;
        selectUsuario.innerHTML = `<option value="">Sem usuários</option>`;
        selectAula.innerHTML = `<option value="">Sem aulas</option>`;
        mostrarAlerta('Cadastre Usuários e Aulas antes de registrar Progresso.', 'warning');
        return;
    }
    btnSubmit.disabled = false;
    const uVal = selectUsuario.value, aVal = selectAula.value;
    selectUsuario.innerHTML = usuarios.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
    selectAula.innerHTML = aulas.map(a => `<option value="${a.id}">${a.titulo}</option>`).join('');
    if (uVal) selectUsuario.value = uVal;
    if (aVal) selectAula.value = aVal;

    if (!document.getElementById("data").value) {
        document.getElementById("data").value = new Date().toISOString().split('T')[0];
    }
}

export function renderTabela() {
    const tabelaProgresso = document.getElementById("tabelaProgresso");
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const aulas = JSON.parse(localStorage.getItem("aulas") || '[]');
    const lista = svc.listar();

    tabelaProgresso.innerHTML = lista.length === 0
        ? `<tr><td colspan="6" class="text-center text-muted">Nenhum progresso registrado.</td></tr>`
        : lista.map((p, i) => {
            const user = usuarios.find(u => String(u.id) === String(p.usuario));
            const aulaObj = aulas.find(a => String(a.id) === String(p.aula));
            const badgeClass = p.status === 'Concluído' ? 'bg-success' : 'bg-warning text-dark';
            return `
            <tr>
                <td>${i + 1}</td>
                <td>${user ? user.nome : '<span class="text-danger">Excluído</span>'}</td>
                <td>${aulaObj ? aulaObj.titulo : '<span class="text-danger">Excluída</span>'}</td>
                <td><span class="badge ${badgeClass}">${p.status}</span></td>
                <td>${formatarData(p.data)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="excluirProgresso(${i})">Excluir</button>
                </td>
            </tr>`;
        }).join('');
}

export function salvarProgresso(form) {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.data) dados.data = new Date().toISOString().split('T')[0];
    try {
        svc.salvar(dados);
        form.reset();
        document.getElementById("data").value = new Date().toISOString().split('T')[0];
        initEventos();
        renderTabela();
        mostrarAlerta('Progresso registrado!', 'success');
    } catch (e) {
        if (e.message === "_UPDATED_") {
            form.reset();
            document.getElementById("data").value = new Date().toISOString().split('T')[0];
            initEventos();
            renderTabela();
            mostrarAlerta('Status atualizado com sucesso!', 'info');
        } else {
            mostrarAlerta(e.message, 'danger');
        }
    }
}

export function excluirProgresso(index) {
    if (confirm("Excluir este registro de progresso?")) {
        svc.excluirPorIndex(index);
        renderTabela();
        mostrarAlerta('Registro removido.', 'warning');
    }
}
