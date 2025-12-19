/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // 기본 spacing을 1px 단위로 오버라이드
    spacing: generatePixelSpacing(),
    extend: {
      // 폰트 사이즈도 픽셀로 직접 매핑 (text-12 -> 12px)
      fontSize: generatePixelFontSize(),
      colors: {
        white: "#FFFFFF",
        black: "#0D0C11",
        gray0: "#F7F7FA",
        gray1: "#F3F3F7",
        gray2: "#EAEAEF",
        gray3: "#E1E1E5",
        gray4: "#DEDEE2",
        gray5: "#D6D6D9",
        gray6: "#CFCFD5",
        gray7: "#C8C8CD",
        gray8: "#BABABE",
        gray9: "#A8A8AD",
        gray10: "#8D8D91",
        gray11: "#747476",
        gray12: "#646466",
        gray13: "#4B4B4C",
        gray14: "#38383A",
        gray15: "#2D2D2F",
        gray16: "#252527",
        gray17: "#1B1B1D",
        positiveColor: "#23BE76",
        negativeColor: "#F03167",
        pointColor: "#EF4A37",
        pointColorOpacity10: "#EF4A371A",
        pointColorOpacity80: "#EF4A37CC",
        pointColorNew: "#5637EF",
        pointColorNewOpacity10: "#5637EF1A",
        pointColorHot: "#377BEF",
        pointColorHotOpacity10: "#377BEF1A",
      },
    },
  },
  plugins: [],
};

function generatePixelSpacing() {
  const spacing = {};
  for (let i = 0; i <= 200; i++) {
    spacing[i] = `${i}px`;
  }
  return spacing;
}

function generatePixelFontSize() {
  const fontSize = {};
  for (let i = 0; i <= 200; i++) {
    fontSize[i] = `${i}px`;
  }
  return fontSize;
}
