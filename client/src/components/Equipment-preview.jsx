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

                        <Typography gutterBottom variant="h6" component="div">
                            {category}
                        </Typography>

                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {"Manufacturer : "+manufacturer.substring(0,6)+"..."+manufacturer.slice(-5)}
                        </Typography>

                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {"Owner : "+owner.substring(0,6)+"..."+owner.slice(-5)}
                        </Typography>
                    </CardContent>

            </CardActionArea>

        </Card>
    )
}

export default EquipmentPreview;