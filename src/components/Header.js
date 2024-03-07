// components/Header.js
import React from 'react';
import { Flex, Link } from '@chakra-ui/react';

const Header = () => {
  return (
    <Flex as="nav" align="center" justify="space-between" p={4} bg="blue.500" color="white">
      <Link href="/" _hover={{ textDecoration: 'none' }}>Home</Link>
      <Flex as="ul" listStyleType="none">
        <li>
          <Link href="/penghuni" _hover={{ textDecoration: 'none' }} m={2}>Kelola Penghuni</Link>
        </li>
        <li>
          <Link href="/rumah" _hover={{ textDecoration: 'none' }} m={2}>Kelola Rumah</Link>
        </li>
        <li>
          <Link href="/pembayaran" _hover={{ textDecoration: 'none' }} m={2}>Kelola Pembayaran</Link>
        </li>
      </Flex>
    </Flex>
  );
};

export default Header;
