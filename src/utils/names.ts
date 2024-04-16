/* nameNormalization */
export function nameNormalization(n: string, limit: number | undefined = undefined): string {
    const names = n.split(/\s+/).map(w => {
        const p = w.search(/[A-Za-zАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя]/);
        return w.substring(0, p + 1).toUpperCase() + w.substring(p + 1).toLowerCase();
    });
    if (names.length > 1) {
        if (limit) {
            return names.slice(0, limit).join(' ');
        }
        else {
            return names.join(' ');
        }
    }
    return names[0];
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
