'use client';

import { Box, Button, Flex, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toaster, Toaster } from '@/components/ui/toaster';

export default function SignUpPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Sign up failed');

			toaster.create({
				title: 'Account created',
				description: 'You can now log in.',
				type: 'success',
				duration: 3000,
				closable: true,
			});

			router.push('/login');
		} catch (err: any) {
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
			<Toaster />
			<Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
				<Box bg="white" p={8} rounded="xl" shadow="md" w="full" maxW="sm" textAlign="center">
					<Heading mb={6} fontSize="2xl" fontWeight="bold" color="teal.600">
						Flipmart Sign Up
					</Heading>
					<form onSubmit={handleSubmit}>
						<Stack gap={4}>
							<Input
								placeholder="Full Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
							<Input
								placeholder="Email address"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<Input
								placeholder="Password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<Button colorScheme="teal" type="submit" w="full">
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
		</>
	);
}
