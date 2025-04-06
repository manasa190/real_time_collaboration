const OpenAI = require('openai');

class AIService {
    constructor() {
        try {
            if (process.env.OPENAI_API_KEY) {
                this.openai = new OpenAI(process.env.OPENAI_API_KEY);
            } else {
                console.log('OpenAI API key not found - AI features will be disabled');
                this.openai = null;
            }
        } catch (error) {
            console.log('Error initializing OpenAI - AI features will be disabled');
            this.openai = null;
        }
    }

    async generateSuggestions(content) {
        if (!this.openai) {
            return "AI features are currently disabled";
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant providing suggestions for document improvement."
                    },
                    {
                        role: "user",
                        content: `Please provide suggestions to improve this content: ${content}`
                    }
                ]
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error('AI suggestion error:', error);
            return "Error generating suggestions";
        }
    }

    async autoSummarize(content) {
        if (!this.openai) {
            return "AI features are currently disabled";
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Generate a concise summary of the following content."
                    },
                    {
                        role: "user",
                        content: content
                    }
                ]
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error('AI summarization error:', error);
            return "Error generating summary";
        }
    }
}

module.exports = new AIService(); 