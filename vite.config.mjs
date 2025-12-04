// vite.config.js
import { defineConfig } from "vite";
import path from "path";
import svgSpritemap from "vite-plugin-svg-spritemap";

// Базовые пути
const TEMPLATE_PATH = "local/templates/niso";
const COMPONENTS_PATH = `${TEMPLATE_PATH}/components/bitrix`;

// Компоненты с их путями
const componentConfigs = {
  searchTitle: `${COMPONENTS_PATH}/search.title/.default`,
  serviceForm: `${COMPONENTS_PATH}/form.result.new/service-form`,
  prices: `${COMPONENTS_PATH}/news.list/prices`,
  catalogSectionList: `${COMPONENTS_PATH}/catalog.section.list/catalog-section-list`,
};

// Создаем пути компонентов
const componentPaths = {
  template: `${TEMPLATE_PATH}/template_styles.scss`,
  ...Object.fromEntries(
    Object.entries(componentConfigs).map(([key, componentPath]) => [
      key,
      {
        input: `${componentPath}/style.scss`,
        output: `${componentPath}/style.css`,
      },
    ])
  ),
};

// Создаем input объект для rollup
const rollupInput = {
  template: componentPaths.template,
  script: "source/js/main.js",
  ...Object.fromEntries(
    Object.entries(componentPaths)
      .filter(([key]) => key !== "template")
      .map(([key, { input }]) => [key, input])
  ),
};

// Маппинг для CSS путей
const cssPathMapping = componentConfigs;

// Функция для определения выходного пути CSS файлов
const getCssOutputPath = (fileName) => {
  // Проверяем template_styles.scss отдельно
  if (fileName && fileName.includes("template_styles")) {
    return `${TEMPLATE_PATH}/template_styles.css`;
  }

  for (const [key, basePath] of Object.entries(cssPathMapping)) {
    if (fileName && fileName.includes(key)) {
      return `${basePath}/style.css`;
    }
  }
  return `${TEMPLATE_PATH}/template_styles.css`;
};

export default defineConfig({
  plugins: [
    svgSpritemap({
      pattern: "source/icons/**/*.svg",
      filename: `${TEMPLATE_PATH}/assets/sprite.svg`,
      prefix: "",
      svgo: {
        multipass: true,
        plugins: [
          { name: "cleanupAttrs", params: { removeEmptyAttrs: true } },
          {
            name: "removeAttrs",
            params: {
              attrs: ["fill", "fill-rule", "stroke", "stroke-width"],
            },
          },
        ],
      },
    }),
  ],
  build: {
    preserveModules: true,
    rollupOptions: {
      input: rollupInput,
      output: {
        entryFileNames: (assetInfo) => {
          if (assetInfo.name === "script") {
            console.log("test");
            return `${TEMPLATE_PATH}/script.js`;
          }
          return "[name].js";
        },
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0];

          if (fileName?.match(/\.(woff|woff2)$/i)) {
            return `${TEMPLATE_PATH}/assets/fonts/[name].[ext]`;
          }

          if (fileName?.endsWith(".svg")) {
            return `${TEMPLATE_PATH}/assets/[name].[ext]`;
          }

          if (fileName?.match(/\.(css)$/i)) {
            return getCssOutputPath(fileName);
          }

          return `${TEMPLATE_PATH}/assets/[name].[ext]`;
        },
      },
    },
    outDir: ".",
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      "@source": path.resolve(__dirname, "source"),
      "@scss-root": path.resolve(__dirname, "source/scss"),
      "@scss-components": path.resolve(__dirname, "source/scss/components"),
      "@scss-templates": path.resolve(__dirname, "source/scss/templates"),
      "@img": path.resolve(__dirname, "source/img"),
      "@template": path.resolve(__dirname, TEMPLATE_PATH),
      "@components": path.resolve(__dirname, COMPONENTS_PATH),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
