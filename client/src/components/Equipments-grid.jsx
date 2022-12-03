import React from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import grue1 from "../images/grue1.jpg";
import grue2 from "../images/grue2.jpg";
import grue3 from "../images/grue3.png";
import EquipmentPreview from "./Equipment-preview";


function EquipmentsGrid() {
    return (

        <Grid container spacing={2}>

            <Grid xs={12} sm={6} md={3} lg={2}>
                <EquipmentPreview
                name="Grue ABC"
                description="Super Grue"
                img={grue1} />
            </Grid>

            <Grid  xs={12} sm={6} md={3} lg={2}>
                <EquipmentPreview
                name="Grue DEF"
                description="Autre super Grue"
                img={grue2} />
            </Grid>

            <Grid  xs={12} sm={6} md={3} lg={2}>
                <EquipmentPreview
                name="Grue GHI"
                description="Dernière uper Grue"
                img={grue3} />
            </Grid>

    </Grid>

        
    )
}

export default EquipmentsGrid;