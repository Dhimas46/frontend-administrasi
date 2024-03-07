'use client';

import React, { useState, useEffect } from 'react';
import { Card,Heading, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, useToast } from "@chakra-ui/react";
import axios from 'axios';

const PengeluaranModal = ({ reloadData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [pengeluaranList, setPengeluaranList] = useState([]);

  useEffect(() => {
      fetchPengeluaranList();
  }, []);

  const fetchPengeluaranList = async () => {
      try {
          const response = await axios.get('http://127.0.0.1:8000/api/pengeluaran');
          const pengeluaranData = response.data;
            console.log(pengeluaranData);
          setPengeluaranList(pengeluaranData);
      } catch (error) {
          console.error('Error fetching pengeluaran:', error);
          toast({
              title: "Error",
              description: "Gagal mengambil data pengeluaran.",
              status: "error",
              duration: 3000,
              isClosable: true,
          });
      }
  };

  const calculateTotalPengeluaran = (pengeluaranList) => {
    let total = 0;
    if (pengeluaranList && pengeluaranList.data) {
      pengeluaranList.data.forEach((pengeluaran) => {
        total += pengeluaran.jumlah_pengeluaran;
      });
    }
    return total;
  };
  
  const formatNumber = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };
  
  return (
      <>
          <Button onClick={onOpen}>Lihat Pengeluaran</Button>
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay />
              <ModalContent>
                  <ModalHeader>History Pengeluaran</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <div>
                    <p>Total Pengeluaran: {formatNumber(calculateTotalPengeluaran(pengeluaranList))}</p>
                    </div>
                    {Array.isArray(pengeluaranList.data) && pengeluaranList.data.map((pengeluaran, index) => (
                        <Card key={index} p={4} mb={4}>
                            <Heading as="h3" size="md">Jenis Pengeluaran: {pengeluaran.jenis_pengeluaran}</Heading>
                            <Text>Jumlah Pengeluaran: {formatNumber(pengeluaran.jumlah_pengeluaran)}</Text>
                            <Text>Tanggal Pengeluaran: {formatDate(pengeluaran.tanggal_pengeluaran)}</Text>

                        </Card>
                    ))}
                    </ModalBody>
                  <ModalFooter>
                         <Button onClick={onClose}>Batal</Button>
                  </ModalFooter>
              </ModalContent>
          </Modal>
      </>
  );
};

export default PengeluaranModal;
