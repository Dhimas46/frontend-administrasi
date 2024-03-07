'use client';
import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Flex, Text, Container, Card, Button } from '@chakra-ui/react';
import DataTable from 'react-data-table-component';
import Header from '../../components/Header';
import InitialFocus from "./InitialFocus";
import { ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import EditModal from './EditModal';
import axios from 'axios'; 

let endpoint = 'http://127.0.0.1:8000';

const Page = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [currentMonth, setCurrentMonth] = useState('');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(endpoint +'/api/penghuni');
            const responseData = await response.json();
            setData(responseData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handlePembayaran = (row) => {
        setSelectedRow(row);
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const now = new Date();
        const currentMonthName = monthNames[now.getMonth()];
        setCurrentMonth(currentMonthName);

        setIsPaymentModalOpen(true); 
    };

    const columns = [
        {
            name: 'Nama Lengkap',
            selector: row => row.nama_lengkap,
            sortable: true,
        },
        {
            name: 'Foto KTP',
            cell: (row) => {
                return <img src={`http://localhost:8000/uploads/penghuni/${row.foto_ktp}`} alt="Foto KTP" style={{ maxWidth: '100px' }} />;
            },
            sortable: false,
        },
        
        {
            name: 'Status Penghuni',
            selector: row => row.status_penghuni,
            sortable: true,
        },
        {
            name: 'Nomor Telepon',
            selector: row => row.nomor_telepon,
            sortable: true,
        },
        {
            name: 'Status Pernikahan',
            selector: row => row.status_pernikahan,
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

    const handleEdit = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true); // Buka modal edit
    };

    const handleCloseModal = () => {
        setSelectedRow(null);
        setIsModalOpen(false);
    };

    const reloadData = async () => {
        fetchData(); 
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            await axios.delete(endpoint +`/api/penghuni/delete/${selectedRow.id}`);
            await fetchData(); 
        } catch (error) {
            console.error('Error deleting data:', error);
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedRow(null);
        }
    };

    const handlePaymentModalClose = () => {
        setIsPaymentModalOpen(false);
    };

    return (
        <div>
            <Header />  
            <Container maxW="container.xl" py={8}>
                <Card p={6} boxShadow="md">
                    <Text>Penghuni</Text>
                    <Flex justify="flex-end">
                        <InitialFocus reloadData={reloadData} />
                    </Flex>
                    <DataTable
                        columns={columns}
                        data={data}
                        pagination
                    />
                </Card>
                {selectedRow && !isDeleteModalOpen && (
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

                {selectedRow && !isDeleteModalOpen && (
                    <Modal isOpen={isPaymentModalOpen} onClose={handlePaymentModalClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Pembayaran Bulanan - {currentMonth}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                {/* Tambahkan informasi pembayaran bulanan berdasarkan selectedRow di sini */}
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={handlePaymentModalClose}>
                                    Tutup
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                )}
            </Container>
        </div>
    );
};

export default Page;
