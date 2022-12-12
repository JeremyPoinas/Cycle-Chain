import React from "react";
import { useState, useEffect } from "react";
import { Typography, Stack, Card, CardContent, CardActions } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Button from "@mui/material/Button";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useEth from "../contexts/EthContext/useEth";


function PartCard({part, getPartsToBuy}) {
	const { state: { contract, accounts } } = useEth();

    const handleBuying = async() => {
        try {
            console.log(part);
            await contract.methods.marketBuyPart(part.id).call({ from: accounts[0], value: part.listedPrice * 10**16});
            await contract.methods.marketBuyPart(part.id).send({ from: accounts[0], value: part.listedPrice * 10**16});
            getPartsToBuy();
        } catch (err) {
            alert(err);
        }
    };

    return (
        
        <Card>

            <CardContent>
                <Typography variant="h6">{part.category}</Typography>
                <Typography color="text.secondary">Reference : {part.model}</Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">Serial number : {part.serialNumber}</Typography>
                <Typography variant="body">Delivered by : Caterpillar</Typography>
                <Typography variant="h6">Price: {part.listedPrice} MATIC</Typography>
            </CardContent>

            <CardActions>
                <Button variant="contained" onClick={handleBuying} endIcon={<ShoppingCartIcon />}>Buy</Button>
            </CardActions>

        </Card>
    )
}


function PartsGrid({parts, getPartsToBuy}) {
    return (
        <Grid container spacing={2} alignItems="center">
            {parts.map(p => {
                return (
                    <Grid key={p.id} xs={12} sm={6} md={3} lg={2}>
                        <PartCard part={p} getPartsToBuy={getPartsToBuy} />
                    </Grid>
                )
            })}
        </Grid>
    )
}



export default function PartsBuying() {
	const { state: { contract, accounts } } = useEth();
    const [partsToBuy, setPartsToBuy] = useState([]);

    // Get all equipments and update the associated state
    const getPartsToBuy = async () => {
        try {
            let numberOfParts = await contract?.methods._tokenIds().call({ from: accounts[0] });
            let parts= [];
            for (let i=1; i<= numberOfParts; i++) {
                const tokenURI = await contract?.methods.tokenURI(i).call({ from: accounts[0] });
                const part = JSON.parse(tokenURI);

                const partListingInfo = await contract?.methods.parts(i).call({ from: accounts[0] });
                part.isListed = partListingInfo.isListed;
                part.listedPrice = partListingInfo.listedPrice;
                part.id = i;

                parts.push(part);
            }
            const partsToBuy = parts.filter(p => p.isListed === true);
            setPartsToBuy(partsToBuy);
        } catch (err) {
            alert(err); 
        }
    };

    useEffect(() => {
        getPartsToBuy();
    }, [accounts, contract]);

    return (
        <Stack p={5}>
            <Typography variant="h4" sx={{ mb: 1.5 }}>Acheter une certification</Typography>
            { partsToBuy.length > 0 ? <PartsGrid parts={partsToBuy} getPartsToBuy={getPartsToBuy} /> : <span>Aucune pièce en vente</span> }
        </Stack>
    )
}