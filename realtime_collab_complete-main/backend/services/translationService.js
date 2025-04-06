const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate({ projectId: process.env.GOOGLE_PROJECT_ID });

class TranslationService {
    async translateText(text, targetLanguage) {
        try {
            const [translation] = await translate.translate(text, targetLanguage);
            return translation;
        } catch (error) {
            console.error('Translation error:', error);
            throw new Error('Failed to translate text');
        }
    }

    async detectLanguage(text) {
        try {
            const [detection] = await translate.detect(text);
            return detection;
        } catch (error) {
            console.error('Language detection error:', error);
            throw new Error('Failed to detect language');
        }
    }
}

module.exports = new TranslationService();