import { sendBackgroundMessage } from "../utils";
import { Problem } from "../../types";

const Card = ({
  problem,
  reviewedCard,
}: {
  problem: Problem;
  reviewedCard: Function;
}) => {
  const handleClick = async (event: React.MouseEvent): Promise<void> => {
    try {
      const target = event.target as HTMLButtonElement;
      const updatedProblem: Problem = {
        title: problem.title,
        difficulty: target.id,
      };
      await sendBackgroundMessage("updateCardReview", updatedProblem);
      reviewedCard(problem.title);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div id="card-container">
      <div id="card-title">
        <h2>{problem.title}</h2>
      </div>

      <form id="card-form">
        <div id="card-buttons">
          <button
            type="button"
            id="hard"
            className="button button-hard"
            onClick={handleClick}
          >
            Hard
          </button>
          <button
            type="button"
            id="good"
            className="button button-good"
            onClick={handleClick}
          >
            Good
          </button>
          <button
            type="button"
            id="easy"
            className="button button-easy"
            onClick={handleClick}
          >
            Easy
          </button>
        </div>
      </form>
    </div>
  );
};

export default Card;
