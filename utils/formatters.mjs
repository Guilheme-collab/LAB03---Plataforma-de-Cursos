export function formatarData(dataStr) {
    if (!dataStr) return '-';
    const hasTime = dataStr.includes('T');
    return new Date(dataStr + (hasTime ? '' : 'T00:00:00')).toLocaleDateString('pt-BR');
}

export function formatarMoeda(valor) {
    if (isNaN(parseFloat(valor))) return '-';
    return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
