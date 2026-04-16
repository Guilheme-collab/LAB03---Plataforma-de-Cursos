export class Curso {
    constructor({ id, titulo, descricao, instrutor, categoria, nivel, data, aulas, horas }) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.instrutor = instrutor;
        this.categoria = categoria;
        this.nivel = nivel;
        this.data = data;
        this.aulas = parseInt(aulas) || 0;
        this.horas = parseFloat(horas) || 0;
    }
}
