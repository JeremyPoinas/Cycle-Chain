import React from "react";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";
import Typography from '@mui/material/Typography';
import PartsTable from "./Parts-list";
import EquipmentsGrid from "./Equipments-grid";
import { Divider } from "@mui/material";
import useEth from "../contexts/EthContext/useEth";


export default function Portfolio() {
	const { state: { contract, accounts } } = useEth();
    const [parts, setParts] = useState([]);

    // Get all equipments and update the associated state
    const getParts = async () => {
        try {
            let numberOfParts = await contract?.methods._tokenIds().call({ from: accounts[0] });
            let parts= [];
            for (let i=1; i<= numberOfParts; i++) {
                const tokenURI = await contract?.methods.tokenURI(i).call({ from: accounts[0] });
                const part = JSON.parse(tokenURI);

                const partListingInfo = await contract?.methods.parts(i).call({ from: accounts[0] });
                part.isListed = partListingInfo.isListed;
                part.listedPrice = partListingInfo.listedPrice;

                parts.push(part);
            }
            setParts(parts);
        } catch (err) {
            alert(err); 
        }
    };

    useEffect(() => {
        getParts();
    }, [accounts, contract]);

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

