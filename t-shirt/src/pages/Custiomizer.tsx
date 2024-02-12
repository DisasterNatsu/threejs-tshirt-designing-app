import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import config from "../config/config";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";

interface DecalType {
  logo: {
    stateProperty: string;
    filterTab: string;
  };
  full: {
    stateProperty: string;
    filterTab: string;
  };
}

const Custiomizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState<File | undefined>();
  const [prompt, setPrompt] = useState<string>("");
  const [generatingImg, setGeneratingImg] = useState<boolean>(false);
  const [activeEditorTab, setActiveEditorTab] = useState<string>("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  // show tab content depending on the active tab

  const generateTabContent = () => {
    // switch statement

    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
        break;

      case "filepicker":
        // @ts-ignore
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
        break;

      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
        break;

      default:
        return null;
    }
  };

  const handleSubmit = async (type: any) => {
    if (!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);

      const response = await fetch("http://localhost:8080/api/v1/dalle/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      return alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  const handleDecals = (type: keyof DecalType, result: string) => {
    const decalType = DecalTypes[type]; // Corrected to DecalType (singular) instead of DecalTypes

    if (decalType) {
      switch (decalType.stateProperty) {
        case "logoDecal":
          state.logoDecal = result;
          break;

        case "fullDecal":
          state.fullDecal = result;
          break;

        default:
          return null;
          break;
      }

      // @ts-ignore

      if (!activeFilterTab[decalType.filterTab]) {
        handleActiveFilterTab(decalType.filterTab);
      }
    } else {
      console.error(`Decal type '${type}' not found.`);
    }
  };

  const handleActiveFilterTab = (tabName: string) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState: any) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readFile = (type: string) => {
    // @ts-ignore
    reader(file).then((result) => {
      // @ts-ignore
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => {
              return (
                <Tab
                  key={tab.name}
                  tab={tab}
                  // @ts-ignore
                  isFilterTab={activeFilterTab[tab.name]}
                  handleClick={() => handleActiveFilterTab(tab.name)}
                />
              );
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Custiomizer;
