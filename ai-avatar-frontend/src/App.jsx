import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { useState } from "react";

function App() {
  const [gender, setGender] = useState("female");
  return (
    <>
      <Loader />
      <Leva hidden />
      <UI gender={gender} setGender={setGender} />
      <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
        <Experience gender={gender} />
      </Canvas>
    </>
  );
}

export default App;
