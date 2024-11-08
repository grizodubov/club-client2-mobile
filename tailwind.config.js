/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
    ],
    plugins: [
        require('daisyui'),
    ],
    theme: {
        extend: {
            colors: {
                scene: 'hsl(var(--scene) / <alpha-value>)',
                front: 'hsl(var(--front) / <alpha-value>)',
                moderate: 'hsl(var(--moderate) / <alpha-value>)',
            },
        },
    },
    daisyui: {
        themes: [
            {
                emerald: {
                    // ...require('daisyui/src/theming/themes')['emerald'],
                    ...require('daisyui/src/theming/themes')['[data-theme=emerald]'],
                    // '--scene': '28.03% 0.048 230.58',
                    '--scene': '197.95 72% 14%',
                    // '--front': '71.67% 0.123 70.27',
                    '--front': '33.77 63% 55%',
                    // '--moderate': '56.59% 0.068 224.07',
                    '--moderate': '196.15 36% 43%',
                    '.btn-front': {
                        'background-color': 'hsl(var(--front) / 100%)',
                        'border-color': 'hsl(var(--front) / 100%)',
                    },
                    '.btn-front:hover': {
                        'background-color': 'hsl(var(--front) / 90%)',
                        'border-color': 'hsl(var(--front) / 90%)',
                    },
                    '.btn-scene': {
                        'background-color': 'oklch(var(--scene) / 100%)',
                        'border-color': 'oklch(var(--scene) / 100%)',
                    },
                    '.btn-scene:hover': {
                        'background-color': 'oklch(var(--scene) / 90%)',
                        'border-color': 'oklch(var(--scene) / 9%)',
                    },
                },
            },
        ],
    },
    safelist: [
        'bg-primary',
        'bg-secondary',
        'bg-warning',
        'bg-accent',
        'bg-info',
        'bg-success',
        'brighness-75',
        'brighness-90',
        'text-primary',
        'text-secondary',
        'text-warning',
        'text-accent',
        'text-info',
        'text-success',
    ]
}
