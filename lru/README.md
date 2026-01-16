Run the TypeScript file (LRU demo)

1. Install dependencies:

```bash
npm install
```

2. To run directly with ts-node:

```bash
npm run start
```

3. To build and run the compiled JS:

```bash
npm run build
npm run start:node
```

Notes:
- `ts-node` is used for convenience; if you prefer global tools, install them globally.
- If TypeScript reports errors, run `npx tsc --noEmit` to see them.
