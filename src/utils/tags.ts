/* findTags */
export function findTags(s1: string | string[], s2: string | string[]): string[] {
    const result: string[] = [];
    if (typeof s1 === 'string' && typeof s2 === 'string' && s1 && s2) {
        const s1s = Array.isArray(s1) ? s1.map(s => s.trim()) : s1.split(/,/).map(s => s.trim());
        const s2s = Array.isArray(s2) ? s2.map(s => s.trim().toLowerCase()) : s2.split(/,/).map(s => s.trim().toLowerCase());
        const s1ln = s1s.length;
        const s2ln = s2s.length;
        if (s1ln && s2ln) {
            for(let i1 = 0; i1 < s1ln; i1++) {
                const temp = s1s[i1].toLowerCase();
                for(let i2 = 0; i2 < s2ln; i2++) {
                    if (temp == s2s[i2]) {
                        result.push(s1s[i1]);
                        break;
                    }
                }
            }
        }
    }
    return result;
}


/* onlyUniqueFilter */
export function onlyUniqueFilter(value: any, index: number, array: any[]) {
    return array.findIndex(e => e.id == value.id) === index;
}


/* compareTags */
export function compareTags(s1: string | string[], s2: string | string[]): boolean {
    if (typeof s1 === 'string' && typeof s2 === 'string') {
        const s1s = Array.isArray(s1) ? s1.map(s => s.trim().toLowerCase()) : s1.split(/,/).map(s => s.trim().toLowerCase());
        const s2s = Array.isArray(s2) ? s2.map(s => s.trim().toLowerCase()) : s2.split(/,/).map(s => s.trim().toLowerCase());
        const s1ln = s1s.length;
        const s2ln = s2s.length;
        if (s1ln == s2ln) {
            s1s.sort();
            s2s.sort();
            for(let i = 0; i < s1ln; i++) {
                if (s1s[i] != s2s[i])
                    return false;
            }
            return true;
        }
    }
    return false;
}
