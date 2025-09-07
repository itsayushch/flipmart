'use client';
import { Box, Flex, Image, Link, VStack, useBreakpointValue, HoverCard, Portal, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaRegUser, FaShoppingCart } from 'react-icons/fa';

// Component for navigation links to avoid repetition
const NavLink = ({ children, isNew = false }: { children: React.ReactNode; isNew?: boolean }) => (
	<Link
		px={2}
		py={1}
		rounded={'md'}
		_hover={{
			textDecoration: 'none',
			color: 'gray.900',
		}}
	>
		{children}
		{isNew && (
			<Box
				as="span"
				ml={1}
				px={1}
				py={0.5}
				bg="red.500"
				color="white"
				borderRadius="full"
				fontSize="xs"
				fontWeight="bold"
			>
				NEW
			</Box>
		)}
	</Link>
);

// Main Navbar component
export default function Navbar() {
	const Router = useRouter();
	// Check if the current view is a desktop or mobile device
	const isDesktop = useBreakpointValue({ base: false, md: true });
	const [open, setOpen] = useState(false);
	return (
		<Box
			as="nav"
			bg="white"
			color="gray.600"
			minH={'60px'}
			py={2}
			px={4}
			borderBottom={'1px'}
			borderStyle={'solid'}
			borderColor={'gray.200'}
			fontFamily="Inter, sans-serif"
		>
			<Flex alignItems="center">
				{/* Left section: Logo and Nav links */}
				<Flex flex={1} justify="start" alignItems="center">
					<Image
						rounded={'full'}
						src="/logo.png"
						alt="FlipMart Logo"
						boxSize="50px"
						_hover={{ cursor: 'pointer' }}
						objectFit="contain"
						onClick={() => Router.push('/')}
					/>
					{isDesktop && (
						<Flex ml={10} alignItems="center" gap={4} fontWeight="semibold" fontSize="sm">
							{['MEN', 'WOMEN', 'KIDS', 'HOME & LIVING', 'BEAUTY', 'STUDIO'].map((item) => (
								<NavLink key={item} isNew={item === 'STUDIO'}>
									<Text
										transition={'0.2s'}
										_hover={{ color: 'pink.500' }}
										onClick={() => Router.push('/products')}
										fontWeight="bold"
									>
										{item}
									</Text>
								</NavLink>
							))}
						</Flex>
					)}
				</Flex>

				<HoverCard.Root openDelay={200} closeDelay={200}>
					<HoverCard.Trigger></HoverCard.Trigger>
					<HoverCard.Content
						borderWidth="1px"
						borderColor="gray.200"
						borderRadius="md"
						boxShadow="lg"
						p={4}
						bg="white"
						width="250px"
						zIndex={50}
					></HoverCard.Content>
				</HoverCard.Root>
				{/* Right section: Icons with text and popover */}
				<Flex flex={1} justify="end" alignItems="center" gap={4}>
					{isDesktop ? (
						<Flex alignItems="center" gap={4} textAlign="center" fontSize="sm" fontWeight="semibold">
							<HoverCard.Root size="sm" open={open} openDelay={0} onOpenChange={(e) => setOpen(e.open)}>
								<HoverCard.Trigger asChild>
									<Link href="#" _hover={{ textDecoration: 'none' }}>
										<VStack
											p={2}
											rounded="lg"
											_hover={{ bg: 'gray.100' }}
											transitionProperty="background"
											transitionDuration="200ms"
										>
											<FaRegUser size="1.25em" />
											<Box>Profile</Box>
										</VStack>
									</Link>
								</HoverCard.Trigger>
								<Portal>
									<HoverCard.Positioner>
										<HoverCard.Content maxWidth="240px">
											<HoverCard.Arrow />
											<Box fontWeight="bold" fontSize="lg">
												Welcome
											</Box>
											<Box mt={1} mb={3} fontSize="sm" color="gray.500">
												To access account and manage orders.
											</Box>
											<Link
												href="#"
												display="block"
												width="100%"
												textAlign="center"
												py={2}
												borderWidth="1px"
												borderColor="pink.500"
												color="pink.500"
												rounded="md"
												fontWeight="semibold"
												fontSize="sm"
												_hover={{ bg: 'pink.500', color: 'white' }}
												transitionProperty="background"
												transitionDuration="200ms"
											>
												LOGIN / SIGNUP
											</Link>
											<VStack align="start" mt={4} gap={2} fontSize="sm" fontWeight="medium">
												<Link _hover={{ color: 'pink.500' }}>Orders</Link>
												<Link _hover={{ color: 'pink.500' }}>Wishlist</Link>
												<Link _hover={{ color: 'pink.500' }}>Gift Cards</Link>
												<Link _hover={{ color: 'pink.500' }}>Contact Us</Link>
												<Link _hover={{ color: 'pink.500' }}>
													FlipMart Insider{' '}
													<Box
														as="span"
														ml={1}
														px={1}
														py={0.5}
														bg="red.500"
														color="white"
														borderRadius="full"
														fontSize="xs"
														fontWeight="bold"
													>
														NEW
													</Box>
												</Link>
											</VStack>
											<Box as="hr" my={4} borderColor="gray.200" />
											<VStack align="start" gap={2} fontSize="sm" fontWeight="medium">
												<Link _hover={{ color: 'pink.500' }}>FlipMart Credit</Link>
												<Link _hover={{ color: 'pink.500' }}>Coupons</Link>
												<Link _hover={{ color: 'pink.500' }}>Saved Cards</Link>
												<Link _hover={{ color: 'pink.500' }}>Saved VPA</Link>
												<Link _hover={{ color: 'pink.500' }}>Saved Addresses</Link>
											</VStack>
										</HoverCard.Content>
									</HoverCard.Positioner>
								</Portal>
							</HoverCard.Root>

							<Link onClick={() => Router.push('/cart')} _hover={{ textDecoration: 'none' }}>
								<VStack
									p={2}
									rounded="lg"
									_hover={{ bg: 'gray.100' }}
									transitionProperty="background"
									transitionDuration="200ms"
								>
									<FaShoppingCart size="1.25em" />
									<Box>Cart</Box>
								</VStack>
							</Link>
						</Flex>
					) : (
						// Mobile view icons
						<Flex alignItems="center" gap={2} color="gray.500">
							<Link href="#" _hover={{ textDecoration: 'none' }}>
								<Box p={2} rounded="full" _hover={{ bg: 'gray.100' }}>
									<FaRegUser size="1.5em" />
								</Box>
							</Link>

							<Box p={2} rounded="full" _hover={{ bg: 'gray.100' }}>
								<FaShoppingCart onClick={() => Router.push('/cart')} size="1.5em" />
							</Box>
						</Flex>
					)}
				</Flex>
			</Flex>
		</Box>
	);
}
