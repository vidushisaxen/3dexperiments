import { useRef } from "react";

const Lights = ({ lights }) => {
  const lightRef1 = useRef();
  const lightRef2 = useRef();
  const lightRef3 = useRef();
  return (
    <>
      <spotLight {...lights[0]} ref={lightRef1} />
      <spotLight {...lights[1]} ref={lightRef2} />
      <spotLight {...lights[2]} ref={lightRef3} />
    </>
  );
};

export default Lights;
