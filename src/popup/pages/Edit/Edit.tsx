import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import { sendBackgroundMessage } from "../../utils";

import { Problem } from "../../../types";

const Edit = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editProblem, setEditProblem] = useState<Problem | null>(null);

  useEffect(() => {
    const getProblem = async (): Promise<void> => {
      const results = await sendBackgroundMessage("editMounted");
      if (results.editProblem !== null) {
        setEditProblem(results.editProblem);
      }
    };

    getProblem()
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (event: React.ChangeEvent): void => {
    const element = event.target as HTMLTextAreaElement;
    setEditProblem((prevState) =>
      prevState ? { ...prevState, [element.name]: element.value } : null
    );
  };

  const handleClick = async (): Promise<void> => {
    try {
      if (editProblem !== null) {
        const saved = await sendBackgroundMessage(
          "updateCardNotes",
          editProblem
        );
        if (saved) {
          alert("Problem notes updated!");
          window.close();
        } else {
          throw new Error("Edit: error when saving notes");
        }
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div id="edit-container">
      {isLoading ? null : (
        <>
          <Header />
          <hr />
          {editProblem !== null ? (
            <div id="card-edit-container">
              <div id="card-edit-title">
                <h3>{editProblem.title}</h3>
              </div>

              <form id="card-edit-form">
                <textarea
                  className="notes-textarea"
                  name="notes"
                  value={editProblem.notes}
                  onChange={handleChange}
                ></textarea>

                <button type="button" id="save-btn" onClick={handleClick}>
                  Save
                </button>
              </form>
            </div>
          ) : (
            <h3>PROBLEM NOT FOUND!</h3>
          )}
        </>
      )}
    </div>
  );
};

export default Edit;
