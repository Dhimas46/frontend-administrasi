'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";

const Details = ({ rowData, onClose }) => {
    const [penghuniData, setPenghuniData] = useState([]);
    const { isOpen, onOpen, onClose: closeModal } = useDisclosure();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/history/penghuni/details/${rowData.id}`);
                setPenghuniData(response.data.data);
                onOpen();
            } catch (error) {
                console.error('Error fetching penghuni data:', error);
            }
        };

        fetchData();
    }, [rowData, onOpen]); 


    // function getStatusPenghuni(item) {
    //     if (item.penghuni[0].status === 1) {
    //         return { text: 'Menghuni', color: 'green' };
    //     } else {
    //         if (item.tanggal_selesai_hunian) {
    //             const formattedDate = formatDate(item.tanggal_selesai_hunian);
    //             return { text: `Keluar: ${formattedDate}`, color: 'red' };
    //         } else {
    //             return { text: 'Menghuni', color: 'green' };
    //         }
    //     }
    // }
    
    function getStatusPenghuniColor(item) {
        if (item.penghuni[0].status === 1) {
            return 'green'; // Jika status penghuni adalah 1, warna hijau
        } else {
            return item.tanggal_selesai_hunian ? 'red' : 'green'; // Jika tanggal_selesai_hunian tidak null, warna merah, jika null, warna hijau
        }
    }
    function getStatusPenghuniText(item) {
        if (item.penghuni[0].status === 1) {
            return 'Menghuni';
        } else {
            if (item.tanggal_selesai_hunian) {
                const formattedDate = formatDate(item.tanggal_selesai_hunian);
                return `Keluar: ${formattedDate}`;
            } else {
                return 'Menghuni';
            }
        }
    }
    
    

    
    
    

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Detail Penghuni</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {penghuniData.length > 0 ? (
                        penghuniData.map((item, index) => (
                            <div key={index}>
                              <Flex justify="space-between" align="center">
                                        <p>Nama Lengkap: {item.penghuni[0].nama_lengkap}</p>
                                        <Badge colorScheme={getStatusPenghuniColor(item)}>
                                            {getStatusPenghuniText(item)}
                                        </Badge>
                                    </Flex>

                                <p>Status Penghuni: {item.penghuni[0].status_penghuni}</p>
                                <p>Nomor Telepon: {item.penghuni[0].nomor_telepon}</p>
                                <p>Status Pernikahan: {item.penghuni[0].status_pernikahan}</p>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>Belum ada penghuni.</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={closeModal}>Tutup</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Details;
