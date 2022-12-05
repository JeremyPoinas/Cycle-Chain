import React from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import grue1 from "../images/grue1.jpg";
import grue2 from "../images/grue2.jpg";
import grue3 from "../images/grue3.png";
import EquipmentPreview from "./Equipment-preview";


function EquipmentsGrid() {

    const equipments = [
        {name: "Grue ABC", description: "Super grue", img: grue1},
        {name: "Grue DEF", description: "Autre super grue", img: grue2},
        {name: "Grue GHI", description: "Dernière super grue", img: grue3}
    ]

    return (
        <Grid container spacing={2}>
            {equipments.map((equipment, index) => (
                <Grid key={index} xs={12} sm={6} md={3} lg={2}>
                    <EquipmentPreview
                    name={equipment.name}
                    description={equipment.description}
                    img={equipment.img} />
                </Grid>
            ))}
        </Grid>
    )
}

export default EquipmentsGrid;