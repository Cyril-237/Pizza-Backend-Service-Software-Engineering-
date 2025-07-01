import { h } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import { ApiError } from '../api';
import { ACTION_SERVER_ERROR_HANDLED } from '../constants';
import { AppStateContext } from '../AppLogic';

interface ErrorDialogProperties {
  error: ApiError | string
  isOpen :boolean
  onClose: () => void
}
const ErrorDialogComponent = ( props: ErrorDialogProperties) => {

  const { pushActionIntoQueue : pushAction } = useContext(AppStateContext)

  // Add useEffect to handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
      } else if (e.key == 'Enter') {
        props.onClose();
        pushAction({ type : ACTION_SERVER_ERROR_HANDLED, payload : { error : props.error } });
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);


  const handleSubmit = async (e : Event) =>  {
    e.preventDefault();
    props.onClose();
    pushAction({ type : ACTION_SERVER_ERROR_HANDLED, 
      payload : { error : props.error } });
  };

  if (!props.isOpen) return null;

  const message =  (typeof props.error === 'object' && props.error !== null) ?
    `Error ${props.error.status} ${props.error.statusText} URL: ${props.error.url}` : 
    props.error;

  return (
    <div class="dialog-overlay">
      <div class="dialog-content card">
        <h2>Error!</h2>
        <form onSubmit={handleSubmit}>
            {message}
          <div class="dialog-actions">
            <button type="submit">Acknowledge</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ErrorDialogComponent;
