import React from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EquipmentPreview from "./Equipment-preview";

import { equipments, equipmentsDetails } from "./Mock-data";


function EquipmentsGrid() {

    return (
        <Grid container spacing={2} alignItems="center">

            {equipments.map((equipment) => {

                const id = equipment.id;
                const eqDetails = equipmentsDetails.find( eq => eq.equipmentId === id);
                const photo = eqDetails.photo;
                const description = eqDetails.description;

                return (
                    <Grid key={id} xs={12} sm={6} md={3} lg={2}>
                        <EquipmentPreview
                        name={equipment.category + " " + equipment.manufacturer}
                        description={description}
                        img={photo} />
                    </Grid>
                )
            })}

            <Grid key={123} xs={12} sm={6} md={3} lg={2}>
                <IconButton aria-label="ajouter">
                    <AddCircleIcon fontSize="large"/>
                </IconButton>
            </Grid>

        </Grid>
    )
}

export default EquipmentsGrid;