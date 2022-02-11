import { Problem } from "../../types";
import { sendBackgroundMessage } from "../utils";

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
        difficulty: target.value,
      };
      await sendBackgroundMessage("updateCardReview", updatedProblem);
      reviewedCard(problem.title);
    } catch (e) {
      alert(e);
    }
  };

  const editCard = async () => {
    const editProblem: Problem = { title: problem.title, notes: problem.notes };
    await sendBackgroundMessage("editProblemNotes", editProblem);
    //const popup = window.open(
    //  browser.runtime.getURL("popup.html"),
    //  "HELLO",
    //  "width=400,height=400"
    //);
    //if (popup !== null) {
    //  popup.document.write(ReactDOMServer.renderToString(<Header />));
    //}
  };

  return (
    <div id="card-container">
      <div id="card-title">
        <h2>{problem.title}</h2>
      </div>

      <div id="card-buttons-container">
        <button
          type="button"
          id="btn-hard"
          className="card-btn"
          value="hard"
          onClick={handleClick}
        >
          Hard
        </button>
        <button
          type="button"
          id="btn-good"
          className="card-btn"
          value="good"
          onClick={handleClick}
        >
          Good
        </button>
        <button
          type="button"
          id="btn-easy"
          className="card-btn"
          value="easy"
          onClick={handleClick}
        >
          Easy
        </button>
      </div>
      <button type="button" onClick={editCard}>
        EDIT
      </button>
    </div>
  );
};

export default Card;
