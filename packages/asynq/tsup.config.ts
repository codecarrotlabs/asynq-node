import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Entry file
  format: ['cjs', 'esm'],  // Output formats: CommonJS and ES Module
  dts: true,               // Generate TypeScript declaration files
  outDir: 'dist',          // Output directory
  clean: true              // Clean the output directory before building
});