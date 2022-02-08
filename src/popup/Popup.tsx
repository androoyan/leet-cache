import { useEffect, useState } from "react";

import Card from "./components/Card";
import CardList from "./components/CardList";
import Header from "./components/Header";
import { sendBackgroundMessage } from "./utils";

import { Problem } from "../types";

const Popup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [problemsDue, setProblemsDue] = useState<Problem[]>([]);
  const [isProblemDue, setIsProblemDue] = useState<boolean>(false);

  useEffect(() => {
    const getDataFromBackground = async (): Promise<void> => {
      const data = await sendBackgroundMessage("popupMounted");
      if (data.problem !== null) {
        setProblem(data.problem);
        setIsProblemDue(
          data.problem.due === undefined ||
            data.problem.due <= Math.floor(Date.now() / 1000)
            ? true
            : false
        );
      }
      setProblemsDue(data.problemsDue);
    };

    getDataFromBackground()
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const reviewedCard = (problemTitle: string): void => {
    setProblemsDue(
      problemsDue.filter((problem) => problem.title !== problemTitle)
    );
    setIsProblemDue(false);
  };

  return (
    <div id="App">
      {isLoading ? null : (
        <>
          <Header />
          <hr />
          {problem !== null && isProblemDue ? (
            <Card problem={problem} reviewedCard={reviewedCard} />
          ) : (
            <CardList problemsDue={problemsDue} />
          )}
        </>
      )}
    </div>
  );
};

export default Popup;
