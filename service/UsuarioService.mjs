import { Usuario } from '../model/Usuario.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'usuarios';

export class UsuarioService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(u => String(u.id) === String(id)) ?? null;
    }

    salvar(dados) {
        const erros = Usuario.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));

        const lista = this.listar();
        if (lista.some(u => u.email === dados.email))
            throw new Error("Este e-mail já está cadastrado!");

        const usuario = new Usuario({ ...dados, id: nextId(lista) });
        lista.push(usuario);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return usuario;
    }

    atualizar(id, dados) {
        const erros = Usuario.validar(dados, true);
        if (erros.length) throw new Error(erros.join(' | '));

        const lista = this.listar();
        const index = lista.findIndex(u => String(u.id) === String(id));
        if (index === -1) throw new Error("Usuário não encontrado!");

        if (dados.email !== lista[index].email && lista.some(u => u.email === dados.email))
            throw new Error("Este e-mail já está cadastrado!");

        const novaSenha = dados.senha?.trim() ? dados.senha : lista[index].senha;
        lista[index] = { ...lista[index], ...dados, id: lista[index].id, senha: novaSenha };
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(u => String(u.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
