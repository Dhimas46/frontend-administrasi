'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, useToast } from "@chakra-ui/react";

const Payment = ({ rowData, onClose }) => {
    const [paymentData, setPaymentData] = useState([]);
    const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/history/penghuni/pembayaran/${rowData.id}`);
                setPaymentData(response.data.data);
            } catch (error) {
                console.log(error)
            }
        };
        fetchData();
        onOpen();   
    }, [rowData, onOpen, toast]); 
    
    function getStatusPenghuniColor(item) {
        if (item.penghuni[0].status === 1) {
            return 'green'; 
        } else {
            return item.tanggal_selesai_hunian ? 'red' : 'green'; 
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
                <ModalHeader>Detail Pembayaran</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                        {paymentData.length > 0 ? (
                            <ul>
                                {paymentData.map(item => (
                                    <div key={item.id}>
                                           <Flex justify="space-between" align="center">
                                           <p>Nama Penghuni : {item.penghuni.nama_lengkap}</p> 
                                           <Badge colorScheme={item.status_pembayaran === 'Belum Lunas' ? 'red' : 'green'}>
                                            {item.status_pembayaran}
                                            </Badge>
                                            </Flex>
                                        <p>Tanggal Pembayaran : {item.tanggal_pembayaran}</p> 
                                        <p>Jenis Iuran : {item.jenis_iuran}</p> 
                                        <p>Jumlah Pembayaran : {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.jumlah_pembayaran)}</p>
                                       
                                        <br />
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <p>Belum ada riwayat pembayaran.</p>
                        )}
                    </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={closeModal}>Tutup</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Payment;
