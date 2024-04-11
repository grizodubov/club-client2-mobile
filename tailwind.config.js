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
                scene: 'var(--scene)',
                front: 'var(--front)',
                moderate: 'var(--moderate)',
            },
        },
    },
    daisyui: {
        themes: [
            {
                emerald: {
                    ...require('daisyui/src/theming/themes')['emerald'],
                    '--scene': '#0a2d3c',
                    '--front': '#d495447',
                    '--moderate': '#467f94',
                    '.btn-front': {
                        'background-color': "#d49544",
                        'border-color': "#d49544",
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
