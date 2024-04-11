/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
    ],
    theme: {
        colors: {
            scene: '#0a2d3c',
            front: '#d49544',
            moderate: '#467f94',
        },
        extend: {},
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: [ "emerald" ],
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
