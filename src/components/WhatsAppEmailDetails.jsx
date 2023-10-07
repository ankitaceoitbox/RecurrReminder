import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { EmailWhatsAppDetailsService } from '../services/emailWhatsappdetails.service'
function WhatsAppEmailDetails() {
    const arr = [["Email", "whatsapp"], ["Email 1", "whatsapp 1"], ["Email 2", "whatsapp 2"], ["Email 3", "whatsapp 3"], ["Email 4", "whatsapp 4"],
    ];
    const [allDetails, setAllDetails] = useState({
        setUpEmail: {},
        setUpWhatsapp: {},
        skipDays: [],
        skipDates: []
    });
    useEffect(() => {
        (async () => {
            const response = await EmailWhatsAppDetailsService();
            console.log(response);
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
                                <TableCell>Email Id</TableCell>
                                <TableCell>{allDetails.setUpEmail?.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>WhatsApp API</TableCell>
                                <TableCell>{allDetails.setUpWhatsapp?.username}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>WhatsApp Password</TableCell>
                                <TableCell>{allDetails.setUpWhatsapp?.password}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Skip Days</TableCell>
                                <TableCell>
                                    {
                                        allDetails.skipDays.map((day, index) => {
                                            return <span>{day} {allDetails.skipDays.length - 1 == index ? '' : ','}</span>
                                        })
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Skip Dates</TableCell>
                                <TableCell>
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