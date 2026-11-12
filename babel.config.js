module.exports = api => {
  // 웹 번들은 classic script라 `import.meta`를 그대로 두면 첫 줄에서 SyntaxError로 멈춘다
  // (zustand devtools 미들웨어가 `import.meta.env.MODE`를 읽는다). 네이티브 번들은 그대로 둔다
  const isWeb = api.caller(caller => caller?.platform === "web");

  return {
    presets: [["babel-preset-expo", isWeb ? { unstable_transformImportMeta: true } : {}]],
    plugins: [
      "nativewind/babel",
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./src",
          },
        },
      ],
    ],
  };
};
