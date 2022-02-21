import browser from "webextension-polyfill";

const Options = () => {
  const handleReset = () => {
    const confirmation = window.confirm(
      "This will delete all your extension data. Are you sure you wish to reset?"
    );

    if (confirmation) {
      browser.storage.local
        .clear()
        .then(() => alert("Extension was reset succesfully!"))
        .catch(() => alert("Reset was unsuccessful, not all data was removed."));
    }
  };

  return (
    <div className="options-container">
      <div className="reset-container">
        <span>Reset extension data: </span>
        <button
          type="button"
          id="btn-reset"
          className="btn-options"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Options;
