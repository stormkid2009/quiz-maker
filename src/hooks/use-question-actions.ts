import { useCallback } from "react";

/**
 * Options for the useQuestionActions hook.
 * @property {() => void} onShowAnswer - Callback invoked when the "show answer" action is triggered.
 * @property {() => void} onLoadNew - Callback invoked when the "load new question" action is triggered.
 * @property {string} [customEventName="showAnswer"] - Name of the custom event dispatched when showing the answer.
 */
interface UseQuestionActionsOptions {
  onShowAnswer?: () => void;
  onLoadNew?: () => void;
  customEventName?: string;
}

/**
 * Return value of the useQuestionActions hook.
 * @property {() => void} handleShowAnswer - Function to trigger the "show answer" action.
 * @property {() => void} handleLoadNew - Function to trigger the "load new question" action.
 * @property {() => void} showAnswer - Alias for handleShowAnswer.
 * @property {() => void} loadNewQuestion - Alias for handleLoadNew.
 */
interface UseQuestionActionsReturn {
  handleShowAnswer: () => void;
  handleLoadNew: () => void;
  showAnswer: () => void;
  loadNewQuestion: () => void;
}

/**
 * React hook to provide handlers for showing answers and loading new questions.
 *
 * @param {UseQuestionActionsOptions} [options={}] - Configuration options for the hook.
 * @returns {UseQuestionActionsReturn} An object containing action handler functions.
 */
export function useQuestionActions(
  options: UseQuestionActionsOptions = {}
): UseQuestionActionsReturn {
  const { onShowAnswer, onLoadNew, customEventName = "showAnswer" } = options;

  const handleShowAnswer = useCallback(() => {
    if (onShowAnswer) {
      onShowAnswer();
    } else {
      // Default behavior: dispatch custom event
      window.dispatchEvent(new CustomEvent(customEventName));
    }
  }, [onShowAnswer, customEventName]);

  const handleLoadNew = useCallback(() => {
    if (onLoadNew) {
      onLoadNew();
    } else {
      // Default behavior: reload page
      window.location.reload();
    }
  }, [onLoadNew]);

  // Alias methods for better API
  const showAnswer = handleShowAnswer;
  const loadNewQuestion = handleLoadNew;

  return {
    handleShowAnswer,
    handleLoadNew,
    showAnswer,
    loadNewQuestion,
  };
}
