import { Pagamento } from '../model/Pagamento.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'pagamentos';

export class PagamentoService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(p => String(p.id) === String(id)) ?? null;
    }

    salvar(dados) {
        if (!dados.assinatura) throw new Error("Assinatura é obrigatória.");
        if (!dados.valor || isNaN(parseFloat(dados.valor))) throw new Error("Valor é obrigatório.");
        if (!dados.metodo) throw new Error("Método de pagamento é obrigatório.");
        if (!dados.transacao) throw new Error("ID de transação é obrigatório.");

        const lista = this.listar();
        const pag = new Pagamento({ ...dados, id: nextId(lista) });
        lista.push(pag);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return pag;
    }

    excluir(id) {
        const lista = this.listar().filter(p => String(p.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
