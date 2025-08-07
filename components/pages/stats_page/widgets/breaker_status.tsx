import BreakerStatusChart from "@/Global/charts/breaker_status";
import React from "react";

function LoadWidget() {
    return (
        <div className="h-full w-full">
            <BreakerStatusChart />
        </div>
    )
}

export default LoadWidget;