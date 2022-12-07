import React from "react";
import Card from "@mui/material/Card";
import { CardContent, CardActionArea } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";


import { Link, Routes, Route } from 'react-router-dom';
import EquipmentDetails from "./Equipment-details";


function EquipmentPreview({name, description, img}) {

    return (
        <Card sx={{ maxWidth: 345 }}>

            <CardActionArea >

                    <CardMedia
                    component="img"
                    alt="grue"
                    height="140"
                    image={img}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            {name}
                        </Typography>

                        <Typography variant="body" color="text.secondary">
                            {description}
                        </Typography>
                    </CardContent>

            </CardActionArea>

        </Card>
    )
}

export default EquipmentPreview;