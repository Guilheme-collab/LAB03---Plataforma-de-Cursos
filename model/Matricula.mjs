export class Matricula {
    constructor({ id, usuario, curso, data, conclusao }) {
        this.id = id;
        this.usuario = usuario;
        this.curso = curso;
        this.data = data;
        this.conclusao = conclusao || null;
    }
}
