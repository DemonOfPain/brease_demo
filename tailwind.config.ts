import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  prefix: '',
  safelist: [
    // for the dynamic fonts and text sizes
    'font-golos-bold',
    'font-golos-semibold',
    'font-golos-medium',
    'font-golos-regular',
    'text-d-2xl',
    'text-d-xl',
    'text-d-lg',
    'text-d-md',
    'text-d-sm',
    'text-d-xs',
    'text-t-xl',
    'text-t-lg',
    'text-t-md',
    'text-t-sm',
    'text-t-xs',
    'text-t-xxs',
    'text-t-xxxs',
    // dynamic z-indexes
    // @ts-ignore
    ...[...Array(20).keys()].flatMap((i) => [`z-[${i * 1}]`]),
    // @ts-ignore
    ...[...Array(20).keys()].flatMap((i) => [`z-[${i * -1}]`]),
    // dynamic slot sizes in builder
    // @ts-ignore
    ...[...Array(12).keys()].flatMap((i) => [`col-span-${i + 1}`])
  ],
  theme: {
    extend: {
      colors: {
        brease: {
          'green-1': '#F3FFF9FF',
          'green-2': '#E8FFF4FF',
          'green-3': '#DCFFEEFF',
          'green-4': '#D1FFE8FF',
          'green-5': '#B9FFDDFF',
          'green-6': '#A2FFD1FF',
          'green-7': '#6FE0A8FF',
          'green-8': '#53C08BFF',
          'green-9': '#38A16DFF',
          'green-10': '#2A915EFF',
          'green-11': '#1C8150FF',
          'green-12': '#0E7241FF',
          'green-13': '#006232FF',
          'gray-1': '#FCFCFDFF',
          'gray-2': '#F5F6F8FF',
          'gray-3': '#EBECF0FF',
          'gray-4': '#E2E4EAFF',
          'gray-5': '#D9DCE4FF',
          'gray-6': '#BABDC5FF',
          'gray-7': '#ACAFB8FF',
          'gray-8': '#9598A0FF',
          'gray-9': '#484B53FF',
          'gray-10': '#282B32FF',
          primary: '#2A915E',
          'secondary-light-green': '#E6EFEB',
          'secondary-purple': '#9747FF',
          'secondary-light-purple': '#F4EBFF',
          'secondary-blue': '#536FFF',
          'secondary-light-blue': '#ECEFFF',
          error: '#F44848',
          'error-light': '#FFE7E7',
          warning: '#F79009',
          'warning-light': '#FFEDD5',
          success: '#12B76A',
          'success-light': '#DCFFEE'
        }
      },
      fontFamily: {
        'golos-bold': 'Golos-Bold',
        'golos-semibold': 'Golos-SemiBold',
        'golos-medium': 'Golos-Medium',
        'golos-regular': 'Golos-Regular'
      },
      fontSize: {
        'd-2xl': ['72px', { lineHeight: '72px', letterSpacing: '-0.04em' }],
        'd-xl': ['60px', { lineHeight: '68px', letterSpacing: '-0.03em' }],
        'd-lg': ['48px', { lineHeight: '54px', letterSpacing: '-0.02em' }],
        'd-md': ['36px', { lineHeight: '42px', letterSpacing: '-0.02em' }],
        'd-sm': ['30px', { lineHeight: '36px', letterSpacing: '-0.01em' }],
        'd-xs': ['24px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
        't-xl': ['20px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        't-lg': ['18px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        't-md': ['16px', { lineHeight: '22px', letterSpacing: '-0.01em' }],
        't-sm': ['14px', { lineHeight: '20px', letterSpacing: '-0.01em' }],
        't-xs': ['13px', { lineHeight: '18px', letterSpacing: '-0.01em' }],
        't-xxs': ['12px', { lineHeight: '16px', letterSpacing: '-0.01em' }],
        't-xxxs': ['10px', { lineHeight: '14px', letterSpacing: '-0.01em' }]
      },
      boxShadow: {
        'brease-xs':
          '0px 2px 4px 0px rgba(62, 52, 69, 0.06), 0px 1px 2px 0px rgba(62, 52, 69, 0.03)',
        'brease-sm':
          '0px 16px 32px -4px rgba(62, 52, 69, 0.10), 0px 2px 4px 0px rgba(62, 52, 69, 0.04)',
        'brease-md':
          '0px 24px 48px -8px rgba(62, 52, 69, 0.12), 0px 2px 4px 0px rgba(62, 52, 69, 0.04)',
        'brease-lg':
          '0px 40px 80px -16px rgba(62, 52, 69, 0.16), 0px 2px 4px 0px rgba(62, 52, 69, 0.04)',
        'brease-xl':
          '0px 56px 112px -20px rgba(62, 52, 69, 0.18), 0px 2px 4px 0px rgba(62, 52, 69, 0.04)'
      },
      transitionProperty: {
        height: 'height',
        width: 'width',
        minWidth: 'min-width'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-animated'),
    require('tailwindcss-aria-attributes')
  ]
} satisfies Config

export default config
