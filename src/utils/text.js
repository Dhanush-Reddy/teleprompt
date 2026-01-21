export const splitTextToSentences = (text) => {
    if (!text) return [];

    // Use Intl.Segmenter for robust sentence segmentation if available
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
        const segments = Array.from(segmenter.segment(text));
        return segments
            .map(s => s.segment.trim())
            .filter(s => s.length > 0);
    }

    // Fallback for environments without Intl.Segmenter
    return text.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g)
        ?.map(s => s.trim())
        ?.filter(s => s.length > 0) || [];
};

export const calculateDuration = (text, speedSetting) => {
    // Approximate duration logic
    // Base reading speed: average human reads ~230 wpm => ~260ms per word
    // Slow: 180 wpm (~330ms/word), Normal: 230 wpm, Fast: 300 wpm (~200ms/word)

    const wordCount = text.split(/\s+/).length;
    const baseMsPerWord = {
        slow: 330,
        normal: 260,
        fast: 200,
    }[speedSetting] || 260;

    let duration = wordCount * baseMsPerWord;

    // Add a base buffer for short sentences to prevent them from flashing too fast
    duration = Math.max(duration, 1500); // Minimum 1.5 seconds

    // Add pause for punctuation
    const punctuationCount = (text.match(/[,;:]/g) || []).length;
    duration += punctuationCount * 200;

    return duration;
};
