'use client';

import { Box, Button, Flex, Heading, Input, Stack, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toaster, Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUser } from '@/context/UserContext';

export default function SignUpPage() {
	const { user, isLoaded } = useUser();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		if (isLoaded && user) {
			router.push('/');
		}
	}, [isLoaded, user, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Sign up failed');

			setLoading(false);

			toaster.create({
				title: 'Account created',
				description: 'You can now log in.',
				type: 'success',
				duration: 3000,
				closable: true,
			});

			router.push('/login');
		} catch (err: any) {
			setLoading(false);
			toaster.create({
				title: 'Error',
				description: err.message,
				type: 'error',
				duration: 3000,
				closable: true,
			});
		}
	};

	return (
		<>
		<Navbar />
			<Toaster />
			<Stack minH={'80vh'} direction={{ base: 'column', md: 'row' }} bg={'gray.50'}>
				<Flex flex={1} align={'center'} justify={'center'} minH="80vh">
					<Box  w="full" maxW="xl" textAlign="center">
						<Heading fontWeight={'bolder'} color={'teal'} size="3xl" mb={8} textAlign="center">
							Register at Flipmart
						</Heading>
						<form onSubmit={handleSubmit}>
							<Stack gap={4}>
								<Input
									placeholder="Full Name"
									value={name}
									rounded={'xs'}
									onChange={(e) => setName(e.target.value)}
									required
								/>
								<Input
									placeholder="Email address"
									type="email"
									rounded={'xs'}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<Input
									placeholder="Password"
									type="password"
									rounded={'xs'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<Button rounded={'xs'} colorPalette="pink" type="submit" w="full" disabled={loading} loading={loading}>
									Create Account
								</Button>
							</Stack>
						</form>
						<Text fontSize="sm" mt={4} color="gray.600">
							Already have an account?{' '}
							<Button variant="plain" colorPalette="teal" onClick={() => router.push('/login')}>
								Sign in
							</Button>
						</Text>
					</Box>
				</Flex>
				<Flex flex={1} display={{ base: 'none', md: 'flex' }}>
					<Image
						alt={'Login Image'}
						objectFit={'cover'}
						src={
							'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
						}
					/>
				</Flex>
			</Stack>
			<Footer />
		</>
	);
}
