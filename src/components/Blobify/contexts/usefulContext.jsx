import { useState, useEffect, createContext } from "react";
const UsefulContext = createContext({});

export const UsefulProvider = (props) => {
 
  let [prevPage, setPrevPage] = useState(0);
  let [nextPage, setNextPage] = useState(0);
  const [lastAction, setLastAction] = useState(null);
  const [hasDetectedDirection, setHasDetectedDirection] = useState(false);
  const [deltaY, setDeltaY] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [wheelOrArrow, setWheelOrArrow] = useState("arrow");
  let isWheelEventTriggered = false;

 
  const handleWheel = (e) => {
    setWheelOrArrow("wheel");
    const deltaY = e.deltaY;
    const deltaX = e.deltaX;
    setDeltaY(deltaY);
    setDeltaX(deltaX);
    
    if (!isWheelEventTriggered) {
      if (deltaY < 0 || deltaX<0) {
        if (deltaY < -7 || deltaX<-7) {
          setPrevPage(++prevPage);
          setLastAction("prev");
        }
      } else if (deltaY > 0 || deltaX>0) {
        if (deltaY > 7 || deltaX>7) {
          setNextPage(++nextPage);
          setLastAction("next");
        }
      }
      isWheelEventTriggered = true;

      setTimeout(() => {
        isWheelEventTriggered = false;
      }, 500); 
    }
  };
  
  const updateToFalse = () => {
    setHasDetectedDirection(false);
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [hasDetectedDirection]);

  
  return (
    <UsefulContext.Provider
      value={{
        prevPage,
        updateToFalse,
        nextPage,
        lastAction,
        deltaY,
        deltaX,
        wheelOrArrow,
      }}
    >
      {props.children}
    </UsefulContext.Provider>
  );
};


export const UsefulConsumer = UsefulContext.Consumer;

export default UsefulContext;
