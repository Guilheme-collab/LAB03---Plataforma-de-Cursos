export class Pagamento {
    constructor({ id, assinatura, valor, data, metodo, transacao }) {
        this.id = id;
        this.assinatura = assinatura;
        this.valor = parseFloat(valor);
        this.data = data;
        this.metodo = metodo;
        this.transacao = transacao;
    }
}
