import browser from "webextension-polyfill";

import { Message, Problem } from "../types";

export const sendBackgroundMessage = (
  subject: string,
  problem?: Problem
): Promise<any> => {
  const message: Message = {
    from: "popup",
    subject: subject,
    problem: problem,
  };
  return browser.runtime.sendMessage(message);
};
