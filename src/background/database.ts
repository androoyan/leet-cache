import base64js from "base64-js";
import pako from "pako";
import initSqlJs, { Database } from "sql.js";
import browser from "webextension-polyfill";

import { isEmpty } from "../utils";

export const getDatabase = async (): Promise<Database> => {
  try {
    const SQL = await initSqlJs();
    const results = await browser.storage.local.get("base64Str");
    if (isEmpty(results)) {
      const database = new SQL.Database();
      database.exec(
        "CREATE TABLE problems (title char, difficulty char, pathname char, due int, ease float, interval int, notes char);"
      );
      return database;
    } else {
      const gzipArr = base64js.toByteArray(results["base64Str"]);
      const ungzipArr = pako.ungzip(gzipArr);
      return new SQL.Database(ungzipArr);
    }
  } catch (e) {
    throw e;
  }
};

export const updateDatabase = async (
  title: string,
  params: { [index: string]: number | string }
): Promise<boolean> => {
  const queryObj = generateUpdateQuery(title, params);

  let db = null;
  try {
    db = await getDatabase();
    db.exec(<string>queryObj.queryStr, <(number | string)[]>queryObj.paramsArr);

    const binaryArr = db.export();
    const gzipArr = pako.gzip(binaryArr);
    const base64Str = base64js.fromByteArray(gzipArr);
    await browser.storage.local.set({ base64Str });
    return true;
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
