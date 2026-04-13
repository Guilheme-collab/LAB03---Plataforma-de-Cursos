class Categoria {
    constructor(id, nome, descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }
}

let categorias = JSON.parse(localStorage.getItem("categorias")) || [];

function gerarId() {
    return categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) + 1 : 1;
}

document.getElementById("formCategoria").addEventListener("submit", function (e) {
    e.preventDefault();

    let nomeVal = document.getElementById("nome").value.trim();
    let descricaoVal = document.getElementById("descricao").value.trim();

    // Tratativa: O nome da categoria deve ser único (conforme PDF)
    let categoriaExistente = categorias.some(c => c.nome.toLowerCase() === nomeVal.toLowerCase());
    if (categoriaExistente) {
        alert("Já existe uma categoria cadastrada com este nome!");
        return;
    }

    let categoria = new Categoria(gerarId(), nomeVal, descricaoVal);
    categorias.push(categoria);
    localStorage.setItem("categorias", JSON.stringify(categorias));

    render();
    this.reset();
});

function render() {
    let tabela = document.getElementById("tabelaCategorias");
    tabela.innerHTML = "";

    categorias.forEach((c, index) => {
        tabela.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.nome}</td>
                <td>${c.descricao || '-'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(index) {
    if (confirm("Deseja realmente excluir esta categoria?")) {
        categorias.splice(index, 1);
        localStorage.setItem("categorias", JSON.stringify(categorias));
        render();
    }
}

render();