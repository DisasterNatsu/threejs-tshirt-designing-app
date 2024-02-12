import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { Decal, useGLTF, useTexture } from "@react-three/drei";

import state from "../store";

const Shirt = () => {
  const snap = useSnapshot(state);

  const { nodes, materials } = useGLTF("/shirt_baked.glb");

  const logoTexture = useTexture(snap.logoDecal);
  logoTexture.anisotropy = 16;
  const fullTexture = useTexture(snap.fullDecal);
  fullTexture.anisotropy = 16;

  useFrame((_state, delta) => {
    // Type assertion: asserting that materials.lambert1 is of type MeshStandardMaterial or MeshLambertMaterial
    const lambertMaterial = materials.lambert1 as
      | THREE.MeshStandardMaterial
      | THREE.MeshLambertMaterial;

    // Now you can access the color property
    easing.dampC(lambertMaterial.color, snap.color, 0.25, delta);
  });

  const stateString = JSON.stringify(snap);

  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={(nodes.T_Shirt_male as any).geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}
        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
