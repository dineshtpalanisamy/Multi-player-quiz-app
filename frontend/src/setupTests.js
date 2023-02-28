// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { quizReducer, userReducer } from "../../frontend/src/reducers";
const TestProviders = ({ initState, defaultState }) => {
  initState ||= {
    location: "",
    results: [
      { question: "Hello", correct_answer: "hello", answers: ["hello"] },
    ],
    current_question_index: 0,
    score: 0,
    endOfQuestions: false,
    loading: false,
  };
  defaultState ||= {
    user: { username: "testUser", type: "HOST" },
    id: "adsfasfafsaf",
    room: "hello",
  };
  let testReducer = () => quizReducer(initState, { type: "@@INIT" });
  let testReducerTwo = () => userReducer(defaultState, { type: "@@INIT" });
  const rootReducer = combineReducers({
    quizReducer: testReducer,
    user: testReducerTwo,
  });
  const testStore = configureStore(rootReducer, applyMiddleware(thunk));
  return ({ children }) => <Provider store={testStore}>{children}</Provider>;
};
const renderWithReduxProvider = (ui, options = {}) => {
  let TestWrapper = TestProviders(options);
  render(ui, { wrapper: TestWrapper, ...options });
};
import axios from "axios";
jest.mock("axios");
axios.get.mockResolvedValue({
  data: [
    {
      question: "What is the capital city of France?",
      correct_answer: "Paris",
    },
  ],
});
global.renderWithReduxProvider = renderWithReduxProvider;
global.React = React;
