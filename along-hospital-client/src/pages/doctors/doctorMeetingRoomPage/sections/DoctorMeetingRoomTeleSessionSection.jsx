import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import useFetch from '@/hooks/useFetch'
import useMeetingSession from '@/hooks/useMeetingSession'
import useTranslation from '@/hooks/useTranslation'
import ChatSidebar from '@/pages/patients/meetingRoomPage/components/ChatSidebar'
import ControlBar from '@/pages/patients/meetingRoomPage/components/ControlBar'
import VideoContainer from '@/pages/patients/meetingRoomPage/components/VideoContainer'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorMeetingRoomTeleSessionSection = ({ doctorId }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [error, setError] = useState('')
	const [showChat, setShowChat] = useState(false)

	const { data: room, error: roomError } = useFetch(ApiUrls.TELE_ROOM.GET_BY_DOCTOR(doctorId), {}, [
		doctorId,
	])

	const {
		localVideoRef,
		remoteVideoRef,
		isMicOn,
		isCamOn,
		remoteMicOn,
		remoteCamOn,
		handleToggleMic,
		handleToggleCam,
		handleEndCall,
		messages,
		handleSendMessage,
	} = useMeetingSession({
		credentials: room?.credentials,
		transactionId: null,
		roomCode: room?.roomCode,
		isCaller: false,
		onError: () => setError(t('telehealth.error.session_not_ready')),
	})

	const [chatInput, setChatInput] = useState('')

	if (roomError || error) {
		return (
			<Paper variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
				<Typography color='error'>{error}</Typography>
			</Paper>
		)
	}

	const handleChatSend = () => {
		if (!chatInput.trim()) return
		handleSendMessage(chatInput)
		setChatInput('')
	}

	return (
		<Box>
			<Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
				<Stack sx={{ flex: 1 }}>
					<VideoContainer
						remoteVideoRef={remoteVideoRef}
						localVideoRef={localVideoRef}
						remoteMicOn={remoteMicOn}
						remoteCamOn={remoteCamOn}
						isMicOn={isMicOn}
						isCamOn={isCamOn}
					/>

					<ControlBar
						micOn={isMicOn}
						camOn={isCamOn}
						onToggleMic={handleToggleMic}
						onToggleCam={handleToggleCam}
						onToggleChat={() => setShowChat(!showChat)}
						onEndCall={async () => {
							await handleEndCall()
							navigate(routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.DASHBOARD), { replace: true })
						}}
					/>
				</Stack>
				<ChatSidebar
					show={showChat}
					messages={messages}
					chatInput={chatInput}
					setShow={setShowChat}
					setChatInput={setChatInput}
					onSend={handleChatSend}
				/>
			</Stack>
		</Box>
	)
}

export default DoctorMeetingRoomTeleSessionSection
