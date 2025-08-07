/*------------------------Library Imports----------------------------- */
import React, { useState, createContext } from "react";

/*------------------------Type Imports----------------------------- */
import { Asset, Filter, raw_fiber } from "@/Types/asset_types";

/*------------------------API Imports----------------------------- */
import { useFibers } from "@/Queries/asset_queries";

type AssetContextType = {
  currentAsset: Asset;
  changeCurrentAsset: (asset: Asset) => void;
  currentAssetRef: React.MutableRefObject<Asset>;
  changeCurrentAssetRef: (asset: Asset) => void;
  currentSegment: raw_fiber;
  changeCurrentSegment: (segment: raw_fiber) => void;
  changeLocation: (location: string) => void;
  filter: Filter;
  change_filter: (new_filter: Filter) => void;
  ambient: number;
  setAmbient: (new_temp: number) => void;
  loadDelta: number;
  setLoadDelta: (new_delta: number) => void;
  chartData: { data: any[]; segments: any[] };
  setChartData: ({ data: [], segments: [] }) => void;
};

const AssetContext = createContext<AssetContextType | null>(null);

//define types of props for main function provider
type Props = {
  children?: React.ReactNode;
};

// main function provider
const AssetProvider: React.FC<Props> = ({ children }) => {
  /*assets has been replaced using react-query */
  // const [assets, setAssets] = useState<Asset[]>([]);
  const [currentAsset, setCurrentAsset] = useState<Asset>(undefined);
  const currentAssetRef = React.useRef<Asset>(undefined);
  const [location, setLocation] = useState<string>("");
  const [ambient, setAmbient] = useState(25);
  const [loadDelta, setLoadDelta] = useState(0);
  const [assetNotInView, setAssetNotInView] = useState<boolean>(false); //is the current asset in view on the assets menu? if not then is true
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [chartData, setChartData] = useState({ data: [], segments: [] });

  const [currentSegment, setCurrentSegment] =
    useState<raw_fiber | null>(undefined);
  const [filter, setFilter] = useState<Filter>({
    tfits: [],
    regions: [],
  });

  // change tabs for the feed component (component above map)
  function changeCurrentTab(n) {
    setCurrentTab(n);
  }

  // //  set which group of assets we would like to look at
  // function changeAssets(newAssets: Asset[]) {
  //   setAssets(newAssets);
  // }

  // change which asset is currently in focus on the feed, map, and highlighted on the asset menu
  function changeCurrentAsset(newAsset: Asset) {
    setCurrentAsset(newAsset);
  }

  function changeCurrentAssetRef(newAsset: Asset) {
    currentAssetRef.current = newAsset;
  }

  // set weather or not the current asset is in view
  function changeAssetNotInView() {
    setAssetNotInView(!assetNotInView);
  }

  function changeLocation(location: string) {
    //perform api call on location
    setLocation(location);
  }

  function change_filter(new_filter) {
    setFilter(new_filter);
  }

  function changeCurrentSegment(segment: raw_fiber) {
    setCurrentSegment(segment);
  }

  return (
    <AssetContext.Provider
      value={{
        currentAsset,
        changeCurrentAsset,
        currentAssetRef,
        changeCurrentAssetRef,
        currentSegment,
        changeCurrentSegment,
        changeLocation,
        filter,
        change_filter,
        ambient,
        setAmbient,
        loadDelta,
        setLoadDelta,
        chartData,
        setChartData,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

export { AssetProvider, AssetContext };
function useEffect(arg0: () => void, arg1: Asset[]) {
  throw new Error("Function not implemented.");
}
