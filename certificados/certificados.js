class Certificado {
    constructor(id, usuario, curso, trilha, codigo, data) {
        this.id = id;
        this.usuario = usuario;
        this.curso = curso;
        this.trilha = trilha;
        this.codigo = codigo;
        this.data = data;
    }
}

let certificados = JSON.parse(localStorage.getItem("certificados")) || [];
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let cursos = JSON.parse(localStorage.getItem("cursos")) || [];
let trilhas = JSON.parse(localStorage.getItem("trilhas")) || [];

function gerarId() {
    return certificados.length > 0 ? Math.max(...certificados.map(c => c.id)) + 1 : 1;
}

function gerarCodigo() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function carregar() {
    let selectUsuario = document.getElementById("usuario");
    let selectCurso = document.getElementById("curso");
    let selectTrilha = document.getElementById("trilha");
    let btnSubmit = document.querySelector("#formCertificado button");

    if (usuarios.length === 0 || cursos.length === 0) {
        btnSubmit.disabled = true;
        selectUsuario.innerHTML = `<option>Sem dados</option>`;
        selectCurso.innerHTML = `<option>Sem dados</option>`;
        return;
    }

    selectUsuario.innerHTML = "";
    selectCurso.innerHTML = "";
    selectTrilha.innerHTML = "<option value=''>Nenhuma</option>";

    usuarios.forEach(u => selectUsuario.innerHTML += `<option value="${u.id}">${u.nome}</option>`);
    cursos.forEach(c => selectCurso.innerHTML += `<option value="${c.id}">${c.titulo}</option>`);
    trilhas.forEach(t => selectTrilha.innerHTML += `<option value="${t.id}">${t.titulo}</option>`);
    
    // Preenche a data de hoje e gera código inicial
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
    document.getElementById("codigo").value = gerarCodigo();
    document.getElementById("codigo").setAttribute("readonly", true);
}

document.getElementById("formCertificado").addEventListener("submit", function(e) {
    e.preventDefault();

    let usuarioVal = document.getElementById("usuario").value;
    let cursoVal = document.getElementById("curso").value;
    let trilhaVal = document.getElementById("trilha").value || null;
    let codigoVal = document.getElementById("codigo").value;
    let dataVal = document.getElementById("data").value;

    let certificado = new Certificado(gerarId(), usuarioVal, cursoVal, trilhaVal, codigoVal, dataVal);
    certificados.push(certificado);
    localStorage.setItem("certificados", JSON.stringify(certificados));

    render();
    
    this.reset();
    // Restaura data e gera novo código para o próximo
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
    document.getElementById("codigo").value = gerarCodigo();
});

function render() {
    let tabela = document.getElementById("tabelaCertificados");
    tabela.innerHTML = "";

    certificados.forEach((c, i) => {
        let user = usuarios.find(u => u.id == c.usuario);
        let cursoObj = cursos.find(cs => cs.id == c.curso);
        let trilhaObj = trilhas.find(t => t.id == c.trilha);
        let dataFormatada = new Date(c.data + 'T00:00:00').toLocaleDateString('pt-BR');

        tabela.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${user ? user.nome : "Excluído"}</td>
                <td>${cursoObj ? cursoObj.titulo : "Excluído"}</td>
                <td>${trilhaObj ? trilhaObj.titulo : "-"}</td>
                <td><strong>${c.codigo}</strong></td>
                <td>${dataFormatada}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${i})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(i) {
    if (confirm("Revogar este certificado?")) {
        certificados.splice(i, 1);
        localStorage.setItem("certificados", JSON.stringify(certificados));
        render();
    }
}

carregar();
render();