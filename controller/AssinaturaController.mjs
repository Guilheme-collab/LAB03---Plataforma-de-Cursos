import { AssinaturaService } from '../service/AssinaturaService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';
import { formatarData } from '../utils/formatters.mjs';

const svc = new AssinaturaService();

let _planos = [];

export function initEventos() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    _planos = JSON.parse(localStorage.getItem("planos") || '[]');
    const selectUsuario = document.getElementById('usuario');
    const selectPlano = document.getElementById('plano');

    selectUsuario.innerHTML = '<option value="">Selecione um usuário...</option>';
    selectPlano.innerHTML = '<option value="">Selecione um plano...</option>';

    if (usuarios.length === 0 || _planos.length === 0) {
        mostrarAlerta('Cadastre Usuários e Planos antes de criar Assinaturas.', 'warning');
    }

    usuarios.forEach(u => selectUsuario.innerHTML += `<option value="${u.id}">${u.nome}</option>`);
    _planos.forEach(p => selectPlano.innerHTML += `<option value="${p.id}" data-duracao="${p.duracao}">${p.nome} — ${p.duracao} meses</option>`);

    // Data início = hoje (readonly)
    const campoInicio = document.getElementById('inicio');
    if (!campoInicio.value) campoInicio.value = new Date().toISOString().split('T')[0];

    // Auto-calcular DataFim ao trocar o plano
    selectPlano.addEventListener('change', function () {
        const opt = this.selectedOptions[0];
        if (opt && opt.dataset.duracao) {
            const dur = parseInt(opt.dataset.duracao);
            const inicio = new Date(campoInicio.value + 'T00:00:00');
            inicio.setMonth(inicio.getMonth() + dur);
            document.getElementById('fim').value = inicio.toISOString().split('T')[0];
        } else {
            document.getElementById('fim').value = '';
        }
    });
}

export function renderTabela() {
    const tabela = document.getElementById("tabelaAssinaturas");
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const planos = JSON.parse(localStorage.getItem("planos") || '[]');
    const lista = svc.listar();

    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="6" class="text-center text-muted">Nenhuma assinatura registrada.</td></tr>`
        : lista.map(a => {
            const usuarioObj = usuarios.find(u => String(u.id) === String(a.usuario));
            const planoObj = planos.find(p => String(p.id) === String(a.plano));
            const hoje = new Date().toISOString().split('T')[0];
            const ativa = a.fim >= hoje;
            return `
            <tr>
                <td>${a.id}</td>
                <td>${usuarioObj ? usuarioObj.nome : '<span class="text-danger">Excluído</span>'}</td>
                <td>${planoObj ? planoObj.nome : '<span class="text-muted">'+a.plano+'</span>'}</td>
                <td>${formatarData(a.inicio)}</td>
                <td>${formatarData(a.fim)}</td>
                <td><span class="badge ${ativa ? 'bg-success' : 'bg-secondary'}">${ativa ? 'Ativa' : 'Expirada'}</span></td>
                <td>
                    <button class="btn btn-outline-primary btn-sm me-1" onclick="editarAssinatura('${a.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirAssinatura('${a.id}')">Excluir</button>
                </td>
            </tr>`;
        }).join('');
}

export function salvarAssinatura(form) {
    const dados = Object.fromEntries(new FormData(form));
    try {
        const id = form.dataset.editId;
        if (id) {
            svc.atualizar(id, dados);
            delete form.dataset.editId;
            document.querySelector('#formAssinatura button[type="submit"]').textContent = 'Assinar';
        } else {
            svc.salvar(dados);
        }
        form.reset();
        document.getElementById('inicio').value = new Date().toISOString().split('T')[0];
        document.getElementById('fim').value = '';
        initEventos();
        renderTabela();
        mostrarAlerta('Assinatura salva com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function editarAssinatura(id) {
    const a = svc.buscarPorId(id);
    if (!a) return;
    const form = document.getElementById('formAssinatura');
    initEventos();
    form.usuario.value = a.usuario;
    form.plano.value = a.plano;
    form.inicio.value = a.inicio;
    form.fim.value = a.fim;
    form.dataset.editId = id;
    document.querySelector('#formAssinatura button[type="submit"]').textContent = 'Atualizar';
    form.scrollIntoView({ behavior: 'smooth' });
}

export function excluirAssinatura(id) {
    if (confirm("Cancelar esta assinatura?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Assinatura cancelada.', 'warning');
    }
}
