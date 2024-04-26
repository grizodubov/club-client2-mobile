/* EXPORT: WordForms */
export interface WordForms {
	[key: string]: [ string, string, string, string];
};


/* EXPORT: nwfi */
export function nwfi(n: number): number {
    if (n >= 10 && n <= 19)
        return 0;
    const o:number = n % 10;
    if (o == 1)
        return 1;
    if (o == 2 || o == 3 || o == 4)
        return 2;
    return 3;
}
