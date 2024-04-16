/* findTags */
export function findTags(s1: string, s2: string): string[] {
    const result: string[] = [];
    if (typeof s1 === 'string' && typeof s2 === 'string' && s1 && s2) {
        const s1s = s1.split(/,/).map(s => s.trim());
        const s2s = s2.split(/,/).map(s => s.trim().toLowerCase());
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
