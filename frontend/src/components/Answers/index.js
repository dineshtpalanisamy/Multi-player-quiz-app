import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeQuestion, endQuestions } from "../../actions";
import "./style.css";

const Answers = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nextQuestion = (answer) => {
    dispatch(changeQuestion(encodeURIComponent(answer)));
  };
  const endQuestion = (finalAnswer) => {
    dispatch(endQuestions(encodeURIComponent(finalAnswer)));
  };
  const results = useSelector((state) => state.quizReducer.results);
  const quizLength = results.length;

  const handleAnswers = (answer) => {
    const decodedAnswer = answer.map((a) => {
      return decodeURIComponent(a);
    });
    return decodedAnswer;
  };

  let answers = handleAnswers(props.answer);

  const finalAnswer = async (i) => {
    endQuestion(i);
    navigate("/score");
  };

  if (props.index === quizLength - 1) {
    return (
      <div className="options">
        {answers &&
          answers.map((i) => (
            <button id="cards" key={i} onClick={() => finalAnswer(i)}>
              {i}
            </button>
          ))}
      </div>
    );
  } else {
    return (
      <div className="options">
        {answers &&
          answers.map((i) => (
            <button
              role="button"
              id="cards"
              key={i}
              onClick={() => nextQuestion(i)}
            >
              {i}
            </button>
          ))}
      </div>
    );
  }
};

export default Answers;
