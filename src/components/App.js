import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import { useEffect, useReducer } from "react";
import Timer from "./Timer";
import Progress from "./Progress"
const SEC_PER_QUESTION = 30;
const initialState = {
  questions: [],
  status: "Loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "newQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
      };
    case "restart":
      return { ...state, index: 0, answer: null, points: 0, status: "ready" };
    case "ticktack":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      // .then((data)=>console.log(data))
      .then((data) => {
        console.log(data);
        dispatch({ type: "dataRecieved", payload: data });
      })
      .catch((err) => {
        console.error("Data fetch failed: ", err);
        dispatch({ type: "dataFailed" });
      });
  }, []);

  const numQuestions = questions ? questions.length : 0;
  const maxPossibolePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}

        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}

        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              points={points}
              index={index}
              answer={answer}
              maxPossibolePoints={maxPossibolePoints}
            />
            <Question
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <Timer
                secondsRemaining={secondsRemaining}
                dispatch={dispatch}
              />
              <NextButton
                answer={answer}
                dispatch={dispatch}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossibolePoints}
            dispatch={dispatch}
            highScore={highScore}
          />
        )}
      </Main>
    </div>
  );
}
