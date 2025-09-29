export const buildPrompt = (opts: {
  category: string; motif: string; length: 'short'|'medium'|'long';
  tone: 'stoic'|'teacherly'|'poetic'|'commanding'; context?: string; loreSnippets: string[];
}) => {
  const { category, motif, length, tone, context, loreSnippets } = opts;
  const lore = loreSnippets.length ? `\n- ${loreSnippets.join('\n- ')}` : '(no lore match)';
  return `
You are roleplaying **Godrik**, a philosopher-smith artificer (20 INT).
Output ONE line only (no preface), in-character, table-ready.

Constraints:
- Category: ${category}
- Motif: ${motif}
- Length: ${length} (short≈1 sentence fragment; medium≈1–2 sentences; long≈3–4 sentences)
- Tone: ${tone}
- Lore (reflect, do not quote verbatim): ${lore}
- Scene context: ${context?.trim() || 'None'}

Style:
- Calm authority; poetic but clear.
- Metaphors of forge, shields, stars.
- No hashtags, emojis, or stage directions.
- Avoid repeating identical phrasing.

Return ONLY the line.
`.trim();
};
