import browser from "webextension-polyfill";
import initSqlJs, { Database } from "sql.js";

import { isEmpty } from "../utils";

export const getDatabase = async (): Promise<Database> => {
  try {
    const SQL = await initSqlJs();
    const results = await browser.storage.local.get("binaryArr");
    if (isEmpty(results)) {
      const database = new SQL.Database();
      database.exec(
        "CREATE TABLE problems (title char, difficulty char, pathname char, due int, ease float, interval int, notes char);"
      );
      return database;
    } else {
      return new SQL.Database(results["binaryArr"]);
    }
  } catch (e) {
    throw e;
  }
};

export const updateDatabase = async (
  title: string,
  params: { [index: string]: number | string }
): Promise<void> => {
  const queryObj = generateUpdateQuery(title, params);

  let db = null;
  try {
    db = await getDatabase();
    db.exec(<string>queryObj.queryStr, <(number | string)[]>queryObj.paramsArr);

    const binaryArr = db.export();
    await browser.storage.local.set({ binaryArr });
  } catch (e) {
    throw e;
  } finally {
    if (db !== null) {
      db.close();
    }
  }
};

const generateUpdateQuery = (
  title: string,
  params: { [index: string]: number | string }
): { [index: string]: string | (number | string)[] } => {
  const paramsStrArr = Object.keys(params).map((key) => `${key}=?`);
  const paramsArr = Object.values(params);
  const queryStrArr = [
    "UPDATE problems SET",
    paramsStrArr.join(", "),
    "WHERE title=?;",
  ];
  const queryStr = queryStrArr.join(" ");
  paramsArr.push(title);
  return { queryStr, paramsArr };
};
