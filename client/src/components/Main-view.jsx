import React from "react";
import PartsTable from "./Parts-list";
import EquipmentsGrid from "./Equipments-grid";

export default function MainView() {
    return (
        <div>
            <EquipmentsGrid />
            <PartsTable />
        </div>
        
    )
}

