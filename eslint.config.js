import esLint from '@eslint/js';
import tsEsLint from 'typescript-eslint';
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginImportX from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

export default tsEsLint.config(
    esLint.configs.recommended,
    tsEsLint.configs.strict,
    pluginStylistic.configs.recommended,
    pluginImportX.flatConfigs.recommended,
    pluginImportX.flatConfigs.typescript,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tsEsLint.parser,
            parserOptions: {
                ecmaFeatures: {
                    modules: true,
                },
            },
        },
        settings: {
            'import-x/resolver-next': [
                createTypeScriptImportResolver({
                    bun: true,
                }),
            ],
        },
        rules: {
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/brace-style': ['error', '1tbs'],
            '@stylistic/indent': ['error', 4],
            '@stylistic/indent-binary-ops': ['error', 4],
            '@stylistic/lines-between-class-members': ['error', 'always', {
                exceptAfterSingleLine: true,
            }],
            '@stylistic/max-len': ['error', {
                code: 100,
                tabWidth: 4,
                ignoreRegExpLiterals: true,
            }],
            '@stylistic/object-curly-newline': ['error', {
                consistent: true,
                multiline: true,
            }],
            '@stylistic/object-property-newline': ['error'],
            '@stylistic/operator-linebreak': ['error', 'before'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/member-delimiter-style': ['error', {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            }],
            '@typescript-eslint/consistent-type-imports': ['error', {
                fixStyle: 'inline-type-imports',
            }],
            '@typescript-eslint/no-dynamic-delete': 'off',
            '@typescript-eslint/no-shadow': 'error',
            'import-x/no-named-as-default-member': 'off',
            'sort-imports': ['error', {
                ignoreDeclarationSort: true,
            }],
        },
    },
);
