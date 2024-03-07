'use client';

import React, { useState, useEffect } from 'react';
import { Flex, Text, Container, Card, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast, FormControl, FormLabel, Input, RadioGroup, Stack, Radio } from '@chakra-ui/react';
import DataTable from 'react-data-table-component';
import Header from '../../components/Header';
import axios from 'axios';
import InitialFocus from "./InitialFocus";
import Details from "./Details";
import Payment from "./Payment";
import EditModal from "./EditModal";
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';

const Page = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
   
    const toast = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/rumah');
            const responseData = await response.json();
            setData(responseData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEdit = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedRow(null);
        setIsModalOpen(false);
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setIsDeleteModalOpen(true);
    };

    const handleOpenPaymentModal = (row) => {
        setSelectedRow(row);
        setIsPaymentOpen(true); 
    };

    const handleClosePaymentModal = () => {
        setSelectedPaymentData(null);
        setIsPaymentOpen(false);
    };

    const handleDeleteConfirmation = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/rumah/delete/${selectedRow.id}`);
            await fetchData();
            toast({
                title: 'Data berhasil dihapus.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Gagal menghapus data.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedRow(null);
        }
    };
    const handleDetails = (row) => {
        setSelectedRow(row);
        setIsDetailsOpen(true); 
    };

    const columns = [
        {
            name: 'Details',
            cell: (row) => (
                <Flex justify="space-between">
                    <ViewIcon color="blue.500" onClick={() => handleDetails(row)} cursor="pointer" boxSize={6} />
                </Flex>
            ),
        },  
        {
            name: 'Pembayaran',
            cell: (row) => (
                <Flex justify="space-between">
                    <a href="#" onClick={() => handleOpenPaymentModal(row)}>asd</a>
                </Flex>
            ),
        }, 
        {
            name: 'Alamat Rumah',
            selector: row => row.alamat_rumah,
            sortable: true,
        },
        {
            name: 'Status Hunian',
            selector: row => row.status_hunian,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <Flex justify="space-between">
                    <EditIcon color="blue.500" onClick={() => handleEdit(row)} cursor="pointer" boxSize={6} />
                    <DeleteIcon color="red.500" onClick={() => handleDelete(row)} cursor="pointer" boxSize={6} />
                </Flex>
            ),
        },
    ];

    return (
        <div>
            <Header />  
            <Container maxW="container.xl" py={8}>
                <Card p={6} boxShadow="md">
                    <Text>Rumah</Text>
                    <Flex justify="flex-end">
                    <InitialFocus  />
                    </Flex>
                    <DataTable columns={columns} data={data} pagination />
                </Card>
                {selectedRow && (
                        <EditModal isOpen={isModalOpen} onClose={handleCloseModal} rowData={selectedRow} />
                    )}
                {isDeleteModalOpen && (
                    <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Konfirmasi Hapus</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                Apakah Anda yakin ingin menghapus data ini?
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="red" mr={3} onClick={handleDeleteConfirmation}>
                                    Hapus
                                </Button>
                                <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                )}
                 {isDetailsOpen && ( 
                    <Details rowData={selectedRow} onClose={() => setIsDetailsOpen(false)} />
                )}
                {isPaymentOpen && (
                    <Payment rowData={selectedRow} onClose={() => setIsPaymentOpen(false)} />
                )}
            </Container>
        </div>
    );
};

export default Page;
