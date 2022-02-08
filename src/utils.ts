export const isEmpty = (results: object): boolean => {
  if (JSON.stringify(results) === "{}") {
    return true;
  }
  return false;
};
