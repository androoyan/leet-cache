import browser from "webextension-polyfill";

import { Message, Problem } from "../types";

const getProblemTitle = (): string | null => {
  const element = document.body.querySelector("div[data-cy='question-title']");
  if (element === null || element.lastChild === null) {
    return null;
  }
  const title = element.lastChild.textContent;
  return title;
};

const getProblemDifficulty = (): string | null => {
  const element = document.body.querySelector("div[diff]");
  if (element === null || element.lastChild === null) {
    return null;
  }
  const difficulty = element.lastChild.textContent;
  return difficulty;
};

const getProblemPathname = (): string => {
  const pathname = window.location.pathname;
  const pathnameArr = pathname.split("/").filter((path) => path);
  const problemPathname = pathnameArr[1];
  return problemPathname;
};

browser.runtime.onMessage.addListener((message: Message): Promise<object> => {
  if (message.from === "background" && message.subject === "getProblem") {
    const title = getProblemTitle();
    const difficulty = getProblemDifficulty();
    const pathname = getProblemPathname();
    const problem: Problem = { title, difficulty, pathname };
    return Promise.resolve(problem);
  }
  return Promise.reject(new Error("Content: unexpected message sender"));
});
