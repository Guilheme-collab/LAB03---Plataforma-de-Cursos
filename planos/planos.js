class Plano {
    constructor(id, nome, descricao, preco, duracao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.duracao = duracao;
    }
}

let planos = JSON.parse(localStorage.getItem("planos")) || [];

function gerarId() {
    return planos.length > 0 ? Math.max(...planos.map(p => p.id)) + 1 : 1;
}

document.getElementById("formPlano").addEventListener("submit", function (e) {
    e.preventDefault();

    let nome = document.getElementById("nome").value.trim();
    let preco = parseFloat(document.getElementById("preco").value);
    let duracao = parseInt(document.getElementById("duracao").value);
    let descricao = document.getElementById("descricao").value.trim();

    // Tratativa: Preço e Duração devem ser positivos
    if (preco < 0 || isNaN(preco)) {
        alert("O preço não pode ser negativo.");
        return;
    }
    if (duracao <= 0 || isNaN(duracao)) {
        alert("A duração do plano deve ser de pelo menos 1 mês.");
        return;
    }

    let plano = new Plano(gerarId(), nome, descricao, preco, duracao);
    planos.push(plano);
    localStorage.setItem("planos", JSON.stringify(planos));

    render();
    this.reset();
});

function render() {
    let tabela = document.getElementById("tabelaPlanos");
    tabela.innerHTML = "";

    planos.forEach((p, index) => {
        tabela.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}</td>
                <td>${p.duracao} meses</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(index) {
    if (confirm("Tem certeza que deseja remover este plano?")) {
        planos.splice(index, 1);
        localStorage.setItem("planos", JSON.stringify(planos));
        render();
    }
}

render();