export class Aula {
    constructor({ id, modulo, titulo, tipo, url, duracao, ordem }) {
        this.id = id;
        this.modulo = modulo;
        this.titulo = titulo;
        this.tipo = tipo;
        this.url = url;
        this.duracao = parseInt(duracao);
        this.ordem = parseInt(ordem);
    }
}
