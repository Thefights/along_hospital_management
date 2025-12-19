import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import useFetch from '@/hooks/useFetch'
import useMeetingSession from '@/hooks/useMeetingSession'
import useTranslation from '@/hooks/useTranslation'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatSidebar from '../../components/ChatSidebar'
import ControlBar from '../../components/ControlBar'
import VideoContainer from '../../components/VideoContainer'

const PatientMeetingRoomTeleSessionSection = ({ transactionId }) => {
	const { t } = useTranslation()
	const nav = useNavigate()
	const [error, setError] = useState('')
	const [showChat, setShowChat] = useState(false)
	const isCaller = true

	const { data: session, error: sessionError } = useFetch(
		ApiUrls.TELE_SESSION.DETAIL(transactionId),
		{},
		[transactionId]
	)

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
		credentials: session?.credentials,
		transactionId,
		roomCode: null,
		isCaller,
		onError: () => setError(t('telehealth.error.session_not_ready')),
	})

	const [chatInput, setChatInput] = useState('')

	if (sessionError || error) {
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
							nav(
								routeUrls.BASE_ROUTE.PATIENT(
									routeUrls.PATIENT.APPOINTMENT.MEETING_ROOM_COMPLETE(transactionId)
								)
							)
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

export default PatientMeetingRoomTeleSessionSection
