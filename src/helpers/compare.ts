type Data = {
    [key: string]: any;
};


/* EXPORT: compare */
export function compare(data1: Data | null | undefined, data2: Data | null | undefined): boolean {
    if (data1 === data2)
        return true;
    if (data1 && data2) {
        const data1Keys: string[] = Object(data1).keys().sort();
        const data2Keys: string[] = Object(data2).keys().sort();
        const data1KeysLen: number = data1Keys.length;
        const data2KeysLen: number = data2Keys.length;
        if (data1KeysLen != data2KeysLen)
            return false;
        for (let i = 0; i < data1KeysLen; i++) {
            if (data1Keys[i] != data2Keys[i])
                return false;
            if (data1[data1Keys[i]] !== data2[data2Keys[i]])
                return false;
        }
        return true;
    }
    return false;
}
