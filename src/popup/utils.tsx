import browser from "webextension-polyfill";

import { Message, Problem } from "../types";

export const sendBackgroundMessage = (
  from: string,
  subject: string,
  problem?: Problem
): Promise<any> => {
  const message: Message = {
    from: from,
    subject: subject,
    problem: problem,
  };
  return browser.runtime.sendMessage(message);
};
