export class Avaliacao {
    constructor({ id, usuario, curso, nota, comentario, data }) {
        this.id = id;
        this.usuario = usuario;
        this.curso = curso;
        this.nota = parseInt(nota);
        this.comentario = comentario;
        this.data = data;
    }

    static validar(dados) {
        const erros = [];
        if (!dados.usuario) erros.push("Usuário é obrigatório.");
        if (!dados.curso) erros.push("Curso é obrigatório.");
        if (!dados.nota) erros.push("Nota é obrigatória.");
        return erros;
    }
}
