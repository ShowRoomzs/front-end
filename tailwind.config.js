/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // 기본 spacing을 1px 단위로 오버라이드
    spacing: generatePixelSpacing(),
    extend: {
      // 폰트 사이즈도 픽셀로 직접 매핑 (text-12 -> 12px)
      fontSize: generatePixelFontSize(),
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
