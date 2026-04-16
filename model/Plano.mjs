export class Plano {
    constructor({ id, nome, descricao, preco, duracao }) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = parseFloat(preco);
        this.duracao = parseInt(duracao);
    }
}
