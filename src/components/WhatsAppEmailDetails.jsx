import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { EmailWhatsAppDetailsService } from '../services/emailWhatsappdetails.service'
function WhatsAppEmailDetails() {
    const [allDetails, setAllDetails] = useState({
        setUpEmail: {},
        setUpWhatsapp: {},
        skipDays: [],
        skipDates: []
    });
    useEffect(() => {
        (async () => {
            const response = await EmailWhatsAppDetailsService();
            const data = response.data;
            if (data.success == true) {
                const user = data.user;
                const emailSetUp = user.emailSetup;
                const waSetUp = user.waSetup;
                const skipDates = user.skipDates;
                const skipDays = user.skipDays;
                setAllDetails(() => {
                    return {
                        setUpEmail: emailSetUp,
                        setUpWhatsapp: waSetUp,
                        skipDays: skipDays,
                        skipDates: skipDates
                    }
                })
            }
        })();
    }, [allDetails])
    return (
        <Grid container spacing={1} >
            <Grid item xs={12} md={11.5} sm={12} >
                <TableContainer >
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontFamily: "roboto" }}>Email Id</TableCell>
                                <TableCell sx={{ fontFamily: "roboto" }}>{allDetails.setUpEmail?.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontFamily: "roboto" }}>WhatsApp API</TableCell>
                                <TableCell sx={{ fontFamily: "roboto" }}>{allDetails.setUpWhatsapp?.username}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontFamily: "roboto" }}>WhatsApp Password</TableCell>
                                <TableCell sx={{ fontFamily: "roboto" }}>{allDetails.setUpWhatsapp?.password}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontFamily: "roboto" }}>Skip Days</TableCell>
                                <TableCell sx={{ fontFamily: "roboto" }}>
                                    {
                                        allDetails.skipDays.map((day, index) => {
                                            return <span>{day} {allDetails.skipDays.length - 1 == index ? '' : ','}</span>
                                        })
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontFamily: "roboto" }}>Skip Dates</TableCell>
                                <TableCell sx={{ fontFamily: "roboto" }}>
                                    {
                                        allDetails.skipDates.map((day, index) => {
                                            return <span>{day} {allDetails.skipDates.length - 1 == index ? '' : ','}</span>
                                        })
                                    }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}

export default WhatsAppEmailDetails