/**
 * Gera o próximo ID sequencial a partir de uma lista de objetos.
 * Se a lista contiver IDs numéricos, faz max + 1. Caso contrário usa comprimento + 1.
 * @param {Array} lista - lista atual de objetos
 * @returns {number}
 */
export function nextId(lista) {
    if (!lista || lista.length === 0) return 1;
    const ids = lista.map(i => parseInt(i.id)).filter(n => !isNaN(n));
    if (ids.length === 0) return lista.length + 1;
    return Math.max(...ids) + 1;
}
