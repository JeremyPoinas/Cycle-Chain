import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PartsTable from "./Parts-list";
import EquipmentsGrid from "./Equipments-grid";

export default function MainView() {
    return (
        <Box sx={{ width: '100%', maxWidth: 2000, p:5 }}>

            <Box sx={{ mb:5 }}>
                <Typography variant="h4" gutterBottom>Équipements</Typography>
                <EquipmentsGrid />
            </Box>

            <Box sx={{ mb:5 }}>
                <Typography variant="h4" gutterBottom>Pièces</Typography>
                <PartsTable />
            </Box>
            
        </Box>
            
    )
}

