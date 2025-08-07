import { useContext, useEffect, useMemo, useState } from "react";

/*---------------------------Types Imports-------------------------- */
import { Widget, Item } from "@/Types/stats_types";
import _ from "lodash";

/*----------------------------Context----------------------------- */
import { StatsContext } from "@/Context/stats_context";

/*------------React-grid-layout-------------*/
import { Responsive, WidthProvider } from "react-grid-layout";

/*------------Custom Components-------------*/
import {
  create_widget,
  componentExists,
  isDateComponent,
} from "./widget_tools";

/*-----------------------------PROPS-------------------------------- */
type Props = {
  selectedWidget: Item;
  setSelectedWidget: (widget: Item) => void;
  widgets: Array<Widget>;
  setWidgets: (widget: Array<Widget>) => void;
  count: number;
  setCount: (count: number) => void;
  getFromLS: (key: any) => any;
  saveToLS: (key: any, value: any) => void;
};

/*---------------------------MAIN FUNCTION-------------------------- */
const WidgetGrid = ({
  selectedWidget,
  setSelectedWidget,
  widgets,
  setWidgets,
  count,
  setCount,
  getFromLS,
  saveToLS,
}: Props) => {
  const { widgetsDraggable, dateLockedWidgets, setDateLockedWidgets } =
    useContext(StatsContext);
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  // const [layout, setLayout] = useState({ lg: getFromLS("saved_layout")["lg"] }); // currently not used but will keep just in case
  // const [children, setChildren] = useState([]);

  // Having this in a useMemo prevents the grid from rerendering
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  useEffect(() => {
    const onResize = (e) => {
      console.log("resize", e);
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  //-----------------------react-grid-layout-----------------------//

  // This memoised children array currently does not work well with certain features (e.g. locking widgets)
  // Left here as a note for the future
  //
  // This useEffect sets the children of the grid
  // useEffect(() => {
  // const onRemoveItem = (name) => {
  //   let id = Number(name.split("").pop());
  //   setWidgets(widgets.filter((widget) => widget.i != name));
  //   // setDateLockedWidgets(_.omit(dateLockedWidgets, id));
  // };

  // let widgetMap = widgets.map((widget) => create_widget(widget, onRemoveItem))
  //   setChildren(widgetMap);
  // }, [setWidgets, widgets]);

  const onLayoutChange = (currentLayout, allLayouts) => {
    saveToLS("current_layout", { lg: currentLayout });
  };

  // This callback sets the new layout after a drag event.
  // It is REQUIRED in order to keep the layout in sync between the grid and the state.
  const onDragStop = (layout) => {
    setWidgets(layout);
  };

  const onDrop = (layout, layoutItem, event) => {
    // Prevents adding blank widgets because
    // anything can be dragged into the grid.
    if (!componentExists(selectedWidget.i)) {
      return;
    }

    setWidgets(
      widgets.concat({
        i: selectedWidget.i + " " + count,
        x: layoutItem.x,
        y: layoutItem.y - 1 < 0 ? 0 : layoutItem.y - 1, // there is a bug here where the y value is not being set correctly on dropping over another widget in the first row
        w: selectedWidget.w,
        h: selectedWidget.h,
        minW: selectedWidget.minW ? selectedWidget.minW : 1,
        minH: selectedWidget.minH ? selectedWidget.minH : 1,
        maxW: selectedWidget.maxW ? selectedWidget.maxW : Infinity,
        maxH: selectedWidget.maxH ? selectedWidget.maxH : Infinity,
      })
    );

    if (isDateComponent(selectedWidget.i)) {
      let latestWidget = {
        [`${count}`]: { widgetName: selectedWidget.i, locked: false },
      };
      setDateLockedWidgets({
        ...dateLockedWidgets,
        ...latestWidget,
      });
    }

    setCount(count + 1);
    // Resetting the selected widget stops unwanted elements from being dragged in.
    setSelectedWidget({ ...selectedWidget, i: "", w: 0, h: 0 });
  };

  const onBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint);
  };

  const onRemoveItem = (name) => {
    let id = Number(name.split("").pop());
    setWidgets(widgets.filter((widget) => widget.i != name));
    setDateLockedWidgets(_.omit(dateLockedWidgets, id));
  };

  return (
    <div className="rounded-md overflow-y-visible overflow-x-hidden h-full p-1 mt-1 mb-5 select-none">
      <ResponsiveGridLayout
        className="min-h-full"
        layouts={getFromLS("current_layout")["lg"]}
        onBreakpointChange={onBreakpointChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 10, md: 4, sm: 3, xs: 2, xxs: 1, maxRows: 20 }}
        allowOverlap={false}
        margin={[10, 10]}
        rowHeight={250}
        onDragStop={onDragStop}
        onDrop={onDrop}
        onLayoutChange={onLayoutChange}
        isDroppable={true}
        isDraggable={widgetsDraggable}
        draggableHandle={".drag-handle"}
        useCSSTransforms={true}
        measureBeforeMount={true}
        isResizable={true}
        compactType={"vertical"}
        preventCollision={false}
      >
        {widgets.map((widget) =>
          create_widget(widget, onRemoveItem, widgetsDraggable)
        )}
      </ResponsiveGridLayout>
    </div>
  );
};

export default WidgetGrid;
