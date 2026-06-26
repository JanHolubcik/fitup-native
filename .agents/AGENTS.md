# Style Preferences

- **Function Declarations:** Always define functional components and helper functions using arrow function syntax (`const ComponentName = () => {}`) instead of `function ComponentName() {}` declarations. Use a separate `export default ComponentName` statement at the bottom of the file instead of inline default exports.
- **Type Declarations:** Use `type` aliases instead of `interface` definitions.
- **Return Types:** Do not explicitly annotate return types for React components (e.g., avoid `: React.JSX.Element` or `: JSX.Element`) because TypeScript can infer them automatically.
- **Translation Keys:** Do not use default fallback strings with the translation function `t()`. Avoid code patterns like `t("key") || "Default English string"`. Always use `t("key")` directly. This ensures missing translations are obvious in the application and in translation files.
