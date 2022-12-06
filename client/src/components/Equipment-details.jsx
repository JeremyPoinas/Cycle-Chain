import { Card, CardMedia } from "@mui/material";
import { Stack } from "@mui/system";
import Typography from "@mui/material/Typography";
import React from "react";

import { equipments, equipmentsDetails, assemblies } from "./Mock-data";

export default function EquipmentDetails() {

    const equipment = equipments[0];
    const id = equipment.id;
    const equipmentDetails = equipmentsDetails.find( eq => eq.equipmentId === id);

    return (
        <Stack direction="row" spacing={2}>

            <Card sx={{maxWidth: 300}}>
                <CardMedia
                    component="img"
                    height="200"
                    image= {equipmentDetails.photo}
                    alt="équipement"
                />
            </Card>


            <Stack>
                <Typography variant="h4">
                    {equipment.category}
                </Typography>

                <Typography variant="body" color="text.secondary">
                    {equipment.manufacturer}
                </Typography>
            </Stack>

        </Stack>
    )

}