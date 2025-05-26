#!/bin/bash

# Test OpenAI API for sentence generation
#
# Usage:
#   ./scripts/test-openai.sh <word>
#
# Example:
#   ./scripts/test-openai.sh gatto

# Check for required arguments
if [ $# -lt 1 ]; then
  echo "Error: Missing word"
  echo "Usage: ./scripts/test-openai.sh <word>"
  exit 1
fi

# Load API key from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
  if [ -z "$OPENAI_API_KEY" ]; then
    echo "Error: OPENAI_API_KEY not found in .env file"
    exit 1
  fi
else
  echo "Error: .env file not found"
  exit 1
fi

WORD=$1

echo "Using JavaScript version (node)"
node scripts/test-openai.js "$OPENAI_API_KEY" "$WORD"