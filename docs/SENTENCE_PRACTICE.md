# Sentence Practice Mode

This experimental feature generates practice sentences for your vocabulary words, helping you see and practice words in context.

## Setup

### 1. OpenAI API Key

To use the sentence practice mode, you need an OpenAI API key:

1. Visit [OpenAI Platform](https://platform.openai.com/) and sign up or log in
2. Go to API Keys section and create a new API key
3. Copy the API key and add it to your app.json file:

```json
{
  "expo": {
    "extra": {
      "openaiApiKey": "YOUR_OPENAI_API_KEY_HERE"
    }
  }
}
```

### 2. Install Required Packages

```bash
npm install react-native-flip-card-plus axios @react-native-async-storage/async-storage
```

## How to use

1. Go to any word list
2. Tap the "Translate" button (bottom FAB)
3. Select the words you want to practice
4. Tap "Practice Selected" to start practice mode
5. View English sentences, flip to see Italian translations
6. Mark words as "Known" or "Still Learning" to track progress

## How it works

For each selected word:

1. The app calls OpenAI's API to generate a natural sentence containing your word
2. The response includes both English and Italian translations
3. Results are cached to reduce API calls and costs
4. Your progress with each word affects its proficiency score

## Notes

- This is an experimental feature and may change
- API calls cost money (approx. $0.50 per 1,000 sentences using GPT-3.5-turbo)
- Sentences are cached to reduce costs
- Consider adding a usage limit in production

## Alternative setups

For production use, consider these alternatives:

1. **On-device LLM**: Use a small local model to avoid network costs
2. **DeepL API**: Generate sentences locally, use DeepL for translation only
3. **Self-hosting**: Run your own LLM server for sentence generation 