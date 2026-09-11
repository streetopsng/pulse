export function createQuestion(text, type, topic = null, options = null) {
  const q = {
    id: 'q_' + Math.random().toString(36).slice(2, 9),
    text,
    type,
    required: true,
    topic: topic || null,
  };
  if (type === 'rating') q.scaleMax = 5;
  if (type === 'single' || type === 'multi') {
    q.options = options ? [...options] : ['Option 1', 'Option 2', 'Option 3'];
  }
  return q;
}

export function cloneQuestions(questionsList) {
  return questionsList.map((q) => ({
    ...q,
    options: q.options ? [...q.options] : undefined,
  }));
}

export const TEMPLATES = {
  team: {
    id: 'team',
    name: 'Team Experience',
    icon: '🤝',
    bgColor: 'bg-accent-soft',
    textColor: 'text-accent',
    desc: 'A broad check-in on how the team is doing overall.',
    questions: [
      createQuestion('I feel supported by my team.', 'rating', 'Team Support'),
      createQuestion('My team communicates openly and honestly.', 'likert', 'Communication'),
      createQuestion('I feel a sense of belonging on this team.', 'rating', 'Belonging'),
      createQuestion('How connected do you feel to your teammates?', 'single', 'Connection', [
        'Very connected',
        'Somewhat connected',
        'Not very connected',
        'Not connected at all',
      ]),
      createQuestion("What's one thing that would improve your experience at work?", 'open'),
    ],
  },
  manager: {
    id: 'manager',
    name: 'Manager Support',
    icon: '🧭',
    bgColor: 'bg-grape-soft',
    textColor: 'text-grape',
    desc: 'Understand how supported people feel by their manager.',
    questions: [
      createQuestion('My manager supports my growth.', 'rating', 'Growth Support'),
      createQuestion('I get useful feedback from my manager.', 'likert', 'Feedback'),
      createQuestion('I feel comfortable raising concerns with my manager.', 'rating', 'Psychological Safety'),
      createQuestion('What would help your manager support you better?', 'open'),
    ],
  },
  comm: {
    id: 'comm',
    name: 'Communication',
    icon: '💬',
    bgColor: 'bg-mint-soft',
    textColor: 'text-mint',
    desc: 'Check whether information flows clearly across the team.',
    questions: [
      createQuestion('I understand how decisions get made around here.', 'likert', 'Decision Clarity'),
      createQuestion('I have the information I need to do my job well.', 'rating', 'Information Flow'),
      createQuestion('Which channel works best for team updates?', 'single', null, [
        'Slack / chat',
        'Email',
        'Team meetings',
        'Not sure',
      ]),
      createQuestion('Is there anything that feels unclear right now?', 'open'),
    ],
  },
  workload: {
    id: 'workload',
    name: 'Workload',
    icon: '⚖️',
    bgColor: 'bg-amber-soft',
    textColor: 'text-amber',
    desc: 'Get an honest read on capacity and pace.',
    questions: [
      createQuestion('My workload feels manageable right now.', 'rating', 'Workload'),
      createQuestion('I can take time off when I need to.', 'likert', 'Time Off'),
      createQuestion('How often do you work outside your normal hours?', 'single', 'Overtime', [
        'Never',
        'Rarely',
        'Sometimes',
        'Often',
      ]),
      createQuestion("What's making your workload harder than it needs to be?", 'open'),
    ],
  },
  wellbeing: {
    id: 'wellbeing',
    name: 'Wellbeing',
    icon: '🌤️',
    bgColor: 'bg-accent-soft',
    textColor: 'text-accent',
    desc: 'A gentle pulse on how people are doing.',
    questions: [
      createQuestion('I feel energized by my work most days.', 'rating', 'Energy'),
      createQuestion('I have a healthy balance between work and life.', 'likert', 'Work-Life Balance'),
      createQuestion("I feel comfortable being open about how I'm doing.", 'rating', 'Openness'),
      createQuestion('Anything on your mind we should know about?', 'open'),
    ],
  },
  connection: {
    id: 'connection',
    name: 'Team Connection',
    icon: '🌱',
    bgColor: 'bg-mint-soft',
    textColor: 'text-mint',
    desc: 'How connected people feel to each other and the mission.',
    questions: [
      createQuestion('I feel connected to the people I work with.', 'rating', 'Connection'),
      createQuestion('I understand how my work contributes to our goals.', 'likert', 'Purpose'),
      createQuestion('I feel proud to be part of this team.', 'rating', 'Pride'),
      createQuestion('What would help you feel more connected?', 'open'),
    ],
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    icon: '✦',
    bgColor: 'bg-surface-2',
    textColor: 'text-ink-soft',
    desc: 'Start from a blank pulse and build it your way.',
    questions: [],
  },
};
