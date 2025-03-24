/**
 * Reference: https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files
 */

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    eslintConfigPrettier,
    // ...compat.config({
    //     extends: ["eslint:recommended", "next"],
    // }),
    {
        extends: compat.extends("next/core-web-vitals", "next/typescript"),
        files: ["**/*.{js,mjs,cjs,jsx,tsx,ts,mts,cts,xml,yml,yaml}"],
        plugins: {
            "@stylistic": stylistic
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",

            // Spacing
            "@stylistic/array-bracket-spacing": "error", // Require spaces between array brackets [] and other tokens.
            "@stylistic/arrow-spacing": "error", // Require spaces before/after an arrow function's arrow (=>).
            "@stylistic/block-spacing": "error", // Require spaces in block statements {}.
            "@stylistic/semi-spacing": "error", // Require spaces after semicolons.
            "@stylistic/comma-spacing": "error", // Require spaces after commas in variable declarations, array literals, object literals, function parameters, and sequences.
            "@stylistic/function-call-spacing": ["error", "never"], // Require no spaces between function identifiers and their invocations.
            "@stylistic/jsx-curly-spacing": ["error", { when: "never", children: true }], // Enforce or disallow spaces inside of curly braces in JSX attributes and expressions.
            "@stylistic/jsx-props-no-multi-spaces": "error", // Disallow multiple spaces between inline JSX props.
            "@stylistic/jsx-tag-spacing": [
                "error",
                {
                    closingSlash: "never",
                    beforeSelfClosing: "always"
                }
            ], // Disallow multiple spaces between inline JSX props.
            "@stylistic/key-spacing": [
                "error",
                {
                    beforeColon: false,
                    afterColon: true,
                    mode: "strict"
                }
            ], // Requires spaces between keys and values in object literal properties.
            "@stylistic/keyword-spacing": "error", // Requires spaces around keywords.
            "@stylistic/no-mixed-spaces-and-tabs": "error", //  Disallows mixed spaces and tabs for indentation.
            "@stylistic/no-multi-spaces": ["error", { ignoreEOLComments: true }], // disallow multiple whitespace around logical expressions, conditional expressions, declarations, array elements, object properties, sequences and function parameters. Except for comments.
            "@stylistic/no-whitespace-before-property": "error", // Disallow whitespace before properties. Ex: foo. bar()
            "@stylistic/object-curly-spacing": [
                "error",
                "always",
                {
                    arraysInObjects: true,
                    objectsInObjects: true
                }
            ], // Enforce consistent spacing inside object literals.
            "@stylistic/space-before-blocks": "error", // Require space before blocks.
            "@stylistic/no-multiple-empty-lines": ["error", { max: 1 }],
            "@stylistic/spaced-comment": ["error", "always"], // Require space after the line comment token and before the start of the comment text.
            "@stylistic/type-generic-spacing": "error", // Enforces consistent spacing inside TypeScript type generics.

            // Semi
            "@stylistic/semi": "error", // Require semi for all statements
            "@stylistic/no-extra-semi": "error", // Disallow unnecessary semicolons. Ex: console.log();;
            "@stylistic/semi-style": ["error", "last"], // Require semicolons placed only at the end of statements.

            // Operators
            "@stylistic/no-mixed-operators": [
                "error",
                {
                    groups: [
                        ["+", "-", "*", "/", "%", "**"],
                        ["&", "|", "^", "~", "<<", ">>", ">>>"],
                        ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                        ["&&", "||"],
                        ["in", "instanceof"]
                    ],
                    allowSamePrecedence: true
                }
            ], // Disallow mixed binary operators in an expression], use parentheses for readability.

            // Miscs
            "@stylistic/comma-style": ["error", "last"], // Require commas placed only at the end of arrays and objects.
            "@stylistic/max-statements-per-line": ["error", { max: 1 }], // Require only one statement per line.
            "@stylistic/indent": ["error", 4],
            "@stylistic/max-len": [
                "error",
                120,
                {
                    ignoreTrailingComments: true,
                    ignoreComments: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreUrls: true,
                    ignoreRegExpLiterals: true
                }
            ],

            // Type checking
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-require-imports": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "react-hooks/exhaustive-deps": "off"
        },

        languageOptions: {
            globals: {
                ...globals.browser
            }
        }
    },
    globalIgnores(["node_modules", "dist", "build", "public", "src/components/ui"])
]);
