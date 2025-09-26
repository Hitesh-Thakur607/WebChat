import React from 'react'
import { Stack } from '@chakra-ui/react'
import { HStack } from '@chakra-ui/react'
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react"
const Chatloading = () => {
  return (
  <Stack gap="6" maxW="xs">
  <HStack width="full">
    <SkeletonCircle size="10" />
    <SkeletonText noOfLines={2} />
  </HStack>
  <Skeleton height="200px" />
</Stack>
  )
}

export default Chatloading
