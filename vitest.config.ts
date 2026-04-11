/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['projects/primitives/src/**/*.spec.ts'],
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                'projects/primitives/src/**/*.spec.ts',
                'projects/primitives/src/**/*.harness.ts',
            ],
        },
    },
    resolve: {
        alias: {
            '@': '/projects/primitives/src',
        },
    },
});