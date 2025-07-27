// the generatePlan function that processes the tasks
const axios = require('axios');

const generatePlan = async (req, res) => {
  const { tasks, settings } = req.body;
  const { aiPersonality, breakInterval, preferredWorkHours } = settings;

  try {
    const prompt = `
You are an AI scheduler with a ${aiPersonality} personality.
My preferred work hours are from ${preferredWorkHours.start} to ${preferredWorkHours.end}.
Please schedule the following tasks, placing a break every ${breakInterval} minutes:
Also please give additional insights to make my day even more productive and how i can stay fit and healthy and feel good about myself

${tasks.map((t, i) => `${i + 1}. ${t.title} (${t.duration} mins)`).join('\n')}
`;


    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    const lines = reply.split('\n').filter(line => line.trim() !== '');

    const schedule = lines.map(line => {
      const [time, ...taskArr] = line.split(' - ');
      return {
        time: time.trim(),
        task: taskArr.join(' - ').trim()
      };
    });

    res.json({ schedule });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "AI planning failed" });
  }
};

module.exports = { generatePlan };
