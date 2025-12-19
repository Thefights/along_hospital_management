import FaceCaptureDialog from '@/components/dialogs/FaceCaptureDialog'
import { ApiUrls } from '@/configs/apiUrls'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import Face6Icon from '@mui/icons-material/Face6'
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Container,
	Grid,
	Stack,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const StaffIdentificationEnrollPage = () => {
	const [openCapture, setOpenCapture] = useState(false)
	const [error, setError] = useState('')

	const navigate = useNavigate()
	const { auth, getReturnUrlByRole } = useAuth()

	const checkIdentificationExist = useFetch(ApiUrls.STAFF_RECOGNIZATION.CHECK_EXIST)
	const enrollFace = useAxiosSubmit({
		url: ApiUrls.STAFF_RECOGNIZATION.ENROLL,
		method: 'POST',
	})

	const handleOpenCapture = () => {
		setOpenCapture(true)
	}

	const handleCaptureComplete = async (blobs) => {
		setError('')
		const formData = new FormData()
		blobs.forEach((blob, index) => {
			formData.append('images', blob, `face_${index + 1}.jpg`)
		})

		await enrollFace.submit(formData)
		navigate(getReturnUrlByRole(auth?.role))
	}

	if (checkIdentificationExist.data) {
		navigate(getReturnUrlByRole(auth?.role))
	}

	return (
		<Container maxWidth='md' sx={{ py: 4 }}>
			<Stack spacing={3}>
				<Stack direction='row' alignItems='center' spacing={1}>
					<Face6Icon fontSize='large' />
					<Box>
						<Typography variant='h5' fontWeight={600}>
							Face enrollment
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							Allow the system to recognize you at check-in and check-out using your face.
						</Typography>
					</Box>
				</Stack>

				<Grid container spacing={3}>
					<Grid size={{ xs: 12, md: 7 }}>
						<Card>
							<CardContent>
								<Stack spacing={2}>
									<Stack direction='row' alignItems='center' justifyContent='space-between'>
										<Typography variant='subtitle1' fontWeight={600}>
											Your current status
										</Typography>
										{<Chip label={checkIdentificationExist.loading ? 'Checking...' : 'Not enrolled'} />}
									</Stack>

									<Box>
										<Typography variant='body2' color='text.secondary'>
											Face enrollment helps the system verify that it is really you when you perform actions
											such as attendance check-in and check-out. Your face images are used only for recognition
											purposes inside the system.
										</Typography>
									</Box>

									<Stack direction='row' spacing={2} alignItems='center'>
										<Button
											variant='contained'
											startIcon={<CameraAltIcon />}
											onClick={handleOpenCapture}
											disabled={checkIdentificationExist.loading || enrollFace.loading}
										>
											Start face enrollment
										</Button>
										{enrollFace.loading && (
											<Stack direction='row' spacing={1} alignItems='center'>
												<CircularProgress size={18} />
												<Typography variant='body2'>Processing captured images...</Typography>
											</Stack>
										)}
									</Stack>

									{error && (
										<Typography variant='body2' color='error'>
											{error}
										</Typography>
									)}

									<Box
										sx={{
											mt: 1,
											p: 1.5,
											borderRadius: 1.5,
											bgcolor: (theme) =>
												theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
										}}
									>
										<Typography variant='caption' color='text.secondary'>
											You can re-enroll your face at any time if you feel that the system does not recognize
											you accurately.
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{ xs: 12, md: 5 }}>
						<Card sx={{ height: '100%' }}>
							<CardContent>
								<Typography variant='subtitle1' fontWeight={600} mb={1}>
									How it works
								</Typography>
								<Stack spacing={1.5}>
									<Box>
										<Typography variant='body2' fontWeight={500}>
											1. Face capture
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											When you start, the camera will capture your face for a short period of time to create a
											richer dataset.
										</Typography>
									</Box>
									<Box>
										<Typography variant='body2' fontWeight={500}>
											2. Local processing
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											The system converts your face images into numerical representations and stores them
											securely on the server.
										</Typography>
									</Box>
									<Box>
										<Typography variant='body2' fontWeight={500}>
											3. Recognition
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											Later, when you check in or check out, a single photo is compared against this dataset to
											verify your identity.
										</Typography>
									</Box>
								</Stack>

								<Box
									sx={{
										mt: 2,
										p: 2,
										borderRadius: 2,
										border: (theme) => `1px dashed ${theme.palette.divider}`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										textAlign: 'center',
									}}
								>
									<Typography variant='body2' color='text.secondary'>
										This area can be replaced later with an illustration or short animation that explains face
										enrollment.
									</Typography>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Stack>

			<FaceCaptureDialog
				open={openCapture}
				onClose={() => setOpenCapture(false)}
				mode='burst'
				durationSeconds={5}
				onCaptureComplete={handleCaptureComplete}
			/>
		</Container>
	)
}

export default StaffIdentificationEnrollPage
