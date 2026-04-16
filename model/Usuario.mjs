export class Usuario {
    constructor({ id, nome, email, senha, dataCadastro }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dataCadastro = dataCadastro;
    }

    static validar(dados, isUpdate = false) {
        const erros = [];
        if (!dados.nome?.trim()) erros.push('Nome é obrigatório.');
        if (!dados.email?.trim()) erros.push('E-mail é obrigatório.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erros.push('E-mail inválido.');
        if (!isUpdate && !dados.senha?.trim()) erros.push('Senha é obrigatória.');
        return erros;
    }
}
