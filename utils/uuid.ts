// Simple UUID v4 generator that works across all platforms
// This is a simplified version that doesn't require crypto.getRandomValues()
export function generateUUID(): string {
    // Generate a random 32-character hex string
    const hex = '0123456789abcdef';
    let uuid = '';
    
    // Generate 32 random hex characters
    for (let i = 0; i < 32; i++) {
        const randomIndex = Math.floor(Math.random() * hex.length);
        uuid += hex[randomIndex];
    }
    
    // Format as UUID v4
    return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-4${uuid.substring(13, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;
} 