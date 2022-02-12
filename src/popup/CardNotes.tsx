import { useState } from "react";

const CardNotes = ({ notes }: { notes: string }) => {
  const [notesHidden, setNotesHidden] = useState<boolean>(true);

  return (
    <div id="card-notes-container">
      <div id="card-notes-textarea-container">
        {notesHidden ? (
          <button type="button" id="show-notes-btn" className="card-notes-btn">
            Show Notes
          </button>
        ) : (
          <textarea id="card-notes-textarea" value={notes}></textarea>
        )}
      </div>

      <div id="card-notes-buttons-container">
        {notesHidden ? null : (
          <>
            <button type="button" id="edit-btn" className="card-notes-btn">
              Edit
            </button>
            <button type="button" id="hide-notes-btn" className="card-notes-btn">
              Hide Notes
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CardNotes;
