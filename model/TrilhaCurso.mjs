export class TrilhaCurso {
    constructor({ id, trilha, curso, ordem }) {
        this.id = id;
        this.trilha = trilha;
        this.curso = curso;
        this.ordem = parseInt(ordem);
    }
}
