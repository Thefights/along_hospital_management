/* eslint-disable react-hooks/exhaustive-deps */
import * as signalR from '@microsoft/signalr'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const useMeetingSignalR = ({
	transactionId,
	roomCode,
	hubUrl,
	onJoinSucceeded,
	onJoinFailed,
	onParticipantJoined,
	onParticipantLeft,
	onOffer,
	onAnswer,
	onIceCandidate,
	onStateUpdated,
	onSessionExpired,
	onMessage,
}) => {
	const connectionRef = useRef(null)
	const startedRef = useRef(false)
	const callbacksRef = useRef({})

	useEffect(() => {
		callbacksRef.current = {
			onJoinSucceeded,
			onJoinFailed,
			onParticipantJoined,
			onParticipantLeft,
			onOffer,
			onAnswer,
			onIceCandidate,
			onStateUpdated,
			onSessionExpired,
			onMessage,
		}
	}, [
		onJoinSucceeded,
		onJoinFailed,
		onParticipantJoined,
		onParticipantLeft,
		onOffer,
		onAnswer,
		onIceCandidate,
		onStateUpdated,
		onSessionExpired,
		onMessage,
	])

	const resolvedHubUrl = useMemo(() => hubUrl, [hubUrl])
	const [joinedRoomCode, setJoinedRoomCode] = useState(null)

	const buildConnection = useCallback(() => {
		const conn = new signalR.HubConnectionBuilder()
			.withUrl(resolvedHubUrl, {
				transport: signalR.HttpTransportType.WebSockets,
				skipNegotiation: true,
			})
			.configureLogging(signalR.LogLevel.Information)
			.build()

		conn.on('JoinSucceeded', (payload) => {
			const room = payload.roomCode ?? payload.RoomCode
			setJoinedRoomCode(room)

			const existingParticipants = payload.existingParticipants || payload.ExistingParticipants || []

			if (existingParticipants.length > 0) {
				existingParticipants.forEach((participantId) => {
					callbacksRef.current.onParticipantJoined?.(participantId)
				})
			}

			callbacksRef.current.onJoinSucceeded?.(payload)
		})

		conn.on('JoinFailed', (err) => {
			callbacksRef.current.onJoinFailed?.(err)
		})

		conn.on('ParticipantJoined', (connId) => {
			const id = typeof connId === 'string' ? connId : connId?.connectionId || connId?.ConnectionId
			callbacksRef.current.onParticipantJoined?.(id)
		})

		conn.on('ParticipantLeft', (connId) => {
			const id = typeof connId === 'string' ? connId : connId?.connectionId || connId?.ConnectionId
			callbacksRef.current.onParticipantLeft?.(id)
		})

		conn.on('SessionExpired', () => {
			callbacksRef.current.onSessionExpired?.()
		})
		conn.on('ReceiveOffer', ({ from, offer }) => {
			callbacksRef.current.onOffer?.(from, offer)
		})

		conn.on('ReceiveAnswer', ({ from, answer }) => {
			callbacksRef.current.onAnswer?.(from, answer)
		})

		conn.on('ReceiveIceCandidate', ({ from, candidate }) => {
			callbacksRef.current.onIceCandidate?.(from, candidate)
		})

		conn.on('StateUpdated', ({ from, state }) => {
			callbacksRef.current.onStateUpdated?.(from, state)
		})

		conn.on('ReceiveMessage', ({ from, message }) => {
			callbacksRef.current.onMessage?.(from, message)
		})
		return conn
	}, [resolvedHubUrl])

	const startConnection = useCallback(async () => {
		if (startedRef.current) return
		if (!resolvedHubUrl) return

		startedRef.current = true

		if (!connectionRef.current) {
			connectionRef.current = buildConnection()
		}

		if (connectionRef.current.state === signalR.HubConnectionState.Disconnected) {
			await connectionRef.current.start()
			await connectionRef.current.invoke('JoinSession', transactionId || null, roomCode || null)
		}
	}, [buildConnection, resolvedHubUrl, transactionId, roomCode])

	const stopConnection = useCallback(async () => {
		const conn = connectionRef.current
		startedRef.current = false

		if (conn && conn.state !== signalR.HubConnectionState.Disconnected) {
			await conn.stop()
		}

		connectionRef.current = null
		setJoinedRoomCode(null)
	}, [])

	useEffect(() => {
		if (!hubUrl) return

		startConnection()

		return () => {
			stopConnection()
		}
	}, [hubUrl])

	const sendOffer = useCallback(
		async (offer) => {
			if (!connectionRef.current || !joinedRoomCode) return
			await connectionRef.current.invoke('SendOffer', joinedRoomCode, offer)
		},
		[joinedRoomCode]
	)

	const sendAnswer = useCallback(
		async (answer) => {
			if (!connectionRef.current || !joinedRoomCode) return
			await connectionRef.current.invoke('SendAnswer', joinedRoomCode, answer)
		},
		[joinedRoomCode]
	)

	const sendIceCandidate = useCallback(
		async (candidate) => {
			if (!connectionRef.current || !joinedRoomCode) return
			await connectionRef.current.invoke('SendIceCandidate', joinedRoomCode, candidate)
		},
		[joinedRoomCode]
	)

	const notifyState = useCallback(
		async (state) => {
			if (!connectionRef.current || !joinedRoomCode) return
			await connectionRef.current.invoke('NotifyState', joinedRoomCode, state)
		},
		[joinedRoomCode]
	)

	const sendMessage = useCallback(
		async (message) => {
			if (!connectionRef.current || !joinedRoomCode) return
			await connectionRef.current.invoke('SendMessage', joinedRoomCode, message)
		},
		[joinedRoomCode]
	)

	const leaveSession = useCallback(async () => {
		if (!connectionRef.current) return
		try {
			await connectionRef.current.invoke('LeaveSession')
			await new Promise((resolve) => setTimeout(resolve, 100))
		} finally {
			await stopConnection()
		}
	}, [stopConnection])

	return {
		sendOffer,
		sendAnswer,
		sendIceCandidate,
		notifyState,
		sendMessage,
		leaveSession,
		startConnection,
		stopConnection,
		joinedRoomCode,
	}
}

export default useMeetingSignalR
