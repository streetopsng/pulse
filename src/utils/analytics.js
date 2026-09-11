export function tagComment(text) {
  const t = (text || '').toLowerCase();
  const attentionWords = [
    'hard', 'stress', 'unclear', 'confus', 'chaotic',
    'overwhelm', 'burnout', 'no support', 'not enough', 'worse',
    'difficult', 'heavier', 'issue', 'problem', 'blocked', 'slow',
  ];
  const positiveWords = [
    'good', 'great', 'support', 'improved', 'love',
    'clear', 'helpful', 'proud', 'appreciate', 'well', 'open',
    'awesome', 'excellent', 'smooth', 'collaborative',
  ];

  if (attentionWords.some((w) => t.includes(w))) return 'attention';
  if (positiveWords.some((w) => t.includes(w))) return 'positive';
  return 'neutral';
}

export function computeSnapshot(pulse) {
  if (!pulse) return null;
  const responses = pulse.responses || [];
  const n = responses.length;

  const perQuestion = (pulse.questions || []).map((qq) => {
    if (qq.type === 'rating' || qq.type === 'likert') {
      const vals = responses
        .map((r) => r.answers?.[qq.id])
        .filter((v) => v !== undefined && v !== null);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      const scoreOn5 = avg === null ? null : (qq.type === 'likert' ? +(1 + avg).toFixed(1) : +avg.toFixed(1));
      return { q: qq, avg: scoreOn5, answered: vals.length };
    }

    if (qq.type === 'single' || qq.type === 'multi') {
      const dist = (qq.options || []).map(() => 0);
      responses.forEach((r) => {
        const v = r.answers?.[qq.id];
        if (v === undefined || v === null) return;
        if (qq.type === 'single') {
          if (dist[v] !== undefined) dist[v]++;
        } else if (Array.isArray(v)) {
          v.forEach((idx) => {
            if (dist[idx] !== undefined) dist[idx]++;
          });
        }
      });
      const answeredCount = responses.filter(
        (r) => r.answers?.[qq.id] !== undefined && r.answers?.[qq.id] !== null
      ).length;
      return { q: qq, dist, answered: answeredCount };
    }

    // open text
    const comments = responses
      .map((r) => ({ text: r.answers?.[qq.id], isReal: r.isReal, submittedAt: r.submittedAt }))
      .filter((c) => c.text && typeof c.text === 'string' && c.text.trim())
      .map((c) => ({ ...c, tag: tagComment(c.text) }));

    return { q: qq, comments, answered: comments.length };
  });

  const categories = perQuestion
    .filter((pq) => pq.q.topic && pq.avg !== null)
    .map((pq) => ({ name: pq.q.topic, score: pq.avg }));

  const overall = categories.length
    ? +(categories.reduce((s, c) => s + c.score, 0) / categories.length).toFixed(1)
    : null;

  const allComments = perQuestion
    .filter((pq) => pq.q.type === 'open')
    .flatMap((pq) => pq.comments || []);

  return { perQuestion, categories, overall, allComments, responseCount: n };
}
