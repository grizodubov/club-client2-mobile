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
