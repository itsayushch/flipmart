import { Box, Container, Grid, Stack, Text, Link, IconButton, Separator } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
	return (
		<Box bg="gray.800" color="white" pt={10} pb={6}>
			<Container maxW="container.xl">
				{/* Top Section */}
				<Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={8} mb={8}>
					{/* Company Info */}
					<Stack gap={3}>
						<Text fontSize="xl" fontWeight="bold" color="white">
							Flipmart
						</Text>
						<Text fontSize="sm" color="gray.400">
							Your one-stop online marketplace for fashion, electronics, and more.
						</Text>
					</Stack>

					{/* Quick Links */}
					<Stack gap={2}>
						<Text textTransform={'uppercase'} fontWeight="semibold" color="white">
							Quick Links
						</Text>
						<Link href="#" color="white">
							Home
						</Link>
						<Link href="#" color="white">
							Shop
						</Link>
						<Link href="#" color="white">
							About Us
						</Link>
						<Link href="#" color="white">
							Contact
						</Link>
					</Stack>

					{/* Customer Service */}
					<Stack gap={2}>
						<Text textTransform={'uppercase'} fontWeight="semibold" color="white">
							Customer Service
						</Text>
						<Link href="#" color="white">
							FAQs
						</Link>
						<Link href="#" color="white">
							Returns
						</Link>
						<Link href="#" color="white">
							Shipping
						</Link>
						<Link href="#" color="white">
							Support
						</Link>
					</Stack>

					{/* Follow Us */}
					<Stack gap={2}>
						<Text fontWeight="semibold" color="white">
							Follow Us
						</Text>
						<Stack direction="row" gap={4}>
							<IconButton
								as="a"
								// @ts-expect-error
								href="#"
								aria-label="Facebook"
								variant="ghost"
								color={'white'}
								_hover={{ bg: 'gray.700' }}
							>
								<FaFacebook />
							</IconButton>
							<IconButton
								as="a"
								// @ts-expect-error
								href="#"
								aria-label="Twitter"
								variant="ghost"
								color={'white'}
								_hover={{ bg: 'gray.700' }}
							>
								<FaTwitter />
							</IconButton>
							<IconButton
								as="a"
								// @ts-expect-error
								href="#"
								aria-label="Instagram"
								variant="ghost"
								color={'white'}
								_hover={{ bg: 'gray.700' }}
							>
								<FaInstagram />
							</IconButton>
							<IconButton
								as="a"
								// @ts-expect-error
								href="#"
								aria-label="YouTube"
								variant="ghost"
								color={'white'}
								_hover={{ bg: 'gray.700' }}
							>
								<FaYoutube />
							</IconButton>
						</Stack>
					</Stack>
				</Grid>

				{/* Separator */}
				<Separator borderColor="gray.700" mb={4} />

				{/* Bottom Section */}
				<Text fontSize="sm" textAlign="center" color="gray.500">
					© {new Date().getFullYear()} Flipmart. All rights reserved.
				</Text>
			</Container>
		</Box>
	);
}
