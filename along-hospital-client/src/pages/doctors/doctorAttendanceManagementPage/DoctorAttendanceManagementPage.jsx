import ManageAttendanceBasePage from '@/components/basePages/manageAttendanceBasePage/ManageAttendanceBasePage'
import FaceCaptureDialog from '@/components/dialogs/FaceCaptureDialog'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import { Button, Stack } from '@mui/material'
import { useState } from 'react'

const DoctorAttendanceManagementPage = () => {
	const [filters, setFilters] = useState({})
	const [sort, setSort] = useState({ key: 'id', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [openFaceCapture, setOpenFaceCapture] = useState(false)
	const [checkMode, setCheckMode] = useState('CheckIn')

	const getMyAttendances = useFetch(
		ApiUrls.ATTENDANCE.STAFF_ATTENDANCE.INDEX,
		{ sort: `${sort.key} ${sort.direction}`, ...filters, page, pageSize },
		[sort, filters, page, pageSize]
	)

	const checkinAttendance = useAxiosSubmit({
		url: ApiUrls.ATTENDANCE.STAFF_ATTENDANCE.CHECK_IN,
		method: 'POST',
		onSuccess: async () => {
			await getMyAttendances.fetch()
		},
	})

	const checkoutAttendance = useAxiosSubmit({
		url: ApiUrls.ATTENDANCE.STAFF_ATTENDANCE.CHECK_OUT,
		method: 'POST',
		onSuccess: async () => {
			await getMyAttendances.fetch()
		},
	})

	const handleComplete = async (blobs) => {
		const formData = new FormData()
		formData.append('file', blobs[0], 'face.jpg')

		if (checkMode === 'CheckIn') {
			await checkinAttendance.submit(formData)
		} else if (checkMode === 'CheckOut') {
			await checkoutAttendance.submit(formData)
		}
	}

	return (
		<>
			<ManageAttendanceBasePage
				filters={filters}
				setFilters={setFilters}
				sort={sort}
				setSort={setSort}
				page={page}
				setPage={setPage}
				pageSize={pageSize}
				setPageSize={setPageSize}
				attendances={getMyAttendances.data?.collection ?? []}
				loading={getMyAttendances.loading}
				totalPage={getMyAttendances.data?.totalPage}
				buttons={
					<Stack direction='row' spacing={2}>
						<Button
							color='success'
							onClick={() => {
								setCheckMode('CheckIn')
								setOpenFaceCapture(true)
							}}
							loading={checkinAttendance.loading || checkoutAttendance.loading || getMyAttendances.loading}
							loadingPosition='start'
							variant='contained'
						>
							Check In
						</Button>
						<Button
							color='error'
							onClick={() => {
								setCheckMode('CheckOut')
								setOpenFaceCapture(true)
							}}
							loading={checkinAttendance.loading || checkoutAttendance.loading || getMyAttendances.loading}
							loadingPosition='start'
							variant='contained'
						>
							Check Out
						</Button>
					</Stack>
				}
			/>
			<FaceCaptureDialog
				open={openFaceCapture}
				onClose={() => setOpenFaceCapture(false)}
				mode='single'
				onCaptureComplete={(blobs) => handleComplete(blobs)}
			/>
		</>
	)
}

export default DoctorAttendanceManagementPage
