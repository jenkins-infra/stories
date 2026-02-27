export default function estimateReadTime(paragraphs = [], wordsPerMinute = 200) {
    if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
        return 1;
    }
    const fullText = paragraphs
        .map(p => (typeof p === 'string' ? p : p.html || ''))
        .join(' ');
    const cleanedText = fullText
        .replace(/<[^>]*>/g, ' ') // remove HTML tags
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // remove markdowns
        .replace(/https?:\/\/\S+/g, '') // remove raw URLs
        .replace(/[`*_>#-]/g, '') // remove markdown symbols
        .replace(/\s+/g, ' ')
        .trim();
    if (!cleanedText) return 1;
    const words = cleanedText.split(' ').filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
    return minutes;
}
