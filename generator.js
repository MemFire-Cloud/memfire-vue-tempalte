
module.exports = (api, options, rootOptions) => {
  api.extendPackage({
    "name": "memfire-vue-3",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    // # 扩展pkg#scripts
    scripts: {
      "build": "vite build",
      "serve": "vite --port 3000",
      "preview": "vite preview"
    }, 
    // # 扩展pkg#dependencies
    dependencies: {
      "@supabase/supabase-js": "^2.21.0",
      "ant-design-vue": "^3.2.19",
      "vue": "^3.2.13",
      "vue-router": "^4.1.6"
    }, 
    // # 扩展pkg#devDependencies
    devDependencies: {
      "@vitejs/plugin-vue": "^4.1.0",
      "@vue/cli-service": "~5.0.0",
      "autoprefixer": "^10.4.14",
      "postcss": "^8.4.23",
      "sass": "^1.32.7",
      "sass-loader": "^12.0.0",
      "tailwindcss": "^3.3.2",
      "vite": "^4.3.0"
    }
  });
//   # 复制template模版
  api.render('./template');
};
