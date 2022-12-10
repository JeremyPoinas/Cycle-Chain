import React from "react";
import Card from "@mui/material/Card";
import { CardContent, CardActionArea } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import grue1 from "../images/grue1.jpg";

function EquipmentPreview({manufacturer, category, owner}) {

    return (
        <Card sx={{ maxWidth: 345 }}>

            <CardActionArea >

                    <CardMedia
                    component="img"
                    alt="grue"
                    height="140"
                    image={grue1}
                    />
                    <CardContent>

                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {manufacturer}
                        </Typography>

                        <Typography gutterBottom variant="h6" component="div">
                            {category}
                        </Typography>

                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {"Proriétaire : "+owner}
                        </Typography>
                    </CardContent>

            </CardActionArea>

        </Card>
    )
}

export default EquipmentPreview;