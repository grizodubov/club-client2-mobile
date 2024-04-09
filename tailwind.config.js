/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
    ],
    theme: {
        colors: {
            dark: '#0a2d3c',
        },
        extend: {},
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: [ "bumblebee" ],
    },
    safelist: [
    ]
}
