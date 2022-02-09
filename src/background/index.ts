import base64js from "base64-js";
import pako from "pako";
import browser from "webextension-polyfill";

import { getDatabase, updateDatabase } from "./database";
import { Message, Problem } from "../types";

const SECS_IN_DAY = 86400;
const HARD_PENALTY = 1.2;
const EASY_BONUS = 1.3;

const getTabID = async (): Promise<number> => {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0].id === undefined) {
      throw new Error();
    }
    return tabs[0].id;
  } catch {
    throw new Error("TabError");
  }
};

const sendContentMessage = async (subject: string): Promise<Problem> => {
  try {
    const tabID = await getTabID();
    const message: Message = {
      from: "background",
      subject: subject,
    };
    const response = await browser.tabs.sendMessage(tabID, message);
    return response;
  } catch (e) {
    if (
      e.message !== "TabError" &&
      e.message !== "Content: unexpected message sender"
    ) {
      throw new Error("ContentConnectionError");
    }
    throw e;
  }
};

const getProblemData = async (
  title: string | null,
  difficulty: string | null,
  pathname: string
): Promise<Problem | null> => {
  let db = null;
  try {
    db = await getDatabase();
    const results = db.exec(
      "SELECT difficulty, due, pathname FROM problems WHERE title=?;",
      [title]
    );

    if (results.length === 0) {
      db.exec("INSERT INTO problems VALUES (?, ?, ?, ?, ?, ?, ?);", [
        title,
        difficulty,
        pathname,
        null,
        2.5,
        7,
        null,
      ]);

      const binaryArr = db.export();
      const gzipArr = pako.gzip(binaryArr);
      const base64Str = base64js.fromByteArray(gzipArr);
      await browser.storage.local.set({ base64Str });

      return <Problem>{ title, difficulty };
    }

    return <Problem>{
      title: title,
      difficulty: results[0].values[0][0],
      due: results[0].values[0][1],
      pathname: results[0].values[0][2],
    };
  } catch (e) {
    return Promise.reject(new Error(`Error inserting into database: ${e}`));
  } finally {
    if (db !== null) {
      db.close();
    }
  }
};

const getProblem = async (): Promise<Problem | null> => {
  let problem = null;
  try {
    const contentProblem = await sendContentMessage("getProblem");
    if (
      contentProblem.title !== null &&
      contentProblem.difficulty !== undefined &&
      contentProblem.pathname !== undefined
    ) {
      problem = await getProblemData(
        contentProblem.title,
        contentProblem.difficulty,
        contentProblem.pathname
      );
    }
  } catch (e) {
    // Absorb error if content script not injected aka tab not on a valid
    // leetcode problem else we throw error up the stack
    if (e.message !== "ContentConnectionError") {
      throw e;
    }
  } finally {
    return problem;
  }
};

const getProblemsDue = async (): Promise<Problem[]> => {
  let db = null;
  try {
    db = await getDatabase();
    const results = db.exec(
      "SELECT title, difficulty, pathname, notes FROM problems WHERE due <= strftime('%s','now')"
    );
    if (results.length === 0) {
      return [];
    }

    const problems = results[0].values.map((arr) => {
      return <Problem>{
        title: arr[0],
        difficulty: arr[1],
        pathname: arr[2],
        notes: arr[3],
      };
    });
    return problems;
  } catch (e) {
    throw e;
  } finally {
    if (db !== null) {
      db.close();
    }
  }
};

const getCards = async (): Promise<object> => {
  try {
    const problem: Problem | null = await getProblem();
    const problemsDue: Problem[] = await getProblemsDue();
    return { problem, problemsDue };
  } catch (e) {
    throw e;
  }
};

const updateCardReview = async (problem: Problem): Promise<string> => {
  if (problem.title === null) {
    throw new Error("Title is null");
  } else if (problem.difficulty === null || problem.difficulty === undefined) {
    throw new Error("Difficulty is null/undefined");
  }

  let db = null;
  try {
    db = await getDatabase();
    const results = db.exec(
      "SELECT due, ease, interval FROM problems WHERE title=?;",
      [problem.title]
    );
    const problemDataArr: number[] = <number[]>results[0].values[0];
    let due: number = problemDataArr[0];
    let ease: number = problemDataArr[1];
    let interval: number = problemDataArr[2];

    const today: number = Math.floor(Date.now() / 1000);

    switch (problem.difficulty) {
      case "hard":
        interval *= HARD_PENALTY;
        ease -= 0.15;
        break;
      case "good":
        interval *= ease;
        // ease remains unchanged
        break;
      case "easy":
        interval *= ease * EASY_BONUS;
        ease += 0.15;
        break;
    }
    due = today + interval * SECS_IN_DAY;

    const params = {
      difficulty: problem.difficulty,
      due: due,
      ease: ease,
      interval: interval,
    };
    await updateDatabase(problem.title, params);

    return Promise.resolve("Successfully updated card review information");
  } catch (e) {
    return Promise.reject(e);
  } finally {
    if (db !== null) {
      db.close();
    }
  }
};

const parseMessageFromPopup = (message: Message): Promise<object | string> => {
  if (message.subject === "popupMounted") {
    return getCards();
  } else if (message.subject === "updateCardReview") {
    if (message.problem !== undefined) {
      return updateCardReview(message.problem);
    }
    return Promise.reject(
      new Error("Background: problem is undefined when updating card review")
    );
  }
  return Promise.reject(new Error("Background: unexpected message subject"));
};

const parseMessage = (message: Message): Promise<object | string> => {
  if (message.from === "popup") {
    return parseMessageFromPopup(message);
  }
  return Promise.reject(new Error("Background: unexpected message sender"));
};

browser.runtime.onMessage.addListener(parseMessage);
