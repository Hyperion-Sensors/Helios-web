import React, { useState, createContext, useEffect, useReducer } from "react";

/*------------------------Type Imports----------------------------- */
import { tfit } from "@/Types/asset_types";

/*------------------------API Imports----------------------------- */

type AssetSelectionContextType = {
  regions: string[];
  setRegions: (new_regions: string[]) => void;
  tfits: tfit[];
  setTfits: (new_tfits: tfit[]) => void;
  tfitNames: string[];
  setTfitNames: (new_tfit_names: string[]) => void;
  initialFilters: { substations: tfit[]; regions: string[] };
  setInitialFilters: (new_initial_filters: {
    substations: tfit[];
    regions: string[];
  }) => void;
  filters: { substations: any[]; regions: string[] };
  setFilters: (new_filters: { type: string; payload: {} }) => void;
};

const AssetSelectionContext =
  createContext<AssetSelectionContextType | null>(null);

//define types of props for main function provider
type Props = {
  children?: React.ReactNode;
};

const handleRegionChanges = (devices: string[], chosen_substations: tfit[]) => {
  // let region_mem: {} = {};
  let regions: string[] = []; //empty array to store regions

  chosen_substations.forEach((sub) => {
    if (!regions.includes(sub.location.region)) {
      //if the region has not been added to the array
      regions.push(sub.location.region);
    }
  });

  return regions;
};

// main function provider
const AssetSelectionProvider: React.FC<Props> = ({ children }) => {
  const [tfits, setTfits] = useState([]);
  const [regions, setRegions] = useState([]);
  const [tfitNames, setTfitNames] = useState([]);
  const [initialFilters, setInitialFilters] = useState({
    substations: [],
    regions: [],
  });

  //reducer to either change the filter by setting substations or regions, use actions to determine which one to change
  const filterReducer = (
    state: { substations: tfit[]; regions: string[] },
    action: { type: string; payload: any[] }
  ) => {
    switch (action.type) {
      case "change-substations":
        if (action.payload.length > 0) {
          const new_regions = handleRegionChanges(tfits, action.payload);

          return {
            ...state,
            regions: new_regions,
            substations: action.payload,
          };
        } else {
          return {
            substations: initialFilters.substations,
            regions: initialFilters.regions,
          };
        }
      case "change-regions":
        if (action.payload.length > 0) {
          return { ...state, regions: action.payload };
        } else {
          return {
            substations: initialFilters.substations,
            regions: initialFilters.regions,
          };
        }
      default:
        return {
          substations: initialFilters.substations,
          regions: initialFilters.regions,
        };
    }
  };

  const [filters, changeFilters] = useReducer(filterReducer, {
    substations: [],
    regions: [],
  });

  function changeTfits(new_tfits: tfit[]) {
    // same type as tfits
    setTfits(new_tfits);
  }

  function changeRegions(new_regions: any[]) {
    setRegions(new_regions);
  }

  function changeTfitNames(new_tfit_names: string[]) {
    setTfitNames(new_tfit_names);
  }

  return (
    <AssetSelectionContext.Provider
      value={{
        tfits: tfits,
        setTfits: changeTfits,
        regions: regions,
        setRegions: changeRegions,
        tfitNames: tfitNames,
        setTfitNames: changeTfitNames,
        initialFilters: initialFilters,
        setInitialFilters: setInitialFilters,
        filters: filters,
        setFilters: changeFilters,
      }}
    >
      {children}
    </AssetSelectionContext.Provider>
  );
};

export { AssetSelectionProvider, AssetSelectionContext };
