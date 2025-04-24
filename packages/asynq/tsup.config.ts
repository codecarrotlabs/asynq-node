import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src'],
  format: ['cjs', 'esm'],  // Output formats: CommonJS and ES Module
  dts: true,               // Generate TypeScript declaration files
  outDir: 'dist',          // Output directory
  // Clean the output directory before building
  clean: true,   
  bundle: false,
});
