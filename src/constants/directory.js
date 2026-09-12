export const SAMPLE_PEOPLE = [
  'Alex Kim',
  'Priya Nair',
  'Jordan Lee',
  'Sam Ortiz',
  'Maya Chen',
  'Diego Ruiz',
  'Faith Adeyemi',
  'Noah Becker',
  'Lena Wolf',
  'Theo Marsh',
];

export function emailFor(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, '.') + '@gummygum.com'
  );
}

export const DIRECTORY = SAMPLE_PEOPLE.map((name) => ({
  name,
  email: emailFor(name),
}));

export const RATING_EMOJI = ['😣', '😕', '😐', '🙂', '😄'];
export const LIKERT_EMOJI = ['😠', '🙁', '😐', '🙂', '😍'];

export const FAKE_COMMENTS = [
  'More clarity around priorities would help.',
  'I feel supported by my manager.',
  'Communication has improved recently.',
  "It's been a bit chaotic with the new tools.",
  'Pretty good overall, no complaints.',
  'Would love more recognition for good work.',
  'Team collaboration has been great this month.',
  'Workload feels heavier than usual lately.',
  'Escalation process could be clearer.',
  'I appreciate how open my manager is.',
];

export function fakeRespondentAnswers(questions) {
  const answers = {};
  questions.forEach((qq) => {
    if (qq.type === 'rating') {
      answers[qq.id] = Math.max(1, Math.min(5, Math.round(3.1 + (Math.random() * 2 - 1) * 1.7)));
    } else if (qq.type === 'likert') {
      answers[qq.id] = Math.max(0, Math.min(4, Math.round(2.5 + (Math.random() * 2 - 1) * 1.6)));
    } else if (qq.type === 'single') {
      answers[qq.id] = Math.floor(Math.random() * (qq.options?.length || 1));
    } else if (qq.type === 'multi') {
      const arr = [];
      (qq.options || []).forEach((_, i) => {
        if (Math.random() < 0.45) arr.push(i);
      });
      answers[qq.id] = arr.length ? arr : [0];
    } else if (qq.type === 'open') {
      answers[qq.id] = FAKE_COMMENTS[Math.floor(Math.random() * FAKE_COMMENTS.length)];
    }
  });
  return answers;
}
