import React from "react";
import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";
import Typography from '@mui/material/Typography';
import PartsTable from "./Parts-list";
import EquipmentsGrid from "./Equipments-grid";
import { Divider } from "@mui/material";
import { parts } from "./Mock-data";


export default function Portfolio() {
    return (
        <Stack spacing={5} m={5}>

            <Stack>
                <Typography variant="h4" gutterBottom>Équipements</Typography>
                <EquipmentsGrid />
            </Stack>

            <Divider />

            <Stack>
                <Typography variant="h4" gutterBottom>Pièces certifiées</Typography>
                <PartsTable parts={parts}/>
            </Stack>

            <Box></Box>
            
        </Stack>
    )
}

