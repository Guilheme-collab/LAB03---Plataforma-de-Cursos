class Pagamento {
    constructor(id, assinatura, valor, data, metodo, transacao) {
        this.id = id
        this.assinatura = assinatura
        this.valor = valor
        this.data = data
        this.metodo = metodo
        this.transacao = transacao
    }
}

let pagamentos = JSON.parse(localStorage.getItem("pagamentos")) || []
let assinaturas = JSON.parse(localStorage.getItem("assinaturas")) || []
let planos = JSON.parse(localStorage.getItem("planos")) || [] // Puxa os planos para pegar o preço

let id = pagamentos.length > 0 ? pagamentos[pagamentos.length - 1].id + 1 : 1

// Função para gerar um ID de transação aleatório
function gerarTransacao() {
    return 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase()
}

// Preenche a data de hoje e a transação
function preencherCamposAutomaticos() {
    document.getElementById('data').value = new Date().toISOString().split('T')[0]
    document.getElementById('transacao').value = gerarTransacao()
}

function carregar() {
    let selectAssinatura = document.getElementById('assinatura')
    selectAssinatura.innerHTML = '<option value="">Selecione...</option>'

    assinaturas.forEach(a => {
        // Salvamos o ID no value para facilitar a busca
        selectAssinatura.innerHTML += `<option value="${a.id}">${a.usuario} - ${a.plano}</option>`
    })
    preencherCamposAutomaticos()
}

// Evento: Quando selecionar a assinatura, puxa o preço do plano automaticamente
document.getElementById('assinatura').addEventListener('change', function () {
    let selectedId = this.value;
    if (selectedId) {
        let assinaturaObj = assinaturas.find(a => a.id == selectedId)
        if (assinaturaObj) {
            let planoObj = planos.find(p => p.nome === assinaturaObj.plano)
            if (planoObj) {
                document.getElementById('valor').value = planoObj.preco
            }
        }
    } else {
        document.getElementById('valor').value = ''
    }
})

formPagamento.addEventListener("submit", e => {
    e.preventDefault()

    let selectAssinatura = document.getElementById('assinatura')
    let textoAssinatura = selectAssinatura.options[selectAssinatura.selectedIndex].text

    let pagamento = new Pagamento(
        id++,
        textoAssinatura,
        document.getElementById('valor').value,
        document.getElementById('data').value,
        document.getElementById('metodo').value,
        document.getElementById('transacao').value
    )

    pagamentos.push(pagamento)
    localStorage.setItem("pagamentos", JSON.stringify(pagamentos))
    render()

    // Reseta o form e gera nova data/transação
    formPagamento.reset()
    preencherCamposAutomaticos()
    document.getElementById('valor').value = ''
})

function render() {
    let tabela = document.getElementById("tabelaPagamentos")
    tabela.innerHTML = ""

    pagamentos.forEach((p, index) => {
        tabela.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.assinatura}</td>
            <td>R$ ${p.valor}</td>
            <td>${p.metodo}</td>
            <td>${p.data}</td>
            <td><button class="btn btn-danger btn-sm" onclick="remover(${index})">Excluir</button></td>
        </tr>`
    })
}

function remover(index) {
    pagamentos.splice(index, 1)
    localStorage.setItem("pagamentos", JSON.stringify(pagamentos))
    render()
}

carregar()
render()