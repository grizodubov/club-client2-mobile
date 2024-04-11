type Format = 'tender' | 'place' | 'meeting' | 'club' | 'network' | 'expert' | 'breakfast' | 'mission' | 'education' | 'guest' | 'forum' | 'webinar';


/* EXPORT: EVENTS */
export const EVENTS: {
    format: Format;
    name: string;
    icon: string;
    color: string;
}[] = [
    {
        format: 'tender',
        name: 'Тендерный разбор',
        /* ContainerSoftware */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M28 12h-8V4h8zm-6-2h4V6h-4z" fill="currentColor"></path><path d="M17 15V9H9v14h14v-8zm-6-4h4v4h-4zm4 10h-4v-4h4zm6 0h-4v-4h4z" fill="currentColor"></path><path d="M26 28H6a2.002 2.002 0 0 1-2-2V6a2.002 2.002 0 0 1 2-2h10v2H6v20h20V16h2v10a2.002 2.002 0 0 1-2 2z" fill="currentColor"></path></svg>',
        color: 'primary brightness-90',
    },
    {
        format: 'place',
        name: 'Встреча с ЭТП',
        /* MilitaryCamp */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M27 28V17.52a2.003 2.003 0 0 0-.853-1.639L17 9.48V8h6V2h-8v7.48l-9.147 6.402A2.002 2.002 0 0 0 5 17.52V28H2v2h28v-2zM17 4h4v2h-4zM7 17.52l9-6.3l9 6.3V28h-8v-8h-2v8H7z" fill="currentColor"></path></svg>', 
        color: 'primary brightness-75',
    },
    {
        format: 'meeting',
        name: 'Встреча с заказчиком',
        /* UserSpeaker */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M29.415 19L27.7 17.285A2.97 2.97 0 0 0 28 16a3 3 0 1 0-3 3a2.97 2.97 0 0 0 1.286-.3L28 20.414V28h-6v-3a7.008 7.008 0 0 0-7-7H9a7.008 7.008 0 0 0-7 7v5h28v-9.586A1.988 1.988 0 0 0 29.415 19zM4 25a5.006 5.006 0 0 1 5-5h6a5.006 5.006 0 0 1 5 5v3H4z" fill="currentColor"></path><path d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path></svg>',
        color: 'secondary brightness-90',
    },
    {
        format: 'club',
        name: 'Форум-группа',
        /* Group */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M31 30h-2v-3a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v3h-2v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5z" fill="currentColor"></path><path d="M24 12a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5z" fill="currentColor"></path><path d="M15 22h-2v-3a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v3H1v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5z" fill="currentColor"></path><path d="M8 4a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5z" fill="currentColor"></path></svg>',
        color: 'secondary brightness-75',
    },
    {
        format: 'network',
        name: 'Отраслевой нетворкинг',
        /* ChartNetwork */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4.1a5 5 0 0 0-3.9 3.9H14v-2a2 2 0 0 0-2-2h-2v-4.1a5 5 0 1 0-2 0V18H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2h4.1a5 5 0 1 0 5.9-5.9V14zM6 9a3 3 0 1 1 3 3a3 3 0 0 1-3-3zm6 17H6v-6h6zm14-3a3 3 0 1 1-3-3a3 3 0 0 1 3 3zM20 6h6v6h-6z" fill="currentColor"></path></svg>',
        color: 'warning brightness-90',
    },
    {
        format: 'expert',
        name: 'Экспертная встреча',
        /* UserData */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M28 8h2v8h-2z" fill="currentColor"></path><path d="M23 5h2v11h-2z" fill="currentColor"></path><path d="M18 10h2v6h-2z" fill="currentColor"></path><path d="M16 30h-2v-6a3.003 3.003 0 0 0-3-3H7a3.003 3.003 0 0 0-3 3v6H2v-6a5.006 5.006 0 0 1 5-5h4a5.006 5.006 0 0 1 5 5z" fill="currentColor"></path><path d="M9 9a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5z" fill="currentColor"></path></svg>',
        color: 'warning brightness-75',
    },
    {
        format: 'breakfast',
        name: 'Кофе и бизнес',
        /* RestaurantFine */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M30 11V3a1 1 0 0 0-1-1H19a1 1 0 0 0-1 1v8a6.004 6.004 0 0 0 5 5.91V28h-4v2h10v-2h-4V16.91A6.004 6.004 0 0 0 30 11zm-10 0V4h8v7a4 4 0 1 1-8 0z" fill="currentColor"></path><path d="M12 2v9.02a3.964 3.964 0 0 1-3.96 3.96A4.005 4.005 0 0 1 4 11.02V2H2v9.02a5.989 5.989 0 0 0 5 5.865V30h2V16.895a5.965 5.965 0 0 0 5-5.875V2z" fill="currentColor"></path><path d="M7 2h2v9.98H7z" fill="currentColor"></path></svg>',
        color: 'accent brightness-90',
    },
    {
        format: 'mission',
        name: 'Бизнес-миссия в регионах',
        /* TaskLocation */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><circle cx="24" cy="21" r="2" fill="currentColor"></circle><path d="M24 31l-4.779-6.402A5.935 5.935 0 0 1 18 21a6 6 0 0 1 12 0a5.94 5.94 0 0 1-1.225 3.603zm0-14a4.005 4.005 0 0 0-4 4a3.957 3.957 0 0 0 .82 2.397l3.18 4.26l3.176-4.255A3.963 3.963 0 0 0 28 21a4.005 4.005 0 0 0-4-4z" fill="currentColor"></path><path d="M25 5h-3V4a2.006 2.006 0 0 0-2-2h-8a2.006 2.006 0 0 0-2 2v1H7a2.006 2.006 0 0 0-2 2v21a2.006 2.006 0 0 0 2 2h9v-2H7V7h3v3h12V7h3v5h2V7a2.006 2.006 0 0 0-2-2zm-5 3h-8V4h8z" fill="currentColor"></path></svg>',
        color: 'accent brightness-75',
    },
    {
        format: 'education',
        name: 'Академия закупок',
        /* Education */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 30h-2v-3a5.006 5.006 0 0 0-5-5h-6a5.006 5.006 0 0 0-5 5v3H6v-3a7.008 7.008 0 0 1 7-7h6a7.008 7.008 0 0 1 7 7z" fill="currentColor"></path><path d="M5 6a1 1 0 0 0-1 1v9h2V7a1 1 0 0 0-1-1z" fill="currentColor"></path><path d="M4 2v2h5v7a7 7 0 0 0 14 0V4h5V2zm7 2h10v3H11zm5 12a5 5 0 0 1-5-5V9h10v2a5 5 0 0 1-5 5z" fill="currentColor"></path></svg>',
        color: 'info brightness-90',
    },
    {
        format: 'guest',
        name: 'Специальный гость',
        /* UserSimulation */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 12l3.464 2l-1 1.732l-3.464-2z" fill="currentColor"></path><path d="M26 8h4v2h-4z" fill="currentColor"></path><path d="M7 13.732l-3.464 2l-1-1.732L6 12z" fill="currentColor"></path><path d="M26 30h-2v-5a5.006 5.006 0 0 0-5-5h-6a5.006 5.006 0 0 0-5 5v5H6v-5a7.008 7.008 0 0 1 7-7h6a7.008 7.008 0 0 1 7 7z" fill="currentColor"></path><path d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" fill="currentColor"></path><path d="M25 4.268l3.464-2l1 1.732L26 6z" fill="currentColor"></path><path d="M2 8h4v2H2z" fill="currentColor"></path><path d="M6 6L2.536 4l1-1.732l3.464 2z" fill="currentColor"></path></svg>',
        color: 'info brightness-75',
    },
    {
        format: 'forum',
        name: 'Форум АУЗ',
        /* GroupPresentation */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M10 30H8v-3H4v3H2v-3a2.002 2.002 0 0 1 2-2h4a2.002 2.002 0 0 1 2 2z" fill="currentColor"></path><path d="M30 30h-2v-3h-4v3h-2v-3a2.002 2.002 0 0 1 2-2h4a2.002 2.002 0 0 1 2 2z" fill="currentColor"></path><path d="M20 30h-2v-3h-4v3h-2v-3a2.002 2.002 0 0 1 2-2h4a2.002 2.002 0 0 1 2 2z" fill="currentColor"></path><circle cx="16" cy="22" r="2" fill="currentColor"></circle><circle cx="6" cy="22" r="2" fill="currentColor"></circle><circle cx="26" cy="22" r="2" fill="currentColor"></circle><circle cx="21" cy="18" r="2" fill="currentColor"></circle><circle cx="11" cy="18" r="2" fill="currentColor"></circle><path d="M26 14H6a2.002 2.002 0 0 1-2-2V4a2.002 2.002 0 0 1 2-2h20a2.002 2.002 0 0 1 2 2v8a2.002 2.002 0 0 1-2 2zM6 4v8h20V4z" fill="currentColor"></path></svg>', 
        color: 'success brightness-90',
    },
    {
        format: 'webinar',
        name: 'Прямой эфир',
        /* Screen */
        icon: '<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M28 4H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8v4H8v2h16v-2h-4v-4h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM18 28h-4v-4h4zm10-6H4V6h24z" fill="currentColor"></path></svg>',
        color: 'success brightness-75',
    },
];
