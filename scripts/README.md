# QuickLearner Scripts

This directory contains utility scripts for the QuickLearner app.

## OpenAI API Test Script

These scripts help you test your OpenAI API key to verify it works correctly with the sentence practice feature.

### Prerequisites

- Node.js installed on your system
- For TypeScript version: ts-node (`npm install -g ts-node`)
- axios (`npm install axios` if not already installed)

### Usage

#### Using the Shell Script (Recommended)

```bash
./scripts/test-openai.sh <api-key> <word>
```

Example:
```bash
./scripts/test-openai.sh sk-1234567890abcdef1234567890abcdef casa
```

This will automatically choose the JavaScript or TypeScript version based on what's available on your system.

#### Using JavaScript directly

```bash
node scripts/test-openai.js <api-key> <word>
```

Example:
```bash
node scripts/test-openai.js sk-1234567890abcdef1234567890abcdef casa
```

#### Using TypeScript directly

```bash
npx ts-node scripts/test-openai.ts <api-key> <word>
```

Example:
```bash
npx ts-node scripts/test-openai.ts sk-1234567890abcdef1234567890abcdef casa
```

### Expected Output

If successful, you'll see:

```
Testing OpenAI API with word: "casa"...
Making API request...
Request completed in 1.23s

✅ API KEY WORKS CORRECTLY!

English sentence:
  "I would like to buy a casa in Italy."

Italian translation:
  "Vorrei comprare una casa in Italia."

Raw API response:
{"en": "I would like to buy a casa in Italy.", "it": "Vorrei comprare una casa in Italia."}

This confirms your OpenAI API key is working properly.
You can add it to your app.json file to enable sentence practice.
```

If there's an error, you'll see detailed information about what went wrong, such as an invalid API key or connectivity issues.

### After Verification

Once you've verified your API key works:

1. Open `app.json` in the project root
2. Replace "YOUR_OPENAI_API_KEY_HERE" with your actual API key in the `extra.openaiApiKey` field:

```json
"extra": {
  "openaiApiKey": "sk-1234567890abcdef1234567890abcdef"
}
```

3. Save the file and restart your app 