import { Environment, Sky } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      <hemisphereLight
        args={[0x7095c1, 0xcbc1b2, 1.5]} //
        position={[0, 50, 0]}
      />

      <Environment background blur={2} preset="sunset" />
    </>
  );
}
