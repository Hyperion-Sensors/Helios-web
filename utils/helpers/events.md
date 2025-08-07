Mouse Click Off Component Tracking

```
 useEffect(() => {
    // Used for detecting click off of dropdown (to close menu)
    if (!showDrop) return; // if the dropdown is OPEN
    function handleClickOutside(event) {
      // when mouse off click is detected
      if (ref.current && !ref.current.contains(event.target)) {
        //logic for mouse positioning
        setShowDrop(false);
      }
    }

    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDrop]);
```
