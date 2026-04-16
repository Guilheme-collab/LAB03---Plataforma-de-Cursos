import { PagamentoService } from '../service/PagamentoService.mjs';
import { mostrarAlerta } from '../utils/alerts.mjs';
import { formatarData, formatarMoeda } from '../utils/formatters.mjs';

const svc = new PagamentoService();

function gerarTransacao() {
    return 'TX-' + crypto.randomUUID().substring(0, 8).toUpperCase();
}

function preencherCamposAutomaticos() {
    document.getElementById('data').value = new Date().toISOString().split('T')[0];
    if (!document.getElementById('transacao').value) {
        document.getElementById('transacao').value = gerarTransacao();
    }
}

export function initEventos() {
    const assinaturas = JSON.parse(localStorage.getItem("assinaturas") || '[]');
    const planos = JSON.parse(localStorage.getItem("planos") || '[]');
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const selectAssinatura = document.getElementById('assinatura');

    selectAssinatura.innerHTML = '<option value="">Selecione uma assinatura...</option>';
    assinaturas.forEach(a => {
        const uObj = usuarios.find(u => String(u.id) === String(a.usuario));
        const pObj = planos.find(p => String(p.id) === String(a.plano));
        const label = `${uObj ? uObj.nome : a.usuario} — ${pObj ? pObj.nome : a.plano}`;
        selectAssinatura.innerHTML += `<option value="${a.id}" data-preco="${pObj ? pObj.preco : ''}">${label}</option>`;
    });

    if (assinaturas.length === 0) {
        mostrarAlerta('Cadastre Assinaturas antes de registrar Pagamentos.', 'warning');
    }

    preencherCamposAutomaticos();

    // Auto-preencher valor ao selecionar assinatura
    selectAssinatura.addEventListener('change', function () {
        const opt = this.selectedOptions[0];
        if (opt && opt.dataset.preco) {
            document.getElementById('valor').value = opt.dataset.preco;
        } else {
            document.getElementById('valor').value = '';
        }
        document.getElementById('transacao').value = gerarTransacao();
    });
}

export function renderTabela() {
    const tabela = document.getElementById("tabelaPagamentos");
    const assinaturas = JSON.parse(localStorage.getItem("assinaturas") || '[]');
    const planos = JSON.parse(localStorage.getItem("planos") || '[]');
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || '[]');
    const lista = svc.listar();

    tabela.innerHTML = lista.length === 0
        ? `<tr><td colspan="7" class="text-center text-muted">Nenhum pagamento registrado.</td></tr>`
        : lista.map(p => {
            const assObj = assinaturas.find(a => String(a.id) === String(p.assinatura));
            const uObj = assObj ? usuarios.find(u => String(u.id) === String(assObj.usuario)) : null;
            return `
            <tr>
                <td>${p.id}</td>
                <td>${uObj ? uObj.nome : p.assinatura}</td>
                <td class="text-success fw-semibold">${formatarMoeda(p.valor)}</td>
                <td><span class="badge bg-primary">${p.metodo}</span></td>
                <td>${formatarData(p.data)}</td>
                <td><code>${p.transacao}</code></td>
                <td><button class="btn btn-danger btn-sm" onclick="excluirPagamento('${p.id}')">Excluir</button></td>
            </tr>`;
        }).join('');
}

export function salvarPagamento(form) {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.transacao) dados.transacao = gerarTransacao();
    if (!dados.data) dados.data = new Date().toISOString().split('T')[0];

    try {
        svc.salvar(dados);
        form.reset();
        preencherCamposAutomaticos();
        document.getElementById('valor').value = '';
        initEventos();
        renderTabela();
        mostrarAlerta('Pagamento confirmado com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function excluirPagamento(id) {
    if (confirm("Excluir este pagamento?")) {
        svc.excluir(id);
        renderTabela();
        mostrarAlerta('Pagamento removido.', 'warning');
    }
}
