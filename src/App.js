import "./styles.css";
import { Canvas } from "@react-three/fiber";
import {
  Circle,
  Html,
  Loader,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  SpotLight,
  SpotLightShadow,
  useTexture,
} from "@react-three/drei";
import { Floor } from "./components/Floor";
import Lights from "./components/Lights";
import { Suspense, useLayoutEffect } from "react";
import { MathUtils, RepeatWrapping } from "three";
import React, { useRef, useState } from "react";

function Thing() {
  const [hovered, hover] = useState(false);
  const ref = useRef();

  const texs = useTexture([
    "/grassy_cobble/Abstract_003_COLOR.jpg",
    "/grassy_cobble/Abstract_003_NRM.jpg", //
    "/grassy_cobble/Abstract_003_DISP.jpg",
    "/grassy_cobble/Abstract_003_SPEC.jpg",
  ]);

  useLayoutEffect(() => {
    for (const tex of texs) {
      tex.wrapS = tex.wrapT = RepeatWrapping;
      tex.repeat.set(2, 2);
    }
  }, [texs]);

  const [diffuse, normal, roughness, ao] = texs;

  const leafTexture = useTexture("/other/bird.jpg");

  return (
    <>
      {/* <Html
        as="div" // Wrapping element (default: 'div')
      >
        <a
          onPointerOver={(event) => hover(true)}
          onPointerOut={(event) => hover(false)}
          Style={"font-size: 200px;"}
        >
          hello
        </a>
        <p>world</p>
      </Html> */}
      <Circle
        // ref={ref}

        receiveShadow
        args={[20, 64, 64]}
        rotation-x={-Math.PI / 2}
      >
        <meshStandardMaterial
          map={diffuse} //
          normalMap={normal}
          roughnessMap={roughness}
          aoMap={ao}
          envMapIntensity={0.2}
        />
      </Circle>

      <SpotLight
        distance={20}
        intensity={5}
        angle={MathUtils.degToRad(45)}
        color={"#fadcb9"}
        position={[5, 8, -2]}
        // position={[5, 18, -2]}
        volumetric={false}
        debug
      >
        <SpotLightShadow
          scale={hovered ? 4 : 2}
          distance={0.4}
          width={2048}
          height={2048}
          map={leafTexture}
          shader={
            /* glsl */ `
            varying vec2 vUv;
            uniform sampler2D uShadowMap;
            uniform float uTime;
            void main() {
              // material.repeat.set(2.5) - Since repeat is a shader feature not texture
              // we need to implement it manually
              vec2 uv = mod(vUv, 0.4) * 2.5;

              // Fake wind distortion
              uv.x += sin(uv.y * 10.0 + uTime * 0.5) * 0.02;
              uv.y += sin(uv.x * 10.0 + uTime * 0.5) * 0.02;
              
              vec3 color = texture2D(uShadowMap, uv).xyz;
              gl_FragColor = vec4(color, 1.);
            }
          `
          }
        />
      </SpotLight>
    </>
  );
}

export default function App() {
  return (
    <>
      {/* <div>
        <a href="">Hello</a>
      </div> */}
      <Canvas shadows>
        <OrbitControls
          makeDefault //
          autoRotate={true}
          autoRotateSpeed={0.5}
          minDistance={2}
          maxDistance={10}
        />
        <PerspectiveCamera
          near={0.01} //
          far={50}
          position={[1, 3, 1]}
          makeDefault
          fov={60}
        />

        <Suspense>
          <Thing />
          <Lights />
        </Suspense>
      </Canvas>

      <Loader />
    </>
  );
}
