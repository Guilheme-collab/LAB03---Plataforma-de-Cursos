import { Progresso } from '../model/Progresso.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'progresso';

export class ProgressoService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    salvar(dados) {
        if (!dados.usuario) throw new Error("Usuário é obrigatório.");
        if (!dados.aula) throw new Error("Aula é obrigatória.");

        const lista = this.listar();
        const registroExistente = lista.findIndex(
            p => String(p.usuario) === String(dados.usuario) && String(p.aula) === String(dados.aula)
        );

        if (registroExistente !== -1) {
            lista[registroExistente].status = dados.status;
            lista[registroExistente].data = dados.data;
            localStorage.setItem(KEY, JSON.stringify(lista));
            throw new Error("_UPDATED_");
        } else {
            const progresso = new Progresso({ ...dados, id: nextId(lista) });
            lista.push(progresso);
            localStorage.setItem(KEY, JSON.stringify(lista));
            return progresso;
        }
    }

    excluirPorIndex(idx) {
        const lista = this.listar();
        if (idx >= 0 && idx < lista.length) {
            lista.splice(idx, 1);
            localStorage.setItem(KEY, JSON.stringify(lista));
        }
    }
}
