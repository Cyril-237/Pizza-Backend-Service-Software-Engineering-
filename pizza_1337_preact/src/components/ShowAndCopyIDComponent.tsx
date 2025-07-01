import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';

type ShowAndCopyIdComponentProps = {
    id : string
    content : string
    type? : string
}

export const ShowAndCopyIdComponent : FunctionalComponent<ShowAndCopyIdComponentProps> = 
    ( { id, content, type } ) => {
    const [isVisible, setIsVisible] = useState(false);
    const initialHoverContent = "Click to copy id" + (type != null ? " (" + type + "): " : ": ")  + id
    const [hoverContent, setHoverContent] = useState(initialHoverContent);

    const copyToClipboard = async () => {
      // navigator.clipboard only works in secure environemnts (https)
      /* try {
        await navigator.clipboard.writeText(id);
        setHoverContent("ID Copied to clipboard");
        // Optional: Add some visual feedback that copying worked
      } catch (err) {
        console.error('Failed to copy text: ', err);
      } */
  
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = id;
      document.body.appendChild(textarea);
  
      // Select the text
      textarea.select();
  
      try {
        // Execute the copy command
        document.execCommand('copy');
        setHoverContent("ID Copied to clipboard");
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
  
      // Clean up
      document.body.removeChild(textarea);
    }; 
  return <span 
    className="id-container"
        onMouseEnter={() => 
            { setHoverContent(initialHoverContent); setIsVisible(true)}}
        onMouseLeave={(e) => {
            setIsVisible(false)
        }} >
    <span className="hover-trigger">
      <span onClick={copyToClipboard} className="id-content">{content}</span>
    </span>
    {isVisible && (
      <span className="hover-content">
        <span onClick={copyToClipboard}>{hoverContent}</span>
      </span>
    )}
  </span>
};

