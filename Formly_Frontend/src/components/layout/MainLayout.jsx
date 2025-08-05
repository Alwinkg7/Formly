import { Box, Flex } from '@chakra-ui/react';

export const MainLayout = ({ children }) => {
  return (
    <Box minHeight="100vh" bg="#f8fafc">
      {children}
    </Box>
  );
};