import useTranslation from '@/hooks/useTranslation'
import { EmojiEvents, LocalHospital, People, TrendingUp } from '@mui/icons-material'
import { Box, Container, Grid, Stack, Typography, useTheme } from '@mui/material'
import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const MotionStack = motion(Stack)

const StatisticsSection = () => {
	const { t } = useTranslation()
	const theme = useTheme()
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, amount: 0.3 })

	const statistics = [
		{
			key: 'doctors',
			icon: <LocalHospital sx={{ fontSize: 48 }} />,
			value: 350,
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		},
		{
			key: 'patients',
			icon: <People sx={{ fontSize: 48 }} />,
			value: 50,
			gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
		},
		{
			key: 'surgeries',
			icon: <TrendingUp sx={{ fontSize: 48 }} />,
			value: 5000,
			gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
		},
		{
			key: 'awards',
			icon: <EmojiEvents sx={{ fontSize: 48 }} />,
			value: 25,
			gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
		},
	]

	return (
		<Box
			ref={ref}
			sx={{
				py: { xs: 6, md: 10 },
				background: theme.palette.gradients.calm,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Background Pattern */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.03,
					backgroundImage: `repeating-linear-gradient(
						45deg,
						transparent,
						transparent 35px,
						${theme.palette.primary.main} 35px,
						${theme.palette.primary.main} 70px
					)`,
				}}
			/>

			<Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
				{/* Header */}
				<Stack spacing={2} alignItems='center' textAlign='center' mb={8}>
					<Typography variant='h3' fontWeight={700}>
						{t('home.statistics.title')}
					</Typography>
					<Typography variant='h6' color='text.secondary' maxWidth={600}>
						{t('home.statistics.subtitle')}
					</Typography>
				</Stack>

				{/* Statistics Grid */}
				<Grid container spacing={4}>
					{statistics.map((stat, index) => (
						<Grid item size={{ xs: 6, md: 3 }} key={stat.key}>
							<MotionStack
								spacing={2}
								alignItems='center'
								textAlign='center'
								initial={{ opacity: 0, scale: 0.8 }}
								animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								sx={{
									p: 4,
									borderRadius: 3,
									background:
										theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
									border: `1px solid ${theme.palette.divider}`,
									backdropFilter: 'blur(10px)',
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateY(-8px)',
										boxShadow: theme.shadows[12],
										background:
											theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)',
										'& .stat-icon': {
											background: stat.gradient,
											transform: 'scale(1.1) rotate(360deg)',
										},
										'& .stat-icon-inner': {
											color: 'white',
										},
									},
								}}
							>
								{/* Icon */}
								<Box
									className='stat-icon'
									sx={{
										width: 80,
										height: 80,
										borderRadius: '20px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
										transition: 'all 0.5s ease',
									}}
								>
									<Box
										className='stat-icon-inner'
										sx={{
											color: 'primary.main',
											display: 'flex',
											transition: 'all 0.3s ease',
										}}
									>
										{stat.icon}
									</Box>
								</Box>

								{/* Counter */}
								<Stack direction='row' alignItems='baseline' spacing={0.5}>
									<Typography
										variant='h2'
										fontWeight={700}
										sx={{
											background: stat.gradient,
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
										}}
									>
										<CountUp end={stat.value} isInView={isInView} />
									</Typography>
									<Typography variant='h4' fontWeight={600} color='text.secondary'>
										{t(`home.statistics.items.${stat.key}.suffix`)}
									</Typography>
								</Stack>

								{/* Label */}
								<Typography variant='body1' color='text.secondary' fontWeight={500}>
									{t(`home.statistics.items.${stat.key}.title`)}
								</Typography>
							</MotionStack>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	)
}

// Counter Animation Component
const CountUp = ({ end, isInView }) => {
	const [count, setCount] = useState(0)

	useEffect(() => {
		if (!isInView) return

		let startTime
		const duration = 2000
		const startValue = 0

		const animate = (currentTime) => {
			if (!startTime) startTime = currentTime
			const progress = Math.min((currentTime - startTime) / duration, 1)

			setCount(Math.floor(progress * (end - startValue) + startValue))

			if (progress < 1) {
				requestAnimationFrame(animate)
			}
		}

		requestAnimationFrame(animate)
	}, [end, isInView])

	return <>{count}</>
}

export default StatisticsSection
