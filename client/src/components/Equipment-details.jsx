import React from "react";
import { Card, CardMedia, Divider } from "@mui/material";
import { Stack } from "@mui/system";
import Typography from "@mui/material/Typography";
import OperationsList from "./Operations-list";
import PartsList from "./Parts-list";


import { equipments, equipmentsDetails, assemblies } from "./Mock-data";



function EquipmentSummary() {

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
                    {equipment.category + " " + equipment.manufacturer}
                </Typography>

                <Typography variant="body" color="text.secondary">
                    Catégorie : {equipment.category}<br></br>
                    Fabricant : {equipment.manufacturer}<br></br>
                    Modèle : {equipment.model}<br></br>
                    Numéro de série : {equipment.id}<br></br>
                    Détails : {equipmentDetails.description}
                </Typography>
            </Stack>

        </Stack>

    )
}

function Operations() {
    return (
        <Stack>
            <Typography variant="h4" gutterBottom>Opérations</Typography>
            <OperationsList />
        </Stack>
    )
}

function Parts() {
    return (
        <Stack>
            <Typography variant="h4" gutterBottom>Pièces certifiées</Typography>
            <PartsList />
        </Stack>
    )
}

export default function EquipmentDetails() {

    return (

        <Stack p={5} spacing={5}>

            <EquipmentSummary />
            <Divider />
            <Stack direction="row" justifyContent="space-between">
                <Operations />
                <Parts />
            </Stack>

        </Stack>
        
    )

}