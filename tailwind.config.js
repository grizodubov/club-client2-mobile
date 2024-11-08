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
                scene: 'oklch(var(--scene) / <alpha-value>)',
                front: 'oklch(var(--front) / <alpha-value>)',
                moderate: 'oklch(var(--moderate) / <alpha-value>)',
            },
        },
    },
    daisyui: {
        themes: [
            {
                emerald: {
                    ...require('daisyui/src/theming/themes')['emerald'],
                    '--scene': '28.03% 0.048 230.58',
                    '--front': '71.67% 0.123 70.27',
                    '--moderate': '56.59% 0.068 224.07',
                    '.btn-front': {
                        'background-color': 'oklch(var(--front) / 100%)',
                        'border-color': 'oklch(var(--front) / 100%)',
                    },
                    '.btn-front:hover': {
                        'background-color': 'oklch(var(--front) / 90%)',
                        'border-color': 'oklch(var(--front) / 90%)',
                    },
                    '.btn-scene': {
                        'background-color': 'oklch(var(--scene) / 100%)',
                        'border-color': 'oklch(var(--scene) / 100%)',
                    },
                    '.btn-scene:hover': {
                        'background-color': 'oklch(var(--scene) / 90%)',
                        'border-color': 'oklch(var(--scene) / 90%)',
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
