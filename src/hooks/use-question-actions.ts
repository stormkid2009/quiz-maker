import { useCallback } from "react";

interface UseQuestionActionsOptions {
  onShowAnswer?: () => void;
  onLoadNew?: () => void;
  customEventName?: string;
}

interface UseQuestionActionsReturn {
  handleShowAnswer: () => void;
  handleLoadNew: () => void;
  showAnswer: () => void;
  loadNewQuestion: () => void;
}

export function useQuestionActions(
  options: UseQuestionActionsOptions = {},
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
