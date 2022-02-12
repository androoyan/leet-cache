import { useState } from "react";

const CardNotes = ({
  editNotes,
  notes,
}: {
  editNotes: React.MouseEventHandler;
  notes: string | undefined;
}) => {
  const [notesHidden, setNotesHidden] = useState<boolean>(true);

  const hideNotes = () => {
    setNotesHidden(true);
  };

  const showNotes = () => {
    setNotesHidden(false);
  };

  return (
    <div id="card-notes-container">
      {notesHidden ? (
        <div id="show-btn-container">
          <button
            type="button"
            id="show-notes-btn"
            className="card-notes-btn"
            onClick={showNotes}
          >
            Show Notes
          </button>
        </div>
      ) : (
        <>
          <div id="card-notes-textarea-container">
            <textarea
              id="card-notes-textarea"
              value={notes}
              rows={5}
              readOnly
            ></textarea>
          </div>

          <div id="card-notes-buttons-container">
            <button
              type="button"
              id="edit-btn"
              className="card-notes-btn"
              onClick={editNotes}
            >
              Edit
            </button>
            <button
              type="button"
              id="hide-notes-btn"
              className="card-notes-btn"
              onClick={hideNotes}
            >
              Hide Notes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CardNotes;
