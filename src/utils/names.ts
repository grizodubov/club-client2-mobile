/* nameNormalization */
export function nameNormalization(n: string, limit: number | undefined = undefined): string {
    const nn = n.replace(/\s*\-\s*/, '-');
    const names = nn.split(/\s+/).map(w => {
        const p = w.search(/[A-Za-zАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя]/);
        return w.substring(0, p + 1).toUpperCase() + w.substring(p + 1).toLowerCase();
    });
    let result = '';
    if (names.length > 1) {
        if (limit) {
            result = names.slice(0, limit).join(' ');
        }
        else {
            result = names.join(' ');
        }
    }
    else {
        result = names[0];
    }
    const rg = /\-[a-zабвгдеёжзийклмнопрстуфхцчшщъыьэюя]/g;
    const ms = result.matchAll(rg);
    for (const m of ms) {
        result = result.substring(0, m.index) + m[0].toUpperCase() + result.substring(m.index + m[0].length);
    }
    return result;
}


/* nameInitials */
export function nameInitials(n: string, limit: number | undefined = undefined): string {
    const names = n.split(/\s+/).map(w => {
        const p = w.search(/[A-Za-zАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя]/);
        return w.substring(p, p + 1).toUpperCase();
    });
    if (names.length > 1) {
        if (limit) {
            return names.slice(0, limit).join('');
        }
        else {
            return names.join('');
        }
    }
    return names[0];
}
