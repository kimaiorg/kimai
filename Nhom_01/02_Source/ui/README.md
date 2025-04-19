This is a [Next.js](https://nextjs.org) app project - Kimai solution

## Getting Started

#### First, you must follow the following instructions:

1. OPTIONAL: If you installed **Prettier** in your **VS Code**, let's change the config path of Prettier by following the contructions: `Ctrl + Shift + P` -> type `Preferences: Open User Settings (Json)` -> in your `settings.json`, find the property `"prettier.configPath"`, create new one if not existed and set the path to the `.prettierrc` file start from the working project.
   - Ex: If you are open the folder `ui`, you must set `./.prettierrc`. If you are open the folder `02_Source`, you must set the path `./ui/.prettierrc`.
2. Let's run the command: `npm run prepare` to let `Husky` can listen Git events.
3. Now, let try running `npm run format` to format the entire source code in `ui/` folder. Then, try running `npm run lint` to check the source code.
4. Try make some changes and commit file to trigger `Husky` capturing Git commit event. If there is any error, the commit will be failed.

#### Finally, run the development server to run the app:

```bash
npm i -f && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Other tools:

- Color palette: [https://coolors.co/](https://coolors.co/6e44ff-936bff-b892ff-dcaaf1)
