/* EXPORT: monthes */
export const monthes = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

/* EXPORT: weekdays */
export const weekdays = [
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
];

/* EXPORT: weekdaysShort */
export const weekdaysShort = [
    'вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'
];


/* EXPORT: weekdaysShort */
export function dateKey(d: Date): string {
    return d.getFullYear().toString() + ('0' + (d.getMonth() + 1).toString()).slice(-2) + ('0' + d.getDate().toString()).slice(-2);
};


/* EXPORT: compareDates */
export function compareDates(d1: Date | undefined, d2: Date | undefined): boolean {
    if (d1 === d2)
        return true;
    if (d1 && d2)
        if (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate())
            return true;
    return false;
};
