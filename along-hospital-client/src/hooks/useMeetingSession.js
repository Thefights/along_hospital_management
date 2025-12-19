import useMeetingSignalR from '@/hooks/useMeetingSignalR'
import useWebRtcPeer from '@/hooks/useWebRtcPeer'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Custom hook for managing WebRTC meeting session
 * @param {Object} config
 * @param {Object} config.credentials - ICE servers and SignalR config
 * @param {string} config.transactionId - Transaction ID (for patient)
 * @param {string} config.roomCode - Room code (for doctor)
 * @param {boolean} config.isCaller - Whether this is the caller (patient = true)
 * @param {Function} config.onError - Callback for errors
 * @param {Function} config.onLocalStream - Callback for local stream
 * @param {Function} config.onRemoteStream - Callback for remote stream
 */
const useMeetingSession = ({
	credentials,
	transactionId,
	roomCode,
	isCaller = false,
	onError,
	onLocalStream,
	onRemoteStream,
}) => {
	const localVideoRef = useRef(null)
	const remoteVideoRef = useRef(null)
	const remoteConnectionIdRef = useRef(null)

	const [hasRemoteParticipant, setHasRemoteParticipant] = useState(false)
	const [pendingOffer, setPendingOffer] = useState(null)
	const [isMicOn, setIsMicOn] = useState(true)
	const [isCamOn, setIsCamOn] = useState(true)
	const [remoteMicOn, setRemoteMicOn] = useState(true)
	const [remoteCamOn, setRemoteCamOn] = useState(true)
	const [messages, setMessages] = useState([])

	const iceServers = useMemo(() => credentials?.iceServers ?? [], [credentials])
	const signalRHubUrl = useMemo(() => credentials?.signalR?.hubUrl, [credentials])

	const handleLocalStream = useCallback(
		(stream) => {
			if (localVideoRef.current) {
				localVideoRef.current.srcObject = stream
			}
			onLocalStream?.(stream)
		},
		[onLocalStream]
	)

	const handleRemoteStream = useCallback(
		(stream) => {
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = stream
			}
			onRemoteStream?.(stream)
		},
		[onRemoteStream]
	)

	const {
		createOffer,
		createAnswer,
		setRemoteDescription,
		addIceCandidate,
		toggleAudio,
		toggleVideo,
		hangUp,
		renegotiate,
		resetForNewSession,
		clearRemoteStream,
		localStream,
	} = useWebRtcPeer({
		iceServers,
		onLocalStream: handleLocalStream,
		onRemoteStream: handleRemoteStream,
		onIceCandidate: (c) => sendIceCandidate(c),
	})

	const {
		sendOffer,
		sendAnswer,
		sendIceCandidate,
		notifyState,
		sendMessage,
		leaveSession,
		startConnection,
		stopConnection,
		joinedRoomCode,
	} = useMeetingSignalR({
		transactionId,
		roomCode,
		hubUrl: signalRHubUrl,
		onJoinSucceeded: () => {},
		onJoinFailed: () => {
			onError?.()
		},
		onParticipantJoined: (connectionId) => {
			remoteConnectionIdRef.current = connectionId
			setHasRemoteParticipant(true)
		},
		onParticipantLeft: (id) => {
			if (id === remoteConnectionIdRef.current) {
				setHasRemoteParticipant(false)
				remoteConnectionIdRef.current = null
				setRemoteMicOn(true)
				setRemoteCamOn(true)
				setPendingOffer(null)
				setMessages([])

				resetForNewSession()
				if (remoteVideoRef.current) {
					remoteVideoRef.current.srcObject = null
					remoteVideoRef.current.load()
				}
			}
		},
		onOffer: async (senderId, offer) => {
			if (!localStream) {
				setPendingOffer(offer)
				return
			}
			try {
				await setRemoteDescription(offer)
				const answer = await createAnswer()
				await sendAnswer(answer)
			} catch (error) {
				if (error.message?.includes('order of m-lines')) {
					setPendingOffer(offer)
				}
			}
		},
		onSessionExpired: () => {
			if (!isCaller) {
				return
			}

			if (localVideoRef.current) {
				localVideoRef.current.srcObject = null
				localVideoRef.current.load()
			}
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = null
				remoteVideoRef.current.load()
			}

			resetForNewSession()
			clearRemoteStream()
			remoteConnectionIdRef.current = null
			setHasRemoteParticipant(false)
			setPendingOffer(null)
			setRemoteMicOn(true)
			setRemoteCamOn(true)
			setMessages([])

			hangUp()
			leaveSession().catch((err) => console.error('[Meeting] Leave session error:', err))
		},
		onAnswer: async (senderId, answer) => {
			await setRemoteDescription(answer)
			setPendingOffer(null)
		},
		onIceCandidate: async (senderId, candidate) => {
			await addIceCandidate(candidate)
		},
		onStateUpdated: (senderId, state) => {
			if (typeof state?.micOn === 'boolean') setRemoteMicOn(state.micOn)
			if (typeof state?.camOn === 'boolean') setRemoteCamOn(state.camOn)
		},
		onMessage: (senderId, message) => {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now(),
					from: senderId,
					content: message,
					timestamp: new Date(),
					isOwn: false,
				},
			])
		},
	})

	useEffect(() => {
		if (!credentials || !signalRHubUrl) return
		startConnection()
		return () => stopConnection()
	}, [credentials, signalRHubUrl, startConnection, stopConnection])

	useEffect(() => {
		if (!isCaller) {
			return
		}
		if (!localStream) {
			return
		}
		if (!joinedRoomCode && !roomCode) {
			return
		}

		;(async () => {
			try {
				const offer = await createOffer()
				setPendingOffer(offer)
				await sendOffer(offer)
			} catch (e) {
				console.error('[Meeting] Create offer error:', e)
			}
		})()
	}, [localStream, joinedRoomCode, roomCode, isCaller, createOffer, sendOffer])

	useEffect(() => {
		if (!hasRemoteParticipant) return
		if (!isCaller) return
		if (!localStream) return
		if (!joinedRoomCode && !roomCode) return
		;(async () => {
			try {
				const offer = await createOffer()
				setPendingOffer(offer)
				await sendOffer(offer)
			} catch (e) {
				console.error('[Meeting] Re-offer error:', e)
			}
		})()
	}, [hasRemoteParticipant, isCaller, localStream, joinedRoomCode, roomCode, createOffer, sendOffer])

	useEffect(() => {
		if (!localStream) return
		if (isCaller) return
		if (!pendingOffer) return
		if (typeof pendingOffer !== 'object' || !pendingOffer.type) return
		;(async () => {
			try {
				await setRemoteDescription(pendingOffer)
				const answer = await createAnswer()
				await sendAnswer(answer)
				setPendingOffer(null)
			} catch (e) {
				console.error('[Meeting] Create answer error:', e)
			}
		})()
	}, [localStream, isCaller, pendingOffer, setRemoteDescription, createAnswer, sendAnswer])

	useEffect(() => {
		if (!hasRemoteParticipant) return
		if (isCaller) return
		if (pendingOffer) return
		if (!localStream) return

		const timer = setTimeout(async () => {
			try {
				const offer = await renegotiate()
				await sendOffer(offer)
			} catch (e) {
				console.error('[Meeting] Renegotiate fallback error:', e)
			}
		}, 2000)

		return () => clearTimeout(timer)
	}, [hasRemoteParticipant, isCaller, pendingOffer, localStream, renegotiate, sendOffer])

	const handleToggleMic = useCallback(() => {
		const next = !isMicOn
		setIsMicOn(next)
		toggleAudio()
		notifyState({ micOn: next })
	}, [isMicOn, toggleAudio, notifyState])

	const handleToggleCam = useCallback(async () => {
		const next = !isCamOn
		setIsCamOn(next)
		await toggleVideo()
		notifyState({ camOn: next })
		if (isCaller) {
			try {
				const offer = await renegotiate()
				await sendOffer(offer)
			} catch (e) {
				console.error('[Meeting] Camera toggle renegotiate error:', e)
			}
		}
	}, [isCamOn, toggleVideo, notifyState, isCaller, renegotiate, sendOffer])

	const handleSendMessage = useCallback(
		async (message) => {
			if (!message.trim()) return
			try {
				await sendMessage(message)
				setMessages((prev) => [
					...prev,
					{
						id: Date.now(),
						from: 'self',
						content: message,
						timestamp: new Date(),
						isOwn: true,
					},
				])
			} catch (error) {
				console.error('[Meeting] Send message error:', error)
			}
		},
		[sendMessage]
	)

	const handleEndCall = useCallback(async () => {
		try {
			await leaveSession()

			if (localVideoRef.current) {
				localVideoRef.current.srcObject = null
				localVideoRef.current.load()
			}
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = null
				remoteVideoRef.current.load()
			}

			hangUp()
		} catch (error) {
			console.error('[Meeting] End call error:', error)
		}
	}, [leaveSession, hangUp])

	return {
		localVideoRef,
		remoteVideoRef,
		isMicOn,
		isCamOn,
		remoteMicOn,
		remoteCamOn,
		hasRemoteParticipant,
		messages,
		handleToggleMic,
		handleToggleCam,
		handleEndCall,
		handleSendMessage,
	}
}

export default useMeetingSession
