'use client';

import React, { useState } from 'react';
import {HStack , Radio ,RadioGroup, InputLeftAddon, InputRightAddon, InputGroup, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Stack, useDisclosure, useToast, Image, Box } from "@chakra-ui/react";
import axios from 'axios';


let endpoint = 'http://127.0.0.1:8000';
function InitialFocus({ reloadData } ) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    namaLengkap: '',
    fotoKtp: null,
    statusPenghuni: '',
    nomorTelepon: '',
    statusPernikahan: '',
  });

  const handleChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      fotoKtp: file,
    }));
  };


  const handleSubmit = async () => {
    try {
        const formDataToSend = new FormData();
        formDataToSend.append('namaLengkap', formData.namaLengkap);
        formDataToSend.append('statusPenghuni', formData.statusPenghuni);
        formDataToSend.append('nomorTelepon', formData.nomorTelepon);
        formDataToSend.append('statusPernikahan', formData.statusPernikahan);
        formDataToSend.append('fotoKtp', formData.fotoKtp); 

        const response = await axios.post(endpoint+'/api/penghuni/store', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status !== 200) {
            throw new Error('Failed to update data');
        }

        onClose();
        toast({
            title: 'Data berhasil diperbarui.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        
    } catch (error) {
        toast({
            title: 'Gagal mengirim data.',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
};

  return (
    <>
      <Button onClick={onOpen}>Tambah Penghuni</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Penghuni</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Nama Lengkap</FormLabel>
                <Input
                  placeholder='Nama Lengkap'
                  name='namaLengkap'
                  value={formData.namaLengkap}
                  onChange={handleChange}
                />

              </FormControl>
              <FormControl>
                <label htmlFor="fotoKtp" className="block text-sm font-medium text-gray-700">Foto KTP</label>
                <div className="mt-1 flex items-center">
                  <input
                    id="fotoKtp"
                    type="file"
                    name="fotoKtp"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="sr-only"
                  />
                </div>
              </FormControl>
              <FormControl>
                <FormLabel>Status Penghuni</FormLabel>
                <RadioGroup value={formData.statusPenghuni} onChange={(value) => setFormData({ ...formData, statusPenghuni: value })}>
                  <HStack spacing={4}>
                    <Radio value="Kontrak">Kontrak</Radio>
                    <Radio value="Tetap">Tetap</Radio>
                  </HStack>
                </RadioGroup>

              </FormControl>

              <FormControl>
                <FormLabel>Nomor Telepon</FormLabel>
                <Input
                  placeholder='Nomor Telepon'
                  name='nomorTelepon'
                  value={formData.nomorTelepon}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Status Pernikahan</FormLabel>
                <RadioGroup value={formData.statusPernikahan}onChange={(value) => setFormData({ ...formData, statusPernikahan: value })}name="statusPernikahan">
                    <Stack direction="row">
                        <Radio value="Sudah Menikah">Sudah Menikah</Radio>
                        <Radio value="Belum Menikah">Belum Menikah</Radio>
                    </Stack>
                </RadioGroup>
            </FormControl>

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
