export interface IDirectionsForTests {
  blockName: string;
  numberOfQuestions: number;
  numberOfCorrectAnswers: number;
}

interface IAnswers {
  answer: string;
  id: number;
}

export interface ITestQuestions {
  question: string;
  answers: IAnswers[];
}
