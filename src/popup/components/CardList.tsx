import browser from "webextension-polyfill";

import { Problem } from "../../types";

const CardList = ({ problemsDue }: { problemsDue: Problem[] }) => {
  const handleClick = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    const element = event.target as HTMLAnchorElement;
    const url = element.href;
    await browser.tabs.update({ url });
    window.close();
  };

  return (
    <div id="card-list-container">
      {problemsDue.length !== 0 ? (
        <div id="problems-due">
          <h3>PROBLEMS DUE!</h3>
          <ul>
            {problemsDue.map((problem) => (
              <li className="card-list-problem-titles" key={problem.title}>
                <a
                  href={`https://leetcode.com/problems/${problem.pathname}`}
                  onClick={handleClick}
                >
                  {`[${problem.difficulty}] ${problem.title}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div id="problems-not-due">
          <h3>NO PROBLEMS DUE!</h3>
        </div>
      )}
    </div>
  );
};

export default CardList;
