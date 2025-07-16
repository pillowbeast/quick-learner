export const lightColors = {
    // brand colors
    primary: '#643bd1',
    secondary: '#665f96',
    tertiary: '#9a96b3',
    onPrimaryOrSecondary: '#FFFFFF',

    accent: '#fab30c',
    onAccent: '#1A1A1A',

    // background colors
    background: '#F5F5F5',
    elevated: '#FFFFFF',
    // text colors
    text: '#1A1A1A',
    muted: '#6B6B6B',

    // additional colors
    success: '#178f41',
    error: '#e62929',
    warning: '#FFB300',
};

export const darkColors = {
    primary: '#9a6efa',
    secondary: '#9a96b3',
    tertiary: '#665f96',
    onPrimaryOrSecondary: '#0D0D0D',
    accent: '#FFC94D',
    onAccent: '#1A1A1A',

    background: '#121212',
    elevated: '#242424',
    text: '#E0E0E0',
    muted: '#8A8A8A',

    // additional colors
    success: '#59DEB3',
    error: '#FF6F6A',
    warning: '#FFC94D',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
};

export const typography = {
    header: { fontSize: 32 as const, fontWeight: '700' as const },
    subheader: { fontSize: 24, fontWeight: '700' as const },
    body: { fontSize: 20, fontWeight: '400' as const },
    bold: { fontSize: 18, fontWeight: 'bold' as const },
    small_body: { fontSize: 15, fontWeight: '600' as const },
    italic: { fontSize: 14, fontWeight: '400' as const, fontStyle: 'italic' as const },
    caption: { fontSize: 16, fontWeight: '200' as const },
};

export const radii = {
    sm: 4,
    md: 8,
    lg: 16,
};
