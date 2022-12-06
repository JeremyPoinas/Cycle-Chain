import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PartsTable from "./Parts-list";
import EquipmentsGrid from "./Equipments-grid";
import { Divider } from "@mui/material";


export default function Portfolio() {
    return (
        <Box sx={{ width: '100%', maxWidth: 2000, p:5 }}>

            <Box sx={{ m:5 }}>
                <Typography variant="h4" gutterBottom>Équipements</Typography>
                <EquipmentsGrid />
            </Box>

            <Divider />

            <Box sx={{ m:5 }}>
                <Typography variant="h4" gutterBottom>Pièces certifiées</Typography>
                <PartsTable />
            </Box>
            
        </Box>
            
    )
}

