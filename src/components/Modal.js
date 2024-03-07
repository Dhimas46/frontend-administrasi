// components/Modal.js
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

const Modal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambah Data Penghuni</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Isi modal disini */}
          {/* Contoh: Form tambah data */}
          <form>
            {/* Input field */}
            <input type="text" placeholder="Nama" />
            <input type="number" placeholder="Usia" />
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Tutup
          </Button>
          <Button variant="ghost">Simpan</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Modal;
