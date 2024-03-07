'use client';

import React, { useState, useEffect } from 'react';
import { Textarea, Radio, RadioGroup, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Stack, useDisclosure, useToast, Select } from "@chakra-ui/react";
import axios from 'axios';

let endpoint = 'http://127.0.0.1:8000';

function InitialFocus({ reloadData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    alamatRumah: '',
    statusHunian: '',
    penghuni: '',
  });
  const [penghuniList, setPenghuniList] = useState([]); 

  useEffect(() => {
    fetchPenghuniList(); 
  }, []);

  const fetchPenghuniList = async () => {
    try {
        const response = await axios.get(`${endpoint}/api/penghuni`);
        const penghuniData = response.data.data;
        const historyPenghuniResponse = await axios.get(`${endpoint}/api/history/penghuni`);
        const historyPenghuniData = historyPenghuniResponse.data.data;
        const filteredPenghuniList = penghuniData.filter(penghuni => {
            return !historyPenghuniData.some(historyPenghuni => historyPenghuni.penghuni_id === penghuni.id && historyPenghuni.status === 1);
        });

        setPenghuniList(filteredPenghuniList); 
    } catch (error) {
        console.error('Error fetching penghuni:', error);
    }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${endpoint}/api/rumah/store`, formData);
      onClose();
      toast({
        title: 'Data berhasil disimpan.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      window.location.reload();
    } catch (error) {
      console.error('Error adding data:', error);
      toast({
        title: 'Gagal menyimpan data.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredPenghuniList = penghuniList.filter(penghuni => (
    penghuni.history_penghuni.length === 0 || 
    penghuni.history_penghuni.some(history => history.tanggal_selesai_hunian !== null) 
  ));

  return (
    <>
      <Button onClick={onOpen}>Tambah Rumah</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Rumah</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Alamat Rumah</FormLabel>
                <Textarea
                  value={formData.alamatRumah}
                  onChange={handleChange}
                  placeholder='Masukkan alamat rumah'
                  size='sm'
                  name="alamatRumah"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Status Penghuni</FormLabel>
                <RadioGroup value={formData.statusHunian} onChange={(value) => setFormData({ ...formData, statusHunian: value })}>
                  <HStack spacing={4}>
                    <Radio value="Dihuni">Dihuni</Radio>
                    <Radio value="Tidak dihuni">Tidak dihuni</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              {formData.statusHunian === 'Dihuni' && (
                <FormControl>
                  <FormLabel>Penghuni</FormLabel>
                  <Select
                    placeholder="Pilih penghuni"
                    value={formData.penghuni}
                    onChange={(e) => setFormData({ ...formData, penghuni: e.target.value })}
                  >
                    {filteredPenghuniList.map(penghuni => (
                      <option key={penghuni.id} value={penghuni.id}>{penghuni.nama_lengkap}</option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Simpan
            </Button>
            <Button onClick={onClose}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InitialFocus;
