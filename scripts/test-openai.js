#!/usr/bin/env node

/**
 * Test OpenAI API for sentence generation with JSON mode
 * 
 * Usage:
 *   node test-openai.js <api-key> <word>
 * 
 * Example:
 *   node test-openai.js sk-xxxxxxxxxxxxxxxxxxxxxxxx gatto
 */

const axios = require('axios');

// Get the API key and word from command-line arguments
const apiKey = process.argv[2];
const word = process.argv[3];

if (!apiKey || !word) {
  console.error('Error: Missing API key or word');
  console.error('Usage: node test-openai.js <api-key> <word>');
  process.exit(1);
}

console.log(`Testing OpenAI API with word: "${word}"...`);

async function testOpenAI() {
  try {
    // Note explicitly mentioning JSON in the prompt as required by JSON mode
    const systemPrompt = "You are a helpful assistant designed to output JSON. Respond with valid JSON only.";
    const userPrompt = `Write a short sentence (≤10 words) that naturally includes the word "${word}". 
    Then translate that entire sentence to Italian. 
    Respond with JSON in this exact format: { "en": "English sentence here", "it": "Italian translation here" }`;

    console.log('Making API request...');
    const startTime = Date.now();
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }  // Enable JSON mode
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Request completed in ${elapsedTime}s`);

    // Check if we have a complete response
    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('No choices in response from OpenAI');
    }

    const choice = response.data.choices[0];
    
    // Check for incomplete generation
    if (choice.finish_reason !== 'stop') {
      console.warn(`\n⚠️ Warning: Response may be incomplete. Finish reason: ${choice.finish_reason}`);
    }

    const content = choice.message.content;
    if (!content) {
      throw new Error('No content in response from OpenAI');
    }

    try {
      // Parse the JSON response
      const sentenceData = JSON.parse(content);
      
      // Validate the expected structure
      if (!sentenceData.en || !sentenceData.it) {
        throw new Error('Response is missing required fields (en or it)');
      }
      
      console.log('\n✅ API KEY WORKS CORRECTLY!\n');
      console.log('English sentence:');
      console.log(`  "${sentenceData.en}"`);
      console.log('\nItalian translation:');
      console.log(`  "${sentenceData.it}"`);
      console.log('\nRaw JSON response:');
      console.log(content);
      console.log('\nUsage statistics:');
      console.log(`  Prompt tokens: ${response.data.usage.prompt_tokens}`);
      console.log(`  Completion tokens: ${response.data.usage.completion_tokens}`);
      console.log(`  Total tokens: ${response.data.usage.total_tokens}`);
      console.log('\nThis confirms your OpenAI API key is working properly.');
      console.log('You can add it to your app.json file to enable sentence practice.');
    } catch (parseError) {
      console.error('\n❌ ERROR: Failed to parse JSON response:');
      console.error(parseError);
      console.error('\nRaw response content:');
      console.error(content);
    }
    
  } catch (error) {
    console.error('❌ ERROR: OpenAI API request failed');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      
      // Handle specific error cases
      if (error.response.status === 401) {
        console.error('\nYour API key appears to be invalid or expired.');
        console.error('Please check your key at https://platform.openai.com/api-keys');
      } else if (error.response.status === 429) {
        console.error('\nRate limit exceeded or insufficient quota.');
        console.error('You may need to add billing information to your OpenAI account.');
      } else if (error.response.status === 400) {
        console.error('\nBad request - possibly an issue with your prompt or parameters.');
      }
      
      console.error('\nResponse data:');
      console.error(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('\nNo response received from OpenAI API');
      console.error('Please check your internet connection and try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('\nError:', error.message);
    }
  }
}

testOpenAI(); 