import { AlertCircle, RefreshCw } from "lucide-react";

import "./AIErrorMessage.css";

function AIErrorMessage({ message, onRetry }) {
  return (
    <div className="ai-error-container" role="alert">
      <div className="ai-error-icon">
        <AlertCircle size={28} />
      </div>

      <h3>We couldn't create your itinerary</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="ai-error-retry"
          onClick={onRetry}
        >
          <RefreshCw size={17} />
          Try again
        </button>
      )}
    </div>
  );
}

export default AIErrorMessage;
