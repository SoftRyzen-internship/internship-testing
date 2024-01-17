export const calcAnswers = (numberOfQuestions: number) => {
  const percent = Number(process.env.PERCENT_CORRECT_ANSWERS);
  return Math.floor((numberOfQuestions / 100) * percent);
};
