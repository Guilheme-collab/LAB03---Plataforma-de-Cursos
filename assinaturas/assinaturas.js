class Assinatura {
    constructor(id, usuario, plano, inicio, fim) {
        this.id = id
        this.usuario = usuario
        this.plano = plano
        this.inicio = inicio
        this.fim = fim
    }
}

let assinaturas = JSON.parse(localStorage.getItem("assinaturas")) || []
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
let planos = JSON.parse(localStorage.getItem("planos")) || []

let id = assinaturas.length > 0 ? assinaturas[assinaturas.length - 1].id + 1 : 1

function carregar() {
    let selectUsuario = document.getElementById('usuario')
    let selectPlano = document.getElementById('plano')

    selectUsuario.innerHTML = '<option value="">Selecione...</option>'
    selectPlano.innerHTML = '<option value="">Selecione...</option>'

    usuarios.forEach(u => {
        selectUsuario.innerHTML += `<option value="${u.nome}">${u.nome}</option>`
    })
    planos.forEach(p => {
        selectPlano.innerHTML += `<option value="${p.nome}">${p.nome}</option>`
    })

    // Seta a data de início para hoje
    document.getElementById('inicio').value = new Date().toISOString().split('T')[0]
}

// Evento: calcula a data fim baseada na duração do plano
document.getElementById('plano').addEventListener('change', function () {
    let selectedPlano = this.value
    if (selectedPlano) {
        let planoObj = planos.find(p => p.nome === selectedPlano)
        if (planoObj && planoObj.duracao) {
            let dataInicio = new Date()
            // Adiciona a quantidade de meses da duração do plano
            dataInicio.setMonth(dataInicio.getMonth() + parseInt(planoObj.duracao))
            document.getElementById('fim').value = dataInicio.toISOString().split('T')[0]
        }
    } else {
        document.getElementById('fim').value = ''
    }
})

formAssinatura.addEventListener("submit", e => {
    e.preventDefault()

    let assinatura = new Assinatura(
        id++,
        document.getElementById('usuario').value,
        document.getElementById('plano').value,
        document.getElementById('inicio').value,
        document.getElementById('fim').value
    )

    assinaturas.push(assinatura)
    localStorage.setItem("assinaturas", JSON.stringify(assinaturas))
    render()

    formAssinatura.reset()
    // Restaura as datas automáticas após o envio
    document.getElementById('inicio').value = new Date().toISOString().split('T')[0]
    document.getElementById('fim').value = ''
})

function render() {
    let tabela = document.getElementById("tabelaAssinaturas")
    tabela.innerHTML = ""

    assinaturas.forEach((a, index) => {
        tabela.innerHTML += `
        <tr>
            <td>${a.id}</td>
            <td>${a.usuario}</td>
            <td>${a.plano}</td>
            <td>${a.inicio}</td>
            <td>${a.fim}</td>
            <td><button class="btn btn-danger btn-sm" onclick="remover(${index})">Excluir</button></td>
        </tr>`
    })
}

function remover(index) {
    assinaturas.splice(index, 1)
    localStorage.setItem("assinaturas", JSON.stringify(assinaturas))
    render()
}

carregar()
render()