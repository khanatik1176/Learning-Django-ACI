import type { Config } from 'tailwindcss';
import tailwindcssAnimate from "tailwindcss-animate";
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0C66E4',
        secondary: '#F4F4F5',
        destructive: '#DC2626',
        textPrimary: '#0C1B31',
        textSecondary: '#323539',
        subHeading: '#858C95',
        errorColor: '#C8322B',
        errorBgColor: '#FEF2F2',
        successColor: '#268E34',
        textMuted: '#71717A',
        textBlack: '#09090B',
        pageBg: '#F8F9FB',
        disabledBg: '#F4F4F5',
        infoBg: '#E8F1FE',
        errorBg: '#FFEFEE',
        successBg: '#F3FFF6',
        bgSecondary: '#F8F9FB',
        bgPrimary: '#CFE2FD',
        bgWarning: '#FFE4C0',
        bgSuccess: '#B1EEB9',
        primaryHover: '#255394',
        secondaryHover: '#E4E4E7',
        outlineHover: '#D4D4D8',
        destructiveHover: '#B91C1C',
        primaryFocus: '#193863',
        secondaryFocus: '#F4F4F5',
        destructiveFocus: '#DC2626',
        borderColor: '#E4E4E7 !important',
        menuTextColor: '#596574',
        emptyTableIconColor: '#9599A1',
        jobBg: '#F8FAFC',
        dropdownLabelColor: '#020617',
        placeholderColor: '#64748B',
        dropdownMenuBorderColor: '#E2E8F0',
        dropdownSecondaryBg: '#F1F5F9',
        radioColor: '#CBD5E1',
        lightBlueBg: '#0EA5E9',
        lightGreenBg: '#DCFCE7',
        darkGreenColor: '#166534',
        lightGrayColor: '#9CA3AF',
        deepRedcolor: '#DC2626',
        darkBlackColor: '#030712',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      fontSize: {
        twelve: ['0.75rem', '1rem'], //12px
        xs: ['0.813rem', '1.125rem'], //13px
        sm: ['0.875rem', '1.25rem'], //14px
        base: ['0.938rem', '1.375rem'], //15px
        xl: ['1rem', '1.5rem'], //16px
        xxl: ['1.125rem', '1.75rem'], //18px

        headingXXS: ['1.25rem', '1.75rem'], //20px
        headingXS: ['1.375rem', '1.875rem'], //22px
        headingS: ['1.75rem', '2.375rem'], //28px
        headingBase: ['2rem', '2.5rem'], //32px
        headingL: ['2.25rem', '2.75rem'], //36px
        headingXL: ['2.5rem', '3rem'], //40px
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
